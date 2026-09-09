/**
 * Adea design tokens — the approved "life dial" system.
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
}

export const lightColors: ColorScheme = {
  ink: "#16212b",
  inkSoft: "#46545e",
  paper: "#e9ede9",
  paperDeep: "#dbe1dc",
  surface: "#ffffff",
  surfaceAlt: "#dce3e0",
  teal: "#2f6f63",
  tealDeep: "#1f4b43",
  tealTint: "rgba(47, 111, 99, 0.12)",
  honey: "#c68a3d",
  honeyTint: "rgba(198, 138, 61, 0.14)",
  coral: "#c0523a",
  coralTint: "rgba(192, 82, 58, 0.12)",
  line: "#d3dad7",
};

export const darkColors: ColorScheme = {
  ink: "#edefec",
  inkSoft: "#b7bfba",
  paper: "#121a1f",
  paperDeep: "#0c1215",
  surface: "#1b252b",
  surfaceAlt: "#232f35",
  teal: "#7cc4b2",
  tealDeep: "#a9dccf",
  tealTint: "rgba(124, 196, 178, 0.16)",
  honey: "#e0a855",
  honeyTint: "rgba(224, 168, 85, 0.16)",
  coral: "#e1806a",
  coralTint: "rgba(225, 128, 106, 0.16)",
  line: "#2c383e",
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
