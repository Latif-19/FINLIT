import { getThemeVars } from "../constants/theme";

export function useThemeColors() {
  const themeVars = getThemeVars();

  return {
    navy: themeVars["--color-brand-navy"],
    emerald: themeVars["--color-brand-emerald"],
    gold: themeVars["--color-brand-gold"],
    bg: themeVars["--color-brand-bg"],
    slateBg: themeVars["--color-brand-slateBg"],
    dark: themeVars["--color-brand-dark"],
    gray: themeVars["--color-brand-gray"],
  };
}
