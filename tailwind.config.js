export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'bg-primary': '#0e100f',
          'bg-secondary': 'rgba(53, 0, 129, 0.7)',
          'accent': '#7c3aed',
          'accent-hover': '#6d28d9',
        }
      },
    },
    plugins: [],
  }