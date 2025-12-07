# 📊 Schemas SQL para Banco de Dados

**Arquivo:** `docs/SQL_SCHEMAS.md`  
**Data:** 6 de Dezembro de 2025  
**Versão:** 1.0.0

---

## 🎯 Índice

1. [PostgreSQL Schemas](#postgresql-schemas)
2. [MySQL Schemas](#mysql-schemas)
3. [Scripts de Inserção](#scripts-de-inserção)
4. [Queries Úteis](#queries-úteis)
5. [Índices e Otimizações](#índices-e-otimizações)

---

## PostgreSQL Schemas

### 1. Tabela: bncc_areas

```sql
CREATE TABLE bncc_areas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(10),
  cor VARCHAR(100),
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_bncc_areas_codigo ON bncc_areas(codigo);
CREATE INDEX idx_bncc_areas_ordem ON bncc_areas(ordem);

-- Comentários
COMMENT ON TABLE bncc_areas IS '5 Áreas de Conhecimento da BNCC';
COMMENT ON COLUMN bncc_areas.codigo IS 'Código da área (MAT, LIN, CN, CS, EC)';
COMMENT ON COLUMN bncc_areas.cor IS 'Gradient Tailwind CSS para UI';
```

### 2. Tabela: bncc_habilidades

```sql
CREATE TABLE bncc_habilidades (
  id SERIAL PRIMARY KEY,
  area_id INTEGER NOT NULL,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  ano_escolar VARCHAR(50) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  competencias_gerais INTEGER[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_area
    FOREIGN KEY (area_id)
    REFERENCES bncc_areas(id)
    ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_bncc_habilidades_area ON bncc_habilidades(area_id);
CREATE INDEX idx_bncc_habilidades_codigo ON bncc_habilidades(codigo);
CREATE INDEX idx_bncc_habilidades_ano ON bncc_habilidades(ano_escolar);
CREATE INDEX idx_bncc_habilidades_competencias ON bncc_habilidades USING GIN(competencias_gerais);

-- Comentários
COMMENT ON TABLE bncc_habilidades IS 'Habilidades da BNCC por área';
COMMENT ON COLUMN bncc_habilidades.codigo IS 'Código oficial BNCC (ex: EF07MA01)';
COMMENT ON COLUMN bncc_habilidades.competencias_gerais IS 'Array de números das competências gerais (1-10)';
```

### 3. Tabela: bncc_competencias_gerais

```sql
CREATE TABLE bncc_competencias_gerais (
  numero INTEGER PRIMARY KEY CHECK (numero >= 1 AND numero <= 10),
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  icone VARCHAR(10),
  cor VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentários
COMMENT ON TABLE bncc_competencias_gerais IS '10 Competências Gerais da BNCC (fixas)';
COMMENT ON COLUMN bncc_competencias_gerais.numero IS 'Número da competência (1 a 10)';
```

### 4. Tabela: classes

```sql
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  year VARCHAR(50) NOT NULL,
  teacher_id INTEGER NOT NULL,
  theme VARCHAR(20) DEFAULT 'blue',
  engagement INTEGER DEFAULT 0 CHECK (engagement >= 0 AND engagement <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_year ON classes(year);

-- Comentários
COMMENT ON TABLE classes IS 'Turmas escolares';
COMMENT ON COLUMN classes.engagement IS 'Percentual de engajamento (0-100)';
```

### 5. Tabela: students

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  avatar VARCHAR(255),
  class_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_class
    FOREIGN KEY (class_id)
    REFERENCES classes(id)
    ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_email ON students(email);
CREATE UNIQUE INDEX idx_students_email_class ON students(class_id, email);

-- Comentários
COMMENT ON TABLE students IS 'Estudantes das turmas';
COMMENT ON COLUMN students.avatar IS 'URL do avatar (Dicebear API)';
```

### 6. Tabela: teams

```sql
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  project_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_project
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_teams_project ON teams(project_id);

-- Comentários
COMMENT ON TABLE teams IS 'Equipes de trabalho em projetos';
```

### 7. Tabela: team_members

```sql
CREATE TABLE team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_team
    FOREIGN KEY (team_id)
    REFERENCES teams(id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,
  
  CONSTRAINT unique_team_user UNIQUE (team_id, user_id)
);

-- Índices
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(role);

-- Comentários
COMMENT ON TABLE team_members IS 'Membros das equipes (estudantes + professores)';
COMMENT ON COLUMN team_members.role IS 'Papel: student, teacher, collaborator';
```

### 8. Tabela: messages

```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_team
    FOREIGN KEY (team_id)
    REFERENCES teams(id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_sender
    FOREIGN KEY (sender_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_messages_team ON messages(team_id, timestamp DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_read ON messages(team_id, read);

-- Comentários
COMMENT ON TABLE messages IS 'Mensagens de chat isoladas por equipe';
COMMENT ON COLUMN messages.read IS 'Mensagem foi lida por outros membros';
```

### 9. Tabela: projects

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  area_id INTEGER,
  teacher_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_area
    FOREIGN KEY (area_id)
    REFERENCES bncc_areas(id)
    ON DELETE SET NULL,
  
  CONSTRAINT fk_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_projects_area ON projects(area_id);
CREATE INDEX idx_projects_teacher ON projects(teacher_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Comentários
COMMENT ON TABLE projects IS 'Projetos educacionais baseados na BNCC';
COMMENT ON COLUMN projects.status IS 'Status: active, completed, archived';
```

### 10. Tabela: project_habilidades (Many-to-Many)

```sql
CREATE TABLE project_habilidades (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  habilidade_id INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_project
    FOREIGN KEY (project_id)
    REFERENCES projects(id)
    ON DELETE CASCADE,
  
  CONSTRAINT fk_habilidade
    FOREIGN KEY (habilidade_id)
    REFERENCES bncc_habilidades(id)
    ON DELETE CASCADE,
  
  CONSTRAINT unique_project_habilidade UNIQUE (project_id, habilidade_id)
);

-- Índices
CREATE INDEX idx_project_habilidades_project ON project_habilidades(project_id);
CREATE INDEX idx_project_habilidades_habilidade ON project_habilidades(habilidade_id);

-- Comentários
COMMENT ON TABLE project_habilidades IS 'Relação N:N entre projetos e habilidades BNCC';
```

---

## MySQL Schemas

### Diferenças principais do PostgreSQL:

```sql
-- 1. SERIAL → AUTO_INCREMENT
CREATE TABLE bncc_areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  -- ... rest
);

-- 2. TEXT → TEXT (mesmo)
descricao TEXT

-- 3. TIMESTAMP → DATETIME
created_at DATETIME DEFAULT CURRENT_TIMESTAMP

-- 4. INTEGER[] → JSON
competencias_gerais JSON

-- 5. CONSTRAINT inline
CONSTRAINT fk_area FOREIGN KEY (area_id) REFERENCES bncc_areas(id) ON DELETE CASCADE
```

### Exemplo completo MySQL:

```sql
CREATE TABLE bncc_areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(10) NOT NULL UNIQUE,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(10),
  cor VARCHAR(100),
  ordem INT NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_codigo (codigo),
  INDEX idx_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bncc_habilidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area_id INT NOT NULL,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  ano_escolar VARCHAR(50) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  competencias_gerais JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_area (area_id),
  INDEX idx_codigo (codigo),
  INDEX idx_ano (ano_escolar),
  
  CONSTRAINT fk_habilidade_area 
    FOREIGN KEY (area_id) 
    REFERENCES bncc_areas(id) 
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Scripts de Inserção

### PostgreSQL - Inserir Áreas

```sql
INSERT INTO bncc_areas (id, codigo, nome, descricao, icone, cor, ordem) VALUES
(1, 'MAT', 'Matemática', 'Números, álgebra, geometria e estatística', '📊', 'from-blue-500 to-cyan-500', 1),
(2, 'LIN', 'Linguagens', 'Português, línguas estrangeiras, artes', '📖', 'from-purple-500 to-pink-500', 2),
(3, 'CN', 'Ciências da Natureza', 'Física, química, biologia', '🔬', 'from-green-500 to-emerald-500', 3),
(4, 'CS', 'Ciências Sociais', 'História, geografia, sociologia', '🌍', 'from-orange-500 to-red-500', 4),
(5, 'EC', 'Educação Completa', 'Educação física, valores humanos', '💪', 'from-rose-500 to-red-600', 5);

-- Reset sequence
SELECT setval('bncc_areas_id_seq', (SELECT MAX(id) FROM bncc_areas));
```

### PostgreSQL - Inserir Habilidades

```sql
INSERT INTO bncc_habilidades (id, area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais) VALUES
(1, 1, 'EF07MA01', '7º ano', 'Resolver problemas com números naturais', 
 'Resolver e elaborar problemas com números naturais, envolvendo as noções de divisor e múltiplo', 
 ARRAY[1, 2, 7]),
 
(2, 1, 'EF08MA01', '8º ano', 'Efetuar cálculos com potências', 
 'Efetuar cálculos com potências de expoentes inteiros e aplicar esse conhecimento', 
 ARRAY[1, 2]),
 
(3, 2, 'EF67LP01', '6º-7º ano', 'Reconhecer função e impacto da linguagem', 
 'Reconhecer a função e o impacto da linguagem nas diferentes manifestações', 
 ARRAY[2, 3, 4]);
 
-- ... (continuar com todas as 15 habilidades)

-- Reset sequence
SELECT setval('bncc_habilidades_id_seq', (SELECT MAX(id) FROM bncc_habilidades));
```

### PostgreSQL - Inserir Competências

```sql
INSERT INTO bncc_competencias_gerais (numero, titulo, descricao, icone, cor) VALUES
(1, 'Conhecimento', 
 'Valorizar e utilizar os conhecimentos historicamente construídos', 
 '📚', 'bg-blue-100 text-blue-700'),
 
(2, 'Pensamento Científico, Crítico e Criativo', 
 'Exercitar a curiosidade intelectual e recorrer à abordagem própria das ciências', 
 '🧪', 'bg-purple-100 text-purple-700'),
 
(3, 'Repertório Cultural', 
 'Valorizar e fruir as diversas manifestações artísticas e culturais', 
 '🎨', 'bg-pink-100 text-pink-700');
 
-- ... (continuar com as 10 competências)
```

### MySQL - Inserir Habilidades (com JSON)

```sql
INSERT INTO bncc_habilidades (id, area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais) VALUES
(1, 1, 'EF07MA01', '7º ano', 'Resolver problemas com números naturais', 
 'Resolver e elaborar problemas com números naturais', 
 JSON_ARRAY(1, 2, 7)),
 
(2, 1, 'EF08MA01', '8º ano', 'Efetuar cálculos com potências', 
 'Efetuar cálculos com potências de expoentes inteiros', 
 JSON_ARRAY(1, 2));
```

---

## Queries Úteis

### 1. Buscar todas as habilidades de uma área

```sql
SELECT 
  h.*,
  a.nome as area_nome,
  a.icone as area_icone
FROM bncc_habilidades h
INNER JOIN bncc_areas a ON h.area_id = a.id
WHERE a.id = 1
ORDER BY h.ano_escolar, h.codigo;
```

### 2. Buscar habilidades com competências específicas

```sql
-- PostgreSQL
SELECT * FROM bncc_habilidades
WHERE 1 = ANY(competencias_gerais);

-- MySQL
SELECT * FROM bncc_habilidades
WHERE JSON_CONTAINS(competencias_gerais, '1');
```

### 3. Contar habilidades por área

```sql
SELECT 
  a.nome,
  COUNT(h.id) as total_habilidades
FROM bncc_areas a
LEFT JOIN bncc_habilidades h ON a.id = h.area_id
GROUP BY a.id, a.nome
ORDER BY a.ordem;
```

### 4. Buscar projetos com suas habilidades

```sql
SELECT 
  p.id,
  p.name,
  a.nome as area,
  array_agg(h.codigo) as habilidades_codigos,
  array_agg(h.titulo) as habilidades_titulos
FROM projects p
INNER JOIN bncc_areas a ON p.area_id = a.id
LEFT JOIN project_habilidades ph ON p.id = ph.project_id
LEFT JOIN bncc_habilidades h ON ph.habilidade_id = h.id
GROUP BY p.id, p.name, a.nome;
```

### 5. Verificar se usuário é membro de equipe (para chat)

```sql
SELECT COUNT(*) as is_member
FROM team_members
WHERE team_id = $1 AND user_id = $2;
```

### 6. Buscar mensagens de equipe com permissão

```sql
SELECT 
  m.*,
  u.name as sender_name,
  u.avatar as sender_avatar,
  u.role as sender_role
FROM messages m
INNER JOIN users u ON m.sender_id = u.id
WHERE m.team_id = $1
  AND EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = m.team_id 
      AND tm.user_id = $2
  )
ORDER BY m.timestamp ASC;
```

### 7. Buscar turmas com quantidade de alunos

```sql
SELECT 
  c.*,
  COUNT(s.id) as total_students
FROM classes c
LEFT JOIN students s ON c.id = s.class_id
WHERE c.teacher_id = $1
GROUP BY c.id
ORDER BY c.year, c.name;
```

### 8. Full-text search em habilidades (PostgreSQL)

```sql
-- Criar índice
CREATE INDEX idx_habilidades_search 
ON bncc_habilidades 
USING gin(to_tsvector('portuguese', titulo || ' ' || descricao));

-- Buscar
SELECT *
FROM bncc_habilidades
WHERE to_tsvector('portuguese', titulo || ' ' || descricao) 
      @@ plainto_tsquery('portuguese', 'resolver problemas');
```

---

## Índices e Otimizações

### Índices Compostos

```sql
-- Buscar habilidades por área e ano
CREATE INDEX idx_habilidades_area_ano 
ON bncc_habilidades(area_id, ano_escolar);

-- Mensagens não lidas por equipe
CREATE INDEX idx_messages_unread 
ON messages(team_id, read, timestamp DESC);

-- Membros ativos de equipes
CREATE INDEX idx_team_members_active 
ON team_members(team_id, user_id) 
WHERE role IN ('student', 'teacher');
```

### Particionamento (para muitas mensagens)

```sql
-- PostgreSQL - Particionar messages por data
CREATE TABLE messages (
  id BIGSERIAL,
  team_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
) PARTITION BY RANGE (timestamp);

-- Criar partições mensais
CREATE TABLE messages_2025_01 
PARTITION OF messages 
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE messages_2025_02 
PARTITION OF messages 
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### Triggers para updated_at

```sql
-- PostgreSQL - Auto-update updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_classes
BEFORE UPDATE ON classes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
```

---

## 🚀 Como Usar

### 1. Criar Banco de Dados

```bash
# PostgreSQL
createdb bprojetos

# MySQL
mysql -u root -p
CREATE DATABASE bprojetos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Executar Schemas

```bash
# PostgreSQL
psql -U postgres -d bprojetos -f schemas.sql

# MySQL
mysql -u root -p bprojetos < schemas.sql
```

### 3. Popular com Dados

```bash
# Executar script de seed
node scripts/seed-bncc-database.js
```

### 4. Verificar

```sql
-- Contar registros
SELECT 
  (SELECT COUNT(*) FROM bncc_areas) as areas,
  (SELECT COUNT(*) FROM bncc_habilidades) as habilidades,
  (SELECT COUNT(*) FROM bncc_competencias_gerais) as competencias;
```

---

## 📚 Referências

- **Arquivo JSON:** `/seeds/bncc-seed-data.json`
- **Script Seed:** `/scripts/seed-bncc-database.js`
- **Documentação BNCC:** http://basenacionalcomum.mec.gov.br/

---

**Status:** ✅ Schemas completos e prontos para uso!
