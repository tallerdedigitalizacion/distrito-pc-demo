/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
  theme: {
    extend: {
      colors: {
        'dpc-black':    '#0e0e13',
        'dpc-surface':  '#16161e',
        'dpc-surface2': '#1e1e2a',
        'dpc-border':   '#28283c',
        'dpc-orange':   '#ff5200',
        'dpc-orange2':  '#ff7733',
        'dpc-amber':    '#ffaa00',
        'dpc-red':      '#e62200',
        'dpc-text':     '#f0f0f5',
        'dpc-muted':    '#7878a0',
        'dpc-green':    '#00dd88',
        'dpc-wa':       '#25d366',
      },
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-orange': `
          linear-gradient(rgba(255,82,0,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,82,0,0.05) 1px, transparent 1px)
        `,
        'hero-glow': `
          radial-gradient(ellipse at 15% 50%, rgba(255,82,0,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 20%, rgba(255,82,0,0.08) 0%, transparent 40%),
          linear-gradient(160deg, #0e0e13 0%, #12121c 50%, #0a0a10 100%)
        `,
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(255,82,0,0.35), 0 0 60px rgba(255,82,0,0.12)',
        'orange-glow-sm': '0 0 10px rgba(255,82,0,0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,82,0,0.3)',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease-out forwards',
        'marquee':   'marquee 30s linear infinite',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
