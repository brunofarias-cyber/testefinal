import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seedBnccTables() {
  try {
    console.log('🚀 Criando tabelas BNCC...\n');

    // 1. Criar tabela bncc_areas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS bncc_areas (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(10) UNIQUE NOT NULL,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        icone VARCHAR(50),
        ordem INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabela bncc_areas criada');

    // 2. Inserir áreas
    await sequelize.query(`
      INSERT INTO bncc_areas (codigo, nome, descricao, icone, ordem) VALUES
      ('MAT', 'Matemática', 'Números, álgebra, geometria, grandezas e estatística', '📊', 1),
      ('LIN', 'Linguagens', 'Língua portuguesa, línguas estrangeiras, artes', '📖', 2),
      ('CN', 'Ciências da Natureza', 'Física, química, biologia, astronomia', '🔬', 3),
      ('CS', 'Ciências Sociais', 'História, geografia, sociologia', '🌍', 4),
      ('EC', 'Educação Completa', 'Educação física, valores humanos, bem-estar', '💪', 5)
      ON CONFLICT (codigo) DO NOTHING;
    `);
    console.log('✓ Áreas inseridas');

    // 3. Criar tabela competências gerais
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS bncc_competencias_gerais (
        id SERIAL PRIMARY KEY,
        numero INT NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabela bncc_competencias_gerais criada');

    // 4. Inserir competências
    await sequelize.query(`
      INSERT INTO bncc_competencias_gerais (numero, titulo, descricao) VALUES
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
      ON CONFLICT DO NOTHING;
    `);
    console.log('✓ Competências gerais inseridas');

    // 5. Criar tabela habilidades
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS bncc_habilidades (
        id SERIAL PRIMARY KEY,
        area_id INT NOT NULL REFERENCES bncc_areas(id) ON DELETE CASCADE,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        ano_escolar VARCHAR(20),
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        exemplos TEXT,
        competencias_gerais INT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabela bncc_habilidades criada');

    // 6. Inserir habilidades de Matemática
    await sequelize.query(`
      INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais)
      SELECT 
        a.id,
        'EF07MA01',
        '7º ano',
        'Resolver e elaborar problemas com números naturais',
        'Resolver e elaborar problemas com números naturais, envolvendo as noções de divisor e divisível, múltiplo, números primos, mmc e mdc.',
        ARRAY[1, 2, 7]
      FROM bncc_areas a WHERE a.codigo = 'MAT'
      ON CONFLICT (codigo) DO NOTHING;
    `);

    await sequelize.query(`
      INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais)
      SELECT 
        a.id,
        'EF08MA01',
        '8º ano',
        'Efetuar cálculos com potências',
        'Efetuar cálculos com potências de expoentes inteiros e aplicar esse conhecimento na representação de números em notação científica.',
        ARRAY[1, 2, 5]
      FROM bncc_areas a WHERE a.codigo = 'MAT'
      ON CONFLICT (codigo) DO NOTHING;
    `);

    await sequelize.query(`
      INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais)
      SELECT 
        a.id,
        'EM13MAT101',
        'Ensino Médio',
        'Interpretar criticamente fontes de informação',
        'Interpretar criticamente situações econômicas, sociais e fatos relativos às Ciências da Natureza que envolvam a variação de grandezas.',
        ARRAY[1, 2, 4, 7]
      FROM bncc_areas a WHERE a.codigo = 'MAT'
      ON CONFLICT (codigo) DO NOTHING;
    `);
    console.log('✓ Habilidades de Matemática inseridas');

    // 7. Inserir habilidades de Linguagens
    await sequelize.query(`
      INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais)
      SELECT 
        a.id,
        'EF67LP01',
        '6º-7º ano',
        'Reconhecer a função e o impacto da linguagem',
        'Reconhecer a função e o impacto da linguagem nas diferentes manifestações humanas, como construção de identidades sociais.',
        ARRAY[2, 3, 4, 9]
      FROM bncc_areas a WHERE a.codigo = 'LIN'
      ON CONFLICT (codigo) DO NOTHING;
    `);

    await sequelize.query(`
      INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais)
      SELECT 
        a.id,
        'EF89LP01',
        '8º-9º ano',
        'Analisar textos publicitários',
        'Analisar textos publicitários em uma perspectiva crítica, compreendendo como a linguagem persuasiva é utilizada.',
        ARRAY[2, 4, 7]
      FROM bncc_areas a WHERE a.codigo = 'LIN'
      ON CONFLICT (codigo) DO NOTHING;
    `);
    console.log('✓ Habilidades de Linguagens inseridas');

    // 8. Inserir habilidades de Ciências
    await sequelize.query(`
      INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais)
      SELECT 
        a.id,
        'EF07CI01',
        '7º ano',
        'Discutir a importância da visão integrada',
        'Discutir a importância da visão integrada (lógica, planetária e sociológica) da geosfera, da biosfera e da antroposfera.',
        ARRAY[1, 2, 10]
      FROM bncc_areas a WHERE a.codigo = 'CN'
      ON CONFLICT (codigo) DO NOTHING;
    `);

    await sequelize.query(`
      INSERT INTO bncc_habilidades (area_id, codigo, ano_escolar, titulo, descricao, competencias_gerais)
      SELECT 
        a.id,
        'EF08CI01',
        '8º ano',
        'Propor ações individuais e coletivas',
        'Propor ações individuais e coletivas para a solução de problemas ambientais da cidade ou da comunidade, analisando possíveis consequências a médio e longo prazo.',
        ARRAY[2, 6, 9, 10]
      FROM bncc_areas a WHERE a.codigo = 'CN'
      ON CONFLICT (codigo) DO NOTHING;
    `);
    console.log('✓ Habilidades de Ciências inseridas');

    // 9. Criar tabela relacionamento projetos <-> habilidades (UUID para project_id!)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS project_bncc_habilidades (
        id SERIAL PRIMARY KEY,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        habilidade_id INT NOT NULL REFERENCES bncc_habilidades(id) ON DELETE CASCADE,
        descricao_alignment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, habilidade_id)
      );
    `);
    console.log('✓ Tabela project_bncc_habilidades criada');

    // 10. Criar tabela wizard draft (UUID para teacher_id!)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS project_wizard_draft (
        id SERIAL PRIMARY KEY,
        teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        area_id INT REFERENCES bncc_areas(id),
        selected_habilidades_ids INT[],
        tema_projeto VARCHAR(255),
        justificativa TEXT,
        objetivos_especificos TEXT,
        atividades_iniciais TEXT,
        titulo_final VARCHAR(255),
        descricao_final TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        ia_provider VARCHAR(50),
        etapa_atual INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Tabela project_wizard_draft criada');

    // 11. Criar índices
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_bncc_habilidades_area ON bncc_habilidades(area_id);');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_bncc_habilidades_codigo ON bncc_habilidades(codigo);');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_project_bncc_project ON project_bncc_habilidades(project_id);');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_project_bncc_habilidade ON project_bncc_habilidades(habilidade_id);');
    await sequelize.query('CREATE INDEX IF NOT EXISTS idx_wizard_draft_teacher ON project_wizard_draft(teacher_id);');
    console.log('✓ Índices criados');

    // 12. Criar view
    await sequelize.query(`
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
    `);
    console.log('✓ View v_bncc_habilidades_completo criada');

    console.log('\n✅ Seed BNCC concluído com sucesso!\n');
    
    // Verificar dados inseridos
    const [areas] = await sequelize.query('SELECT COUNT(*) as count FROM bncc_areas');
    const [competencias] = await sequelize.query('SELECT COUNT(*) as count FROM bncc_competencias_gerais');
    const [habilidades] = await sequelize.query('SELECT COUNT(*) as count FROM bncc_habilidades');
    
    console.log('📊 Resumo:');
    console.log(`   - ${areas[0].count} áreas de conhecimento`);
    console.log(`   - ${competencias[0].count} competências gerais`);
    console.log(`   - ${habilidades[0].count} habilidades específicas`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

seedBnccTables();
