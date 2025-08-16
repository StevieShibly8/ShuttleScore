/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        app: {
          black: "#000000",
          white: "#FFFFFF",
          primary: "#6c935c",
          secondary: "#6366F1",
          success: "#22C55E",
          info: "#3B82F6",
          warning: "#F59E0B",
          danger: "#921721bc",
          background: "#1b2129ff",

          // Card styles
          card: "rgba(255, 255, 255, 0.05)",
          "card-border": "rgba(255, 255, 255, 0.1)",
          "card-hover": "rgba(255, 255, 255, 0.08)",

          // Success variants
          "success-card": "rgba(34, 197, 94, 0.08)",
          "success-border": "rgba(34, 197, 94, 0.2)",
          "success-hover": "rgba(34, 197, 94, 0.12)",

          // Primary variants
          "primary-card": "rgba(108, 147, 92, 0.08)",
          "primary-border": "rgba(108, 147, 92, 0.2)",
          "primary-hover": "rgba(108, 147, 92, 0.12)",

          // Text colors
          "text-primary": "#FFFFFF",
          "text-secondary": "rgba(255, 255, 255, 0.8)",
          "text-muted": "rgba(255, 255, 255, 0.6)",
          "text-disabled": "rgba(255, 255, 255, 0.4)",

          // Modal/overlay
          overlay: "rgba(0, 0, 0, 0.5)",
          "modal-bg": "#1F2937",
          "modal-border": "rgba(255, 255, 255, 0.1)",

          // Interactive states
          selected: "rgba(59, 130, 246, 0.15)",
          "selected-border": "#3B82F6",
          disabled: "rgba(107, 114, 128, 0.5)",
        },
      },
      borderRadius: {
        "xl-plus": "20px",
        "2xl-plus": "24px",
        "3xl": "28px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "2xl-plus": "1.75rem", // 28px
        "3xl": "2rem", // 32px
        "4xl": "2.5rem", // 40px
        "5xl": "3rem", // 48px
        "6xl": "3.75rem", // 60px
      },
      fontWeight: {
        800: "800",
      },
    },
  },
  plugins: [],
};
