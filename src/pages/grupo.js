import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import {
  criarElemento, juntar, criarCabecalhoPagina, criarChipCategoria, criarSeloStatus, criarAviso,
  criarVazio, criarAbas, criarBotaoAcao, criarCampo, criarStepper, criarResumoErros,
  abrirJanela, criarCorpoJanela, criarAcoesJanela, mostrarToast, CLASSE_INPUT,
} from '../components/ui.js';
import {
  textoMembros, textoPeriodo, calcularPosicoes, montarLinkConvite, criarCaixaLink,
  criarLinhaRanking, criarLinhaAtividade, criarLinhaMembro, criarCartaoPostagem,
} from '../components/grupos.js';
import { icone } from '../components/icones.js';
import { hoje, paraChave, somarDias, formatarDia, statusDoPeriodo } from '../utils/datas.js';

exigirLogin();
document.querySelector('#menu').appendChild(criarNavbar());

// ---------------------------------------------------------------------------
// PROVISÓRIO: dados de exemplo até a S1-40 ler o grupo (?id=) no LocalStorage.
// Para ver cada situação: ?status=andamento|nao-iniciado|encerrado e ?dono=0 (não sou dono).

const parametros = new URLSearchParams(window.location.search);
const STATUS_PEDIDO = parametros.get('status');
const status = ['andamento', 'nao-iniciado', 'encerrado'].includes(STATUS_PEDIDO) ? STATUS_PEDIDO : 'andamento';
const souDono = parametros.get('dono') !== '0';

function diaRelativo(dias) {
  return paraChave(somarDias(hoje(), dias));
}
const PERIODOS = {
  andamento: [-10, 20],
  'nao-iniciado': [3, 33],
  encerrado: [-40, -5],
};

const GRUPO = {
  id: parametros.get('id') ?? 'g1',
  nome: 'Movimento 30 Dias',
  descricao: 'Trinta dias de treino para todo mundo sair do sofá.',
  categoria: 'Esportes e exercícios',
  codigoConvite: 'movimento-30',
  dataInicio: diaRelativo(PERIODOS[status][0]),
  dataFim: diaRelativo(PERIODOS[status][1]),
  atividades: [
    { id: 'a1', nome: 'Treino de 30 min', pontos: 5, feitoHoje: true },
    { id: 'a2', nome: 'Caminhada de 5 km', pontos: 3, feitoHoje: false },
    { id: 'a3', nome: 'Alongamento', pontos: 2, feitoHoje: false },
  ],
  pessoas: [
    { nome: 'Marina Duarte', usuario: 'marinaduarte', pontos: 18, voce: true },
    { nome: 'Rafael Lima', usuario: 'rafalima', pontos: 24, voce: false },
    { nome: 'Beatriz Nogueira', usuario: 'bia.nogueira', pontos: 18, voce: false },
    { nome: 'Caio Menezes', usuario: 'caiomenezes', pontos: 12, voce: false },
    { nome: 'Helena Prado', usuario: 'helenaprado', pontos: 7, voce: false },
  ],
  postagens: [
    { nome: 'Rafael Lima', usuario: 'rafalima', voce: false, quando: 'há 25 min', grupo: 'Movimento 30 Dias', atividade: 'Treino de 30 min', pontos: 5, texto: 'Treino feito antes do trabalho. Cheguei na frente no ranking, mas o Caio vem atrás.', curtidas: 8, comentarios: 1 },
    { nome: 'Marina Duarte', usuario: 'marinaduarte', voce: true, quando: 'ontem', grupo: 'Movimento 30 Dias', atividade: 'Caminhada de 5 km', pontos: 3, texto: 'Cinco quilômetros no parque, com sol e tudo.', curtidas: 3, comentarios: 0 },
  ],
};
const DONO_USUARIO = souDono ? 'marinaduarte' : 'rafalima';
const POSTAGENS = status === 'nao-iniciado' ? [] : GRUPO.postagens;

const encerrado = status === 'encerrado';
const ABAS = ['feed', 'ranking', 'atividades', 'membros'];

function emConstrucao(tarefa) {
  mostrarToast(`Em construção · ${tarefa}`);
}

// Parágrafo com trechos em destaque: paragrafo('Você perde ', ['18 pontos'], ' ...')
function paragrafo(...partes) {
  const p = criarElemento('p');
  partes.forEach((parte) => {
    if (Array.isArray(parte)) {
      p.appendChild(criarElemento('b', 'text-ink', parte[0]));
    } else {
      p.appendChild(document.createTextNode(parte));
    }
  });
  return p;
}

const meusPontos = GRUPO.pessoas.find((p) => p.voce).pontos;

// ---------------------------------------------------------------------------
// Janelas

function abrirConfirmacao({ titulo, corpo, textoConfirmar, tarefa, variante = 'dangerSolid' }) {
  abrirJanela(titulo, (fechar) => [
    criarCorpoJanela(corpo),
    criarAcoesJanela([
      criarBotaoAcao(textoConfirmar, {
        variante,
        aoClicar: () => {
          fechar();
          emConstrucao(tarefa);
        },
      }),
      criarBotaoAcao('Cancelar', { variante: 'secondary', aoClicar: fechar }),
    ]),
  ]);
}

function abrirJanelaSair() {
  const outros = GRUPO.pessoas.filter((p) => p.usuario !== DONO_USUARIO || !souDono);
  const sucessor = GRUPO.pessoas.find((p) => !p.voce);
  let titulo = 'Sair do grupo?';
  let textoConfirmar = 'Sair do grupo';
  let corpo = [
    paragrafo('Você perde os ', [`${meusPontos} pontos`], ` que acumulou em ${GRUPO.nome}.`),
    paragrafo('Se o grupo ainda aceitar membros, você pode voltar pelo link de convite.'),
  ];
  if (souDono && outros.length > 1) {
    titulo = 'Sair e transferir o grupo?';
    textoConfirmar = 'Sair e transferir grupo';
    corpo = [
      paragrafo([sucessor.nome], ', quem entrou primeiro, passa a ser a pessoa dona do grupo.'),
      paragrafo('Você perde seus pontos e pode voltar pelo link de convite.'),
    ];
  }
  abrirConfirmacao({ titulo, corpo, textoConfirmar, tarefa: 'S1-50' });
}

function abrirJanelaRemoverMembro(pessoa) {
  abrirConfirmacao({
    titulo: `Remover ${pessoa.nome.split(' ')[0]}?`,
    corpo: [
      paragrafo([pessoa.nome], ' perde todos os pontos neste grupo.'),
      paragrafo('A pessoa fica ', ['bloqueada permanentemente'], ' e não poderá voltar nem por convite.'),
    ],
    textoConfirmar: 'Remover e bloquear',
    tarefa: 'S1-48',
  });
}

function abrirJanelaExcluirConclusao(post) {
  abrirConfirmacao({
    titulo: 'Excluir conclusão?',
    corpo: [paragrafo('Os ', [`${post.pontos} pontos`], ` concedidos por essa conclusão serão descontados do ranking de ${post.nome}.`)],
    textoConfirmar: 'Excluir e descontar pontos',
    tarefa: 'S1-49',
  });
}

function abrirJanelaExcluirGrupo() {
  abrirConfirmacao({
    titulo: 'Excluir este grupo?',
    corpo: [paragrafo('Essa ação é ', ['permanente'], `. ${GRUPO.pessoas.length} membros perdem o acesso a ${GRUPO.nome}.`)],
    textoConfirmar: 'Excluir grupo',
    tarefa: 'S1-51',
  });
}

// Menu do dono: data final, atividades e exclusão (edição de verdade: S1-47)
function abrirJanelaGerenciar() {
  abrirJanela('Gerenciar grupo', (fechar) => {
    const entrada = criarElemento('input', CLASSE_INPUT);
    entrada.id = 'gerenciar-fim';
    entrada.type = 'date';
    entrada.value = GRUPO.dataFim;
    const campoFim = criarCampo({ id: 'gerenciar-fim', rotulo: 'Encerra em', controle: entrada });

    const lista = criarElemento('ul', 'space-y-2');
    GRUPO.atividades.forEach((atividade, indice) => {
      const item = criarElemento('li', 'rounded-[14px] bg-surface-2 p-3');
      const campo = criarElemento('input', CLASSE_INPUT);
      campo.value = atividade.nome;
      campo.setAttribute('aria-label', `Nome da atividade ${indice + 1}`);
      const linha = criarElemento('div', 'mt-2 flex items-center justify-between');
      linha.appendChild(criarElemento('span', 'text-[14px] text-ink-2', 'Pontos'));
      linha.appendChild(criarStepper({ rotulo: 'pontos', valor: atividade.pontos, min: 1, max: 10 }).elemento);
      item.appendChild(campo);
      item.appendChild(linha);
      lista.appendChild(item);
    });

    const perigo = criarElemento('div', 'rounded-[18px] border border-danger/30 bg-danger-tint p-4');
    const titulo = criarElemento('h3', 'flex items-center gap-2 text-[17px] font-semibold text-danger');
    titulo.appendChild(icone('AlertTriangle', { tamanho: 18 }));
    titulo.appendChild(document.createTextNode('Zona de perigo'));
    perigo.appendChild(titulo);
    perigo.appendChild(criarElemento('p', 'mt-1 text-[14px] leading-5 text-danger/90', 'Excluir o grupo apaga membros, ranking, feed e conclusões para todo mundo.'));
    perigo.appendChild(criarBotaoAcao('Excluir grupo', {
      variante: 'dangerSolid', extra: 'mt-3 w-full',
      aoClicar: () => {
        fechar();
        abrirJanelaExcluirGrupo();
      },
    }));

    const dica = criarElemento('p', 'px-1 text-[13px] text-ink-2', 'A nova pontuação vale apenas para conclusões feitas dali em diante.');
    const corpo = criarElemento('div', 'mt-4 space-y-5');
    [campoFim, criarElemento('p', 'text-[15px] font-medium', 'Atividades'), lista, dica].forEach((no) => corpo.appendChild(no));

    return [
      corpo,
      criarAcoesJanela([
        criarBotaoAcao('Salvar alterações', { aoClicar: () => { fechar(); emConstrucao('S1-47'); } }),
        criarBotaoAcao('Cancelar', { variante: 'secondary', aoClicar: fechar }),
      ]),
      criarElemento('div', 'mt-6', ''),
      perigo,
    ];
  });
}

// Postar conclusão: atividade + foto obrigatória + texto (salvar de verdade: S1-41 a S1-43)
function abrirJanelaPostar() {
  abrirJanela('Postar conclusão', (fechar) => {
    let escolhida = null;
    let temFoto = false;

    const formulario = criarElemento('form', 'mt-4 space-y-5');
    formulario.noValidate = true;
    const resumo = criarElemento('div');

    // Atividade (rádio)
    const conjunto = criarElemento('fieldset');
    conjunto.appendChild(criarElemento('legend', 'mb-2 text-[15px] font-medium', 'Atividade'));
    const grupoRadio = criarElemento('div', 'space-y-2');
    grupoRadio.setAttribute('role', 'radiogroup');
    const erroAtividade = criarElemento('div');
    function desenharAtividades() {
      grupoRadio.replaceChildren();
      GRUPO.atividades.forEach((atividade) => {
        const ligada = escolhida === atividade.id;
        const botao = criarElemento('button', juntar(
          'press flex min-h-14 w-full items-center gap-3 rounded-[12px] border px-4 py-2 text-left disabled:opacity-60',
          ligada ? 'border-action bg-action-tint ring-1 ring-action' : 'border-line bg-surface',
        ));
        botao.type = 'button';
        botao.setAttribute('role', 'radio');
        botao.setAttribute('aria-checked', String(ligada));
        botao.disabled = atividade.feitoHoje;
        const bolinha = criarElemento('span', juntar('flex size-5 shrink-0 items-center justify-center rounded-full border-2', ligada ? 'border-action' : 'border-line'));
        if (ligada) {
          bolinha.appendChild(criarElemento('span', 'size-2.5 rounded-full bg-action'));
        }
        const texto = criarElemento('span', 'min-w-0 flex-1');
        texto.appendChild(criarElemento('b', 'block text-[16px] font-medium', atividade.nome));
        if (atividade.feitoHoje) {
          texto.appendChild(criarElemento('span', 'text-[13px] text-ink-2', 'Já feita hoje, volte amanhã'));
        }
        botao.appendChild(bolinha);
        botao.appendChild(texto);
        botao.appendChild(criarElemento('span', 'tnum rounded-full bg-surface-2 px-2.5 py-1 text-[13px] font-semibold', `+${atividade.pontos}`));
        botao.addEventListener('click', () => {
          escolhida = atividade.id;
          desenharAtividades();
          desenharBotaoPublicar();
        });
        grupoRadio.appendChild(botao);
      });
    }
    conjunto.appendChild(grupoRadio);
    conjunto.appendChild(erroAtividade);

    // Foto (obrigatória). Ler, reduzir e guardar a imagem é a S1-41.
    const blocoFoto = criarElemento('div');
    blocoFoto.appendChild(criarElemento('p', 'mb-2 text-[15px] font-medium', 'Foto'));
    const entradaFoto = criarElemento('input', 'sr-only');
    entradaFoto.type = 'file';
    entradaFoto.accept = 'image/*';
    entradaFoto.id = 'foto';
    const areaFoto = criarElemento('div');
    const erroFoto = criarElemento('div');
    function desenharFoto(urlPrevia) {
      areaFoto.replaceChildren();
      temFoto = Boolean(urlPrevia);
      if (urlPrevia) {
        const caixa = criarElemento('div', 'relative overflow-hidden rounded-[14px] bg-surface-2');
        const imagem = criarElemento('img', 'aspect-[4/3] w-full object-cover');
        imagem.src = urlPrevia;
        imagem.alt = 'Prévia da foto selecionada';
        const remover = criarElemento('button', 'press absolute top-2 right-2 flex size-11 items-center justify-center rounded-full bg-black/70 text-white');
        remover.type = 'button';
        remover.setAttribute('aria-label', 'Remover foto');
        remover.appendChild(icone('X', { tamanho: 18 }));
        remover.addEventListener('click', () => {
          entradaFoto.value = '';
          desenharFoto('');
        });
        caixa.appendChild(imagem);
        caixa.appendChild(remover);
        areaFoto.appendChild(caixa);
      } else {
        const rotuloFoto = criarElemento('label', 'press flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-line bg-surface text-[15px] font-medium text-ink-2 hover:bg-surface-2');
        rotuloFoto.htmlFor = 'foto';
        rotuloFoto.appendChild(icone('Camera', { tamanho: 26 }));
        rotuloFoto.appendChild(document.createTextNode('Tirar ou escolher uma foto'));
        areaFoto.appendChild(rotuloFoto);
      }
    }
    entradaFoto.addEventListener('change', () => {
      const arquivo = entradaFoto.files[0];
      desenharFoto(arquivo ? URL.createObjectURL(arquivo) : '');
    });
    desenharFoto('');
    [entradaFoto, areaFoto, erroFoto].forEach((no) => blocoFoto.appendChild(no));

    // Texto opcional
    const texto = criarElemento('textarea', juntar(CLASSE_INPUT, 'py-3 leading-6'));
    texto.id = 'texto-conclusao';
    texto.rows = 3;
    texto.placeholder = 'Conte como foi';
    const campoTexto = criarCampo({ id: 'texto-conclusao', rotulo: 'Texto (opcional)', controle: texto });

    // Aviso
    const link = criarElemento('a', 'underline', 'Hoje');
    link.href = 'habitos.html';
    const aviso = criarAviso({
      tom: 'info', iconeNome: 'Info',
      conteudo: ['Publicar não marca nenhum hábito seu. Para registrar, vá em ', link, '.'],
    });

    // Botão publicar (mostra os pontos quando há atividade escolhida)
    const areaPublicar = criarElemento('div');
    function desenharBotaoPublicar() {
      areaPublicar.replaceChildren();
      const atividade = GRUPO.atividades.find((a) => a.id === escolhida);
      const rotulo = atividade ? `Publicar conclusão · +${atividade.pontos} pts` : 'Publicar conclusão';
      areaPublicar.appendChild(criarBotaoAcao(rotulo, { tipo: 'submit', extra: 'w-full' }));
    }

    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const erros = [];
      if (!escolhida) {
        erros.push('Escolha a atividade que você concluiu.');
      }
      if (!temFoto) {
        erros.push('A foto é obrigatória para postar a conclusão.');
      }
      resumo.replaceChildren();
      const caixa = criarResumoErros(erros);
      if (caixa) {
        resumo.appendChild(caixa);
        return;
      }
      fechar();
      emConstrucao('S1-42');
    });

    desenharAtividades();
    desenharBotaoPublicar();
    [resumo, conjunto, blocoFoto, campoTexto, aviso, areaPublicar].forEach((no) => formulario.appendChild(no));
    return [formulario];
  });
}

// ---------------------------------------------------------------------------
// Blocos da página

function criarBotaoGerenciar() {
  const botao = criarElemento('button', 'press flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-action hover:bg-action-tint');
  botao.type = 'button';
  botao.setAttribute('aria-label', 'Gerenciar grupo');
  botao.appendChild(icone('Settings', { tamanho: 18 }));
  botao.appendChild(criarElemento('span', 'hidden sm:inline', 'Gerenciar'));
  botao.addEventListener('click', abrirJanelaGerenciar);
  return botao;
}

function criarBotaoPostar(extra) {
  return criarBotaoAcao('Postar conclusão', { extra, iconeNome: 'Camera', iconeTamanho: 19, aoClicar: abrirJanelaPostar });
}

function criarResumoDoGrupo() {
  const secao = criarElemento('section', 'pt-5 pb-4');

  const chips = criarElemento('div', 'flex flex-wrap items-center gap-2');
  chips.appendChild(criarChipCategoria(GRUPO.categoria));
  chips.appendChild(criarSeloStatus(status));
  secao.appendChild(chips);

  secao.appendChild(criarElemento('h2', 'mt-3 text-[28px] leading-[34px] font-bold tracking-[-0.02em]', GRUPO.nome));
  if (GRUPO.descricao) {
    secao.appendChild(criarElemento('p', 'mt-1 text-[16px] leading-[22px] text-ink-2', GRUPO.descricao));
  }

  const info = criarElemento('p', 'tnum mt-2 text-[14px] text-ink-2', `${textoPeriodo(GRUPO.dataInicio, GRUPO.dataFim)} · ${textoMembros(GRUPO.pessoas.length)}`);
  if (!encerrado && status !== 'nao-iniciado') {
    info.appendChild(document.createTextNode(' · Você: '));
    info.appendChild(criarElemento('b', 'text-ink', `${meusPontos} pts`));
  }
  secao.appendChild(info);

  if (!encerrado) {
    secao.appendChild(criarCaixaLink(montarLinkConvite(GRUPO.codigoConvite)));
  }

  const situacao = criarElemento('div', 'mt-4');
  if (encerrado) {
    situacao.appendChild(criarAviso({
      tom: 'info', iconeNome: 'Lock',
      conteudo: `Grupo encerrado em ${formatarDia(GRUPO.dataFim, true)}. Ranking final salvo. Convites encerrados.`,
    }));
    secao.appendChild(situacao);
  } else if (status === 'nao-iniciado') {
    situacao.appendChild(criarAviso({
      tom: 'warn', iconeNome: 'Info',
      conteudo: `Este grupo começa em ${formatarDia(GRUPO.dataInicio, true)}. Você poderá postar conclusões a partir daí.`,
    }));
    secao.appendChild(situacao);
  } else {
    secao.appendChild(criarBotaoPostar('mt-4 w-full'));
  }
  return secao;
}

function criarListaCaixa(classeLista = 'divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface', tag = 'ul') {
  return criarElemento(tag, classeLista);
}

function criarPainelFeed() {
  if (POSTAGENS.length === 0) {
    const podePostar = !encerrado && status === 'andamento';
    return criarVazio({
      iconeNome: 'Camera',
      titulo: 'Nenhuma conclusão ainda',
      texto: encerrado ? 'Este grupo encerrou sem conclusões publicadas.' : 'Seja a primeira pessoa a postar uma conclusão.',
      acao: podePostar ? criarBotaoPostar('') : undefined,
    });
  }
  const lista = criarElemento('div', 'space-y-3');
  POSTAGENS.forEach((post) => {
    const aoExcluir = souDono && !encerrado ? () => abrirJanelaExcluirConclusao(post) : undefined;
    lista.appendChild(criarCartaoPostagem(post, { aoExcluir }));
  });
  return lista;
}

function criarPainelRanking() {
  const raiz = criarElemento('div');
  if (encerrado) {
    raiz.appendChild(criarElemento('p', 'mb-2 px-1 text-[17px] font-semibold', 'Ranking final'));
  }
  const lista = criarListaCaixa(undefined, 'ol');
  // RUBRICA: programação funcional (calcularPosicoes usa sort + map)
  calcularPosicoes(GRUPO.pessoas).forEach((pessoa) => lista.appendChild(criarLinhaRanking(pessoa)));
  raiz.appendChild(lista);
  return raiz;
}

function criarPainelAtividades() {
  const lista = criarListaCaixa();
  GRUPO.atividades.forEach((atividade) => lista.appendChild(criarLinhaAtividade(atividade)));
  return lista;
}

function criarPainelMembros() {
  const raiz = criarElemento('div');
  const lista = criarListaCaixa();
  GRUPO.pessoas.forEach((pessoa) => {
    lista.appendChild(criarLinhaMembro({
      nome: pessoa.nome,
      usuario: pessoa.usuario,
      voce: pessoa.voce,
      dono: pessoa.usuario === DONO_USUARIO,
      podeRemover: souDono && !pessoa.voce && !encerrado,
      aoRemover: () => abrirJanelaRemoverMembro(pessoa),
    }));
  });
  raiz.appendChild(lista);
  raiz.appendChild(criarBotaoAcao('Sair do grupo', { variante: 'danger', extra: 'mt-6 w-full', aoClicar: abrirJanelaSair }));
  return raiz;
}

const PAINEIS = {
  feed: criarPainelFeed,
  ranking: criarPainelRanking,
  atividades: criarPainelAtividades,
  membros: criarPainelMembros,
};

function montarPagina() {
  const conteudo = document.querySelector('#conteudo');
  document.title = `${GRUPO.nome} - Habit Tracker`;

  conteudo.appendChild(criarCabecalhoPagina({
    titulo: GRUPO.nome,
    voltarPara: 'grupos.html',
    direita: souDono ? criarBotaoGerenciar() : undefined,
  }));
  conteudo.appendChild(criarResumoDoGrupo());

  const painel = criarElemento('div', 'mt-3');
  painel.setAttribute('role', 'tabpanel');

  function mostrarAba(aba) {
    painel.replaceChildren(PAINEIS[aba]());
    // A aba fica na URL (?aba=ranking), sem criar uma entrada nova no histórico
    const url = new URL(window.location.href);
    url.searchParams.set('aba', aba);
    window.history.replaceState(null, '', url);
  }

  const pedida = parametros.get('aba');
  const abaInicial = ABAS.includes(pedida) ? pedida : 'feed';

  const fixa = criarElemento('div', 'sticky top-14 z-10 -mx-4 bg-bg/92 px-4 py-2 backdrop-blur-lg md:mx-0');
  fixa.appendChild(criarAbas({
    rotulo: 'Seções do grupo',
    rolagem: true,
    valor: abaInicial,
    aoMudar: mostrarAba,
    opcoes: [
      { id: 'feed', rotulo: 'Feed' },
      { id: 'ranking', rotulo: 'Ranking' },
      { id: 'atividades', rotulo: 'Atividades' },
      { id: 'membros', rotulo: 'Membros' },
    ],
  }));
  conteudo.appendChild(fixa);
  conteudo.appendChild(painel);
  mostrarAba(abaInicial);
}

montarPagina();
