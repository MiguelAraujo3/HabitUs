'use client';

import { useEffect } from 'react';
import { iniciarPaginaPerfil } from '../../views/perfil';
import { iniciarPainelHabitos } from '../../views/painel-habitos';

export default function PaginaPerfil() {
  useEffect(() => {
    iniciarPaginaPerfil();
    iniciarPainelHabitos();
  }, []);

  return (
    <div className="flex h-screen flex-row overflow-hidden bg-brand-ice font-sans max-[700px]:h-auto max-[700px]:min-h-screen max-[700px]:flex-col max-[700px]:overflow-auto">
      <div id="menu" />
      <div className="flex min-w-0 flex-1 overflow-y-auto max-[700px]:overflow-visible">
        <main id="app" className="min-w-0 flex-1 p-[clamp(20px,5vw,64px)] max-[700px]:px-3 max-[700px]:py-5" />
        <aside
          id="painel-habitos"
          className="sticky top-0 hidden w-72 shrink-0 self-start pt-[clamp(20px,5vw,64px)] pr-4 lg:block"
        />
      </div>
    </div>
  );
}
