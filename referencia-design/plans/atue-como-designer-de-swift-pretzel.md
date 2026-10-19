# HabitUs — Plano de UI/UX

Legenda: **[VALIDAR]** = decisão de produto ou implementação que ainda precisa de aval da equipe ou do professor.

---

## 1. Mapa de navegação e fluxos principais

### 1.1 Mapa do site

```text
Deslogado
 ├─ /cadastro
 ├─ /login
 └─ /convite/:codigo  (tela 15)

Logado (shell com navegação)
 ├─ Feed ............ /feed
 │    ├─ Nova postagem ... /feed/nova          (modal/tela cheia)
 │    ├─ Detalhe ......... /post/:id
 │    └─ Busca @usuário .. (campo no topo; resultado abre perfil)
 ├─ Hoje ............ /hoje
 │    └─ Criar/editar hábito ... /habitos/novo, /habitos/:id/editar
 ├─ Grupos .......... /grupos
 │    ├─ Criar grupo ......... /grupos/novo
 │    └─ Grupo ............... /grupos/:id  (abas: Feed | Ranking | Atividades | Membros)
 │         ├─ Postar conclusão ... /grupos/:id/postar
 │         ├─ Gerenciar (dono) ... /grupos/:id/gerenciar
 │         └─ Sair do grupo ...... (diálogo de confirmação)
 └─ Perfil .......... /perfil  e  /u/:usuario  (mesmo layout)
      └─ Editar perfil ... /perfil/editar
```

Quatro destinos de primeiro nível: **Feed, Hoje, Grupos, Perfil**.

**[VALIDAR]** Tela inicial após o login: **Hoje** ou **Feed**. Recomendação: Hoje para quem já tem hábitos e o estado “Criar primeiro hábito” para quem ainda não tem.

### 1.2 Fluxos principais

**A. Cadastro → primeiro hábito**
1. Cadastro (nome, @usuário, e-mail, senha) → erros inline por campo (“Este @usuário já está em uso”, “Este e-mail já tem cadastro. Entrar?”).
2. Após o cadastro, abrir a tela inicial definida pela equipe. Se a escolha for **Hoje**, mostrar o estado vazio com um único CTA grande “Criar meu primeiro hábito” e quatro sugestões rápidas (Beber água, Caminhar, Ler 10 min, Estudar) que preenchem o formulário.
3. Criar hábito (nome, categoria, frequência) → voltar para Hoje com o hábito listado e o aviso curto: “Marque quando cumprir. Sua sequência começa hoje.”
4. Sem tutorial longo: o onboarding é o estado vazio.

**B. Marcar o hábito do dia**
1. Hoje → toque no círculo grande do cartão.
2. Hábito diário ou em dias específicos: estado marcado com cor, ícone de check, sequência atualizada e texto “Feito hoje”.
3. Hábito “X vezes por semana”: atualizar o progresso da semana (por exemplo, 2/3). Ao atingir a meta semanal, a sequência aumenta pela quantidade definida na meta (meta 3 = +3); não se contam “semanas consecutivas”.
4. Toque de novo desmarca enquanto o registro ainda pertence ao dia atual.
5. À meia-noite, o dia fecha e fica travado.
6. Se a semana terminar abaixo da meta, a sequência do hábito semanal volta a zero.

**C. Criar grupo → convidar → postar conclusão → ranking**
1. Grupos → “Criar grupo” → formulário (nome, categoria, datas, descrição, atividades e pontos).
2. Ao salvar, ir direto para a página do grupo com um banner “Grupo criado! Convide pessoas” e link de convite com botão Copiar, sempre visível no cabeçalho enquanto o grupo aceitar entradas.
3. Membro entra pelo convite → aba Feed vazia com CTA “Postar conclusão”.
4. Postar conclusão: atividade (mostra “+5 pts”), foto, texto → confirmar → o feed mostra a postagem e a aba Ranking atualiza.
5. Postar uma conclusão não marca nenhum hábito da área Hoje.
6. Se o autor ou o dono excluir a postagem de conclusão, os pontos concedidos por ela são descontados da pessoa.
7. Ranking: o usuário vê sua linha destacada e fixa na base no mobile.

**D. Entrar por convite**
1. Link → resolver o estado descrito na tela 15.
2. Se estiver logado e elegível: “Entrar no grupo” → página do grupo, aba Feed.
3. Se estiver deslogado: login/cadastro preservando `?voltar=/convite/:codigo`; o conteúdo exibido antes do login depende da decisão sobre a prévia pública.
4. Pessoa removida pelo dono permanece bloqueada e não pode voltar.
5. Pessoa que saiu por conta própria pode usar o mesmo link para entrar novamente, desde que o grupo ainda aceite membros.

**E. Sair do grupo**
1. Membro comum: confirma a saída, perde seus pontos no ranking e pode retornar depois pelo link.
2. Dono com outros membros: o diálogo informa quem será o novo dono; ao confirmar, a propriedade passa ao membro que entrou primeiro.
3. Dono como único membro: o diálogo informa que sair também excluirá o grupo.

---

## 2. Navegação sugerida

| Breakpoint | Padrão | Conteúdo |
|---|---|---|
| Mobile (< 768px) | **Barra inferior** com quatro destinos; ação central depende da decisão pendente | Hoje, Feed, Grupos, Perfil e, se aprovada, ação “+” |
| Tablet (768–1023px) | Trilho lateral só com ícones (72px) | Mesmos destinos; rótulo ao lado do ícone ativo |
| Desktop (≥ 1024px) | **Menu lateral** fixo (240px) + conteúdo central (máx. 680px) + coluna direita opcional | Logo, quatro destinos, ação de postagem conforme decisão e busca no topo |

**Justificativa**
- Barra inferior: alcance do polegar e quatro destinos sem menu hambúrguer.
- Menu lateral no desktop: aproveita a largura e mantém rótulos escritos, melhores que ícones isolados.
- A coluna direita do desktop mostra somente **Hábitos de hoje**. Não há mini-ranking global, porque o ranking só faz sentido no contexto de um grupo definido.
- Mesma ordem de destinos em todos os breakpoints, para o modelo mental não mudar.
- Implementação simples: uma estrutura de navegação com CSS responsivo e rotas idênticas.

**Decisões**
- **[VALIDAR]** Ação principal: botão “+” central abrindo “Nova postagem” e “Novo hábito” ou botões contextuais dentro de cada tela. Postar conclusão permanece dentro do grupo.
- Busca de usuários: campo fixo no topo do Feed; no mobile, botão de lupa expande o campo. Não é item da navegação.
- Abas do grupo: mobile = abas roláveis sob o cabeçalho; desktop = abas no topo do conteúdo. Todas viram URLs (`?aba=ranking`) para permitir link e botão voltar.
- Título da página sempre visível e botão “Voltar” nas telas de segundo nível.

---

## 3. Wireframes de baixa fidelidade

Convenções: `[ ]` campo, `( )` botão, `●` marcado, `▢` imagem, `AV` avatar com iniciais. Todos usam coluna única no mobile; mudanças no desktop são descritas abaixo de cada tela.

### 3.1 Cadastro

```text
HabitUs (logo)
Crie sua conta
Mantenha seus hábitos, com gente do seu lado.
[Nome completo         ]
[@usuário              ]  ajuda: letras, números e _
[E-mail                ]
[Senha            (ver)]  ajuda: mínimo 8 caracteres
(Criar conta)             largura total, 48px
Já tem conta? Entrar
```

Erros: texto abaixo do campo, ícone, cor e mensagem — nunca apenas cor. Verificação de @usuário ao sair do campo. Desktop: card de 420px centralizado, com painel de ilustração ou frase à esquerda.

### 3.2 Login

```text
Entrar
[E-mail ou @usuário   ]
[Senha           (ver)]
(Entrar)
Não tem conta? Criar conta
```

Erro genérico: “E-mail/usuário ou senha incorretos”, sem revelar qual campo falhou. Não mostrar “Esqueci a senha” nem alternativa de recuperação, pois recuperação de senha está fora do escopo.

### 3.3 Feed

```text
[Buscar @usuário                         ]
── resultado: lista de AV + nome + @user ──
┌ CARD DE POSTAGEM ──────────────────────┐
│ AV Nome · @user · há 2 h               │
│ [Leitura] Hábito: Ler 20 min           │
│ Texto da postagem...                   │
│ ▢ imagem (opcional)                    │
│ (Curtir) 12      (Comentar) 3          │
└────────────────────────────────────────┘
(Carregar mais)
```

Ordem: mais recente primeiro. Autor ou avatar abre perfil. Curtir alterna o estado e atualiza o contador. Comentar abre o detalhe com o campo focado. Busca sem resultado: “Nenhum @usuário encontrado”.

Desktop: coluna central e coluna direita somente com **Hábitos de hoje**.

### 3.4 Nova postagem

```text
← Nova postagem
Sobre qual hábito? [Selecione um hábito ▾]   obrigatório
[Escreva algo que puxe os outros...     ]   obrigatório, contador
(Adicionar imagem)  ▢ prévia  (Remover)

Informação:
Postar não marca o hábito como cumprido.
Para registrar, vá em Hoje. (Ir para Hoje)

(Publicar)  desabilitado até o formulário ser válido
```

O aviso fica em caixa informativa visível acima do botão, não em tooltip. Sem hábitos: estado vazio com “Crie um hábito para postar”. Publicar nunca marca o hábito e não gera sugestão posterior para marcá-lo.

### 3.5 Detalhe da postagem

```text
← Postagem
[CARD DE POSTAGEM completo]  (menu: Excluir, só autor)
Comentários (3)
 AV Nome @user · 1 h   texto
 AV ...
[Escreva um comentário] (Enviar)   fixo na base no mobile
```

Sem editar. Comentários em ordem cronológica. Estado vazio: “Seja a primeira pessoa a comentar”.

Confirmações de exclusão:
- Postagem comum do Feed, pelo autor: “Excluir esta postagem? Não dá para desfazer.”
- Postagem de conclusão, pelo autor: “Excluir esta conclusão? Os pontos recebidos por ela serão descontados do seu ranking. Não dá para desfazer.”
- Postagem de conclusão, pelo dono do grupo: “Excluir a conclusão de [nome]? Os pontos recebidos por ela serão descontados do ranking da pessoa. Não dá para desfazer.”

### 3.6 Hoje / meus hábitos

```text
Hoje · terça, 13 de outubro
Resumo: 2 de 4 feitos

┌ CARD DE HÁBITO ────────────────────────┐
│ (○)  Correr 30 min        [Esportes...]│
│      Sequência: 5 dias                 │
└────────────────────────────────────────┘

┌ CARD DE HÁBITO ────────────────────────┐
│ (●)  Ler 20 min           [Leitura]    │
│      Feito hoje · Sequência: 12 dias   │
└────────────────────────────────────────┘

┌ HÁBITO SEMANAL ────────────────────────┐
│ (○)  Academia             [Esportes...]│
│      Esta semana: 2/3  [■■□]           │
│      Sequência: 6 conclusões           │
│      Ao atingir 3/3: +3 na sequência   │
└────────────────────────────────────────┘

(Novo hábito)
```

- Marcar: círculo de 48px; desmarcar com o mesmo toque e feedback “Desfeito” por 5 segundos.
- Hábito de dias específicos que não cai no dia atual: fica em “Não é hoje”, recolhido e sem ação de marcar.
- Toque no corpo do cartão abre a edição do hábito.
- Para frequência diária ou em dias específicos, a sequência representa cumprimentos consecutivos previstos pela frequência.
- Para “X vezes por semana”, a sequência representa a quantidade acumulada de cumprimentos creditados por semanas completas: ao cumprir a meta X/Y, soma X; se a semana terminar abaixo da meta, zera.
- O cartão semanal mantém a sequência anterior durante a semana em andamento e só soma ou zera quando a semana é fechada.
- Não há “Histórico 7 dias” no fluxo principal.

### 3.7 Criar/editar hábito

```text
← Novo hábito
[Nome do hábito       ]

Categoria
[Saúde]                 [Esportes e exercícios]
[Estudos]               [Leitura]
[Alimentação]           [Sono]
[Bem-estar mental]      [Finanças]
[Organização e prod.]   [Hobbies e criatividade]
[Outros]

[Descrição (opcional) ]

Frequência
( ) Todos os dias
( ) Dias da semana
    [7 chips de dias; ordem depende da decisão de início da semana]
( ) X vezes por semana
    [−] 3 [+]
    Ajuda: “Ao cumprir 3/3 na semana, sua sequência aumenta em 3.
    Se a semana terminar abaixo da meta, ela volta a zero.”

(Salvar)
(Excluir hábito)  só na edição, vermelho, no fim da página
```

Categorias fixas do requisito:
1. Saúde
2. Esportes e exercícios
3. Estudos
4. Leitura
5. Alimentação
6. Sono
7. Bem-estar mental
8. Finanças
9. Organização e produtividade
10. Hobbies e criatividade
11. Outros

Para exibir os 11 chips sem poluir, usar **grade responsiva**: duas colunas no mobile e três no desktop, largura total e seleção única. Textos longos podem ocupar duas linhas; não truncar o significado. A grade é preferível à rolagem horizontal porque mantém todas as opções descobríveis e evita esconder categorias.

Excluir: diálogo “Excluir ‘Ler 20 min’? Isso apaga os registros e a sequência. Não existe pausa.” Botões Cancelar/Excluir. O seletor de frequência é um grupo de rádio com conteúdo condicional. O limite válido de X deve ser coerente com uma semana (1 a 7).

### 3.8 Perfil (meu e de outros, mesmo layout)

```text
AV (grande)  Nome
             @usuario
             Descrição curta...
             (Editar perfil)  só no meu

┌ QUADRO-RESUMO ────────────────────────┐
│ Hábitos ativos │ Grupos               │
│      4         │   2                  │
│ Atividades feitas                     │
│      37                               │
└───────────────────────────────────────┘

Hábitos
 [Card compacto: nome · categoria · sequência atual]

Postagens
 [CARD DE POSTAGEM] ...
```

O quadro não mostra “melhor sequência”, pois esse dado não faz parte dos requisitos atuais. Perfil de outras pessoas: sem botão de editar e sem ações de hábito, somente leitura. Desktop: cabeçalho à esquerda e duas colunas (Hábitos | Postagens). Vazio: “Ainda não há postagens”. Sair da conta: no fim do meu perfil ou no menu do cabeçalho.

### 3.9 Editar perfil

```text
← Editar perfil
[Nome]
[@usuário]  erro: já em uso
[Descrição 0/160]
(Salvar)  (Cancelar)
```

Sem foto: o avatar com iniciais atualiza ao vivo.

### 3.10 Meus grupos

```text
Grupos                              (Criar grupo)

Em andamento
 ┌ Corrida de Outubro [Esportes...] ● Em andamento ┐
 │ 12 membros · termina em 9 dias · Você: 3º       │

Não iniciado
 ┌ ... ○ Começa em 3 dias                           ┐

Encerrado
 ┌ ... ■ Encerrado · Você: 2º                       ┐
```

Status com texto, ícone e cor. Ordenação: em andamento, não iniciado, encerrado. Vazio: “Você ainda não está em nenhum grupo. Crie um ou entre por um link de convite.”

### 3.11 Criar grupo

```text
← Criar grupo
[Nome]

Categoria
[grade responsiva com as mesmas 11 categorias do hábito]

[Início: data]
[Fim: data]
[Descrição (opcional)]

Atividades e pontos
[Nome da atividade] [pts: − 5 +] (Remover)
(Adicionar atividade)   mínimo 1 · pontos de 1 a 10

Resumo: “Cada conclusão concede os pontos definidos para a atividade.”
(Criar grupo)
```

O seletor de categoria reutiliza a grade de duas colunas no mobile e três no desktop. Pontos: seletor numérico com menos e mais, evitando erro de digitação e com alvo mínimo de 44px. Validações inline: fim posterior ao início e ao menos uma atividade. Usar `input type="date"` nativo.

### 3.12 Página do grupo

```text
← Grupos
Corrida de Outubro [Esportes...] ● Em andamento
01/10 → 31/10 · 12 membros · (Gerenciar)  só dono
Convite: habitus.app/convite/K7X2  (Copiar) → “Link copiado”
[Feed | Ranking | Atividades | Membros]
(Postar conclusão)  só membro e grupo ativo
```

- **Feed**: cards de conclusão com AV, atividade, “+5 pts”, foto e texto. Só membros veem. Vazio: “Nenhuma conclusão ainda. Seja a primeira pessoa.”
- O autor pode excluir sua própria conclusão; o dono pode excluir qualquer conclusão. Nos dois casos, o diálogo avisa que os pontos correspondentes serão descontados.
- **Ranking**: `1º  AV Nome  @user  120 pts`. Empates: 1º, 1º, 2º. Linha do usuário destacada. Medalhas discretas apenas nos três primeiros; texto da posição sempre presente.
- **Atividades**: lista com nome e pontos, mais “Feito hoje” para o usuário quando aplicável.
- **Membros**: lista com AV, nome, @user e selo “Dono”; toque abre perfil. Para o dono, cada outro membro tem a ação Remover. O rodapé sempre oferece “Sair do grupo”, inclusive ao dono.
- Ao remover alguém, confirmar: “Remover [nome]? Essa pessoa perderá os pontos no ranking e ficará bloqueada permanentemente, sem poder voltar pelo convite.”
- Quem sai por conta própria perde os pontos atuais, mas pode voltar pelo link enquanto o grupo aceitar membros.
- Se o dono sair com outras pessoas no grupo, a propriedade passa ao membro remanescente que entrou primeiro.
- Se o dono for o único membro, sua saída exclui o grupo.

Desktop: conteúdo do grupo pode usar duas colunas dentro da própria página quando houver espaço, mas não adiciona um mini-ranking global. O ranking completo continua identificado e acessível pela aba Ranking.

### 3.13 Postar conclusão

```text
← Postar conclusão · Corrida de Outubro
Atividade  ( ) Correr 5 km      +5 pts
           ( ) Alongar          +2 pts
           (x) Treino de força  +8 pts  [Já feita hoje]

Foto obrigatória
(Tirar/escolher foto)  ▢ prévia
[Texto (opcional)]

Você vai ganhar +5 pts
(Publicar conclusão)
```

Bloqueio: atividade já feita hoje fica cinza com “Já feita hoje, volte amanhã”. Sem foto, o botão fica desabilitado com a ajuda “Adicione uma foto”. Se todas estiverem bloqueadas: “Você completou tudo hoje.” Usar `input type="file" accept="image/*" capture` no mobile quando suportado.

Publicar a conclusão atualiza o feed e o ranking do grupo, mas nunca marca um hábito na área Hoje.

### 3.14 Gerenciar grupo (dono)

**Grupo não encerrado**

```text
← Gerenciar grupo

Atividades e pontos  [editar/remover/adicionar]
  Informação: nova pontuação vale dali em diante;
  pontos antigos não mudam.

Data final [data]

Membros
 AV Nome (Remover)

Postagens de conclusão
 [postagem] (Excluir)

Zona de perigo
(Excluir grupo)  exige digitar o nome do grupo
```

- Remover membro: “Remover Ana? Ela perderá os pontos e ficará bloqueada permanentemente. Não poderá voltar pelo convite.”
- Excluir conclusão: “Excluir a conclusão de Ana? Os pontos recebidos por ela serão descontados do ranking. Não dá para desfazer.”
- O dono pode ajustar a data final respeitando as validações de data.

**Grupo encerrado**

```text
← Gerenciar grupo encerrado

Grupo encerrado em 31/10.

Data final [data]
Ajuda: “Defina uma nova data. O efeito de uma data futura
depende da regra de reabertura aprovada.”

Zona de perigo
(Excluir grupo)  exige digitar o nome do grupo
```

No estado encerrado, atividades, pontos, membros e postagens permanecem somente leitura nessa tela. O dono ainda pode alterar a data final e excluir o grupo.

**[VALIDAR]** Comportamento recomendado: se o dono alterar a data final de um grupo encerrado para uma data futura, o grupo **reabre automaticamente**, preserva membros, feed, ranking e pontos, volta a aceitar convites e conclusões até a nova data e deixa de exibir o ranking como “final”. Se a nova data continuar no passado, o grupo permanece encerrado. A confirmação deve dizer: “Ao salvar esta nova data, o grupo será reaberto e voltará a aceitar conclusões e entradas pelo convite.”

### 3.15 Convite por link

Cartão central em todos os casos, com ícone, título e uma ação principal:

| Estado | Título | Ação |
|---|---|---|
| Válido, logado | “Convite para **Corrida de Outubro**” (dono, nº de membros, datas) | (Entrar no grupo) |
| Deslogado | Conteúdo depende da decisão de prévia pública | (Entrar para participar) → login → volta; link “Criar conta” |
| Já é membro | “Você já participa” e redirecionamento curto | (Ir para o grupo) imediato |
| Saiu por conta própria | “Você já participou deste grupo e pode entrar novamente” | (Entrar novamente) |
| Código inválido | “Convite não encontrado” e “Confira o link com quem convidou” | (Ir para o início) |
| Removido pelo dono | “Você não pode entrar neste grupo” | (Ver meus grupos) |
| Grupo encerrado | “Este grupo já terminou e não aceita novas pessoas” | (Ver meus grupos) |

**[VALIDAR]** Mostrar nome, dono, número de membros e datas para pessoas deslogadas, o que ajuda a conversão mas expõe informações do grupo, ou mostrar apenas “Você foi convidado para um grupo no HabitUs”.

### 3.16 Sair do grupo

Diálogo modal, apresentado como bottom sheet no mobile, com três variantes:

**1. Membro comum**

> **Sair de Corrida de Outubro?**  
> Seus pontos serão apagados do ranking. Você poderá entrar novamente pelo link de convite enquanto o grupo aceitar membros.

Botões: (Cancelar) (Sair do grupo, destrutivo).

**2. Dono com outros membros**

> **Sair de Corrida de Outubro?**  
> Seus pontos serão apagados. **[Nome do membro que entrou primeiro]** será o novo dono do grupo. Você poderá entrar novamente pelo link de convite enquanto o grupo aceitar membros.

Botões: (Cancelar) (Sair e transferir grupo, destrutivo).

**3. Dono como único membro**

> **Sair de Corrida de Outubro?**  
> Você é a única pessoa no grupo. Ao sair, o grupo e todo o seu conteúdo serão excluídos permanentemente.

Botões: (Cancelar) (Sair e excluir grupo, destrutivo).

### 3.17 Grupo encerrado

Mesma página do grupo, com faixa no topo: “Grupo encerrado em 31/10. Ranking final salvo.”

- Botão Postar conclusão ausente.
- Link de convite substituído por “Convites encerrados”.
- Ranking com pódio sóbrio, top 3 em destaque e posição final do usuário.
- Feed continua legível.
- Para o dono, **Gerenciar** continua disponível com duas possibilidades: alterar a data final ou excluir o grupo.
- Ao abrir Gerenciar, explicar que atividades, pontos, membros e postagens estão em modo somente leitura enquanto o grupo estiver encerrado.
- **[VALIDAR]** Se a nova data for futura, aplicar ou não a reabertura automática proposta na tela 3.14.

---

## 4. Estados de interface

| Estado | Padrão visual | Texto (PT-BR) |
|---|---|---|
| **Vazio – sem hábitos** | Ilustração simples + CTA primário | “Seu primeiro hábito começa aqui” / (Criar hábito) |
| **Vazio – sem grupos** | Ícone + dois CTAs | “Nenhum grupo ainda. Crie um ou entre por um convite.” |
| **Vazio – sem postagens** | Ícone + CTA contextual | “Nada por aqui ainda. Compartilhe sua primeira conquista.” |
| **Carregando** | Skeleton com a forma do card; botões mostram indicador e ficam desabilitados | Leitor de tela: “Carregando…” (`aria-busy`) |
| **Erro de rede** | Cartão inline com ícone + botão | “Não foi possível carregar.” / (Tentar de novo) |
| **Erro de formulário** | Mensagem por campo + resumo no topo | “Corrija os campos destacados.” |
| **Exclusão de hábito, post ou grupo** | Diálogo com foco preso; botão destrutivo à direita, vermelho, texto específico | “Excluir ‘X’? Não dá para desfazer.” |
| **Exclusão de conclusão** | Diálogo explicita impacto no ranking | “Os pontos desta conclusão serão descontados da pessoa.” |
| **Sequência diária perdida** | Card em tom neutro; sequência volta a 0; mensagem encorajadora uma vez | “Sua sequência de 12 dias terminou. Recomeçar hoje vale muito.” |
| **Meta semanal perdida** | Card em tom neutro após o fechamento da semana; sequência volta a 0 | “A semana terminou em 2/3 e sua sequência voltou a zero. Você pode recomeçar nesta semana.” |
| **Sucesso** | Toast curto (4 s), `aria-live="polite"` | “Hábito salvo”, “Link copiado” |
| **Offline/sem permissão** | Faixa no topo | “Você está sem conexão.” |

Tom da sequência perdida: sem culpa e sem tela bloqueante. Para hábito semanal, não usar “semanas consecutivas”; sempre comunicar o progresso X/Y e a consequência de não alcançar a meta.

---

## 5. Componentes reutilizáveis

| Componente | Anatomia e variações | Usado em |
|---|---|---|
| **Avatar de iniciais** | Círculo; duas letras; cor derivada do @usuário, com seis tons e contraste ≥ 4,5:1; tamanhos 32/40/64 | Feed, comentários, ranking, membros, perfil |
| **Chip de categoria** | Ícone opcional + texto, altura mínima de 32px; uma cor por categoria; variante selecionável em grade responsiva | Hábito, post, grupo |
| **Grade de categorias** | 11 chips, seleção única; duas colunas no mobile e três no desktop; textos longos podem quebrar linha | Criar/editar hábito, criar grupo |
| **Card de postagem** | Cabeçalho, avatar, nome, @user, tempo, chip do hábito, texto, imagem e barra de ações. Variantes: feed, detalhe e conclusão com selo “+N pts” | Feed, perfil, grupo |
| **Botão de curtir** | Alternância, `aria-pressed`, contador e alvo de 44px | Cards |
| **Card de hábito** | Botão circular, nome, categoria, sequência e, quando semanal, progresso X/Y e ganho +X ao cumprir | Hoje, perfil compacto |
| **Indicador de sequência** | Hábito diário/dias específicos: “N dias”; hábito semanal: “N conclusões”, nunca “N semanas” | Card de hábito, perfil |
| **Linha de ranking** | Posição, avatar, nome/@ e pontos; variantes normal, “você” e top 3 | Grupo |
| **Quadro-resumo** | Grade responsiva de número + rótulo, apenas com dados exigidos | Perfil |
| **Seletor de frequência** | Rádio com três opções; conteúdo condicional para dias ou contador X | Criar hábito |
| **Seletor de dias** | Sete chips; ordem visual ainda não fixa até a decisão sobre início da semana | Criar/editar hábito |
| **Seletor de pontos** | Stepper − N +, de 1 a 10 | Criar grupo, gerenciar |
| **Campo com validação** | Rótulo visível, ajuda e erro com ícone | Todos os formulários |
| **Status do grupo** | Em andamento, não iniciado ou encerrado, sempre com ícone e texto além da cor | Grupos |
| **Link de convite** | Campo somente leitura + botão Copiar com feedback | Grupo |
| **Diálogo de confirmação** | Título, consequência e dois botões; sheet no mobile; variantes de exclusão e saída | Excluir/sair |
| **Estado vazio / skeleton / toast** | Padrões globais | Global |
| **Navegação responsiva** | Barra inferior ↔ lateral | Shell |

Observação de implementação: os padrões devem ser construídos em **HTML, CSS e JavaScript puros na entrega 1**, com Vite apenas como ferramenta de desenvolvimento e build. Na entrega 2, podem virar componentes React sem redesenho. Evitar drag-and-drop, gráficos complexos, modais aninhados e gestos como única forma de ação.

---

## 6. Direção visual

Princípios comuns: sem níveis ou elementos de RPG; pontos aparecem apenas no contexto dos grupos; um destaque de cor por tela; ilustração mínima; cantos de 12–16px; sombras suaves; foco em fotos e pessoas nas postagens. A entrega atual prioriza modo claro; modo escuro fica fora do escopo imediato.

### Proposta A — “Brasa” (calor humano, recomendada)
- Paleta: fundo creme `#FBF7F2`, texto `#1F1A17`, primária terracota `#C2410C`, apoio verde-musgo `#3F6B4F`, neutros quentes `#E8E0D6`, alerta `#B42318`.
- Tipografia: títulos **Fraunces** ou DM Serif Display; texto **Inter** ou Nunito Sans. Números tabulares no ranking.
- Tom: acolhedor, humano, “pessoas ao redor da mesa”. Textos curtos e calorosos, como “Bom ver você de volta”.
- Risco: a serifa pode parecer editorial; manter apenas em títulos.

### Proposta B — “Maré” (calma e clareza)
- Paleta: fundo `#F5F8FA`, texto `#0F172A`, primária azul-petróleo `#0F766E`, destaque coral `#E4572E` apenas para sequência, superfícies brancas.
- Tipografia: **Plus Jakarta Sans** nos títulos e **Inter** no texto.
- Tom: sereno, focado e produtivo, próximo de apps de saúde e estudo.
- Risco: pode ficar frio; compensar com fotos e avatares coloridos.

### Proposta C — “Quadra” (energia esportiva, sóbria)
- Paleta: fundo `#F7F7F5`, texto `#111111`, primária preto/grafite com acento amarelo-limão `#D4F23A` usado apenas em fundos, e apoio azul-cobalto `#2447D6`.
- Tipografia: **Space Grotesk** ou **Archivo** nos títulos e **Inter** no texto.
- Tom: atlético, direto, competitivo e amigável, com referência a Strava e Nike.
- Risco: pode afastar quem pratica hábitos de estudo ou leitura; a competição pode se sobressair.

**Recomendação:** Proposta A para contemplar saúde, estudos, leitura e comunidade. O ranking usa verde-musgo para destaque, evitando aparência infantil.

**[VALIDAR]** Escolher a proposta visual em reunião, idealmente comparando mocks equivalentes das telas Hoje e Ranking.

### Acessibilidade
- Contraste: texto ≥ 4,5:1; textos grandes e ícones ≥ 3:1. Nunca transmitir estado apenas por cor.
- Alvos de toque ≥ 44×44px, espaçamento ≥ 8px entre alvos e botão de marcar hábito com 48px.
- Foco visível, ordem de tabulação lógica, `aria-pressed` em curtir e marcar, `aria-live` para toasts e `aria-current` na navegação.
- Texto base de 16px, escalável; layout sem rolagem horizontal da página até 320px; respeitar `prefers-reduced-motion`.
- Imagens do usuário com texto alternativo, por exemplo, “Foto de conclusão de [atividade]”.
- Formulários com rótulos visíveis, `autocomplete` correto, `type="email"` e teclado numérico quando cabível.
- Diálogos com foco preso, fechamento por Esc e retorno de foco ao gatilho.
- Datas em formato brasileiro (`dd/mm/aaaa`).
- **[VALIDAR]** Início da semana no domingo ou na segunda. Até a decisão, não fixar a ordem dos chips de dias nem textos que deem a entender uma das opções.

---

## 7. Quadro de referências por tela

| Tela | Referência | Adotar | Evitar |
|---|---|---|---|
| **1–2 Cadastro e Login** | Discord, WhatsApp | Formulário curto, um campo por linha, erros claros e login com campo único | Captcha, cadastro em várias etapas, recuperação de senha fora do escopo |
| **3 Feed** | Instagram, Strava | Cards em coluna única, autor clicável, barra de ações simples e busca no topo | Reações múltiplas, rolagem infinita sem fim, stories, algoritmos |
| **4 Nova postagem** | Instagram, Strava | Escolha do hábito antes do texto, prévia da imagem e aviso de que postar não marca | Filtros de foto, edição pesada, sugestão para marcar hábito depois |
| **5 Detalhe do post** | Instagram, Strava | Comentários simples, campo fixo e consequência explícita ao excluir conclusão | Respostas aninhadas, menções, edição |
| **6 Hoje / hábitos** | Streaks, Loop Habit Tracker, Duolingo | Marcação em um toque, sequência visível e progresso X/Y | Histórico de 7 dias, penalidades, notificações, mascotes e culpa |
| **7 Criar/editar hábito** | Streaks, Loop Habit Tracker | Frequência clara, sugestões iniciais, grade de categorias e chips de dias | Lembretes, metas avançadas e categoria em carrossel pouco descobrível |
| **8 Perfil** | Strava, Habitica | Resumo enxuto, lista de hábitos e postagens | Melhor sequência, gráficos densos, RPG, seguidores |
| **9 Editar perfil** | Instagram | Formulário curto e avatar de iniciais ao vivo | Foto, links, múltiplas seções |
| **10 Meus grupos** | Strava Clubs, Nike Run Club | Cartões com status, membros e posição | Diretório público e recomendações |
| **11 Criar grupo** | Strava Clubs, Fitbit | Formulário direto, atividades editáveis e categorias em grade | Wizard longo, regras complexas, bônus |
| **12 Página do grupo** | Strava Clubs, Fitbit | Abas claras, ranking identificado, convite e destaque da própria linha | Mini-ranking global sem grupo, troféus exagerados, confete |
| **13 Postar conclusão** | Strava, Nike Run Club | Pontos antes de publicar, foto como prova e bloqueio claro | Marcar hábito automaticamente, métricas avançadas, múltiplas atividades |
| **14 Gerenciar grupo** | Discord, WhatsApp | Ações destrutivas separadas, bloqueio explícito e data final editável | Cargos e moderação fora do escopo |
| **15 Convite** | Discord, WhatsApp | Um botão, retorno pós-login e estados específicos | Erro genérico e permitir retorno de pessoa removida |
| **16 Sair do grupo** | WhatsApp, Discord | Três variantes com consequências e sucessão claras | Bloquear a saída do dono, dupla confirmação e culpa |
| **17 Grupo encerrado** | Fitbit, Nike Run Club | Ranking final, leitura mantida e acesso do dono à data final | Comemoração longa e ocultar a opção de alterar o prazo |
| **Navegação** | Instagram, Strava, Discord | Quatro destinos fixos e rótulos escritos | Menu hambúrguer escondendo o essencial |

---

## 8. Decisões do produto e pendências

### 8.1 Já fechadas

| Decisão | Regra aplicada | Origem |
|---|---|---|
| Sequência semanal | Em “X vezes por semana”, cumprir meta X soma X à sequência; terminar a semana abaixo da meta zera. Não contar semanas consecutivas. | Decisão da equipe nesta revisão |
| Exclusão de conclusão | Autor e dono podem excluir; os pontos concedidos pela conclusão são descontados da pessoa. | Decisão da equipe nesta revisão |
| Saída do dono | O dono pode sair. Com outros membros, o primeiro a ter entrado vira dono; sozinho, sua saída exclui o grupo. | Decisão da equipe nesta revisão |
| Retorno ao grupo | Pessoa removida pelo dono fica bloqueada permanentemente; quem sai por vontade própria pode voltar pelo link. | Decisão da equipe nesta revisão |
| Categorias | Usar as 11 categorias oficiais: Saúde; Esportes e exercícios; Estudos; Leitura; Alimentação; Sono; Bem-estar mental; Finanças; Organização e produtividade; Hobbies e criatividade; Outros. | Requisito do produto |
| Relação postagem × hábito | Postar, inclusive uma conclusão no grupo, nunca marca hábito e não gera sugestão para marcá-lo. | Requisito do produto |
| Coluna direita | No desktop, mostrar apenas Hábitos de hoje; não usar mini-ranking global. | Correção de UX desta revisão |
| Login | Não oferecer recuperação de senha nem texto alternativo de suporte para recuperá-la. | Restrição de escopo |
| Histórico e recorde | Histórico de 7 dias e melhor sequência não entram no fluxo atual. | Fora dos requisitos |
| Entrega 1 | Somente JavaScript, JSON, HTML/CSS e Vite; sem React e sem Tailwind. | Requisito acadêmico |
| Entrega 2 | React + Supabase, reaproveitando arquitetura visual e fluxos. | Requisito acadêmico |
| Outras restrições | Interface mobile-first em português (BR), sem notificações, lembretes, edição de posts, seguir usuários ou foto de perfil. | Requisitos do produto |

### 8.2 Pendências reais

1. **[VALIDAR] Início da semana:** domingo ou segunda. Até decidir, o seletor de dias não fixa a ordem e a lógica semanal deve tratar o início como configuração.
2. **[VALIDAR] Tela inicial após login:** Hoje ou Feed. Recomendação: Hoje, com estado de primeiro hábito.
3. **[VALIDAR] Ação principal:** botão “+” central ou botões contextuais dentro das telas.
4. **[VALIDAR] Convite deslogado:** mostrar prévia do grupo ou apenas a mensagem genérica de convite.
5. **[VALIDAR] Proposta visual:** A — Brasa, B — Maré ou C — Quadra. Recomendação: Brasa.
6. **[VALIDAR] Extensão do prazo após encerramento:** confirmar se uma nova data futura reabre o grupo automaticamente. Recomendação: reabrir, preservando conteúdo, membros e pontos e retomando convites e conclusões.
7. **[VALIDAR COM O PROFESSOR] Uso do JSON na entrega 1:** esclarecer se o JSON será apenas carga inicial estática, se deve simular uma API ou se há uma forma exigida de persistência. Um app executado só no navegador não grava alterações de volta no arquivo JSON do projeto.
8. **[VALIDAR COM O PROFESSOR] Fotos sem servidor na entrega 1:** esclarecer o meio aceito para armazenamento e avaliação das imagens. `localStorage` tem limite aproximado de 5 MB por origem e não é adequado para várias fotos.

---

## 9. Viabilidade técnica (entregas 1 e 2)

### 9.1 Entrega 1 — JavaScript, JSON e Vite

- Implementar o protótipo, se solicitado, em **HTML, CSS e JavaScript puros**, sem React e sem Tailwind.
- Usar Vite apenas para desenvolvimento, módulos e build.
- Organizar a interface em funções/módulos JavaScript reutilizáveis, por exemplo: renderização de cards, diálogos, navegação, validações e acesso aos dados.
- Rotas podem usar hash (`#/hoje`, `#/grupos/1`) para evitar configuração de fallback no servidor acadêmico.
- Estruturar dados em objetos compatíveis com JSON para facilitar a migração posterior.
- A persistência definitiva depende da resposta do professor sobre o papel do JSON. Como solução provisória, o JSON pode alimentar dados iniciais e o `localStorage` guardar alterações locais, deixando claro que o navegador não reescreve o arquivo JSON do projeto.

**Fotos na entrega 1**
- Não salvar a imagem original diretamente como data URL: a codificação base64 aumenta o tamanho e pode ultrapassar rapidamente o limite aproximado de 5 MB do `localStorage`.
- Antes de salvar, carregar a imagem em `canvas`, corrigir sua orientação quando necessário, limitar a maior dimensão (proposta: 1200px) e comprimir em JPEG ou WebP (qualidade inicial proposta: 0,7).
- Definir limite por arquivo comprimido (proposta: 300 KB) e limite total reservado às imagens (proposta: 3 MB), rejeitando ou recomprimindo quando excedido.
- Mostrar mensagem clara: “A foto ficou grande demais. Escolha outra ou tente uma imagem com menor resolução.”
- Manter somente a versão comprimida e remover os dados da foto quando a postagem correspondente for excluída.
- Esses valores e o próprio uso de `localStorage` são provisórios e dependem das respostas do professor sobre **como usar o JSON** e **como armazenar fotos sem servidor**.

### 9.2 Entrega 2 — React + Supabase

- Migrar os mesmos padrões para componentes React, sem alterar os fluxos aprovados.
- Usar Supabase Auth com e-mail e senha.
- Estrutura de dados sugerida: `users`, `habits`, `checkins`, `posts`, `comments`, `likes`, `groups`, `activities`, `memberships` e `completions`.
- Registrar em `memberships` a data/hora de entrada para determinar, de forma estável, o novo dono quando o dono atual sair.
- Registrar bloqueio permanente de membro removido, separando-o de uma saída voluntária.
- Ao excluir uma conclusão, executar a exclusão e o desconto de pontos de forma atômica no banco.
- Usar Supabase Storage para imagens e RLS para garantir que apenas membros vejam o feed do grupo.
- Para grupo encerrado, a regra aprovada de extensão de prazo deve controlar status, convites e permissão de novas conclusões.

### 9.3 Limites de escopo

- Evitar tempo real, drag-and-drop, edição de imagem pelo usuário, mapas e gestos obrigatórios.
- Usar paginação explícita por “Carregar mais”.
- Não implementar notificações, lembretes, edição de postagens, seguir usuários, recuperação de senha nem fotos de perfil.

## Verificação deste plano

- Percorrer os fluxos da seção 1 e confirmar que cada uma das 17 telas tem entrada, saída e estados relevantes.
- Confirmar nos wireframes que hábitos semanais somam X ao cumprir X/Y e zeram ao fechar a semana abaixo da meta.
- Confirmar que toda exclusão de conclusão informa o desconto de pontos.
- Testar as três variantes de saída: membro comum, dono com outros membros e dono sozinho.
- Confirmar que remoção pelo dono bloqueia retorno e saída voluntária permite retorno por link.
- Conferir as 11 categorias nas telas de hábito e grupo e verificar a grade em 320px sem rolagem horizontal da página.
- Conferir o grupo encerrado e seu Gerenciar nos dois cenários pendentes: permanece encerrado ou reabre após extensão.
- Checar as restrições: nada de notificação, lembrete, edição de post, seguir, recuperação de senha ou foto de perfil.
- Validar contraste das paletas em um verificador, com alvo de 4,5:1, antes de fixar a proposta.
- Na entrega 1, testar compressão, limite por foto, limite total e mensagens de falha no navegador-alvo, depois de alinhar a estratégia com o professor.
- Se houver protótipo na entrega 1, verificar que ele usa somente HTML, CSS e JavaScript puros com Vite, sem React e sem Tailwind.

## Futuro — fora do escopo atual

- **Histórico de 7 dias na tela Hoje:** considerar apenas em versão futura, depois de validar utilidade e modelo de dados; não aparece nos fluxos ou wireframes atuais.
- **Melhor sequência por hábito:** considerar apenas em versão futura; exige persistir o recorde separadamente e não aparece no perfil, cards ou estados atuais.
- **Modo escuro:** possível evolução após a proposta visual e o modo claro estarem estabilizados.
