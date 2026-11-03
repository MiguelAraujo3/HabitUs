import {
  getUserByEmailOrUsername,
  verifyPassword,
  getUserById,
  type Usuario,
  type ErroComCodigo,
} from './users.js';

import {
  iniciarSessao,
  obterSessao,
  encerrarSessao,
} from './session.js';

export interface PerfilPublico {
  id: string;
  name: string;
  username: string;
  email: string;
  profileDescription: string;
  createdAt: string;
}

export async function entrar(identifier: string, password: string): Promise<PerfilPublico> {
  if (
    typeof identifier !== 'string' ||
    !identifier.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    const erro: ErroComCodigo = new Error('Informe o usuário ou e-mail e a senha.');
    erro.code = 'VALIDATION_ERROR';
    throw erro;
  }
  const usuario = await getUserByEmailOrUsername(identifier);
  const senhaCorreta = await verifyPassword(usuario, password);
  if (!senhaCorreta || !usuario) {
    const erro: ErroComCodigo = new Error('Usuário ou senha incorretos.');
    erro.code = 'UNAUTHORIZED';
    throw erro;
  }
  await iniciarSessao(usuario.id);

  return perfilPublico(usuario);
}

function perfilPublico(usuario: Usuario): PerfilPublico {
  return {
    id: usuario.id,
    name: usuario.name,
    username: usuario.username,
    email: usuario.email,
    profileDescription: usuario.profileDescription,
    createdAt: usuario.createdAt,
  };
}

export async function obterUsuarioAtual(): Promise<PerfilPublico | null> {
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
