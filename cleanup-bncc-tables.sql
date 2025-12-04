-- Execute no Neon Dashboard para limpar tabelas BNCC

-- Deletar tabelas BNCC (ordem importa por causa das foreign keys)
DROP TABLE IF EXISTS skill_general_competencies CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS skill_indicators CASCADE;
DROP TABLE IF EXISTS student_skill_evaluations CASCADE;
DROP TABLE IF EXISTS student_skill_summary CASCADE;
DROP TABLE IF EXISTS bncc_skills CASCADE;
DROP TABLE IF EXISTS bncc_disciplines CASCADE;
DROP TABLE IF EXISTS bncc_general_competencies CASCADE;

-- Após executar isso, reinicie o servidor
-- As tabelas serão recriadas corretamente
