-- ═══════════════════════════════════════════════════════════════════════
-- 1. TABELA: ÁREAS DE CONHECIMENTO BNCC
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bncc_areas (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(10) UNIQUE NOT NULL,  -- Ex: "MAT", "LIN", "CN"
  nome VARCHAR(255) NOT NULL,           -- Ex: "Matemática", "Linguagens"
  descricao TEXT,
  icone VARCHAR(50),                    -- Para usar em UI (emoji ou classe)
  ordem INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir áreas
INSERT INTO bncc_areas (codigo, nome, descricao, icone, ordem) VALUES
('MAT', 'Matemática', 'Números, álgebra, geometria, grandezas e estatística', '📊', 1),
('LIN', 'Linguagens', 'Língua portuguesa, línguas estrangeiras, artes', '📖', 2),
('CN', 'Ciências da Natureza', 'Física, química, biologia, astronomia', '🔬', 3),
('CS', 'Ciências Sociais', 'História, geografia, sociologia', '🌍', 4),
('EC', 'Educação Completa', 'Educação física, valores humanos, bem-estar', '💪', 5)
ON CONFLICT (codigo) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. TABELA: COMPETÊNCIAS GERAIS (da BNCC)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bncc_competencias_gerais (
  id SERIAL PRIMARY KEY,
  numero INT NOT NULL,                  -- 1-10
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Inserting duplicates might fail if we don't handle conflicts.
-- Since there is no unique constraint on 'numero' in the CREATE statement above (unless added later),
-- we should probably clear or check first.
-- However, for robustness in this script I will add ON CONFLICT DO NOTHING assuming ID might conflict if explicit,
-- but here IDs are serial. We can rely on checking 'numero' if we added a constraint, but let's just use simple INSERT 
-- and assume it's a seed run. Or better, use "IF NOT EXISTS" logic via DO block or just Insert.
-- Given the user script matches exactly what I should run, I will paste it. 
-- BUT I will add specific "ON CONFLICT" handling if I can, or just trust the user's script structure.
-- The user's script for areas used `ON CONFLICT DO NOTHING`.
-- The user's script for competencies uses `INSERT INTO ... VALUES`.
-- I will blindly copy the user's intent but ensure robustness where obvious.
-- Actually the user script provided `ON CONFLICT DO NOTHING` for areas. I should keep that.
-- For competencies, I will modify to avoid duplicates if re-run.

INSERT INTO bncc_competencias_gerais (numero, titulo, descricao) 
SELECT * FROM (VALUES
(1, 'Conhecimento', 'Valorizar e utilizar os conhecimentos historicamente construídos sobre o mundo físico, social, cultural e digital para entender e explicar a realidade.'),
(2, 'Pensamento Científico, Crítico e Criativo', 'Exercitar a curiosidade intelectual e recorrer à abordagem própria das ciências, incluindo a investigação, a reflexão, a análise crítica.'),
(3, 'Repertório Cultural', 'Valorizar e fruir as diversas manifestações artísticas e culturais, das locais às mundiais, e participar de práticas diversificadas da produção artístico-cultural.'),
(4, 'Comunicação', 'Utilizar diferentes linguagens – verbal (oral ou visual-motora), corporal, visual, sonora e digital – para se expressar e partilhar informações, experiências, ideias e sentimentos.'),
(5, 'Cultura Digital', 'Compreender, utilizar e criar tecnologias digitais de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais.'),
(6, 'Trabalho e Projeto de Vida', 'Valorizar a diversidade de saberes e vivências culturais e aproveitar as potencialidades de cada um para melhorar o mundo.'),
(7, 'Argumentação', 'Argumentar com base em fatos, dados e informações confiáveis, para formular, negociar e defender ideias, pontos de vista e decisões comuns.'),
(8, 'Autoconhecimento e Autorregulação', 'Conhecer-se, apreciar-se e cuidar de sua saúde física e emocional, compreendendo-se na diversidade humana e reconhecendo suas emoções.'),
(9, 'Empatia e Cooperação', 'Exercitar a empatia, o diálogo, a resolução de conflitos e a cooperação, fazendo-se respeitar e promovendo o respeito ao outro.'),
(10, 'Responsabilidade e Cidadania', 'Agir pessoal e coletivamente com autonomia, responsabilidade, flexibilidade, resiliência e determinação, tomando decisões com base em princípios éticos, democráticos, inclusivos, sustentáveis e solidários.')
) AS v(numero, titulo, descricao)
WHERE NOT EXISTS (SELECT 1 FROM bncc_competencias_gerais WHERE numero = v.numero);

-- ═══════════════════════════════════════════════════════════════════════
-- 3. TABELA: HABILIDADES ESPECÍFICAS POR ÁREA
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bncc_habilidades (
  id SERIAL PRIMARY KEY,
  area_id INT NOT NULL REFERENCES bncc_areas(id) ON DELETE CASCADE,
  codigo VARCHAR(20) UNIQUE NOT NULL,  -- Ex: "EF07MA01", "EM13MAT101"
  ano_escolar VARCHAR(20),             -- "6º-7º ano", "8º-9º ano", "EM"
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  exemplos TEXT,                       -- JSON com exemplos de atividades
  competencias_gerais INT[],           -- Array de IDs das competências (1-10)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════
-- INSERIR HABILIDADES DE MATEMÁTICA
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais) VALUES
(
  (SELECT id FROM bncc_areas WHERE codigo = 'MAT'),
  'EF07MA01',
  '7º ano',
  'Resolver e elaborar problemas com números naturais',
  'Resolver e elaborar problemas com números naturais, envolvendo as noções de divisor e divisível, múltiplo, números primos, mmc e mdc.',
  ARRAY[1, 2, 7]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'MAT'),
  'EF07MA02',
  '7º ano',
  'Representar números em diferentes formas',
  'Representar um número natural como uma multiplicação de fatores primos, reconhecendo essa decomposição como única.',
  ARRAY[1, 2]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'MAT'),
  'EF08MA01',
  '8º ano',
  'Efetuar cálculos com potências',
  'Efetuar cálculos com potências de expoentes inteiros e aplicar esse conhecimento na representação de números em notação científica.',
  ARRAY[1, 2, 5]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'MAT'),
  'EM13MAT101',
  'Ensino Médio',
  'Interpretar criticamente fontes de informação',
  'Interpretar criticamente situações econômicas, sociais e fatos relativos às Ciências da Natureza que envolvam a variação de grandezas.',
  ARRAY[1, 2, 4, 7]
)
ON CONFLICT (codigo) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- INSERIR HABILIDADES DE LINGUAGENS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais) VALUES
(
  (SELECT id FROM bncc_areas WHERE codigo = 'LIN'),
  'EF67LP01',
  '6º-7º ano',
  'Reconhecer a função e o impacto da linguagem',
  'Reconhecer a função e o impacto da linguagem nas diferentes manifestações humanas, como construção de identidades sociais.',
  ARRAY[2, 3, 4, 9]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'LIN'),
  'EF67LP02',
  '6º-7º ano',
  'Explorar diferentes práticas de linguagem',
  'Explorar e analisar diferentes práticas de linguagem em diferentes campos da atividade humana (jornalismo, publicidade, redes sociais, etc).',
  ARRAY[3, 4, 5]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'LIN'),
  'EF89LP01',
  '8º-9º ano',
  'Analisar textos publicitários',
  'Analisar textos publicitários em uma perspectiva crítica, compreendendo como a linguagem persuasiva é utilizada.',
  ARRAY[2, 4, 7]
)
ON CONFLICT (codigo) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- INSERIR HABILIDADES DE CIÊNCIAS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais) VALUES
(
  (SELECT id FROM bncc_areas WHERE codigo = 'CN'),
  'EF07CI01',
  '7º ano',
  'Discutir a importância da visão integrada',
  'Discutir a importância da visão integrada (lógica, planetária e sociológica) da geosfera, da biosfera e da antroposfera.',
  ARRAY[1, 2, 10]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'CN'),
  'EF07CI04',
  '7º ano',
  'Investigar mudanças de estado físico',
  'Investigar mudanças de estado físico da matéria e explicar essas mudanças em termos de Modelo de Partículas.',
  ARRAY[1, 2, 5]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'CN'),
  'EF08CI01',
  '8º ano',
  'Propor ações individuais e coletivas',
  'Propor ações individuais e coletivas para a solução de problemas ambientais da cidade ou da comunidade, analisando possíveis consequências a médio e longo prazo.',
  ARRAY[2, 6, 9, 10]
)
ON CONFLICT (codigo) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- INSERIR HABILIDADES DE CIÊNCIAS SOCIAIS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais) VALUES
(
  (SELECT id FROM bncc_areas WHERE codigo = 'CS'),
  'EF07HI01',
  '7º ano',
  'Explicar o significado de diversos eventos',
  'Explicar o significado de diversos eventos relacionados à história do Brasil, de outros povos e do mundo antigo.',
  ARRAY[1, 3, 7]
),
(
  (SELECT id FROM bncc_areas WHERE codigo = 'CS'),
  'EF07GE01',
  '7º ano',
  'Avaliar as implicações de atividades econômicas',
  'Avaliar as implicações de atividades econômicas considerando ações, transporte, benefícios e problemas ambientais, econômicos e sociais.',
  ARRAY[2, 6, 7, 10]
)
ON CONFLICT (codigo) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- 4. TABELA: RELACIONAMENTO PROJETOS ↔ HABILIDADES BNCC
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS project_bncc_habilidades (
  id SERIAL PRIMARY KEY,
  project_id INT NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  habilidade_id INT NOT NULL REFERENCES bncc_habilidades(id) ON DELETE CASCADE,
  descricao_alignment TEXT,            -- Como essa habilidade será desenvolvida
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, habilidade_id)
);

-- ═══════════════════════════════════════════════════════════════════════
-- 5. TABELA: PLANEJAMENTO WIZARD (Salvar estado do assistente)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS project_wizard_draft (
  id SERIAL PRIMARY KEY,
  teacher_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  class_id INT NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  
  -- ETAPA 1: Seleção de Competências
  area_id INT REFERENCES bncc_areas(id),
  selected_habilidades_ids INT[],      -- Array de IDs selecionados
  
  -- ETAPA 2: Tema e IA
  tema_projeto VARCHAR(255),
  justificativa TEXT,                  -- Gerada pela IA
  objetivos_especificos TEXT,          -- Gerada pela IA
  atividades_iniciais TEXT,            -- Gerada pela IA
  
  -- ETAPA 3: Refinamento
  titulo_final VARCHAR(255),
  descricao_final TEXT,
  status VARCHAR(20) DEFAULT 'draft',  -- 'draft', 'saved'
  
  -- Metadados
  ia_provider VARCHAR(50),             -- 'openai', 'claude', 'mock'
  etapa_atual INT DEFAULT 1,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════
-- 6. ÍNDICES PARA PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_bncc_habilidades_area ON bncc_habilidades(area_id);
CREATE INDEX IF NOT EXISTS idx_bncc_habilidades_codigo ON bncc_habilidades(codigo);
CREATE INDEX IF NOT EXISTS idx_project_bncc_project ON project_bncc_habilidades(project_id);
CREATE INDEX IF NOT EXISTS idx_project_bncc_habilidade ON project_bncc_habilidades(habilidade_id);
CREATE INDEX IF NOT EXISTS idx_wizard_draft_teacher ON project_wizard_draft(teacher_id);
CREATE INDEX IF NOT EXISTS idx_wizard_draft_class ON project_wizard_draft(class_id);

-- ═══════════════════════════════════════════════════════════════════════
-- 7. VIEWS ÚTEIS PARA QUERIES
-- ═══════════════════════════════════════════════════════════════════════

-- View: Habilidades por Área com competências
CREATE OR REPLACE VIEW v_bncc_habilidades_completo AS
SELECT
  h.id,
  h.codigo,
  h.titulo,
  h.descricao,
  h.ano_escolar,
  a.nome as area_nome,
  a.codigo as area_codigo,
  a.icone as area_icone,
  h.competencias_gerais
FROM bncc_habilidades h
JOIN bncc_areas a ON h.area_id = a.id
ORDER BY a.ordem, h.codigo;

-- View: Projetos com Habilidades BNCC
CREATE OR REPLACE VIEW v_projetos_com_bncc AS
SELECT
  p.id as projeto_id,
  p.titulo as projeto_titulo,
  p.classId,
  COUNT(DISTINCT pbh.habilidade_id) as qtd_habilidades,
  ARRAY_AGG(DISTINCT h.codigo) as codigos_habilidades,
  ARRAY_AGG(DISTINCT h.titulo) as titulos_habilidades,
  ARRAY_AGG(DISTINCT a.nome) as areas
FROM projetos p
LEFT JOIN project_bncc_habilidades pbh ON p.id = pbh.project_id
LEFT JOIN bncc_habilidades h ON pbh.habilidade_id = h.id
LEFT JOIN bncc_areas a ON h.area_id = a.id
GROUP BY p.id, p.titulo, p.classId;
