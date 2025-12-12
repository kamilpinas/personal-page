import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
                extend: {
                colors: {        bg: "#0b0c10",
        surface: "#0f1115",
        "surface-2": "#12151c",
        muted: "#141824",
        line: "#1c2230",
        text: "#e5e7eb",
        "text-muted": "#a1a7b3",
        silver: {
          300: "#d7dbe2",
          400: "#c0c6cf",
          500: "#b3bac5",
          600: "#9aa2ad",
        },
      },
      boxShadow: {
        "glow-silver":
          "0 0 0 1px rgba(192,192,192,0.22), 0 0 24px rgba(192,192,192,0.30)",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: "0.75", filter: "blur(12px)" },
          "50%": { opacity: "1", filter: "blur(8px)" },
        },
        sheen: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)" },
          "100%": { transform: "translateX(200%) skewX(-15deg)" },
        },
      },
      animation: {
        glow: "glow 2.4s ease-in-out infinite alternate",
        sheen: "sheen 1s forwards",
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /col-span-(1[0-2]|[1-9])/ },
    { pattern: /row-span-(1[0-2]|[1-9])/ },
  ],
} satisfies Config