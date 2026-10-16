import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'header': path.resolve(__dirname, './src/componets/menu/header.js'),
      'style': path.resolve(__dirname, './src/style.css')
    }
  },
  plugins: [
    tailwindcss(),
  ],
  base: '/habit-tracker/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        conta: resolve(import.meta.dirname, 'conta/index.html'),
        todo: resolve(import.meta.dirname, 'todo/index.html'),
        categorias: resolve(import.meta.dirname, 'categorias/index.html'),
        login: resolve(import.meta.dirname, 'login/index.html'),
        cadastro: resolve(import.meta.dirname, 'cadastro/index.html'),
        habitos: resolve(import.meta.dirname, 'habitos/index.html'),
      },
    },
  },
});