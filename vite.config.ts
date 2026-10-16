import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { normalizeBasePath } from './src/domain/base-path.ts';
const base = normalizeBasePath(process.env.BASE_PATH ?? '/');
const staticCsp =
  "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'";
export default defineConfig({
  base,
  plugins: [
    react(),
    {
      name: 'refugio-static-security',
      apply: 'build',
      transformIndexHtml() {
        return [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: staticCsp },
            injectTo: 'head-prepend',
          },
        ];
      },
    },
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      manifest: {
        name: 'Refugio · Un paso a la vez',
        short_name: 'Refugio',
        description: 'Tu plan personal, tus herramientas y tu red de apoyo.',
        lang: 'es-CO',
        start_url: base,
        scope: base,
        display: 'standalone',
        theme_color: '#183B46',
        background_color: '#F6F3ED',
        icons: [
          { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png' },
          {
            src: `${base}icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        maximumFileSizeToCacheInBytes: 1024 * 1024,
      },
      devOptions: { enabled: false },
    }),
  ],
  build: { sourcemap: false, target: 'es2022' },
});
