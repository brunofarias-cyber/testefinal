-- ============================================================================
-- SCRIPT PARA INICIALIZAR TABELAS NO NEON (ORDEM DE DEPENDÊNCIAS)
-- ============================================================================

-- 1. Criar tabela users (base - UUID conforme modelo Sequelize)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    school VARCHAR(255),
    class VARCHAR(255),
    avatar VARCHAR(255),
    isActive BOOLEAN DEFAULT true,
    googleRefreshToken TEXT,
    lastSyncAt TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criar tabela teams (inteiro auto-increment, colunas sublinhadas conforme modelo)
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    project_id INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar tabela teammessages (depende de teams e users)
CREATE TABLE IF NOT EXISTS teammessages (
    id SERIAL PRIMARY KEY,
    teamId INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    senderId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
INSERT INTO teams (name) VALUES ('Equipe Alpha'), ('Equipe Beta')
ON CONFLICT DO NOTHING;

INSERT INTO users (email, name, role, password) VALUES 
    ('prof@example.com', 'Prof. Ana Silva', 'teacher', 'changeme'),
    ('aluno1@example.com', 'João Silva', 'student', 'changeme'),
    ('aluno2@example.com', 'Maria Oliveira', 'student', 'changeme')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
