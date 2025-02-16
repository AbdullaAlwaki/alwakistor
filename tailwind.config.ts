/** @type {import('tailwindcss').Config} */
const config: import('tailwindcss').Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // تمكين الوضع الداكن باستخدام الفصول (class)
  theme: {
    extend: {
      colors: {
        // ألوان الخلفية والنص
        background: "var(--background)",
        foreground: "var(--foreground)",

        // الألوان الأساسية (Primary)
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#1E40AF", // اللون الأساسي
          600: "#1E3A8A", // اللون عند التحويم
          700: "#153E75",
          800: "#17254B",
          900: "#121F3E",
        },

        // الألوان الثانوية (Secondary)
        secondary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FACC15", // اللون الأساسي
          600: "#F59E0B", // اللون عند التحويم
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },

        // ألوان الرمادي
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280", // اللون الأساسي
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // خط أساسي للتطبيق
        serif: ["Merriweather", "serif"], // خط ثانوي للعناوين
      },
      boxShadow: {
        custom: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;