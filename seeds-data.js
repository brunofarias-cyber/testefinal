import { User, Project, Task, Submission, Attendance, Notification, sequelize } from './models/index.js';

export const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando seed de dados...');

        // Sincronizar banco (criar tabelas se não existirem)
        await sequelize.sync({ alter: true });
        console.log('✅ Tabelas criadas');

        // Verificar se já existe dados
        const userCount = await User.count();
        if (userCount > 0) {
            console.log('⚠️ Banco já possui dados. Pulando seed.');
            return;
        }

        // ===== CRIAR USUÁRIOS =====

        const professor = await User.create({
            email: 'professor@bprojetos.com',
            password: 'prof123',
            name: 'Ana Silva',
            role: 'teacher'
        });
        console.log('✅ Professor criado:', professor.email);

        const aluno = await User.create({
            email: 'aluno@bprojetos.com',
            password: 'aluno123',
            name: 'João Silva',
            role: 'student'
        });
        console.log('✅ Aluno criado:', aluno.email);

        const aluno2 = await User.create({
            email: 'aluno2@bprojetos.com',
            password: 'aluno123',
            name: 'Maria Oliveira',
            role: 'student'
        });
        console.log('✅ Aluno 2 criado:', aluno2.email);

        const coordenador = await User.create({
            email: 'coordenador@bprojetos.com',
            password: 'coord123',
            name: 'Roberto Lima',
            role: 'coordinator'
        });
        console.log('✅ Coordenador criado:', coordenador.email);

        // ===== CRIAR PROJETOS =====

        const project1 = await Project.create({
            title: 'Horta Sustentável',
            description: 'Desenvolvimento de uma horta urbana com técnicas sustentáveis',
            category: 'Ciências',
            difficulty: 'Médio',
            teacherId: professor.id,
            status: 'Em Andamento',
            progress: 65,
            rubric: {
                criteria: [
                    { name: 'Investigação Científica', weight: 40, levels: ['Não apresentou', 'Dados superficiais', 'Dados relevantes', 'Análise profunda'] },
                    { name: 'Trabalho em Equipe', weight: 30, levels: ['Conflitos constantes', 'Colaboração mínima', 'Boa divisão', 'Sinergia total'] },
                    { name: 'Comunicação Oral', weight: 30, levels: ['Leitura de slides', 'Pouco clara', 'Boa oratória', 'Engajadora'] }
                ]
            }
        });
        console.log('✅ Projeto 1 criado:', project1.title);

        const project2 = await Project.create({
            title: 'Robótica com Sucata',
            description: 'Construir robô usando materiais recicláveis',
            category: 'Exatas',
            difficulty: 'Difícil',
            teacherId: professor.id,
            status: 'Em Andamento',
            progress: 45
        });
        console.log('✅ Projeto 2 criado:', project2.title);

        const project3 = await Project.create({
            title: 'Jornal Digital',
            description: 'Criar um jornal digital com notícias da escola',
            category: 'Linguagens',
            difficulty: 'Fácil',
            teacherId: professor.id,
            status: 'Planejamento',
            progress: 10
        });
        console.log('✅ Projeto 3 criado:', project3.title);

        // ===== CRIAR TAREFAS =====

        const task1 = await Task.create({
            projectId: project1.id,
            title: 'Pesquisar plantas',
            description: 'Pesquisar plantas adequadas para horta urbana',
            assignedToId: aluno.id,
            status: 'done',
            priority: 'high'
        });
        console.log('✅ Tarefa 1 criada:', task1.title);

        const task2 = await Task.create({
            projectId: project1.id,
            title: 'Preparar solo',
            description: 'Preparação e adubação do solo',
            assignedToId: aluno2.id,
            status: 'in-progress',
            priority: 'normal'
        });
        console.log('✅ Tarefa 2 criada:', task2.title);

        const task3 = await Task.create({
            projectId: project1.id,
            title: 'Documentar processo',
            description: 'Fotografar e documentar o processo',
            assignedToId: aluno.id,
            status: 'todo',
            priority: 'normal'
        });
        console.log('✅ Tarefa 3 criada:', task3.title);

        // ===== CRIAR SUBMISSÕES =====

        const submission1 = await Submission.create({
            projectId: project1.id,
            studentId: aluno.id,
            fileUrl: 'https://example.com/horta-relatorio.pdf',
            comment: 'Relatório com fotos e análise',
            submittedAt: new Date('2024-01-15'),
            grade: 9.0,
            feedback: 'Excelente trabalho! Documentação muito clara.',
            gradedAt: new Date('2024-01-16'),
            gradedById: professor.id
        });
        console.log('✅ Submissão 1 criada (avaliada)');

        const submission2 = await Submission.create({
            projectId: project1.id,
            studentId: aluno2.id,
            fileUrl: 'https://example.com/horta-maria.pdf',
            comment: 'Meu relatório da horta',
            submittedAt: new Date('2024-01-15')
        });
        console.log('✅ Submissão 2 criada (pendente)');

        // ===== CRIAR FREQUÊNCIA =====

        await Attendance.create({
            studentId: aluno.id,
            class: '7º Ano A',
            status: 'Presente',
            date: new Date()
        });

        await Attendance.create({
            studentId: aluno2.id,
            class: '7º Ano A',
            status: 'Presente',
            date: new Date()
        });

        console.log('✅ Frequência criada');

        // ===== CRIAR NOTIFICAÇÕES =====

        await Notification.create({
            recipientId: professor.id,
            type: 'message',
            title: 'Nova submissão',
            message: 'João Silva enviou o trabalho do projeto Horta Sustentável',
            relatedProjectId: project1.id,
            priority: 'high'
        });

        await Notification.create({
            recipientId: aluno.id,
            type: 'feedback',
            title: 'Trabalho avaliado',
            message: 'Seu trabalho foi avaliado com nota 9.0',
            relatedProjectId: project1.id,
            priority: 'high'
        });

        await Notification.create({
            recipientId: aluno.id,
            type: 'deadline',
            title: 'Nova tarefa disponível',
            message: 'Prepare o solo do projeto Horta Sustentável',
            relatedProjectId: project1.id,
            priority: 'normal'
        });

        console.log('✅ Notificações criadas');

        console.log('\n✨ SEED COMPLETO!\n');
        console.log('📋 CREDENCIAIS DE LOGIN:\n');
        console.log('👨‍🏫 PROFESSOR:');
        console.log('   Email: professor@bprojetos.com');
        console.log('   Senha: prof123\n');
        console.log('👨‍🎓 ALUNO:');
        console.log('   Email: aluno@bprojetos.com');
        console.log('   Senha: aluno123\n');
        console.log('👨‍💼 COORDENADOR:');
        console.log('   Email: coordenador@bprojetos.com');
        console.log('   Senha: coord123\n');

    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
    }
};

// Executar seed se for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase().then(() => {
        console.log('🎉 Seed finalizado!');
        process.exit(0);
    }).catch(err => {
        console.error('❌ Erro:', err);
        process.exit(1);
    });
}
