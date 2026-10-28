import { lerLista, salvarLista } from './storage.js'
import { conferirSenha, gerarHashSenha } from '../utils/crypto.js'
import { validarCadastro, validarPerfil } from '../rules/validation.js';

export async function getUserByEmailOrUsername(identifier) {
  const identificador = identifier.trim().toLowerCase();
  const usuarios = lerLista('usuarios');

  const usuario = usuarios.find((usuario) => {
    const email = usuario.email.toLowerCase();
    const username = usuario.username.toLowerCase();

    return email === identificador || username === identificador;
  });
  return usuario || null
}

export async function verifyPassword(user, password) {
  if (!user) {
    return false
  }
  return conferirSenha(
    password,
    user.passwordHash,
    user.salt,
    user.iterations
  );
}
export async function createUser(userData) {
  const dados = { 
    name: userData.name?.trim(),
    username: userData.username?.trim().toLowerCase(),
    email: userData.email?.trim().toLowerCase(),
    password: userData.password,
  }
  const mensagem = validarCadastro(dados)
  if (mensagem) {
    /** @type {Error & { code?: string }} */
    const erro = new Error(mensagem);
    erro.code = 'VALIDATION_ERROR';
    throw erro;
  }
  const credenciais = await gerarHashSenha(dados.password);
  const usuarios = lerLista('usuarios');

  if (usuarios.some((usuario)=> usuario.username === dados.username)) {
    /** @type {Error & { code?: string }} */
    const erro = new Error('Esse nome de usuário já está cadastrado.')
    erro.code = 'ALREADY_EXISTS'
    throw erro;
  }
  if (usuarios.some((usuario) => usuario.email === dados.email)) {
    /** @type {Error & { code?: string }} */
    const erro = new Error('Esse e-mail já está cadastrado.');
    erro.code = 'ALREADY_EXISTS';
    throw erro;
  }
  const usuario = { 
    id: crypto.randomUUID(),
    name: dados.name,
    username: dados.username,
    email: dados.email,
    passwordHash: credenciais.hash,
    salt: credenciais.salt,
    iterations: credenciais.iterations,
    profileDescription: '',
    createdAt: new Date().toISOString(),
  };
  usuarios.push(usuario);
  salvarLista('usuarios', usuarios);
  return usuario
}
export async function getUserById(userId) {
  const usuarios = lerLista('usuarios');

  return usuarios.find((usuario) => usuario.id === userId) || null;
}

export async function updateUser(id, data) {
  const usuarios = lerLista('usuarios');
  const indice = usuarios.findIndex((usuario) =>usuario.id===id);

  if (indice === -1 ) {
    /** @type {Error & { code?: string }} */
    const erro = new Error('Usuário não encontrado.')
    erro.code = 'NOT_FOUND';
    throw erro;
  }
  const usuario = usuarios[indice];

  const atualizado = {
    ...usuario,
    name: data.name !== undefined ? data.name.trim() : usuario.name,
    username: data.username !== undefined? data.username.trim().toLowerCase(): usuario.username,
    profileDescription: data.profileDescription !== undefined? data.profileDescription.trim() : usuario.profileDescription,
  };
  const mensagem = validarPerfil(atualizado);
  if (mensagem) {
    /** @type {Error & { code?: string }} */
    const erro = new Error(mensagem);
    erro.code = 'VALIDATION_ERROR';
    throw erro;
  }
  const usernameEmUso = usuarios.some((outroUsuario)=> {
    return outroUsuario.id !== id && outroUsuario.username.toLowerCase() === atualizado.username;
  });
  if (usernameEmUso) {
    /** @type {Error & { code?: string }} */
    const erro = new Error('Esse nome de usuário já está cadastrado.')
    erro.code = 'ALREADY_EXISTS';
    throw erro;
  }
  usuarios[indice] = atualizado;
  salvarLista('usuarios', usuarios);

  return atualizado;
}