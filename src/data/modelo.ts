import type { ConclusaoHabito, Frequencia, Habito } from '../types/habito.js';
import { paraChave, hoje } from '../utils/datas.js';

export interface Grupo {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  idDono: string;
  codigoConvite: string;
  encerrado: boolean;
  rankingFinal: unknown[] | null;
}

export interface Atividade {
  id: string;
  idGrupo: string;
  nome: string;
  pontos: number;
}

export interface Membro {
  id: string;
  idGrupo: string;
  idUsuario: string;
  dataEntrada: string;
  bloqueado: boolean;
}

export interface ConclusaoGrupo {
  id: string;
  idGrupo: string;
  idAtividade: string;
  idUsuario: string;
  data: string;
  foto: string | null;
  texto: string;
}

export interface PostagemModelo {
  id: string;
  idUsuario: string;
  idHabito: string;
  texto: string;
  imagem: string | null;
  dataHora: string;
}

export interface ComentarioModelo {
  id: string;
  idPostagem: string;
  idUsuario: string;
  texto: string;
  dataHora: string;
}

export interface CurtidaModelo {
  id: string;
  idPostagem: string;
  idUsuario: string;
}

export interface RegistroRecordes {
  id: string;
  idUsuario: string;
  maiorSequencia: number;
}

export interface TotalUsuario {
  id: string;
  idUsuario: string;
  atividadesConcluidas: number;
}

// Factory: Habito
// frequencia: { tipo: 'diaria' | 'dias-semana' | 'vezes-semana', dias?: number[], vezes?: number }
export function criarHabito({
  idUsuario,
  nome,
  categoria,
  descricao,
  frequencia,
  id: _id,
}: {
  idUsuario: string;
  nome: string;
  categoria: string;
  descricao?: string;
  frequencia: Frequencia;
  id?: string;
}): Habito {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idUsuario,
    nome,
    categoria,
    descricao: descricao ?? '',
    frequencia,
    dataCriacao: paraChave(hoje()),
    ativo: true,
  };
}

// Factory: ConclusaoHabito
export function criarConclusaoHabito({
  idHabito,
  data,
  id: _id,
}: {
  idHabito: string;
  data?: string;
  id?: string;
}): ConclusaoHabito {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idHabito,
    data: data || paraChave(hoje()),
  };
}

// Factory: Grupo
// idDono: id do usuario dono. codigoConvite: string para convite ao grupo.
export function criarGrupo({
  nome,
  categoria,
  descricao,
  dataInicio,
  dataFim,
  idDono,
  codigoConvite,
  id: _id,
}: {
  nome: string;
  categoria: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  idDono: string;
  codigoConvite: string;
  id?: string;
}): Grupo {
  const grupoId = _id ?? crypto.randomUUID();
  return {
    id: grupoId,
    nome,
    categoria,
    descricao: descricao ?? '',
    dataInicio,
    dataFim,
    idDono,
    codigoConvite,
    encerrado: false,
    rankingFinal: null,
  };
}

// Factory: Atividade
// pontos deve ser inteiro de 1 a 10; senão lança Error
export function criarAtividade({
  idGrupo,
  nome,
  pontos,
  id: _id,
}: {
  idGrupo: string;
  nome: string;
  pontos: number;
  id?: string;
}): Atividade {
  if (!Number.isInteger(pontos) || pontos < 1 || pontos > 10) {
    throw new Error('Pontos inválido: deve ser inteiro entre 1 e 10');
  }
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idGrupo,
    nome,
    pontos,
  };
}

// Factory: Membro
// bloqueado: false por padrão se não informado
// dataEntrada: string ISO com data e hora (para desempate de membro mais antigo)
export function criarMembro({
  idGrupo,
  idUsuario,
  dataEntrada,
  bloqueado,
  id: _id,
}: {
  idGrupo: string;
  idUsuario: string;
  dataEntrada?: string;
  bloqueado?: boolean;
  id?: string;
}): Membro {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idGrupo,
    idUsuario,
    dataEntrada: dataEntrada || new Date().toISOString(),
    bloqueado: bloqueado !== undefined ? bloqueado : false,
  };
}

// Factory: ConclusaoGrupo
export function criarConclusaoGrupo({
  idGrupo,
  idAtividade,
  idUsuario,
  data,
  foto,
  texto,
  id: _id,
}: {
  idGrupo: string;
  idAtividade: string;
  idUsuario: string;
  data?: string;
  foto?: string | null;
  texto?: string;
  id?: string;
}): ConclusaoGrupo {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idGrupo,
    idAtividade,
    idUsuario,
    data: data || paraChave(hoje()),
    foto: foto ?? null,
    texto: texto ?? '',
  };
}

// Factory: Postagem
export function criarPostagem({
  idUsuario,
  idHabito,
  texto,
  imagem,
  id: _id,
}: {
  idUsuario: string;
  idHabito: string;
  texto: string;
  imagem: string | null;
  id?: string;
}): PostagemModelo {
  const id = _id ?? crypto.randomUUID();
  const dataHora = new Date().toISOString();
  return {
    id,
    idUsuario,
    idHabito,
    texto,
    imagem,
    dataHora,
  };
}

// Factory: Comentario
export function criarComentario({
  idPostagem,
  idUsuario,
  texto,
  dataHora,
  id: _id,
}: {
  idPostagem: string;
  idUsuario: string;
  texto: string;
  dataHora?: string;
  id?: string;
}): ComentarioModelo {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idPostagem,
    idUsuario,
    texto,
    dataHora: dataHora || new Date().toISOString(),
  };
}

// Factory: Curtida
export function criarCurtida({
  idPostagem,
  idUsuario,
  id: _id,
}: {
  idPostagem: string;
  idUsuario: string;
  id?: string;
}): CurtidaModelo {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idPostagem,
    idUsuario,
  };
}

// Factory: RegistroRecordes (por usuario)
// Se id nao for informado, usa-se idUsuario como chave identificadora
export function criarRegistroRecordes({
  idUsuario,
  maiorSequencia,
  id: _id,
}: {
  idUsuario: string;
  maiorSequencia: number;
  id?: string;
}): RegistroRecordes {
  const recordId = _id ?? idUsuario;
  return {
    id: recordId,
    idUsuario,
    maiorSequencia,
  };
}

// Factory: TotalUsuario
// Atividades concluidas por usuario
export function criarTotalUsuario({
  idUsuario,
  atividadesConcluidas,
  id: _id,
}: {
  idUsuario: string;
  atividadesConcluidas: number;
  id?: string;
}): TotalUsuario {
  const totalId = _id ?? idUsuario;
  return {
    id: totalId,
    idUsuario,
    atividadesConcluidas,
  };
}
