-- ============================================================================
-- SCRIPT PARA INICIALIZAR TABELAS NO NEON (ORDEM DE DEPENDÊNCIAS)
-- ============================================================================

-- 1. Criar tabela Users (base - sem dependências)
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criar tabela Teams (base - sem dependências)
CREATE TABLE IF NOT EXISTS Teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar tabela TeamMessages (depende de Teams e Users)
CREATE TABLE IF NOT EXISTS TeamMessages (
    id SERIAL PRIMARY KEY,
    teamId INTEGER NOT NULL REFERENCES Teams(id) ON DELETE CASCADE,
    senderId INTEGER NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    senderName VARCHAR(255),
    message TEXT NOT NULL,
    messageType VARCHAR(50) DEFAULT 'text',
    isRead BOOLEAN DEFAULT false,
    readAt TIMESTAMP,
    metadata JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inserir dados de exemplo
INSERT INTO Teams (name) VALUES ('Equipe Alpha'), ('Equipe Beta')
ON CONFLICT DO NOTHING;

INSERT INTO Users (email, name, role) VALUES 
    ('prof@example.com', 'Prof. Ana Silva', 'teacher'),
    ('aluno1@example.com', 'João Silva', 'student'),
    ('aluno2@example.com', 'Maria Oliveira', 'student')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
