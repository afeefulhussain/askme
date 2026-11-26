import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#0A0D14",
          50: "#1A2234",
          100: "#151B2A",
          200: "#101622",
          300: "#0D111A",
          400: "#0A0D14", // Terminal Void
          500: "#07090E",
          card: "#0D121D",
          border: "#1E2738",
          subtle: "#161E2E",
        },
        cyan: {
          axon: "#00F0FF", // Axon Cyan
          glow: "rgba(0, 240, 255, 0.15)",
        },
        circuit: {
          green: "#10B981", // Circuit Green
          glow: "rgba(16, 185, 129, 0.15)",
        },
      },
      fontFamily: {
        serif: [
          "var(--font-serif)",
          '"Times New Roman"',
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          '"JetBrains Mono"',
          "Consolas",
          "monospace",
        ],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-pattern": "36px 36px",
      },
    },
  },
  plugins: [],
};
export default config;
