import { 
  getUserByEmailOrUsername,
  verifyPassword,
  getUserById,
} from "./users.js";

import { 
  iniciarSessao,
  obterSessao,
  encerrarSessao,
 } from "./session.js";

export async function entrar(identifier, password) {
  if (
    typeof identifier !== 'string' ||
    !identifier.trim() ||
    typeof password !== 'string' || 
    !password
  ) {
    const erro = new Error('Informe o usuário ou e-mail e a senha.');
    erro.code = 'VALIDATION_ERROR';
    throw erro;
  }
  const usuario = await getUserByEmailOrUsername(identifier);
  const senhaCorreta = await verifyPassword(usuario, password);
  if (!senhaCorreta) {
    const erro = new Error('Usuário ou senha incorretos.');
    erro.code = 'UNAUTHORIZED';
    throw erro;
  }
  await iniciarSessao(usuario.id);
  
  return perfilPublico(usuario);
}
function perfilPublico(usuario) {
  return {
    id: usuario.id,
    name: usuario.name,
    username: usuario.username,
    email: usuario.email,
    profileDescription: usuario.profileDescription,
    createdAt: usuario.createdAt,
  };
}
export async function obterUsuarioAtual() {
  const sessao = await obterSessao();

  if (!sessao) {
    return null;
  }

  const usuario = await getUserById(sessao.userId);

  if (!usuario) {
    await encerrarSessao();
    return null;
  }

  return perfilPublico(usuario);
}