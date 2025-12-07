import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User, Project, Task, Submission, Attendance, Notification, sequelize } from './models/index.js';
import { seedDatabase } from './seeds-data.js';
import seedBNCCData from './seeds/bncc-data.js';
import seedReferences from './scripts/seed-references.js';
import seedRubricas from './seeds/rubricas-data.js';
import bnccRoutes from './routes/bncc.js';
import bnccDashboardRoutes from './routes/bncc-dashboard.js';
import bnccPdfRoutes from './routes/bncc-pdf.js';
import bnccRubricsRoutes from './routes/bncc-rubrics.js';
import bnccHistoryRoutes from './routes/bncc-history.js';
import bnccAdvancedRoutes from './routes/bncc-advanced.js';
import theoreticalReferencesRoutes from './routes/theoretical-references.js';
import aiFeaturesRoutes from './routes/ai-features.js';
import googleClassroomRoutes from './routes/google-classroom.js';
import rubricasRoutes from './routes/rubricas.js';
import rubricasV2Routes from './routes/rubricas-v2.js';
import coteachingRoutes from './routes/coteaching.routes.js';
import dashboardStatsRoutes from './routes/dashboard-stats.js';
import wizardBnccRoutes from './routes/wizard-bncc.js';
import classesRoutes from './routes/classes.js';
import teamChatRoutes from './routes/team-chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

import { verifyToken } from './middleware/auth.js';

// ===== DASHBOARD API =====
app.use('/api/dashboard', dashboardStatsRoutes);


// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ===== AUTENTICAÇÃO =====

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        const user = await User.create({
            email,
            password,
            name,
            role: role || 'student'
        });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: user.toJSON()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user || !user.validPassword(password)) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: user.toJSON()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ===== PROJETOS =====

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [{ model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }]
        });
        res.json(projects);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/projects', verifyToken, async (req, res) => {
    try {
        const { title, description, category, difficulty, deadline } = req.body;

        const project = await Project.create({
            title,
            description,
            category,
            difficulty,
            deadline,
            teacherId: req.user.id
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
                { model: Task, as: 'tasks' }
            ]
        });

        if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/projects/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ error: 'Projeto não encontrado' });

        await project.update(req.body);
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ===== TAREFAS =====

app.get('/api/tasks/project/:projectId', async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { projectId: req.params.projectId },
            include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }]
        });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/tasks', verifyToken, async (req, res) => {
    try {
        const { projectId, title, description, assignedToId, dueDate } = req.body;

        const task = await Task.create({
            projectId,
            title,
            description,
            assignedToId,
            dueDate
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/tasks/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

        await task.update(req.body);
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ===== SUBMISSÕES =====

app.post('/api/submissions', verifyToken, async (req, res) => {
    try {
        const { projectId, fileUrl, link, comment } = req.body;

        const submission = await Submission.create({
            projectId,
            studentId: req.user.id,
            fileUrl,
            link,
            comment
        });

        const project = await Project.findByPk(projectId);
        await Notification.create({
            recipientId: project.teacherId,
            type: 'message',
            title: 'Nova submissão',
            message: `Novo trabalho enviado no projeto ${project.title}`,
            relatedProjectId: projectId,
            priority: 'high'
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/submissions/:id/grade', verifyToken, async (req, res) => {
    try {
        const { grade, feedback } = req.body;

        const submission = await Submission.findByPk(req.params.id);
        if (!submission) return res.status(404).json({ error: 'Submissão não encontrada' });

        await submission.update({
            grade,
            feedback,
            gradedAt: new Date(),
            gradedById: req.user.id
        });

        await Notification.create({
            recipientId: submission.studentId,
            type: 'feedback',
            title: 'Trabalho avaliado',
            message: `Seu trabalho foi avaliado com nota ${grade}`,
            relatedProjectId: submission.projectId
        });

        res.json(submission);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ===== FREQUÊNCIA =====

app.post('/api/attendance', verifyToken, async (req, res) => {
    try {
        const { studentId, class: className, status } = req.body;

        const attendance = await Attendance.create({
            studentId,
            class: className,
            status,
            date: new Date()
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/attendance/student/:studentId', async (req, res) => {
    try {
        const attendance = await Attendance.findAll({
            where: { studentId: req.params.studentId },
            order: [['date', 'DESC']]
        });
        res.json(attendance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ===== NOTIFICAÇÕES =====

app.get('/api/notifications', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { recipientId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/notifications/:id/read', verifyToken, async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) return res.status(404).json({ error: 'Notificação não encontrada' });

        await notification.update({ read: true });
        res.json(notification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ===== USUÁRIOS =====

app.get('/api/users/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        res.json(user.toJSON());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users/:role', async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: req.params.role },
            attributes: ['id', 'name', 'email', 'role']
        });
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ===== HEALTH CHECK =====

// ===== ROTAS BNCC =====
app.use('/api/bncc', bnccRoutes);
app.use('/api/bncc-dashboard', bnccDashboardRoutes);
app.use('/api/bncc-pdf', bnccPdfRoutes);
app.use('/api/bncc-rubrics', bnccRubricsRoutes);
app.use('/api/bncc-history', bnccHistoryRoutes);
app.use('/api/bncc-advanced', bnccAdvancedRoutes);
app.use('/api', theoreticalReferencesRoutes);
app.use('/api/ai', aiFeaturesRoutes);
app.use('/api/google-classroom', googleClassroomRoutes);
app.use('/api/rubricas', rubricasRoutes);
app.use('/api/rubricas-v2', rubricasV2Routes);
app.use('/api/coteaching', verifyToken, coteachingRoutes);
app.use('/api/wizard-bncc', wizardBnccRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/teams', teamChatRoutes);

// ===== HEALTH CHECK =====

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.send("Backend PostgreSQL is running! 🚀 <br> Access the frontend at <a href='http://localhost:5173'>http://localhost:5173</a>");
});

// ===== SINCRONIZAR E INICIAR =====

if (process.env.NODE_ENV !== 'test') {
    // Apenas autenticar, não sincronizar (sincronização desabilitada para performance)
    sequelize.authenticate()
        .then(async () => {
            console.log('✅ PostgreSQL conectado');

            // NÃO rodar seeders (tabelas já existem e é muito lento)
            console.log('⏭️  Seeders desabilitados (tabelas já existem)');

            startServer();
        })
        .catch(err => {
            console.warn('⚠️  Erro ao conectar PostgreSQL:', err.message);
            console.warn('📝 Servidor vai subir em modo OFFLINE (sem banco de dados)');
            startServer();  // ← NÃO fazer process.exit(1), apenas subir sem DB
        });
    
    function startServer() {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando em porta ${PORT}`);
            console.log(`📍 Host: 0.0.0.0`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
            console.log(`🔗 URL: http://localhost:${PORT}`);
        });
    }
}

export default app;
