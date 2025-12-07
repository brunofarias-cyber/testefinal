import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { User, Project, Task, Submission, Attendance, Notification, sequelize } from './models/index.js';
import bnccRoutes from './routes/bncc.js';
import bnccDashboardRoutes from './routes/bncc-dashboard.js';
import bnccPdfRoutes from './routes/bncc-pdf.js';
import bnccRubricsRoutes from './routes/bncc-rubrics.js';
import bnccHistoryRoutes from './routes/bncc-history.js';
import bnccAdvancedRoutes from './routes/bncc-advanced.js';
import theoreticalReferencesRoutes from './routes/theoretical-references.js';
import aiFeaturesRoutes from './routes/ai-features.js';
import dashboardStatsRoutes from './routes/dashboard-stats.js';
import wizardBnccRoutes from './routes/wizard-bncc.js';
import classesRoutes from './routes/classes.js';
import teamChatRoutes from './routes/team-chat.js';
import messagesRoutes from './routes/messages.js';
import teamsRoutes from './routes/teams.js';
import studentProjectsRoutes from './routes/student-projects.js';

dotenv.config();

console.log('✅ TODAS as rotas importadas com sucesso');

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// ===== ROTAS BNCC =====
app.use('/api/bncc', bnccRoutes);
app.use('/api/bncc/dashboard', bnccDashboardRoutes);
app.use('/api/bncc/pdf', bnccPdfRoutes);
app.use('/api/bncc/rubrics', bnccRubricsRoutes);
app.use('/api/bncc/history', bnccHistoryRoutes);
app.use('/api/bncc/advanced', bnccAdvancedRoutes);

// ===== OUTRAS ROTAS =====
app.use('/api/theoretical-references', theoreticalReferencesRoutes);
app.use('/api/ai-features', aiFeaturesRoutes);
app.use('/api/dashboard', dashboardStatsRoutes);
app.use('/api/wizard-bncc', wizardBnccRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/team-chat', teamChatRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/student-projects', studentProjectsRoutes);

// ===== AUTENTICAÇÃO =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Verifica se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email já cadastrado' });
    }

    const user = await User.create({
      email,
      password,
      name,
      role: role || 'student'
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'seu-secret-key-aqui',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no register:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Email ou senha incorretos' });
    }

    // Verifica senha
    const isValid = user.validPassword ? user.validPassword(password) : (user.password === password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Email ou senha incorretos' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'seu-secret-key-aqui',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===== STATIC FRONTEND (Vite build) =====
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: sequelize ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend BProjetos API', 
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/bncc',
      '/api/classes',
      '/api/team-chat',
      '/api/wizard-bncc',
      '/api/messages'
    ]
  });
});

// SPA fallback para o frontend
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server immediately
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
