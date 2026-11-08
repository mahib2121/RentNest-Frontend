import axios from "axios";
import { cookies } from "next/headers";

/**
 * An axios instance for server-side requests to the backend.
 *
 * `withCookies` controls whether the request carries the visitor's session.
 * Public endpoints do not need it, and reading `cookies()` opts the whole
 * render into dynamic behaviour — which stopped the public pages from being
 * prerendered. The property listing endpoints are public, so they are called
 * without it and the page stays static.
 */
export const serverAxios = async (options?: { withCookies?: boolean }) => {
  const withCookies = options?.withCookies ?? true;

  let cookieHeader = "";

  if (withCookies) {
    const cookieStore = await cookies();

    cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
  }

  return axios.create({
    baseURL: process.env.APIurl,
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });
};
