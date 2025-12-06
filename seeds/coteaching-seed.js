import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import db from '../models/index.js';

const { User, Project, ProjectCollaborator, ProjectInvite, CollaboratorPermission } = db;

/**
 * Script de Seed para Co-Teaching
 * Versão em PORTUGUÊS - Atualizado
 */
async function seedCoTeaching() {
    try {
        console.log('🌱 Iniciando seed de Co-Teaching...\n');

        // 1. Buscar ou criar usuários de teste
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const [teacher1] = await User.findOrCreate({
            where: { email: 'professor1@escola.com' },
            defaults: {
                id: uuidv4(),
                name: 'Carlos Silva',
                email: 'professor1@escola.com',
                password: hashedPassword,
                role: 'teacher'
            }
        });

        const [teacher2] = await User.findOrCreate({
            where: { email: 'professor2@escola.com' },
            defaults: {
                id: uuidv4(),
                name: 'Maria Santos',
                email: 'professor2@escola.com',
                password: hashedPassword,
                role: 'teacher'
            }
        });

        const [teacher3] = await User.findOrCreate({
            where: { email: 'professor3@escola.com' },
            defaults: {
                id: uuidv4(),
                name: 'João Oliveira',
                email: 'professor3@escola.com',
                password: hashedPassword,
                role: 'teacher'
            }
        });

        console.log('✅ Usuários de teste criados/encontrados');

        // 2. Criar projeto de exemplo
        const [project1] = await Project.findOrCreate({
            where: { title: 'Horta Sustentável Colaborativa' },
            defaults: {
                id: uuidv4(),
                title: 'Horta Sustentável Colaborativa',
                description: 'Projeto multidisciplinar de horta sustentável com co-professores de Ciências e Matemática',
                status: 'Em Andamento',
                teacherId: teacher1.id,
                progress: 45
            }
        });

        console.log('✅ Projeto de exemplo criado/atualizado');

        // 3. Adicionar colaborador ativo (usando campos em PORTUGUÊS)
        const [collaborator1] = await ProjectCollaborator.findOrCreate({
            where: {
                projetoId: project1.id,
                professorId: teacher2.id
            },
            defaults: {
                id: uuidv4(),
                projetoId: project1.id,
                professorId: teacher2.id,
                adicionadoPorId: teacher1.id,
                status: 'ativo',
                papel: 'co-professor',
                adicionadoEm: new Date()
            }
        });

        console.log('✅ Colaborador ativo adicionado');

        // 4. Adicionar permissões
        const permissions = [
            'view_project',
            'edit_project',
            'evaluate_teams',
            'view_feedback',
            'edit_feedback'
        ];

        for (const perm of permissions) {
            await CollaboratorPermission.findOrCreate({
                where: {
                    collaboratorId: collaborator1.id,
                    permission: perm
                },
                defaults: {
                    id: uuidv4(),
                    collaboratorId: collaborator1.id,
                    permission: perm,
                    grantedAt: new Date()
                }
            });
        }

        console.log('✅ Permissões concedidas ao colaborador');

        // 5. Criar convite pendente (usando campos em PORTUGUÊS)
        const inviteToken = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const [invite1] = await ProjectInvite.findOrCreate({
            where: {
                projetoId: project1.id,
                emailConvidado: teacher3.email,
                status: 'pendente'
            },
            defaults: {
                id: uuidv4(),
                projetoId: project1.id,
                emailConvidado: teacher3.email,
                convidadoPorId: teacher1.id,
                token: inviteToken,
                status: 'pendente',
                criadoEm: new Date(),
                expiresAt: expiresAt
            }
        });

        console.log('✅ Convite pendente criado');
        console.log(`📧 Link de convite: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/convite/aceitar/${inviteToken}`);

        // 6. Segundo projeto
        const [project2] = await Project.findOrCreate({
            where: { title: 'Robótica Educacional' },
            defaults: {
                id: uuidv4(),
                title: 'Robótica Educacional',
                description: 'Projeto de robótica com Arduino - Colaboração entre Física e Programação',
                status: 'Planejamento',
                teacherId: teacher2.id,
                progress: 15
            }
        });

        // Adicionar teacher1 como avaliador (usando campos em PORTUGUÊS)
        const [collaborator2] = await ProjectCollaborator.findOrCreate({
            where: {
                projetoId: project2.id,
                professorId: teacher1.id
            },
            defaults: {
                id: uuidv4(),
                projetoId: project2.id,
                professorId: teacher1.id,
                adicionadoPorId: teacher2.id,
                status: 'ativo',
                papel: 'avaliador',
                adicionadoEm: new Date()
            }
        });

        await CollaboratorPermission.findOrCreate({
            where: {
                collaboratorId: collaborator2.id,
                permission: 'view_project'
            },
            defaults: {
                id: uuidv4(),
                collaboratorId: collaborator2.id,
                permission: 'view_project',
                grantedAt: new Date()
            }
        });

        await CollaboratorPermission.findOrCreate({
            where: {
                collaboratorId: collaborator2.id,
                permission: 'evaluate_teams'
            },
            defaults: {
                id: uuidv4(),
                collaboratorId: collaborator2.id,
                permission: 'evaluate_teams',
                grantedAt: new Date()
            }
        });

        console.log('✅ Segundo projeto e avaliador criados');

        // Resumo
        console.log('\n📊 RESUMO DO SEED:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👥 Professores criados: 3`);
        console.log(`📁 Projetos criados: 2`);
        console.log(`🤝 Colaboradores ativos: 2`);
        console.log(`📧 Convites pendentes: 1`);
        console.log(`🔐 Permissões configuradas: ${permissions.length + 2}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('🎉 Seed de Co-Teaching (PORTUGUÊS) concluído!\n');
        console.log('📌 Credenciais de teste:');
        console.log('   Email: professor1@escola.com | Senha: admin123');
        console.log('   Email: professor2@escola.com | Senha: admin123');
        console.log('   Email: professor3@escola.com | Senha: admin123\n');

    } catch (error) {
        console.error('❌ Erro ao executar seed de Co-Teaching:', error);
        throw error;
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    seedCoTeaching()
        .then(() => {
            console.log('✅ Script finalizado');
            process.exit(0);
        })
        .catch(err => {
            console.error('❌ Erro fatal:', err);
            process.exit(1);
        });
}

export default seedCoTeaching;
