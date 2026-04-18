import type { Config } from "tailwindcss";

/**
 * Apple-inspired design system (Jobs/Ive 2010-2014 era, graphite flavor).
 * Hybrid: Apple bones + developer touches (mono font for code/pricing).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple 真实配色
        bg: {
          DEFAULT: "#fbfbfd",
          elevated: "#ffffff",
          dark: "#1d1d1f",
          darker: "#0a0a0a",
        },
        ink: {
          DEFAULT: "#1d1d1f",
          secondary: "#6e6e73",
          tertiary: "#86868b",
          divider: "#d2d2d7",
          faint: "#f5f5f7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Apple 风格：大号标题专用
        "display-sm": ["40px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display": ["56px", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-lg": ["80px", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-xl": ["96px", { lineHeight: "1", letterSpacing: "-0.035em" }],
      },
      maxWidth: {
        // Apple 官网真实栏宽
        apple: "980px",
        "apple-wide": "1180px",
      },
      boxShadow: {
        // 单层超软阴影，而不是 Tailwind 默认的硬阴影
        apple: "0 20px 50px -20px rgba(0, 0, 0, 0.08)",
        "apple-lg": "0 40px 80px -30px rgba(0, 0, 0, 0.12)",
        hairline: "0 0 0 1px rgba(0, 0, 0, 0.06)",
      },
      backdropBlur: {
        nav: "20px",
      },
      transitionTimingFunction: {
        // Apple 标准缓动
        apple: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
