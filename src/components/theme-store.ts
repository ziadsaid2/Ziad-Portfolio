"use client";

import { useSyncExternalStore } from "react";
import {
  applyThemeVariables,
  STORAGE_KEY,
  type Theme,
  type ThemePreference,
  themePalette,
} from "@/components/theme-tokens";

const THEME_EVENT = "themechange";
const SYSTEM_THEME_QUERY = "(prefers-color-scheme: dark)";

const isThemePreference = (value: string | null): value is ThemePreference => {
  return value === "light" || value === "dark" || value === "system";
};

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? "dark" : "light";
};

const resolveTheme = (preference: ThemePreference): Theme => {
  return preference === "system" ? getSystemTheme() : preference;
};

const getStoredThemePreference = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedPreference = window.localStorage.getItem(STORAGE_KEY);

  return isThemePreference(storedPreference) ? storedPreference : "system";
};

export const getThemeSnapshot = (): Theme => {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
};

export const getThemePreferenceSnapshot = (): ThemePreference => {
  if (typeof document === "undefined") {
    return "system";
  }

  const preference = document.documentElement.dataset.themePreference ?? null;

  if (isThemePreference(preference)) {
    return preference;
  }

  return "system";
};

export const applyTheme = (preference: ThemePreference) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const theme = resolveTheme(preference);

  applyThemeVariables(root, theme);
  root.dataset.themePreference = preference;
  window.localStorage.setItem(STORAGE_KEY, preference);
  window.dispatchEvent(new Event(THEME_EVENT));
};

export const syncTheme = () => {
  applyTheme(getStoredThemePreference());
};

const subscribe = (callback: () => void) => {
  const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY);

  const handleSystemThemeChange = () => {
    if (getStoredThemePreference() === "system") {
      applyTheme("system");
    }
  };

  window.addEventListener(THEME_EVENT, callback);
  mediaQuery.addEventListener?.("change", handleSystemThemeChange);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    mediaQuery.removeEventListener?.("change", handleSystemThemeChange);
  };
};

export const useTheme = (): Theme => {
  return useSyncExternalStore(subscribe, getThemeSnapshot, () => "light" as Theme);
};

export const useThemePreference = (): ThemePreference => {
  return useSyncExternalStore(
    subscribe,
    getThemePreferenceSnapshot,
    () => "system" as ThemePreference,
  );
};

export { STORAGE_KEY, themePalette };
