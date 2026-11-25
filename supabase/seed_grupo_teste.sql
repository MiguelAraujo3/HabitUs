-- Seed de teste para grupos, atividades e membros

-- 1. Grupo em andamento
INSERT INTO grupos (
    id,
    nome,
    categoria,
    descricao,
    data_inicio,
    data_fim,
    id_dono,
    codigo_convite,
    encerrado,
    ranking_final
) VALUES (
    'g-corrida-2026',
    'Desafio Corrida de Rua',
    'Esportes e exercicios',
    'Grupo focado em corrida e preparação física coletiva.',
    '2026-11-01',
    '2026-12-31',
    'u1',
    'CORRIDA2026',
    false,
    null
) ON CONFLICT (id) DO NOTHING;

-- 2. Três atividades para o grupo
INSERT INTO atividades (
    id,
    id_grupo,
    nome,
    pontos
) VALUES
    ('a-treino-5k', 'g-corrida-2026', 'Treino matinal 5km', 5),
    ('a-alongamento', 'g-corrida-2026', 'Alongamento pós-treino', 3),
    ('a-longao-10k', 'g-corrida-2026', 'Longão de domingo 10km', 10)
ON CONFLICT (id) DO NOTHING;

-- 3. Três membros para o grupo
INSERT INTO membros (
    id,
    id_grupo,
    id_usuario,
    data_entrada,
    bloqueado
) VALUES
    ('m-membro-1', 'g-corrida-2026', 'u1', '2026-11-01T08:00:00Z', false),
    ('m-membro-2', 'g-corrida-2026', 'u2', '2026-11-02T09:30:00Z', false),
    ('m-membro-3', 'g-corrida-2026', 'u3', '2026-11-03T14:00:00Z', false)
ON CONFLICT (id) DO NOTHING;

-- Observação para permissões no Supabase (se RLS estiver bloqueando a chave anon):
-- GRANT ALL ON grupos, atividades, membros, conclusoes_grupo TO anon, authenticated;
