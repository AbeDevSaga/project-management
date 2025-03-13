import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
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
        navbarbg: "var(--navbarbg)",
        titleFg: "var(--titleFg)",
        sidebarcolor: "var(--sidebarcolor)",
        white: "var(--white)",
        totalUserFg: "var(--totalUserFg)",
        totalUserBg: "var(--totalUserBg)",
        activeUserFg: "var(--activeUserFg)",
        activeUserBg: "var(--activeUserBg)",
        totalRevenuFg: "var(--totalRevenuFg)",
        totalRevenuBg: "var(--totalRevenuBg)",
        newUserFg: "var(--newUserFg)",
        newUserBg: "var(--newUserBg)",
        premiumUserFg: "var(--premiumUserFg)",
        premiumUserBg: "var(--premiumUserBg)",
      },
    },
  },
  plugins: [],
} satisfies Config;
