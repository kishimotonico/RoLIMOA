import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': `${__dirname}/src`,
    },
  },
} satisfies UserConfig;
