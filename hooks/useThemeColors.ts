import { getThemeVars } from "../constants/theme";

export function useThemeColors() {
<<<<<<< HEAD
  const themeVars = getThemeVars();
=======
  const colorBlindMode = useUserStore((s) => s.colorBlindMode);
  const appThemeColor = useUserStore((s) => s.appThemeColor);
  const isDarkMode = useUserStore((s) => s.isDarkMode);
  const themeVars = getThemeVars(colorBlindMode, appThemeColor, isDarkMode);
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77

  return {
    navy: themeVars["--color-brand-navy"],
    emerald: themeVars["--color-brand-emerald"],
    gold: themeVars["--color-brand-gold"],
    bg: themeVars["--color-brand-bg"],
    slateBg: themeVars["--color-brand-slateBg"],
    dark: themeVars["--color-brand-dark"],
    gray: themeVars["--color-brand-gray"],
    border: themeVars["--color-brand-border"],
  };
}
