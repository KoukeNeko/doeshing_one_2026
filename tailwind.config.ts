import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/features/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx,mdx}",
    "./src/styles/**/*.{ts,tsx,css}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        newspaper: {
          ink: "#1a1a1a",
          paper: "#fafafa",
          accent: "#dc2626",
          gray: "#6b7280",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Merriweather", "serif"],
        sans: ["Inter", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      maxWidth: {
        prose: "65ch",
      },
      boxShadow: {
        editorial: "0 15px 40px rgba(0, 0, 0, 0.05)",
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      gridTemplateColumns: {
        editorial: "repeat(auto-fit, minmax(18rem, 1fr))",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.newspaper.ink"),
            maxWidth: "65ch",
            a: {
              color: theme("colors.newspaper.accent"),
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            },
            h1: {
              fontFamily: theme("fontFamily.serif").join(", "),
              letterSpacing: theme("letterSpacing.tightest"),
              marginBottom: theme("spacing.8"),
            },
            h2: {
              fontFamily: theme("fontFamily.serif").join(", "),
            },
            h3: {
              fontFamily: theme("fontFamily.serif").join(", "),
            },
            code: {
              fontFamily: theme("fontFamily.mono").join(", "),
              fontWeight: 500,
            },
            blockquote: {
              borderLeftColor: theme("colors.newspaper.accent"),
              fontStyle: "normal",
              paddingLeft: theme("spacing.6"),
            },
            "ol > li::marker": {
              color: theme("colors.newspaper.accent"),
            },
            "ul > li::marker": {
              color: theme("colors.newspaper.accent"),
            },
            hr: {
              borderColor: theme("colors.newspaper.gray"),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
