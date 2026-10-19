# HabitUs — Plano de UI/UX

Legenda: **[VALIDAR]** = decisão de produto ou implementação ainda pendente de aval da equipe ou do professor.

---

## 1. Estrutura do produto e fluxos

### 1.1 Mapa de navegação

```text
Deslogado
 ├─ /cadastro
 ├─ /login
 └─ /convite/:codigo

Logado
 ├─ Feed — /feed
 │   ├─ Nova postagem — /feed/nova
 │   └─ Detalhe — /post/:id
 ├─ Hoje — /hoje
 │   └─ Criar/editar hábito — /habitos/novo, /habitos/:id/editar
 ├─ Grupos — /grupos
 │   ├─ Criar grupo — /grupos/novo
 │   └─ Grupo — /grupos/:id
 │       ├─ Abas: Feed | Ranking | Atividades | Membros
 │       ├─ Postar conclusão — /grupos/:id/postar
 │       ├─ Gerenciar — /grupos/:id/gerenciar
 │       └─ Sair do grupo — diálogo
 └─ Perfil — /perfil e /u/:usuario
     └─ Editar perfil — /perfil/editar
```

Destinos principais: **Feed, Hoje, Grupos e Perfil**.

**[VALIDAR]** Tela inicial após o login: Hoje ou Feed. Recomendação: Hoje; para quem ainda não tem hábitos, mostrar o estado “Criar primeiro hábito”.

### 1.2 Fluxos principais

**Cadastro → primeiro hábito**
1. Cadastro com nome, @usuário, e-mail e senha; erros inline por campo.
2. Abrir a tela inicial escolhida. Se for Hoje, mostrar um único CTA “Criar meu primeiro hábito” e sugestões Beber água, Caminhar, Ler 10 min e Estudar.
3. Criar hábito com nome, categoria e frequência; voltar para Hoje com “Marque quando cumprir. Sua sequência começa hoje”.
4. O estado vazio substitui um tutorial longo.

**Marcar hábito**
1. Em hábito diário ou de dias específicos, marcar atualiza check, “Feito hoje” e sequência; tocar de novo desfaz enquanto for o dia atual. À meia-noite, o dia fecha.
2. Em “X vezes por semana”, cada marca atualiza X/Y. Ao cumprir a meta, a sequência aumenta em X; meta 3 significa +3. Não contar semanas consecutivas.
3. A sequência anterior permanece durante a semana em andamento. Se a semana fechar abaixo da meta, volta a zero.

**Grupo, conclusão e ranking**
1. Criar grupo com nome, categoria, datas, descrição, atividades e pontos; abrir o grupo com link de convite.
2. Membro entra pelo convite e posta conclusão com atividade, foto e texto.
3. Publicar atualiza feed e ranking do grupo, mas nunca marca hábito em Hoje.
4. Se autor ou dono excluir a conclusão, os pontos concedidos por ela são descontados.

**Convite, retorno e saída**
1. Preservar `?voltar=/convite/:codigo` durante login/cadastro.
2. Pessoa removida pelo dono fica bloqueada permanentemente.
3. Quem saiu voluntariamente pode voltar pelo link enquanto o grupo aceitar membros.
4. Membro comum perde seus pontos ao sair e pode retornar pelo link.
5. Dono com outros membros transfere a propriedade ao membro que entrou primeiro.
6. Dono como único membro exclui o grupo ao sair.

---

## 2. Navegação responsiva

| Breakpoint | Padrão |
|---|---|
| Mobile, abaixo de 768px | Barra inferior com Feed, Hoje, Grupos e Perfil |
| Tablet, 768–1023px | Trilho lateral de 72px com ícones e rótulo do item ativo |
| Desktop, a partir de 1024px | Menu lateral de 240px, conteúdo central de até 680px e coluna direita opcional |

- Manter ordem e nomes dos destinos em todos os tamanhos.
- A coluna direita mostra somente **Hábitos de hoje**; não usar mini-ranking global.
- Busca de usuários fica no topo do Feed; no mobile, uma lupa expande o campo.
- Abas do grupo são roláveis no mobile e ficam no topo no desktop; refletir a aba na URL, como `?aba=ranking`.
- Título e Voltar permanecem visíveis nas telas de segundo nível.
- **[VALIDAR]** Usar “+” central para Nova postagem/Novo hábito ou botões contextuais. Postar conclusão permanece dentro do grupo.

---

## 3. Wireframes e comportamento das 17 telas

### 3.1 Cadastro

Nome, @usuário, e-mail e senha, CTA Criar conta e link Entrar. Erros abaixo do campo com ícone, cor e texto. Desktop: card de 420px centralizado.

### 3.2 Login

E-mail ou @usuário, senha, CTA Entrar e link Criar conta. Erro genérico “E-mail/usuário ou senha incorretos”. Não oferecer recuperação de senha.

### 3.3 Feed

Busca por @usuário e cards em ordem recente com avatar de iniciais, nome, @, tempo, categoria/hábito, texto, imagem opcional, Curtir e Comentar. “Carregar mais” em vez de rolagem infinita. Autor abre perfil. Sem resultado: “Nenhum @usuário encontrado”.

### 3.4 Nova postagem

Selecionar hábito, texto obrigatório, imagem opcional e CTA Publicar. Exibir antes do CTA: “Postar não marca o hábito como cumprido. Para registrar, vá em Hoje.” Sem hábitos: “Crie um hábito para postar”. Publicar nunca marca nem sugere marcar o hábito.

### 3.5 Detalhe da postagem

Post completo, comentários cronológicos e campo de comentário fixo no mobile. Sem edição. Exclusão de post comum informa irreversibilidade; exclusão de conclusão pelo autor ou dono informa explicitamente o desconto de pontos.

### 3.6 Hoje / meus hábitos

```text
Hoje · data                         2 de 4 feitos
[○ Correr 30 min] [categoria]      Sequência: 5 dias
[● Ler 20 min] [categoria]         Feito hoje · Sequência: 12 dias
[○ Academia] [categoria]
Esta semana: 2/3 [■■□]
Sequência: 6 conclusões
Ao atingir 3/3: +3 na sequência
(Novo hábito)
```

- Botão de marcar com 48px; segundo toque desfaz no dia atual.
- Hábito fora do dia programado aparece recolhido como “Não é hoje”.
- Hábito diário/dias específicos mede cumprimentos consecutivos previstos.
- Hábito semanal soma X ao fechar uma semana cumprida e zera ao fechar abaixo da meta.
- Não mostrar Histórico de 7 dias.

### 3.7 Criar/editar hábito

Nome, descrição opcional, categoria, frequência e Salvar. Frequências: Todos os dias; Dias da semana; X vezes por semana com stepper 1–7. Explicar: “Ao cumprir 3/3, sua sequência aumenta em 3. Se a semana terminar abaixo da meta, volta a zero.” Na edição, Excluir hábito informa que registros e sequência serão apagados.

Categorias oficiais: Saúde; Esportes e exercícios; Estudos; Leitura; Alimentação; Sono; Bem-estar mental; Finanças; Organização e produtividade; Hobbies e criatividade; Outros. Usar grade de duas colunas no mobile e três no desktop, seleção única e quebra de linha sem truncar.

### 3.8 Perfil

Avatar de iniciais, nome, @usuário, descrição, Hábitos ativos, Grupos, Atividades feitas, hábitos e postagens. Não mostrar melhor sequência. Perfil alheio é somente leitura. Sem foto e sem seguir.

### 3.9 Editar perfil

Nome, @usuário e Descrição 0/160, Salvar/Cancelar. Avatar de iniciais atualiza ao vivo.

### 3.10 Meus grupos

Seções Em andamento, Não iniciado e Encerrado, com categoria, membros, prazo e posição. Estado vazio: “Você ainda não está em nenhum grupo. Crie um ou entre por um link de convite.”

### 3.11 Criar grupo

Nome, as mesmas 11 categorias, início, fim, descrição, atividades e pontos de 1 a 10. Exigir fim posterior ao início e ao menos uma atividade. Usar `input type="date"` e stepper.

### 3.12 Página do grupo

Cabeçalho com categoria, status, datas, membros, Gerenciar para dono e convite enquanto aceitar entradas. Abas Feed, Ranking, Atividades e Membros.

- Feed: conclusões com autor, atividade, pontos, foto e texto.
- Ranking: posição, avatar, nome e pontos; empates 1º, 1º, 2º; própria linha destacada.
- Atividades: nome, pontos e “Feito hoje” quando aplicável.
- Membros: selo Dono, perfil ao tocar, Remover para o dono e Sair do grupo para todos.
- Remover avisa perda de pontos e bloqueio permanente.
- Saída voluntária perde pontos, mas permite retorno.
- Saída do dono transfere ao membro mais antigo; sozinho, exclui o grupo.

### 3.13 Postar conclusão

Selecionar atividade disponível, foto obrigatória e texto opcional; mostrar pontos antes de publicar. Atividade já feita: desabilitada com “Já feita hoje, volte amanhã”. Usar `accept="image/*"` e `capture` quando suportado. Publicar nunca marca hábito.

### 3.14 Gerenciar grupo

**Não encerrado:** editar atividades/pontos, data final, membros e conclusões; excluir grupo em zona de perigo. Nova pontuação vale apenas dali em diante. Remoção bloqueia permanentemente. Exclusão de conclusão desconta pontos.

**Encerrado:** atividades, membros e postagens ficam em leitura; dono pode alterar a data final ou excluir o grupo.

**[VALIDAR]** Recomendação: se a nova data for futura, reabrir automaticamente, preservando membros, feed, ranking e pontos e retomando convites e conclusões. Se continuar no passado, manter encerrado. Confirmar a reabertura antes de salvar.

### 3.15 Convite por link

Prever estados: válido e logado; deslogado com retorno pós-login; já membro; saiu voluntariamente; código inválido; removido; grupo encerrado. Cada estado tem título, explicação e um CTA.

**[VALIDAR]** Para deslogados, mostrar nome, dono, membros e datas ou apenas “Você foi convidado para um grupo no HabitUs”.

### 3.16 Sair do grupo

Bottom sheet no mobile, com três variantes:
1. **Membro:** informar perda de pontos e possibilidade de voltar pelo link.
2. **Dono com outros:** nomear o membro que entrou primeiro como novo dono; “Sair e transferir grupo”.
3. **Dono sozinho:** informar exclusão permanente do grupo e conteúdo; “Sair e excluir grupo”.

### 3.17 Grupo encerrado

Faixa “Grupo encerrado em [data]. Ranking final salvo”, sem Postar conclusão e com “Convites encerrados”. Feed permanece legível e ranking final destacado. Para o dono, Gerenciar permite mudar a data ou excluir; demais dados ficam em leitura. **[VALIDAR]** Aplicar a regra de reabertura da tela 3.14 caso aprovada.

---

## 4. Estados e componentes

### 4.1 Estados

| Estado | Tratamento |
|---|---|
| Vazio | Mensagem específica e um CTA contextual |
| Carregando | Skeleton com `aria-busy`; botão desabilitado |
| Erro de rede | “Não foi possível carregar” e Tentar de novo |
| Erro de formulário | Erro por campo e resumo no topo |
| Exclusão | Diálogo focado, consequência explícita e ação destrutiva |
| Exclusão de conclusão | Informar desconto dos pontos |
| Sequência diária perdida | “Sua sequência de N dias terminou. Recomeçar hoje vale muito.” |
| Meta semanal perdida | “A semana terminou em X/Y e sua sequência voltou a zero.” |
| Sucesso | Toast curto com `aria-live="polite"` |
| Offline | Faixa “Você está sem conexão.” |

Não usar culpa. Para hábito semanal, nunca dizer “semanas consecutivas”.

### 4.2 Componentes reutilizáveis

Avatar de iniciais; chip e grade de categorias; card de postagem; botão Curtir; card de hábito; indicador de sequência; linha de ranking; quadro-resumo; seletor de frequência; seletor de sete dias; stepper de pontos; campo validado; status do grupo; link de convite; diálogo; estados vazios/skeleton/toast; navegação responsiva.

Na entrega 1, construir em HTML, CSS e JavaScript puros com Vite. Na entrega 2, migrar para componentes React sem redesenhar.

---

## 5. Direção visual a partir das sete referências

Princípio fechado: a interface não herda personagens, rostos, mascotes, traço ilustrado ou clima infantil. Usa somente a **lógica cromática** observada: base neutra dominante, blocos vivos isolados e preto como estrutura. Sem XP, níveis, troféus ou confete.

Os HEX são aproximações de projeto extraídas visualmente das imagens rasterizadas; variações de compressão não devem criar novos tokens.

### 5.1 Análise cromática

**Imagem 1 — amarelo, rosa e verde**
- Cores: creme `#F7F1E3`, amarelo `#F7D968`, rosa `#EFA7D2`, verde-oliva `#9DAF69`, azul-pervinca `#A8BEE2`, vinho `#B83278`, preto `#080808`.
- Proporção: 45% creme/branco, 25% amarelo ou rosa principal, 10% verde, 8% azul, 7% preto, 5% vinho/detalhes.
- Relação: pastéis quentes de luminosidade próxima recebem contraste do preto; verde e azul frios equilibram amarelo e rosa. Amarelo + preto e rosa + vinho aparecem juntos.
- Funciona porque cada tela escolhe um dominante e limita as outras cores a cartões menores; neutros e tipografia preta evitam ruído.

**Imagem 2 — interface escura com rosa e violeta**
- Cores do app: carvão `#10191C`, rosa elétrico `#F15BB7`, violeta `#C56FE8`, lavanda-cinza `#D7CEDC`, branco `#F7F7F5`.
- Proporção: 55% carvão, 20% rosa/violeta, 15% lavanda-cinza, 10% branco.
- Relação: harmonia análoga rosa–violeta sobre neutro muito escuro; saturação alta concentrada na área interativa.
- Funciona porque o carvão dá profundidade e o par análogo é coeso. No HabitUs, preferir cores planas a gradientes.

**Imagem 3 — modal branco com azul**
- Cores: branco `#FFFFFF`, cinza frio `#D9DADD`, azul `#2878F2`, azul-marinho `#172039`, verde `#5FA77E`, coral `#F06D63`.
- Proporção: 65% branco, 15% cinza, 10% azul, 7% preto/marinho, 3% verde/coral.
- Relação: azul frio saturado é a única ação forte; verde e coral aparecem longe do CTA e em doses mínimas.
- Funciona por respiro, hierarquia clara e uma ação cromática inequívoca.

**Imagem 4 — branco com cinco acentos**
- Cores: branco `#FFFFFF`, azul `#3976E8`, verde `#62B783`, coral `#F36B63`, rosa `#ED72D5`, amarelo `#FFC857`, texto `#18203A`.
- Proporção: 70% branco, 15% texto/estrutura, 15% divididos entre cinco acentos.
- Relação: matizes distantes e saturados não se misturam na mesma superfície; cada cor ocupa um item.
- Funciona porque tamanho e espaçamento repetidos unem cores diferentes e o branco cria isolamento óptico. É a principal referência para chips.

**Imagem 5 — painel multicolorido sobre branco**
- Cores: branco `#FFFFFF`, preto `#070707`, verde-claro `#A7F797`, lavanda `#D596F1`, laranja `#FF8A55`, amarelo `#FFD23F`, azul `#8EB9EE`, rosa `#F48FD9`, coral `#FF777B`.
- Proporção: 55% branco, 20% preto, 25% acentos somados; nenhum acento supera cerca de 7%.
- Relação: temperaturas mistas e luminosidade semelhante, sempre com texto preto; uma cor por cartão.
- Funciona porque preto e branco estabilizam a variedade. No HabitUs, usar retângulos limpos e ícones funcionais.

**Imagem 6 — editorial branco, preto e neon**
- Cores: branco/cinza `#F4F4F3`, preto `#050505`, verde-lima `#91FA13`, coral `#F7838F`, ciano `#39CDD4`, bege `#DDD8C9`.
- Proporção: 60% branco/cinza, 20% preto, 20% acentos; em geral, um acento grande por tela.
- Relação: contraste quase máximo entre preto e branco, com neon pontual; coral e ciano apoiam o lima.
- Funciona porque tipografia preta robusta segura a energia do neon. No HabitUs, limitar lima a estados curtos.

**Imagem 7 — lima, azul, rosa e menta**
- Cores: lima `#B7FF22`, preto `#071014`, azul-céu `#55ADD8`, rosa-claro `#F2C7DD`, menta `#A8E7D7`, branco `#F9FAF8`.
- Proporção da referência: 45% lima, 20% preto, 18% azul, 10% rosa, 7% menta/branco.
- Relação: lima luminoso contrasta com preto; azul e menta criam faixa fria; rosa suaviza a transição.
- Funciona por contornos pretos e separação física entre blocos. No produto, reduzir lima a 3–6% da tela.

**Síntese:** as referências funcionam quando cada superfície recebe apenas um acento e existe separação neutra. O HabitUs adotará regra aproximada **80/15/5**: 80% branco/cinza claro, 15% preto/cinza estrutural e no máximo 5% de cores vivas por viewport. Em telas com fotos, reduzir acentos a 3%.

### 5.2 Base neutra compartilhada

| Token | HEX | Uso |
|---|---|---|
| Fundo | `#F7F7F5` | Plano da página |
| Superfície | `#FFFFFF` | Cartões, listas e sheets |
| Superfície secundária | `#F0F0EE` | Campos, chips neutros e grupos |
| Borda | `#D7D7D3` | Separadores e contornos |
| Texto secundário | `#62625F` | Metadados em tamanho regular |
| Texto principal | `#171716` | Títulos e corpo |
| Preto de ênfase | `#050505` | Navegação, ícones e botões neutros |

Preto e branco dominam todas as propostas. Cores vivas não substituem texto principal, não preenchem páginas e não aparecem juntas em grandes áreas.

### 5.3 Proposta A — Pulso Claro, recomendada

Inspirada nas imagens 3, 4 e 7: energia social, leitura objetiva e equilíbrio frio/quente.

| Cor | HEX | Papel |
|---|---|---|
| Azul ação | `#2563EB` | CTA, link e foco; texto branco |
| Verde-lima | `#B7F52A` | Hábito concluído e progresso; texto `#171716` |
| Coral | `#F56F72` | Sequência; para texto pequeno, usar `#9F252B` sobre coral claro |
| Violeta | `#A855D6` | Categorias e detalhes sociais; branco apenas na variante `#743394` |
| Ciano | `#35B8D0` | Organização e informação; texto `#171716` |

Proporção: 80% neutros claros, 15% preto/cinzas, 3% azul e 2% demais acentos.

Papéis: ação = azul; concluído = lima + check; sequência = coral + ícone; em andamento = verde `#167A4A` + “Em andamento”; não iniciado = amarelo `#F3C846` + relógio; encerrado = cinza `#6B6B68` + “Encerrado”; erro/exclusão = `#B42318`; linha pessoal = `#EAF0FF`, barra azul e “Você”.

**Hoje:** fundo cinza-claro, cards brancos, controle pendente azul; concluído recebe círculo lima, check preto e faixa lateral de 3px; coral apenas no ícone/número da sequência.

**Ranking:** lista branca; top 3 por posição escrita e peso tipográfico, sem medalhas/troféus; linha pessoal azul-clara com barra azul; pontos pretos.

### 5.4 Proposta B — Sol Editorial

Inspirada nas imagens 1 e 5: mais calor humano, sem formas infantis.

| Cor | HEX | Papel |
|---|---|---|
| Framboesa | `#A92D72` | CTA; texto branco |
| Amarelo | `#F4CF4E` | Sequência e não iniciado; texto preto |
| Verde-oliva | `#8FA85B` | Concluído; fundo claro `#E7EED7`, texto `#40501E` |
| Pervinca | `#86A9E6` | Informação e ranking; texto `#17213A` |
| Rosa | `#E98FC4` | Categorias e detalhes; texto preto |

Proporção: 82% neutros, 13% preto/cinzas, 5% acentos.

Papéis: ação = framboesa; concluído = oliva + check; sequência = amarelo; em andamento = `#526B2C`; não iniciado = amarelo; encerrado = cinza; erro = `#B42318`; linha pessoal = `#EDF2FC` com borda pervinca.

**Hoje:** cards brancos com controles framboesa; concluídos ganham oliva muito claro, nunca verde sólido; amarelo marca somente a sequência.

**Ranking:** framboesa no segmento ativo, pervinca clara na linha pessoal e amarelo em pequenos indicadores, nunca na posição.

### 5.5 Proposta C — Neon Contido

Inspirada nas imagens 2, 6 e 7: contemporânea e energética, deliberadamente reduzida.

| Cor | HEX | Papel |
|---|---|---|
| Azul elétrico | `#1F6FEB` | CTA; texto branco |
| Lima | `#A8F51C` | Concluído; texto preto |
| Ciano | `#27BFD0` | Informação e categorias; texto preto |
| Rosa | `#E95AB6` | Sequência; texto `#71164F` em fundo rosa claro |
| Coral | `#F36B63` | Atenção não destrutiva e categorias; texto preto em tint |

Proporção: 83% neutros, 13% preto/cinzas, até 4% acentos.

Papéis: ação = azul; concluído = lima + check; sequência = rosa; em andamento = `#147A4D`; não iniciado = coral claro + relógio; encerrado = cinza; erro = `#B42318`; linha pessoal = `#E8F1FF` com barra azul.

**Hoje:** quase monocromática; lima só no check concluído e rosa só na sequência.

**Ranking:** cabeçalho preto/branco, segmento ativo azul, linha pessoal azul-clara; ciano pode marcar atualização recente, sempre com texto.

### 5.6 Categorias sem poluição

Chips usam tint de 8–12%, texto escuro, contorno opcional de 1px e, quando selecionados, check + contorno forte. Não usar onze cores exclusivas: distribuir em cinco famílias e distinguir também por rótulo e ícone de linha.

| Família na proposta A | Categorias |
|---|---|
| Coral | Saúde; Alimentação |
| Lima/verde | Esportes e exercícios; Finanças |
| Azul | Estudos; Sono |
| Violeta | Leitura; Bem-estar mental |
| Ciano | Organização e produtividade; Hobbies e criatividade |
| Cinza | Outros |

Nas propostas B e C, manter o agrupamento e trocar cada família pela cor equivalente. Na grade de seleção, duas colunas no mobile e três no desktop; no uso cotidiano, mostrar só o chip do item. Nunca exibir uma legenda com todas as cores em Hoje.

### 5.7 Recomendação

Seguir **A — Pulso Claro**. Ela combina o isolamento multicolorido das imagens 3/4 com a energia lima–azul da imagem 7, mantendo 95% da interface em neutros. É a mais versátil para hábitos, feed e ranking, tem CTA inequívoco e não depende de estética infantil. B é a alternativa acolhedora; C tem maior risco de parecer promocional.

---

## 6. Guia visual inspirado na Apple

Usar clareza, hierarquia, agrupamento e resposta direta como referência; não copiar logotipos, assets, SF Symbols ou layouts pixel a pixel.

### 6.1 Tipografia

- Stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Em dispositivos Apple, a fonte do sistema pode renderizar San Francisco; Inter é a alternativa multiplataforma.
- Título grande: 34/41px, 700.
- Título de página: 28/34px, 700.
- Título de seção: 22/28px, 700.
- Título de card: 17/22px, 600.
- Corpo: 17/24px, 400.
- Callout: 16/22px, 500.
- Rótulo: 15/20px, 500.
- Nota: 13/18px, 400.
- Legenda: 12/16px, 500.
- Usar caixa normal; ranking com números tabulares; linhas longas limitadas a 65–72 caracteres.

### 6.2 Espaço, forma e elevação

- Grade de 4px; escala 4, 8, 12, 16, 20, 24, 32, 40 e 48px.
- Margem mobile 16px; tablet 24px; desktop 32px. Alvo mínimo 44×44px.
- Raios: 10px em campos/controles; 14px em cards; 18px em listas agrupadas/painéis; 22px no topo de sheets; `999px` em pills.
- `border-radius` simples aproxima o squircle sem efeitos complexos.
- Separador `1px #D7D7D3`; preferir borda ou diferença de superfície. Sombra opcional: `0 2px 12px rgb(0 0 0 / 0.06)`.
- Blur só em barra fixa e sheet: `backdrop-filter: blur(16px)` com fundo opaco de fallback. Não depender dele.

### 6.3 Componentes

- Barra inferior: quatro abas com ícone de linha + rótulo, fundo branco a 92%, separador e área segura. Usar biblioteca aberta e consistente.
- Listas agrupadas: cabeçalho fora do bloco, superfície branca, separadores recuados e raio de 18px.
- Cards: conteúdo primeiro, uma ação principal, sem usar borda e sombra ao mesmo tempo.
- Controle segmentado: abas do grupo em trilho cinza; ativo branco/preto ou azul/branco; texto sempre presente.
- Toggle: apenas para preferências binárias; frequência permanece como rádio/segmentado.
- Stepper: menos, valor e mais, todos com 44px; desabilitar nos limites 1–7 ou 1–10.
- Bottom sheet: confirmações de saída/exclusão, alça visual não interativa, título, consequência e botões diretos; destrutivo vermelho.
- Botões: 50px no primário mobile, rótulos diretos como “Salvar hábito” e “Publicar conclusão”; ícone nunca substitui texto em ações críticas.

### 6.4 Estados e movimento

- Pressionado: escala máxima 0,98 ou mudança de fundo por 120ms.
- Transições: 160–220ms; sheets até 280ms.
- Respeitar `prefers-reduced-motion`; sem confete, bounce ou animação contínua.
- Foco de 2px com offset de 2px; skeleton discreto; sucesso por toast e mudança persistente do estado.

### 6.5 Aplicação nas telas principais

- **Hoje:** título grande, resumo secundário, cards em lista agrupada, check de 48px, progresso semanal linear e Novo hábito direto. Cor no check, sequência e chip, não no fundo inteiro.
- **Feed:** topo translúcido somente se fixo, busca em campo cinza, postagens em cards brancos, foto dominante e Curtir/Comentar com ícones de linha e rótulos acessíveis.
- **Perfil:** cabeçalho limpo com avatar de iniciais, números em grade sem gráfico, Editar perfil secundário e seções em listas agrupadas.
- **Grupo/Ranking:** cabeçalho compacto, controle segmentado, ranking denso e legível; top 3 por posição/peso, sem pódio, medalha ou troféu; linha “Você” com fundo e rótulo.
- **Convite:** cartão central único, nome/status, metadados pequenos e um CTA. Inválido, removido e encerrado usam ícone + título + explicação, nunca apenas cor.
- **Desktop:** barra inferior vira menu lateral; listas mantêm largura legível; Hoje e Perfil podem usar duas colunas; Ranking permanece no contexto do grupo.

### 6.6 Acessibilidade

- Texto normal exige 4,5:1; ícones, foco e texto grande, 3:1. Validar pares finais antes de implementar.
- Branco somente sobre azul `#2563EB`, framboesa `#A92D72`, azul `#1F6FEB`, vermelho `#B42318` e variantes escuras indicadas.
- Lima, amarelo, ciano, rosa claro, coral claro, pervinca e verde-claro recebem texto `#171716`.
- Se uma cor não atingir o contraste, usá-la só como fundo decorativo, borda ou ícone grande; usar variante escura para texto.
- Estado nunca depende só de cor: combinar texto, ícone e forma. Status sempre escreve “Em andamento”, “Não iniciado” ou “Encerrado”.
- Alvos de 44px, foco visível, ordem lógica, `aria-pressed`, `aria-live`, `aria-current`, suporte a 320px, texto redimensionável, alt em imagens, rótulos visíveis e foco preso em diálogo.
- **[VALIDAR]** Semana começa domingo ou segunda. Até decidir, não fixar ordem dos chips nem textos que assumam uma opção.

---

## 7. Referências funcionais e limites

- Instagram e Strava: feed e postagem.
- Streaks e Loop Habit Tracker: hábitos.
- Discord e WhatsApp: grupos, convites e saída.
- Fitbit e Nike Run Club: ranking e encerramento.
- HIG/iOS/macOS: hierarquia, componentes e clareza, sem copiar marcas ou assets.
- As sete imagens anexadas são referência cromática apenas.

Evitar: stories, algoritmos, edição de posts, histórico de 7 dias, culpa, lembretes, melhor sequência, seguidores, RPG, mini-ranking global, troféus, confete, cargos extras e bloqueio da saída do dono.

---

## 8. Decisões e pendências

### 8.1 Fechadas

| Decisão | Regra |
|---|---|
| Sequência semanal | Cumprir X/Y soma X; fechar abaixo da meta zera; nunca contar semanas consecutivas |
| Excluir conclusão | Autor/dono podem excluir e os pontos são descontados |
| Saída do dono | Pode sair; membro mais antigo assume; sozinho exclui o grupo |
| Retorno | Removido fica bloqueado; saída voluntária permite retorno pelo link |
| Categorias | Usar as 11 categorias oficiais |
| Postagem × hábito | Postar nunca marca hábito |
| Desktop | Coluna direita somente com Hábitos de hoje |
| Escopo | Sem recuperação de senha, notificações, lembretes, edição, seguir ou foto de perfil |
| Fora do fluxo | Histórico de 7 dias e melhor sequência |
| Entrega 1 | JavaScript, JSON, HTML/CSS e Vite; sem React/Tailwind |
| Entrega 2 | React + Supabase |

### 8.2 Pendências reais

1. **[VALIDAR]** Semana começando no domingo ou segunda.
2. **[VALIDAR]** Tela inicial após login: Hoje ou Feed. Recomendação: Hoje.
3. **[VALIDAR]** “+” central ou botões contextuais.
4. **[VALIDAR]** Prévia do grupo para deslogados.
5. **[VALIDAR]** Paleta final: A — Pulso Claro, recomendada; B — Sol Editorial; ou C — Neon Contido.
6. **[VALIDAR]** Extensão futura reabre ou não grupo encerrado; recomendação: reabrir preservando dados.
7. **[VALIDAR COM O PROFESSOR]** Papel do JSON: carga estática, API simulada ou persistência exigida.
8. **[VALIDAR COM O PROFESSOR]** Como guardar e avaliar fotos sem servidor.

---

## 9. Viabilidade e verificação

### 9.1 Entrega 1 — JavaScript, JSON e Vite

- Usar somente HTML, CSS e JavaScript puros, sem React/Tailwind.
- Vite apenas para módulos, desenvolvimento e build; hash routes evitam fallback no servidor.
- Dados em objetos compatíveis com JSON. O navegador não reescreve o JSON do projeto; persistência depende da orientação do professor.
- Provisoriamente, JSON pode fornecer carga inicial e `localStorage` guardar alterações locais.

**Fotos**
- Não salvar originais diretamente em data URL; base64 aumenta o tamanho e `localStorage` costuma limitar a origem a cerca de 5 MB.
- Carregar em `canvas`, corrigir orientação quando necessário, limitar maior dimensão a 1200px e comprimir em JPEG/WebP com qualidade inicial 0,7.
- Proposta provisória: até 300 KB por arquivo e 3 MB no total; recomprimir ou rejeitar com mensagem clara.
- Guardar apenas a versão comprimida e removê-la ao excluir a postagem.
- Estratégia e limites dependem das validações com o professor.

### 9.2 Entrega 2 — React + Supabase

- Migrar os padrões aprovados para componentes React sem alterar os fluxos.
- Usar Supabase Auth; tabelas `users`, `habits`, `checkins`, `posts`, `comments`, `likes`, `groups`, `activities`, `memberships` e `completions`; Storage para imagens e RLS.
- Registrar data/hora de entrada para sucessão do dono e separar bloqueio por remoção de saída voluntária.
- Exclusão de conclusão e desconto de pontos devem ocorrer atomicamente.

### 9.3 Verificação

- Percorrer as 17 telas e seus estados de entrada, vazio, erro, sucesso e saída.
- Verificar as 11 categorias e a grade em 320px sem rolagem horizontal.
- Confirmar sequência semanal, desconto de pontos, três variantes de saída, bloqueio/retorno e grupo encerrado.
- Conferir ausência de notificações, lembretes, edição, seguir, recuperação de senha, foto de perfil, XP, níveis, troféus, confete e mascotes.
- Validar todos os pares de cor em ferramenta de contraste antes de fixar tokens.
- Comparar mocks equivalentes de Hoje e Ranking nas três propostas e aprovar uma só.
- Na entrega 1, testar compressão/cotas de foto depois de alinhar a estratégia com o professor e confirmar ausência de React/Tailwind.

## Futuro — fora do escopo

- Histórico de 7 dias.
- Melhor sequência por hábito.
- Modo escuro, somente depois de estabilizar a proposta clara.
