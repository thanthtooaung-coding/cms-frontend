import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@cms/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@cms/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@cms/data': path.resolve(__dirname, '../../packages/data/src'),
    },
  },
  css: {
    postcss: path.resolve(__dirname, './postcss.config.mjs'),
  },
});
