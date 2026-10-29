import { obterIniciais } from '../utils/usuario.js';
import { criarElemento } from './ui.js';
import type { Postagem } from '../data/postagens.js';

export interface AutorPostagem {
  id?: string;
  name: string;
  username: string;
}

export interface HabitoPostagem {
  id?: string;
  nome: string;
  categoria: string;
}

export interface PostagemComDetalhes extends Postagem {
  autor: AutorPostagem;
  habito?: HabitoPostagem | null;
}

function formatarTempo(dataHora: string): string {
  const segundos = Math.floor((Date.now() - new Date(dataHora).getTime()) / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) {
    return 'agora';
  }
  if (minutos < 60) {
    return `há ${minutos} min`;
  }
  if (horas < 24) {
    return `há ${horas} h`;
  }
  if (dias === 1) {
    return 'ontem';
  }
  if (dias < 7) {
    return `há ${dias} dias`;
  }
  return new Date(dataHora).toLocaleDateString('pt-BR');
}

export function criarCartaoPostagem(postagem: PostagemComDetalhes): HTMLLIElement {
  const item = criarElemento('li', 'flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm');

  const cabecalho = criarElemento('div', 'flex items-center gap-3');
  const avatar = criarElemento(
    'div',
    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800',
    obterIniciais(postagem.autor)
  );
  const quem = criarElemento('div', 'flex flex-col');
  quem.appendChild(criarElemento('span', 'text-sm font-semibold', postagem.autor.name));
  quem.appendChild(
    criarElemento(
      'span',
      'text-xs text-gray-500',
      `@${postagem.autor.username} · ${formatarTempo(postagem.dataHora)}`
    )
  );
  cabecalho.appendChild(avatar);
  cabecalho.appendChild(quem);
  item.appendChild(cabecalho);

  const linhaHabito = criarElemento('div', 'flex items-center gap-2 text-xs');
  if (postagem.habito) {
    linhaHabito.appendChild(
      criarElemento(
        'span',
        'rounded-full bg-purple-100 px-2 py-0.5 font-medium capitalize text-purple-800',
        postagem.habito.categoria
      )
    );
    linhaHabito.appendChild(criarElemento('span', 'text-gray-600', postagem.habito.nome));
  } else {
    linhaHabito.appendChild(criarElemento('span', 'text-gray-500', 'Hábito removido'));
  }
  item.appendChild(linhaHabito);

  item.appendChild(criarElemento('p', 'text-sm', postagem.texto));

  if (postagem.imagem) {
    const imagem = criarElemento('img', 'max-h-96 w-full rounded-lg object-cover');
    imagem.src = postagem.imagem;
    imagem.alt = `Imagem da postagem de ${postagem.autor.name}`;
    item.appendChild(imagem);
  }

  return item;
}
