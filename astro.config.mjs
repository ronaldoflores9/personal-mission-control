// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Centro de Mando',
        short_name: 'ACM',
        description: 'Centro de mando personal — misiones, horario y motivación.',
        theme_color: '#4ea8ff',
        background_color: '#0b1220',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: null,
      },
      devOptions: { enabled: false },
    }),
  ],
});
