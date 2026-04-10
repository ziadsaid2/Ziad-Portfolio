export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";
export const STORAGE_KEY = "portfolio-theme";

export const themePalette = {
  light: {
    pageBackground: "oklch(0.92 0.015 80)",
    pageForeground: "oklch(0.24 0.02 80)",
    heroBackground: "oklch(0.92 0.015 80)",
    heroLineColor: "oklch(0.63 0.06 28)",
    heroLineOpacity: 0.42,
    heroHoverBlob: "oklch(0.69 0.16 45)",
    heroHoverBlobOpacity: 0.16,
    cursorColor: "oklch(0.62 0.17 42)",
    toggleBackground: "oklch(0.92 0.015 80 / 0.8)",
    toggleBorder: "oklch(0.72 0.07 38 / 0.42)",
    toggleTrack: "oklch(0.85 0.05 55 / 0.68)",
    toggleKnob: "oklch(0.68 0.15 46)",
    accentPrimary: "oklch(0.64 0.17 42)",
    accentSecondary: "oklch(0.6 0.11 10)",
    accentTertiary: "oklch(0.8 0.13 80)",
  },
  dark: {
    pageBackground: "oklch(0.17 0.012 24)",
    pageForeground: "oklch(0.94 0.015 75)",
    heroBackground: "oklch(0.2 0.016 26)",
    heroLineColor: "oklch(0.72 0.08 40)",
    heroLineOpacity: 0.6,
    heroHoverBlob: "oklch(0.77 0.14 52)",
    heroHoverBlobOpacity: 0.22,
    cursorColor: "oklch(0.76 0.15 44)",
    toggleBackground: "oklch(0.28 0.018 24 / 0.84)",
    toggleBorder: "oklch(0.67 0.08 40 / 0.4)",
    toggleTrack: "oklch(0.42 0.06 34 / 0.75)",
    toggleKnob: "oklch(0.76 0.15 48)",
    accentPrimary: "oklch(0.74 0.15 44)",
    accentSecondary: "oklch(0.7 0.1 14)",
    accentTertiary: "oklch(0.84 0.12 82)",
  },
} as const;

const paletteVariableMap = {
  pageBackground: "--color-page-background",
  pageForeground: "--color-page-foreground",
  heroBackground: "--color-hero-background",
  heroLineColor: "--color-hero-line",
  heroHoverBlob: "--color-hero-hover-blob",
  cursorColor: "--color-cursor",
  toggleBackground: "--color-toggle-background",
  toggleBorder: "--color-toggle-border",
  toggleTrack: "--color-toggle-track",
  toggleKnob: "--color-toggle-knob",
  accentPrimary: "--color-accent-primary",
  accentSecondary: "--color-accent-secondary",
  accentTertiary: "--color-accent-tertiary",
} as const;

type ThemeCssKey = keyof typeof paletteVariableMap;

export const applyThemeVariables = (root: HTMLElement, theme: Theme) => {
  const palette = themePalette[theme];

  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  for (const [paletteKey, cssVariable] of Object.entries(
    paletteVariableMap,
  ) as Array<[ThemeCssKey, (typeof paletteVariableMap)[ThemeCssKey]]>) {
    root.style.setProperty(cssVariable, palette[paletteKey]);
  }
};

export const getThemeScript = (storageKey: string) => {
  const paletteJson = JSON.stringify(themePalette);
  const variableMapJson = JSON.stringify(paletteVariableMap);

  return `
    (() => {
      const themes = ${paletteJson};
      const variableMap = ${variableMapJson};
      const storedPreference = window.localStorage.getItem(${JSON.stringify(storageKey)});
      const preference = storedPreference === "light" || storedPreference === "dark" || storedPreference === "system"
        ? storedPreference
        : "system";
      const theme = preference === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : preference;
      const palette = themes[theme];
      const root = document.documentElement;

      root.dataset.theme = theme;
      root.dataset.themePreference = preference;
      root.style.colorScheme = theme;

      Object.entries(variableMap).forEach(([paletteKey, cssVariable]) => {
        root.style.setProperty(cssVariable, palette[paletteKey]);
      });
    })();
  `;
};
