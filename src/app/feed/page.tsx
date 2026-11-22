'use client';

import { useEffect } from 'react';
import { iniciarPaginaFeed } from '../../views/feed';
import { iniciarPainelHabitos } from '../../views/painel-habitos';

export default function PaginaFeed() {
  useEffect(() => {
    iniciarPaginaFeed();
    iniciarPainelHabitos();
  }, []);

  return (
    <div className="flex h-screen flex-row overflow-hidden bg-brand-ice font-sans">
      <div id="menu" />
      <div className="flex min-w-0 flex-1 overflow-y-auto">
        <main id="app" className="min-w-0 flex-1 p-4">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Feed</h1>
                <p className="text-sm">O que está acontecendo nos hábitos de todo mundo.</p>
              </div>
              <button
                id="btn-nova-postagem"
                type="button"
                className="shrink-0 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                + Nova postagem
              </button>
            </header>

            <input
              id="campo-busca"
              type="search"
              aria-label="Buscar por nome de usuário"
              placeholder="Buscar por @usuário"
              className="w-full rounded-lg bg-black/5 px-4 py-2.5 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <ul id="lista-postagens" className="flex flex-col gap-4" />

            <p
              id="estado-vazio"
              hidden
              className="rounded-xl bg-white p-6 text-center text-sm text-gray-600"
            >
              Ainda não há postagens. Que tal ser a primeira pessoa a postar?
            </p>
          </div>
        </main>
        <aside id="painel-habitos" className="sticky top-0 hidden w-72 shrink-0 self-start py-4 pr-4 lg:block" />
      </div>
    </div>
  );
}
