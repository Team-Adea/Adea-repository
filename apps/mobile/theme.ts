import { useColorScheme } from "react-native";
import { tokens, type ColorScheme } from "@adea/core";

/** Resolves the shared Adea tokens to the device's light/dark setting. */
export function useTheme(): { colors: ColorScheme; radii: typeof tokens.radii } {
  const scheme = useColorScheme();
  return {
    colors: scheme === "dark" ? tokens.dark : tokens.light,
    radii: tokens.radii,
  };
}
