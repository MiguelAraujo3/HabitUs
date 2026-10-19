# HabitUs — Plano de UI/UX

Legenda: **[VALIDAR]** = decisão de produto ou implementação ainda pendente de aval da equipe ou do professor.

---

## 1. Mapa de navegação e fluxos principais

### 1.1 Mapa do site

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

Quatro destinos principais: **Feed, Hoje, Grupos e Perfil**.

**[VALIDAR]** Tela inicial após login: Hoje ou Feed. Recomendação: Hoje para quem já tem hábitos e “Criar primeiro hábito” para quem ainda não tem.

### 1.2 Fluxos principais

**A. Cadastro → primeiro hábito**
1. Cadastro com nome, @usuário, e-mail e senha; erros inline por campo.
2. Abrir a tela inicial escolhida. Se for Hoje, mostrar estado vazio, CTA “Criar meu primeiro hábito” e sugestões Beber água, Caminhar, Ler 10 min e Estudar.
3. Criar hábito com nome, categoria e frequência; voltar para Hoje com “Marque quando cumprir. Sua sequência começa hoje”.
4. O estado vazio substitui um tutorial longo.

**B. Marcar hábito**
1. Em hábito diário ou de dias específicos, marcar atualiza check, texto “Feito hoje” e sequência; tocar novamente desmarca enquanto for o dia atual. À meia-noite, o dia fecha.
2. Em “X vezes por semana”, cada marca atualiza X/Y. Quando a semana é cumprida, a sequência aumenta pela meta: meta 3 = +3. Não contar semanas consecutivas.
3. A sequência anterior permanece durante a semana em andamento. Se a semana terminar abaixo da meta, ela zera.

**C. Grupo, conclusão e ranking**
1. Criar grupo com nome, categoria, datas, descrição, atividades e pontos; abrir o grupo com link de convite.
2. Membro entra pelo convite e pode postar conclusão com atividade, foto e texto.
3. Publicar atualiza feed e ranking do grupo, mas nunca marca hábito em Hoje.
4. Se autor ou dono excluir a conclusão, os pontos concedidos por ela são descontados.

**D. Convite e retorno**
1. Preservar `?voltar=/convite/:codigo` durante login/cadastro.
2. Pessoa removida pelo dono fica bloqueada permanentemente.
3. Quem saiu voluntariamente pode voltar pelo link enquanto o grupo aceitar membros.

**E. Sair do grupo**
1. Membro comum perde seus pontos e pode retornar pelo link.
2. Dono com outros membros transfere a propriedade ao membro que entrou primeiro.
3. Dono como único membro exclui o grupo ao sair.

---

## 2. Navegação sugerida

| Breakpoint | Padrão |
|---|---|
| Mobile, abaixo de 768px | Barra inferior com Feed, Hoje, Grupos e Perfil; ação central depende da decisão pendente |
| Tablet, 768–1023px | Trilho lateral de 72px com ícones e rótulo do item ativo |
| Desktop, a partir de 1024px | Menu lateral de 240px, conteúdo central de até 680px e coluna direita opcional |

- Manter a mesma ordem de destinos em todos os tamanhos.
- A coluna direita mostra somente **Hábitos de hoje**. Não usar mini-ranking global, pois ele não identifica um grupo.
- Busca de usuários fica no topo do Feed; no mobile, uma lupa expande o campo.
- Abas do grupo são roláveis no mobile e ficam no topo no desktop; usar URL como `?aba=ranking`.
- Título e Voltar permanecem visíveis em telas de segundo nível.
- **[VALIDAR]** Usar “+” central para Nova postagem/Novo hábito ou botões contextuais em cada tela. Postar conclusão permanece dentro do grupo.

---

## 3. Wireframes de baixa fidelidade

Convenções: `[ ]` campo, `( )` botão, `●` marcado, `▢` imagem e `AV` avatar com iniciais. Mobile usa uma coluna.

### 3.1 Cadastro

```text
HabitUs
Crie sua conta
[Nome] [@usuário] [E-mail] [Senha (ver)]
(Criar conta)
Já tem conta? Entrar
```

Erros abaixo do campo, com ícone, cor e texto. Desktop: card de 420px centralizado.

### 3.2 Login

```text
Entrar
[E-mail ou @usuário] [Senha (ver)]
(Entrar)
Não tem conta? Criar conta
```

Erro genérico: “E-mail/usuário ou senha incorretos”. Não oferecer recuperação de senha.

### 3.3 Feed

```text
[Buscar @usuário]
[AV Nome · @user · tempo]
[Categoria] Hábito
Texto
▢ imagem opcional
(Curtir) contador  (Comentar) contador
(Carregar mais)
```

Mais recentes primeiro; autor abre perfil; busca sem resultado informa “Nenhum @usuário encontrado”. No desktop, a coluna direita contém somente Hábitos de hoje.

### 3.4 Nova postagem

```text
← Nova postagem
[Selecione um hábito] [Texto obrigatório]
(Adicionar imagem) ▢ prévia (Remover)
Postar não marca o hábito como cumprido. (Ir para Hoje)
(Publicar)
```

Sem hábitos: “Crie um hábito para postar”. Publicar nunca marca o hábito nem gera sugestão posterior para marcá-lo.

### 3.5 Detalhe da postagem

Post completo, comentários cronológicos e campo fixo no mobile. Sem edição.

- Post comum: “Excluir esta postagem? Não dá para desfazer.”
- Conclusão pelo autor: avisar que os pontos recebidos serão descontados do seu ranking.
- Conclusão pelo dono: avisar que os pontos serão descontados da pessoa.

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
- Hábito de dia específico fora do dia atual aparece recolhido como “Não é hoje”.
- Hábito diário/dias específicos mede cumprimentos consecutivos previstos.
- Hábito semanal soma X apenas ao fechar uma semana cumprida e zera ao fechar abaixo da meta.
- Não mostrar Histórico de 7 dias.

### 3.7 Criar/editar hábito

```text
← Novo hábito
[Nome] [Descrição opcional]
Categoria: grade de chips
Frequência:
( ) Todos os dias
( ) Dias da semana [7 chips; ordem ainda não definida]
( ) X vezes por semana [−] 3 [+]
“Ao cumprir 3/3, sua sequência aumenta em 3.
Se a semana terminar abaixo da meta, volta a zero.”
(Salvar) (Excluir hábito, somente na edição)
```

Categorias oficiais: Saúde; Esportes e exercícios; Estudos; Leitura; Alimentação; Sono; Bem-estar mental; Finanças; Organização e produtividade; Hobbies e criatividade; Outros.

Usar grade de duas colunas no mobile e três no desktop, seleção única e quebra de linha sem truncar. Limite semanal de 1 a 7. Ao excluir, avisar que registros e sequência serão apagados.

### 3.8 Perfil

Avatar de iniciais, nome, @usuário, descrição, Hábitos ativos, Grupos, Atividades feitas, hábitos e postagens. Não mostrar melhor sequência. Perfil alheio é somente leitura. Sem foto e sem seguir usuário.

### 3.9 Editar perfil

Campos Nome, @usuário e Descrição 0/160, com Salvar/Cancelar. Avatar de iniciais atualiza ao vivo.

### 3.10 Meus grupos

Listar Em andamento, Não iniciado e Encerrado, com categoria, membros, prazo e posição. Estado vazio: “Você ainda não está em nenhum grupo. Crie um ou entre por um link de convite.”

### 3.11 Criar grupo

Nome, grade das mesmas 11 categorias, início, fim, descrição, atividades e pontos de 1 a 10. Exigir fim posterior ao início e ao menos uma atividade. Usar `input type="date"`.

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

Selecionar uma atividade disponível, foto obrigatória e texto opcional; mostrar pontos antes de publicar. Atividade já feita: desabilitada com “Já feita hoje, volte amanhã”. Usar `accept="image/*"` e `capture` quando suportado. Publicar nunca marca hábito.

### 3.14 Gerenciar grupo

**Não encerrado:** editar atividades/pontos, data final, membros e conclusões; excluir grupo em zona de perigo. Nova pontuação vale apenas dali em diante. Remoção bloqueia permanentemente. Exclusão de conclusão desconta pontos.

**Encerrado:** atividades, membros e postagens em leitura; dono pode alterar a data final ou excluir o grupo.

**[VALIDAR]** Recomendação: se a nova data for futura, reabrir automaticamente, preservando membros, feed, ranking e pontos e retomando convites e conclusões. Se continuar no passado, manter encerrado. Confirmar explicitamente a reabertura antes de salvar.

### 3.15 Convite por link

Prever estados: válido e logado; deslogado com retorno pós-login; já membro; saiu voluntariamente; código inválido; removido; grupo encerrado.

**[VALIDAR]** Para deslogados, mostrar nome, dono, membros e datas ou apenas “Você foi convidado para um grupo no HabitUs”.

### 3.16 Sair do grupo

Bottom sheet no mobile, com três variantes:

1. **Membro:** informar perda de pontos e possibilidade de voltar pelo link.
2. **Dono com outros:** nomear o membro que entrou primeiro como novo dono; botão “Sair e transferir grupo”.
3. **Dono sozinho:** informar exclusão permanente do grupo e conteúdo; botão “Sair e excluir grupo”.

### 3.17 Grupo encerrado

Faixa “Grupo encerrado em [data]. Ranking final salvo”, sem Postar conclusão e com “Convites encerrados”. Feed permanece legível e ranking final destacado. Para o dono, Gerenciar permite mudar a data ou excluir; demais dados ficam em leitura. **[VALIDAR]** Aplicar a regra de reabertura da tela 3.14 se a data futura for aprovada.

---

## 4. Estados de interface

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

---

## 5. Componentes reutilizáveis

Avatar de iniciais; chip e grade de categorias; card de postagem; botão Curtir; card de hábito; indicador de sequência; linha de ranking; quadro-resumo; seletor de frequência; seletor de sete dias com ordem pendente; stepper de pontos; campo validado; status do grupo; link de convite; diálogo; estados vazios/skeleton/toast; navegação responsiva.

Na entrega 1, construir em HTML, CSS e JavaScript puros com Vite. Na entrega 2, migrar para componentes React sem redesenhar.

---

## 6. Direção visual

Princípio fechado: a interface não herda personagens, rostos, mascotes, traço ilustrado ou clima infantil das referências. Ela usa somente a **lógica cromática** observada: base neutra dominante, blocos vivos isolados e preto como estrutura. Sem XP, níveis, troféus ou confete.

### 6.1 Análise cromática das sete referências

Os HEX abaixo são aproximações úteis para projeto, extraídas visualmente dos pixels das imagens rasterizadas; pequenas variações de compressão não devem virar novos tokens.

**Imagem 1 — telas de eventos em amarelo, rosa e verde**
- Dominantes: creme `#F7F1E3`, amarelo `#F7D968`, rosa `#EFA7D2`, verde-oliva `#9DAF69`, azul-pervinca `#A8BEE2`, vinho `#B83278` e preto `#080808`.
- Proporção aproximada: 45% creme/branco, 25% amarelo ou rosa como campo principal, 10% verde, 8% azul, 7% preto e 5% vinho/detalhes.
- Relação: pastéis quentes de luminosidade próxima recebem contraste forte do preto; verde e azul frios equilibram amarelo e rosa. Amarelo + preto e rosa + vinho aparecem juntos com frequência.
- O que funciona: cada tela escolhe uma cor dominante; as outras ficam em cartões menores. Áreas neutras e tipografia preta impedem que a paleta pastel vire ruído.

**Imagem 2 — interface escura com rosa e violeta**
- Dominantes do conteúdo do app: carvão `#10191C`, rosa elétrico `#F15BB7`, violeta `#C56FE8`, lavanda-cinza `#D7CEDC`, branco `#F7F7F5`; a moldura externa preta da captura não conta como decisão da interface.
- Proporção aproximada do app: 55% carvão, 20% rosa/violeta, 15% lavanda-cinza e 10% branco.
- Relação: harmonia análoga rosa–violeta sobre neutro muito escuro; saturação alta concentrada na área interativa.
- O que funciona: o carvão dá profundidade e o par análogo parece coeso; um único gradiente curto pode funcionar, mas o HabitUs deve preferir cores planas pela simplicidade técnica.

**Imagem 3 — modal branco com azul**
- Dominantes do app: branco `#FFFFFF`, cinza frio `#D9DADD`, azul `#2878F2`, azul-marinho `#172039`, verde `#5FA77E` e pequenos acentos coral `#F06D63`.
- Proporção aproximada: 65% branco, 15% cinza, 10% azul, 7% preto/marinho e 3% verde/coral.
- Relação: azul frio de alta saturação é a única ação forte; verde e coral aparecem longe do CTA, em doses mínimas.
- O que funciona: hierarquia muito clara, grande respiro e uma ação cromática inequívoca.

**Imagem 4 — branco com cinco acentos vivos**
- Dominantes: branco `#FFFFFF`, azul `#3976E8`, verde `#62B783`, coral `#F36B63`, rosa `#ED72D5`, amarelo `#FFC857` e texto `#18203A`.
- Proporção aproximada: 70% branco, 15% texto/estrutura e 15% divididos entre os cinco acentos.
- Relação: matizes distantes e saturados não são misturados em uma mesma superfície; cada cor ocupa um item separado.
- O que funciona: repetição de tamanho e espaçamento une cores diferentes; o branco cria isolamento óptico. É a principal referência para chips de categoria.

**Imagem 5 — painel multicolorido sobre branco**
- Dominantes: branco `#FFFFFF`, preto `#070707`, verde-claro `#A7F797`, lavanda `#D596F1`, laranja `#FF8A55`, amarelo `#FFD23F`, azul `#8EB9EE`, rosa `#F48FD9` e coral `#FF777B`.
- Proporção aproximada: 55% branco, 20% preto, 25% acentos somados; nenhum acento supera cerca de 7%.
- Relação: cores de temperatura mista e luminosidade semelhante, sempre com texto preto. Cartões agrupam uma cor por vez.
- O que funciona: preto e branco estabilizam a variedade; o risco infantil vem das formas/personagens, não da paleta em si. No HabitUs, usar retângulos limpos e ícones funcionais.

**Imagem 6 — editorial branco, preto e neon**
- Dominantes: branco/cinza `#F4F4F3`, preto `#050505`, verde-lima `#91FA13`, coral `#F7838F`, ciano `#39CDD4` e bege `#DDD8C9`.
- Proporção aproximada: 60% branco/cinza, 20% preto e 20% acentos, geralmente um acento grande por tela.
- Relação: contraste quase máximo entre preto e branco, com neon pontual; coral e ciano atuam como secundários do lima.
- O que funciona: tipografia preta robusta segura a energia do neon. Para o HabitUs, o lima deve ficar em estados curtos, nunca como fundo da página.

**Imagem 7 — lima, azul, rosa e menta**
- Dominantes: lima `#B7FF22`, preto `#071014`, azul-céu `#55ADD8`, rosa-claro `#F2C7DD`, menta `#A8E7D7` e branco `#F9FAF8`.
- Proporção aproximada: 45% lima no cenário, 20% preto, 18% azul, 10% rosa e 7% menta/branco.
- Relação: o lima quente e muito luminoso contrasta com preto; azul e menta criam uma faixa fria, e rosa suaviza a transição.
- O que funciona: contornos pretos e separação física entre blocos. Para produto real, reduzir o lima a 3–6% da tela.

**Síntese:** todas as referências funcionam quando uma superfície recebe apenas um acento e existe separação neutra. O HabitUs adotará regra aproximada **80/15/5**: 80% branco/cinza muito claro, 15% preto/cinza estrutural e no máximo 5% de cores vivas por viewport. Em telas com fotos, a cota de acento pode cair para 3%.

### 6.2 Base neutra compartilhada

| Token | HEX | Uso |
|---|---|---|
| Fundo | `#F7F7F5` | Plano da página |
| Superfície | `#FFFFFF` | Cartões, listas e sheets |
| Superfície secundária | `#F0F0EE` | Campos, chips neutros e grupos |
| Borda | `#D7D7D3` | Separadores e contornos |
| Texto secundário | `#62625F` | Metadados; somente em tamanho regular |
| Texto principal | `#171716` | Títulos e corpo |
| Preto de ênfase | `#050505` | Navegação, ícones e botões neutros |

Preto e branco dominam todas as propostas. Cores vivas não substituem texto principal, não preenchem páginas inteiras e não aparecem simultaneamente em grandes áreas.

### 6.3 Três propostas de paleta

#### A — Pulso Claro (recomendada)

Inspirada nas imagens 3, 4 e 7: energia social, leitura objetiva e bom equilíbrio frio/quente.

| Cor | HEX | Papel |
|---|---|---|
| Azul ação | `#2563EB` | CTA primário, link e foco; texto branco |
| Verde-lima | `#B7F52A` | Hábito concluído e progresso; texto `#171716` |
| Coral | `#F56F72` | Sequência e calor social; para texto pequeno, usar versão escura `#9F252B` sobre fundo coral claro |
| Violeta | `#A855D6` | Categorias e detalhes sociais; texto branco apenas em `#743394` |
| Ciano | `#35B8D0` | Organização e informação; texto `#171716` |

Proporção: 80% neutros claros, 15% preto/cinzas, 3% azul e 2% demais acentos. Ação principal = azul; concluído = lima + check; sequência = coral + ícone; grupo em andamento = verde `#167A4A` + ponto/“Em andamento”; não iniciado = amarelo `#F3C846` + relógio + texto escuro; encerrado = cinza `#6B6B68` + quadrado/“Encerrado”; erro/exclusão = `#B42318` com branco; própria linha no ranking = fundo `#EAF0FF`, barra azul e rótulo “Você”.

**Hoje:** fundo cinza-claro, cards brancos, botão de marcar azul quando pendente; concluído recebe círculo lima com check preto e faixa lateral lima de 3px; sequência usa coral apenas no ícone e número.  
**Ranking:** lista branca, top 3 identificados por posição escrita e peso tipográfico, sem medalhas/troféus; própria linha azul-clara com barra azul. Pontos permanecem pretos.

#### B — Sol Editorial

Inspirada nas imagens 1 e 5: mais calor humano, sem usar formas infantis.

| Cor | HEX | Papel |
|---|---|---|
| Framboesa | `#A92D72` | CTA primário; texto branco |
| Amarelo | `#F4CF4E` | Sequência e status não iniciado; texto preto |
| Verde-oliva | `#8FA85B` | Hábito concluído; usar fundo claro `#E7EED7` e texto `#40501E` |
| Pervinca | `#86A9E6` | Informação e destaque de ranking; texto `#17213A` |
| Rosa | `#E98FC4` | Categorias e detalhes; texto preto |

Proporção: 82% neutros, 13% preto/cinzas e 5% acentos. Ação = framboesa; concluído = oliva + check; sequência = amarelo + ícone; em andamento = verde escuro `#526B2C`; não iniciado = amarelo; encerrado = cinza; erro = `#B42318`; linha “Você” = fundo `#EDF2FC` com borda pervinca.

**Hoje:** cards brancos com controles framboesa; cards concluídos ganham oliva muito claro, nunca verde sólido; amarelo marca apenas a sequência.  
**Ranking:** framboesa no controle segmentado ativo, pervinca clara na linha pessoal e amarelo em pequenos indicadores de variação, não na posição.

#### C — Neon Contido

Inspirada nas imagens 2, 6 e 7: mais enérgica e contemporânea, mas deliberadamente reduzida.

| Cor | HEX | Papel |
|---|---|---|
| Azul elétrico | `#1F6FEB` | CTA primário; texto branco |
| Lima | `#A8F51C` | Concluído; texto preto |
| Ciano | `#27BFD0` | Informação e categorias; texto preto |
| Rosa | `#E95AB6` | Sequência; usar texto escuro `#71164F` em fundo rosa claro |
| Coral | `#F36B63` | Atenção não destrutiva e categorias; texto preto em tint claro |

Proporção: 83% neutros, 13% preto/cinzas e até 4% acentos. Ação = azul; concluído = lima + check; sequência = rosa; em andamento = verde `#147A4D`; não iniciado = coral claro + relógio; encerrado = cinza; erro = `#B42318`; linha “Você” = `#E8F1FF` com barra azul.

**Hoje:** quase monocromática; lima aparece somente dentro do check concluído e rosa somente no indicador de sequência.  
**Ranking:** cabeçalho preto/branco, controle ativo azul e linha pessoal azul-clara; ciano pode marcar atualização recente, sempre com texto.

**Recomendação final:** seguir **A — Pulso Claro**. Ela combina o isolamento multicolorido das imagens 3/4 com a energia lima–azul da imagem 7, mas mantém 95% da interface em neutros. É a proposta mais versátil para hábitos, feed social e ranking, tem CTA inequívoco e não depende de estética infantil. B é uma alternativa mais acolhedora; C tem maior risco de parecer promocional.

### 6.4 Cores das 11 categorias sem poluição

Os chips usam sempre fundo em tint de 8–12%, texto escuro, contorno opcional de 1px e, quando selecionados, check + contorno mais forte. Não usar onze cores exclusivas: distribuir as categorias em cinco famílias e distingui-las também por rótulo e ícone de linha.

| Família na proposta A | Categorias |
|---|---|
| Coral | Saúde; Alimentação |
| Lima/verde | Esportes e exercícios; Finanças |
| Azul | Estudos; Sono |
| Violeta | Leitura; Bem-estar mental |
| Ciano | Organização e produtividade; Hobbies e criatividade |
| Cinza | Outros |

Nas propostas B e C, manter o mesmo agrupamento semântico e substituir cada família pela cor equivalente da paleta. Na grade de seleção, duas colunas no mobile e três no desktop; no uso cotidiano, mostrar só o chip da categoria do item. Nunca montar uma legenda com todas as cores na tela Hoje.

### 6.5 Linguagem visual inspirada na Apple

Usar clareza, hierarquia, agrupamento e resposta direta como referência; não copiar logotipos, assets, ícones proprietários nem layouts pixel a pixel.

**Tipografia**
- Stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Em dispositivos Apple, a fonte do sistema pode renderizar San Francisco; Inter é a alternativa multiplataforma da entrega.
- Título grande: 34/41px, 700; título de página: 28/34px, 700; título de seção: 22/28px, 700; título de card: 17/22px, 600; corpo: 17/24px, 400; callout: 16/22px, 500; rótulo: 15/20px, 500; nota: 13/18px, 400; legenda: 12/16px, 500.
- Caixa normal, sem all caps em navegação. Ranking usa números tabulares. No desktop, limitar linhas longas a 65–72 caracteres.

**Espaço, forma e elevação**
- Grade base de 4px; escala 4, 8, 12, 16, 20, 24, 32, 40 e 48px.
- Margem mobile de 16px; tablet 24px; desktop 32px. Alvo mínimo 44×44px.
- Raios: 10px em campos/controles; 14px em cards; 18px em listas agrupadas e painéis; 22px no topo de sheets; `999px` em pills. O `border-radius` simples aproxima o squircle sem efeito complexo.
- Separador `1px #D7D7D3`; preferir borda ou diferença de superfície. Sombra opcional: `0 2px 12px rgb(0 0 0 / 0.06)`.
- Blur somente em barra inferior/topo fixo e sheet: `backdrop-filter: blur(16px)` com fundo opaco de fallback. Desligar transparência quando `prefers-reduced-transparency` puder ser representado por classe/configuração.

**Componentes**
- Barra inferior: quatro abas com ícone de linha + rótulo; fundo branco a 92%, separador superior e área segura. Não copiar SF Symbols: usar biblioteca de ícones aberta e consistente.
- Listas agrupadas: cabeçalho fora do bloco, superfície branca, separadores internos recuados e raio de 18px.
- Cards: conteúdo primeiro, uma ação principal, sem borda e sombra simultaneamente.
- Controle segmentado: abas do grupo em trilho cinza; ativo branco/preto ou azul/ branco, com texto sempre presente.
- Toggle: apenas para preferências binárias reais; frequência continua como rádio/segmentado.
- Stepper: menos, valor e mais, todos com 44px; desabilitar no limite 1–7 ou 1–10.
- Bottom sheet: confirmações de saída/exclusão, alça visual não interativa, título, consequência e botões diretos; ação destrutiva vermelha.
- Botões: 50px no primário mobile, rótulos como “Salvar hábito” e “Publicar conclusão”; ícone é apoio, nunca substitui texto em ações críticas.

**Estados e movimento**
- Pressionado: escala máxima de 0,98 ou mudança de fundo por 120ms; transições de 160–220ms; sheets até 280ms.
- Respeitar `prefers-reduced-motion`; sem confete, bounce ou animação contínua.
- Foco de 2px com offset de 2px; carregamento com skeleton discreto; sucesso por toast e mudança persistente do estado.

### 6.6 Aplicação nas telas principais

- **Hoje:** título grande, resumo como texto secundário, cards em lista agrupada, check de 48px, progresso semanal linear e Novo hábito como botão direto. Cor aparece em check, sequência e chip, não no fundo inteiro.
- **Feed:** topo translúcido apenas se fixo, busca em campo cinza, postagens como cartões brancos com separadores sutis, foto como conteúdo dominante e ações Curtir/Comentar em ícones de linha com rótulos acessíveis.
- **Perfil:** cabeçalho limpo com avatar de iniciais, números em grade sem gráfico, Editar perfil como botão secundário e seções Hábitos/Postagens em listas agrupadas.
- **Página do grupo/Ranking:** cabeçalho compacto, controle segmentado para Feed/Ranking/Atividades/Membros, ranking como lista de alta densidade legível; top 3 por posição e peso, sem pódio, medalha ou troféu; linha “Você” com fundo e rótulo.
- **Convite:** cartão central único, nome/status do grupo, metadados em rótulos pequenos e um CTA. Estados inválido, removido e encerrado usam ícone + título + explicação, nunca só cor.
- **Responsividade:** no desktop, barra inferior vira menu lateral; listas mantêm largura legível; Hoje e Perfil podem usar duas colunas; Ranking permanece identificado dentro da página do grupo. O mesmo token e componente deve funcionar nas duas entregas.

### 6.7 Acessibilidade cromática e geral

- Texto normal exige contraste mínimo 4,5:1; ícones, foco e texto grande, 3:1. Validar os pares finais em ferramenta de contraste antes da implementação.
- Branco somente sobre azul `#2563EB`, framboesa `#A92D72`, azul `#1F6FEB`, vermelho `#B42318` e variantes escuras indicadas. Lima, amarelo, ciano, rosa claro, coral claro, pervinca e verde-claro recebem texto `#171716`.
- Quando uma cor viva não atingir 4,5:1 com branco ou preto no tamanho usado, aplicá-la apenas como fundo decorativo, borda ou ícone grande e usar a variante escura para texto.
- Estado nunca depende apenas de cor: combinar texto, ícone e forma. Status do grupo sempre traz “Em andamento”, “Não iniciado” ou “Encerrado”.
- Alvos de 44px, foco visível, ordem lógica, `aria-pressed`, `aria-live` e `aria-current`; suporte a 320px, texto redimensionável, alt em imagens, rótulos visíveis e diálogo com foco preso.
- **[VALIDAR]** Semana começa domingo ou segunda. Até decidir, não fixar ordem dos chips nem textos que assumam uma opção.

---

## 7. Quadro de referências por tela

| Tela | Adotar | Evitar |
|---|---|---|
| Cadastro/Login | Formulário curto, erros claros | Captcha, recuperação de senha |
| Feed/Post | Cards simples, autor clicável, busca | Stories, algoritmos, edição |
| Hoje/Hábito | Marcação em um toque, X/Y e lista agrupada limpa | Histórico de 7 dias, culpa, lembretes |
| Perfil | Resumo enxuto | Melhor sequência, seguidores, RPG |
| Grupos | Status, abas, ranking identificado | Mini-ranking global, troféus exagerados |
| Conclusão | Pontos claros, foto obrigatória | Marcar hábito, métricas avançadas |
| Gerenciar | Zona de perigo e consequências | Cargos e moderação extra |
| Convite/Saída | Um CTA, estados e consequências | Erro genérico, bloquear saída do dono |
| Encerrado | Ranking final e data editável | Ocultar extensão do prazo |

Referências funcionais: Instagram e Strava para feed; Streaks e Loop Habit Tracker para hábitos; Discord e WhatsApp para grupos/convites; Fitbit e Nike Run Club para ranking e encerramento. Referência de linguagem: HIG/iOS/macOS para hierarquia, componentes e clareza, sem copiar assets ou marcas da Apple. As sete imagens anexadas são referência cromática apenas.

---

## 8. Decisões do produto e pendências

### 8.1 Já fechadas

| Decisão | Regra | Origem |
|---|---|---|
| Sequência semanal | Cumprir X/Y soma X; fechar abaixo da meta zera; nunca contar semanas consecutivas | Decisão da equipe |
| Excluir conclusão | Autor/dono podem excluir e os pontos são descontados | Decisão da equipe |
| Saída do dono | Pode sair; membro mais antigo assume; sozinho exclui o grupo | Decisão da equipe |
| Retorno | Removido fica bloqueado; saída voluntária permite retorno pelo link | Decisão da equipe |
| Categorias | Usar as 11 categorias oficiais | Requisito |
| Postagem × hábito | Postar nunca marca hábito | Requisito |
| Desktop | Coluna direita somente com Hábitos de hoje | Correção de UX |
| Escopo | Sem recuperação de senha, notificações, lembretes, edição, seguir ou foto de perfil | Requisito |
| Fora do fluxo | Histórico de 7 dias e melhor sequência | Fora dos requisitos |
| Entrega 1 | JavaScript, JSON, HTML/CSS e Vite; sem React/Tailwind | Requisito acadêmico |
| Entrega 2 | React + Supabase | Requisito acadêmico |

### 8.2 Pendências reais

1. **[VALIDAR]** Semana começando no domingo ou segunda.
2. **[VALIDAR]** Tela inicial após login: Hoje ou Feed.
3. **[VALIDAR]** “+” central ou botões contextuais.
4. **[VALIDAR]** Prévia do grupo para deslogados.
5. **[VALIDAR]** Paleta final: A — Pulso Claro (recomendada), B — Sol Editorial ou C — Neon Contido.
6. **[VALIDAR]** Extensão futura reabre ou não grupo encerrado; recomendação: reabrir preservando dados.
7. **[VALIDAR COM O PROFESSOR]** Papel do JSON: carga estática, API simulada ou persistência exigida.
8. **[VALIDAR COM O PROFESSOR]** Como guardar e avaliar fotos sem servidor.

---

## 9. Viabilidade técnica (entregas 1 e 2)

### 9.1 Entrega 1 — JavaScript, JSON e Vite

- Se houver protótipo, usar somente HTML, CSS e JavaScript puros, sem React/Tailwind.
- Vite apenas para módulos, desenvolvimento e build; hash routes evitam fallback no servidor.
- Dados em objetos compatíveis com JSON. O navegador não reescreve o JSON do projeto; persistência depende da orientação do professor.
- Provisoriamente, JSON pode fornecer a carga inicial e `localStorage` guardar alterações locais.

**Fotos**
- Não salvar originais diretamente em data URL; base64 aumenta o tamanho e o `localStorage` costuma limitar a origem a cerca de 5 MB.
- Carregar em `canvas`, corrigir orientação quando necessário, limitar maior dimensão a 1200px e comprimir em JPEG/WebP com qualidade inicial 0,7.
- Proposta provisória: até 300 KB por arquivo e 3 MB no total; recomprimir ou rejeitar com mensagem clara.
- Guardar apenas a versão comprimida e removê-la ao excluir a postagem.
- Estratégia e limites dependem das duas validações com o professor.

### 9.2 Entrega 2 — React + Supabase

Migrar padrões para React; Supabase Auth; tabelas `users`, `habits`, `checkins`, `posts`, `comments`, `likes`, `groups`, `activities`, `memberships` e `completions`; Storage para imagens e RLS. Registrar data/hora de entrada e bloqueio por remoção. Exclusão de conclusão e desconto de pontos devem ser atômicos.

### 9.3 Limites e verificação

- Evitar tempo real, drag-and-drop, edição de imagem, mapas e gestos obrigatórios; usar “Carregar mais”.
- Verificar as 17 telas, 11 categorias, regra semanal, desconto de pontos, três saídas, bloqueio/retorno, estado encerrado e acessibilidade.
- Na entrega 1, testar compressão e cotas após alinhar com o professor e confirmar ausência de React/Tailwind.

## Futuro — fora do escopo atual

- **Histórico de 7 dias na tela Hoje:** avaliar em versão futura; não usar nos fluxos ou wireframes atuais.
- **Melhor sequência por hábito:** avaliar em versão futura; não usar em perfil, cards ou estados atuais.
- **Modo escuro:** considerar depois de estabilizar a proposta visual e o modo claro.
