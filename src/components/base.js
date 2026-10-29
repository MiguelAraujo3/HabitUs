// Componentes DOM base — criação manual com createElement/appendChild.
// Contrato de todas as funções: recebem uma configuração simples, devolvem o
// elemento pronto e anexam listeners quando a configuração traz uma ação.

import { obterIniciais } from '../utils/usuario.js';

export { obterIniciais };

export function criarBotao(configuracao) {
  const botao = document.createElement('button');
  botao.textContent = configuracao.texto;
  botao.className = 'w-full py-3 bg-brand-gray hover:bg-brand-light-gray text-brand-dark font-bold rounded-md transition-colors duration-300';

  if (configuracao.aoClicar) {
    botao.addEventListener('click', () => configuracao.aoClicar());
  }

  return botao;
}

export function criarCartao(configuracao) {
  const cartao = document.createElement('section');
  cartao.className = 'bg-brand-blue p-6 rounded-xl shadow-2xl w-full border border-brand-gray';

  const titulo = document.createElement('h2');
  titulo.className = 'text-xl font-bold text-white mb-2';
  titulo.textContent = configuracao.titulo;
  cartao.appendChild(titulo);

  const corpo = document.createElement('div');
  corpo.className = 'text-sm text-brand-ice';
  corpo.textContent = configuracao.texto || '';
  cartao.appendChild(corpo);

  if (configuracao.acoes) {
    const acoes = document.createElement('div');
    acoes.className = 'flex flex-col gap-2 mt-4';
    for (const acao of configuracao.acoes) {
      const botao = criarBotao({
        texto: acao.texto,
        aoClicar: acao.aoClicar,
      });
      acoes.appendChild(botao);
    }
    cartao.appendChild(acoes);
  }

  return cartao;
}

export function criarItemLista(configuracao) {
  const item = document.createElement('li');
  item.className = 'flex items-center justify-between gap-4 py-3 px-2 border-b border-brand-gray';

  const informacao = document.createElement('div');
  informacao.className = 'flex flex-col';

  const texto = document.createElement('span');
  texto.className = 'text-sm font-medium text-white';
  texto.textContent = configuracao.texto;
  informacao.appendChild(texto);

  if (configuracao.detalhe) {
    const detalhe = document.createElement('small');
    detalhe.className = 'text-xs text-brand-light-gray';
    detalhe.textContent = configuracao.detalhe;
    informacao.appendChild(detalhe);
  }

  item.appendChild(informacao);

  if (configuracao.acao) {
    const botao = criarBotao({
      texto: configuracao.acao.texto,
      aoClicar: configuracao.acao.aoClicar,
    });
    item.appendChild(botao);
  }

  return item;
}

export function criarAba(configuracao) {
  const elementoAba = document.createElement('div');
  elementoAba.className = 'flex flex-col gap-2';

  const abas = document.createElement('div');
  abas.className = 'flex gap-2';

  for (const aba of configuracao.abas) {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'text-sm font-medium px-3 py-2 rounded-md transition-colors duration-300';
    if (aba.selecionada) {
      botao.classList.add('bg-brand-gray', 'text-brand-dark');
    } else {
      botao.classList.add('hover:text-brand-ice');
    }
    botao.textContent = aba.rotulo;
    botao.addEventListener('click', () => {
      configuracao.aoSelecionar(aba);
    });
    abas.appendChild(botao);
  }

  elementoAba.appendChild(abas);

  return elementoAba;
}

export function criarModal(configuracao) {
  /** @type {HTMLDivElement & { abrir?: () => void, fechar?: () => void }} */
  const fundo = document.createElement('div');
  fundo.className = 'hidden fixed inset-0 bg-brand-dark';

  const janela = document.createElement('div');
  janela.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-brand-dark rounded-xl shadow-2xl border border-brand-blue';

  const titulo = document.createElement('h2');
  titulo.className = 'text-xl font-bold text-white mb-2';
  titulo.textContent = configuracao.titulo;
  janela.appendChild(titulo);

  const mensagem = document.createElement('p');
  mensagem.className = 'text-sm text-brand-ice';
  mensagem.textContent = configuracao.mensagem || '';
  janela.appendChild(mensagem);

  const acoes = document.createElement('div');
  acoes.className = 'flex flex-col gap-2 mt-4';
  const listaAcoes = configuracao.acoes.length > 0 ? configuracao.acoes : [{ texto: 'Fechar' }];
  for (const acao of listaAcoes) {
    const botao = criarBotao({
      texto: acao.texto,
      aoClicar: acao.aoClicar,
    });
    acoes.appendChild(botao);
  }
  janela.appendChild(acoes);

  fundo.appendChild(janela);

  fundo.classList.add('hidden');
  fundo.abrir = () => {
    fundo.classList.remove('hidden');
  };
  fundo.fechar = () => {
    fundo.classList.add('hidden');
  };
  fundo.addEventListener('click', () => {
    fundo.fechar();
  });

  return fundo;
}

export function criarMensagemErro(configuracao) {
  /** @type {HTMLDivElement & { mostrar?: () => void, esconder?: () => void }} */
  const mensagem = document.createElement('div');
  mensagem.className = 'w-full px-4 py-2 rounded-md bg-red-500 text-white text-sm';
  mensagem.setAttribute('role', 'alert');
  mensagem.classList.add('hidden');

  mensagem.mostrar = () => {
    mensagem.textContent = configuracao.texto || '';
    mensagem.classList.remove('hidden');
  };
  mensagem.esconder = () => {
    mensagem.classList.add('hidden');
  };

  return mensagem;
}

export function criarAvatar(configuracao) {
  const avatar = document.createElement('div');
  avatar.className = 'w-10 h-10 rounded-full bg-brand-gray text-brand-dark font-bold flex items-center justify-center text-sm';
  avatar.textContent = obterIniciais(configuracao.usuario);
  return avatar;
}
