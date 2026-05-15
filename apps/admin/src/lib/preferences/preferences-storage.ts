import { type PreferenceKey } from "./preferences-config";

export function persistPreference(key: PreferenceKey, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore storage errors
  }
}

export function readPreference(key: PreferenceKey): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
