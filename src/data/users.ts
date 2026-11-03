import { lerLista, salvarLista } from './storage.js';
import { conferirSenha, gerarHashSenha } from '../utils/crypto.js';
import { validarCadastro, validarPerfil, type DadosCadastro, type DadosPerfil } from '../rules/validation.js';

export interface Usuario {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  salt: string;
  iterations: number;
  profileDescription: string;
  createdAt: string;
}

export interface ErroComCodigo extends Error {
  code?: string;
}

function criarErro(mensagem: string, codigo: string): ErroComCodigo {
  const erro: ErroComCodigo = new Error(mensagem);
  erro.code = codigo;
  return erro;
}

export async function getUserByEmailOrUsername(identifier: string): Promise<Usuario | null> {
  const identificador = identifier.trim().toLowerCase();
  const usuarios = lerLista<Usuario>('usuarios');

  const usuario = usuarios.find((usuario) => {
    const email = usuario.email.toLowerCase();
    const username = usuario.username.toLowerCase();

    return email === identificador || username === identificador;
  });
  return usuario || null;
}

export async function verifyPassword(user: Usuario | null, password: string): Promise<boolean> {
  if (!user) {
    return false;
  }
  return conferirSenha(password, user.passwordHash, user.salt, user.iterations);
}

export async function createUser(userData: DadosCadastro): Promise<Usuario> {
  const dados = {
    name: userData.name?.trim(),
    username: userData.username?.trim().toLowerCase(),
    email: userData.email?.trim().toLowerCase(),
    password: userData.password,
  };
  const mensagem = validarCadastro(dados);
  if (mensagem) {
    throw criarErro(mensagem, 'VALIDATION_ERROR');
  }
  const credenciais = await gerarHashSenha(dados.password!);
  const usuarios = lerLista<Usuario>('usuarios');

  if (usuarios.some((usuario) => usuario.username === dados.username)) {
    throw criarErro('Esse nome de usuário já está cadastrado.', 'ALREADY_EXISTS');
  }
  if (usuarios.some((usuario) => usuario.email === dados.email)) {
    throw criarErro('Esse e-mail já está cadastrado.', 'ALREADY_EXISTS');
  }
  const usuario: Usuario = {
    id: crypto.randomUUID(),
    name: dados.name!,
    username: dados.username!,
    email: dados.email!,
    passwordHash: credenciais.hash,
    salt: credenciais.salt,
    iterations: credenciais.iterations,
    profileDescription: '',
    createdAt: new Date().toISOString(),
  };
  usuarios.push(usuario);
  salvarLista('usuarios', usuarios);
  return usuario;
}

export async function getUserById(userId: string): Promise<Usuario | null> {
  const usuarios = lerLista<Usuario>('usuarios');

  return usuarios.find((usuario) => usuario.id === userId) || null;
}

export async function updateUser(id: string, data: DadosPerfil): Promise<Usuario> {
  const usuarios = lerLista<Usuario>('usuarios');
  const indice = usuarios.findIndex((usuario) => usuario.id === id);

  if (indice === -1) {
    throw criarErro('Usuário não encontrado.', 'NOT_FOUND');
  }
  const usuario = usuarios[indice];

  const atualizado: Usuario = {
    ...usuario,
    name: data.name !== undefined ? data.name.trim() : usuario.name,
    username: data.username !== undefined ? data.username.trim().toLowerCase() : usuario.username,
    profileDescription:
      data.profileDescription !== undefined ? data.profileDescription.trim() : usuario.profileDescription,
  };
  const mensagem = validarPerfil(atualizado);
  if (mensagem) {
    throw criarErro(mensagem, 'VALIDATION_ERROR');
  }
  const usernameEmUso = usuarios.some((outroUsuario) => {
    return outroUsuario.id !== id && outroUsuario.username.toLowerCase() === atualizado.username;
  });
  if (usernameEmUso) {
    throw criarErro('Esse nome de usuário já está cadastrado.', 'ALREADY_EXISTS');
  }
  usuarios[indice] = atualizado;
  salvarLista('usuarios', usuarios);

  return atualizado;
}
