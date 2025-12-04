-- Execute no Neon Dashboard (dashboard.neon.tech > SQL Editor)
-- Isso vai deletar o índice duplicado que está causando o erro

DROP INDEX IF EXISTS idx_student_project CASCADE;

-- Após executar, rode npm run dev novamente
