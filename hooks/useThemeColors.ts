import { useUserStore } from "../store/useUserStore";
import { getThemeVars, getSemanticColors } from "../constants/theme";

export function useThemeColors() {
  const colorBlindMode = useUserStore((s) => s.colorBlindMode);
  const appThemeColor = useUserStore((s) => s.appThemeColor);
  const isDarkMode = useUserStore((s) => s.isDarkMode);
  const themeVars = getThemeVars(colorBlindMode, appThemeColor, isDarkMode);
  const semantic = getSemanticColors(isDarkMode);

  return {
    navy: themeVars["--color-brand-navy"],
    emerald: themeVars["--color-brand-emerald"],
    gold: themeVars["--color-brand-gold"],
    bg: themeVars["--color-brand-bg"],
    slateBg: themeVars["--color-brand-slateBg"],
    dark: themeVars["--color-brand-dark"],
    gray: themeVars["--color-brand-gray"],
    border: themeVars["--color-brand-border"],
    // Status colours — same hue in every brand palette, but dark-mode aware.
    success: semantic.success,
    danger: semantic.danger,
    warning: semantic.warning,
    info: semantic.info,
  };
}
