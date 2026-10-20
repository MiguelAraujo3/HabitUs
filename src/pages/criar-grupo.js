import '../styles/grupos.css';
import { criarNavbar } from '../components/navbar.js';
import { exigirLogin } from '../components/auth.js';
import {
  criarElemento, criarCabecalhoPagina, criarGradeCategorias, criarStepper, CLASSE_INPUT,
} from '../components/ui.js';
import { icone } from '../components/icones.js';
import { hoje, paraChave } from '../utils/datas.js';

exigirLogin();
criarNavbar().then((menu) => document.querySelector('#menu').appendChild(menu));

// O formulário está em criar-grupo.html; aqui só entram o que muda na tela:
// o cabeçalho, a grade de categorias e a lista dinâmica de atividades.
// Validar e salvar o grupo é a tarefa S1-37.

const PONTOS_INICIAIS = 3;
let proximoId = 1;
let atividades = [];

function novaAtividade() {
  const atividade = { id: proximoId, nome: '', pontos: PONTOS_INICIAIS };
  proximoId += 1;
  return atividade;
}

function criarLinhaAtividade(atividade, indice) {
  const item = criarElemento('li', 'rounded-[14px] bg-surface p-3');

  const topo = criarElemento('div', 'flex items-center gap-2');
  const campo = criarElemento('input', CLASSE_INPUT);
  campo.placeholder = 'Ex.: Treino de 30 min';
  campo.value = atividade.nome;
  campo.setAttribute('aria-label', `Nome da atividade ${indice + 1}`);
  campo.addEventListener('input', () => {
    atividade.nome = campo.value;
  });
  topo.appendChild(campo);

  // Só dá para remover quando sobra mais de uma linha
  if (atividades.length > 1) {
    const remover = criarElemento('button', 'press flex size-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-danger-tint hover:text-danger');
    remover.type = 'button';
    remover.setAttribute('aria-label', `Remover atividade ${indice + 1}`);
    remover.appendChild(icone('Trash2', { tamanho: 18 }));
    remover.addEventListener('click', () => {
      // RUBRICA: programação funcional (filter devolve a lista sem a linha removida)
      atividades = atividades.filter((a) => a.id !== atividade.id);
      desenharAtividades();
    });
    topo.appendChild(remover);
  }
  item.appendChild(topo);

  const base = criarElemento('div', 'mt-2 flex items-center justify-between');
  base.appendChild(criarElemento('span', 'text-[14px] text-ink-2', 'Pontos por conclusão'));
  const stepper = criarStepper({
    rotulo: 'pontos', valor: atividade.pontos, min: 1, max: 10,
    aoMudar: (valor) => {
      atividade.pontos = valor;
    },
  });
  base.appendChild(stepper.elemento);
  item.appendChild(base);
  return item;
}

function desenharAtividades() {
  const lista = document.querySelector('#lista-atividades');
  lista.replaceChildren();
  atividades.forEach((atividade, indice) => lista.appendChild(criarLinhaAtividade(atividade, indice)));
}

function iniciar() {
  document.querySelector('#cabecalho').appendChild(criarCabecalhoPagina({ titulo: 'Criar grupo', voltarPara: 'grupos.html' }));

  const grade = criarGradeCategorias();
  document.querySelector('#grade-categorias').appendChild(grade.elemento);

  // Datas: início é hoje (data local); o fim nunca pode ser antes do início
  const inicio = document.querySelector('#inicio');
  const fim = document.querySelector('#fim');
  inicio.value = paraChave(hoje());
  fim.min = inicio.value;
  inicio.addEventListener('change', () => {
    fim.min = inicio.value;
  });

  atividades = [novaAtividade()];
  desenharAtividades();

  const adicionar = document.querySelector('#adicionar-atividade');
  adicionar.prepend(icone('Plus', { tamanho: 18 }));
  adicionar.addEventListener('click', () => {
    atividades.push(novaAtividade());
    desenharAtividades();
    const campos = document.querySelectorAll('#lista-atividades input');
    campos[campos.length - 1].focus();
  });

  document.querySelector('#form-grupo').addEventListener('submit', (evento) => {
    evento.preventDefault();
    // S1-37: validar os campos e salvar o grupo
  });
}

iniciar();
