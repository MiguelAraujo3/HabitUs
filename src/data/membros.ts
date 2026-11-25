import { supabase } from '../lib/supabase';
import { criarMembro, type Membro } from './modelo';

export type { Membro };

export interface DadosNovoMembro {
  id?: string;
  idGrupo: string;
  idUsuario: string;
  dataEntrada?: string;
  bloqueado?: boolean;
}

interface MembroLinha {
  id: string;
  id_grupo: string;
  id_usuario: string;
  data_entrada: string;
  bloqueado: boolean;
}

interface MembroLinhaAtualizacao {
  id_grupo?: string;
  id_usuario?: string;
  data_entrada?: string;
  bloqueado?: boolean;
}

function linhaParaMembro(linha: MembroLinha): Membro {
  return {
    id: linha.id,
    idGrupo: linha.id_grupo,
    idUsuario: linha.id_usuario,
    dataEntrada: linha.data_entrada,
    bloqueado: linha.bloqueado,
  };
}

function membroParaLinha(membro: Membro): MembroLinha {
  return {
    id: membro.id,
    id_grupo: membro.idGrupo,
    id_usuario: membro.idUsuario,
    data_entrada: membro.dataEntrada,
    bloqueado: membro.bloqueado,
  };
}

function dadosParaLinhaAtualizacao(dados: Partial<Omit<Membro, 'id'>>): MembroLinhaAtualizacao {
  const linha: MembroLinhaAtualizacao = {};
  if (dados.idGrupo !== undefined) linha.id_grupo = dados.idGrupo;
  if (dados.idUsuario !== undefined) linha.id_usuario = dados.idUsuario;
  if (dados.dataEntrada !== undefined) linha.data_entrada = dados.dataEntrada;
  if (dados.bloqueado !== undefined) linha.bloqueado = dados.bloqueado;
  return linha;
}

export async function criar(dados: DadosNovoMembro): Promise<Membro> {
  const membro = criarMembro(dados);
  const linha = membroParaLinha(membro);
  const { data, error } = await supabase
    .from('membros')
    .insert(linha)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return linhaParaMembro(data as MembroLinha);
}

export async function listar(): Promise<Membro[]> {
  const { data, error } = await supabase
    .from('membros')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  const linhas = (data ?? []) as MembroLinha[];
  return linhas.map(linhaParaMembro);
}

export async function buscarPorId(id: string): Promise<Membro | null> {
  const { data, error } = await supabase
    .from('membros')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return linhaParaMembro(data as MembroLinha);
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Membro, 'id'>>
): Promise<Membro | null> {
  const linhaAtualizacao = dadosParaLinhaAtualizacao(dados);
  const { data, error } = await supabase
    .from('membros')
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

  return linhaParaMembro(data as MembroLinha);
}

export async function excluir(id: string): Promise<void> {
  const { error } = await supabase
    .from('membros')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
