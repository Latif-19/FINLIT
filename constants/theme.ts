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
  '--color-brand-border': string;
}

interface ThemeVariant {
  light: ThemeVars;
  dark: ThemeVars;
}

export const THEME_PRESETS = {
  modes: {
    none: {
      emerald: {
        light: {
          '--color-brand-navy': '#0A2540',
          '--color-brand-emerald': '#10B981',
          '--color-brand-gold': '#D4AF37',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F8FAFC',
          '--color-brand-dark': '#111827',
          '--color-brand-gray': '#6B7280',
          '--color-brand-border': '#E2E8F0',
        },
        dark: {
          '--color-brand-navy': '#7FA8D9',
          '--color-brand-emerald': '#34D399',
          '--color-brand-gold': '#E8C158',
          '--color-brand-bg': '#0B1220',
          '--color-brand-slateBg': '#16203A',
          '--color-brand-dark': '#F1F5F9',
          '--color-brand-gray': '#94A3B8',
          '--color-brand-border': '#26314A',
        },
      },
      blue: {
        light: {
          '--color-brand-navy': '#0F172A',
          '--color-brand-emerald': '#2563EB',
          '--color-brand-gold': '#F59E0B',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F1F5F9',
          '--color-brand-dark': '#0F172A',
          '--color-brand-gray': '#475569',
          '--color-brand-border': '#E2E8F0',
        },
        dark: {
          '--color-brand-navy': '#8FB3ED',
          '--color-brand-emerald': '#4C8DF5',
          '--color-brand-gold': '#FBBF24',
          '--color-brand-bg': '#0A0F1C',
          '--color-brand-slateBg': '#141C30',
          '--color-brand-dark': '#F1F5F9',
          '--color-brand-gray': '#94A3B8',
          '--color-brand-border': '#232D45',
        },
      },
      purple: {
        light: {
          '--color-brand-navy': '#1E1B4B',
          '--color-brand-emerald': '#7C3AED',
          '--color-brand-gold': '#F59E0B',
          '--color-brand-slateBg': '#FAF5FF',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-dark': '#1E1B4B',
          '--color-brand-gray': '#6B7280',
          '--color-brand-border': '#E9E3F5',
        },
        dark: {
          '--color-brand-navy': '#C3AEF0',
          '--color-brand-emerald': '#A78BFA',
          '--color-brand-gold': '#FBBF24',
          '--color-brand-bg': '#120E1F',
          '--color-brand-slateBg': '#1D1730',
          '--color-brand-dark': '#F5F3FA',
          '--color-brand-gray': '#A395B8',
          '--color-brand-border': '#322A4A',
        },
      },
    },
    deuteranopia: {
      emerald: {
        light: {
          '--color-brand-navy': '#002A4A',
          '--color-brand-emerald': '#009E73',
          '--color-brand-gold': '#E69F00',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#EBF7F2',
          '--color-brand-dark': '#111827',
          '--color-brand-gray': '#5A6E7F',
          '--color-brand-border': '#D9EDE6',
        },
        dark: {
          '--color-brand-navy': '#6FA3C2',
          '--color-brand-emerald': '#33C79A',
          '--color-brand-gold': '#FFB627',
          '--color-brand-bg': '#081418',
          '--color-brand-slateBg': '#102025',
          '--color-brand-dark': '#EAF3F0',
          '--color-brand-gray': '#8FA8AE',
          '--color-brand-border': '#1E3238',
        },
      },
      blue: {
        light: {
          '--color-brand-navy': '#003A60',
          '--color-brand-emerald': '#0072B2',
          '--color-brand-gold': '#E69F00',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F0F5FA',
          '--color-brand-dark': '#0E1724',
          '--color-brand-gray': '#5A6E7F',
          '--color-brand-border': '#DCE8F2',
        },
        dark: {
          '--color-brand-navy': '#7FB2DD',
          '--color-brand-emerald': '#3E9BD6',
          '--color-brand-gold': '#FFB627',
          '--color-brand-bg': '#060E18',
          '--color-brand-slateBg': '#0F1D2E',
          '--color-brand-dark': '#EAF2FA',
          '--color-brand-gray': '#8FA3B8',
          '--color-brand-border': '#1E3348',
        },
      },
      purple: {
        light: {
          '--color-brand-navy': '#350B40',
          '--color-brand-emerald': '#CC79A7',
          '--color-brand-gold': '#E69F00',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#FAF2F7',
          '--color-brand-dark': '#211126',
          '--color-brand-gray': '#6E5A6F',
          '--color-brand-border': '#F2DFEA',
        },
        dark: {
          '--color-brand-navy': '#C79BD3',
          '--color-brand-emerald': '#E29DC0',
          '--color-brand-gold': '#FFB627',
          '--color-brand-bg': '#150A19',
          '--color-brand-slateBg': '#221129',
          '--color-brand-dark': '#F5EAF7',
          '--color-brand-gray': '#B29CB8',
          '--color-brand-border': '#382142',
        },
      },
    },
    protanopia: {
      emerald: {
        light: {
          '--color-brand-navy': '#002C54',
          '--color-brand-emerald': '#009E73',
          '--color-brand-gold': '#FFC400',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#EDF7F4',
          '--color-brand-dark': '#1A1A1A',
          '--color-brand-gray': '#555555',
          '--color-brand-border': '#DBEEE8',
        },
        dark: {
          '--color-brand-navy': '#6FA8D6',
          '--color-brand-emerald': '#33C79A',
          '--color-brand-gold': '#FFD24D',
          '--color-brand-bg': '#0A1420',
          '--color-brand-slateBg': '#132030',
          '--color-brand-dark': '#F0F0F0',
          '--color-brand-gray': '#A0A0A0',
          '--color-brand-border': '#223245',
        },
      },
      blue: {
        light: {
          '--color-brand-navy': '#001A33',
          '--color-brand-emerald': '#3D5AFE',
          '--color-brand-gold': '#FFC400',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F5F7FA',
          '--color-brand-dark': '#111625',
          '--color-brand-gray': '#555555',
          '--color-brand-border': '#E1E6F7',
        },
        dark: {
          '--color-brand-navy': '#7C97F0',
          '--color-brand-emerald': '#6B82FF',
          '--color-brand-gold': '#FFD24D',
          '--color-brand-bg': '#060B16',
          '--color-brand-slateBg': '#101A2C',
          '--color-brand-dark': '#EDEFF7',
          '--color-brand-gray': '#9FA5B8',
          '--color-brand-border': '#202A42',
        },
      },
      purple: {
        light: {
          '--color-brand-navy': '#280D3D',
          '--color-brand-emerald': '#B800FF',
          '--color-brand-gold': '#FFC400',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#FAF5FC',
          '--color-brand-dark': '#1F1126',
          '--color-brand-gray': '#6E5F75',
          '--color-brand-border': '#F1E0F8',
        },
        dark: {
          '--color-brand-navy': '#C9A0E8',
          '--color-brand-emerald': '#CB5EFF',
          '--color-brand-gold': '#FFD24D',
          '--color-brand-bg': '#150A1D',
          '--color-brand-slateBg': '#211230',
          '--color-brand-dark': '#F3EBF7',
          '--color-brand-gray': '#AD9CB8',
          '--color-brand-border': '#33203F',
        },
      },
    },
    tritanopia: {
      emerald: {
        light: {
          '--color-brand-navy': '#4A0A25',
          '--color-brand-emerald': '#00796B',
          '--color-brand-gold': '#E65100',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F2FAF9',
          '--color-brand-dark': '#212121',
          '--color-brand-gray': '#616161',
          '--color-brand-border': '#DDEFEC',
        },
        dark: {
          '--color-brand-navy': '#E89DBB',
          '--color-brand-emerald': '#2CA898',
          '--color-brand-gold': '#FF7A33',
          '--color-brand-bg': '#170810',
          '--color-brand-slateBg': '#241019',
          '--color-brand-dark': '#F5EDF0',
          '--color-brand-gray': '#B0A3A8',
          '--color-brand-border': '#3A1D2A',
        },
      },
      blue: {
        light: {
          '--color-brand-navy': '#5A0B2E',
          '--color-brand-emerald': '#00A5CF',
          '--color-brand-gold': '#E65100',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F0F8FA',
          '--color-brand-dark': '#25111B',
          '--color-brand-gray': '#616161',
          '--color-brand-border': '#DDEFF2',
        },
        dark: {
          '--color-brand-navy': '#EB9DBE',
          '--color-brand-emerald': '#33C4E6',
          '--color-brand-gold': '#FF7A33',
          '--color-brand-bg': '#170A12',
          '--color-brand-slateBg': '#251320',
          '--color-brand-dark': '#F5EDF2',
          '--color-brand-gray': '#B0A0AC',
          '--color-brand-border': '#3A1E2D',
        },
      },
      purple: {
        light: {
          '--color-brand-navy': '#4A021A',
          '--color-brand-emerald': '#EC407A',
          '--color-brand-gold': '#E65100',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#FCF2F5',
          '--color-brand-dark': '#261019',
          '--color-brand-gray': '#6E5C64',
          '--color-brand-border': '#F7DFE6',
        },
        dark: {
          '--color-brand-navy': '#E893AC',
          '--color-brand-emerald': '#F06D97',
          '--color-brand-gold': '#FF7A33',
          '--color-brand-bg': '#180810',
          '--color-brand-slateBg': '#24101A',
          '--color-brand-dark': '#F5EAEF',
          '--color-brand-gray': '#B29BA3',
          '--color-brand-border': '#3A1D28',
        },
      },
    },
    'high-contrast': {
      emerald: {
        light: {
          '--color-brand-navy': '#000000',
          '--color-brand-emerald': '#008000',
          '--color-brand-gold': '#D97706',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#FFFFFF',
          '--color-brand-dark': '#000000',
          '--color-brand-gray': '#000000',
          '--color-brand-border': '#000000',
        },
        dark: {
          '--color-brand-navy': '#FFFFFF',
          '--color-brand-emerald': '#00E676',
          '--color-brand-gold': '#FFA726',
          '--color-brand-bg': '#000000',
          '--color-brand-slateBg': '#000000',
          '--color-brand-dark': '#FFFFFF',
          '--color-brand-gray': '#FFFFFF',
          '--color-brand-border': '#FFFFFF',
        },
      },
      blue: {
        light: {
          '--color-brand-navy': '#000000',
          '--color-brand-emerald': '#0000FF',
          '--color-brand-gold': '#D97706',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#FFFFFF',
          '--color-brand-dark': '#000000',
          '--color-brand-gray': '#000000',
          '--color-brand-border': '#000000',
        },
        dark: {
          '--color-brand-navy': '#FFFFFF',
          '--color-brand-emerald': '#5C7CFA',
          '--color-brand-gold': '#FFA726',
          '--color-brand-bg': '#000000',
          '--color-brand-slateBg': '#000000',
          '--color-brand-dark': '#FFFFFF',
          '--color-brand-gray': '#FFFFFF',
          '--color-brand-border': '#FFFFFF',
        },
      },
      purple: {
        light: {
          '--color-brand-navy': '#000000',
          '--color-brand-emerald': '#800080',
          '--color-brand-gold': '#D97706',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#FFFFFF',
          '--color-brand-dark': '#000000',
          '--color-brand-gray': '#000000',
          '--color-brand-border': '#000000',
        },
        dark: {
          '--color-brand-navy': '#FFFFFF',
          '--color-brand-emerald': '#D946EF',
          '--color-brand-gold': '#FFA726',
          '--color-brand-bg': '#000000',
          '--color-brand-slateBg': '#000000',
          '--color-brand-dark': '#FFFFFF',
          '--color-brand-gray': '#FFFFFF',
          '--color-brand-border': '#FFFFFF',
        },
      },
    },
    monochrome: {
      emerald: {
        light: {
          '--color-brand-navy': '#1F2937',
          '--color-brand-emerald': '#4B5563',
          '--color-brand-gold': '#9CA3AF',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F9FAFB',
          '--color-brand-dark': '#111827',
          '--color-brand-gray': '#6B7280',
          '--color-brand-border': '#E5E7EB',
        },
        dark: {
          '--color-brand-navy': '#CBD2D9',
          '--color-brand-emerald': '#8A94A0',
          '--color-brand-gold': '#B8C0CB',
          '--color-brand-bg': '#0B0F14',
          '--color-brand-slateBg': '#161B22',
          '--color-brand-dark': '#F0F2F4',
          '--color-brand-gray': '#9AA3AD',
          '--color-brand-border': '#232A33',
        },
      },
      blue: {
        light: {
          '--color-brand-navy': '#111827',
          '--color-brand-emerald': '#374151',
          '--color-brand-gold': '#808080',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F3F4F6',
          '--color-brand-dark': '#000000',
          '--color-brand-gray': '#555555',
          '--color-brand-border': '#D1D5DB',
        },
        dark: {
          '--color-brand-navy': '#C7CDD6',
          '--color-brand-emerald': '#6B7686',
          '--color-brand-gold': '#A6A6A6',
          '--color-brand-bg': '#08090C',
          '--color-brand-slateBg': '#14161B',
          '--color-brand-dark': '#F0F1F3',
          '--color-brand-gray': '#9CA3AD',
          '--color-brand-border': '#22252C',
        },
      },
      purple: {
        light: {
          '--color-brand-navy': '#030712',
          '--color-brand-emerald': '#1F2937',
          '--color-brand-gold': '#D1D5DB',
          '--color-brand-bg': '#FFFFFF',
          '--color-brand-slateBg': '#F9FAFB',
          '--color-brand-dark': '#000000',
          '--color-brand-gray': '#666666',
          '--color-brand-border': '#E5E7EB',
        },
        dark: {
          '--color-brand-navy': '#C4C9D4',
          '--color-brand-emerald': '#4B5768',
          '--color-brand-gold': '#E5E7EB',
          '--color-brand-bg': '#060709',
          '--color-brand-slateBg': '#121419',
          '--color-brand-dark': '#F0F1F4',
          '--color-brand-gray': '#9CA1AD',
          '--color-brand-border': '#202329',
        },
      },
    },
  } satisfies Record<string, Record<string, ThemeVariant>>,
};

export function getThemeVars(
  colorBlindMode: keyof typeof THEME_PRESETS.modes,
  appThemeColor: keyof typeof THEME_PRESETS.modes.none,
  isDark: boolean = false
): ThemeVars {
  const modePresets = THEME_PRESETS.modes[colorBlindMode];
  const variant = modePresets[appThemeColor] || modePresets.emerald;
  return isDark ? variant.dark : variant.light;
}
