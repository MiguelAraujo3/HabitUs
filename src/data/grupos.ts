import { supabase } from '../lib/supabase';
import { criarGrupo, type Grupo } from './modelo';

export type { Grupo };

export interface DadosNovoGrupo {
  id?: string;
  nome: string;
  categoria: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  idDono: string;
  codigoConvite: string;
}

interface GrupoLinha {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  id_dono: string;
  codigo_convite: string;
  encerrado: boolean;
  ranking_final: unknown[] | null;
}

interface GrupoLinhaAtualizacao {
  nome?: string;
  categoria?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  id_dono?: string;
  codigo_convite?: string;
  encerrado?: boolean;
  ranking_final?: unknown[] | null;
}

function linhaParaGrupo(linha: GrupoLinha): Grupo {
  return {
    id: linha.id,
    nome: linha.nome,
    categoria: linha.categoria,
    descricao: linha.descricao,
    dataInicio: linha.data_inicio,
    dataFim: linha.data_fim,
    idDono: linha.id_dono,
    codigoConvite: linha.codigo_convite,
    encerrado: linha.encerrado,
    rankingFinal: linha.ranking_final,
  };
}

function grupoParaLinha(grupo: Grupo): GrupoLinha {
  return {
    id: grupo.id,
    nome: grupo.nome,
    categoria: grupo.categoria,
    descricao: grupo.descricao,
    data_inicio: grupo.dataInicio,
    data_fim: grupo.dataFim,
    id_dono: grupo.idDono,
    codigo_convite: grupo.codigoConvite,
    encerrado: grupo.encerrado,
    ranking_final: grupo.rankingFinal,
  };
}

function dadosParaLinhaAtualizacao(dados: Partial<Omit<Grupo, 'id'>>): GrupoLinhaAtualizacao {
  const linha: GrupoLinhaAtualizacao = {};
  if (dados.nome !== undefined) linha.nome = dados.nome;
  if (dados.categoria !== undefined) linha.categoria = dados.categoria;
  if (dados.descricao !== undefined) linha.descricao = dados.descricao;
  if (dados.dataInicio !== undefined) linha.data_inicio = dados.dataInicio;
  if (dados.dataFim !== undefined) linha.data_fim = dados.dataFim;
  if (dados.idDono !== undefined) linha.id_dono = dados.idDono;
  if (dados.codigoConvite !== undefined) linha.codigo_convite = dados.codigoConvite;
  if (dados.encerrado !== undefined) linha.encerrado = dados.encerrado;
  if (dados.rankingFinal !== undefined) linha.ranking_final = dados.rankingFinal;
  return linha;
}

export async function criar(dados: DadosNovoGrupo): Promise<Grupo> {
  const grupo = criarGrupo(dados);
  const linha = grupoParaLinha(grupo);
  const { data, error } = await supabase
    .from('grupos')
    .insert(linha)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return linhaParaGrupo(data as GrupoLinha);
}

export async function listar(): Promise<Grupo[]> {
  const { data, error } = await supabase
    .from('grupos')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  const linhas = (data ?? []) as GrupoLinha[];
  return linhas.map(linhaParaGrupo);
}

export async function buscarPorId(id: string): Promise<Grupo | null> {
  const { data, error } = await supabase
    .from('grupos')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return linhaParaGrupo(data as GrupoLinha);
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Grupo, 'id'>>
): Promise<Grupo | null> {
  const linhaAtualizacao = dadosParaLinhaAtualizacao(dados);
  const { data, error } = await supabase
    .from('grupos')
    .update(linhaAtualizacao)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return linhaParaGrupo(data as GrupoLinha);
}

export async function excluir(id: string): Promise<void> {
  const { error } = await supabase
    .from('grupos')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
