import db from '../models/index.js';
import seedCoTeaching from '../seeds/coteaching-seed.js';

/**
 * Script para executar migration e seed de Co-Teaching
 * Uso: node scripts/run-coteaching-migration.js
 */

async function runMigration() {
    try {
        console.log('🚀 Iniciando configuração de Co-Teaching...\n');

        // 1. Sync do banco de dados
        console.log('📦 Sincronizando models com o banco de dados...');
        await db.sequelize.sync({ alter: true });
        console.log('✅ Sync concluído\n');

        // 2. Executar seed
        console.log('🌱 Executando seed de dados de teste...');
        await seedCoTeaching();

        console.log('\n✨ Configuração de Co-Teaching concluída com sucesso!');
        console.log('\n📋 Próximos passos:');
        console.log('1. Acesse http://localhost:5173');
        console.log('2. Faça login com professor1@escola.com');
        console.log('3. Vá para o projeto "Horta Sustentável Colaborativa"');
        console.log('4. Clique na aba "Colaboradores"');
        console.log('5. Teste convidar novos professores!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro durante a configuração:', error);
        process.exit(1);
    }
}

runMigration();
