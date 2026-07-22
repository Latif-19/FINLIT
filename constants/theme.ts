/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export interface ThemeVars {
  [key: `--${string}`]: string;
  '--color-brand-navy': string;
  '--color-brand-emerald': string;
  '--color-brand-gold': string;
  '--color-brand-bg': string;
  '--color-brand-slateBg': string;
  '--color-brand-dark': string;
  '--color-brand-gray': string;
}

export const THEME_PRESETS = {
  modes: {
    none: {
      emerald: {
        '--color-brand-navy': '#0A2540',
        '--color-brand-emerald': '#10B981',
        '--color-brand-gold': '#D4AF37',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F8FAFC',
        '--color-brand-dark': '#111827',
        '--color-brand-gray': '#6B7280',
      },
      blue: {
        '--color-brand-navy': '#0F172A',
        '--color-brand-emerald': '#2563EB',
        '--color-brand-gold': '#F59E0B',
        '--color-brand-slateBg': '#F1F5F9',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-dark': '#0F172A',
        '--color-brand-gray': '#475569',
      },
      purple: {
        '--color-brand-navy': '#1E1B4B',
        '--color-brand-emerald': '#7C3AED',
        '--color-brand-gold': '#F59E0B',
        '--color-brand-slateBg': '#FAF5FF',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-dark': '#1E1B4B',
        '--color-brand-gray': '#6B7280',
      },
    },
    deuteranopia: {
      emerald: {
        '--color-brand-navy': '#002A4A',
        '--color-brand-emerald': '#009E73',
        '--color-brand-gold': '#E69F00',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#EBF7F2',
        '--color-brand-dark': '#111827',
        '--color-brand-gray': '#5A6E7F',
      },
      blue: {
        '--color-brand-navy': '#003A60',
        '--color-brand-emerald': '#0072B2',
        '--color-brand-gold': '#E69F00',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F0F5FA',
        '--color-brand-dark': '#0E1724',
        '--color-brand-gray': '#5A6E7F',
      },
      purple: {
        '--color-brand-navy': '#350B40',
        '--color-brand-emerald': '#CC79A7',
        '--color-brand-gold': '#E69F00',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#FAF2F7',
        '--color-brand-dark': '#211126',
        '--color-brand-gray': '#6E5A6F',
      },
    },
    protanopia: {
      emerald: {
        '--color-brand-navy': '#002C54',
        '--color-brand-emerald': '#009E73',
        '--color-brand-gold': '#FFC400',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#EDF7F4',
        '--color-brand-dark': '#1A1A1A',
        '--color-brand-gray': '#555555',
      },
      blue: {
        '--color-brand-navy': '#001A33',
        '--color-brand-emerald': '#3D5AFE',
        '--color-brand-gold': '#FFC400',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F5F7FA',
        '--color-brand-dark': '#111625',
        '--color-brand-gray': '#555555',
      },
      purple: {
        '--color-brand-navy': '#280D3D',
        '--color-brand-emerald': '#B800FF',
        '--color-brand-gold': '#FFC400',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#FAF5FC',
        '--color-brand-dark': '#1F1126',
        '--color-brand-gray': '#6E5F75',
      },
    },
    tritanopia: {
      emerald: {
        '--color-brand-navy': '#4A0A25',
        '--color-brand-emerald': '#00796B',
        '--color-brand-gold': '#E65100',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F2FAF9',
        '--color-brand-dark': '#212121',
        '--color-brand-gray': '#616161',
      },
      blue: {
        '--color-brand-navy': '#5A0B2E',
        '--color-brand-emerald': '#00A5CF',
        '--color-brand-gold': '#E65100',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F0F8FA',
        '--color-brand-dark': '#25111B',
        '--color-brand-gray': '#616161',
      },
      purple: {
        '--color-brand-navy': '#4A021A',
        '--color-brand-emerald': '#EC407A',
        '--color-brand-gold': '#E65100',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#FCF2F5',
        '--color-brand-dark': '#261019',
        '--color-brand-gray': '#6E5C64',
      },
    },
    'high-contrast': {
      emerald: {
        '--color-brand-navy': '#000000',
        '--color-brand-emerald': '#008000',
        '--color-brand-gold': '#D97706',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#FFFFFF',
        '--color-brand-dark': '#000000',
        '--color-brand-gray': '#000000',
      },
      blue: {
        '--color-brand-navy': '#000000',
        '--color-brand-emerald': '#0000FF',
        '--color-brand-gold': '#D97706',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#FFFFFF',
        '--color-brand-dark': '#000000',
        '--color-brand-gray': '#000000',
      },
      purple: {
        '--color-brand-navy': '#000000',
        '--color-brand-emerald': '#800080',
        '--color-brand-gold': '#D97706',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#FFFFFF',
        '--color-brand-dark': '#000000',
        '--color-brand-gray': '#000000',
      },
    },
    monochrome: {
      emerald: {
        '--color-brand-navy': '#1F2937',
        '--color-brand-emerald': '#4B5563',
        '--color-brand-gold': '#9CA3AF',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F9FAFB',
        '--color-brand-dark': '#111827',
        '--color-brand-gray': '#6B7280',
      },
      blue: {
        '--color-brand-navy': '#111827',
        '--color-brand-emerald': '#374151',
        '--color-brand-gold': '#808080',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F3F4F6',
        '--color-brand-dark': '#000000',
        '--color-brand-gray': '#555555',
      },
      purple: {
        '--color-brand-navy': '#030712',
        '--color-brand-emerald': '#1F2937',
        '--color-brand-gold': '#D1D5DB',
        '--color-brand-bg': '#FFFFFF',
        '--color-brand-slateBg': '#F9FAFB',
        '--color-brand-dark': '#000000',
        '--color-brand-gray': '#666666',
      },
    },
  },
};

export function getThemeVars(
  colorBlindMode: keyof typeof THEME_PRESETS.modes,
  appThemeColor: keyof typeof THEME_PRESETS.modes.none
): ThemeVars {
  const modePresets = THEME_PRESETS.modes[colorBlindMode];
  return modePresets[appThemeColor] || modePresets.emerald;
}
