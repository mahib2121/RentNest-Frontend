import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getNewAccessToken } from "./service/refreshToken";
import { jwtUtils } from "./utils/jwt";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news"];

const ROLE_DASHBOARDS: Record<string, string> = {
  USER: "/dashboard",
  ADMIN: "/admin-dashboard",
  AUTHOR: "/author-dashboard",
};

const ROLE_PROTECTED_ROUTES: Record<string, string> = {
  USER: "/dashboard",
  ADMIN: "/admin-dashboard",
  AUTHOR: "/author-dashboard",
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      )
    : null;

  // --------------------------------------------------
  // Refresh access token if expired
  // --------------------------------------------------

  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken();

    if (result.success && result.data?.accessToken) {
      accessToken = result.data.accessToken;

      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      });

      decodedAccessToken = jwtUtils.verifyToken(
        accessToken as string,
        process.env.JWT_ACCESS_SECRET as string,
      );
    }
  }

  // --------------------------------------------------
  // Get user role
  // --------------------------------------------------

  let userRole: string | null = null;

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role;
  }

  // --------------------------------------------------
  // Invalid / expired access token
  // --------------------------------------------------

  if (accessToken && !decodedAccessToken?.success) {
    cookieStore.delete("accessToken");
    accessToken = undefined;
    userRole = null;
  }

  // --------------------------------------------------
  // Route helpers
  // --------------------------------------------------

  const isRoute = (routes: string[]) =>
    routes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

  const isPublicRoute = isRoute(PUBLIC_ROUTES);
  const isAuthRoute = isRoute(AUTH_ROUTES);

  // --------------------------------------------------
  // Logged-in user trying to access login/register
  // --------------------------------------------------

  if (accessToken && isAuthRoute) {
    const dashboard = userRole ? ROLE_DASHBOARDS[userRole] : "/";

    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // --------------------------------------------------
  // Protect authenticated routes
  // --------------------------------------------------

  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // --------------------------------------------------
  // Role-based authorization
  // --------------------------------------------------

  const protectedRole = Object.entries(ROLE_PROTECTED_ROUTES).find(
    ([, route]) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (protectedRole) {
    const [requiredRole] = protectedRole;

    if (userRole !== requiredRole) {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
};
