/* habitos.js — Página "Hoje" (lista de hábitos, progresso do dia, streaks e formulário)
 *
 * Modelo de um hábito:
 * {
 *   id: string,
 *   nome: string,
 *   descricao: string,           // opcional ('' se vazio)
 *   categoria: chave de CATEGORIAS,
 *   frequencia: 'diaria' | 'semanal',
 *   dias: number[] | null,       // dias da semana (0=Dom ... 6=Sáb); null = todos os dias
 *   metaSemanal: number | null,  // só para frequencia 'semanal'
 *   recorde: number,             // maior sequência já alcançada (guardada e atualizada a cada marcação)
 *   conclusoes: string[]         // datas 'AAAA-MM-DD'
 * }
 *
 * A sequência atual NÃO é guardada: é calculada pela função pura calcularSequencia()
 * a partir das datas em `conclusoes` (ver seção "Sequência" abaixo).
 *
 * ARMAZENAMENTO: todo acesso a dados passa pelo objeto `repositorio` (mais abaixo).
 * Hoje ele usa localStorage. Para migrar para o Supabase, só o `repositorio` muda:
 * o resto do arquivo continua igual.
 */

import { showMenu } from 'header';

document.body.insertAdjacentHTML('afterbegin', showMenu());

(function () {
  'use strict';

  var STORAGE_KEY = 'habitos.v1';

  var DIAS_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  var SVG_NS = 'http://www.w3.org/2000/svg';

  // Ícones (paths 24x24, estilo contorno)
  var ICONES = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    chama: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    saude: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    esportes: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
    estudos: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    leitura: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    alimentacao: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    sono: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    mental: '<path d="M12 22v-5"/><path d="M9 17h6"/><path d="M12 17c-3 0-5-2-5-5 0-2 1-3 2-4-1-1-1-3 1-4 1.5-1 3-.5 4 .5 1-1 2.5-1.5 4-.5 2 1 2 3 1 4 1 1 2 2 2 4 0 3-2 5-5 5z"/>',
    financas: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    organizacao: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    hobbies: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
    outros: '<circle cx="12" cy="12" r="9"/>'
  };

  // Lista fixa de categorias (a ordem é a do select do formulário)
  var CATEGORIAS = {
    saude:       { rotulo: 'Saúde',                     fundo: '#fde8e6', texto: '#b3261e' },
    esportes:    { rotulo: 'Esportes e exercícios',     fundo: '#e9f9c4', texto: '#2f4a05' },
    estudos:     { rotulo: 'Estudos',                   fundo: '#e1ebff', texto: '#1e4fb8' },
    leitura:     { rotulo: 'Leitura',                   fundo: '#efdffb', texto: '#6a2b9a' },
    alimentacao: { rotulo: 'Alimentação',               fundo: '#fde8e6', texto: '#b3261e' },
    sono:        { rotulo: 'Sono',                      fundo: '#e1ebff', texto: '#1e4fb8' },
    mental:      { rotulo: 'Bem-estar mental',          fundo: '#efdffb', texto: '#7a2fa8' },
    financas:    { rotulo: 'Finanças',                  fundo: '#e9f9c4', texto: '#2f4a05' },
    organizacao: { rotulo: 'Organização e produtividade', fundo: '#dff4f8', texto: '#0e6a80' },
    hobbies:     { rotulo: 'Hobbies e criatividade',    fundo: '#dff4f8', texto: '#0e6a80' },
    outros:      { rotulo: 'Outros',                    fundo: '#ececea', texto: '#444444' }
  };

  // ---------- Utilidades ----------

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function chaveData(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function hojeChave() { return chaveData(new Date()); }

  function dataDaChave(chave) {
    var p = chave.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  // Início da semana (DOMINGO) da data informada, à meia-noite. A semana vai de domingo a sábado.
  function inicioDaSemana(d) {
    var r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    r.setDate(r.getDate() - r.getDay()); // getDay(): domingo = 0
    return r;
  }

  // Número do dia (dias desde 1970, em UTC): facilita contar dias entre datas sem erro de fuso/horário de verão
  function numDia(chave) {
    var p = chave.split('-');
    return Math.round(Date.UTC(Number(p[0]), Number(p[1]) - 1, Number(p[2])) / 86400000);
  }

  function diaDaSemanaDeNum(n) { return new Date(n * 86400000).getUTCDay(); } // 0 = domingo

  function novoId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'h_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function plural(n, singular, pluralTxt) {
    return n + ' ' + (n === 1 ? singular : pluralTxt);
  }

  function svg(nomeIcone) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', nomeIcone === 'check' ? '2.8' : '2');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('stroke-linejoin', 'round');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ICONES[nomeIcone] || ICONES.outros;
    return s;
  }

  function el(tag, opts, filhos) {
    var e = document.createElement(tag);
    opts = opts || {};
    if (opts.classe) e.className = opts.classe;
    if (opts.texto != null) e.textContent = opts.texto;
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (k) { e.setAttribute(k, opts.attrs[k]); });
    }
    (filhos || []).forEach(function (f) { if (f) e.appendChild(f); });
    return e;
  }

  // ---------- Repositório (camada de dados) ----------
  // Único lugar que sabe ONDE os hábitos ficam guardados. Todas as funções
  // são assíncronas (retornam Promise), como serão as chamadas ao Supabase.
  //
  // Na migração para o Supabase, trocar o corpo de cada função, por exemplo:
  //   listar:    supabase.from('habitos').select('*, conclusoes(*)')
  //   criar:     supabase.from('habitos').insert({ ..., user_id }).select().single()
  //   atualizar: supabase.from('habitos').update({...}).eq('id', habito.id)
  // (o id passa a ser gerado pelo banco e o hábito ganha um user_id).

  function lerLocal() {
    try {
      var bruto = localStorage.getItem(STORAGE_KEY);
      var lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function gravarLocal(lista) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      console.warn('Não foi possível salvar os hábitos:', e);
    }
  }

  var repositorio = {
    listar: async function () {
      return lerLocal();
    },

    criar: async function (dados) {
      var h = {
        id: novoId(),
        nome: dados.nome,
        descricao: dados.descricao || '',
        categoria: dados.categoria,
        frequencia: dados.frequencia === 'semanal' ? 'semanal' : 'diaria',
        dias: dados.dias && dados.dias.length ? dados.dias : null,
        metaSemanal: dados.frequencia === 'semanal' ? Number(dados.metaSemanal) || 1 : null,
        recorde: 0,
        conclusoes: []
      };
      var lista = lerLocal();
      lista.push(h);
      gravarLocal(lista);
      return h;
    },

    atualizar: async function (habito) {
      var lista = lerLocal().map(function (x) { return x.id === habito.id ? habito : x; });
      gravarLocal(lista);
      return habito;
    },

    // Só para testes locais (demo/limpar); não existirá no Supabase.
    substituirTudo: async function (lista) {
      gravarLocal(lista);
    }
  };

  // ---------- Estado ----------

  var habitos = [];

  // ---------- Regras ----------

  function ehDeHoje(h) {
    if (!h.dias || !h.dias.length) return true;
    return h.dias.indexOf(new Date().getDay()) !== -1;
  }

  function feitoHoje(h) {
    return (h.conclusoes || []).indexOf(hojeChave()) !== -1;
  }

  function conclusoesNaSemana(h) {
    var inicio = inicioDaSemana(new Date()).getTime();
    return (h.conclusoes || []).filter(function (c) {
      return dataDaChave(c).getTime() >= inicio;
    }).length;
  }

  // ---------- Sequência (funções puras) ----------
  // Nenhuma função desta seção lê relógio, DOM ou storage: recebem o hábito e a data de
  // referência ('AAAA-MM-DD') e devolvem { atual, maior }. Isso as torna fáceis de testar.
  //
  // Regras (US07):
  //  - diária: soma 1 por dia seguido;
  //  - dias da semana: soma 1 por dia marcado; perde se um dia previsto passa sem marcação
  //    (dias fora da escala não contam nem quebram);
  //  - X vezes por semana: ao atingir a meta na semana (domingo a sábado) soma a meta inteira;
  //    perde se uma semana termina abaixo da meta.
  //  - O dia/semana em curso nunca quebra a sequência: ainda dá tempo de marcar.

  // Datas de conclusão como números de dia, sem repetição, em ordem crescente
  function datasOrdenadas(h) {
    var vistos = {};
    return (h.conclusoes || [])
      .map(numDia)
      .filter(function (n) { return vistos[n] ? false : (vistos[n] = true); })
      .sort(function (a, b) { return a - b; });
  }

  // Diária e "dias da semana"
  function sequenciaPorDias(h, datas, hoje) {
    var agendado = function (n) {
      return !h.dias || !h.dias.length || h.dias.indexOf(diaDaSemanaDeNum(n)) !== -1;
    };
    // Existe algum dia previsto estritamente entre a e b sem marcação?
    var temAgendadoEntre = function (a, b) {
      for (var n = a + 1; n < b; n++) { if (agendado(n)) return true; }
      return false;
    };

    var validas = datas.filter(agendado);
    if (!validas.length) return { atual: 0, maior: 0 };

    var r = validas.reduce(function (acc, n, i) {
      var continua = i > 0 && !temAgendadoEntre(validas[i - 1], n);
      var atual = continua ? acc.atual + 1 : 1;
      return { atual: atual, maior: Math.max(acc.maior, atual) };
    }, { atual: 0, maior: 0 });

    // A sequência só segue viva se nenhum dia previsto passou sem marcação desde a última
    var viva = !temAgendadoEntre(validas[validas.length - 1], hoje);
    return { atual: viva ? r.atual : 0, maior: r.maior };
  }

  // "X vezes por semana": semanas de domingo a sábado
  function sequenciaSemanal(h, datas, hoje) {
    var meta = h.metaSemanal || 1;
    var semanaDe = function (n) { return n - diaDaSemanaDeNum(n); }; // número do domingo da semana
    var semanaAtual = semanaDe(hoje);

    var contagem = datas.reduce(function (m, n) {
      var s = semanaDe(n);
      m[s] = (m[s] || 0) + 1;
      return m;
    }, {});
    var semanas = Object.keys(contagem).map(Number).sort(function (a, b) { return a - b; });

    var r = semanas.reduce(function (acc, s, i) {
      var atual = acc.atual;
      if (i > 0 && s - semanas[i - 1] > 7) atual = 0;   // houve semana(s) sem nenhuma marcação
      if (contagem[s] >= meta) {
        atual += meta;                                   // meta atingida: soma a meta inteira
      } else if (s < semanaAtual) {
        atual = 0;                                       // semana terminou abaixo da meta
      }                                                  // semana em curso abaixo da meta: segue pendente
      return { atual: atual, maior: Math.max(acc.maior, atual) };
    }, { atual: 0, maior: 0 });

    // Uma semana inteira sem marcação entre a última registrada e a atual quebra a sequência
    var viva = semanaAtual - semanas[semanas.length - 1] <= 7;
    return { atual: viva ? r.atual : 0, maior: r.maior };
  }

  // Ponto de entrada: sequência atual e maior sequência já alcançada, a partir das datas
  function calcularSequencia(h, chaveHoje) {
    var hoje = numDia(chaveHoje);
    var datas = datasOrdenadas(h).filter(function (n) { return n <= hoje; });
    if (!datas.length) return { atual: 0, maior: 0 };
    return h.frequencia === 'semanal'
      ? sequenciaSemanal(h, datas, hoje)
      : sequenciaPorDias(h, datas, hoje);
  }

  function textoSequencia(h, seq) {
    var unidade = h.frequencia === 'semanal'
      ? plural(seq.atual, 'conclusão', 'conclusões')
      : plural(seq.atual, 'dia', 'dias');
    return 'Sequência: ' + unidade + ' · Recorde: ' + Math.max(h.recorde || 0, seq.atual);
  }

  // Marca/desmarca a conclusão de hoje (no máximo uma vez por hábito por dia).
  // A sequência é recalculada a partir das datas, e o recorde guardado é atualizado.
  function alternar(id) {
    var h = habitos.filter(function (x) { return x.id === id; })[0];
    if (!h) return;
    h.conclusoes = h.conclusoes || [];
    var hoje = hojeChave();
    var i = h.conclusoes.indexOf(hoje);
    if (i === -1) {
      h.conclusoes.push(hoje);
    } else {
      h.conclusoes.splice(i, 1);
    }
    h.recorde = calcularSequencia(h, hoje).maior;
    renderizar();
    repositorio.atualizar(h).catch(function (e) {
      console.warn('Não foi possível salvar a alteração:', e);
    });
  }

  // ---------- Renderização ----------

  var $ = function (id) { return document.getElementById(id); };

  function renderData() {
    var txt = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
    $('data-hoje').textContent = txt.charAt(0).toUpperCase() + txt.slice(1);
  }

  function renderProgresso(deHoje) {
    var total = deHoje.length;
    var feitos = deHoje.reduce(function (soma, h) {
      return soma + (feitoHoje(h) ? 1 : 0);
    }, 0);
    var pct = total ? Math.round((feitos / total) * 100) : 0;
    $('progresso-texto').textContent = feitos + ' de ' + total + ' feitos';
    $('progresso-barra').style.width = pct + '%';
    $('progresso-trilho').setAttribute('aria-valuenow', String(pct));
  }

  function criarItem(h) {
    var feito = feitoHoje(h);
    var chaveCat = CATEGORIAS[h.categoria] ? h.categoria : 'outros';
    var cat = CATEGORIAS[chaveCat];

    var botao = el('button', {
      classe: 'check',
      attrs: {
        type: 'button',
        'aria-pressed': String(feito),
        'aria-label': (feito ? 'Desmarcar ' : 'Concluir ') + h.nome
      }
    }, [svg('check')]);
    botao.addEventListener('click', function () { alternar(h.id); });

    var seq = calcularSequencia(h, hojeChave());

    var chama = el('span', { classe: 'chama', attrs: { title: 'Sequência atual' } }, [
      svg('chama'),
      el('span', { texto: String(seq.atual) })
    ]);

    var linha1 = el('div', { classe: 'habito-linha1' }, [
      el('h3', { classe: 'habito-nome', texto: h.nome }),
      chama
    ]);

    var tag = el('span', { classe: 'tag' }, [
      svg(chaveCat),
      el('span', { texto: cat.rotulo })
    ]);
    tag.style.backgroundColor = cat.fundo;
    tag.style.color = cat.texto;

    var textoMeta = (feito ? 'Feito hoje · ' : '') + textoSequencia(h, seq);
    var meta = el('div', { classe: 'habito-meta' }, [tag, el('span', { texto: textoMeta })]);

    var corpo = el('div', { classe: 'habito-corpo' }, [linha1, meta]);

    if (h.descricao) {
      corpo.appendChild(el('p', { classe: 'habito-desc', texto: h.descricao }));
    }

    // Meta semanal (barra segmentada)
    if (h.frequencia === 'semanal' && h.metaSemanal > 0) {
      var meta7 = h.metaSemanal;
      var feitasSemana = conclusoesNaSemana(h);
      var segs = [];
      for (var i = 0; i < meta7; i++) {
        segs.push(el('div', { classe: 'segmento' + (i < feitasSemana ? ' cheio' : '') }));
      }
      var info = el('div', { classe: 'semana-info' }, [
        el('span', {}, [
          document.createTextNode('Esta semana: '),
          el('b', { texto: feitasSemana + '/' + meta7 })
        ]),
        el('span', { texto: 'Ao atingir ' + meta7 + '/' + meta7 + ': +' + meta7 })
      ]);
      corpo.appendChild(el('div', { classe: 'semana' }, [info, el('div', { classe: 'segmentos' }, segs)]));
    }

    return el('li', { classe: 'habito' + (feito ? ' feito' : ''), attrs: { 'data-id': h.id } }, [botao, corpo]);
  }

  function criarItemNaoHoje(h) {
    var dias = (h.dias || []).slice().sort().map(function (d) { return DIAS_ABREV[d]; }).join(', ');
    return el('div', { classe: 'item-nao-hoje' }, [
      el('div', {}, [
        el('h3', { texto: h.nome }),
        el('p', { texto: 'Dias: ' + dias + ' · ' + textoSequencia(h, calcularSequencia(h, hojeChave())) })
      ]),
      el('span', { texto: 'Não é hoje' })
    ]);
  }

 function renderizar() {
    renderData();

    // 1. FILTER: Filtra pelos que aparecem hoje
    var deHoje = habitos.filter(ehDeHoje);
    var foraHoje = habitos.filter(function (h) { return !ehDeHoje(h); });
    
    var vazio = habitos.length === 0;

    // Atualiza o progresso do dia (ex: 2 de 4)
    renderProgresso(deHoje);

    // Controle de visibilidade
    $('estado-vazio').hidden = !vazio;
    $('cartao-lista').hidden = vazio;

    var lista = $('lista-habitos');
    lista.textContent = '';
    
    if (!vazio) {
      if (deHoje.length === 0) {
        lista.appendChild(el('li', { classe: 'lista-vazia-hoje', texto: 'Nenhum hábito programado para hoje.' }));
      } else {
        // 2. MAP: Usa map para criar os elementos de hoje
        lista.append(...deHoje.map(criarItem));
      }
    }

    // Seção "Não é hoje"
    var secao = $('secao-nao-hoje');
    secao.hidden = foraHoje.length === 0;
    $('nao-hoje-titulo').textContent = 'Não é hoje (' + foraHoje.length + ')';
    
    var contNao = $('lista-nao-hoje');
    contNao.textContent = '';
    // Usa map para criar os elementos que não são de hoje também
    contNao.append(...foraHoje.map(criarItemNaoHoje));
  }
  
  // ---------- Formulário "Novo hábito" (janela criada pelo JS) ----------

  var dialogo = null;

  // O CSS do formulário vem junto com o JS para este arquivo ser independente do HTML.
  // Se a equipe preferir, pode ser movido para o arquivo de estilos do projeto.
  function injetarEstilos() {
    if (document.getElementById('estilos-formulario-habito')) return;
    var css = [
      '.dlg-habito{margin:auto;width:min(520px,92vw);max-height:92vh;padding:0;border:0;border-radius:20px;background:#f7f7f5;color:#111;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:inherit}',
      '.dlg-habito::backdrop{background:rgba(0,0,0,.45)}',
      '.dlg-habito form{padding:22px 24px 24px}',
      '.dlg-topo{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}',
      '.dlg-topo h2{margin:0;font-size:20px;font-weight:700}',
      '.dlg-fechar{border:0;background:transparent;font-size:28px;line-height:1;color:#6b6b6b;cursor:pointer;padding:0 6px;border-radius:8px}',
      '.dlg-fechar:hover{color:#111}',
      '.dlg-habito .campo{margin:0 0 18px;padding:0;border:0;min-width:0}',
      '.dlg-habito label,.dlg-habito legend{display:block;margin:0 0 8px;padding:0;font-size:15px;font-weight:600}',
      '.dlg-habito input[type=text],.dlg-habito select,.dlg-habito textarea{width:100%;padding:14px 16px;border:1px solid #d9d9d6;border-radius:12px;background:#fff;font:inherit;font-size:16px;color:#111}',
      '.dlg-habito textarea{resize:vertical;min-height:72px}',
      '.dlg-habito input:focus,.dlg-habito select:focus,.dlg-habito textarea:focus{outline:2px solid #2563eb;outline-offset:1px;border-color:#2563eb}',
      '.dlg-habito .invalido{border-color:#b3261e}',
      '.campo-erro{margin:6px 0 0;font-size:13px;color:#b3261e}',
      '.opcao-freq{display:flex!important;align-items:center;gap:12px;margin:0!important;padding:14px 16px;border:1px solid #2563eb;border-radius:12px;background:#eaf1ff;font-size:16px!important;font-weight:600;cursor:pointer}',
      '.opcao-freq input{accent-color:#2563eb;width:18px;height:18px;margin:0}',
      '.dlg-acoes{display:flex;gap:12px;justify-content:flex-end;margin-top:8px}',
      '.dlg-sec{padding:14px 20px;border:1px solid #d9d9d6;border-radius:14px;background:#fff;font:inherit;font-size:16px;font-weight:600;cursor:pointer}',
      '.dlg-sec:hover{background:#f0f0ee}',
      '.dlg-primario{flex:1;padding:14px 22px;border:0;border-radius:14px;background:#2563eb;color:#fff;font:inherit;font-size:16px;font-weight:600;cursor:pointer}',
      '.dlg-primario:hover{background:#1d4fd8}',
      '.dlg-primario:disabled{opacity:.6;cursor:default}',
      '.habito-desc{margin:10px 0 0;font-size:14px;line-height:1.4;color:#6b6b6b}'
    ].join('\n');
    var estilo = document.createElement('style');
    estilo.id = 'estilos-formulario-habito';
    estilo.textContent = css;
    document.head.appendChild(estilo);
  }

  function criarFormulario() {
    injetarEstilos();

    var d = document.createElement('dialog');
    d.className = 'dlg-habito';
    d.setAttribute('aria-labelledby', 'dlg-titulo');

    // Estrutura fixa (sem dados do usuário), então innerHTML é seguro aqui.
    d.innerHTML =
      '<form id="form-novo-habito" novalidate>' +
        '<div class="dlg-topo">' +
          '<h2 id="dlg-titulo">Novo hábito</h2>' +
          '<button type="button" class="dlg-fechar" data-fechar aria-label="Fechar">&times;</button>' +
        '</div>' +
        '<div class="campo">' +
          '<label for="campo-nome">Nome</label>' +
          '<input id="campo-nome" name="nome" type="text" maxlength="60" placeholder="Ex.: Correr 30 min" autocomplete="off">' +
          '<p class="campo-erro" id="erro-nome" hidden></p>' +
        '</div>' +
        '<div class="campo">' +
          '<label for="campo-categoria">Categoria</label>' +
          '<select id="campo-categoria" name="categoria"><option value="">Selecione uma categoria</option></select>' +
          '<p class="campo-erro" id="erro-categoria" hidden></p>' +
        '</div>' +
        '<div class="campo">' +
          '<label for="campo-descricao">Descrição (opcional)</label>' +
          '<textarea id="campo-descricao" name="descricao" maxlength="200" rows="2"></textarea>' +
        '</div>' +
        '<fieldset class="campo">' +
          '<legend>Frequência</legend>' +
          '<label class="opcao-freq"><input type="radio" name="frequencia" value="diaria" checked> Todos os dias</label>' +
        '</fieldset>' +
        '<p class="campo-erro" id="erro-geral" hidden></p>' +
        '<div class="dlg-acoes">' +
          '<button type="button" class="dlg-sec" data-fechar>Cancelar</button>' +
          '<button type="submit" class="dlg-primario" id="btn-salvar-habito">Salvar hábito</button>' +
        '</div>' +
      '</form>';

    document.body.appendChild(d);

    // Opções do select vêm da lista fixa CATEGORIAS
    var select = d.querySelector('#campo-categoria');
    Object.keys(CATEGORIAS).forEach(function (chave) {
      var op = document.createElement('option');
      op.value = chave;
      op.textContent = CATEGORIAS[chave].rotulo;
      select.appendChild(op);
    });

    var form = d.querySelector('#form-novo-habito');
    var campoNome = d.querySelector('#campo-nome');
    var campoDescricao = d.querySelector('#campo-descricao');
    var botaoSalvar = d.querySelector('#btn-salvar-habito');

    function mostrarErro(idErro, campo, mensagem) {
      var p = d.querySelector('#' + idErro);
      p.textContent = mensagem;
      p.hidden = false;
      if (campo) campo.classList.add('invalido');
    }

    function limparErros() {
      d.querySelectorAll('.campo-erro').forEach(function (p) { p.hidden = true; p.textContent = ''; });
      d.querySelectorAll('.invalido').forEach(function (c) { c.classList.remove('invalido'); });
    }

    // Fechar: botões X/Cancelar e clique no fundo escuro (Esc já funciona sozinho)
    d.querySelectorAll('[data-fechar]').forEach(function (b) {
      b.addEventListener('click', function () { d.close(); });
    });
    d.addEventListener('click', function (ev) {
      if (ev.target === d) d.close();
    });

    form.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      limparErros();

      var nome = campoNome.value.trim();
      var categoria = select.value;
      var descricao = campoDescricao.value.trim();
      var primeiroInvalido = null;

      if (!nome) {
        mostrarErro('erro-nome', campoNome, 'Informe o nome do hábito.');
        primeiroInvalido = campoNome;
      }
      if (!CATEGORIAS[categoria]) {
        mostrarErro('erro-categoria', select, 'Escolha uma categoria.');
        primeiroInvalido = primeiroInvalido || select;
      }
      if (primeiroInvalido) {
        primeiroInvalido.focus();
        return;
      }

      botaoSalvar.disabled = true;
      try {
        await api.adicionar({
          nome: nome,
          categoria: categoria,
          descricao: descricao,
          frequencia: 'diaria'
        });
        d.close();
      } catch (e) {
        console.error(e);
        mostrarErro('erro-geral', null, 'Não foi possível salvar o hábito. Tente novamente.');
      } finally {
        botaoSalvar.disabled = false;
      }
    });

    d.limpar = function () { form.reset(); limparErros(); };
    d.focarNome = function () { campoNome.focus(); };
    return d;
  }

  function abrirFormulario() {
    if (!dialogo) dialogo = criarFormulario();
    dialogo.limpar();
    dialogo.showModal();
    dialogo.focarNome();
  }

  // ---------- Eventos ----------

  function aoClicarNovoHabito() {
    document.dispatchEvent(new CustomEvent('habito:novo'));
    abrirFormulario();
  }

  async function iniciar() {
    $('btn-novo-habito').addEventListener('click', aoClicarNovoHabito);
    $('btn-novo-habito-vazio').addEventListener('click', aoClicarNovoHabito);

    var toggle = $('nao-hoje-toggle');
    toggle.addEventListener('click', function () {
      var aberto = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!aberto));
      $('lista-nao-hoje').hidden = aberto;
    });

    // Se a aba ficar aberta até virar o dia, atualiza ao voltar a ela
    var diaRenderizado = hojeChave();
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && hojeChave() !== diaRenderizado) {
        diaRenderizado = hojeChave();
        renderizar();
      }
    });

    try {
      habitos = await repositorio.listar();
    } catch (e) {
      console.error('Não foi possível carregar os hábitos:', e);
      habitos = [];
    }

    if (/[?&]demo=1\b/.test(window.location.search) && habitos.length === 0) {
      await api.carregarDemo();
    } else {
      renderizar();
    }
  }

  // ---------- API pública ----------

  var api = {
    CATEGORIAS: CATEGORIAS,

    listar: function () { return habitos.slice(); },

    adicionar: async function (dados) {
      var nome = String(dados.nome || '').trim();
      if (!nome) return null;
      var h = await repositorio.criar({
        nome: nome,
        descricao: String(dados.descricao || '').trim(),
        categoria: CATEGORIAS[dados.categoria] ? dados.categoria : 'outros',
        frequencia: dados.frequencia,
        dias: dados.dias,
        metaSemanal: dados.metaSemanal
      });
      habitos.push(h);
      renderizar();
      return h;
    },

    alternar: alternar,
    renderizar: renderizar,
    abrirFormulario: abrirFormulario,

    // Dados de exemplo para testar visualmente: ?demo=1
    carregarDemo: async function () {
      habitos = [
        { id: novoId(), nome: 'Correr 30 min', descricao: '', categoria: 'esportes', frequencia: 'semanal', dias: null, metaSemanal: 3, streak: 6, conclusoes: [] },
        { id: novoId(), nome: 'Ler 20 min', descricao: '', categoria: 'leitura', frequencia: 'diaria', dias: null, metaSemanal: null, streak: 12, conclusoes: [] },
        { id: novoId(), nome: 'Beber 2 litros de água', descricao: '', categoria: 'saude', frequencia: 'diaria', dias: null, metaSemanal: null, streak: 5, conclusoes: [] },
        { id: novoId(), nome: 'Meditar 10 min', descricao: '', categoria: 'mental', frequencia: 'diaria', dias: null, metaSemanal: null, streak: 0, conclusoes: [] },
        { id: novoId(), nome: 'Estudar inglês', descricao: '', categoria: 'estudos', frequencia: 'semanal', dias: null, metaSemanal: 4, streak: 0, conclusoes: [] },
        { id: novoId(), nome: 'Academia', descricao: '', categoria: 'esportes', frequencia: 'diaria', dias: [1, 3, 5], metaSemanal: null, streak: 3, conclusoes: [] }
      ];
      await repositorio.substituirTudo(habitos);
      renderizar();
    },

    limpar: async function () {
      habitos = [];
      await repositorio.substituirTudo(habitos);
      renderizar();
    }
  };

  window.Habitos = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();