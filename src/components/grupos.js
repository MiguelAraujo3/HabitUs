// Componentes específicos das telas de grupos (cartão, ranking, membros, convite...).
// Classes copiadas de docs/design/COMPONENTES.md. Os componentes só recebem dados
// já prontos; quem lê o LocalStorage é a página (tarefas S1-35, S1-40 em diante).

import { icone } from './icones.js';
import {
  criarElemento, juntar, criarChipCategoria, criarSeloStatus, criarAvatarIniciais,
  criarBotaoAcao, mostrarToast, criarLogo, criarLinkAcao,
} from './ui.js';
import { formatarDia } from '../utils/periodo.js';

// "1 membro" / "5 membros"
export function textoMembros(quantidade) {
  return `${quantidade} ${quantidade === 1 ? 'membro' : 'membros'}`;
}

// "13 out – 12 nov"
export function textoPeriodo(dataInicio, dataFim) {
  return `${formatarDia(dataInicio)} – ${formatarDia(dataFim)}`;
}

// Ranking com empate na mesma posição, sem pular (1º, 1º, 2º).
// RUBRICA: programação funcional (sort e map; a posição só muda quando os pontos mudam)
export function calcularPosicoes(pessoas) {
  const ordenadas = [...pessoas].sort((a, b) => b.pontos - a.pontos);
  let posicao = 0;
  let anterior = null;
  return ordenadas.map((pessoa) => {
    if (pessoa.pontos !== anterior) {
      posicao += 1;
      anterior = pessoa.pontos;
    }
    return { ...pessoa, posicao };
  });
}

// ---------------------------------------------------------------------------
// Lista de grupos

// grupo: { id, nome, categoria, dataInicio, dataFim } ; status: 'andamento' | ...
export function criarCartaoGrupo({ grupo, status, quantidadeMembros, posicao }) {
  const item = criarElemento('li');
  const link = criarElemento('a', 'flex items-center gap-3 p-4 hover:bg-surface-2');
  link.href = `grupo.html?id=${encodeURIComponent(grupo.id)}`;

  const conteudo = criarElemento('div', 'min-w-0 flex-1 space-y-1.5');
  conteudo.appendChild(criarElemento('p', 'truncate text-[17px] leading-[22px] font-semibold', grupo.nome));

  const chips = criarElemento('div', 'flex flex-wrap items-center gap-2');
  chips.appendChild(criarChipCategoria(grupo.categoria));
  chips.appendChild(criarSeloStatus(status));
  conteudo.appendChild(chips);

  let prazo = `Até ${formatarDia(grupo.dataFim)}`;
  if (status === 'nao-iniciado') {
    prazo = `Começa em ${formatarDia(grupo.dataInicio)}`;
  } else if (status === 'encerrado') {
    prazo = `Encerrado em ${formatarDia(grupo.dataFim)}`;
  }
  conteudo.appendChild(criarElemento('p', 'text-[13px] text-ink-2', `${textoMembros(quantidadeMembros)} · ${prazo}`));
  link.appendChild(conteudo);

  if (posicao && status !== 'nao-iniciado') {
    const bloco = criarElemento('div', 'text-center');
    bloco.appendChild(criarElemento('p', 'tnum text-[26px] leading-7 font-bold', `${posicao}º`));
    bloco.appendChild(criarElemento('p', 'text-[11px] font-medium text-ink-2', status === 'encerrado' ? 'final' : 'posição'));
    link.appendChild(bloco);
  }

  link.appendChild(icone('ChevronRight', { tamanho: 18, classe: 'shrink-0 text-ink-2' }));
  item.appendChild(link);
  return item;
}

// ---------------------------------------------------------------------------
// Tela do grupo

// Link de convite do grupo: convite.html?codigo=CÓDIGO (mesma pasta da página atual).
export function montarLinkConvite(codigo) {
  const pasta = window.location.pathname.replace(/[^/]*$/, '');
  return `${window.location.origin}${pasta}convite.html?codigo=${encodeURIComponent(codigo)}`;
}

async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (erro) {
    return false;
  }
}

export function criarCaixaLink(link) {
  const caixa = criarElemento('div', 'mt-4 flex items-center gap-2 rounded-[12px] bg-surface p-2 pl-3.5');
  caixa.appendChild(criarElemento('span', 'min-w-0 flex-1 truncate text-[14px] text-ink-2', link.replace(/^https?:\/\//, '')));
  const copiar = criarBotaoAcao('Copiar', {
    variante: 'secondary', tamanho: 'p', iconeNome: 'Copy', iconeTamanho: 15,
    aoClicar: async () => {
      const copiou = await copiarTexto(link);
      mostrarToast(copiou ? 'Link de convite copiado' : 'Não foi possível copiar o link');
    },
  });
  caixa.appendChild(copiar);
  return caixa;
}

export function criarLinhaRanking({ posicao, nome, usuario, pontos, voce }) {
  const linha = criarElemento('li', juntar('relative flex items-center gap-3 px-4 py-3', voce && 'bg-action-tint'));
  if (voce) {
    const marca = criarElemento('span', 'absolute inset-y-0 left-0 w-1 bg-action');
    marca.setAttribute('aria-hidden', 'true');
    linha.appendChild(marca);
  }
  const lugar = criarElemento('span', juntar('tnum w-9 text-center', posicao <= 3 ? 'text-[20px] font-bold' : 'text-[16px] font-medium text-ink-2'));
  lugar.appendChild(criarElemento('span', 'sr-only', 'Posição '));
  lugar.appendChild(document.createTextNode(`${posicao}º`));
  linha.appendChild(lugar);
  linha.appendChild(criarAvatarIniciais(nome, 38));

  const link = criarElemento('a', 'min-w-0 flex-1 truncate text-[16px] font-semibold hover:underline');
  link.href = voce ? 'perfil.html' : `perfil.html?usuario=${encodeURIComponent(usuario)}`;
  link.appendChild(document.createTextNode(nome));
  if (voce) {
    link.appendChild(criarElemento('span', 'ml-2 rounded-full bg-action px-2 py-0.5 align-middle text-[11px] font-semibold text-white', 'Você'));
  }
  linha.appendChild(link);

  const total = criarElemento('span', 'tnum text-[17px] font-bold', String(pontos));
  total.appendChild(criarElemento('span', 'ml-1 text-[12px] font-medium text-ink-2', 'pts'));
  linha.appendChild(total);
  return linha;
}

export function criarLinhaAtividade({ nome, pontos, feitoHoje }) {
  const linha = criarElemento('li', 'flex items-center gap-3 px-4 py-3.5');
  linha.appendChild(criarElemento('span', 'min-w-0 flex-1 text-[16px] font-medium', nome));
  if (feitoHoje) {
    const selo = criarElemento('span', 'inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-black');
    selo.appendChild(icone('Check', { tamanho: 12, espessura: 3 }));
    selo.appendChild(document.createTextNode('Feito hoje'));
    linha.appendChild(selo);
  }
  linha.appendChild(criarElemento('span', 'tnum rounded-full bg-surface-2 px-2.5 py-1 text-[13px] font-semibold', `+${pontos} pts`));
  return linha;
}

export function criarLinhaMembro({ nome, usuario, voce, dono, podeRemover, aoRemover }) {
  const linha = criarElemento('li', 'flex items-center gap-3 px-4 py-3');
  linha.appendChild(criarAvatarIniciais(nome, 40));

  const link = criarElemento('a', 'min-w-0 flex-1 leading-5');
  link.href = voce ? 'perfil.html' : `perfil.html?usuario=${encodeURIComponent(usuario)}`;
  link.appendChild(criarElemento('b', 'block truncate text-[16px] font-semibold', voce ? `${nome} (você)` : nome));
  link.appendChild(criarElemento('span', 'text-[13px] text-ink-2', `@${usuario}`));
  linha.appendChild(link);

  if (dono) {
    const selo = criarElemento('span', 'inline-flex items-center gap-1 rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white');
    selo.appendChild(icone('Crown', { tamanho: 12 }));
    selo.appendChild(document.createTextNode('Dono'));
    linha.appendChild(selo);
  }
  if (podeRemover) {
    const remover = criarElemento('button', 'press min-h-11 rounded-full px-3 text-[14px] font-semibold text-danger hover:bg-danger-tint', 'Remover');
    remover.type = 'button';
    remover.addEventListener('click', aoRemover);
    linha.appendChild(remover);
  }
  return linha;
}

// post: { nome, usuario, voce, quando, grupo, atividade, pontos, texto, foto }
/**
 * @param {any} post
 * @param {{ aoExcluir?: () => void }} [opcoes]
 */
export function criarCartaoPostagem(post, { aoExcluir } = {}) {
  const cartao = criarElemento('article', 'rounded-[14px] bg-surface');
  const destino = post.voce ? 'perfil.html' : `perfil.html?usuario=${encodeURIComponent(post.usuario)}`;

  const topo = criarElemento('div', 'flex items-center gap-3 p-4 pb-3');
  const linkAvatar = criarElemento('a');
  linkAvatar.href = destino;
  linkAvatar.appendChild(criarAvatarIniciais(post.nome));
  topo.appendChild(linkAvatar);
  const dados = criarElemento('div', 'min-w-0 flex-1 leading-5');
  const linkNome = criarElemento('a', 'block truncate text-[16px] font-semibold hover:underline', post.nome);
  linkNome.href = destino;
  dados.appendChild(linkNome);
  dados.appendChild(criarElemento('p', 'truncate text-[13px] text-ink-2', `@${post.usuario} · ${post.quando}`));
  topo.appendChild(dados);
  if (aoExcluir) {
    const excluir = criarElemento('button', 'press flex size-11 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger');
    excluir.type = 'button';
    excluir.setAttribute('aria-label', 'Excluir postagem');
    excluir.appendChild(icone('Trash2', { tamanho: 19 }));
    excluir.addEventListener('click', aoExcluir);
    topo.appendChild(excluir);
  }
  cartao.appendChild(topo);

  const etiquetas = criarElemento('div', 'flex flex-wrap items-center gap-2 px-4');
  const grupo = criarElemento('span', 'inline-flex items-center rounded-full bg-black px-2.5 py-1 text-xs font-semibold text-white', post.grupo);
  etiquetas.appendChild(grupo);
  etiquetas.appendChild(criarElemento('span', 'rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-black', `${post.atividade} · +${post.pontos} pts`));
  cartao.appendChild(etiquetas);

  cartao.appendChild(criarElemento('p', 'px-4 pt-3 text-[17px] leading-6', post.texto));

  if (post.foto) {
    const foto = criarElemento('img', 'mt-3 aspect-[4/3] w-full bg-surface-2 object-cover');
    foto.src = post.foto;
    foto.alt = `Foto de ${post.nome}: ${post.texto.slice(0, 60)}`;
    foto.loading = 'lazy';
    cartao.appendChild(foto);
  }

  // Curtir e comentar: só a aparência por enquanto (feed e comentários são outras tarefas).
  const barra = criarElemento('div', 'flex items-center gap-1 p-2');
  let curtidas = post.curtidas ?? 0;
  let curtiu = false;
  const curtir = criarElemento('button', 'press flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-medium hover:bg-surface-2 text-ink-2');
  curtir.type = 'button';
  curtir.setAttribute('aria-pressed', 'false');
  const contagem = criarElemento('span', 'tnum', String(curtidas));
  function desenharCurtir() {
    curtir.replaceChildren();
    curtir.classList.toggle('text-coral-ink', curtiu);
    curtir.classList.toggle('text-ink-2', !curtiu);
    curtir.setAttribute('aria-pressed', String(curtiu));
    contagem.textContent = String(curtidas);
    curtir.appendChild(icone('Heart', { tamanho: 20, preencher: curtiu }));
    curtir.appendChild(contagem);
    curtir.appendChild(criarElemento('span', '', 'Curtir'));
  }
  curtir.addEventListener('click', () => {
    curtiu = !curtiu;
    curtidas += curtiu ? 1 : -1;
    desenharCurtir();
  });
  desenharCurtir();
  barra.appendChild(curtir);

  const comentar = criarElemento('button', 'press flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[15px] font-medium text-ink-2 hover:bg-surface-2');
  comentar.type = 'button';
  comentar.appendChild(icone('MessageCircle', { tamanho: 20 }));
  comentar.appendChild(criarElemento('span', 'tnum', String(post.comentarios ?? 0)));
  comentar.appendChild(document.createTextNode('Comentar'));
  barra.appendChild(comentar);
  cartao.appendChild(barra);
  return cartao;
}

// ---------------------------------------------------------------------------
// Convite

const TONS_CONVITE = {
  neutro: 'bg-surface-2 text-ink-2',
  lima: 'bg-lime text-black',
  perigo: 'bg-danger-tint text-danger',
  acao: 'bg-action-tint text-action',
  encerrado: 'bg-surface-2 text-closed',
};

// Monta a tela do convite. acoes: lista de botões/links já criados.
export function criarTelaConvite({ iconeNome, tom, titulo, texto, meta, acoes, destinoLogo }) {
  const raiz = criarElemento('div', 'flex min-h-dvh flex-col items-center justify-center px-4 py-10');

  const linkLogo = criarElemento('a', 'mb-8');
  linkLogo.href = destinoLogo;
  linkLogo.appendChild(criarLogo(22));
  raiz.appendChild(linkLogo);

  const cartao = criarElemento('div', 'w-full max-w-[420px] rounded-[22px] bg-surface p-6 text-center shadow-[0_2px_12px_rgb(0_0_0/0.06)]');
  const circulo = criarElemento('span', juntar('mx-auto flex size-16 items-center justify-center rounded-full', TONS_CONVITE[tom]));
  circulo.appendChild(icone(iconeNome, { tamanho: 30 }));
  cartao.appendChild(circulo);
  cartao.appendChild(criarElemento('h1', 'mt-5 text-[26px] leading-8 font-bold tracking-[-0.02em]', titulo));
  cartao.appendChild(criarElemento('p', 'mt-2 text-[16px] leading-[22px] text-ink-2', texto));

  if (meta) {
    const caixa = criarElemento('div', 'mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[14px] bg-surface-2 p-3 text-[13px] text-ink-2');
    caixa.appendChild(criarChipCategoria(meta.categoria));
    caixa.appendChild(criarElemento('span', '', textoMembros(meta.quantidadeMembros)));
    caixa.appendChild(criarElemento('span', '', textoPeriodo(meta.dataInicio, meta.dataFim)));
    cartao.appendChild(caixa);
  }

  const area = criarElemento('div', 'mt-6 flex flex-col gap-2');
  acoes.forEach((acao) => area.appendChild(acao));
  cartao.appendChild(area);

  raiz.appendChild(cartao);
  return raiz;
}

// Botão/link largo usado no cartão do convite.
/**
 * @param {string} texto
 * @param {{ href?: string, variante?: string, aoClicar?: () => void }} [opcoes]
 */
export function criarAcaoConvite(texto, { href, variante = 'primary', aoClicar } = {}) {
  if (href) {
    return criarLinkAcao(texto, { href, variante, extra: 'w-full' });
  }
  return criarBotaoAcao(texto, { variante, extra: 'w-full', aoClicar });
}
