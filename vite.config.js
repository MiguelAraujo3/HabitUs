import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

const raiz = import.meta.dirname;

export default defineConfig({
  base: '/habit-tracker/',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(raiz, 'index.html'),
        habitos: resolve(raiz, 'habitos.html'),
        perfil: resolve(raiz, 'perfil.html'),
        feed: resolve(raiz, 'feed.html'),
        grupos: resolve(raiz, 'grupos.html'),
        'criar-grupo': resolve(raiz, 'criar-grupo.html'),
        grupo: resolve(raiz, 'grupo.html'),
        convite: resolve(raiz, 'convite.html'),
      },
    },
  },
});