export function validarCadastro({name, username, email, password}) {
  if (typeof name !== "string" || !name.trim() || name.trim().length> 100) {
    return 'Informe um nome de até 100 caracteres'
  }
  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    return 'O usuário deve ter de 3 a 30 caracteres: letras, números ou _.';
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Informe um e-mail válido.';
  }

  if (typeof password !== 'string' || password.length === 0) {
    return 'Informe uma senha.';
  }

  return null;
}

export function validarPerfil({ name, username, profileDescription }) {
  if (typeof name !== 'string' || !name.trim() || name.length > 100) {
    return 'Informe um nome de até 100 caracteres.';
  }

  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
    return 'O usuário deve ter de 3 a 30 caracteres: letras, números ou _.';
  }

  if (
    typeof profileDescription !== 'string' ||
    profileDescription.length > 500
  ) {
    return 'A descrição deve ter até 500 caracteres.';
  }

  return null;
}