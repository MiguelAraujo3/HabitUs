export {
  getUserByEmailOrUsername,
  verifyPassword,
  createUser,
  getUserById,
  updateUser,
  type Usuario,
  type ErroComCodigo,
} from './users.js';

export {
  iniciarSessao,
  obterSessao,
  encerrarSessao,
  type SessaoUsuario,
} from './session.js';

export {
  entrar,
  obterUsuarioAtual,
  type PerfilPublico,
} from './auth.js';

export {
  getHabitsByUser,
} from './habitos.js';

export {
  getCompletionsByHabit,
} from './conclusoesHabito.js';

export {
  getHabitStreak,
  type SequenciaHabito,
} from './consultas.js';

export {
  getPostsByUser,
  type Postagem,
} from './postagens.js';
