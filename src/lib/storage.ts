const isBrowser = () => typeof window !== "undefined";

export const storage = {
  get(key: string): string | null {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  remove(key: string) {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
