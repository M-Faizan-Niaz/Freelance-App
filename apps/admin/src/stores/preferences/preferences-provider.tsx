import { createContext, useContext, useEffect, useRef, useState } from "react";

import { type StoreApi, useStore } from "zustand";

import type { FontKey } from "@/lib/fonts/registry";
import {
  CONTENT_LAYOUT_VALUES,
  NAVBAR_STYLE_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
} from "@/lib/preferences/layout";
import {
  applyContentLayout,
  applyFont,
  applyNavbarStyle,
  applySidebarCollapsible,
  applySidebarVariant,
} from "@/lib/preferences/layout-utils";
import { PREFERENCE_DEFAULTS, type PreferenceKey } from "@/lib/preferences/preferences-config";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES } from "@/lib/preferences/theme";
import { applyThemeMode, applyThemePreset, subscribeToSystemTheme } from "@/lib/preferences/theme-utils";

import { createPreferencesStore, type PreferencesState } from "./preferences-store";

const PreferencesStoreContext = createContext<StoreApi<PreferencesState> | null>(null);

const FONT_VALUES: FontKey[] = [
  "geist", "inter", "notoSans", "nunitoSans", "figtree", "roboto", "raleway",
  "dmSans", "publicSans", "outfit", "geistMono", "jetBrainsMono", "notoSerif",
  "robotoSlab", "merriweather", "lora", "playfairDisplay",
];

function getSafe<T extends string>(value: string | null, allowed: readonly T[]): T | undefined {
  if (!value) return undefined;
  return allowed.includes(value as T) ? (value as T) : undefined;
}

function readFromStorage(): Partial<PreferencesState> {
  const get = (key: PreferenceKey) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };

  return {
    themeMode: getSafe(get("theme_mode"), THEME_MODE_VALUES),
    themePreset: getSafe(get("theme_preset"), THEME_PRESET_VALUES),
    font: getSafe(get("font"), FONT_VALUES),
    contentLayout: getSafe(get("content_layout"), CONTENT_LAYOUT_VALUES),
    navbarStyle: getSafe(get("navbar_style"), NAVBAR_STYLE_VALUES),
    sidebarVariant: getSafe(get("sidebar_variant"), SIDEBAR_VARIANT_VALUES),
    sidebarCollapsible: getSafe(get("sidebar_collapsible"), SIDEBAR_COLLAPSIBLE_VALUES),
  };
}

export const PreferencesStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = useState<StoreApi<PreferencesState>>(() => {
    const stored = readFromStorage();
    return createPreferencesStore({
      themeMode: stored.themeMode ?? PREFERENCE_DEFAULTS.theme_mode,
      themePreset: stored.themePreset ?? PREFERENCE_DEFAULTS.theme_preset,
      font: stored.font ?? PREFERENCE_DEFAULTS.font,
      contentLayout: stored.contentLayout ?? PREFERENCE_DEFAULTS.content_layout,
      navbarStyle: stored.navbarStyle ?? PREFERENCE_DEFAULTS.navbar_style,
      sidebarVariant: stored.sidebarVariant ?? PREFERENCE_DEFAULTS.sidebar_variant,
      sidebarCollapsible: stored.sidebarCollapsible ?? PREFERENCE_DEFAULTS.sidebar_collapsible,
    });
  });

  const domSnapshotRef = useRef<Partial<PreferencesState> | null>(null);

  useEffect(() => {
    const s = store.getState();

    applyThemeMode(s.themeMode);
    applyThemePreset(s.themePreset);
    applyContentLayout(s.contentLayout);
    applyNavbarStyle(s.navbarStyle);
    applySidebarVariant(s.sidebarVariant);
    applySidebarCollapsible(s.sidebarCollapsible);
    if (s.font !== "geist") applyFont(s.font);

    domSnapshotRef.current = s;

    store.setState((prev) => ({ ...prev, isSynced: true }));
  }, [store]);

  useEffect(() => {
    let unsubscribeMedia: (() => void) | undefined;

    const applyFromMode = (mode: PreferencesState["themeMode"]) => {
      unsubscribeMedia?.();
      const resolved = applyThemeMode(mode);
      store.setState((prev) => ({ ...prev, resolvedThemeMode: resolved }));

      if (mode === "system") {
        unsubscribeMedia = subscribeToSystemTheme(() => {
          const next = applyThemeMode("system");
          store.setState((prev) => ({ ...prev, resolvedThemeMode: next }));
        });
      }
    };

    const startMode = domSnapshotRef.current?.themeMode ?? store.getState().themeMode;
    applyFromMode(startMode);

    const unsubscribeStore = store.subscribe((s, p) => {
      if (s.themeMode !== p.themeMode) applyFromMode(s.themeMode);
    });

    return () => {
      unsubscribeMedia?.();
      unsubscribeStore();
    };
  }, [store]);

  return <PreferencesStoreContext.Provider value={store}>{children}</PreferencesStoreContext.Provider>;
};

export const usePreferencesStore = <T,>(selector: (state: PreferencesState) => T): T => {
  const store = useContext(PreferencesStoreContext);
  if (!store) throw new Error("Missing PreferencesStoreProvider");
  return useStore(store, selector);
};
