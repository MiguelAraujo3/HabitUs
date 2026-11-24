import { obterIniciais } from '../utils/usuario';
import { criarElemento } from './ui';
import { icone } from './icones';
import { alternarCurtida } from '../data/curtidas';
import type { Postagem } from '../data/postagens';

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
  autor?: AutorPostagem | null;
  habito?: HabitoPostagem | null;
  curtidas?: number;
  curtiu?: boolean;
  idUsuarioAtual?: string;
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
  const nomeAutor = postagem.autor?.name ?? 'Usuário';
  const usernameAutor = postagem.autor?.username ?? 'usuario';
  quem.appendChild(criarElemento('span', 'text-sm font-semibold', nomeAutor));
  quem.appendChild(
    criarElemento(
      'span',
      'text-xs text-gray-500',
      `@${usernameAutor} · ${formatarTempo(postagem.dataHora)}`
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
    imagem.alt = `Imagem da postagem de ${nomeAutor}`;
    item.appendChild(imagem);
  }

  const barraAcoes = criarElemento('div', 'flex items-center gap-2 border-t border-gray-100 pt-2');
  let totalCurtidas = postagem.curtidas ?? 0;
  let curtiu = Boolean(postagem.curtiu);

  const botaoCurtir = criarElemento('button');
  botaoCurtir.type = 'button';

  function atualizarBotaoCurtir(): void {
    botaoCurtir.className = curtiu
      ? 'inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100'
      : 'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100';
    botaoCurtir.setAttribute('aria-pressed', String(curtiu));
    botaoCurtir.setAttribute('aria-label', curtiu ? 'Descurtir postagem' : 'Curtir postagem');
    botaoCurtir.replaceChildren(
      icone('Heart', { tamanho: 16, preencher: curtiu }),
      criarElemento('span', 'tabular-nums', String(totalCurtidas)),
      criarElemento('span', '', 'Curtir')
    );
  }

  botaoCurtir.addEventListener('click', async () => {
    if (!postagem.idUsuarioAtual) return;
    botaoCurtir.disabled = true;
    try {
      const resultado = await alternarCurtida(postagem.id, postagem.idUsuarioAtual);
      curtiu = resultado.curtiu;
      totalCurtidas = resultado.total;
      atualizarBotaoCurtir();
    } finally {
      botaoCurtir.disabled = false;
    }
  });

  atualizarBotaoCurtir();
  barraAcoes.appendChild(botaoCurtir);
  item.appendChild(barraAcoes);

  return item;
}
