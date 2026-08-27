import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { execSync } from 'node:child_process';
import packageJson from './package.json';
// @ts-ignore
import { saveFishDataPlugin } from './vite/vite-plugin-save-fish-data.ts';

// Gitのショートコミットハッシュを取得
const getGitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
};

// Gitの通算コミット数をビルド番号として取得
const getBuildNumber = () => {
  try {
    return execSync('git rev-list --count HEAD').toString().trim();
  } catch {
    return '0';
  }
};

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __COMMIT_HASH__: JSON.stringify(getGitHash()),
    __BUILD_NUMBER__: JSON.stringify(getBuildNumber()),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString().split('T')[0]),
  },
  plugins: [
    react(),
    tailwindcss(),
    saveFishDataPlugin(),
  ],
});