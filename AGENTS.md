# AGENTS.md — HabitUs

Rede social de hábitos. Projeto acadêmico (Projeto 1.1, front-end vanilla). Este arquivo vale para qualquer agente ou pessoa que mexa no código.

## Restrições da Entrega 1
- Stack: JavaScript (ESM), HTML, CSS e JSON, com Vite.
- Persistência: apenas LocalStorage (JSON.parse e JSON.stringify). Sem backend, sem arquivos em public/.
- Proibido: React, Supabase, TypeScript, jQuery e qualquer biblioteca nova. Ícones viram SVG embutido.
- Tailwind v4 está instalado via npm e fica por enquanto. Se o professor não aceitar, será removido; evite @apply complexo.
- O site publica no GitHub Pages em `/habit-tracker/`. Nunca escrever caminhos absolutos como "/" ou "/habit-tracker/..."; use links relativos ou `import.meta.env.BASE_URL`.
- Branch base: `develop`. Todo push nela publica o site; `npm run build` tem que passar sempre.

## Estrutura real
- 8 páginas HTML na raiz: index (cadastro e login), habitos, perfil, feed, grupos, criar-grupo, grupo (?id=), convite (?codigo=). Cada uma carrega só `/src/pages/<nome>.js`.
- `src/pages/`: um JS por página.
- `src/components/`: `base.js` (botão, cartão, item de lista, aba, modal, erro, avatar), `navbar.js`, `auth.js` (`exigirLogin`).
- `src/data/`: `storage.js` (síncrono: `lerLista`, `salvarLista`), `modelo.js` (fábricas puras, recebem UM objeto, id opcional), `categorias.js`, `seed.js` (`carregarDadosIniciais`, ainda não chamado por nenhuma página) e um repositório por lista: habitos, conclusoesHabito, grupos, atividades, membros, conclusoesGrupo, postagens, comentarios, curtidas, recordes, totais.
- Repositórios são `async` e todos têm: `criar`, `listar`, `buscarPorId`, `atualizar`, `excluir`. Importar assim: `import * as habitos from '../data/habitos.js'`. recordes e totais usam `idUsuario` como chave.
- `src/utils/datas.js`: `hoje`, `paraChave`, `deChave`, `mesmoDia`, `inicioDaSemana` (domingo), `fimDaSemana` (sábado), `somarDias`, `diaDaSemana`.
- `src/styles/base.css`: Tailwind e tokens de design.
- `scripts/verificar-dados.mjs`: rodar com `node scripts/verificar-dados.mjs` após mexer em `src/data/` ou `src/utils/`.

## Convenções
- Ids são sempre texto. Campo de dia: 'AAAA-MM-DD'. Campo de data e hora: string ISO (`dataHora`, `dataEntrada`).
- Nunca usar `toISOString()` para gerar chave de dia (usa UTC e erra à noite no Brasil) nem `new Date('AAAA-MM-DD')` (idem). Usar `paraChave` e `deChave`.
- Nomes de funções e variáveis em português sem acento; textos da interface em português do Brasil.
- Programação funcional onde couber (map, filter, reduce, some, sort); regras de negócio em funções puras, separadas dos eventos.
- DOM com createElement, appendChild e addEventListener. Formulários ficam no HTML; janelas (modais) são criadas pelo JavaScript.
- Nunca colocar texto vindo da URL ou do usuário em `innerHTML`; usar `textContent`.
- Onde um critério da rubrica for aplicado, deixar o comentário `// RUBRICA: <critério>`.

## Escopo
- O sprint entrega a ESTRUTURA das páginas (HTML e contêineres) antes da lógica. Páginas de grupo, feed e perfil começam só com estrutura.
- Fazer apenas o que a task pedir. Não antecipar outras tasks.
- Pendências conhecidas: `usuarios.js` e `sessao.js` (login async sobre a camada de dados) e a decisão sobre guardar senha com hash ficam com outra pessoa da equipe. O `seed` só pode ser chamado depois que o login usar a camada de dados.
- Os arquivos em `specs/` e `.specify/` vieram do Spec Kit e estão DESATUALIZADOS (nomes em inglês, PBKDF2, `src/data/index.js`, armazenamento em arquivo). Não seguir. Valem este arquivo e o código.

## Regras para o agente
- Só ler e escrever dentro da pasta do projeto.
- Nunca rodar `git add`, `git commit` nem `git push`.
- Não instalar dependências sem autorização.
- Antes de qualquer mudança grande, apresentar um plano e esperar aprovação.