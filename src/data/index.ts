export {
  getUserByEmailOrUsername,
  verifyPassword,
  createUser,
  getUserById,
  updateUser,
  type Usuario,
  type ErroComCodigo,
} from './users';

export {
  iniciarSessao,
  obterSessao,
  encerrarSessao,
  type SessaoUsuario,
} from './session';

export {
  entrar,
  obterUsuarioAtual,
  type PerfilPublico,
} from './auth';

export {
  getHabitsByUser,
} from './habitos';

export {
  getCompletionsByHabit,
} from './conclusoesHabito';

export {
  getHabitStreak,
  type SequenciaHabito,
} from './consultas';

export {
  getPostsByUser,
  type Postagem,
} from './postagens';
