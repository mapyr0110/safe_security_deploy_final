export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        surfaceAlt: "rgb(var(--color-surface-alt) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-border) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        contrast: "rgb(var(--color-contrast) / <alpha-value>)",
        contrastText: "rgb(var(--color-contrast-text) / <alpha-value>)"
      },
      fontFamily: {
        display: ["system-ui", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"]
      },
      boxShadow: {
        editorial: "0 20px 48px rgb(var(--color-shadow) / 0.14)"
      }
    }
  },
  plugins: []
};
