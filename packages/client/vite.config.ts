import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

const PROXY_HOST = process.env.VITE_PROXY_HOST || 'localhost:8000';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': `${__dirname}/src`,
    },
  },
  server: {
    proxy: {
      '/ws': {
        target: `ws://${PROXY_HOST}`,
        ws: true,
      },
      '/api': {
        target: `http://${PROXY_HOST}`,
        changeOrigin: true,
      },
    },
  },
} satisfies UserConfig;
