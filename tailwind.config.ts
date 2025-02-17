import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        forecolor: "var(--forecolor)",
        primary: "var(--primary)",
        dimmedforecolor: "var(--dimmedforecolor)",
        foreground: "var(--foreground)",
        sidebarcolor: "var(--sidebarcolor)",
        white: "var(--white)",
      },
    },
  },
  plugins: [],
} satisfies Config;
