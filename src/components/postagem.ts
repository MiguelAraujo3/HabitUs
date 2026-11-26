import { obterIniciais } from '../utils/usuario';
import { criarElemento } from './ui';
import { icone } from './icones';
import { alternarCurtida } from '../data/curtidas';
import { criar as criarComentario, type Comentario } from '../data/comentarios';
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

export interface ComentarioComAutor extends Comentario {
  autor?: AutorPostagem | null;
}

export interface PostagemComDetalhes extends Postagem {
  autor?: AutorPostagem | null;
  habito?: HabitoPostagem | null;
  curtidas?: number;
  curtiu?: boolean;
  idUsuarioAtual?: string;
  usuarioAtual?: AutorPostagem | null;
  comentarios?: ComentarioComAutor[];
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

function criarItemComentario(comentario: ComentarioComAutor): HTMLLIElement {
  const item = criarElemento('li', 'flex items-start gap-2.5 rounded-lg bg-gray-50 p-2.5');
  const avatar = criarElemento(
    'div',
    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800',
    obterIniciais(comentario.autor)
  );

  const corpo = criarElemento('div', 'flex min-w-0 flex-1 flex-col gap-0.5');
  const cabecalho = criarElemento('div', 'flex flex-wrap items-baseline gap-1.5');
  const nomeAutor = comentario.autor?.name ?? 'Usuário';
  const usernameAutor = comentario.autor?.username ?? 'usuario';

  cabecalho.appendChild(criarElemento('span', 'text-xs font-semibold text-gray-900', nomeAutor));
  cabecalho.appendChild(
    criarElemento(
      'span',
      'text-[11px] text-gray-500',
      `@${usernameAutor} · ${formatarTempo(comentario.dataHora)}`
    )
  );

  corpo.appendChild(cabecalho);
  corpo.appendChild(criarElemento('p', 'text-xs text-gray-800 break-words', comentario.texto));

  item.appendChild(avatar);
  item.appendChild(corpo);
  return item;
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

  // ---------- Comentários ----------
  const listaComentarios: ComentarioComAutor[] = [...(postagem.comentarios ?? [])];
  let comentariosAbertos = false;

  const botaoComentar = criarElemento('button');
  botaoComentar.type = 'button';

  function atualizarBotaoComentar(): void {
    botaoComentar.className = comentariosAbertos
      ? 'inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100'
      : 'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100';
    botaoComentar.setAttribute('aria-expanded', String(comentariosAbertos));
    botaoComentar.replaceChildren(
      icone('MessageCircle', { tamanho: 16 }),
      criarElemento('span', 'tabular-nums', String(listaComentarios.length)),
      criarElemento('span', '', 'Comentar')
    );
  }

  const secaoComentarios = criarElemento('div', 'flex flex-col gap-3 border-t border-gray-100 pt-3');
  secaoComentarios.hidden = true;

  const ulComentarios = criarElemento('ul', 'flex flex-col gap-2');
  const vazioComentarios = criarElemento(
    'p',
    'text-xs text-gray-500',
    'Nenhum comentário ainda. Seja a primeira pessoa a comentar!'
  );

  function renderizarListaComentarios(): void {
    ulComentarios.replaceChildren(...listaComentarios.map(criarItemComentario));
    vazioComentarios.hidden = listaComentarios.length > 0;
  }

  const formComentario = criarElemento('form', 'flex items-center gap-2');
  const inputComentario = criarElemento(
    'input',
    'min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs focus:border-blue-600 focus:outline-none'
  );
  inputComentario.type = 'text';
  inputComentario.placeholder = 'Escreva um comentário...';
  inputComentario.setAttribute('aria-label', 'Escreva um comentário');

  const botaoEnviarComentario = criarElemento(
    'button',
    'shrink-0 cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50',
    'Enviar'
  );
  botaoEnviarComentario.type = 'submit';

  formComentario.append(inputComentario, botaoEnviarComentario);

  formComentario.addEventListener('submit', async (evento: SubmitEvent) => {
    evento.preventDefault();
    const idUsuario = postagem.idUsuarioAtual ?? postagem.usuarioAtual?.id;
    const texto = inputComentario.value.trim();
    if (!idUsuario || !texto) return;

    botaoEnviarComentario.disabled = true;
    try {
      const novoComentario = await criarComentario({
        idPostagem: postagem.id,
        idUsuario,
        texto,
      });
      listaComentarios.push({
        ...novoComentario,
        autor: postagem.usuarioAtual ?? { id: idUsuario, name: 'Você', username: 'voce' },
      });
      inputComentario.value = '';
      renderizarListaComentarios();
      atualizarBotaoComentar();
    } finally {
      botaoEnviarComentario.disabled = false;
    }
  });

  secaoComentarios.append(vazioComentarios, ulComentarios, formComentario);

  botaoComentar.addEventListener('click', () => {
    comentariosAbertos = !comentariosAbertos;
    secaoComentarios.hidden = !comentariosAbertos;
    atualizarBotaoComentar();
    if (comentariosAbertos) {
      inputComentario.focus();
    }
  });

  renderizarListaComentarios();
  atualizarBotaoComentar();
  barraAcoes.appendChild(botaoComentar);

  item.appendChild(barraAcoes);
  item.appendChild(secaoComentarios);

  return item;
}
