import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/json2markdown-renderer/'
    : '/',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
});
