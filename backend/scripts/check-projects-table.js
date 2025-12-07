import sequelize from '../../config/database.js';

async function checkProjectsTable() {
  try {
    // Verificar estrutura da tabela projects
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'projects'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Estrutura da tabela projects:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    // Verificar se a coluna id é primary key
    const [pk] = await sequelize.query(`
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = 'projects'::regclass
      AND i.indisprimary
    `);
    
    console.log('\n🔑 Primary Key:');
    pk.forEach(k => console.log(`  - ${k.attname}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkProjectsTable();
