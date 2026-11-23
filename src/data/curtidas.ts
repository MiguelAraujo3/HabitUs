import { lerLista, salvarLista } from './storage';
import { criarCurtida } from './modelo';

export interface Curtida {
  id: string;
  idPostagem: string;
  idUsuario: string;
}

export interface DadosNovaCurtida {
  id?: string;
  idPostagem: string;
  idUsuario: string;
}

export interface ResultadoAlternarCurtida {
  curtiu: boolean;
  total: number;
}

export async function criar(dados: DadosNovaCurtida): Promise<Curtida> {
  const curtida: Curtida = criarCurtida({ id: dados.id, ...dados });
  const lista: Curtida[] = await lerLista('curtidas');
  lista.push(curtida);
  salvarLista('curtidas', lista);
  return curtida;
}

export async function listar(): Promise<Curtida[]> {
  return lerLista('curtidas');
}

export async function listarPorPostagem(idPostagem: string): Promise<Curtida[]> {
  const lista = await listar();
  return lista.filter((c) => c.idPostagem === idPostagem);
}

export async function alternarCurtida(
  idPostagem: string,
  idUsuario: string
): Promise<ResultadoAlternarCurtida> {
  const lista = await listar();
  const idx = lista.findIndex(
    (c) => c.idPostagem === idPostagem && c.idUsuario === idUsuario
  );

  if (idx !== -1) {
    lista.splice(idx, 1);
    salvarLista('curtidas', lista);
    const total = lista.filter((c) => c.idPostagem === idPostagem).length;
    return { curtiu: false, total };
  }

  const novaCurtida: Curtida = criarCurtida({ idPostagem, idUsuario });
  lista.push(novaCurtida);
  salvarLista('curtidas', lista);
  const total = lista.filter((c) => c.idPostagem === idPostagem).length;
  return { curtiu: true, total };
}

export async function buscarPorId(id: string): Promise<Curtida | null> {
  const lista = await listar();
  return lista.find((c) => c.id === id) || null;
}

export async function atualizar(
  id: string,
  dados: Partial<Omit<Curtida, 'id'>>
): Promise<Curtida | null> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const atualizado: Curtida = { ...lista[idx], ...dados };
  lista[idx] = atualizado;
  salvarLista('curtidas', lista);
  return atualizado;
}

export async function excluir(id: string): Promise<void> {
  const lista = await listar();
  const idx = lista.findIndex((c) => c.id === id);
  if (idx === -1) return;
  lista.splice(idx, 1);
  salvarLista('curtidas', lista);
}
