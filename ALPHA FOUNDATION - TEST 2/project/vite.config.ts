import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@kitchen-ai/core': path.resolve(__dirname, './packages/core/src')
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});