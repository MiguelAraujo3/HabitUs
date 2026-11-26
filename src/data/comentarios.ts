import { lerLista, salvarLista } from './storage';
import { criarComentario } from './modelo';

export interface Comentario {
  id: string;
  idPostagem: string;
  idUsuario: string;
  texto: string;
  dataHora: string;
}

export interface DadosNovoComentario {
  id?: string;
  idPostagem: string;
  idUsuario: string;
  texto: string;
  dataHora?: string;
}

export async function criar(dados: DadosNovoComentario): Promise<Comentario> {
  const textoLimpo = dados.texto.trim();
  if (!textoLimpo) {
    throw new Error('O texto do comentário não pode estar vazio.');
  }

  const comentario: Comentario = criarComentario({
    ...dados,
    texto: textoLimpo,
  });
  const lista: Comentario[] = await lerLista('comentarios');
  lista.push(comentario);
  salvarLista('comentarios', lista);
  return comentario;
}

export async function listar(): Promise<Comentario[]> {
  return lerLista('comentarios');
}

export async function listarPorPostagem(idPostagem: string): Promise<Comentario[]> {
  const lista = await listar();
  return lista
    .filter((c) => c.idPostagem === idPostagem)
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
}

export async function buscarPorId(id: string): Promise<Comentario | null> {
  const lista = await listar();
  return lista.find((c) => c.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Comentario, 'id'>>
): Promise<Comentario | null> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const atualizado: Comentario = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('comentarios', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('comentarios', lista);
}
