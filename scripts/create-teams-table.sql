-- Script para criar a tabela "Teams" no banco de dados

CREATE TABLE IF NOT EXISTS Teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de exemplo
INSERT INTO Teams (name) VALUES ('Equipe Alpha'), ('Equipe Beta');