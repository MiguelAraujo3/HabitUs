# DESIGN.md — HabitUs (referência visual, só Grupos)

Fonte: export do Figma Make em `referencia-design/` (React, só referência).
Implementação: JS puro + Tailwind já instalado, ícones em SVG embutido (estilo Lucide: traço 2, sem preenchimento).
Onde esta spec e o sprint divergem, o SPRINT manda (8 páginas HTML; postar conclusão e ações do dono são JANELAS, não páginas).

## 1. Tokens
Cores: bg #f7f7f5 · surface #ffffff · surface-2 #f0f0ee · line #d7d7d3 · ink #171716 · ink-2 #62625f · black #050505
action #2563eb · action-press #1d4fc4 · action-tint #eaf0ff · lime #b7f52a · coral #f56f72 · coral-ink #9f252b
violet #a855d6 · violet-ink #743394 · cyan #35b8d0 · ok #167a4a · warn #f3c846 · warn-ink #6b5200 · closed #6b6b68
danger #b42318 · danger-tint #fdecea
Valores soltos do código (usar como estão): selo andamento fundo #e3f4ea texto ok · selo não iniciado fundo #fbf0c9 texto warn-ink
hover secundário #e6e6e3 · hover danger #f9dad6 · hover danger sólido #8f1c12 · hover botão preto #222
A CONFIRMAR no código antes de usar: #fde8e8, #1e3a8a (aviso informativo).
Raios: controle 10 · cartão 14 · grupo 18 · janela 22 · caixa do link 12. Sombra suave: 0 2px 12px rgb(0 0 0 / .06).
Fonte Inter 400/500/600/700 (Google Fonts, @import no base.css). Corpo 17/24. Números com `tabular-nums`.
Foco: outline 2px action, offset 2px. Clique: scale .98 (`.press`). Janela sobe 280ms cubic-bezier(.2,.8,.2,1). Respeitar prefers-reduced-motion.
Espaçamento lateral do conteúdo: 16px (celular), 24px (md), 32px (lg).

## 2. Navegação (Layout)
- Celular (< md): barra inferior fixa, borda superior line, fundo surface a 92% com blur, respeita safe-area. Sem menu lateral.
- md (≥768px): menu lateral fixo à esquerda, 72px, só ícones, borda direita line/70. Conteúdo com padding-left 72px.
- lg (≥1024px): o mesmo menu com 240px (ícone + texto). Conteúdo com padding-left 240px.
- Conteúdo: largura máx. 1060px centralizada; coluna principal máx. 680px, padding-bottom 112px no celular e 64px em md+.
- xl: coluna direita de 300px com "Hábitos de hoje" (FORA do escopo dos grupos; não implementar agora).
- O topo de cada tela tem cabeçalho com botão voltar + título (PageHeader).
## 3. Componentes comuns
- Botões: primário (action, texto branco), secundário (surface-2), ghost, perigo (danger-tint + texto danger), perigo sólido (danger + branco), preto. Altura mín. 44px, raio 10.
- Campo: rótulo acima, input com borda line, erro em texto danger abaixo; resumo de erros no topo do formulário.
- Chip de categoria (cores por categoria) e selo de status (Em andamento / Não iniciado / Encerrado).
- Estado vazio: ícone, título, texto, botão.
- Aviso (Notice): ícone + texto, tom info ou warn.
- Janela (sheet): fundo preto 40%, painel branco, máx. 460px, raio 22, colada embaixo no celular e centralizada em md+. Fecha por Cancelar, tecla Esc e clique no fundo; clicar dentro NÃO fecha.
- Avatar redondo com inicial (38–40px). Stepper de pontos (1 a 10).
## 4. Telas

### 4.1 Lista de grupos — grupos.html (S1-34, S1-35, S1-60)
1. Título "Grupos" + botão primário "Criar grupo" (ícone +) → criar-grupo.html.
2. Vazio: ícone Users, "Nenhum grupo ainda", "Você ainda não está em nenhum grupo. Crie um ou entre por um link de convite." + botão "Criar grupo".
3. Seções, nesta ordem, cada uma com título em caixa alta: "Em andamento", "Não iniciado", "Encerrado".
   Cartão (link → grupo.html?id=): nome (17/22 semibold, truncado); chip de categoria + selo de status;
   linha "X membros · Até DD MMM" (não iniciado: data de início; encerrado: data final); seta à direita.
   Sprint também pede a POSIÇÃO do usuário no cartão.
4. Entrar com link (S1-60): campo placeholder "Tenho um código de convite" + botão "Entrar". Aceita link colado ou código; leva a convite.html?codigo=.
   NÃO implementar o bloco "Protótipo · testar estados do convite" (é de teste do design).
### 4.2 Criar grupo — criar-grupo.html (S1-36, S1-37)
Cabeçalho "Criar grupo" com voltar → grupos.html. Resumo de erros no topo. Campos, em ordem:
1. "Nome do grupo" — texto, placeholder "Ex.: Movimento 30 Dias", obrigatório, mín. 3 letras. Erro: "Dê um nome ao grupo (mínimo 3 letras)."
2. "Categoria" — grade de chips das 11 categorias, obrigatório.
3. "Início" e "Fim" — dois campos date lado a lado, obrigatórios, Fim depois de Início.
4. "Descrição (opcional)" — textarea 3 linhas.
5. "Atividades e pontos" — lista de linhas, começa com 1 (pontos 3). Cada linha: texto (placeholder "Ex.: Treino de 30 min"), stepper de pontos 1–10, botão "Remover" (ícone lixeira, só aparece se houver mais de 1 linha).
   Botão ghost "Adicionar atividade" (+). Erro: "Adicione ao menos uma atividade com nome."
6. Botão primário largura total "Criar grupo". Ao salvar: aviso "Grupo criado. Compartilhe o convite!" e vai ao grupo criado.
   Datas: usar a data local do usuário, nunca data fixa.
### 4.3 Tela do grupo — grupo.html?id= (S1-39, S1-40)
1. Cabeçalho: voltar → grupos.html, título = nome do grupo. Se for dono: botão "Gerenciar" (ícone engrenagem) = MENU DO DONO (abre janela com as ações da seção 5).
2. Chip de categoria + selo de status; nome em 28/34 bold; descrição (se houver); linha com datas, nº de membros e meus pontos.
3. Caixa do link (some se encerrado): fundo surface, raio 12; texto com o código; botão secundário "Copiar" → copia o link e avisa "Link de convite copiado".
4. Situação:
    - Encerrado: aviso info "Grupo encerrado em DD MMM. Ranking final salvo. Convites encerrados."
    - Não iniciado: aviso warn "Este grupo começa em DD MMM. Você poderá postar conclusões a partir daí."
    - Em andamento: botão primário largura total "Postar conclusão" (ícone câmera) → abre a JANELA de postar (seção 5).
5. Abas (fixas ao rolar): "Feed", "Ranking", "Atividades", "Membros". Aba atual na URL (?aba=ranking).
    - Feed: vazio com "Nenhuma conclusão ainda" (encerrado: "Este grupo encerrou sem conclusões publicadas."); senão cartões de postagem (avatar, nome, atividade +pts, texto, foto, quando).
    - Ranking: lista numerada. Posição 1º/2º/3º em 20px bold, demais 16px ink-2; avatar 38; nome; selo "Você" no próprio usuário; pontos em 17 bold + "pts". Encerrado: título "Ranking final".
      EMPATE: mesma posição sem pular (1º, 1º, 2º) — igual ao sprint e ao código `if (pontos !== anterior) pos++`.
    - Atividades: nome (16 medium), selo lime "Feito hoje" se já feita hoje, "+X pts" em pílula surface-2.
    - Membros: avatar 40, nome, "@usuario", selo "Dono"; botão "Sair do grupo" (perigo, largura total) → janela de confirmação.
### 4.4 Convite — convite.html?codigo= (S1-53, S1-54)
Tela centrada, sem menu lateral: logo, cartão branco max 420, raio 22, centralizado, círculo de ícone colorido, título 26 bold, texto 16/22 ink-2, meta (chip categoria, membros, datas), botões.
O sprint pede: nome do grupo, quem convidou, membros, prazo e botão "Entrar no grupo". Estados:
1. Código inválido — "Convite inválido" / "Esse link não leva a nenhum grupo. Peça um novo link a quem convidou você." / botão "Ir para Grupos".
2. Sem login — "Você foi convidado para um grupo no HabitUs" / "Entre ou crie sua conta para ver o grupo e participar." / "Entrar para aceitar" + "Criar conta"; depois do login volta ao convite.
3. Removido pelo dono — "Você não pode entrar neste grupo" / "O dono do grupo removeu você, e o acesso não pode ser recuperado por convite." / "Voltar para Grupos".
4. Já é membro — "Você já está neste grupo" / "Você já participa de [nome]." / "Abrir grupo".
5. Grupo encerrado (do design; só se couber) — "Convites encerrados" / "[nome] terminou em DD MMM e não aceita novos membros."
6. Entrar — "Entrar em [nome]?" / "[dono] convidou você para este grupo." / botão primário "Entrar no grupo". (Quem saiu antes: "Quer voltar para [nome]?" / "Você saiu deste grupo antes. Ao voltar, começa de novo com zero pontos." / "Voltar para o grupo".)
## 5. Janelas (sheets) — todas dentro de grupo.html
- Postar conclusão (S1-42/43): "Atividade" (opções em rádio; já feita hoje fica desabilitada com "Já feita hoje, volte amanhã"; cada uma mostra "+X pts"); "Foto" obrigatória (erro "A foto é obrigatória para postar a conclusão."); "Texto (opcional)" placeholder "Conte como foi"; aviso "Publicar não marca nenhum hábito seu. Para registrar, vá em Hoje."; botão "Publicar conclusão · +X pts". Erro de atividade: "Escolha a atividade que você concluiu." Depois de publicar vai para ?aba=ranking.
- Menu do dono (S1-47/48/49/51): "Encerra em" (data final; se futura em grupo encerrado, reabre); atividades editáveis com pontos ("Nova pontuação vale apenas a partir de agora"); membros com "Remover"; conclusões com "Excluir"; "Excluir grupo" (perigo sólido). Botão "Salvar alterações" aparece só se algo mudou.
- Confirmações (todas com "Cancelar" secundário):
  Remover membro → "Remover e bloquear" (perde todos os pontos, bloqueado para sempre).
  Excluir conclusão → desconta os pontos do ranking.
  Excluir grupo → apaga membros, ranking, feed e conclusões para todos.
  Sair do grupo → não dono: perde os pontos; dono com outros membros: o membro mais antigo vira dono; dono sozinho: o grupo é excluído.
## 6. Ícones necessários (SVG embutido, traço 2)
Plus, Users, ChevronRight, ArrowLeft, Settings, Camera, Copy, Trash2, Check, Lock, Info, CircleHelp, Ban, X.

## 7. Regras de implementação
- Textos de usuário sempre com textContent, nunca innerHTML.
- Datas como 'AAAA-MM-DD' locais; nada de toISOString nem new Date('AAAA-MM-DD') para chave de dia.
- Janelas criadas por JS; formulários no HTML.
- Estados do design que o sprint não pede (grupo encerrado no convite, "voltar para o grupo") entram só depois dos itens P0/P1.
 