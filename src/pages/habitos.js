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
import { ehDoDia, conclusaoDoDia, contarFeitos } from '../rules/habitosDoDia.js';
import { el, svg } from '../utils/dom.js';

const DIAS_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TAMANHO_MAX_NOME = 60;
const TAMANHO_MAX_DESCRICAO = 200;

// Lista fixa de categorias (a ordem é a do select do formulário).
// "cor" são classes do Tailwind (escritas por extenso para o Tailwind encontrá-las).
const CATEGORIAS = {
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
  'focus:border-brand-blue focus:outline-2 focus:outline-brand-blue aria-invalid:border-(--chama-ink)';
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

// ---------- Utilidades ----------

const $ = (id) => document.getElementById(id);

function hojeChave() {
  return paraChave(hoje());
}

// Categoria válida (um valor estranho gravado no storage cai em "outros")
function chaveCategoria(categoria) {
  return Object.hasOwn(CATEGORIAS, categoria) ? categoria : 'outros';
}

let usuarioAtual = null; // preenchido em iniciar(), depois do login

function idUsuarioAtual() {
  return usuarioAtual.id;
}

// ---------- Estado ----------

let habitos = [];
let conclusoes = []; // só as conclusões dos hábitos do usuário

async function carregar() {
  const dados = await carregarHabitosDoUsuario(idUsuarioAtual());
  habitos = dados.habitos;
  conclusoes = dados.conclusoes;
}

// ---------- Regras ----------

function ehDeHoje(h) {
  return ehDoDia(h, hoje().getDay());
}

function conclusaoDeHoje(h) {
  return conclusaoDoDia(h, conclusoes, hojeChave());
}

function feitoHoje(h) {
  return conclusaoDeHoje(h) !== null;
}

function sequenciaDe(h) {
  const datas = conclusoes.filter((c) => c.idHabito === h.id).map((c) => c.data);
  return calcularSequencia(h.frequencia, datas, hojeChave());
}

function textoSequencia(seq, frequencia) {
  const atual = formatarSequencia(seq.atual, frequencia);
  const recorde = formatarSequencia(seq.maior, frequencia);
  return `Sequência: ${atual} · Recorde: ${recorde}`;
}

// Valida os campos do formulário. Devolve { campo: mensagem } (vazio = tudo certo).
function validarCampos({ nome, categoria, descricao }) {
  const erros = {};
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
const emAndamento = new Set();

// Marca/desmarca a conclusão de hoje (no máximo uma por hábito por dia)
async function alternar(idHabito) {
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
  document.querySelector(`li[data-id="${CSS.escape(idHabito)}"] button`)?.focus();
}

async function adicionarHabito({ nome, categoria, descricao }) {
  const habito = await repoHabitos.criar({
    idUsuario: idUsuarioAtual(),
    nome,
    categoria: chaveCategoria(categoria),
    descricao,
    frequencia: { tipo: 'diaria' },
  });
  habitos.push(habito);
  renderizar();
  return habito;
}

// Garante que o hábito existe e pertence ao usuário logado
async function buscarHabitoDoUsuario(id) {
  const habito = await repoHabitos.buscarPorId(id);
  if (!habito || habito.idUsuario !== idUsuarioAtual()) {
    throw new Error('Hábito não encontrado para este usuário.');
  }
  return habito;
}

// Edita só nome, categoria e descrição (a frequência não muda)
async function salvarEdicao(id, { nome, categoria, descricao }) {
  await buscarHabitoDoUsuario(id);
  const atualizado = await repoHabitos.atualizar(id, {
    nome,
    categoria: chaveCategoria(categoria),
    descricao,
  });
  if (!atualizado) throw new Error('Hábito não encontrado.');
  habitos = habitos.map((h) => (h.id === id ? atualizado : h));
  renderizar();
}

// Exclusão real: remove o hábito e todas as conclusões dele
async function excluirHabito(id) {
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

function renderData() {
  const txt = hoje().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  $('data-hoje').textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
}

function renderProgresso(deHoje) {
  const total = deHoje.length;
  const feitos = contarFeitos(deHoje, conclusoes, hojeChave());
  const pct = total ? Math.round((feitos / total) * 100) : 0;
  $('progresso-texto').textContent = `${feitos} de ${total} feitos`;
  $('progresso-barra').style.width = `${pct}%`; // valor dinâmico: precisa ser inline
  $('progresso-trilho').setAttribute('aria-valuenow', String(pct));
}

// Botões de editar e excluir (iguais no cartão do dia e em "Não é hoje")
function criarAcoes(h) {
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

function criarItem(h) {
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

  const rotuloSequencia = `Sequência atual: ${formatarSequencia(seq.atual, h.frequencia)}`;
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

  const tag = el(
    'span',
    { classe: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${cat.cor}` },
    [svg(chaveCat, 'size-3.5'), el('span', { texto: cat.rotulo })]
  );

  const textoMeta = (feito ? 'Feito hoje · ' : '') + textoSequencia(seq, h.frequencia);
  const meta = el(
    'div',
    { classe: 'mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-brand-light-gray' },
    [tag, el('span', { texto: textoMeta })]
  );

  const corpo = el('div', { classe: 'min-w-0 flex-1' }, [linha1, meta]);
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

function criarItemNaoHoje(h) {
  const dias = [...(h.frequencia?.dias || [])]
    .sort((a, b) => a - b)
    .map((d) => DIAS_ABREV[d])
    .join(', ');
  const seq = sequenciaDe(h);

  return el(
    'div',
    { classe: 'flex items-center gap-3 border-b border-(--line) px-4 py-4 last:border-b-0' },
    [
      el('div', { classe: 'min-w-0 flex-1' }, [
        el('h3', { classe: 'break-words text-base font-medium', texto: h.nome }),
        el('p', {
          classe: 'mt-1 text-sm text-brand-light-gray',
          texto: `Dias: ${dias} · ${textoSequencia(seq, h.frequencia)}`,
        }),
      ]),
      criarAcoes(h),
      el('span', { classe: 'hidden whitespace-nowrap text-sm font-medium text-brand-light-gray sm:inline', texto: 'Não é hoje' }),
    ]
  );
}

function renderizar() {
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

let dialogo = null;
let dialogoExclusao = null;
let habitoEmEdicao = null; // null = criando; objeto = editando

function criarFormulario() {
  const d = document.createElement('dialog');
  d.className = CLASSE_MODAL;
  d.setAttribute('aria-labelledby', 'dlg-titulo');

  // Estrutura fixa (sem dados do usuário), então innerHTML é seguro aqui.
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
        <legend class="mb-2 block p-0 text-[15px] font-semibold">Frequência</legend>
        <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-blue bg-(--lima-suave) px-4 py-3 text-base font-semibold">
          <input type="radio" name="frequencia" value="diaria" checked class="size-4.5 accent-brand-blue">
          Todos os dias
        </label>
      </fieldset>

      <p id="erro-geral" class="${CLASSE_ERRO}" role="alert" hidden></p>

      <div class="mt-1 flex justify-end gap-3">
        <button type="button" data-fechar class="${CLASSE_BTN_SECUNDARIO}">Cancelar</button>
        <button type="submit" id="btn-salvar-habito" class="${CLASSE_BTN_PRIMARIO}">Salvar hábito</button>
      </div>
    </form>`;

  document.body.appendChild(d);

  // Opções do select vêm da lista fixa CATEGORIAS
  const select = d.querySelector('#campo-categoria');
  for (const [chave, cat] of Object.entries(CATEGORIAS)) {
    const op = document.createElement('option');
    op.value = chave;
    op.textContent = cat.rotulo;
    select.appendChild(op);
  }

  const form = d.querySelector('#form-habito');
  const campoNome = d.querySelector('#campo-nome');
  const campoDescricao = d.querySelector('#campo-descricao');
  const botaoSalvar = d.querySelector('#btn-salvar-habito');
  const titulo = d.querySelector('#dlg-titulo');
  const grupoFrequencia = d.querySelector('#grupo-frequencia');
  const campos = { nome: campoNome, categoria: select, descricao: campoDescricao };

  function mostrarErro(chave, mensagem) {
    const p = d.querySelector(`#erro-${chave}`);
    p.textContent = mensagem;
    p.hidden = false;
    if (campos[chave]) campos[chave].setAttribute('aria-invalid', 'true');
  }

  function limparErros() {
    d.querySelectorAll('[id^="erro-"]').forEach((p) => {
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

    const dados = {
      nome: campoNome.value.trim(),
      categoria: select.value,
      descricao: campoDescricao.value.trim(),
    };

    const erros = validarCampos(dados);
    const chavesComErro = Object.keys(erros);
    if (chavesComErro.length > 0) {
      for (const chave of chavesComErro) mostrarErro(chave, erros[chave]);
      campos[chavesComErro[0]].focus(); // leva o cursor ao primeiro campo com problema
      return;
    }

    botaoSalvar.disabled = true;
    try {
      if (habitoEmEdicao) {
        await salvarEdicao(habitoEmEdicao.id, dados);
      } else {
        await adicionarHabito(dados);
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
  d.preparar = (habito) => {
    habitoEmEdicao = habito;
    form.reset();
    limparErros();
    titulo.textContent = habito ? 'Editar hábito' : 'Novo hábito';
    botaoSalvar.textContent = habito ? 'Salvar alterações' : 'Salvar hábito';
    grupoFrequencia.hidden = Boolean(habito); // a frequência não é editável
    if (habito) {
      campoNome.value = habito.nome;
      select.value = chaveCategoria(habito.categoria);
      campoDescricao.value = habito.descricao || '';
    }
  };
  d.focarNome = () => campoNome.focus();

  return d;
}

function abrirFormulario(habito = null) {
  if (!dialogo) dialogo = criarFormulario();
  dialogo.preparar(habito);
  dialogo.showModal();
  dialogo.focarNome();
}

// ---------- Janela (modal) de confirmação da exclusão ----------

function criarConfirmacao() {
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

  const texto = d.querySelector('#dlg-excluir-texto');
  const erro = d.querySelector('#erro-excluir');
  const botao = d.querySelector('#btn-confirmar-exclusao');
  let idAlvo = null;

  d.querySelector('[data-cancelar]').addEventListener('click', () => d.close());
  d.addEventListener('click', (ev) => {
    if (ev.target === d) d.close();
  });

  botao.addEventListener('click', async () => {
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

  d.preparar = (habito) => {
    idAlvo = habito.id;
    erro.hidden = true;
    erro.textContent = '';
    texto.textContent =
      `Tem certeza que deseja excluir "${habito.nome}"? ` +
      'O histórico de conclusões e o recorde deste hábito também serão apagados. ' +
      'Essa ação não pode ser desfeita.';
  };
  return d;
}

function abrirConfirmacao(habito) {
  if (!dialogoExclusao) dialogoExclusao = criarConfirmacao();
  dialogoExclusao.preparar(habito);
  dialogoExclusao.showModal();
}

// ---------- Inicialização ----------

async function iniciar() {
  const autorizado = await exigirLogin();
  if (!autorizado) return;

  usuarioAtual = await obterUsuarioAtual();
  if (!usuarioAtual) return;

  // Menu lateral (criarNavbar é async e devolve um elemento).
  // Se o menu falhar, a página continua funcionando e o erro aparece no console.
  try {
    const menu = await criarNavbar();
    if (menu) {
      $('menu').appendChild(menu);
    }
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
  window.addEventListener('storage', async (ev) => {
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