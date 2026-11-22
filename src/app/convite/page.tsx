'use client';

import { useEffect } from 'react';
import { iniciarPaginaConvite } from '../../views/convite';

export default function PaginaConvite() {
  useEffect(() => {
    iniciarPaginaConvite();
  }, []);

  return (
    <div className="min-h-dvh bg-bg font-sans">
      <main id="app" />
    </div>
  );
}
