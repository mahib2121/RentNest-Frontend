/**
 * Narrow an unknown catch binding into the API error shape the backend
 * returns, so server actions can surface a real message instead of
 * "something went wrong".
 */
export type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function toApiError(error: unknown): ApiError {
  if (typeof error !== "object" || error === null) {
    return {};
  }

  return error as ApiError;
}

/** The backend's message for a failed request, if there is one. */
export function errorMessage(
  error: unknown,
  fallback: string,
): string {
  return toApiError(error).response?.data?.message || fallback;
}
