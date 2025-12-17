import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { User, Project, Task, Submission, Attendance, Notification, sequelize } from './models/index.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler, asyncHandler } from './middleware/errorHandler.js';
import { globalLimiter, authLimiter, apiLimiter, communicationLimiter } from './middleware/rateLimiter.js';
import { handleValidationErrors, sanitizeInputs } from './middleware/validators.js';
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
import rubricasRoutes from './routes/rubricas.js';
import oauthRoutes from './routes/oauth.js';
import syncRoutes from './routes/sync.js';
import gradesRoutes from './routes/grades.js';
import attendanceRoutes from './routes/attendance.js';
import submissionsRoutes from './routes/submissions.js';
import rubricsRoutes from './routes/rubrics.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

console.log('✅ TODAS as rotas importadas com sucesso');

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(sanitizeInputs); // Sanitizar inputs
app.use(globalLimiter); // Rate limit global
app.use(handleValidationErrors); // Validação de erros

// Log de requisições
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

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
app.use('/api/rubricas', rubricasRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/rubrics', rubricsRoutes);
app.use(oauthRoutes);
app.use(syncRoutes);

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

// ===== STATIC FRONTEND (Vite build) =====
// Usar caminhos relativos para funcionar tanto em dev como em produção
const distPath = process.env.NODE_ENV === 'production' 
  ? path.resolve('/opt/render/project', 'dist')  // Render
  : path.join(__dirname, 'dist');                 // Local

console.log(`📁 Procurando dist em: ${distPath}`);
console.log(`📊 NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`📊 __dirname: ${__dirname}`);

// Verificar se dist existe
const distExists = fs.existsSync(distPath);
console.log(`📦 Pasta dist existe: ${distExists}`);

if (distExists) {
  app.use(express.static(distPath, {
    maxAge: '1h',
    etag: false
  }));
  console.log(`✅ Servindo arquivos estáticos de: ${distPath}`);
} else {
  console.warn(`⚠️  Pasta dist não encontrada em: ${distPath}`);
}

// SPA fallback para o frontend - deve vir ANTES do root endpoint
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not Found' });
  }
  
  if (distExists) {
    const indexPath = path.join(distPath, 'index.html');
    console.log(`🔄 SPA Fallback: Serving ${indexPath}`);
    return res.sendFile(indexPath);
  }
  
  // Se dist não existir, retornar página de instrução
  res.status(200).json({
    message: 'Backend NEXO API',
    version: '1.0.0',
    info: 'Frontend não foi construído. Execute: npm run build',
    distPath: distPath,
    distExists: distExists,
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

// Rota específica para a raiz
app.get('/', (req, res) => {
  if (distExists) {
    const indexPath = path.join(distPath, 'index.html');
    console.log(`✅ Root (/) sendo servido: ${indexPath}`);
    return res.sendFile(indexPath);
  }
  res.status(200).json({ message: 'Backend NEXO API - Frontend not built' });
});

// Start server immediately
if (process.env.NODE_ENV !== 'test') {
  // Criar servidor HTTP para Socket.io
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // Disponibilizar io para as rotas
  app.io = io;

  // Configurar Socket.io
  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);

    // Aluno entra em sua sala pessoal
    socket.on('join-student', (studentId) => {
      socket.join(`student-${studentId}`);
      console.log(`👨‍🎓 Aluno ${studentId} entrou na sala`);
    });

    // Professor entra em sua sala
    socket.on('join-teacher', (teacherId) => {
      socket.join(`teacher-${teacherId}`);
      console.log(`👨‍🏫 Professor ${teacherId} entrou na sala`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });

  // Iniciar servidor IMEDIATAMENTE (sem bloquear na conexão do banco)
  const isProduction = process.env.NODE_ENV === 'production';
  const host = isProduction ? '0.0.0.0' : '127.0.0.1';

  server.listen(PORT, host, () => {
    console.log(`✅ Servidor NEXO rodando!`);
    console.log(`   🌐 URL: http://localhost:${PORT}`);
    console.log(`   🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`   📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   🔌 Socket.io: ✅ Ativo`);
    console.log(`   🔗 Host: ${host}`);
  });

  // Também escutar em IPv6
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Porta ${PORT} já está em uso`);
    } else {
      console.error('Erro no servidor:', err);
    }
  });

  // Conectar ao banco de dados EM BACKGROUND (não bloqueia o servidor)
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Banco de dados conectado com sucesso!');
      return sequelize.sync({ alter: true });
    })
    .then(() => {
      console.log(`   💾 Banco: ✅ PostgreSQL Conectado`);
    })
    .catch((err) => {
      console.error('❌ Erro ao conectar banco de dados:', err.message);
      console.warn('⚠️  Operando em modo offline (dados não persistirão)');
      console.log(`   💾 Banco: ⚠️  Offline (usando mock data)`);
    });
}

// ===== MIDDLEWARE DE ERRO (DEVE ESTAR AO FINAL) =====
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
