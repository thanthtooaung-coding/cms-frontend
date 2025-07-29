import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5175,
    cors: true,
  },
  plugins: [react()],

  resolve: {
    alias: {
      '@cms/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@cms/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@cms/data': path.resolve(__dirname, '../../packages/data/src'),
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  css: {
    postcss: path.resolve(__dirname, './postcss.config.mjs'),
  },
});
