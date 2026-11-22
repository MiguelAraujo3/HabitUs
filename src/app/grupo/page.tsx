'use client';

import { useEffect, useRef } from 'react';
import { iniciarPaginaGrupo } from '../../views/grupo';
import { iniciarPainelHabitos } from '../../views/painel-habitos';

export default function PaginaGrupo() {
  const iniciado = useRef(false);
  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;
    iniciarPaginaGrupo();
    iniciarPainelHabitos();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bg font-sans">
      <div id="menu" className="hidden shrink-0 md:block" />
      <main id="app" className="no-scrollbar min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1060px] justify-center gap-8 px-4 md:px-6 lg:px-8">
          <div id="conteudo" className="min-w-0 max-w-[680px] flex-1 pb-28 md:pb-16" />
          <aside id="painel-habitos" className="hidden w-72 shrink-0 self-start pt-6 lg:sticky lg:top-0 lg:block" />
        </div>
      </main>
    </div>
  );
}
