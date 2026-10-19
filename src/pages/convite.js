import '../styles/base.css';
import { exigirLogin } from '../components/auth.js';
import { mostrarToast } from '../components/ui.js';
import { criarTelaConvite, criarAcaoConvite } from '../components/grupos.js';
import { hoje, paraChave, somarDias } from '../utils/datas.js';

exigirLogin();

// Sem login o usuário é levado ao login e volta para este convite (auth.js guarda o destino).
// Por isso a tela não tem o estado "sem login".

// PROVISÓRIO: grupo de exemplo até a S1-54 ler o código no LocalStorage.
const GRUPO_PROVISORIO = {
  id: 'g1',
  nome: 'Movimento 30 Dias',
  categoria: 'Esportes e exercícios',
  dono: 'Rafael Lima',
  quantidadeMembros: 5,
  dataInicio: paraChave(somarDias(hoje(), -10)),
  dataFim: paraChave(somarDias(hoje(), 20)),
};

const ESTADOS = ['entrar', 'voltar', 'invalido', 'bloqueado', 'ja-membro', 'encerrado'];

function emConstrucao(tarefa) {
  mostrarToast(`Em construção · ${tarefa}`);
}

function descreverEstado(estado) {
  const grupo = GRUPO_PROVISORIO;
  const meta = {
    categoria: grupo.categoria,
    quantidadeMembros: grupo.quantidadeMembros,
    dataInicio: grupo.dataInicio,
    dataFim: grupo.dataFim,
  };

  if (estado === 'invalido') {
    return {
      iconeNome: 'CircleHelp', tom: 'neutro', titulo: 'Convite inválido',
      texto: 'Esse link não leva a nenhum grupo. Peça um novo link a quem convidou você.',
      meta: null,
      acoes: [criarAcaoConvite('Ir para Grupos', { href: 'grupos.html' })],
    };
  }
  if (estado === 'bloqueado') {
    return {
      iconeNome: 'Ban', tom: 'perigo', titulo: 'Você não pode entrar neste grupo',
      texto: 'O dono do grupo removeu você, e o acesso não pode ser recuperado por convite.',
      meta: null,
      acoes: [criarAcaoConvite('Voltar para Grupos', { href: 'grupos.html', variante: 'secondary' })],
    };
  }
  if (estado === 'ja-membro') {
    return {
      iconeNome: 'UserCheck', tom: 'acao', titulo: 'Você já está neste grupo',
      texto: `Você já participa de ${grupo.nome}.`,
      meta,
      acoes: [criarAcaoConvite('Abrir grupo', { href: `grupo.html?id=${grupo.id}` })],
    };
  }
  if (estado === 'encerrado') {
    return {
      iconeNome: 'CalendarX2', tom: 'encerrado', titulo: 'Convites encerrados',
      texto: `${grupo.nome} terminou e não aceita novos membros.`,
      meta,
      acoes: [criarAcaoConvite('Voltar para Grupos', { href: 'grupos.html', variante: 'secondary' })],
    };
  }
  const voltando = estado === 'voltar';
  return {
    iconeNome: 'PartyPopper', tom: 'lima',
    titulo: voltando ? `Quer voltar para ${grupo.nome}?` : `Entrar em ${grupo.nome}?`,
    texto: voltando
      ? 'Você saiu deste grupo antes. Ao voltar, começa de novo com zero pontos.'
      : `${grupo.dono} convidou você para este grupo.`,
    meta,
    acoes: [criarAcaoConvite(voltando ? 'Voltar para o grupo' : 'Entrar no grupo', { aoClicar: () => emConstrucao('S1-54') })],
  };
}

function montarPagina() {
  const parametros = new URLSearchParams(window.location.search);
  const pedido = parametros.get('estado'); // PROVISÓRIO: ?estado=invalido para ver cada tela
  const estado = ESTADOS.includes(pedido) ? pedido : 'entrar';

  const dados = descreverEstado(estado);
  document.querySelector('#app').appendChild(criarTelaConvite({ ...dados, destinoLogo: 'habitos.html' }));
}

montarPagina();
