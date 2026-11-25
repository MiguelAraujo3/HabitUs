import { supabase } from '../lib/supabase';
import { criarConclusaoGrupo, type ConclusaoGrupo } from './modelo';

export type { ConclusaoGrupo };

export interface DadosNovaConclusaoGrupo {
  id?: string;
  idGrupo: string;
  idAtividade: string;
  idUsuario: string;
  data?: string;
  foto?: string | null;
  texto?: string;
}

interface ConclusaoGrupoLinha {
  id: string;
  id_grupo: string;
  id_atividade: string;
  id_usuario: string;
  data: string;
  foto: string | null;
  texto: string;
}

interface ConclusaoGrupoLinhaAtualizacao {
  id_grupo?: string;
  id_atividade?: string;
  id_usuario?: string;
  data?: string;
  foto?: string | null;
  texto?: string;
}

function linhaParaConclusaoGrupo(linha: ConclusaoGrupoLinha): ConclusaoGrupo {
  return {
    id: linha.id,
    idGrupo: linha.id_grupo,
    idAtividade: linha.id_atividade,
    idUsuario: linha.id_usuario,
    data: linha.data,
    foto: linha.foto,
    texto: linha.texto,
  };
}

function conclusaoGrupoParaLinha(conclusao: ConclusaoGrupo): ConclusaoGrupoLinha {
  return {
    id: conclusao.id,
    id_grupo: conclusao.idGrupo,
    id_atividade: conclusao.idAtividade,
    id_usuario: conclusao.idUsuario,
    data: conclusao.data,
    foto: conclusao.foto,
    texto: conclusao.texto,
  };
}

function dadosParaLinhaAtualizacao(
  dados: Partial<Omit<ConclusaoGrupo, 'id'>>
): ConclusaoGrupoLinhaAtualizacao {
  const linha: ConclusaoGrupoLinhaAtualizacao = {};
  if (dados.idGrupo !== undefined) linha.id_grupo = dados.idGrupo;
  if (dados.idAtividade !== undefined) linha.id_atividade = dados.idAtividade;
  if (dados.idUsuario !== undefined) linha.id_usuario = dados.idUsuario;
  if (dados.data !== undefined) linha.data = dados.data;
  if (dados.foto !== undefined) linha.foto = dados.foto;
  if (dados.texto !== undefined) linha.texto = dados.texto;
  return linha;
}

export async function criar(dados: DadosNovaConclusaoGrupo): Promise<ConclusaoGrupo> {
  const conclusao = criarConclusaoGrupo(dados);
  const linha = conclusaoGrupoParaLinha(conclusao);
  const { data, error } = await supabase
    .from('conclusoes_grupo')
    .insert(linha)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return linhaParaConclusaoGrupo(data as ConclusaoGrupoLinha);
}

export async function listar(): Promise<ConclusaoGrupo[]> {
  const { data, error } = await supabase
    .from('conclusoes_grupo')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  const linhas = (data ?? []) as ConclusaoGrupoLinha[];
  return linhas.map(linhaParaConclusaoGrupo);
}

export async function buscarPorId(id: string): Promise<ConclusaoGrupo | null> {
  const { data, error } = await supabase
    .from('conclusoes_grupo')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return linhaParaConclusaoGrupo(data as ConclusaoGrupoLinha);
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<ConclusaoGrupo, 'id'>>
): Promise<ConclusaoGrupo | null> {
  const linhaAtualizacao = dadosParaLinhaAtualizacao(dados);
  const { data, error } = await supabase
    .from('conclusoes_grupo')
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

  return linhaParaConclusaoGrupo(data as ConclusaoGrupoLinha);
}

export async function excluir(id: string): Promise<void> {
  const { error } = await supabase
    .from('conclusoes_grupo')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}
