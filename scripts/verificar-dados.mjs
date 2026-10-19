import { CATEGORIAS } from '../src/data/categorias.js';
import { criarHabito, criarConclusaoHabito, criarGrupo, criarAtividade, criarMembro, criarConclusaoGrupo, criarPostagem, criarComentario, criarCurtida, criarRegistroRecordes, criarTotalUsuario } from '../src/data/modelo.js';
import { lerLista, salvarLista } from '../src/data/storage.js';
import { hoje, paraChave, deChave, mesmoDia, inicioDaSemana, fimDaSemana, somarDias, diaDaSemana } from '../src/utils/datas.js';

// Mock localStorage para Node (síncrono)
const storageMock = {
  _data: {},
  getItem(key) { return this._data[key] || null; },
  setItem(key, value) { this._data[key] = value; },
  removeItem(key) { delete this._data[key]; }
};
global.localStorage = storageMock;

let erros = 0;
function testar(nome, condicao, msg = '') {
  if (!condicao) {
    console.log(`  NOT OK: ${nome} ${msg}`);
    erros++;
  } else {
    console.log(`  OK: ${nome}`);
  }
}

console.log('========================================');
console.log('VERIFICACAO COMPLETA: Stages 1-4');
console.log('========================================');
console.log();

// ========== STAGE 1: CATEGORIAS ==========
console.log('--- Teste 1: Categorias ---');
testar('CATEGORIAS array com 11 itens', Array.isArray(CATEGORIAS) && CATEGORIAS.length === 11, `length=${CATEGORIAS.length}`);
testar('Primeira e "Saúde"', CATEGORIAS[0] === 'Saúde');
testar('Ultima e "Outros"', CATEGORIAS[10] === 'Outros');

// ========== STAGE 2: MODELO ==========
console.log('--- Teste 2-12: Modelo ---');

// 2. criarHabito
try {
  const hab = criarHabito({ idUsuario: 'u1', nome: 'Beber agua', categoria: 'Saude', descricao: '2L/dia', frequencia: { tipo: 'diaria' } });
  testar('criarHabito tem id', !!hab.id && typeof hab.id === 'string');
  testar('criarHabito dataCriacao e AAAA-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(hab.dataCriacao), `=${hab.dataCriacao}`);
  testar('criarHabito ativo=true', hab.ativo === true);
} catch (e) { testar('criarHabito nao lancou erro', false, e.message); erros++; }

// 3. criarConclusaoHabito
try {
  const ch = criarConclusaoHabito({ idHabito: 'h1', data: '2026-10-15' });
  testar('criarConclusaoHabito tem id', !!ch.id);
  testar('criarConclusaoHabito data', ch.data === '2026-10-15');
} catch (e) { testar('criarConclusaoHabito nao lancou erro', false, e.message); erros++; }

// 4. criarGrupo com codigoConvite
try {
  const grp = criarGrupo({ nome: 'Grupo Teste', categoria: 'Saude', descricao: 'desc', dataInicio: '2026-01-01', dataFim: '2026-12-31', idDono: 'u1', codigoConvite: 'ABC123' });
  testar('criarGrupo tem id', !!grp.id);
  testar('criarGrupo codigoConvite', grp.codigoConvite === 'ABC123');
  testar('criarGrupo encerrado=false', grp.encerrado === false);
  testar('criarGrupo rankingFinal=null', grp.rankingFinal === null);
} catch (e) { testar('criarGrupo nao lancou erro', false, e.message); erros++; }

// 5. criarAtividade pontos 1-10
try {
  const atv = criarAtividade({ idGrupo: 'g1', nome: 'Agachamento', pontos: 5 });
  testar('criarAtividade id', !!atv.id);
  testar('criarAtividade pontos', atv.pontos === 5);
  try { criarAtividade({ idGrupo: 'g2', nome: 'X', pontos: 0 }); testar('criarAtividade pontos 0 lança Error', false); erros++; }
  catch (e) { testar('criarAtividade pontos 0 lança Error', true); }
  try { criarAtividade({ idGrupo: 'g3', nome: 'X', pontos: 11 }); testar('criarAtividade pontos 11 lança Error', false); erros++; }
  catch (e) { testar('criarAtividade pontos 11 lança Error', true); }
} catch (e) { testar('criarAtividade nao lancou erro inesperado', false, e.message); erros++; }

// 6. criarMembro
try {
  const mem = criarMembro({ idGrupo: 'g1', idUsuario: 'u1', dataEntrada: '2026-01-10T10:00:00', bloqueado: true });
  testar('criarMembro id', !!mem.id);
  testar('criarMembro dataEntrada ISO', mem.dataEntrada === '2026-01-10T10:00:00');
  testar('criarMembro bloqueado=true', mem.bloqueado === true);
  const mem2 = criarMembro({ idGrupo: 'g2', idUsuario: 'u2' });
  testar('criarMembro bloqueado padrao false', mem2.bloqueado === false);
} catch (e) { testar('criarMembro nao lancou erro', false, e.message); erros++; }

// 7. criarConclusaoGrupo
try {
  const cg = criarConclusaoGrupo({ idGrupo: 'g1', idAtividade: 'a1', idUsuario: 'u1', data: '2026-10-15', foto: 'f.jpg', texto: 'ok' });
  testar('criarConclusaoGrupo id', !!cg.id);
  testar('criarConclusaoGrupo data', cg.data === '2026-10-15');
} catch (e) { testar('criarConclusaoGrupo nao lancou erro', false, e.message); erros++; }

// 8. criarPostagem
try {
  const post = criarPostagem({ idUsuario: 'u1', idHabito: 'h1', texto: 'ola', imagem: 'img.jpg' });
  testar('criarPostagem id', !!post.id);
  testar('criarPostagem dataHora ISO', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(post.dataHora));
} catch (e) { testar('criarPostagem nao lancou erro', false, e.message); erros++; }

// 9. criarComentario
try {
  const cm = criarComentario({ idPostagem: 'p1', idUsuario: 'u1', texto: 'oi', dataHora: '2026-10-15T10:30:00' });
  testar('criarComentario id', !!cm.id);
  testar('criarComentario dataHora', cm.dataHora === '2026-10-15T10:30:00');
} catch (e) { testar('criarComentario nao lancou erro', false, e.message); erros++; }

// 10. criarCurtida
try {
  const cur = criarCurtida({ idPostagem: 'p1', idUsuario: 'u1' });
  testar('criarCurtida id', !!cur.id);
} catch (e) { testar('criarCurtida nao lancou erro', false, e.message); erros++; }

// 11. criarRegistroRecordes e criarTotalUsuario (id = idUsuario se omitido)
try {
  const rec = criarRegistroRecordes({ idUsuario: 'u1', maiorSequencia: 15 });
  testar('criarRegistroRecordes id=idUsuario', rec.id === 'u1');
  const to = criarTotalUsuario({ idUsuario: 'u1', atividadesConcluidas: 42 });
  testar('criarTotalUsuario id=idUsuario', to.id === 'u1');
} catch (e) { testar('criarRegistroRecordes/TotalUsuario nao lancou erro', false, e.message); erros++; }

// ========== STAGE 3: DATAS (sem process.env.TZ) ==========
console.log('--- Teste 13-18: Datas (sem process.env.TZ) ---');

// 14. paraChave com 23:30 local usando new Date(ano, mes, dia, hora, min)
{
  const d = new Date(2026, 9, 15, 23, 30); // 15/10/2026 23:30 local
  const chave = paraChave(d);
  testar('paraChave 23:30 retorna 2026-10-15', chave === '2026-10-15', `obtido=${chave}`);
}

// 15. deChave
{
  const d = deChave('2026-10-15');
  testar('deChave dia 15', d.getDate() === 15);
  testar('deChave mes 10', d.getMonth() + 1 === 10);
  testar('deChave ano 2026', d.getFullYear() === 2026);
}

// 16. inicioDaSemana / fimDaSemana
{
  const d = new Date(2026, 9, 15); // quinta-feira 15/10/2026
  const inc = inicioDaSemana(d);
  const fim = fimDaSemana(d);
  testar('inicioDaSemana eh domingo', inc.getDay() === 0);
  testar('fimDaSemana eh sabado', fim.getDay() === 6);
  testar('inicio e fim diferentes', inc.getTime() !== fim.getTime());
}

// 17. somarDias atravessa mes e ano
{
  const jan31 = new Date(2026, 0, 31);
  const d1 = somarDias(jan31, 1);
  testar('somarDias atravessa mes', d1.getDate() === 1 && d1.getMonth() === 1);

  const dez31 = new Date(2026, 11, 31);
  const d2 = somarDias(dez31, 1);
  testar('somarDias atravessa ano', d2.getFullYear() === 2027);

  const feb3 = new Date(2026, 1, 3);
  const d3 = somarDias(feb3, -3);
  testar('somarDias negativo', d3.getDate() === 31 && d3.getMonth() === 0);
}

// 18. diaDaSemana
{
  testar('diaDaSemana domingo=0', diaDaSemana(new Date(2026, 0, 4)) === 0);
  testar('diaDaSemana sabado=6', diaDaSemana(new Date(2026, 0, 10)) === 6);
}

// ========== STAGE 3: 11 REPOSITORIOS em laço ==========
console.log('--- Teste 19-29: 11 Repositorios (CRUD em laço) ---');

const repos = [
  { nome: 'habitos', modulo: await import('../src/data/habitos.js'), criarDados: { idUsuario: 'u1', nome: 'H', categoria: 'Saude', frequencia: { tipo: 'diaria' } } },
  { nome: 'conclusoesHabito', modulo: await import('../src/data/conclusoesHabito.js'), criarDados: { idHabito: 'h1', data: '2026-10-15' } },
  { nome: 'grupos', modulo: await import('../src/data/grupos.js'), criarDados: { nome: 'G', categoria: 'Saude', descricao: 'd', dataInicio: '2026-01-01', dataFim: '2026-12-31', idDono: 'u1', codigoConvite: 'X' } },
  { nome: 'atividades', modulo: await import('../src/data/atividades.js'), criarDados: { idGrupo: 'g1', nome: 'A', pontos: 5 } },
  { nome: 'membros', modulo: await import('../src/data/membros.js'), criarDados: { idGrupo: 'g1', idUsuario: 'u1', dataEntrada: '2026-01-10T09:00:00' } },
  { nome: 'conclusoesGrupo', modulo: await import('../src/data/conclusoesGrupo.js'), criarDados: { idGrupo: 'g1', idAtividade: 'a1', idUsuario: 'u1', data: '2026-10-15', texto: 'ok' } },
  { nome: 'postagens', modulo: await import('../src/data/postagens.js'), criarDados: { idUsuario: 'u1', idHabito: 'h1', texto: 'p' } },
  { nome: 'comentarios', modulo: await import('../src/data/comentarios.js'), criarDados: { idPostagem: 'p1', idUsuario: 'u1', texto: 'c', dataHora: '2026-10-15T10:00:00' } },
  { nome: 'curtidas', modulo: await import('../src/data/curtidas.js'), criarDados: { idPostagem: 'p1', idUsuario: 'u1' } },
  { nome: 'recordes', modulo: await import('../src/data/recordes.js'), criarDados: { idUsuario: 'u1', maiorSequencia: 10 } },
  { nome: 'totais', modulo: await import('../src/data/totais.js'), criarDados: { idUsuario: 'u1', atividadesConcluidas: 5 } },
];

for (const r of repos) {
  const M = r.modulo;
  try {
    // criar
    const criado = await M.criar(r.criarDados);
    testar(`${r.nome}: criar retorna objeto`, !!criado && typeof criado === 'object');

    // listar
    const lista = await M.listar();
    testar(`${r.nome}: listar tem 1 item`, lista.length === 1);

    // buscarPorId
    const buscado = await M.buscarPorId(criado.id);
    testar(`${r.nome}: buscarPorId encontra`, !!buscado && buscado.id === criado.id);

    // atualizar
    const dadosAtualizar = r.nome === 'recordes' || r.nome === 'totais'
      ? { idUsuario: 'u1', maiorSequencia: 20, atividadesConcluidas: 10 }
      : { nome: 'Atualizado' };
    const atualizado = await M.atualizar(criado.id, dadosAtualizar);
    testar(`${r.nome}: atualizar retorna objeto`, !!atualizado);

    // conferir que persistiu relendo
    const aposAtualizar = await M.buscarPorId(criado.id);
    const persistiu = r.nome === 'recordes'
      ? aposAtualizar && aposAtualizar.maiorSequencia === 20
      : r.nome === 'totais'
        ? aposAtualizar && aposAtualizar.atividadesConcluidas === 10
        : aposAtualizar && aposAtualizar.nome === 'Atualizado';
    testar(`${r.nome}: atualizar persistiu (relido)`, persistiu);

    // excluir
    await M.excluir(criado.id);
    const depoisExcluir = await M.listar();
    testar(`${r.nome}: excluir removeu`, depoisExcluir.length === 0);

  } catch (e) {
    testar(`${r.nome}: CRUD sem erro`, false, e.message);
    erros++;
  }
}

// 30. recordes e totais: criar duplicado lança Error
{
  const R = await import('../src/data/recordes.js');
  const T = await import('../src/data/totais.js');
  try {
    await R.criar({ idUsuario: 'dup', maiorSequencia: 5 });
    await R.criar({ idUsuario: 'dup', maiorSequencia: 10 });
    testar('recordes criar duplicado lança Error', false);
    erros++;
  } catch (e) { testar('recordes criar duplicado lança Error', true); }
  try {
    await T.criar({ idUsuario: 'dup', atividadesConcluidas: 1 });
    await T.criar({ idUsuario: 'dup', atividadesConcluidas: 2 });
    testar('totais criar duplicado lança Error', false);
    erros++;
  } catch (e) { testar('totais criar duplicado lança Error', true); }
}

// 31. deChave com horários distintos (dataEntrada)
{
  const d1 = deChave('2026-10-15');
  const d2 = deChave('2026-10-16');
  testar('deChave datas distintas retornam objetos distintos', d1.getTime() !== d2.getTime());
  testar('deChave dia 15 vs 16', d1.getDate() === 15 && d2.getDate() === 16);
}

// ========== STAGE 4: SEED ==========
console.log('--- Teste 32-35: Seed (carregarDadosIniciais) ---');

import('../src/data/seed.js').then(async ({ carregarDadosIniciais }) => {
  // 32. Seed roda primeira vez
  await carregarDadosIniciais();
  const u1 = lerLista('usuarios');
  const h1 = lerLista('habitos');
  const g1 = lerLista('grupos');
  const p1 = lerLista('postagens');
  testar('seed: usuarios criados (4)', u1.length === 4, `=${u1.length}`);
  testar('seed: habitos criados (8)', h1.length === 8, `=${h1.length}`);
  testar('seed: grupos criados (2)', g1.length === 2, `=${g1.length}`);
  testar('seed: postagens criadas (6)', p1.length === 6, `=${p1.length}`);

  // 33. Seed rodando segunda vez NAO duplica
  await carregarDadosIniciais();
  const u2 = lerLista('usuarios');
  const h2 = lerLista('habitos');
  testar('seed: segunda executacao nao duplica usuarios', u2.length === 4, `=${u2.length}`);
  testar('seed: segunda executacao nao duplica habitos', h2.length === 8, `=${h2.length}`);

  // 34. Todos os ids referenciados existem
  const todosUsuarios = lerLista('usuarios').map(u => u.id);
  const todosGrupos = lerLista('grupos').map(g => g.id);
  const todosHabitos = lerLista('habitos').map(h => h.id);
  const todosAtividades = lerLista('atividades').map(a => a.id);

  let idsValidos = true;
  // Habitos devem referenciar usuarios existentes
  for (const h of lerLista('habitos')) {
    if (!todosUsuarios.includes(h.idUsuario)) { idsValidos = false; break; }
  }
  // Atividades devem referenciar grupos existentes
  for (const a of lerLista('atividades')) {
    if (!todosGrupos.includes(a.idGrupo)) { idsValidos = false; break; }
  }
  // Membros devem referenciar grupos e usuarios existentes
  for (const m of lerLista('membros')) {
    if (!todosGrupos.includes(m.idGrupo) || !todosUsuarios.includes(m.idUsuario)) { idsValidos = false; break; }
  }
  // ConclusoesGrupo devem referenciar grupo, atividade e usuario existentes
  for (const cg of lerLista('conclusoesGrupo')) {
    if (!todosGrupos.includes(cg.idGrupo) || !todosAtividades.includes(cg.idAtividade) || !todosUsuarios.includes(cg.idUsuario)) { idsValidos = false; break; }
  }
  testar('seed: todos os ids referenciados existem', idsValidos);

  // 35. Grupo encerrado tem encerrado=true e rankingFinal preenchido
  const grupoEncerrado = lerLista('grupos').find(g => g.encerrado === true);
  testar('seed: grupo encerrado existe e tem rankingFinal', !!grupoEncerrado && !!grupoEncerrado.rankingFinal && Object.keys(grupoEncerrado.rankingFinal).length > 0);

  console.log();
  console.log('========================================');
  console.log(`RESULTADO: ${erros} erro(s) encontrado(s)`);
  console.log('========================================');
  process.exit(erros > 0 ? 1 : 0);
}).catch(e => {
  testar('seed modulo carregou', false, e.message);
  erros++;
  console.log();
  console.log('========================================');
  console.log(`RESULTADO: ${erros} erro(s) encontrado(s)`);
  console.log('========================================');
  process.exit(erros > 0 ? 1 : 0);
});