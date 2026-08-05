/** @type {import('tailwindcss').Config} */
module.exports = { darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: 'var(--color-brand-navy)',
          emerald: 'var(--color-brand-emerald)',
          gold: 'var(--color-brand-gold)',
          bg: 'var(--color-brand-bg)',
          slateBg: 'var(--color-brand-slateBg)',
          dark: 'var(--color-brand-dark)',
          gray: 'var(--color-brand-gray)',
          border: 'var(--color-brand-border)',
        }
      },
      fontFamily: {
        inter: ['Poppins_400Regular'],
        'inter-medium': ['Poppins_500Medium'],
        'inter-semibold': ['Poppins_600SemiBold'],
        'inter-bold': ['Poppins_700Bold'],
        'inter-extrabold': ['Poppins_800ExtraBold'],
        poppins: ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
        'poppins-extrabold': ['Poppins_800ExtraBold'],
        jakarta: ['PlusJakartaSans_700Bold'],
        'jakarta-extrabold': ['PlusJakartaSans_800ExtraBold'],
      }
    },
  },
  plugins: [],
};
