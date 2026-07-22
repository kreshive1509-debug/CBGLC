import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_URL?.trim() || 'http://127.0.0.1:3000';

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',

      // Disable file watching when DISABLE_HMR is true.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},

      // Allow your Render domain
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
      allowedHosts: [
        'cbgl.onrender.com',
      ],
    },

    preview: {
      allowedHosts: [
        'cbgl.onrender.com',
      ],
    },
  };
});
