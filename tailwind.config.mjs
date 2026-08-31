/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        void: 'var(--void)',
        'void-2': 'var(--void-2)',
        panel: 'var(--panel)',
        'panel-line': 'var(--panel-line)',
        ink: 'var(--ink)',
        'ink-dim': 'var(--ink-dim)',
        ion: 'var(--ion)',
        'ion-dim': 'var(--ion-dim)',
        flame: 'var(--flame)',
        'flame-dim': 'var(--flame-dim)',
        telemetry: 'var(--telemetry)',
        blush: 'var(--blush)',
        parchment: 'var(--parchment)',
        graphite: 'var(--graphite)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Work Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '14px',
        sm: '8px',
      },
      keyframes: {
        pop: {
          from: { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pop: 'pop 0.35s ease',
        'fade-in': 'fade-in 0.2s ease',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
