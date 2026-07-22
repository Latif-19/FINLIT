import { useUserStore } from "../store/useUserStore";
import { getThemeVars } from "../constants/theme";

export function useThemeColors() {
  const colorBlindMode = useUserStore((s) => s.colorBlindMode);
  const appThemeColor = useUserStore((s) => s.appThemeColor);
  const themeVars = getThemeVars(colorBlindMode, appThemeColor);

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
