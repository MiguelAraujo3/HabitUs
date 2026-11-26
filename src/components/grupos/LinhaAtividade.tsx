'use client';

import { CLASSE_INPUT } from '../ui';
import { Icone } from './Icone';
import { StepperPontos } from './StepperPontos';

export interface AtividadeFormulario {
  id: number;
  nome: string;
  pontos: number;
}

export interface LinhaAtividadeProps {
  atividade: AtividadeFormulario;
  indice: number;
  podeRemover: boolean;
  aoMudarNome: (nome: string) => void;
  aoMudarPontos: (pontos: number) => void;
  aoRemover: () => void;
}

export function LinhaAtividade({
  atividade,
  indice,
  podeRemover,
  aoMudarNome,
  aoMudarPontos,
  aoRemover,
}: LinhaAtividadeProps) {
  return (
    <li className="rounded-[14px] bg-surface p-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className={CLASSE_INPUT}
          placeholder="Ex.: Treino de 30 min"
          value={atividade.nome}
          aria-label={`Nome da atividade ${indice + 1}`}
          onChange={(e) => aoMudarNome(e.target.value)}
        />
        {podeRemover && (
          <button
            type="button"
            className="press flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger"
            aria-label={`Remover atividade ${indice + 1}`}
            onClick={aoRemover}
          >
            <Icone nome="Trash2" tamanho={18} />
          </button>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[14px] text-ink-2">Pontos por conclusão</span>
        <StepperPontos
          valor={atividade.pontos}
          min={1}
          max={10}
          rotulo="pontos"
          aoMudar={aoMudarPontos}
        />
      </div>
    </li>
  );
}
