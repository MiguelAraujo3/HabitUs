'use client';

import { useEffect, useRef } from 'react';
import { icone, type OpcoesIcone } from '../icones';

export interface IconeProps extends OpcoesIcone {
  nome: string;
}

export function Icone({ nome, tamanho, classe, espessura, preencher }: IconeProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const svg = icone(nome, { tamanho, classe, espessura, preencher });
    container.replaceChildren(svg);
  }, [nome, tamanho, classe, espessura, preencher]);

  return <span ref={ref} className="inline-flex items-center" />;
}
