'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { PerfilPublico } from '../services/index';
import { useUsuarioAtual } from '../hooks/useUsuarioAtual';

export interface ValorContextoAutenticacao {
  usuario: PerfilPublico | null;
  carregando: boolean;
  recarregar: () => Promise<void>;
}

const ContextoAutenticacao = createContext<ValorContextoAutenticacao | undefined>(undefined);

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const estado = useUsuarioAtual();

  return (
    <ContextoAutenticacao.Provider value={estado}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}

export function useAutenticacao(): ValorContextoAutenticacao {
  const contexto = useContext(ContextoAutenticacao);
  if (!contexto) {
    throw new Error('useAutenticacao deve ser usado dentro de ProvedorAutenticacao');
  }
  return contexto;
}
