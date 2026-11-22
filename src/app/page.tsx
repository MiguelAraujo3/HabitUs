'use client';

import { useEffect, useRef } from 'react';
import { iniciarPaginaInicial } from '../views/inicial';

export default function PaginaInicial() {
  const iniciado = useRef(false);
  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;
    iniciarPaginaInicial();
  }, []);

  return (
    <div className="flex h-screen flex-row overflow-hidden bg-brand-ice font-sans">
      <main id="app" className="flex flex-1 items-center justify-center overflow-y-auto p-4 w-full" />
    </div>
  );
}
