/** @type {import('tailwindcss').Config} */
module.exports = {
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
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
        poppins: ['Poppins_700Bold'],
        'poppins-extrabold': ['Poppins_800ExtraBold'],
        jakarta: ['PlusJakartaSans_700Bold'],
        'jakarta-extrabold': ['PlusJakartaSans_800ExtraBold'],
      }
    },
  },
  plugins: [],
};
