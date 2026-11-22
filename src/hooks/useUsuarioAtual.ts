'use client';

import { useEffect, useState } from 'react';
import { obterUsuarioAtual, type PerfilPublico } from '../services/index';

export function useUsuarioAtual() {
  const [usuario, setUsuario] = useState<PerfilPublico | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function recarregar(): Promise<void> {
    setCarregando(true);
    try {
      const atual = await obterUsuarioAtual();
      setUsuario(atual);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    recarregar();
  }, []);

  return { usuario, carregando, recarregar };
}
