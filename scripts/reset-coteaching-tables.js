import db from '../models/index.js';
import seedCoTeaching from '../seeds/coteaching-seed.js';

/**
 * Script para limpar e recriar tabelas Co-Teaching
 * Uso: node scripts/reset-coteaching-tables.js
 */

async function resetCoTeachingTables() {
    try {
        console.log('🔄 Limpando tabelas antigas de Co-Teaching...\n');

        const { sequelize } = db;

        // 1. Dropar tabelas na ordem correta (devido a foreign keys)
        console.log('📦 Removendo tabelas antigas...');
        await sequelize.query('DROP TABLE IF EXISTS collaborator_permissions CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS project_invites CASCADE;');
        await sequelize.query('DROP TABLE IF EXISTS project_collaborators CASCADE;');

        console.log('✅ Tabelas antigas removidas\n');

        // 2. Recriar tabelas com sync
        console.log('📦 Recriando tabelas com schema em PORTUGUÊS...');
        await db.ProjectCollaborator.sync({ force: true });
        await db.ProjectInvite.sync({ force: true });
        await db.CollaboratorPermission.sync({ force: true });

        console.log('✅ Tabelas recriadas\n');

        // 3. Executar seed
        console.log('🌱 Executando seed de dados de teste...');
        await seedCoTeaching();

        console.log('\n✨ Reset e configuração de Co-Teaching concluídos!');
        console.log('\n📋 Próximos passos:');
        console.log('1. Acesse http://localhost:5173');
        console.log('2. Faça login com professor1@escola.com (senha: admin123)');
        console.log('3. Vá para o projeto "Horta Sustentável Colaborativa"');
        console.log('4. Clique na aba "Colaboradores"');
        console.log('5. Teste convidar novos professores!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erro durante o reset:', error);
        process.exit(1);
    }
}

resetCoTeachingTables();
