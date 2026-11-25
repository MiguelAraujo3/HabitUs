// Script para testar a listagem de grupos do Supabase
import { registerHooks } from 'node:module';

// Permite ao Node ESM resolver imports relativos sem extensão adicionando '.ts'
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (erro) {
      const e = erro as { code?: string };
      if (e?.code === 'ERR_MODULE_NOT_FOUND') {
        if (specifier.endsWith('.js')) {
          return nextResolve(specifier.replace(/\.js$/, '.ts'), context);
        }
        if (specifier.startsWith('./') || specifier.startsWith('../')) {
          return nextResolve(`${specifier}.ts`, context);
        }
      }
      throw erro;
    }
  },
});

async function principal(): Promise<void> {
  try {
    const { listar } = await import('../src/data/grupos');
    console.log('Buscando grupos via Supabase (listar())...');
    const grupos = await listar();
    console.log(`\nGrupos encontrados (${grupos.length}):`);
    console.log(JSON.stringify(grupos, null, 2));
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    console.error('\nErro ao listar grupos:', mensagem);
  }
}

await principal();
