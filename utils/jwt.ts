import jwt from "jsonwebtoken";

export type TokenVerifyResult = {
  success: boolean;
  data?: jwt.JwtPayload;
  error?: string;
};

/**
 * Verify a JWT without ever throwing.
 *
 * A failed verification is an expected outcome here (expired token, stale
 * cookie from a previous signing secret, absent token), not an error worth
 * logging loudly — the caller decides whether to refresh or sign out.
 */
export const verifyToken = (
  token: string | undefined | null,
  secret: string | undefined | null,
): TokenVerifyResult => {
  if (!token || !secret) {
    return {
      success: false,
      error: token ? "Missing signing secret" : "Missing token",
    };
  }

  try {
    const verifiedToken = jwt.verify(token, secret);

    return {
      success: true,
      data: verifiedToken as jwt.JwtPayload,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Token verification failed",
    };
  }
};
