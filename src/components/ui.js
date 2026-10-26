// Componentes de interface do design HabitUs (Figma Make), em JS puro.
// As classes são copiadas de docs/design/COMPONENTES.md — não reescrever nem "melhorar".
// Tailwind só gera classes escritas por inteiro no código: nunca montar 'bg-' + cor.

import { icone } from './icones.js';
import { visualDaCategoria, VISUAL_CATEGORIAS } from './categoriasVisual.js';

// ---------------------------------------------------------------------------
// Utilitários de DOM

export function juntar(...partes) {
  return partes.filter(Boolean).join(' ');
}

export function criarElemento(tag, classe = '', texto = '') {
  const elemento = document.createElement(tag);
  if (classe) {
    elemento.className = classe;
  }
  if (texto) {
    // textContent: texto de usuário nunca vira HTML
    elemento.textContent = texto;
  }
  return elemento;
}

function anexar(pai, filhos) {
  const lista = Array.isArray(filhos) ? filhos : [filhos];
  lista.filter((f) => f !== null && f !== undefined && f !== false).forEach((filho) => {
    pai.appendChild(typeof filho === 'string' ? document.createTextNode(filho) : filho);
  });
  return pai;
}

// ---------------------------------------------------------------------------
// Cores por família (chip de categoria e avatar)

const FAMILIAS = {
  coral: 'bg-[#fde8e8] text-coral-ink',
  lime: 'bg-[#eef9cf] text-[#3f5a00]',
  blue: 'bg-[#e3ecff] text-[#1e40af]',
  violet: 'bg-[#f1e6fa] text-violet-ink',
  cyan: 'bg-[#ddf4f8] text-[#0e5a68]',
  gray: 'bg-[#ecece9] text-[#4a4a47]',
};
const FAMILIAS_AVATAR = ['blue', 'coral', 'violet', 'cyan', 'lime'];

// ---------------------------------------------------------------------------
// Botão — "tamanho" substitui a base inteira (sem classes em conflito)

const BOTAO_BASE = 'press inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-45';

const BOTAO_VARIANTES = {
  primary: 'bg-action text-white hover:bg-action-press',
  black: 'bg-black text-white hover:bg-[#222]',
  secondary: 'bg-surface-2 text-ink hover:bg-[#e6e6e3]',
  ghost: 'text-action hover:bg-action-tint',
  danger: 'bg-danger-tint text-danger hover:bg-[#f9dad6]',
  dangerSolid: 'bg-danger text-white hover:bg-[#8f1c12]',
};

const BOTAO_TAMANHOS = {
  padrao: 'min-h-[50px] px-5 text-[16px]',
  alto: 'min-h-11 px-5 text-[16px]',
  m: 'min-h-11 px-4 text-[15px]',
  p: 'min-h-10 px-3.5 text-[14px]',
};

export function classeBotao(variante = 'primary', tamanho = 'padrao', extra = '') {
  return juntar(BOTAO_BASE, BOTAO_VARIANTES[variante], BOTAO_TAMANHOS[tamanho], extra);
}

function preencherBotao(elemento, texto, iconeNome, iconeTamanho) {
  if (iconeNome) {
    elemento.appendChild(icone(iconeNome, { tamanho: iconeTamanho }));
  }
  elemento.appendChild(document.createTextNode(texto));
  return elemento;
}

// criarBotaoAcao('Entrar', { variante: 'secondary', aoClicar: () => {} })
export function criarBotaoAcao(texto, opcoes = {}) {
  const {
    variante = 'primary', tamanho = 'padrao', extra = '', tipo = 'button',
    aoClicar, desabilitado = false, iconeNome, iconeTamanho = 18,
  } = opcoes;
  const botao = criarElemento('button', classeBotao(variante, tamanho, extra));
  botao.type = tipo;
  botao.disabled = desabilitado;
  preencherBotao(botao, texto, iconeNome, iconeTamanho);
  if (aoClicar) {
    botao.addEventListener('click', aoClicar);
  }
  return botao;
}

// Link com aparência de botão.
export function criarLinkAcao(texto, opcoes = {}) {
  const { href, variante = 'primary', tamanho = 'padrao', extra = '', iconeNome, iconeTamanho = 18 } = opcoes;
  const link = criarElemento('a', classeBotao(variante, tamanho, extra));
  link.href = href;
  preencherBotao(link, texto, iconeNome, iconeTamanho);
  return link;
}

// ---------------------------------------------------------------------------
// Campo (rótulo + controle + dica + erro)

export const CLASSE_INPUT = 'w-full min-h-[48px] rounded-[10px] border border-line bg-surface px-3.5 text-[17px] text-ink placeholder:text-[#8a8a86] focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action/30';

export function criarCampo({ id, rotulo, controle, dica, contador }) {
  const raiz = criarElemento('div', 'space-y-1.5');
  const linha = criarElemento('div', 'flex items-baseline justify-between');
  const etiqueta = criarElemento('label', 'text-[15px] font-medium', rotulo);
  etiqueta.htmlFor = id;
  linha.appendChild(etiqueta);
  if (contador) {
    linha.appendChild(criarElemento('span', 'tnum text-xs text-ink-2', contador));
  }
  raiz.appendChild(linha);
  raiz.appendChild(controle);
  if (dica) {
    const textoDica = criarElemento('p', 'text-[13px] leading-[18px] text-ink-2', dica);
    textoDica.dataset.dica = 'sim';
    raiz.appendChild(textoDica);
  }
  return raiz;
}

// mostrarErroCampo(campo, 'mensagem') mostra o erro; mostrarErroCampo(campo, '') limpa.
export function mostrarErroCampo(raiz, mensagem) {
  const antigo = raiz.querySelector('[data-erro]');
  if (antigo) {
    antigo.remove();
  }
  const dica = raiz.querySelector('[data-dica]');
  const controle = raiz.querySelector('input, textarea, select');
  if (!mensagem) {
    if (dica) {
      dica.classList.remove('hidden');
    }
    if (controle) {
      controle.removeAttribute('aria-invalid');
    }
    return;
  }
  if (dica) {
    dica.classList.add('hidden');
  }
  if (controle) {
    controle.setAttribute('aria-invalid', 'true');
  }
  const erro = criarElemento('p', 'flex items-start gap-1.5 text-[13px] leading-[18px] font-medium text-danger');
  erro.dataset.erro = 'sim';
  erro.appendChild(icone('AlertCircle', { tamanho: 15, classe: 'mt-px shrink-0' }));
  erro.appendChild(document.createTextNode(mensagem));
  raiz.appendChild(erro);
}

// Resumo de erros no topo do formulário. Devolve null quando não há erros.
export function criarResumoErros(erros) {
  if (!erros.length) {
    return null;
  }
  const caixa = criarElemento('div', 'rounded-[14px] border border-danger/30 bg-danger-tint p-4 text-[15px] text-danger');
  caixa.setAttribute('role', 'alert');
  const titulo = criarElemento('p', 'flex items-center gap-2 font-semibold');
  titulo.appendChild(icone('AlertCircle', { tamanho: 18 }));
  titulo.appendChild(document.createTextNode(`Revise ${erros.length === 1 ? '1 campo' : `${erros.length} campos`}`));
  const lista = criarElemento('ul', 'mt-1 list-disc pl-9 text-[14px] leading-5');
  erros.forEach((erro) => lista.appendChild(criarElemento('li', '', erro)));
  caixa.appendChild(titulo);
  caixa.appendChild(lista);
  return caixa;
}

// ---------------------------------------------------------------------------
// Chip de categoria, selo de status, avatar

export function criarChipCategoria(rotuloCategoria, extra = '') {
  const visual = visualDaCategoria(rotuloCategoria);
  const chip = criarElemento('span', juntar('inline-flex max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-4', FAMILIAS[visual.familia], extra));
  chip.appendChild(icone(visual.icone, { tamanho: 13, classe: 'shrink-0' }));
  chip.appendChild(criarElemento('span', '', visual.rotulo));
  return chip;
}

const STATUS = {
  andamento: { rotulo: 'Em andamento', classe: 'bg-[#e3f4ea] text-ok' },
  'nao-iniciado': { rotulo: 'Não iniciado', classe: 'bg-[#fbf0c9] text-warn-ink' },
  encerrado: { rotulo: 'Encerrado', classe: 'bg-surface-2 text-closed' },
};

export function criarSeloStatus(status) {
  const dados = STATUS[status];
  const selo = criarElemento('span', juntar('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', dados.classe));
  if (status === 'andamento') {
    selo.appendChild(criarElemento('span', 'size-1.5 rounded-full bg-ok'));
  } else if (status === 'nao-iniciado') {
    selo.appendChild(icone('Clock', { tamanho: 12 }));
  } else {
    selo.appendChild(icone('Lock', { tamanho: 12 }));
  }
  selo.appendChild(document.createTextNode(dados.rotulo));
  return selo;
}

export function criarAvatarIniciais(nome, tamanho = 40) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0] ? partes[0][0] : '?';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  const iniciais = (primeira + ultima).toUpperCase();
  // RUBRICA: programação funcional (reduce soma os códigos das letras para escolher a cor)
  const soma = [...nome].reduce((total, letra) => total + letra.charCodeAt(0), 0);
  const familia = FAMILIAS_AVATAR[soma % FAMILIAS_AVATAR.length];
  const avatar = criarElemento('span', juntar('inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none', FAMILIAS[familia]), iniciais);
  avatar.setAttribute('aria-hidden', 'true');
  avatar.style.width = `${tamanho}px`;
  avatar.style.height = `${tamanho}px`;
  avatar.style.fontSize = `${tamanho * 0.38}px`;
  return avatar;
}

// ---------------------------------------------------------------------------
// Stepper de pontos

const CLASSE_STEPPER = 'press flex size-11 items-center justify-center rounded-full bg-surface-2 text-ink hover:bg-[#e6e6e3] disabled:opacity-35';

// Devolve { elemento, obterValor }.
export function criarStepper({ rotulo, valor, min, max, aoMudar, sufixo = '' }) {
  let atual = valor;
  const raiz = criarElemento('div', 'inline-flex items-center gap-1');
  raiz.setAttribute('role', 'group');
  raiz.setAttribute('aria-label', rotulo);

  const diminuir = criarElemento('button', CLASSE_STEPPER);
  diminuir.type = 'button';
  diminuir.setAttribute('aria-label', `Diminuir ${rotulo}`);
  diminuir.appendChild(icone('Minus', { tamanho: 18 }));

  const saida = criarElemento('output', 'tnum min-w-14 text-center text-[17px] font-semibold');
  saida.setAttribute('aria-live', 'polite');

  const aumentar = criarElemento('button', CLASSE_STEPPER);
  aumentar.type = 'button';
  aumentar.setAttribute('aria-label', `Aumentar ${rotulo}`);
  aumentar.appendChild(icone('Plus', { tamanho: 18 }));

  function atualizar() {
    saida.textContent = `${atual}${sufixo}`;
    diminuir.disabled = atual <= min;
    aumentar.disabled = atual >= max;
  }
  function mudar(passo) {
    atual = Math.min(max, Math.max(min, atual + passo));
    atualizar();
    if (aoMudar) {
      aoMudar(atual);
    }
  }
  diminuir.addEventListener('click', () => mudar(-1));
  aumentar.addEventListener('click', () => mudar(1));

  atualizar();
  anexar(raiz, [diminuir, saida, aumentar]);
  return { elemento: raiz, obterValor: () => atual };
}

// ---------------------------------------------------------------------------
// Abas (Segmented)

const ABA_BASE = 'press min-h-10 flex-1 rounded-[9px] px-3 text-[15px] font-medium whitespace-nowrap';
const ABA_ATIVA = 'bg-surface text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]';
const ABA_INATIVA = 'text-ink-2 hover:text-ink';

// opcoes: [{ id, rotulo }]. Devolve o elemento da lista de abas.
export function criarAbas({ rotulo, opcoes, valor, aoMudar, rolagem = false }) {
  const lista = criarElemento('div', juntar('flex gap-1 rounded-[12px] bg-surface-2 p-1', rolagem && 'no-scrollbar overflow-x-auto'));
  lista.setAttribute('role', 'tablist');
  lista.setAttribute('aria-label', rotulo);

  function desenhar(selecionada) {
    lista.replaceChildren();
    opcoes.forEach((opcao) => {
      const ativa = opcao.id === selecionada;
      const aba = criarElemento('button', juntar(ABA_BASE, ativa ? ABA_ATIVA : ABA_INATIVA), opcao.rotulo);
      aba.type = 'button';
      aba.setAttribute('role', 'tab');
      aba.setAttribute('aria-selected', String(ativa));
      aba.addEventListener('click', () => {
        desenhar(opcao.id);
        aoMudar(opcao.id);
      });
      lista.appendChild(aba);
    });
  }

  desenhar(valor);
  return lista;
}

// ---------------------------------------------------------------------------
// Janela (Sheet) — criada por JS quando é aberta

// abrirJanela('Título', (fechar) => [nó1, nó2]) abre a janela e devolve { fechar }.
export function abrirJanela(titulo, construir, aoFechar) {
  const anterior = document.activeElement;

  const raiz = criarElemento('div', 'fixed inset-0 z-50 flex items-end justify-center md:items-center');
  const fundo = criarElemento('div', 'anim-fade absolute inset-0 bg-black/40');
  fundo.setAttribute('aria-hidden', 'true');
  const painel = criarElemento('div', 'anim-sheet relative w-full max-w-[460px] rounded-t-[22px] bg-surface px-5 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl md:rounded-[22px] md:p-6 max-h-[90dvh] overflow-y-auto');
  painel.setAttribute('role', 'dialog');
  painel.setAttribute('aria-modal', 'true');
  painel.setAttribute('aria-label', titulo);

  const alca = criarElemento('div', 'mx-auto mb-4 h-1 w-9 rounded-full bg-line md:hidden');
  alca.setAttribute('aria-hidden', 'true');
  painel.appendChild(alca);
  painel.appendChild(criarElemento('h2', 'text-[22px] leading-7 font-bold', titulo));

  function fechar() {
    document.removeEventListener('keydown', aoTeclar);
    raiz.remove();
    if (anterior && anterior.focus) {
      anterior.focus();
    }
    if (aoFechar) {
      aoFechar();
    }
  }

  // Esc fecha; Tab fica preso dentro da janela.
  function aoTeclar(evento) {
    if (evento.key === 'Escape') {
      fechar();
      return;
    }
    if (evento.key !== 'Tab') {
      return;
    }
    const focaveis = [...painel.querySelectorAll('button, a, input, select, textarea')].filter((el) => !el.disabled);
    if (!focaveis.length) {
      return;
    }
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  }

  // Só o fundo fecha; clicar dentro do painel não fecha.
  fundo.addEventListener('click', fechar);

  anexar(painel, construir(fechar));
  raiz.appendChild(fundo);
  raiz.appendChild(painel);
  document.body.appendChild(raiz);
  document.addEventListener('keydown', aoTeclar);

  const primeiroBotao = painel.querySelector('button');
  if (primeiroBotao) {
    primeiroBotao.focus();
  }
  return { fechar };
}

export function criarCorpoJanela(nos) {
  return anexar(criarElemento('div', 'mt-2 space-y-3 text-[16px] leading-[22px] text-ink-2'), nos);
}

export function criarAcoesJanela(botoes) {
  return anexar(criarElemento('div', 'mt-6 flex flex-col gap-2'), botoes);
}

// ---------------------------------------------------------------------------
// Estado vazio, aviso, cartão

export function criarVazio({ iconeNome, titulo, texto, acao }) {
  const raiz = criarElemento('div', 'flex flex-col items-center rounded-[18px] border border-dashed border-line bg-surface px-6 py-12 text-center');
  const circulo = criarElemento('span', 'flex size-14 items-center justify-center rounded-full bg-surface-2 text-ink-2');
  circulo.appendChild(icone(iconeNome, { tamanho: 26 }));
  raiz.appendChild(circulo);
  raiz.appendChild(criarElemento('h2', 'mt-4 text-[20px] leading-[26px] font-bold', titulo));
  raiz.appendChild(criarElemento('p', 'mt-1 max-w-[34ch] text-[16px] leading-[22px] text-ink-2', texto));
  if (acao) {
    raiz.appendChild(anexar(criarElemento('div', 'mt-5 flex flex-wrap justify-center gap-2'), acao));
  }
  return raiz;
}

const AVISO_TONS = {
  info: 'bg-action-tint text-[#1e3a8a]',
  warn: 'bg-[#fbf0c9] text-warn-ink',
  danger: 'bg-danger-tint text-danger',
};

// conteudo: texto, nó ou lista de nós/textos.
export function criarAviso({ tom = 'info', iconeNome, conteudo }) {
  const raiz = criarElemento('div', juntar('flex items-start gap-2.5 rounded-[12px] px-3.5 py-3 text-[14px] leading-5 font-medium', AVISO_TONS[tom]));
  if (iconeNome) {
    raiz.appendChild(icone(iconeNome, { tamanho: 18, classe: 'mt-px shrink-0' }));
  }
  raiz.appendChild(anexar(criarElemento('div'), conteudo));
  return raiz;
}

export function criarCartaoSimples(filhos, extra = '') {
  return anexar(criarElemento('div', juntar('rounded-[14px] bg-surface p-4', extra)), filhos);
}

// ---------------------------------------------------------------------------
// Cabeçalho de página e títulos

export function criarCabecalhoPagina({ titulo, voltarPara, direita }) {
  const cabecalho = criarElemento('header', 'sticky top-0 z-20 -mx-4 flex min-h-14 items-center gap-1 border-b border-line/70 bg-bg/92 px-2 backdrop-blur-lg md:mx-0 md:rounded-b-[14px] md:px-2');

  const voltar = criarElemento('button', 'press flex min-h-11 items-center gap-1 rounded-full px-3 text-[16px] font-medium text-action hover:bg-action-tint');
  voltar.type = 'button';
  voltar.setAttribute('aria-label', 'Voltar');
  voltar.appendChild(icone('ArrowLeft', { tamanho: 20 }));
  voltar.appendChild(criarElemento('span', 'hidden sm:inline', 'Voltar'));
  voltar.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = voltarPara;
    }
  });

  const tituloEl = criarElemento('h1', 'flex-1 truncate text-center text-[17px] leading-[22px] font-semibold', titulo);
  const areaDireita = criarElemento('div', 'flex min-w-11 justify-end');
  if (direita) {
    areaDireita.appendChild(direita);
  }

  anexar(cabecalho, [voltar, tituloEl, areaDireita]);
  return cabecalho;
}

export function criarTituloGrande({ titulo, subtitulo, direita }) {
  const raiz = criarElemento('div', 'flex items-end justify-between gap-3 pt-6 pb-4 md:pt-8');
  const texto = criarElemento('div', 'min-w-0');
  texto.appendChild(criarElemento('h1', 'text-[34px] leading-[41px] font-bold tracking-[-0.02em]', titulo));
  if (subtitulo) {
    texto.appendChild(criarElemento('p', 'mt-0.5 text-[16px] leading-[22px] text-ink-2', subtitulo));
  }
  raiz.appendChild(texto);
  if (direita) {
    raiz.appendChild(direita);
  }
  return raiz;
}

export function criarTituloSecao(texto, direita) {
  const raiz = criarElemento('div', 'mt-8 mb-2 flex items-baseline justify-between px-1 first:mt-0');
  raiz.appendChild(criarElemento('h2', 'text-[22px] leading-7 font-bold tracking-[-0.01em]', texto));
  if (direita) {
    raiz.appendChild(direita);
  }
  return raiz;
}

// ---------------------------------------------------------------------------
// Grade de categorias

// Devolve { elemento, obterValor, definirErro }.
export function criarGradeCategorias({ valor = '', aoMudar } = {}) {
  let atual = valor;
  const raiz = criarElemento('div');
  const grade = criarElemento('div', 'grid grid-cols-2 gap-2 sm:grid-cols-3');
  grade.setAttribute('role', 'radiogroup');
  grade.setAttribute('aria-label', 'Categoria');
  const erroEl = criarElemento('div');
  raiz.appendChild(grade);
  raiz.appendChild(erroEl);

  function desenhar() {
    grade.replaceChildren();
    VISUAL_CATEGORIAS.forEach((categoria) => {
      const ligada = atual === categoria.rotulo;
      const botao = criarElemento('button', juntar(
        'press flex min-h-[56px] items-center gap-2 rounded-[12px] border px-3 py-2 text-left text-[14px] leading-[18px] font-medium',
        ligada ? 'border-action bg-action-tint ring-1 ring-action' : 'border-line bg-surface hover:bg-surface-2',
      ));
      botao.type = 'button';
      botao.setAttribute('role', 'radio');
      botao.setAttribute('aria-checked', String(ligada));
      const circulo = criarElemento('span', juntar('flex size-8 shrink-0 items-center justify-center rounded-full', FAMILIAS[categoria.familia]));
      circulo.appendChild(icone(categoria.icone, { tamanho: 16 }));
      botao.appendChild(circulo);
      botao.appendChild(criarElemento('span', 'min-w-0 flex-1', categoria.rotulo));
      if (ligada) {
        botao.appendChild(icone('Check', { tamanho: 16, classe: 'shrink-0 text-action' }));
      }
      botao.addEventListener('click', () => {
        atual = categoria.rotulo;
        desenhar();
        definirErro('');
        if (aoMudar) {
          aoMudar(atual);
        }
      });
      grade.appendChild(botao);
    });
  }

  function definirErro(mensagem) {
    erroEl.replaceChildren();
    if (mensagem) {
      const p = criarElemento('p', 'mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-danger');
      p.appendChild(icone('AlertCircle', { tamanho: 15 }));
      p.appendChild(document.createTextNode(mensagem));
      erroEl.appendChild(p);
    }
  }

  desenhar();
  return { elemento: raiz, obterValor: () => atual, definirErro };
}

// ---------------------------------------------------------------------------
// Logo e aviso rápido (toast)

export function criarLogo(tamanho = 24) {
  const logo = criarElemento('img', 'block h-auto max-w-full');
  logo.src = `${import.meta.env.BASE_URL}images/logo.png`;
  logo.alt = 'HabitUs';
  logo.style.width = `${tamanho * 7}px`;
  return logo;
}

let temporizadorToast = null;

export function mostrarToast(texto) {
  let area = document.getElementById('area-toast');
  if (!area) {
    area = criarElemento('div', 'pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 md:bottom-8');
    area.id = 'area-toast';
    area.setAttribute('aria-live', 'polite');
    document.body.appendChild(area);
  }
  area.replaceChildren(criarElemento('div', 'anim-fade rounded-full bg-black px-5 py-3 text-[15px] font-medium text-white shadow-lg', texto));
  clearTimeout(temporizadorToast);
  temporizadorToast = setTimeout(() => area.replaceChildren(), 2600);
}
