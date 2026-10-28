import { paraChave, hoje } from '../utils/datas.js';

// Factory: Habito
// frequencia: { tipo: 'diaria' | 'dias-semana' | 'vezes-semana', dias?: number[], vezes?: number }
export function criarHabito({ idUsuario, nome, categoria, descricao, frequencia, id: _id }) {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idUsuario,
    nome,
    categoria,
    descricao,
    frequencia,
    dataCriacao: paraChave(hoje()),
    ativo: true,
  };
}

// Factory: ConclusaoHabito
/**
 * @param {{ idHabito: string, data?: string, id?: string }} dados
 */
export function criarConclusaoHabito({ idHabito, data, id: _id }) {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idHabito,
    data: data || paraChave(hoje()),
  };
}

// Factory: Grupo
// idDono: id do usuario dono. codigoConvite: string para convite ao grupo.
export function criarGrupo({ nome, categoria, descricao, dataInicio, dataFim, idDono, codigoConvite, id: _id }) {
  const grupoId = _id ?? crypto.randomUUID();
  return {
    id: grupoId,
    nome,
    categoria,
    descricao,
    dataInicio,
    dataFim,
    idDono,
    codigoConvite,
    encerrado: false,
    rankingFinal: null,
  };
}

// Factory: Atividade
// pontos deve ser inteiro de 1 a 10; senão lança Error
export function criarAtividade({ idGrupo, nome, pontos, id: _id }) {
  if (!Number.isInteger(pontos) || pontos < 1 || pontos > 10) {
    throw new Error('Pontos inválido: deve ser inteiro entre 1 e 10');
  }
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idGrupo,
    nome,
    pontos,
  };
}

// Factory: Membro
// bloqueado: false por padrão se não informado
// dataEntrada: string ISO com data e hora (para desempate de membro mais antigo)
export function criarMembro({ idGrupo, idUsuario, dataEntrada, bloqueado, id: _id }) {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idGrupo,
    idUsuario,
    dataEntrada: dataEntrada || new Date().toISOString(),
    bloqueado: bloqueado !== undefined ? bloqueado : false,
  };
}

// Factory: ConclusaoGrupo
export function criarConclusaoGrupo({ idGrupo, idAtividade, idUsuario, data, foto, texto, id: _id }) {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idGrupo,
    idAtividade,
    idUsuario,
    data: data || paraChave(hoje()),
    foto,
    texto,
  };
}

// Factory: Postagem
export function criarPostagem({ idUsuario, idHabito, texto, imagem, id: _id }) {
  const id = _id ?? crypto.randomUUID();
  const dataHora = new Date().toISOString();
  return {
    id,
    idUsuario,
    idHabito,
    texto,
    imagem,
    dataHora,
  };
}

// Factory: Comentario
export function criarComentario({ idPostagem, idUsuario, texto, dataHora, id: _id }) {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idPostagem,
    idUsuario,
    texto,
    dataHora: dataHora || new Date().toISOString(),
  };
}

// Factory: Curtida
export function criarCurtida({ idPostagem, idUsuario, id: _id }) {
  const id = _id ?? crypto.randomUUID();
  return {
    id,
    idPostagem,
    idUsuario,
  };
}

// Factory: RegistroRecordes (por usuario)
// Se id nao for informado, usa-se idUsuario como chave identificadora
export function criarRegistroRecordes({ idUsuario, maiorSequencia, id: _id }) {
  const recordId = _id ?? idUsuario;
  return {
    id: recordId,
    idUsuario,
    maiorSequencia,
  };
}

// Factory: TotalUsuario
// Atividades concluidas por usuario
export function criarTotalUsuario({ idUsuario, atividadesConcluidas, id: _id }) {
  const totalId = _id ?? idUsuario;
  return {
    id: totalId,
    idUsuario,
    atividadesConcluidas,
  };
}