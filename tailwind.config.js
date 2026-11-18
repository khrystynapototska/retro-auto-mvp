/** Дизайн-токени з ЛР 4 + темна тема через клас .dark (утиліти dark:) */
module.exports = {
  darkMode: 'class',
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#002147', hover: '#143A66', active: '#001530' },
        cream: '#FFFDD0',
        secondary: '#0F4C3A',
        accent: { DEFAULT: '#C9A227', hover: '#D8B23A', active: '#8A6B0F' },
        surface: { DEFAULT: '#FFFFFF', base: '#F7F5E8', muted: '#EFEDE0' },
        text: '#1A1A1A',
        muted: '#5C5C5C',
        border: { DEFAULT: '#D8D4C0', strong: '#6B6658' },
        focus: '#2563EB',
        success: '#1E6B3A',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      letterSpacing: { overline: '0.08em' },
      boxShadow: {
        card: '0 1px 3px rgb(0 33 71 / 8%), 0 1px 2px rgb(0 33 71 / 6%)',
        raised: '0 8px 20px rgb(0 33 71 / 12%)',
        overlay: '0 20px 40px rgb(0 33 71 / 20%)',
      },
      maxWidth: { container: '1312px' },
    },
  },
};
