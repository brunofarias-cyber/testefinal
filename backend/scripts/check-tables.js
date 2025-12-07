import sequelize from '../../config/database.js';

async function checkTables() {
  try {
    console.log('🔍 Verificando tabelas existentes...\n');
    
    const [results] = await sequelize.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    
    console.log('📊 Tabelas existentes:');
    results.forEach(r => console.log(`  ✓ ${r.tablename}`));
    console.log(`\n✅ Total: ${results.length} tabelas`);
    
    // Verificar se a tabela projects existe
    const hasProjects = results.some(r => r.tablename === 'projects');
    const hasUsers = results.some(r => r.tablename === 'users');
    
    console.log('\n📋 Dependências necessárias para BNCC:');
    console.log(`  ${hasProjects ? '✅' : '❌'} projects`);
    console.log(`  ${hasUsers ? '✅' : '❌'} users`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkTables();
