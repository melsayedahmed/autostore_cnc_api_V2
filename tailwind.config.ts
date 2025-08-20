import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: process.env.NEXT_PUBLIC_BORDER_COLOR || "hsl(var(--border))",
        input: process.env.NEXT_PUBLIC_INPUT_COLOR || "hsl(var(--input))",
        ring: process.env.NEXT_PUBLIC_RING_COLOR || "hsl(var(--ring))",
        background: process.env.NEXT_PUBLIC_BACKGROUND_COLOR || "hsl(var(--background))",
        foreground: process.env.NEXT_PUBLIC_FOREGROUND_COLOR || "hsl(var(--foreground))",
        primary: {
          DEFAULT: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "hsl(var(--primary))",
          foreground: process.env.NEXT_PUBLIC_PRIMARY_FOREGROUND_COLOR || "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "hsl(var(--secondary))",
          foreground: process.env.NEXT_PUBLIC_SECONDARY_FOREGROUND_COLOR || "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: process.env.NEXT_PUBLIC_DESTRUCTIVE_COLOR || "hsl(var(--destructive))",
          foreground: process.env.NEXT_PUBLIC_DESTRUCTIVE_FOREGROUND_COLOR || "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: process.env.NEXT_PUBLIC_MUTED_COLOR || "hsl(var(--muted))",
          foreground: process.env.NEXT_PUBLIC_MUTED_FOREGROUND_COLOR || "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: process.env.NEXT_PUBLIC_ACCENT_COLOR || "hsl(var(--accent))",
          foreground: process.env.NEXT_PUBLIC_ACCENT_FOREGROUND_COLOR || "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: process.env.NEXT_PUBLIC_POPOVER_COLOR || "hsl(var(--popover))",
          foreground: process.env.NEXT_PUBLIC_POPOVER_FOREGROUND_COLOR || "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: process.env.NEXT_PUBLIC_CARD_COLOR || "hsl(var(--card))",
          foreground: process.env.NEXT_PUBLIC_CARD_FOREGROUND_COLOR || "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
