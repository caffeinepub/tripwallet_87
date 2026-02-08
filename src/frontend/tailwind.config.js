/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    extend: {
      fontFamily: {
        // Elegant serif for headings and display text
        display: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        // Refined geometric sans-serif for body text
        sans: [
          "Manrope",
          "DM Sans",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        // Professional monospace for currency and numbers
        mono: ["JetBrains Mono", "Courier Prime", "monospace"],
      },
      colors: {
        // TripWallet brand colors - refined travel palette
        travel: {
          // Deep navy/indigo - trust, sophistication, travel
          navy: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            950: "#020617",
          },
          // Warm amber/gold - adventure, warmth, highlights
          amber: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
          },
          // Sage/emerald green - prosperity, calm, success
          sage: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
          },
          // Warm neutrals - sophisticated backgrounds
          stone: {
            50: "#fafaf9",
            100: "#f5f5f4",
            200: "#e7e5e4",
            300: "#d6d3d1",
            400: "#a8a29e",
            500: "#78716c",
            600: "#57534e",
            700: "#44403c",
            800: "#292524",
            900: "#1c1917",
          },
        },
        // Legacy brand colors for backward compatibility
        brand: {
          bg: "#fafaf9",
          surface: "#ffffff",
          orange: {
            400: "#fbbf24",
            500: "#f59e0b",
            600: "#d97706",
          },
          gray: {
            100: "#f5f5f4",
            200: "#e7e5e4",
            300: "#d6d3d1",
            400: "#a8a29e",
            500: "#78716c",
            600: "#57534e",
            800: "#292524",
          },
        },
      },
      fontSize: {
        "display-lg": [
          "3.5rem",
          { lineHeight: "1.1", fontWeight: "600", letterSpacing: "-0.02em" },
        ],
        display: [
          "2.5rem",
          { lineHeight: "1.2", fontWeight: "600", letterSpacing: "-0.02em" },
        ],
        "display-sm": [
          "2rem",
          { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.01em" },
        ],
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        "soft-lg":
          "0 4px 16px 0 rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.03)",
        "soft-xl":
          "0 8px 32px 0 rgba(0, 0, 0, 0.08), 0 4px 8px 0 rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "slide-in": "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
