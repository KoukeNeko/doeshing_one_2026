import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
      typography: ({ theme }: any) => ({
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
        invert: {
          css: {
            color: theme("colors.zinc.100"),
            a: {
              color: theme("colors.red.400"),
              "&:hover": {
                color: theme("colors.red.300"),
              },
            },
            h1: {
              color: theme("colors.zinc.50"),
            },
            h2: {
              color: theme("colors.zinc.50"),
            },
            h3: {
              color: theme("colors.zinc.50"),
            },
            h4: {
              color: theme("colors.zinc.50"),
            },
            h5: {
              color: theme("colors.zinc.50"),
            },
            h6: {
              color: theme("colors.zinc.50"),
            },
            strong: {
              color: theme("colors.zinc.50"),
            },
            code: {
              color: theme("colors.zinc.50"),
            },
            blockquote: {
              borderLeftColor: theme("colors.red.400"),
              color: theme("colors.zinc.300"),
            },
            "ol > li::marker": {
              color: theme("colors.red.400"),
            },
            "ul > li::marker": {
              color: theme("colors.red.400"),
            },
            hr: {
              borderColor: theme("colors.zinc.700"),
            },
            thead: {
              color: theme("colors.zinc.50"),
              borderBottomColor: theme("colors.zinc.700"),
            },
            "tbody tr": {
              borderBottomColor: theme("colors.zinc.800"),
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
