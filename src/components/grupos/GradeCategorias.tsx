'use client';

import { VISUAL_CATEGORIAS } from '../categoriasVisual';
import { FAMILIAS, juntar } from '../ui';
import { Icone } from './Icone';

export interface GradeCategoriasProps {
  valor: string;
  aoMudar: (rotulo: string) => void;
  erro?: string;
}

export function GradeCategorias({ valor, aoMudar, erro }: GradeCategoriasProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Categoria">
        {VISUAL_CATEGORIAS.map((categoria) => {
          const ligada = valor === categoria.rotulo;
          return (
            <button
              key={categoria.rotulo}
              type="button"
              role="radio"
              aria-checked={ligada}
              className={juntar(
                'press flex min-h-[56px] items-center gap-2 rounded-[12px] border px-3 py-2 text-left text-[14px] leading-[18px] font-medium',
                ligada
                  ? 'border-action bg-action-tint ring-1 ring-action'
                  : 'border-line bg-surface hover:bg-surface-2'
              )}
              onClick={() => aoMudar(categoria.rotulo)}
            >
              <span
                className={juntar(
                  'flex size-8 shrink-0 items-center justify-center rounded-full',
                  FAMILIAS[categoria.familia]
                )}
              >
                <Icone nome={categoria.icone} tamanho={16} />
              </span>
              <span className="min-w-0 flex-1">{categoria.rotulo}</span>
              {ligada && <Icone nome="Check" tamanho={16} classe="shrink-0 text-action" />}
            </button>
          );
        })}
      </div>
      {erro && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-danger">
          <Icone nome="AlertCircle" tamanho={15} />
          {erro}
        </p>
      )}
    </div>
  );
}
