// Tipos do domínio dos hábitos. Espelham as factories de src/data/modelo.js.
// Este arquivo só tem tipos: não existe em tempo de execução (os imports daqui usam "import type").

// Como o hábito se repete. Cada tipo carrega só os campos que fazem sentido para ele.
export type FrequenciaDiaria = { tipo: 'diaria' };
export type FrequenciaDiasSemana = { tipo: 'dias-semana'; dias: number[]; historico?: PeriodoDias[] }; // 0 = domingo ... 6 = sábado
export type FrequenciaVezesSemana = { tipo: 'vezes-semana'; vezes: number }; // meta de 1 a 7 por semana

export type Frequencia = FrequenciaDiaria | FrequenciaDiasSemana | FrequenciaVezesSemana;
export type TipoFrequencia = Frequencia['tipo'];

export interface Habito {
  id: string;
  idUsuario: string;
  nome: string;
  categoria: string; // chave da lista fixa (saude, esportes...)
  descricao: string;
  frequencia: Frequencia;
  dataCriacao: string; // 'AAAA-MM-DD'
  ativo: boolean;
}

export interface ConclusaoHabito {
  id: string;
  idHabito: string;
  data: string; // 'AAAA-MM-DD'
}

// Resultado de calcularSequencia (src/rules/streak.js). Sempre em dias.
export interface Sequencia {
  atual: number;
  maior: number;
}

export interface PeriodoDias {
  ate: string;     // último dia (AAAA-MM-DD) em que estes dias valeram
  dias: number[];
}