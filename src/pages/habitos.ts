import '../styles/base.css'; // Tailwind + cores "brand-*" (mesmo import das outras páginas)
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import { obterUsuarioAtual } from '../data/index.js';
import * as repoHabitos from '../data/habitos.js';
import * as repoConclusoes from '../data/conclusoesHabito.js';
import { carregarHabitosDoUsuario } from '../data/consultas.js';
import { paraChave, hoje } from '../utils/datas.js';
import { formatarSequencia } from '../utils/sequencia.js';
import { calcularSequencia } from '../rules/streak.js';
import { ehDoDia, conclusaoDoDia, contarFeitos, contarNaSemana } from '../rules/habitosDoDia.js';
import {
  DIAS_ABREV,
  DIAS_NOME,
  META_MAXIMA,
  META_MINIMA,
  equivaleATodosOsDias,
  normalizarFrequencia,
  rotuloFrequencia,
  trocarDiasDaSemana,
  validarFrequencia,
  validarTrocaDeDias,
} from '../rules/frequencia.js';
import type { ConclusaoHabito, Frequencia, Habito, Sequencia } from '../types/habito.js';
import { el, obterPorId, selecionar, svg } from '../utils/dom.js';

const TAMANHO_MAX_NOME = 60;
const TAMANHO_MAX_DESCRICAO = 200;
const META_PADRAO = 3; // vezes por semana já selecionadas ao escolher "Vezes por semana"

// Lista fixa de categorias (a ordem é a do select do formulário).
// "cor" são classes do Tailwind (escritas por extenso para o Tailwind encontrá-las).
const CATEGORIAS: Record<string, { rotulo: string; cor: string }> = {
  saude: { rotulo: 'Saúde', cor: 'bg-red-100 text-red-800' },
  esportes: { rotulo: 'Esportes e exercícios', cor: 'bg-lime-100 text-lime-900' },
  estudos: { rotulo: 'Estudos', cor: 'bg-blue-100 text-blue-800' },
  leitura: { rotulo: 'Leitura', cor: 'bg-purple-100 text-purple-800' },
  alimentacao: { rotulo: 'Alimentação', cor: 'bg-red-100 text-red-800' },
  sono: { rotulo: 'Sono', cor: 'bg-blue-100 text-blue-800' },
  mental: { rotulo: 'Bem-estar mental', cor: 'bg-purple-100 text-purple-800' },
  financas: { rotulo: 'Finanças', cor: 'bg-lime-100 text-lime-900' },
  organizacao: { rotulo: 'Organização e produtividade', cor: 'bg-cyan-100 text-cyan-800' },
  hobbies: { rotulo: 'Hobbies e criatividade', cor: 'bg-cyan-100 text-cyan-800' },
  outros: { rotulo: 'Outros', cor: 'bg-gray-200 text-gray-700' },
};

// Classes do Tailwind reaproveitadas (strings fixas, sem dados do usuário)
const CLASSE_CAMPO =
  'w-full rounded-xl border border-(--line) bg-white px-4 py-3 text-base text-brand-dark ' +
  'focus:border-brand-blue focus:outline-2 focus:outline-brand-blue aria-invalid:border-(--chama-ink) ' +
  'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500';
const CLASSE_ERRO = 'mt-1.5 text-sm text-(--chama-ink)';
const CLASSE_BTN_PRIMARIO =
  'flex-1 cursor-pointer rounded-xl bg-brand-blue px-5 py-3 text-base font-semibold text-white ' +
  'transition-colors hover:bg-(--azul-escuro) disabled:cursor-default disabled:opacity-60';
const CLASSE_BTN_SECUNDARIO =
  'cursor-pointer rounded-xl border border-(--line) bg-white px-5 py-3 text-base font-semibold ' +
  'transition-colors hover:bg-brand-ice';
const CLASSE_BTN_PERIGO =
  'flex-1 cursor-pointer rounded-xl bg-(--chama-ink) px-5 py-3 text-base font-semibold text-white ' +
  'transition hover:brightness-90 disabled:cursor-default disabled:opacity-60';
const CLASSE_MODAL =
  'm-auto max-h-[92vh] w-[min(32.5rem,92vw)] overflow-y-auto rounded-2xl bg-brand-ice p-0 ' +
  'text-brand-dark shadow-2xl backdrop:bg-black/45';

// Opção de frequência (radio dentro de um label): destaca quando está marcada
const CLASSE_OPCAO_FREQ =
  'flex cursor-pointer items-center gap-3 rounded-xl border border-(--line) bg-white px-4 py-3 ' +
  'text-base font-semibold has-[:checked]:border-brand-blue has-[:checked]:bg-(--lima-suave)';
// Botão redondo de dia da semana / de meta semanal (o input fica escondido e o "peer" desenha o estado)
const CLASSE_CHIP =
  'flex size-11 select-none items-center justify-center rounded-full border border-(--line) bg-white ' +
  'text-sm font-semibold transition-colors peer-checked:border-brand-blue peer-checked:bg-brand-blue ' +
  'peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ' +
  'peer-focus-visible:outline-brand-blue';

const CLASSE_CHECK =
  'grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border-2 p-0 ' +
  'text-brand-dark transition-colors active:scale-95';
const CLASSE_CHECK_FEITO = `${CLASSE_CHECK} border-(--lima) bg-(--lima)`;
const CLASSE_CHECK_PENDENTE = `${CLASSE_CHECK} border-brand-blue bg-transparent hover:bg-brand-ice`;

const CLASSE_ITEM =
  'relative flex items-start gap-4 border-b border-(--line) px-4 py-4 last:border-b-0';
const CLASSE_ITEM_FEITO =
  `${CLASSE_ITEM} bg-(--lima-suave) before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-(--lima)`;

const CLASSE_BTN_ACAO =
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-brand-light-gray ' +
  'transition-colors hover:bg-(--line) hover:text-brand-dark';
const CLASSE_BTN_ACAO_PERIGO =
  'inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-brand-light-gray ' +
  'transition-colors hover:bg-(--chama-bg) hover:text-(--chama-ink)';

// ---------- Tipos locais ----------

type CampoComErro = 'nome' | 'categoria' | 'descricao';
type ErrosCampos = Partial<Record<CampoComErro, string>>;

interface DadosNovoHabito {
  nome: string;
  categoria: string;
  descricao: string;
  frequencia: Frequencia;
}

// Na edição, só estes campos podem mudar. A frequência só muda nos hábitos de "dias da semana",
// e só os dias (na mesma quantidade): "dias" são os dias novos.
interface DadosEdicao {
  nome?: string;
  categoria?: string;
  descricao: string;
  dias?: number[];
}

// As janelas (dialog) ganham métodos próprios; Object.assign devolve o dialog já com eles
interface JanelaFormulario extends HTMLDialogElement {
  preparar(habito: Habito | null): void;
  focarNome(): void;
}
interface JanelaConfirmacao extends HTMLDialogElement {
  preparar(habito: Habito): void;
}

// ---------- Utilidades ----------

const $ = (id: string): HTMLElement => obterPorId(id);

function hojeChave(): string {
  return paraChave(hoje());
}

// Categoria válida (um valor estranho gravado no storage cai em "outros")
function chaveCategoria(categoria: unknown): string {
  return typeof categoria === 'string' && Object.hasOwn(CATEGORIAS, categoria) ? categoria : 'outros';
}

let usuarioAtual: { id: string } | null = null; // preenchido em iniciar(), depois do login

function idUsuarioAtual(): string {
  if (!usuarioAtual) throw new Error('Usuário não carregado.');
  return usuarioAtual.id;
}

// ---------- Estado ----------

let habitos: Habito[] = [];
let conclusoes: ConclusaoHabito[] = []; // só as conclusões dos hábitos do usuário

async function carregar(): Promise<void> {
  const dados = await carregarHabitosDoUsuario(idUsuarioAtual());
  habitos = dados.habitos;
  conclusoes = dados.conclusoes;
}

// ---------- Regras ----------

function ehDeHoje(h: Habito): boolean {
  return ehDoDia(h, hoje().getDay());
}

function conclusaoDeHoje(h: Habito): ConclusaoHabito | null {
  return conclusaoDoDia(h, conclusoes, hojeChave());
}

function feitoHoje(h: Habito): boolean {
  return conclusaoDeHoje(h) !== null;
}

function sequenciaDe(h: Habito): Sequencia {
  const datas = conclusoes.filter((c) => c.idHabito === h.id).map((c) => c.data);
  return calcularSequencia(h.frequencia, datas, hojeChave());
}

// A sequência aparece sempre em dias (nos hábitos semanais, a soma das metas das semanas cumpridas)
function textoSequencia(seq: Sequencia): string {
  return `Sequência: ${formatarSequencia(seq.atual)} · Recorde: ${formatarSequencia(seq.maior)}`;
}

// Recorde do hábito (o mesmo "Recorde" mostrado no cartão), calculado das conclusões.
// Regra da edição: com recorde maior que zero, só a descrição pode mudar.
function recordeDe(h: Habito): number {
  return sequenciaDe(h).maior;
}

// Valida nome, categoria e descrição. Devolve { campo: mensagem } (vazio = tudo certo).
// A frequência é validada à parte, por validarFrequencia (src/rules/frequencia.ts).
function validarCampos({
  nome,
  categoria,
  descricao,
}: {
  nome: string;
  categoria: string;
  descricao: string;
}): ErrosCampos {
  const erros: ErrosCampos = {};
  if (!nome) {
    erros.nome = 'Informe o nome do hábito.';
  } else if (nome.length > TAMANHO_MAX_NOME) {
    erros.nome = `O nome deve ter até ${TAMANHO_MAX_NOME} caracteres.`;
  }
  if (!Object.hasOwn(CATEGORIAS, categoria)) {
    erros.categoria = 'Escolha uma categoria.';
  }
  if (descricao.length > TAMANHO_MAX_DESCRICAO) {
    erros.descricao = `A descrição deve ter até ${TAMANHO_MAX_DESCRICAO} caracteres.`;
  }
  return erros;
}

// Ids de hábitos com marcação em andamento (evita duplo clique criar duas conclusões)
const emAndamento = new Set<string>();

// Marca/desmarca a conclusão de hoje (no máximo uma por hábito por dia)
async function alternar(idHabito: string): Promise<void> {
  const habito = habitos.find((h) => h.id === idHabito);
  if (!habito || emAndamento.has(idHabito)) return;

  emAndamento.add(idHabito);
  try {
    // A camada de dados decide se marca ou desmarca e devolve o resultado
    const resultado = await repoConclusoes.alternarConclusaoHoje(idHabito);
    const chave = hojeChave();
    conclusoes = conclusoes.filter((c) => !(c.idHabito === idHabito && c.data === chave));
    if (resultado.marcado) conclusoes.push(resultado.conclusao);
  } catch (erro) {
    console.error('Não foi possível salvar a alteração:', erro);
  } finally {
    emAndamento.delete(idHabito);
  }
  renderizar();
  // A lista é redesenhada: devolve o foco ao botão para quem usa o teclado
  document.querySelector<HTMLButtonElement>(`li[data-id="${CSS.escape(idHabito)}"] button`)?.focus();
}

async function adicionarHabito({ nome, categoria, descricao, frequencia }: DadosNovoHabito): Promise<Habito> {
  // Confere de novo aqui (além do formulário): esta função é a porta de entrada dos dados
  const erroFrequencia = validarFrequencia(frequencia);
  if (erroFrequencia) throw new Error(erroFrequencia);

  const habito: Habito = await repoHabitos.criar({
    idUsuario: idUsuarioAtual(),
    nome,
    categoria: chaveCategoria(categoria),
    descricao,
    frequencia: normalizarFrequencia(frequencia), // "todos os dias" escolhido de outro jeito vira diária
  });
  habitos.push(habito);
  renderizar();
  return habito;
}

// Garante que o hábito existe e pertence ao usuário logado
async function buscarHabitoDoUsuario(id: string): Promise<Habito> {
  const habito: Habito | null = await repoHabitos.buscarPorId(id);
  if (!habito || habito.idUsuario !== idUsuarioAtual()) {
    throw new Error('Hábito não encontrado para este usuário.');
  }
  return habito;
}

// Edita nome, categoria, descrição e, nos hábitos de "dias da semana", os dias.
// - Se o hábito já tem recorde, nome e categoria não mudam (só a descrição e os dias).
// - Os dias só podem ser trocados por outros, na mesma quantidade, e a troca vale a partir de hoje.
// A conferência usa os dados salvos, não o que a tela mostra, porque a janela pode estar
// desatualizada ou ter sido adulterada.
async function salvarEdicao(
  id: string,
  { nome, categoria, descricao, dias }: DadosEdicao
): Promise<void> {
  const habito = await buscarHabitoDoUsuario(id);
  const conclusoesDoHabito: ConclusaoHabito[] = await repoConclusoes.getCompletionsByHabit(id);
  const datas = conclusoesDoHabito.map((c) => c.data);
  const recorde = calcularSequencia(habito.frequencia, datas, hojeChave()).maior;

  const alteracoes: Partial<Pick<Habito, 'nome' | 'categoria' | 'descricao' | 'frequencia'>> = {
    descricao,
  };
  if (recorde === 0) {
    alteracoes.nome = nome ?? habito.nome;
    alteracoes.categoria = chaveCategoria(categoria ?? habito.categoria);
  }

  if (dias !== undefined) {
    if (habito.frequencia.tipo !== 'dias-semana') {
      throw new Error('Só os hábitos de "dias da semana" têm dias para trocar.');
    }
    const erroDias = validarTrocaDeDias(habito.frequencia, dias);
    if (erroDias) throw new Error(erroDias);
    alteracoes.frequencia = trocarDiasDaSemana(habito.frequencia, dias, hojeChave());
  }

  const atualizado: Habito | null = await repoHabitos.atualizar(id, alteracoes);
  if (!atualizado) throw new Error('Hábito não encontrado.');
  habitos = habitos.map((h) => (h.id === id ? atualizado : h));
  renderizar();
}

// Exclusão real: remove o hábito e todas as conclusões dele
async function excluirHabito(id: string): Promise<void> {
  await buscarHabitoDoUsuario(id);
  await repoHabitos.excluir(id);
  habitos = habitos.filter((h) => h.id !== id);
  conclusoes = conclusoes.filter((c) => c.idHabito !== id);
  renderizar();

  // O hábito já foi removido. Se a limpeza das conclusões falhar, sobram conclusões
  // órfãs, que carregar() ignora; por isso o erro só vai para o console.
  try {
    await repoConclusoes.excluirPorHabito(id);
  } catch (erro) {
    console.error('Hábito excluído, mas não foi possível limpar as conclusões:', erro);
  }
}

// ---------- Renderização ----------

function renderData(): void {
  const txt = hoje().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  $('data-hoje').textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
}

function renderProgresso(deHoje: Habito[]): void {
  const total = deHoje.length;
  const feitos = contarFeitos(deHoje, conclusoes, hojeChave());
  const pct = total ? Math.round((feitos / total) * 100) : 0;
  $('progresso-texto').textContent = `${feitos} de ${total} feitos`;
  $('progresso-barra').style.width = `${pct}%`; // valor dinâmico: precisa ser inline
  $('progresso-trilho').setAttribute('aria-valuenow', String(pct));
}

// Botões de editar e excluir (iguais no cartão do dia e em "Não é hoje")
function criarAcoes(h: Habito): HTMLDivElement {
  const editar = el(
    'button',
    {
      classe: CLASSE_BTN_ACAO,
      attrs: { type: 'button', 'aria-label': `Editar ${h.nome}`, title: 'Editar' },
    },
    [svg('lapis', 'size-4.5')]
  );
  editar.addEventListener('click', () => abrirFormulario(h));

  const excluir = el(
    'button',
    {
      classe: CLASSE_BTN_ACAO_PERIGO,
      attrs: { type: 'button', 'aria-label': `Excluir ${h.nome}`, title: 'Excluir' },
    },
    [svg('lixeira', 'size-4.5')]
  );
  excluir.addEventListener('click', () => abrirConfirmacao(h));

  return el('div', { classe: 'ml-auto flex shrink-0 gap-1' }, [editar, excluir]);
}

// Linha de status do cartão: "Feito hoje · 2 de 4 esta semana · Sequência: 8 dias · Recorde: 8 dias"
function textoStatus(h: Habito, seq: Sequencia, feito: boolean): string {
  const partes: string[] = [];
  if (feito) partes.push('Feito hoje');

  // Hábito "X vezes por semana": mostra o andamento da semana (domingo a sábado)
  if (h.frequencia.tipo === 'vezes-semana') {
    const meta = h.frequencia.vezes;
    const naSemana = contarNaSemana(h, conclusoes, hojeChave());
    partes.push(
      naSemana >= meta
        ? `Meta cumprida: ${naSemana} de ${meta} esta semana`
        : `${naSemana} de ${meta} esta semana`
    );
  }

  partes.push(textoSequencia(seq));
  return partes.join(' · ');
}

function criarItem(h: Habito): HTMLLIElement {
  const feito = feitoHoje(h);
  const chaveCat = chaveCategoria(h.categoria);
  const cat = CATEGORIAS[chaveCat];
  const seq = sequenciaDe(h);

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
    [svg('check', feito ? 'size-5.5 opacity-100' : 'size-5.5 opacity-0')]
  );
  botao.addEventListener('click', () => alternar(h.id));

  const rotuloSequencia = `Sequência atual: ${formatarSequencia(seq.atual)}`;
  const chama = el(
    'span',
    {
      classe:
        'inline-flex shrink-0 items-center gap-1.5 rounded-full bg-(--chama-bg) px-3 py-1 ' +
        'text-sm font-semibold text-(--chama-ink)',
      attrs: { role: 'img', title: rotuloSequencia, 'aria-label': rotuloSequencia },
    },
    [svg('chama', 'size-3.5'), el('span', { texto: String(seq.atual), attrs: { 'aria-hidden': 'true' } })]
  );

  const linha1 = el('div', { classe: 'flex items-center gap-3' }, [
    el('h3', { classe: 'min-w-0 flex-1 break-words text-lg font-semibold tracking-tight', texto: h.nome }),
    chama,
    criarAcoes(h),
  ]);

  const tagCategoria = el(
    'span',
    { classe: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${cat.cor}` },
    [svg(chaveCat, 'size-3.5'), el('span', { texto: cat.rotulo })]
  );
  // A frequência ("Todos os dias", "Seg, Qua, Sex", "4x por semana") fica visível no cartão
  const tagFrequencia = el(
    'span',
    {
      classe:
        'inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700',
      attrs: { 'data-frequencia': h.frequencia.tipo },
    },
    [svg('calendario', 'size-3.5'), el('span', { texto: rotuloFrequencia(h.frequencia) })]
  );
  const etiquetas = el('div', { classe: 'mt-2.5 flex flex-wrap items-center gap-2' }, [
    tagCategoria,
    tagFrequencia,
  ]);

  const status = el('p', {
    classe: 'mt-2 text-sm text-brand-light-gray',
    texto: textoStatus(h, seq, feito),
  });

  const corpo = el('div', { classe: 'min-w-0 flex-1' }, [linha1, etiquetas, status]);
  if (h.descricao) {
    corpo.appendChild(
      el('p', { classe: 'mt-2.5 break-words text-sm leading-snug text-brand-light-gray', texto: h.descricao })
    );
  }

  return el('li', { classe: feito ? CLASSE_ITEM_FEITO : CLASSE_ITEM, attrs: { 'data-id': h.id } }, [
    botao,
    corpo,
  ]);
}

// Hábito de "dias da semana" que não é de hoje: aparece sem o botão de marcar
function criarItemNaoHoje(h: Habito): HTMLDivElement {
  const seq = sequenciaDe(h);

  return el(
    'div',
    { classe: 'flex items-center gap-3 border-b border-(--line) px-4 py-4 last:border-b-0' },
    [
      el('div', { classe: 'min-w-0 flex-1' }, [
        el('h3', { classe: 'break-words text-base font-medium', texto: h.nome }),
        el('p', {
          classe: 'mt-1 text-sm text-brand-light-gray',
          texto: `Dias: ${rotuloFrequencia(h.frequencia)} · ${textoSequencia(seq)}`,
        }),
      ]),
      criarAcoes(h),
      el('span', {
        classe: 'hidden whitespace-nowrap text-sm font-medium text-brand-light-gray sm:inline',
        texto: 'Não é hoje',
      }),
    ]
  );
}

function renderizar(): void {
  renderData();

  const deHoje = habitos.filter(ehDeHoje);
  const foraHoje = habitos.filter((h) => !ehDeHoje(h));
  const vazio = habitos.length === 0;

  renderProgresso(deHoje);

  // Estado vazio x lista
  $('estado-vazio').hidden = !vazio;
  $('cartao-lista').hidden = vazio;

  const lista = $('lista-habitos');
  lista.replaceChildren();
  if (!vazio) {
    if (deHoje.length === 0) {
      lista.appendChild(
        el('li', {
          classe: 'px-5 py-7 text-center text-base text-brand-light-gray',
          texto: 'Nenhum hábito programado para hoje.',
        })
      );
    } else {
      lista.append(...deHoje.map(criarItem));
    }
  }

  // Seção "Não é hoje"
  $('secao-nao-hoje').hidden = foraHoje.length === 0;
  $('nao-hoje-titulo').textContent = `Não é hoje (${foraHoje.length})`;
  $('lista-nao-hoje').replaceChildren(...foraHoje.map(criarItemNaoHoje));
}

// ---------- Janela (modal) de criar/editar hábito, criada pelo JS ----------

let dialogo: JanelaFormulario | null = null;
let dialogoExclusao: JanelaConfirmacao | null = null;
let habitoEmEdicao: Habito | null = null; // null = criando; objeto = editando

function criarFormulario(): JanelaFormulario {
  const d = document.createElement('dialog');
  d.className = CLASSE_MODAL;
  d.setAttribute('aria-labelledby', 'dlg-titulo');

  // Estrutura fixa (sem dados do usuário), então innerHTML é seguro aqui.
  // Os botões de dia e de meta são criados abaixo com createElement.
  d.innerHTML = `
    <form id="form-habito" novalidate class="flex flex-col gap-4 px-6 pt-5 pb-6">
      <div class="flex items-center justify-between">
        <h2 id="dlg-titulo" class="text-xl font-bold">Novo hábito</h2>
        <button type="button" data-fechar aria-label="Fechar"
          class="cursor-pointer rounded-lg px-2 text-3xl leading-none text-brand-light-gray hover:text-brand-dark">&times;</button>
      </div>

      <div>
        <label for="campo-nome" class="mb-2 block text-[15px] font-semibold">Nome</label>
        <input id="campo-nome" name="nome" type="text" maxlength="${TAMANHO_MAX_NOME}" autocomplete="off"
          placeholder="Ex.: Correr 30 min" class="${CLASSE_CAMPO}">
        <p id="erro-nome" class="${CLASSE_ERRO}" hidden></p>
      </div>

      <div>
        <label for="campo-categoria" class="mb-2 block text-[15px] font-semibold">Categoria</label>
        <select id="campo-categoria" name="categoria" class="${CLASSE_CAMPO}">
          <option value="">Selecione uma categoria</option>
        </select>
        <p id="erro-categoria" class="${CLASSE_ERRO}" hidden></p>
      </div>

      <div>
        <label for="campo-descricao" class="mb-2 block text-[15px] font-semibold">Descrição (opcional)</label>
        <textarea id="campo-descricao" name="descricao" rows="2" maxlength="${TAMANHO_MAX_DESCRICAO}"
          class="${CLASSE_CAMPO} min-h-18 resize-y"></textarea>
        <p id="erro-descricao" class="${CLASSE_ERRO}" hidden></p>
      </div>

      <fieldset id="grupo-frequencia" class="min-w-0 border-0 p-0">
        <legend id="legenda-frequencia" class="mb-2 block p-0 text-[15px] font-semibold">Frequência</legend>
        <div class="flex flex-col gap-2">
          <label data-opcao-freq class="${CLASSE_OPCAO_FREQ}">
            <input type="radio" name="frequencia" value="diaria" checked class="size-4.5 accent-brand-blue">
            Todos os dias
          </label>

          <label data-opcao-freq class="${CLASSE_OPCAO_FREQ}">
            <input type="radio" name="frequencia" value="dias-semana" class="size-4.5 accent-brand-blue">
            Dias da semana
          </label>
          <div id="painel-dias" class="px-1 pb-1" hidden>
            <p id="texto-dias" class="mb-2 text-sm text-brand-light-gray">Em quais dias? Nos outros dias o hábito fica em "Não é hoje".</p>
            <div id="chips-dias" role="group" aria-label="Dias da semana" class="flex flex-wrap gap-2"></div>
          </div>

          <label data-opcao-freq class="${CLASSE_OPCAO_FREQ}">
            <input type="radio" name="frequencia" value="vezes-semana" class="size-4.5 accent-brand-blue">
            Vezes por semana
          </label>
          <div id="painel-vezes" class="px-1 pb-1" hidden>
            <p class="mb-2 text-sm text-brand-light-gray">Quantas vezes por semana? A semana vai de domingo a sábado.</p>
            <div id="chips-vezes" role="radiogroup" aria-label="Quantas vezes por semana" class="flex flex-wrap gap-2"></div>
          </div>
        </div>
        <p id="aviso-todos-dias" class="mt-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900" hidden></p>
        <p id="erro-frequencia" class="${CLASSE_ERRO}" role="alert" hidden></p>
      </fieldset>

      <p id="aviso-recorde" class="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900" hidden></p>

      <p id="erro-geral" class="${CLASSE_ERRO}" role="alert" hidden></p>

      <div class="mt-1 flex justify-end gap-3">
        <button type="button" data-fechar class="${CLASSE_BTN_SECUNDARIO}">Cancelar</button>
        <button type="submit" id="btn-salvar-habito" class="${CLASSE_BTN_PRIMARIO}">Salvar hábito</button>
      </div>
    </form>`;

  document.body.appendChild(d);

  const form = selecionar<HTMLFormElement>(d, '#form-habito');
  const campoNome = selecionar<HTMLInputElement>(d, '#campo-nome');
  const select = selecionar<HTMLSelectElement>(d, '#campo-categoria');
  const campoDescricao = selecionar<HTMLTextAreaElement>(d, '#campo-descricao');
  const botaoSalvar = selecionar<HTMLButtonElement>(d, '#btn-salvar-habito');
  const titulo = selecionar(d, '#dlg-titulo');
  const grupoFrequencia = selecionar<HTMLFieldSetElement>(d, '#grupo-frequencia');
  const painelDias = selecionar(d, '#painel-dias');
  const painelVezes = selecionar(d, '#painel-vezes');
  const avisoRecorde = selecionar(d, '#aviso-recorde');
  const legendaFrequencia = selecionar(d, '#legenda-frequencia');
  const textoDias = selecionar(d, '#texto-dias');
  const textoDiasNovo = textoDias.textContent ?? ''; // texto de quando o hábito está sendo criado
  const avisoTodosDias = selecionar(d, '#aviso-todos-dias');
  const opcoesFrequencia = d.querySelectorAll<HTMLElement>('[data-opcao-freq]');
  const campos: Record<CampoComErro, HTMLElement> = {
    nome: campoNome,
    categoria: select,
    descricao: campoDescricao,
  };
  let apenasDescricao = false; // true quando o hábito em edição já tem recorde

  // Opções do select vêm da lista fixa CATEGORIAS
  for (const [chave, cat] of Object.entries(CATEGORIAS)) {
    const op = document.createElement('option');
    op.value = chave;
    op.textContent = cat.rotulo;
    select.appendChild(op);
  }

  // Frequência "Dias da semana": um botão por dia (Dom a Sáb); o input fica escondido e o "peer" desenha o estado
  const chipsDias = selecionar(d, '#chips-dias');
  DIAS_ABREV.forEach((abrev, dia) => {
    const entrada = el('input', {
      classe: 'peer sr-only',
      attrs: { type: 'checkbox', name: 'dia', value: String(dia), 'aria-label': DIAS_NOME[dia] },
    });
    const chip = el('span', { classe: CLASSE_CHIP, texto: abrev });
    chipsDias.appendChild(el('label', { classe: 'cursor-pointer' }, [entrada, chip]));
  });

  // Frequência "Vezes por semana": botões de 1 a 7 (um radio por valor)
  const chipsVezes = selecionar(d, '#chips-vezes');
  for (let n = META_MINIMA; n <= META_MAXIMA; n++) {
    const entrada = el('input', {
      classe: 'peer sr-only',
      attrs: {
        type: 'radio',
        name: 'vezes',
        value: String(n),
        'aria-label': n === 1 ? '1 vez por semana' : `${n} vezes por semana`,
        // "checked" no HTML define o valor que form.reset() restaura
        ...(n === META_PADRAO ? { checked: '' } : {}),
      },
    });
    const chip = el('span', { classe: CLASSE_CHIP, texto: String(n) });
    chipsVezes.appendChild(el('label', { classe: 'cursor-pointer' }, [entrada, chip]));
  }

  // Lê a frequência escolhida no formulário (a validação é feita por validarFrequencia)
  function lerFrequencia(): Frequencia {
    const tipo = form.querySelector<HTMLInputElement>('input[name="frequencia"]:checked')?.value;
    if (tipo === 'dias-semana') {
      const dias = [...form.querySelectorAll<HTMLInputElement>('input[name="dia"]:checked')]
        .map((i) => Number(i.value))
        .sort((a, b) => a - b);
      return { tipo: 'dias-semana', dias };
    }
    if (tipo === 'vezes-semana') {
      const vezes = Number(form.querySelector<HTMLInputElement>('input[name="vezes"]:checked')?.value);
      return { tipo: 'vezes-semana', vezes };
    }
    return { tipo: 'diaria' };
  }

  // Mostra só o painel da frequência escolhida
  function atualizarPaineisFrequencia(): void {
    const tipo = form.querySelector<HTMLInputElement>('input[name="frequencia"]:checked')?.value;
    painelDias.hidden = tipo !== 'dias-semana';
    painelVezes.hidden = tipo !== 'vezes-semana';
  }

  // Avisa quando a escolha equivale a "todos os dias" (7 dias, ou 7 vezes por semana):
  // nesse caso o hábito é criado com a frequência "Todos os dias".
  function atualizarAvisoTodosDias(): void {
    const frequencia = lerFrequencia();
    const avisar = habitoEmEdicao === null && equivaleATodosOsDias(frequencia);
    avisoTodosDias.hidden = !avisar;
    avisoTodosDias.textContent = !avisar
      ? ''
      : frequencia.tipo === 'dias-semana'
        ? 'Você escolheu os 7 dias, então o hábito será criado como “Todos os dias”.'
        : '7 vezes por semana é o mesmo que todos os dias: o hábito será criado como “Todos os dias”.';
  }

  form.addEventListener('change', () => {
    atualizarPaineisFrequencia();
    atualizarAvisoTodosDias();
  });

  // Valida a frequência do formulário. Ao criar, vale a validação normal. Ao editar, só os
  // hábitos de "dias da semana" têm o que trocar, e só os dias (mesma quantidade).
  function validarFrequenciaDoFormulario(frequencia: Frequencia): string | null {
    const habito = habitoEmEdicao;
    if (habito === null) return validarFrequencia(frequencia);
    if (habito.frequencia.tipo !== 'dias-semana') return null;
    return frequencia.tipo === 'dias-semana'
      ? validarTrocaDeDias(habito.frequencia, frequencia.dias)
      : 'Escolha os dias da semana.';
  }

  // Leva o cursor ao primeiro controle da frequência escolhida
  function focarFrequencia(): void {
    const tipo = form.querySelector<HTMLInputElement>('input[name="frequencia"]:checked')?.value;
    const alvo =
      tipo === 'dias-semana'
        ? form.querySelector<HTMLInputElement>('input[name="dia"]')
        : form.querySelector<HTMLInputElement>('input[name="frequencia"]:checked');
    alvo?.focus();
  }

  function mostrarErro(chave: string, mensagem: string): void {
    const p = selecionar(d, `#erro-${chave}`);
    p.textContent = mensagem;
    p.hidden = false;
    if (chave in campos) campos[chave as CampoComErro].setAttribute('aria-invalid', 'true');
  }

  function limparErros(): void {
    d.querySelectorAll<HTMLElement>('[id^="erro-"]').forEach((p) => {
      p.hidden = true;
      p.textContent = '';
    });
    d.querySelectorAll('[aria-invalid]').forEach((c) => c.removeAttribute('aria-invalid'));
  }

  // Fechar: botões X/Cancelar e clique no fundo escuro (Esc já funciona sozinho)
  d.querySelectorAll('[data-fechar]').forEach((b) => {
    b.addEventListener('click', () => d.close());
  });
  d.addEventListener('click', (ev) => {
    if (ev.target === d) d.close();
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    limparErros();

    const nome = campoNome.value.trim();
    const categoria = select.value;
    const descricao = campoDescricao.value.trim();

    const erros = validarCampos({ nome, categoria, descricao });
    if (apenasDescricao) {
      delete erros.nome; // com recorde, nome e categoria não entram na alteração
      delete erros.categoria;
    }

    // A frequência é escolhida ao criar. Na edição, só os hábitos de "dias da semana" mudam, e só os dias
    const frequencia = lerFrequencia();
    const erroFrequencia = validarFrequenciaDoFormulario(frequencia);

    const chavesComErro = Object.keys(erros) as CampoComErro[];
    for (const chave of chavesComErro) mostrarErro(chave, erros[chave] ?? '');
    if (erroFrequencia) mostrarErro('frequencia', erroFrequencia);

    if (chavesComErro.length > 0) {
      campos[chavesComErro[0]].focus(); // leva o cursor ao primeiro campo com problema
      return;
    }
    if (erroFrequencia) {
      focarFrequencia();
      return;
    }

    botaoSalvar.disabled = true;
    try {
      if (habitoEmEdicao) {
        const dadosEdicao: DadosEdicao = apenasDescricao
          ? { descricao }
          : { nome, categoria, descricao };
        if (habitoEmEdicao.frequencia.tipo === 'dias-semana' && frequencia.tipo === 'dias-semana') {
          dadosEdicao.dias = frequencia.dias;
        }
        await salvarEdicao(habitoEmEdicao.id, dadosEdicao);
      } else {
        await adicionarHabito({ nome, categoria, descricao, frequencia });
      }
      d.close();
    } catch (erro) {
      console.error(erro);
      mostrarErro('geral', 'Não foi possível salvar o hábito. Tente novamente.');
    } finally {
      botaoSalvar.disabled = false;
    }
  });

  d.addEventListener('close', () => {
    habitoEmEdicao = null;
  });

  // Prepara o formulário: sem argumento = novo hábito; com hábito = edição
  function preparar(habito: Habito | null): void {
    habitoEmEdicao = habito;
    form.reset();
    limparErros();
    titulo.textContent = habito ? 'Editar hábito' : 'Novo hábito';
    botaoSalvar.textContent = habito ? 'Salvar alterações' : 'Salvar hábito';

    // Na edição, a frequência só aparece nos hábitos de "dias da semana", e só para trocar os dias
    const frequenciaAtual = habito ? habito.frequencia : null;
    const diasAtuais = frequenciaAtual && frequenciaAtual.tipo === 'dias-semana' ? frequenciaAtual.dias : null;
    const editandoDias = diasAtuais !== null;
    grupoFrequencia.hidden = habito !== null && !editandoDias;
    opcoesFrequencia.forEach((opcao) => {
      opcao.hidden = editandoDias; // as opções de tipo somem; sobram só os botões dos dias
    });
    legendaFrequencia.textContent = editandoDias ? 'Dias da semana' : 'Frequência';
    if (diasAtuais) {
      const quantidade = new Set(diasAtuais).size;
      textoDias.textContent =
        `Troque os dias, mantendo ${quantidade} ${quantidade === 1 ? 'dia' : 'dias'}. ` +
        'A mudança vale a partir de hoje e não altera o histórico.';
      selecionar<HTMLInputElement>(form, 'input[name="frequencia"][value="dias-semana"]').checked = true;
      form.querySelectorAll<HTMLInputElement>('input[name="dia"]').forEach((caixa) => {
        caixa.checked = diasAtuais.includes(Number(caixa.value));
      });
    } else {
      textoDias.textContent = textoDiasNovo;
    }
    atualizarPaineisFrequencia(); // o reset não dispara "change"
    atualizarAvisoTodosDias();

    if (habito) {
      campoNome.value = habito.nome;
      select.value = chaveCategoria(habito.categoria);
      campoDescricao.value = habito.descricao || '';
    }

    // Regra: com recorde maior que zero, só a descrição (e os dias) podem ser editados
    const recorde = habito ? recordeDe(habito) : 0;
    apenasDescricao = recorde > 0;
    campoNome.disabled = apenasDescricao;
    select.disabled = apenasDescricao;
    avisoRecorde.hidden = !apenasDescricao;
    avisoRecorde.textContent =
      apenasDescricao && habito
        ? `Este hábito já tem recorde (${formatarSequencia(recorde)}). ` +
          (editandoDias
            ? 'Por isso só a descrição e os dias da semana podem ser editados.'
            : 'Por isso só a descrição pode ser editada.')
        : '';
  }

  function focarNome(): void {
    (apenasDescricao ? campoDescricao : campoNome).focus();
  }

  return Object.assign(d, { preparar, focarNome });
}

function abrirFormulario(habito: Habito | null = null): void {
  if (!dialogo) dialogo = criarFormulario();
  dialogo.preparar(habito);
  dialogo.showModal();
  dialogo.focarNome();
}

// ---------- Janela (modal) de confirmação da exclusão ----------

function criarConfirmacao(): JanelaConfirmacao {
  const d = document.createElement('dialog');
  d.className = `${CLASSE_MODAL} max-w-md`;
  d.setAttribute('aria-labelledby', 'dlg-excluir-titulo');

  // Estrutura fixa; o nome do hábito entra depois, via textContent
  d.innerHTML = `
    <div class="flex flex-col gap-4 px-6 pt-5 pb-6">
      <h2 id="dlg-excluir-titulo" class="text-xl font-bold">Excluir hábito?</h2>
      <p id="dlg-excluir-texto" class="leading-normal text-brand-light-gray"></p>
      <p id="erro-excluir" class="${CLASSE_ERRO}" role="alert" hidden></p>
      <div class="flex justify-end gap-3">
        <button type="button" data-cancelar autofocus class="${CLASSE_BTN_SECUNDARIO}">Cancelar</button>
        <button type="button" id="btn-confirmar-exclusao" class="${CLASSE_BTN_PERIGO}">Excluir</button>
      </div>
    </div>`;
  document.body.appendChild(d);

  const texto = selecionar(d, '#dlg-excluir-texto');
  const erro = selecionar(d, '#erro-excluir');
  const botao = selecionar<HTMLButtonElement>(d, '#btn-confirmar-exclusao');
  let idAlvo: string | null = null;

  selecionar(d, '[data-cancelar]').addEventListener('click', () => d.close());
  d.addEventListener('click', (ev) => {
    if (ev.target === d) d.close();
  });

  botao.addEventListener('click', async () => {
    if (idAlvo === null) return;
    botao.disabled = true;
    try {
      await excluirHabito(idAlvo);
      d.close();
    } catch (e) {
      console.error(e);
      erro.textContent = 'Não foi possível excluir o hábito. Tente novamente.';
      erro.hidden = false;
    } finally {
      botao.disabled = false;
    }
  });

  function preparar(habito: Habito): void {
    idAlvo = habito.id;
    erro.hidden = true;
    erro.textContent = '';
    texto.textContent =
      `Tem certeza que deseja excluir "${habito.nome}"? ` +
      'O histórico de conclusões e o recorde deste hábito também serão apagados. ' +
      'Essa ação não pode ser desfeita.';
  }

  return Object.assign(d, { preparar });
}

function abrirConfirmacao(habito: Habito): void {
  if (!dialogoExclusao) dialogoExclusao = criarConfirmacao();
  dialogoExclusao.preparar(habito);
  dialogoExclusao.showModal();
}

// ---------- Inicialização ----------

// Em telas pequenas o menu vira uma faixa no topo (mesmo ajuste usado em perfil.js)
function ajustarMenuMobile(menu: HTMLElement): void {
  menu.classList.add(
    'max-[700px]:w-full',
    'max-[700px]:h-auto',
    'max-[700px]:px-5',
    'max-[700px]:py-4',
    'max-[700px]:gap-4'
  );
  menu.querySelector('div')?.classList.add('max-[700px]:mb-0');
  menu
    .querySelector('nav')
    ?.classList.add('max-[700px]:flex-row', 'max-[700px]:flex-wrap', 'max-[700px]:gap-4');
}

async function iniciar(): Promise<void> {
  const autorizado = await exigirLogin();
  if (!autorizado) return;

  usuarioAtual = await obterUsuarioAtual();
  if (!usuarioAtual) return;

  // Menu lateral (criarNavbar é async e devolve um elemento).
  // Se o menu falhar, a página continua funcionando e o erro aparece no console.
  try {
    const menu = await criarNavbar();
    ajustarMenuMobile(menu);
    $('menu').appendChild(menu);
  } catch (erro) {
    console.error('Não foi possível montar o menu:', erro);
  }

  $('btn-novo-habito').addEventListener('click', () => abrirFormulario());
  $('btn-novo-habito-vazio').addEventListener('click', () => abrirFormulario());

  const toggle = $('nao-hoje-toggle');
  toggle.addEventListener('click', () => {
    const aberto = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!aberto));
    $('lista-nao-hoje').hidden = aberto;
  });

  // Outra aba (ou o painel lateral de outra página) mexeu nos dados: recarrega e redesenha.
  // O evento "storage" só dispara nas OUTRAS abas; key === null significa localStorage.clear().
  window.addEventListener('storage', async (ev: StorageEvent) => {
    if (ev.key !== null && ev.key !== 'habitos' && ev.key !== 'conclusoesHabito') return;
    try {
      await carregar();
      renderizar();
    } catch (erro) {
      console.error('Não foi possível atualizar a lista:', erro);
    }
  });

  // Se a aba ficar aberta até virar o dia, atualiza ao voltar a ela
  let diaRenderizado = hojeChave();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && hojeChave() !== diaRenderizado) {
      diaRenderizado = hojeChave();
      renderizar();
    }
  });

  try {
    await carregar();
  } catch (erro) {
    console.error('Não foi possível carregar os hábitos:', erro);
    habitos = [];
    conclusoes = [];
  }
  renderizar();
}

iniciar();
