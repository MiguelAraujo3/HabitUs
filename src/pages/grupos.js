import '../styles/base.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import {
  criarElemento, criarTituloGrande, criarLinkAcao, criarBotaoAcao, criarVazio, CLASSE_INPUT,
} from '../components/ui.js';
import { criarCartaoGrupo } from '../components/grupos.js';
import { hoje, paraChave, somarDias, statusDoPeriodo } from '../utils/datas.js';

exigirLogin();
document.querySelector('#menu').appendChild(criarNavbar());

// PROVISÓRIO: grupos de exemplo até a S1-35 ligar a página ao LocalStorage.
// Datas relativas a hoje, para o status continuar correto.
function diaRelativo(dias) {
  return paraChave(somarDias(hoje(), dias));
}
const GRUPOS_PROVISORIOS = [
  { id: 'g1', nome: 'Movimento 30 Dias', categoria: 'Esportes e exercícios', dataInicio: diaRelativo(-10), dataFim: diaRelativo(20), quantidadeMembros: 5, posicao: 2 },
  { id: 'g2', nome: 'Maratona de Leitura', categoria: 'Leitura', dataInicio: diaRelativo(-3), dataFim: diaRelativo(27), quantidadeMembros: 3, posicao: 1 },
  { id: 'g3', nome: 'Marmitas da Semana', categoria: 'Alimentação', dataInicio: diaRelativo(4), dataFim: diaRelativo(34), quantidadeMembros: 4, posicao: 1 },
  { id: 'g4', nome: 'Desafio de Poupança', categoria: 'Finanças', dataInicio: diaRelativo(-50), dataFim: diaRelativo(-5), quantidadeMembros: 6, posicao: 3 },
];
const MOSTRAR_VAZIO = new URLSearchParams(window.location.search).get('vazio') === '1'; // PROVISÓRIO

const SECOES = [
  { chave: 'andamento', titulo: 'Em andamento' },
  { chave: 'nao-iniciado', titulo: 'Não iniciado' },
  { chave: 'encerrado', titulo: 'Encerrado' },
];

// "Entrar com link": aceita o link inteiro ou só o código.
function extrairCodigo(texto) {
  const limpo = texto.trim();
  const achado = limpo.match(/codigo=([^&\s]+)/);
  if (achado) {
    return achado[1];
  }
  return limpo.split('/').pop();
}

function criarSecao(secao, grupos) {
  const bloco = criarElemento('section', 'mb-6');
  bloco.setAttribute('aria-label', secao.titulo);
  bloco.appendChild(criarElemento('h2', 'mb-2 px-1 text-[13px] font-semibold tracking-wide text-ink-2 uppercase', secao.titulo));
  const lista = criarElemento('ul', 'divide-y divide-line/70 overflow-hidden rounded-[18px] bg-surface');
  grupos.forEach((grupo) => {
    lista.appendChild(criarCartaoGrupo({
      grupo, status: secao.chave, quantidadeMembros: grupo.quantidadeMembros, posicao: grupo.posicao,
    }));
  });
  bloco.appendChild(lista);
  return bloco;
}

function criarFormularioCodigo() {
  const formulario = criarElemento('form', 'mt-4 flex gap-2');
  const rotulo = criarElemento('label', 'sr-only', 'Código de convite');
  rotulo.htmlFor = 'codigo-convite';
  const campo = criarElemento('input', CLASSE_INPUT);
  campo.id = 'codigo-convite';
  campo.placeholder = 'Tenho um código de convite';
  campo.autocapitalize = 'none';
  const entrar = criarBotaoAcao('Entrar', { variante: 'secondary', extra: 'shrink-0', tipo: 'submit', desabilitado: true });

  campo.addEventListener('input', () => {
    entrar.disabled = campo.value.trim() === '';
  });
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const codigo = extrairCodigo(campo.value);
    if (codigo) {
      window.location.href = `convite.html?codigo=${encodeURIComponent(codigo)}`;
    }
  });

  formulario.appendChild(rotulo);
  formulario.appendChild(campo);
  formulario.appendChild(entrar);
  return formulario;
}

function montarPagina() {
  const conteudo = document.querySelector('#conteudo');
  const botaoCriar = criarLinkAcao('Criar grupo', { href: 'criar-grupo.html', tamanho: 'm', iconeNome: 'Plus' });
  conteudo.appendChild(criarTituloGrande({ titulo: 'Grupos', direita: botaoCriar }));

  const meus = MOSTRAR_VAZIO ? [] : GRUPOS_PROVISORIOS;
  if (meus.length === 0) {
    conteudo.appendChild(criarVazio({
      iconeNome: 'Users',
      titulo: 'Nenhum grupo ainda',
      texto: 'Você ainda não está em nenhum grupo. Crie um ou entre por um link de convite.',
      acao: criarLinkAcao('Criar grupo', { href: 'criar-grupo.html' }),
    }));
  } else {
    // RUBRICA: programação funcional (map/filter agrupam os grupos por status)
    SECOES.forEach((secao) => {
      const doStatus = meus.filter((g) => statusDoPeriodo(g.dataInicio, g.dataFim) === secao.chave);
      if (doStatus.length > 0) {
        conteudo.appendChild(criarSecao(secao, doStatus));
      }
    });
  }

  conteudo.appendChild(criarFormularioCodigo());
}

montarPagina();
