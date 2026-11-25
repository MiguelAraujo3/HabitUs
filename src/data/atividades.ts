import { supabase } from '../lib/supabase';
import { criarAtividade, type Atividade } from './modelo';

export type { Atividade };

export interface DadosNovaAtividade {
  id?: string;
  idGrupo: string;
  nome: string;
  pontos: number;
}

interface AtividadeLinha {
  id: string;
  id_grupo: string;
  nome: string;
  pontos: number;
}

interface AtividadeLinhaAtualizacao {
  id_grupo?: string;
  nome?: string;
  pontos?: number;
}

function linhaParaAtividade(linha: AtividadeLinha): Atividade {
  return {
    id: linha.id,
    idGrupo: linha.id_grupo,
    nome: linha.nome,
    pontos: linha.pontos,
  };
}

function atividadeParaLinha(atividade: Atividade): AtividadeLinha {
  return {
    id: atividade.id,
    id_grupo: atividade.idGrupo,
    nome: atividade.nome,
    pontos: atividade.pontos,
  };
}

function dadosParaLinhaAtualizacao(dados: Partial<Omit<Atividade, 'id'>>): AtividadeLinhaAtualizacao {
  const linha: AtividadeLinhaAtualizacao = {};
  if (dados.idGrupo !== undefined) linha.id_grupo = dados.idGrupo;
  if (dados.nome !== undefined) linha.nome = dados.nome;
  if (dados.pontos !== undefined) linha.pontos = dados.pontos;
  return linha;
}

export async function criar(dados: DadosNovaAtividade): Promise<Atividade> {
  const atividade = criarAtividade(dados);
  const linha = atividadeParaLinha(atividade);
  const { data, error } = await supabase
    .from('atividades')
    .insert(linha)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return linhaParaAtividade(data as AtividadeLinha);
}

export async function listar(): Promise<Atividade[]> {
  const { data, error } = await supabase
    .from('atividades')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  const linhas = (data ?? []) as AtividadeLinha[];
  return linhas.map(linhaParaAtividade);
}

export async function buscarPorId(id: string): Promise<Atividade | null> {
  const { data, error } = await supabase
    .from('atividades')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return linhaParaAtividade(data as AtividadeLinha);
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Atividade, 'id'>>
): Promise<Atividade | null> {
  const linhaAtualizacao = dadosParaLinhaAtualizacao(dados);
  const { data, error } = await supabase
    .from('atividades')
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

  return linhaParaAtividade(data as AtividadeLinha);
}

export async function excluir(id: string): Promise<void> {
  const { error } = await supabase
    .from('atividades')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
