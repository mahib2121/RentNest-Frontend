import type { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyToken } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];

// Browsing listings is open to everyone — the home page, the listing table
// and the property detail pages are the public entry point.
const PUBLIC_ROUTES = [
  "/",
  "/properties",
  "/payment",
  "/news",
  // Crawlers need to be able to read robots.txt to be told what to skip.
  "/robots.txt",
  "/sitemap.xml",
  // The not-found page is where an anonymous visitor is sent when a route
  // is refused. It has to be reachable without a session.
  "/not-found",
];

const ROLE_DASHBOARDS: Record<string, string> = {
  TENANT: "/tenant-dashboard",
  LANDLORD: "/landlord-dashboard",
  ADMIN: "/admin-dashboard",
};

// Each dashboard is reachable only by its own role.
const ROLE_PROTECTED_ROUTES: Record<string, string> = {
  TENANT: "/tenant-dashboard",
  LANDLORD: "/landlord-dashboard",
  ADMIN: "/admin-dashboard",
};

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const ACCESS_MAX_AGE = 60 * 60 * 24; // 1 day

/**
 * Ask the backend for a fresh access token.
 *
 * The proxy cannot rely on `cookies()` for this — it has to read the
 * incoming request's cookie header and pass it along explicitly.
 */
async function requestNewAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const apiUrl = process.env.APIurl?.replace(/\/$/, "");

  if (!apiUrl) {
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/api/auth/refresh-token`, {
      method: "POST",
      headers: { Cookie: `${REFRESH_COOKIE}=${refreshToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const result = (await res.json()) as {
      success?: boolean;
      data?: { accessToken?: string };
    };

    return result.success ? (result.data?.accessToken ?? null) : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  // --------------------------------------------------
  // Verify the access token
  // --------------------------------------------------

  const decodedAccessToken = verifyToken(accessToken, accessSecret);

  // `currentAccessToken` only ever holds a token we have verified. Holding an
  // unverified one here would make `isSignedIn` true for a stale or tampered
  // cookie and route the visitor somewhere they cannot actually reach.
  let currentAccessToken: string | null = null;
  let userRole: string | null = null;
  let setAccessToken: string | null = null;
  let clearAccessToken = false;

  if (decodedAccessToken.success && decodedAccessToken.data) {
    currentAccessToken = accessToken ?? null;
    userRole = (decodedAccessToken.data as JwtPayload).role ?? null;
  } else {
    // The access token is missing, expired, or was signed with an older
    // secret. Try to recover with the refresh token before signing out.
    const decodedRefreshToken = verifyToken(refreshToken, refreshSecret);

    if (decodedRefreshToken.success && refreshToken) {
      const newAccessToken = await requestNewAccessToken(refreshToken);

      if (newAccessToken) {
        const verified = verifyToken(newAccessToken, accessSecret);

        if (verified.success) {
          currentAccessToken = newAccessToken;
          setAccessToken = newAccessToken;
          userRole = (verified.data as JwtPayload).role ?? null;
        } else {
          // The backend handed back a token we cannot trust — drop the
          // session rather than treating the user as signed in.
          clearAccessToken = true;
        }
      } else {
        // The refresh token is spent or rejected — drop it.
        clearAccessToken = true;
      }
    } else if (accessToken) {
      // A token exists but no usable refresh token — clear the bad cookie
      // so the next request starts clean.
      clearAccessToken = true;
    }
  }

  // --------------------------------------------------
  // Route helpers
  // --------------------------------------------------

  const isRoute = (routes: string[]) =>
    routes.some(
      (route) =>
        pathname === route ||
        (route !== "/" && pathname.startsWith(`${route}/`)),
    );

  const isPublicRoute = isRoute(PUBLIC_ROUTES);
  const isAuthRoute = isRoute(AUTH_ROUTES);
  const isSignedIn = Boolean(currentAccessToken);

  // --------------------------------------------------
  // Build the response, carrying any cookie changes
  // --------------------------------------------------

  const applyCookies = (response: NextResponse) => {
    if (setAccessToken) {
      response.cookies.set(ACCESS_COOKIE, setAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_MAX_AGE,
        sameSite: "lax",
        path: "/",
      });
    }

    if (clearAccessToken) {
      // The session is dead — drop both cookies so the next request starts
      // from a clean slate instead of retrying the same rejected token.
      response.cookies.delete(ACCESS_COOKIE);
      response.cookies.delete(REFRESH_COOKIE);
    }

    return response;
  };

  // --------------------------------------------------
  // Logged-in user trying to access login/register
  // --------------------------------------------------

  if (isSignedIn && isAuthRoute) {
    const dashboard = userRole ? ROLE_DASHBOARDS[userRole] : "/";

    return applyCookies(
      NextResponse.redirect(new URL(dashboard, request.url)),
    );
  }

  // --------------------------------------------------
  // Protect authenticated routes
  // --------------------------------------------------

  if (!isSignedIn && !isPublicRoute && !isAuthRoute) {
    return applyCookies(
      NextResponse.redirect(new URL("/login", request.url)),
    );
  }

  // --------------------------------------------------
  // Role-based authorization
  // --------------------------------------------------

  const protectedRole = Object.entries(ROLE_PROTECTED_ROUTES).find(
    ([, route]) =>
      pathname === route || pathname.startsWith(`${route}/`),
  );

  if (protectedRole && isSignedIn) {
    const [requiredRole] = protectedRole;

    if (userRole !== requiredRole) {
      return applyCookies(
        NextResponse.redirect(new URL("/not-found", request.url)),
      );
    }
  }

  // --------------------------------------------------
  // Development-only routes
  // --------------------------------------------------

  // The virtualisation load test lives under /properties, which is public,
  // so it would otherwise ship as a live page. The proxy answers before
  // anything is rendered and sends the visitor to the not-found page.
  if (pathname.startsWith("/properties/load-test")) {
    if (process.env.ENABLE_LOAD_TEST !== "true") {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  // --------------------------------------------------
  // Continue request
  // --------------------------------------------------

  return applyCookies(NextResponse.next());
}

// --------------------------------------------------
// Proxy matcher
// --------------------------------------------------

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};
