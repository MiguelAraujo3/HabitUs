//hash vai ser calculado a partir da senha 
//salt não vai deixar o mesmo hash para mesmas senhas de duas pessoas diferentes
const ITERACOES = 100_000;
//criar hash de senha
export async function gerarHashSenha(senha) {
  const codificador = new TextEncoder(); //Transforma de texto pra bytes
  const salt = crypto.getRandomValues(new Uint8Array(16)); //gera 16 bytes aleatorios do salt

  const chave = await crypto.subtle.importKey( //prepara a senha para o calculo
    'raw', //
    codificador.encode(senha), //a senha convertida em bytes
    'PBKDF2', //função de derivação de chave que vai ser usada junto com a função hash 
    false,
    ['deriveBits']
  );

  const resultado = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERACOES, //a cada tentativa de descobrir a senha é mais trabalhosa
      hash: 'SHA-256', //função hash usada no na função de derivação da chave
    },
    chave,
    256
  );

  return {
    hash: paraHexadecimal(new Uint8Array(resultado)), //converte o hash de bytes para hexadecimal
    salt: paraHexadecimal(salt),
    iterations: ITERACOES,
  };
}

function paraHexadecimal(bytes) {
  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}
//verificar se os hashs batem
export async function conferirSenha(senha, hashSalvo, saltSalvo, iteracoes) {
  const codificador = new TextEncoder();
  const salt = deHexadecimal(saltSalvo); 

  const chave = await crypto.subtle.importKey(
    'raw',
    codificador.encode(senha),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const resultado = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: iteracoes,
      hash: 'SHA-256',
    },
    chave,
    256
  );

  const calculado = new Uint8Array(resultado);
  const esperado = deHexadecimal(hashSalvo);

  if (calculado.length !== esperado.length) {
    return false;
  }

  let iguais = true;

  for (let i = 0; i < calculado.length; i++) {
    if (calculado[i] !== esperado[i]) {
      iguais = false;
    }
  }
  return iguais;
  }

function deHexadecimal(texto) {
  const pares = texto.match(/.{2}/g) || [];

  return new Uint8Array(
    pares.map((par) => Number.parseInt(par, 16))
  );
}