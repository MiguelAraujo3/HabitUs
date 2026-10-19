import { salvarLista, lerLista } from './storage.js';
import { hoje, somarDias, paraChave } from '../utils/datas.js';

// ============================================================
// seed.js - Dados iniciais (Stage S1-05)
// carregarDadosIniciais() so POPULA quando localStorage estiver vazio.
// NUNCA sobrescreve dados existentes.
// Apenas exportada; nao e chamada por nenhuma pagina.
// ============================================================

const USUARIOS_SEED = [
  { id: 'u1', nome: 'Ana Silva', usuario: 'ana_silva', email: 'ana@email.com', senha: '123456', descricao: 'Estudante de computacao', dataCriacao: paraChave(hoje()) },
  { id: 'u2', nome: 'Bruno Costa', usuario: 'bruno_costa', email: 'bruno@email.com', senha: 'abc123', descricao: 'Desenvolvedor front-end', dataCriacao: paraChave(somarDias(hoje(), -30)) },
  { id: 'u3', nome: 'Carla Dias', usuario: 'carla_dias', email: 'carla@email.com', senha: 'senha789', descricao: 'Professora de educacao fisica', dataCriacao: paraChave(somarDias(hoje(), -60)) },
  { id: 'u4', nome: 'Daniel Pereira', usuario: 'daniel_p', email: 'daniel@email.com', senha: 'senha000', descricao: 'Designer UX/UI', dataCriacao: paraChave(somarDias(hoje(), -90)) },
];

const HABITOS_SEED = [
  { id: 'h1', idUsuario: 'u1', nome: 'Beber agua', categoria: 'Saude', descricao: '2 litros por dia', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(hoje()), ativo: true },
  { id: 'h2', idUsuario: 'u1', nome: 'Corrida matinal', categoria: 'Esportes e exercicios', descricao: '5 km manha', frequencia: { tipo: 'dias-semana', dias: [1, 3, 5], vezes: undefined }, dataCriacao: paraChave(somarDias(hoje(), -7)), ativo: true },
  { id: 'h3', idUsuario: 'u2', nome: 'Leitura', categoria: 'Leitura', descricao: '30 min antes de dormir', frequencia: { tipo: 'vezes-semana', vezes: 4 }, dataCriacao: paraChave(somarDias(hoje(), -14)), ativo: true },
  { id: 'h4', idUsuario: 'u2', nome: 'Estudar ingles', categoria: 'Estudos', descricao: 'Duolingo diario', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(somarDias(hoje(), -20)), ativo: true },
  { id: 'h5', idUsuario: 'u3', nome: 'Academia', categoria: 'Esportes e exercicios', descricao: 'Musculacao 3x semana', frequencia: { tipo: 'dias-semana', dias: [2, 4, 6] }, dataCriacao: paraChave(somarDias(hoje(), -10)), ativo: true },
  { id: 'h6', idUsuario: 'u3', nome: 'Meditar', categoria: 'Bem-estar mental', descricao: '10 min de mindfulness', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(somarDias(hoje(), -5)), ativo: true },
  { id: 'h7', idUsuario: 'u4', nome: 'Economizar', categoria: 'Financas', descricao: 'Registrar gastos', frequencia: { tipo: 'vezes-semana', vezes: 5 }, dataCriacao: paraChave(somarDias(hoje(), -25)), ativo: true },
  { id: 'h8', idUsuario: 'u4', nome: 'Dormir cedo', categoria: 'Sono', descricao: 'Na cama as 22h30', frequencia: { tipo: 'diaria' }, dataCriacao: paraChave(somarDias(hoje(), -40)), ativo: true },
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

export async function carregarDadosIniciais() {
  // So popula se localStorage estiver vazio (chave 'usuarios' ausente ou [])
  const usuariosExistentes = lerLista('usuarios');
  if (usuariosExistentes && usuariosExistentes.length > 0) {
    return; // NUNCA sobrescreve dados existentes
  }

  // 1. Usuarios (gravados direto, sem importar usuarios.js)
  salvarLista('usuarios', USUARIOS_SEED);

  // 2. Habitos
  salvarLista('habitos', HABITOS_SEED);

  // 3. Grupos
  salvarLista('grupos', GRUPOS_SEED);

  // 4. Atividades
  salvarLista('atividades', ATIVIDADES_SEED);

  // 5. Membros
  salvarLista('membros', MEMBROS_SEED);

  // 6. Conclusoes de habito
  salvarLista('conclusoesHabito', CONCLUSIONES_HABITO_SEED);

  // 7. Conclusoes de grupo
  salvarLista('conclusoesGrupo', CONCLUSIONES_GRUPO_SEED);

  // 8. Recordes
  salvarLista('recordes', RECORDES_SEED);

  // 9. Totais
  salvarLista('totais', TOTAIS_SEED);

  // 10. Postagens
  salvarLista('postagens', POSTAGENS_SEED);
}