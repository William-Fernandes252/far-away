/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    includeSource: ['src/**/*.{jsx,tsx,js,ts}'],
    globals: true,
    environment: 'jsdom',
  },
});
