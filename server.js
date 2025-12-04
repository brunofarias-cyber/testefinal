const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://bprojetos:SenhaSegura123@cluster.mongodb.net/bprojetos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB conectado')).catch(err => console.error('❌ Erro MongoDB:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_aqui_2024';

// ========== SCHEMAS ==========

// Usuário
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'coordinator'], default: 'student' },
    school: String,
    class: String,
    createdAt: { type: Date, default: Date.now },
    avatar: String,
    isActive: { type: Boolean, default: true }
});

// Projeto
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: String,
    difficulty: { type: String, enum: ['Fácil', 'Médio', 'Difícil'] },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: Date,
    deadline: Date,
    status: { type: String, enum: ['Planejamento', 'Em Andamento', 'Para Avaliação', 'Atrasado'], default: 'Planejamento' },
    progress: { type: Number, default: 0 },
    rubric: {
        criteria: [
            { name: String, weight: Number, levels: [String] }
        ]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Tarefa
const taskSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: String,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    dueDate: Date,
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    createdAt: { type: Date, default: Date.now }
});

// Submissão de trabalho
const submissionSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: String,
    link: String,
    comment: String,
    submittedAt: { type: Date, default: Date.now },
    grade: Number,
    feedback: String,
    gradedAt: Date,
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Frequência
const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    class: String,
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Presente', 'Ausente', 'Atrasado'], default: 'Presente' }
});

// Notificação
const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['deadline', 'feedback', 'message', 'achievement', 'announcement'], required: true },
    title: String,
    message: String,
    relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    read: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
    createdAt: { type: Date, default: Date.now }
});

// Criar modelos
const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);
const Submission = mongoose.model('Submission', submissionSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// ========== MIDDLEWARE DE AUTENTICAÇÃO ==========

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

// ========== ROTAS: AUTENTICAÇÃO ==========

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, name, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ success: true, token, user: { id: user._id, email, name, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ROTAS: PROJETOS ==========

app.get('/api/projects', verifyToken, async (req, res) => {
    try {
        const projects = await Project.find().populate('teacher', 'name email');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', verifyToken, async (req, res) => {
    try {
        const project = new Project({ ...req.body, teacher: req.user.id });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/projects/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('teacher students', 'name email avatar');
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/projects/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ROTAS: TAREFAS ==========

app.get('/api/tasks/project/:projectId', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tasks', verifyToken, async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/tasks/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ROTAS: SUBMISSÕES ==========

app.post('/api/submissions', verifyToken, async (req, res) => {
    try {
        const submission = new Submission({ ...req.body, student: req.user.id });
        await submission.save();

        // Notificar professor
        const project = await Project.findById(req.body.project);
        new Notification({
            recipient: project.teacher,
            type: 'message',
            title: 'Nova submissão',
            message: `Um aluno enviou trabalho`,
            relatedProject: req.body.project
        }).save();

        res.status(201).json(submission);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/submissions/:id/grade', verifyToken, async (req, res) => {
    try {
        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { grade: req.body.grade, feedback: req.body.feedback, gradedBy: req.user.id, gradedAt: new Date() },
            { new: true }
        );

        // Notificar aluno
        new Notification({
            recipient: submission.student,
            type: 'feedback',
            title: 'Feedback recebido',
            message: `Seu trabalho foi avaliado`,
            relatedProject: submission.project
        }).save();

        res.json(submission);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ROTAS: FREQUÊNCIA ==========

app.post('/api/attendance', verifyToken, async (req, res) => {
    try {
        const attendance = new Attendance(req.body);
        await attendance.save();
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/attendance/student/:studentId', verifyToken, async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.params.studentId });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ROTAS: NOTIFICAÇÕES ==========

app.get('/api/notifications', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/notifications/:id/read', verifyToken, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ROTAS: USUÁRIOS ==========

app.get('/api/users/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users/:role', verifyToken, async (req, res) => {
    try {
        const users = await User.find({ role: req.params.role }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== ROTAS: ANALYTICS ==========

app.get('/api/analytics/performance/:studentId', verifyToken, async (req, res) => {
    try {
        const submissions = await Submission.find({ student: req.params.studentId });
        const avgGrade = submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / submissions.length || 0;
        const attendance = await Attendance.find({ student: req.params.studentId });
        const presentCount = attendance.filter(a => a.status === 'Presente').length;
        const percentage = (presentCount / attendance.length) * 100 || 0;

        res.json({ averageGrade: avgGrade.toFixed(1), attendancePercentage: percentage.toFixed(1), submissionCount: submissions.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ========== HEALTH CHECK ==========

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.send("Backend MongoDB is running! 🚀 <br> Access the frontend at <a href='http://localhost:5173'>http://localhost:5173</a>");
});

// ========== INICIAR SERVIDOR ==========

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
