/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        "background": "#F7F7F7",
        "foreground": "#000000",

        "card": "#FFFFFF",
        "card-foreground": "#000000",

        "popover": "#",
        "popover-foreground": "#000000",

        "primary": "#000000",
        "primary-foreground": "#",

        "secondary": "#DDDDDD",
        "secondary-foreground": "#333333",

        "secondary": "#AAAAAA",
        "secondary-foreground": "#666666",

        "muted": "#A9A9A9",
        "muted-foreground": "#6E6E6E",

        "accent": "#007AFF",
        "accent-foreground": "#FFFFFF",

        "destructive": "#FF0000",
        "destructive-foreground": "#FFFFFF",

        "border": "#CCCCCC",
        "input": "#999999",
        "ring": "#666666",

        "radius": "0.5rem",
      },
      borderRadius: {
        lg: "var(radius)",
        md: "calc(var(radius) - 2px)",
        sm: "calc(var(radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
