// Runner dos testes unitários — console, com resumo no final e código de saída.
import { executarRegras } from './unit/regras.test.js';

console.log('========================================');
console.log('TESTES DE REGRAS: SEQUÊNCIA E PONTOS');
console.log('========================================');
console.log();

const erros = await executarRegras();

console.log();
console.log('========================================');
console.log(erros === 0 ? 'TESTES CONCLUÍDOS COM SUCESSO' : `${erros} teste(s) falharam`);
console.log('========================================');
process.exit(erros > 0 ? 1 : 0);
