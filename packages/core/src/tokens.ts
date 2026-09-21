/**
 * Adea design tokens: green primary, cream background, terracotta accent, lavender atmosphere.
 * Single source of truth for color and type, shared by web (app/globals.css)
 * and mobile (React Native styles). If you change a value here, regenerate the
 * web CSS variables from it — don't hand-edit globals.css out of sync.
 */

export interface ColorScheme {
  ink: string;
  inkSoft: string;
  paper: string;
  paperDeep: string;
  surface: string;
  surfaceAlt: string;
  teal: string;
  tealDeep: string;
  tealTint: string;
  honey: string;
  honeyTint: string;
  coral: string;
  coralTint: string;
  line: string;
  /** Atmosphere only (soft glow, shadows, backgrounds). Never a fill or text colour. */
  lavender: string;
  lavenderGlow: string;
}

export const lightColors: ColorScheme = {
  ink: "#23201c",
  inkSoft: "#5f5648",
  paper: "#fcfaf6",
  paperDeep: "#f4efe4",
  surface: "#ffffff",
  surfaceAlt: "#f5f0e6",
  teal: "#3a5a40",
  tealDeep: "#2a4230",
  tealTint: "rgba(58, 90, 64, 0.12)",
  honey: "#c56a43",
  honeyTint: "rgba(197, 106, 67, 0.14)",
  coral: "#b23c2b",
  coralTint: "rgba(178, 60, 43, 0.12)",
  line: "#ebe4d6",
  lavender: "#9a8fc0",
  lavenderGlow: "rgba(154, 143, 192, 0.2)",
};

export const darkColors: ColorScheme = {
  ink: "#efe9dd",
  inkSoft: "#b8ae9d",
  paper: "#17130d",
  paperDeep: "#0f0c08",
  surface: "#201b14",
  surfaceAlt: "#2a241b",
  teal: "#a3c4a6",
  tealDeep: "#cfe0cf",
  tealTint: "rgba(163, 196, 166, 0.16)",
  honey: "#e08b63",
  honeyTint: "rgba(224, 139, 99, 0.16)",
  coral: "#e07a5f",
  coralTint: "rgba(224, 122, 95, 0.16)",
  line: "#362f22",
  lavender: "#a99fd0",
  lavenderGlow: "rgba(169, 159, 208, 0.2)",
};

export const radii = { sm: 10, md: 16 } as const;

export const fonts = {
  /** Serif display — headings, greeting, screen titles. */
  display: "Fraunces",
  /** Body / UI text. */
  body: "Work Sans",
  /** Tabular numbers — money amounts, dates, progress %. */
  mono: "IBM Plex Mono",
} as const;

export const typeScale = {
  display: { size: 28, lineHeight: 34, weight: "700" },
  title: { size: 22, lineHeight: 28, weight: "600" },
  body: { size: 16, lineHeight: 24, weight: "400" },
  label: { size: 13, lineHeight: 18, weight: "500" },
  mono: { size: 15, lineHeight: 20, weight: "500" },
} as const;

export const tokens = {
  light: lightColors,
  dark: darkColors,
  radii,
  fonts,
  typeScale,
} as const;
