// Relatório e trava da migração para TypeScript (Fase 5: Manter).
// Conta arquivos .ts e .js em src/, verifica ocorrências explícitas de `any`
// e encerra com código de erro (1) se novos .js ou `any` forem introduzidos.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = import.meta.dirname ? join(import.meta.dirname, '..') : process.cwd();
const PASTA_SRC = join(RAIZ, 'src');

function listarArquivos(diretorio: string): string[] {
  const entradas = readdirSync(diretorio, { withFileTypes: true });
  const arquivos: string[] = [];

  for (const entrada of entradas) {
    const caminho = join(diretorio, entrada.name);
    if (entrada.isDirectory()) {
      arquivos.push(...listarArquivos(caminho));
    } else if (entrada.isFile()) {
      arquivos.push(caminho);
    }
  }

  return arquivos;
}

const todosArquivos = listarArquivos(PASTA_SRC);
const arquivosTs = todosArquivos.filter((a) => a.endsWith('.ts'));
const arquivosJs = todosArquivos.filter((a) => a.endsWith('.js'));
const totalCodigo = arquivosTs.length + arquivosJs.length;
const percentual = totalCodigo > 0 ? ((arquivosTs.length / totalCodigo) * 100).toFixed(1) : '100.0';

const PADRAO_ANY = /(?::\s*any\b|\bas\s+any\b|<\s*any\s*>)/g;
const ocorrenciasAny: Array<{ arquivo: string; quantidade: number }> = [];
let totalAny = 0;

for (const arquivo of arquivosTs) {
  const conteudo = readFileSync(arquivo, 'utf-8');
  const correspondencias = conteudo.match(PADRAO_ANY);
  if (correspondencias && correspondencias.length > 0) {
    totalAny += correspondencias.length;
    ocorrenciasAny.push({
      arquivo: relative(RAIZ, arquivo),
      quantidade: correspondencias.length,
    });
  }
}

console.log('========================================');
console.log('RELATÓRIO DE MIGRAÇÃO TYPESCRIPT');
console.log('========================================');
console.log(`Arquivos TypeScript (.ts): ${arquivosTs.length}`);
console.log(`Arquivos JavaScript (.js): ${arquivosJs.length}`);
console.log(`Progresso da migração:     ${percentual}%`);
console.log(`Ocorrências de 'any':      ${totalAny}`);
console.log('========================================');

if (arquivosJs.length > 0) {
  console.error('\nERRO: Novos arquivos .js encontrados em src/:');
  for (const arquivo of arquivosJs) {
    console.error(`  - ${relative(RAIZ, arquivo)}`);
  }
}

if (totalAny > 0) {
  console.error("\nERRO: Uso explícito de 'any' encontrado em src/:");
  for (const item of ocorrenciasAny) {
    console.error(`  - ${item.arquivo} (${item.quantidade})`);
  }
}

if (arquivosJs.length > 0 || totalAny > 0) {
  process.exit(1);
}
