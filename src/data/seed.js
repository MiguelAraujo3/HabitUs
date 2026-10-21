import { salvarLista } from './storage.js';
import { createUser, updateUser } from './index.js';
import { hoje, somarDias, paraChave } from '../utils/datas.js';

// ============================================================
// seed.js - Dados iniciais (Stage S1-05)
// carregarDadosIniciais() so POPULA quando todas as colecoes estiverem vazias.
// NUNCA sobrescreve dados existentes.
// Apenas exportada; nao e chamada por nenhuma pagina.
// ============================================================

const USUARIOS_SEED = [
  // Os IDs u1-u4 sao aliases internos; createUser gera os UUIDs persistidos.
  // As senhas de demonstracao sao usadas apenas como entrada para o cadastro.
  { id: 'u1', name: 'Ana Silva', username: 'ana_silva', email: 'ana@email.com', password: '123456', profileDescription: 'Estudante de computacao' },
  { id: 'u2', name: 'Bruno Costa', username: 'bruno_costa', email: 'bruno@email.com', password: 'abc123', profileDescription: 'Desenvolvedor front-end' },
  { id: 'u3', name: 'Carla Dias', username: 'carla_dias', email: 'carla@email.com', password: 'senha789', profileDescription: 'Professora de educacao fisica' },
  { id: 'u4', name: 'Daniel Pereira', username: 'daniel_p', email: 'daniel@email.com', password: 'senha000', profileDescription: 'Designer UX/UI' },
];

const HABITOS_SEED = [
  { id: 'h1', idUsuario: 'u1', nome: 'Beber agua', categoria: 'saude', descricao: '2 litros por dia', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(hoje()), ativo: true },
  { id: 'h2', idUsuario: 'u1', nome: 'Corrida matinal', categoria: 'esportes', descricao: '5 km manha', frequencia: { tipo: 'dias-semana', dias: [1, 3, 5] }, dataCriacao: paraChave(somarDias(hoje(), -7)), ativo: true },
  { id: 'h3', idUsuario: 'u2', nome: 'Leitura', categoria: 'leitura', descricao: '30 min antes de dormir', frequencia: { tipo: 'vezes-semana', vezes: 4 }, dataCriacao: paraChave(somarDias(hoje(), -14)), ativo: true },
  { id: 'h4', idUsuario: 'u2', nome: 'Estudar ingles', categoria: 'estudos', descricao: 'Duolingo diario', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(somarDias(hoje(), -20)), ativo: true },
  { id: 'h5', idUsuario: 'u3', nome: 'Academia', categoria: 'esportes', descricao: 'Musculacao 3x semana', frequencia: { tipo: 'dias-semana', dias: [2, 4, 6] }, dataCriacao: paraChave(somarDias(hoje(), -10)), ativo: true },
  { id: 'h6', idUsuario: 'u3', nome: 'Meditar', categoria: 'mental', descricao: '10 min de mindfulness', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(somarDias(hoje(), -5)), ativo: true },
  { id: 'h7', idUsuario: 'u4', nome: 'Economizar', categoria: 'financas', descricao: 'Registrar gastos', frequencia: { tipo: 'vezes-semana', vezes: 5 }, dataCriacao: paraChave(somarDias(hoje(), -25)), ativo: true },
  { id: 'h8', idUsuario: 'u4', nome: 'Dormir cedo', categoria: 'sono', descricao: 'Na cama as 22h30', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(somarDias(hoje(), -40)), ativo: true },
];

const dataHoje = hoje();
const grupoAbertoDataInicio = paraChave(somarDias(dataHoje, -5));
const grupoAbertoDataFim = paraChave(somarDias(dataHoje, 25));
const grupoEncerradoDataFim = paraChave(somarDias(dataHoje, -3));

const GRUPOS_SEED = [
  {
    id: 'g1',
    nome: 'Corrida de Rua SP',
    categoria: 'Esportes e exercicios',
    descricao: 'Grupo de corrida aos finais de semana',
    dataInicio: grupoAbertoDataInicio,
    dataFim: grupoAbertoDataFim,
    idDono: 'u1',
    codigoConvite: 'CORRIDA2026',
    encerrado: false,
    rankingFinal: null,
  },
  {
    id: 'g2',
    nome: 'Desafio Leitura 2026',
    categoria: 'Leitura',
    descricao: 'Grupo de leitura coletiva ja encerrado',
    dataInicio: paraChave(somarDias(dataHoje, -40)),
    dataFim: grupoEncerradoDataFim,
    idDono: 'u2',
    codigoConvite: 'LEITURA26',
    encerrado: true,
    rankingFinal: { u1: 1, u3: 2, u4: 3 },
  },
];

const ATIVIDADES_SEED = [
  // Atividades do grupo aberto (g1)
  { id: 'a1', idGrupo: 'g1', nome: 'Corrida 5km', pontos: 8 },
  { id: 'a2', idGrupo: 'g1', nome: 'Alongamento', pontos: 3 },
  { id: 'a3', idGrupo: 'g1', nome: 'Treino de escada', pontos: 7 },
  // Atividades do grupo encerrado (g2)
  { id: 'a4', idGrupo: 'g2', nome: 'Ler 1 livro', pontos: 5 },
  { id: 'a5', idGrupo: 'g2', nome: 'Resenha de livro', pontos: 4 },
  { id: 'a6', idGrupo: 'g2', nome: 'Encontro de discussao', pontos: 6 },
];

const MEMBROS_SEED = [
  // Membros do grupo aberto (g1) - horarios diferentes de entrada
  { id: 'm1', idGrupo: 'g1', idUsuario: 'u1', dataEntrada: '2026-10-10T08:00:00', bloqueado: false },
  { id: 'm2', idGrupo: 'g1', idUsuario: 'u2', dataEntrada: '2026-10-11T09:30:00', bloqueado: false },
  { id: 'm3', idGrupo: 'g1', idUsuario: 'u3', dataEntrada: '2026-10-12T10:15:00', bloqueado: false },
  // Membros do grupo encerrado (g2) - horarios diferentes
  { id: 'm4', idGrupo: 'g2', idUsuario: 'u2', dataEntrada: '2026-09-01T14:00:00', bloqueado: false },
  { id: 'm5', idGrupo: 'g2', idUsuario: 'u3', dataEntrada: '2026-09-02T15:30:00', bloqueado: false },
  { id: 'm6', idGrupo: 'g2', idUsuario: 'u4', dataEntrada: '2026-09-03T16:45:00', bloqueado: true },
];

const CONCLUSIONES_HABITO_SEED = [
  { id: 'ch1', idHabito: 'h1', data: paraChave(somarDias(dataHoje, -1)) },
  { id: 'ch2', idHabito: 'h1', data: paraChave(dataHoje) },
  { id: 'ch3', idHabito: 'h3', data: paraChave(somarDias(dataHoje, -2)) },
  { id: 'ch4', idHabito: 'h6', data: paraChave(somarDias(dataHoje, -1)) },
];

const CONCLUSIONES_GRUPO_SEED = [
  { id: 'cg1', idGrupo: 'g1', idAtividade: 'a1', idUsuario: 'u1', data: paraChave(somarDias(dataHoje, -2)), foto: 'foto1.jpg', texto: 'Otima corrida!' },
  { id: 'cg2', idGrupo: 'g1', idAtividade: 'a2', idUsuario: 'u2', data: paraChave(somarDias(dataHoje, -1)), foto: 'foto2.jpg', texto: 'Alongamento feito' },
  { id: 'cg3', idGrupo: 'g2', idAtividade: 'a4', idUsuario: 'u2', data: paraChave(somarDias(dataHoje, -5)), foto: 'foto3.jpg', texto: 'Livro concluido' },
  { id: 'cg4', idGrupo: 'g2', idAtividade: 'a5', idUsuario: 'u3', data: paraChave(somarDias(dataHoje, -4)), foto: 'foto4.jpg', texto: 'Resenha postada' },
];

const RECORDES_SEED = [
  { id: 'u1', idUsuario: 'u1', maiorSequencia: 12 },
  { id: 'u2', idUsuario: 'u2', maiorSequencia: 8 },
  { id: 'u3', idUsuario: 'u3', maiorSequencia: 15 },
  { id: 'u4', idUsuario: 'u4', maiorSequencia: 5 },
];

const TOTAIS_SEED = [
  { id: 'u1', idUsuario: 'u1', atividadesConcluidas: 24 },
  { id: 'u2', idUsuario: 'u2', atividadesConcluidas: 18 },
  { id: 'u3', idUsuario: 'u3', atividadesConcluidas: 30 },
  { id: 'u4', idUsuario: 'u4', atividadesConcluidas: 12 },
];

const POSTAGENS_SEED = [
  { id: 'p1', idUsuario: 'u1', idHabito: 'h1', texto: 'Consegui beber agua hoje!', imagem: null, dataHora: new Date(somarDias(dataHoje, -1)).toISOString() },
  { id: 'p2', idUsuario: 'u2', idHabito: 'h3', texto: 'Terminei mais um livro.', imagem: null, dataHora: new Date(somarDias(dataHoje, -2)).toISOString() },
  { id: 'p3', idUsuario: 'u3', idHabito: 'h5', texto: 'Treino de pernas concluido.', imagem: null, dataHora: new Date(somarDias(dataHoje, -3)).toISOString() },
  { id: 'p4', idUsuario: 'u4', idHabito: 'h7', texto: 'Economizei R$ 50 esta semana.', imagem: null, dataHora: new Date(somarDias(dataHoje, -4)).toISOString() },
  { id: 'p5', idUsuario: 'u1', idHabito: 'h2', texto: 'Corrida de 5km feita.', imagem: null, dataHora: new Date(somarDias(dataHoje, -5)).toISOString() },
  { id: 'p6', idUsuario: 'u2', idHabito: 'h4', texto: 'Aula de ingles realizada.', imagem: null, dataHora: new Date(somarDias(dataHoje, -6)).toISOString() },
];

const COLECOES = [
  'usuarios', 'habitos', 'grupos', 'atividades', 'membros',
  'conclusoesHabito', 'conclusoesGrupo', 'recordes', 'totais',
  'postagens', 'comentarios', 'curtidas',
];

function baseEstaVazia() {
  return COLECOES.every((chave) => {
    const texto = localStorage.getItem(chave);
    if (texto === null) return true;

    // lerLista trata JSON invalido como []; aqui precisamos preservar esses dados.
    try {
      const registros = JSON.parse(texto);
      return Array.isArray(registros) && registros.length === 0;
    } catch {
      return false;
    }
  });
}

function vincularUsuarios(registros, idsUsuarios) {
  return registros.map((registro) => ({
    ...registro,
    idUsuario: idsUsuarios[registro.idUsuario],
  }));
}

export async function carregarDadosIniciais() {
  if (!baseEstaVazia()) return;

  const idsUsuarios = {};
  for (const { id, profileDescription, ...dadosCadastro } of USUARIOS_SEED) {
    const usuario = await createUser(dadosCadastro);
    await updateUser(usuario.id, { profileDescription });
    idsUsuarios[id] = usuario.id;
  }

  const grupos = GRUPOS_SEED.map((grupo) => ({
    ...grupo,
    idDono: idsUsuarios[grupo.idDono],
    rankingFinal: grupo.rankingFinal === null ? null : Object.fromEntries(
      Object.entries(grupo.rankingFinal).map(([idUsuario, posicao]) => [
        idsUsuarios[idUsuario], posicao,
      ])
    ),
  }));

  // Nestas colecoes, o ID do registro tambem e o ID do usuario.
  const recordes = vincularUsuarios(RECORDES_SEED, idsUsuarios)
    .map((registro) => ({ ...registro, id: registro.idUsuario }));
  const totais = vincularUsuarios(TOTAIS_SEED, idsUsuarios)
    .map((registro) => ({ ...registro, id: registro.idUsuario }));

  salvarLista('habitos', vincularUsuarios(HABITOS_SEED, idsUsuarios));
  salvarLista('grupos', grupos);
  salvarLista('atividades', ATIVIDADES_SEED);
  salvarLista('membros', vincularUsuarios(MEMBROS_SEED, idsUsuarios));
  salvarLista('conclusoesHabito', CONCLUSIONES_HABITO_SEED);
  salvarLista('conclusoesGrupo', vincularUsuarios(CONCLUSIONES_GRUPO_SEED, idsUsuarios));
  salvarLista('recordes', recordes);
  salvarLista('totais', totais);
  salvarLista('postagens', vincularUsuarios(POSTAGENS_SEED, idsUsuarios));
}
