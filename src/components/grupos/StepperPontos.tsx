'use client';

import { Icone } from './Icone';

export interface StepperPontosProps {
  valor: number;
  min: number;
  max: number;
  aoMudar: (valor: number) => void;
  rotulo: string;
}

const CLASSE_STEPPER =
  'press flex size-11 items-center justify-center rounded-full bg-surface-2 text-ink hover:bg-[#e6e6e3] disabled:opacity-35';

export function StepperPontos({ valor, min, max, aoMudar, rotulo }: StepperPontosProps) {
  function mudar(passo: number): void {
    aoMudar(Math.min(max, Math.max(min, valor + passo)));
  }

  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label={rotulo}>
      <button
        type="button"
        className={CLASSE_STEPPER}
        aria-label="Diminuir pontos"
        disabled={valor <= min}
        onClick={() => mudar(-1)}
      >
        <Icone nome="Minus" tamanho={18} />
      </button>
      <output className="tnum min-w-14 text-center text-[17px] font-semibold" aria-live="polite">
        {valor}
      </output>
      <button
        type="button"
        className={CLASSE_STEPPER}
        aria-label="Aumentar pontos"
        disabled={valor >= max}
        onClick={() => mudar(1)}
      >
        <Icone nome="Plus" tamanho={18} />
      </button>
    </div>
  );
}
