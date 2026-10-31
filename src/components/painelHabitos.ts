// Painel lateral "Hábitos de hoje": marca e desmarca os hábitos do dia em qualquer página.
// A página só precisa de um ponto de montagem no HTML:
//   <aside id="painel-habitos" class="hidden lg:block ..."></aside>
// e de carregar src/pages/painel-habitos.ts, que chama montarPainelHabitos().
// Quem controla a posição e quando o painel aparece é o HTML da página (classes do aside).
import { obterUsuarioAtual } from '../data/index.js';
import * as repoConclusoes from '../data/conclusoesHabito.js';
import { carregarHabitosDoUsuario } from '../data/consultas.js';
import { calcularSequencia } from '../rules/streak.js';
import { habitosDoDia, conclusaoDoDia, contarFeitos } from '../rules/habitosDoDia.js';
import type { ConclusaoHabito, Habito } from '../types/habito.js';
import { paraChave, hoje } from '../utils/datas.js';
import { formatarSequencia } from '../utils/sequencia.js';
import { el, svg } from '../utils/dom.js';

const BASE = import.meta.env.BASE_URL;

// Classes do Tailwind (strings fixas, escritas por extenso para o Tailwind encontrá-las)
const CLASSE_CHECK =
  'grid size-6 shrink-0 cursor-pointer place-items-center rounded-full border-2 p-0 ' +
  'text-gray-900 transition-colors';
const CLASSE_CHECK_FEITO = `${CLASSE_CHECK} border-lime-400 bg-lime-400`;
const CLASSE_CHECK_PENDENTE = `${CLASSE_CHECK} border-blue-600 bg-transparent hover:bg-blue-50`;
const CLASSE_LINK = 'text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800';

function hojeChave(): string {
  return paraChave(hoje());
}

// Monta o painel dentro do elemento informado (padrão: #painel-habitos).
// Não faz nada se a página não tiver o ponto de montagem ou se não houver usuário logado.
export async function montarPainelHabitos(
  elementoPai: HTMLElement | null = document.getElementById('painel-habitos')
): Promise<void> {
  if (!elementoPai) return;
  const raiz: HTMLElement = elementoPai; // fixa o tipo (não nulo) para as funções internas

  const usuario = await obterUsuarioAtual();
  if (!usuario) return;
  const idUsuario: string = usuario.id;

  let habitos: Habito[] = [];
  let conclusoes: ConclusaoHabito[] = [];
  let falhouAoCarregar = false;
  const emAndamento = new Set<string>(); // evita duplo clique marcar e desmarcar de uma vez

  async function carregar(): Promise<void> {
    try {
      const dados = await carregarHabitosDoUsuario(idUsuario);
      habitos = dados.habitos;
      conclusoes = dados.conclusoes;
      falhouAoCarregar = false;
    } catch (erro) {
      console.error('Não foi possível carregar os hábitos do painel:', erro);
      falhouAoCarregar = true;
    }
  }

  async function alternar(idHabito: string): Promise<void> {
    if (emAndamento.has(idHabito)) return;
    emAndamento.add(idHabito);
    try {
      const resultado = await repoConclusoes.alternarConclusaoHoje(idHabito);
      const chave = hojeChave();
      conclusoes = conclusoes.filter((c) => !(c.idHabito === idHabito && c.data === chave));
      if (resultado.marcado) conclusoes.push(resultado.conclusao);
    } catch (erro) {
      console.error('Não foi possível salvar a alteração:', erro);
    } finally {
      emAndamento.delete(idHabito);
    }
    renderizar(idHabito);
  }

  function criarItem(h: Habito, chave: string): HTMLLIElement {
    const feito = conclusaoDoDia(h, conclusoes, chave) !== null;
    const datas = conclusoes.filter((c) => c.idHabito === h.id).map((c) => c.data);
    const sequencia = calcularSequencia(h.frequencia, datas, chave);

    const botao = el(
      'button',
      {
        classe: feito ? CLASSE_CHECK_FEITO : CLASSE_CHECK_PENDENTE,
        attrs: {
          type: 'button',
          'aria-pressed': String(feito),
          'aria-label': `${feito ? 'Desmarcar' : 'Concluir'} ${h.nome}`,
        },
      },
      [svg('check', feito ? 'size-3.5 opacity-100' : 'size-3.5 opacity-0')]
    );
    botao.addEventListener('click', () => alternar(h.id));

    const nome = el('span', {
      classe: feito
        ? 'min-w-0 flex-1 truncate text-sm text-gray-400'
        : 'min-w-0 flex-1 truncate text-sm text-gray-900',
      texto: h.nome,
      attrs: { title: h.nome },
    });

    // O número da chama é sempre a sequência em dias (nos hábitos semanais, a soma das metas)
    const rotuloSequencia = `Sequência atual: ${formatarSequencia(sequencia.atual)}`;
    const chama = el(
      'span',
      {
        classe: 'inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-red-700',
        attrs: { role: 'img', title: rotuloSequencia, 'aria-label': rotuloSequencia },
      },
      [svg('chama', 'size-3'), el('span', { texto: String(sequencia.atual), attrs: { 'aria-hidden': 'true' } })]
    );

    return el('li', { classe: 'flex items-center gap-3 py-2.5', attrs: { 'data-id': h.id } }, [
      botao,
      nome,
      chama,
    ]);
  }

  // Redesenha o painel. Se um hábito acabou de ser marcado, devolve o foco ao botão dele.
  function renderizar(idParaFoco: string | null = null): void {
    const chave = hojeChave();
    const doDia = habitosDoDia(habitos, hoje().getDay());
    const feitos = contarFeitos(doDia, conclusoes, chave);

    const titulo = el('h2', {
      classe: 'text-sm font-semibold text-gray-900',
      texto: 'Hábitos de hoje',
      attrs: { id: 'painel-habitos-titulo' },
    });
    const cabecalho = el('div', { classe: 'flex items-baseline justify-between gap-2' }, [titulo]);
    if (doDia.length > 0) {
      cabecalho.appendChild(
        el('span', {
          classe: 'text-xs text-gray-500',
          texto: `${feitos} de ${doDia.length}`,
          attrs: { 'aria-live': 'polite' },
        })
      );
    }

    const cartao = el(
      'section',
      {
        classe: 'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm',
        attrs: { 'aria-labelledby': 'painel-habitos-titulo' },
      },
      [cabecalho]
    );

    if (falhouAoCarregar) {
      cartao.appendChild(
        el('p', { classe: 'mt-3 text-sm text-gray-500', texto: 'Não foi possível carregar seus hábitos.' })
      );
    } else if (habitos.length === 0) {
      cartao.appendChild(
        el('p', { classe: 'mt-3 text-sm text-gray-500', texto: 'Você ainda não tem hábitos.' })
      );
    } else if (doDia.length === 0) {
      cartao.appendChild(
        el('p', { classe: 'mt-3 text-sm text-gray-500', texto: 'Nenhum hábito programado para hoje.' })
      );
    } else {
      // Mostra todos os hábitos do dia; se forem muitos, a lista rola dentro do painel
      const lista = el('ul', {
        classe: 'mt-2 max-h-[60vh] divide-y divide-gray-100 overflow-y-auto',
      });
      lista.append(...doDia.map((h) => criarItem(h, chave)));
      cartao.appendChild(lista);
    }

    const textoLink = habitos.length === 0 && !falhouAoCarregar ? 'Criar hábito' : 'Abrir Hoje';
    const link = el('a', { classe: CLASSE_LINK, texto: textoLink });
    link.href = `${BASE}habitos.html`;
    cartao.appendChild(el('div', { classe: 'mt-3 text-center' }, [link]));

    raiz.replaceChildren(cartao);

    if (idParaFoco) {
      raiz.querySelector<HTMLButtonElement>(`li[data-id="${CSS.escape(idParaFoco)}"] button`)?.focus();
    }
  }

  await carregar();
  renderizar();

  // Outra aba (ou a página Hábitos) mexeu nos dados: recarrega e redesenha.
  // O evento "storage" só dispara nas OUTRAS abas; key === null significa localStorage.clear().
  window.addEventListener('storage', async (ev: StorageEvent) => {
    if (ev.key !== null && ev.key !== 'habitos' && ev.key !== 'conclusoesHabito') return;
    await carregar();
    renderizar();
  });

  // Se a aba ficar aberta até virar o dia, atualiza ao voltar a ela
  let diaRenderizado = hojeChave();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && hojeChave() !== diaRenderizado) {
      diaRenderizado = hojeChave();
      renderizar();
    }
  });
}
