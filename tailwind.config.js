/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#f5f5f7',    // Apple 背景灰
          50: '#ffffff',
          100: '#fafafa',
          200: '#f0f0f2',
        },
        stellar: {
          DEFAULT: '#0071e3',    // Apple 蓝
          light: '#e8f4fd',
        },
        aurora: {
          DEFAULT: '#ac39ff',    // 明亮紫
          light: '#f5edff',
        },
        amber: {
          DEFAULT: '#ff9f0a',    // Apple 橙
          light: '#fff5e6',
        },
        neon: {
          DEFAULT: '#30d158',    // Apple 绿
          light: '#e6f9ed',
        },
        rose: {
          DEFAULT: '#ff375f',    // Apple 红/粉
          light: '#ffe8ed',
        },
        teal: {
          DEFAULT: '#5ac8fa',    // Apple 青
          light: '#e6f6fd',
        },
        frost: {
          DEFAULT: '#1d1d1f',    // Apple 深色文字
          100: '#f5f5f7',
          200: '#e8e8ed',
          300: '#aeaeb2',
          400: '#86868b',
          500: '#6e6e73',
          600: '#515154',
          700: '#1d1d1f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'apple': '20px',
        'apple-lg': '28px',
      },
      boxShadow: {
        'apple': '0 2px 12px rgba(0,0,0,0.04)',
        'apple-hover': '0 8px 30px rgba(0,0,0,0.08)',
        'apple-lg': '0 4px 20px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
