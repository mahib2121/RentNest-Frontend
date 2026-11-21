import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

/**
 * Pusher private-channel authorization, proxied through Next.js.
 *
 * The browser cannot call the backend's auth endpoint directly with
 * `credentials: "include"`: the `accessToken` cookie is set by this app's
 * login server action, so it belongs to the frontend's host, not the
 * backend's. A cross-origin request would arrive without it and be refused.
 *
 * This handler is same-origin, so the cookie arrives here; it is forwarded
 * to the backend the same way `serverAxios` forwards it for server actions.
 */
export async function POST(request: NextRequest) {
  const apiUrl = process.env.APIurl?.replace(/\/$/, "");

  if (!apiUrl) {
    return Response.json(
      { success: false, message: "API URL is not configured." },
      { status: 500 },
    );
  }

  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    return Response.json(
      { success: false, message: "Not signed in." },
      { status: 401 },
    );
  }

  // pusher-js posts form-encoded by default; accept JSON as well.
  let socketId: string | null = null;
  let channelName: string | null = null;

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as {
      socket_id?: string;
      channel_name?: string;
    };
    socketId = body.socket_id ?? null;
    channelName = body.channel_name ?? null;
  } else {
    const form = new URLSearchParams(await request.text());
    socketId = form.get("socket_id");
    channelName = form.get("channel_name");
  }

  if (!socketId || !channelName) {
    return Response.json(
      { success: false, message: "socket_id and channel_name are required." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${apiUrl}/api/notifications/pusher/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ socket_id: socketId, channel_name: channelName }),
      cache: "no-store",
    });

    // Pass the backend's answer through untouched — on success it is the
    // `{ auth }` object pusher-js expects.
    return new Response(await res.text(), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json(
      { success: false, message: "Could not reach the auth server." },
      { status: 502 },
    );
  }
}
