// Runner dos testes unitários — console, com resumo no final e código de saída.
import { registerHooks } from 'node:module';

// Permite que o Node resolva imports './arquivo.js' para './arquivo.ts' (padrão NodeNext).
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (erro) {
      if (erro?.code === 'ERR_MODULE_NOT_FOUND' && specifier.endsWith('.js')) {
        return nextResolve(specifier.replace(/\.js$/, '.ts'), context);
      }
      throw erro;
    }
  },
});

const { executarRegras } = await import('./unit/regras.test.js');

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
