export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
) {
  if (!error || typeof error !== "object") return fallback;

  const err = error as {
    message?: string;
    response?: {
      status?: number;
      data?: {
        message?: string;
        error?: string | { message?: string };
      };
    };
  };

  const data = err.response?.data;
  const nestedError = data?.error;
  const nestedMessage =
    typeof nestedError === "string" ? nestedError : nestedError?.message;

  if (!err.response) {
    if (!process.env.NEXT_PUBLIC_SERVER_URI) {
      return "API URL is not configured. Add NEXT_PUBLIC_SERVER_URI to your .env file.";
    }
    return err.message || "Network error. Check your connection and try again.";
  }

  return data?.message || nestedMessage || fallback;
}

export function isUnverifiedAccountMessage(message: string) {
  const lower = message.toLowerCase();
  return (
    lower.includes("not verified") ||
    lower.includes("not yet verified") ||
    lower.includes("verification code") ||
    lower.includes("verify your account")
  );
}
