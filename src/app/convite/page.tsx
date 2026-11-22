'use client';

import { useEffect, useRef } from 'react';
import { iniciarPaginaConvite } from '../../views/convite';

export default function PaginaConvite() {
  const iniciado = useRef(false);
  useEffect(() => {
    if (iniciado.current) return;
    iniciado.current = true;
    iniciarPaginaConvite();
  }, []);

  return (
    <div className="min-h-dvh bg-bg font-sans">
      <main id="app" />
    </div>
  );
}
