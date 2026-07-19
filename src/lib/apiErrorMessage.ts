function humanizeFieldKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function stringifyMessage(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => stringifyMessage(item))
      .filter((item): item is string => Boolean(item));
    return parts.length ? parts.join(" ") : undefined;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return undefined;

    const parts = entries.map(([key, raw]) => {
      const msg = stringifyMessage(raw);
      if (!msg) return humanizeFieldKey(key);
      // Avoid "Confirm password: confirmpassword is required" duplication
      if (msg.toLowerCase().includes(key.toLowerCase())) return msg;
      return `${humanizeFieldKey(key)}: ${msg}`;
    });
    return parts.join(". ");
  }
  return undefined;
}

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
        message?: unknown;
        error?: unknown;
        errors?: unknown;
      };
    };
  };

  const data = err.response?.data;

  if (!err.response) {
    if (!process.env.NEXT_PUBLIC_SERVER_URI) {
      return "API URL is not configured. Add NEXT_PUBLIC_SERVER_URI to your .env file.";
    }
    return err.message || "Network error. Check your connection and try again.";
  }

  return (
    stringifyMessage(data?.message) ||
    stringifyMessage(data?.error) ||
    stringifyMessage(data?.errors) ||
    fallback
  );
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
