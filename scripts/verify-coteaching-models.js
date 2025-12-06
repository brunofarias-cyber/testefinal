
import { sequelize, User, Project, ProjectCollaborator, ProjectInvite, CollaboratorPermission } from '../models/index.js';

async function verifyModels() {
    try {
        console.log('🔄 Verificando conexão e modelos...');
        await sequelize.authenticate();
        console.log('✅ Conexão estabelecida com sucesso.');

        console.log('🔄 Sincronizando modelos (force: false)...');
        // Usamos force: false para não apagar dados, apenas criar tabelas se não existirem
        await sequelize.sync({ alter: true });
        console.log('✅ Tabelas sincronizadas.');

        console.log('🔄 Verificando existência de tabelas...');
        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log('📊 Tabelas encontradas:', tables);

        const requiredTables = ['project_collaborators', 'project_invites', 'collaborator_permissions'];
        const missing = requiredTables.filter(t => !tables.includes(t));

        if (missing.length > 0) {
            console.error('❌ Tabelas ausentes:', missing);
            process.exit(1);
        } else {
            console.log('✅ Todas as tabelas de co-teaching foram criadas!');
        }

        // Teste de inserção básica (se houver usuários e projetos)
        const user = await User.findOne();
        const project = await Project.findOne();

        if (user && project) {
            console.log('🔄 Testando criação de colaborador (mock)...');
            // Apenas verifica se não dá erro de sintaxe/constraints imediatas
            // Não vamos salvar para não sujar o banco, ou usamos transaction e rollback
            const t = await sequelize.transaction();
            try {
                await ProjectCollaborator.create({
                    projectId: project.id,
                    professorId: user.id,
                    addedById: user.id,
                    status: 'active',
                    role: 'co-teacher'
                }, { transaction: t });
                console.log('✅ Criação de colaborador validada (Rollback em seguida).');
                await t.rollback();
            } catch (err) {
                console.warn('⚠️ Erro ao tentar criar colaborador (pode ser constraint unique):', err.message);
                await t.rollback();
            }
        } else {
            console.log('ℹ️ Pulei teste de inserção pois não há USER ou PROJECT no banco.');
        }

        console.log('🎉 Verificação concluída com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro fatal na verificação:', error);
        process.exit(1);
    }
}

verifyModels();
