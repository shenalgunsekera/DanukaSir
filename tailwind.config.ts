import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome surfaces
        base: "#0A0A0A",
        ink: "#0E0E0E",
        surface: "#141414",
        elevated: "#1B1B1B",
        line: "rgba(255,255,255,0.10)",
        // Neutral accent system (the "accent" is light grey / white)
        sage: {
          DEFAULT: "#E5E5E5",
          50: "#FAFAFA",
          100: "#F2F2F2",
          200: "#E4E4E4",
          300: "#CFCFCF",
          400: "#D6D6D6",
          500: "#8C8C8C",
          600: "#6E6E6E",
          700: "#545454",
          800: "#3A3A3A",
          900: "#262626",
        },
        // Text (tuned for readable contrast on near-black)
        cloud: "#F6F6F6",
        mist: "#C9C9C9",
        ash: "#9B9B9B",
        // Semantic — desaturated to keep the monochrome feel
        success: "#DDDDDD",
        warning: "#AAAAAA",
        danger: "#EDEDED",
        info: "#C2C2C2",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "0.375rem",
        xl: "0.5rem",
        "2xl": "0.625rem",
        "3xl": "0.75rem",
      },
      boxShadow: {
        glow: "0 1px 0 0 rgba(255,255,255,0.04) inset",
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 18px 40px -28px rgba(0,0,0,0.8)",
        float: "0 24px 60px -28px rgba(0,0,0,0.85)",
      },
      backgroundImage: {
        "sage-grad":
          "linear-gradient(135deg, #FFFFFF 0%, #DADADA 100%)",
        "radial-faint":
          "radial-gradient(900px 500px at 50% -20%, rgba(255,255,255,0.04), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 2s infinite",
        float: "float 7s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
