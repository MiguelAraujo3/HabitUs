-- Migração 001: Estrutura inicial para Grupos, Atividades, Membros e Conclusões de Grupo

-- 1. Tabela: grupos
-- Representa os grupos de hábitos compartilhados/desafios coletivos.
CREATE TABLE IF NOT EXISTS grupos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT NOT NULL DEFAULT '',
    data_inicio TEXT NOT NULL, -- Formato 'AAAA-MM-DD'
    data_fim TEXT NOT NULL,    -- Formato 'AAAA-MM-DD'
    id_dono TEXT NOT NULL,
    codigo_convite TEXT NOT NULL UNIQUE,
    encerrado BOOLEAN NOT NULL DEFAULT FALSE,
    ranking_final JSONB DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_grupos_id_dono ON grupos(id_dono);
CREATE INDEX IF NOT EXISTS idx_grupos_codigo_convite ON grupos(codigo_convite);

-- 2. Tabela: atividades
-- Lista de atividades pontuadas que pertencem a um grupo específico.
CREATE TABLE IF NOT EXISTS atividades (
    id TEXT PRIMARY KEY,
    id_grupo TEXT NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    pontos INTEGER NOT NULL CHECK (pontos >= 1 AND pontos <= 10)
);

CREATE INDEX IF NOT EXISTS idx_atividades_id_grupo ON atividades(id_grupo);

-- 3. Tabela: membros
-- Relacionamento N:N entre usuários e grupos, com controle de bloqueio e data de ingresso.
CREATE TABLE IF NOT EXISTS membros (
    id TEXT PRIMARY KEY,
    id_grupo TEXT NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
    id_usuario TEXT NOT NULL,
    data_entrada TEXT NOT NULL, -- Formato ISO ou 'AAAA-MM-DD' (usado para desempates)
    bloqueado BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_membros_grupo_usuario UNIQUE (id_grupo, id_usuario)
);

CREATE INDEX IF NOT EXISTS idx_membros_id_grupo ON membros(id_grupo);
CREATE INDEX IF NOT EXISTS idx_membros_id_usuario ON membros(id_usuario);

-- 4. Tabela: conclusoes_grupo
-- Registros de realização de atividades pontuadas do grupo feitas pelos membros.
CREATE TABLE IF NOT EXISTS conclusoes_grupo (
    id TEXT PRIMARY KEY,
    id_grupo TEXT NOT NULL REFERENCES grupos(id) ON DELETE CASCADE,
    id_atividade TEXT NOT NULL REFERENCES atividades(id) ON DELETE CASCADE,
    id_usuario TEXT NOT NULL,
    data TEXT NOT NULL, -- Formato 'AAAA-MM-DD'
    foto TEXT DEFAULT NULL,
    texto TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_conclusoes_grupo_id_grupo ON conclusoes_grupo(id_grupo);
CREATE INDEX IF NOT EXISTS idx_conclusoes_grupo_id_atividade ON conclusoes_grupo(id_atividade);
CREATE INDEX IF NOT EXISTS idx_conclusoes_grupo_id_usuario ON conclusoes_grupo(id_usuario);
CREATE INDEX IF NOT EXISTS idx_conclusoes_grupo_data ON conclusoes_grupo(data);
