import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import sequelize from '../../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runBnccSeed() {
  try {
    console.log('🚀 Iniciando seed do banco BNCC...');
    
    // Ler o arquivo SQL
    const sqlPath = join(__dirname, '01_SEED_BNCC_DATABASE.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    // Dividir em statements individuais
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`📋 Executando ${statements.length} comandos SQL...\n`);
    
    let successCount = 0;
    
    for (const stmt of statements) {
      try {
        // Pular comentários puros
        if (stmt.startsWith('--') || stmt.match(/^\/\*.*\*\/$/s)) continue;
        
        await sequelize.query(stmt + ';');
        
        // Mostrar progresso para comandos importantes
        if (stmt.includes('CREATE TABLE')) {
          const match = stmt.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?(\w+)/i);
          if (match) console.log(`  ✓ Tabela criada: ${match[1]}`);
        } else if (stmt.includes('INSERT INTO')) {
          const match = stmt.match(/INSERT INTO\s+(\w+)/i);
          if (match) console.log(`  ✓ Dados inseridos em: ${match[1]}`);
        }
        successCount++;
      } catch (error) {
        // Ignorar erros de "já existe"
        if (!error.message.includes('already exists') && 
            !error.message.includes('duplicate key')) {
          console.error(`  ✗ ${error.message.split('\n')[0]}`);
        }
      }
    }
    
    console.log(`\n✅ Seed concluído com ${successCount} comandos executados!`);
    console.log('\n📊 Tabelas criadas:');
    console.log('   - bncc_areas');
    console.log('   - bncc_competencias_gerais');
    console.log('   - bncc_habilidades');
    console.log('   - project_bncc_habilidades');
    console.log('   - project_wizard_draft');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error.message);
    process.exit(1);
  }
}

runBnccSeed();
