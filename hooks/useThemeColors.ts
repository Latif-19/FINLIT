import { useState, useEffect } from "react";
import { Appearance, AppState } from "react-native";
import { getSemanticColors, getThemeVars } from "../constants/theme";
import { useUserStore } from "../store/useUserStore";
import { Colors } from "../constants/theme";

export function useThemeColors() {
  const [systemColorScheme, setSystemColorScheme] = useState(Appearance.getColorScheme());
  const themePreference = useUserStore((s) => s.themePreference || "system");

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setSystemColorScheme(Appearance.getColorScheme());
      }
    });
    return () => {
      sub.remove();
      appStateSub.remove();
    };
  }, []);

  const isDark =
    themePreference === "system"
      ? systemColorScheme === "dark"
      : themePreference === "dark";

  const themeVars = getThemeVars("none", "emerald", isDark);
  const semantic = getSemanticColors(isDark);

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
    text: isDark ? Colors.dark.text : Colors.light.text,
    isDark,
  };
}