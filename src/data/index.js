export { 
  getUserByEmailOrUsername,
  verifyPassword,
  createUser,
  getUserById,
  updateUser,
} from './users.js';

export {
  iniciarSessao,
  obterSessao,
  encerrarSessao,
} from './session.js'

export { 
  entrar,
  obterUsuarioAtual,
 } from './auth.js';

export {
  getHabitsByUser
} from './habitos.js'

export {
  getCompletionsByHabit
} from './conclusoesHabito.js'

export {
  getHabitStreak
} from './consultas.js'

export {
  getPostsByUser
} from './postagens.js'