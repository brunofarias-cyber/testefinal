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
import { setupAIRoutes } from './src/api/wizardAI.js';
import classesRoutes from './routes/classes.js';
import teamChatRoutes from './routes/team-chat.js';
import teamMessagesRoutes from './routes/teamMessages.js';
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
import { Sequelize } from 'sequelize';

dotenv.config();

console.log('✅ TODAS as rotas importadas com sucesso');

const app = express();
const PORT = process.env.PORT || 4000; // Alterar a porta para 4000
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

// Coleta de logs enviados pelo frontend (ajuda a diagnosticar tela em branco)
app.post('/api/client-log', express.json({ limit: '200kb' }), (req, res) => {
  const { level = 'log', message = '', timestamp = new Date().toISOString() } = req.body || {};
  const logFn = level === 'error' ? console.error : console.log;
  logFn('CLIENT LOG:', { level, message, timestamp });
  res.sendStatus(204);
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

// Setup das rotas de IA para sugestão de habilidades
setupAIRoutes(app);

app.use('/api/classes', classesRoutes);
app.use('/api/team-chat', teamChatRoutes);
app.use('/api/team-messages', teamMessagesRoutes);
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

// Fallbacks leves para evitar 404 em produção quando o banco não responder
app.get('/api/teams', (req, res) => {
  res.json({
    data: [
      { id: 1, name: 'Equipe Alpha', projectName: 'Projeto Alpha', members: ['Ana', 'Bruno'] },
      { id: 2, name: 'Equipe Beta', projectName: 'Projeto Beta', members: ['Carlos', 'Diana'] }
    ],
    mock: true
  });
});

app.get('/api/messages', (req, res) => {
  res.json({
    data: [
      { id: 1, teamId: 1, sender: 'Prof. Ana', text: 'Bem-vindos!', timestamp: new Date().toISOString() },
      { id: 2, teamId: 1, sender: 'Bruno', text: 'Olá!', timestamp: new Date().toISOString() }
    ],
    mock: true
  });
});

app.get('/api/attendance', (req, res) => {
  res.json({
    data: [
      { id: 1, student: 'João Silva', status: 'present', date: new Date().toISOString() },
      { id: 2, student: 'Maria Souza', status: 'absent', date: new Date().toISOString() }
    ],
    mock: true
  });
});

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

// Client-side logging endpoint
const clientLogs = [];
app.post('/api/client-log', express.json({ limit: '1MB' }), (req, res) => {
  try {
    console.log(`📝 Raw req.body type:`, typeof req.body, `keys:`, Object.keys(req.body || {}));
    const { level, message, timestamp } = req.body || {};
    if (typeof level === 'string' && message) {
      const logEntry = { level, message, timestamp, clientTime: new Date().toISOString() };
      clientLogs.push(logEntry);
      console.log(`📱 [CLIENT-${level.toUpperCase()}] ${message}`);
    } else {
      console.log(`📱 [CLIENT-INVALID-LOG] Dados inválidos recebidos:`, req.body);
    }
  } catch (e) {
    console.log(`📱 [CLIENT-ERROR] ${e.message}`);
  }
  res.status(204).send();
});

app.get('/api/client-logs', (req, res) => {
  res.json({ logs: clientLogs.slice(-100) }); // Return last 100 logs
});

// ===== STATIC FRONTEND (Vite build) =====
// Procurar em vários caminhos possíveis - RENDER pode variar
let distPath = null;
let distExists = false;

const possiblePaths = [
  path.join(__dirname, 'dist'),                          // Local (dev)
  '/opt/render/project/dist',                            // Render padrão
  `${process.cwd()}/dist`,                               // CWD
  '/workspace/dist',                                     // Alternativo
  path.resolve(__dirname, '../dist'),                    // Relativo
  path.resolve(__dirname, '../../dist'),                 // Relativo 2
];

console.log(`📁 Procurando DIST...`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   __dirname: ${__dirname}`);
console.log(`   process.cwd(): ${process.cwd()}`);
console.log(`   Verificando ${possiblePaths.length} caminhos...`);

for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    distPath = testPath;
    distExists = true;
    console.log(`✅ ENCONTRADO: ${testPath}`);
    
    // Listar arquivos em dist
    try {
      const files = fs.readdirSync(testPath);
      console.log(`   Conteúdo: ${files.slice(0, 5).join(', ')}`);
    } catch (e) {
      console.error(`   Erro ao listar: ${e.message}`);
    }
    break;
  } else {
    console.log(`   ❌ ${testPath}`);
  }
}

if (!distExists) {
  console.warn(`⚠️⚠️⚠️ NENHUM DIST ENCONTRADO! ⚠️⚠️⚠️`);
  console.log(`Tentando construir automaticamente...`);
  
  try {
    // Tentar construir automaticamente
    const { execSync } = await import('child_process');
    
    console.log(`📋 Node.js: ${process.version}`);
    console.log(`🏗️  Executando: npx vite build (timeout: 120s)`);
    
    execSync('npx vite build', { 
      cwd: __dirname,
      stdio: 'inherit',
      timeout: 120000 // 2 minutos
    });
    
    // Verificar se foi criado
    if (fs.existsSync(path.join(__dirname, 'dist'))) {
      distPath = path.join(__dirname, 'dist');
      distExists = true;
      console.log(`✅ DIST CONSTRUÍDO COM SUCESSO: ${distPath}`);
    } else {
      console.error(`❌ Build completou mas dist/ não foi criado`);
    }
  } catch (e) {
    console.error(`❌ Erro ao construir dist:`, e.message);
  }
  
  if (!distExists) {
    console.log(`Listando conteúdo de __dirname (${__dirname}):`);
    try {
      const files = fs.readdirSync(__dirname);
      console.log(`   Arquivos: ${files.join(', ')}`);
      
      // Procurar recursivamente por pasta dist (ignorando node_modules)
      const findDist = (dir, depth = 0) => {
        if (depth > 3) return null;
        try {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            if (file === 'dist') {
              const fullPath = path.join(dir, file);
              if (fs.statSync(fullPath).isDirectory()) {
                return fullPath;
              }
            }
          }
          // Procurar em subdiretórios (ignorar node_modules e .git)
          for (const file of files) {
            if (file.startsWith('.') || file === 'node_modules') continue;
            const fullPath = path.join(dir, file);
            try {
              if (fs.statSync(fullPath).isDirectory()) {
                const result = findDist(fullPath, depth + 1);
                if (result) return result;
              }
            } catch (e) {
              // Ignore permission errors
            }
          }
        } catch (e) {
          // Ignore
        }
        return null;
      };
      
      const foundDist = findDist(__dirname);
      if (foundDist) {
        distPath = foundDist;
        distExists = true;
        console.log(`✅ DIST ENCONTRADO (busca recursiva): ${foundDist}`);
      }
    } catch (e) {
      console.error(`   Erro ao listar: ${e.message}`);
    }
  }
  
  if (!distExists) {
    distPath = possiblePaths[0];
  }
}

if (distExists) {
  app.use(express.static(distPath, {
    maxAge: '1h',
    etag: false
  }));
  console.log(`✅ SERVINDO ESTÁTICOS DE: ${distPath}`);
} else {
  console.warn(`⚠️⚠️⚠️ DIST NÃO ENCONTRADO - FRONTEND NÃO SERÁ SERVIDO ⚠️⚠️⚠️`);
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

  // Map para rastrear usuários online: userId -> { name, socketId, timestamp }
  const onlineUsers = new Map();

  // Configurar Socket.io
  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);

    // ===== PRESENÇA =====
    socket.on('user-online', (data) => {
      const { userId, userName, timestamp } = data;
      
      // Armazenar usuário online
      onlineUsers.set(userId, {
        name: userName,
        socketId: socket.id,
        timestamp,
        status: 'online'
      });
      
      console.log(`🟢 Usuário ${userName} (${userId}) conectado`);
      
      // Notificar todos sobre novo usuário online
      io.emit('user-online', {
        userId,
        userName,
        timestamp,
        socketId: socket.id
      });
    });

    // Solicitar lista de usuários online
    socket.on('get-online-users', () => {
      const usersList = Array.from(onlineUsers.values()).map((user, index) => {
        const userId = Array.from(onlineUsers.keys())[index];
        return {
          userId,
          userName: user.name,
          timestamp: user.timestamp,
          socketId: user.socketId
        };
      });
      
      socket.emit('online-users-list', { users: usersList });
    });

    // Usuário desconectando
    socket.on('user-offline', (data) => {
      const { userId } = data;
      const user = onlineUsers.get(userId);
      
      if (user) {
        onlineUsers.delete(userId);
        console.log(`🔴 Usuário ${user.name} (${userId}) desconectado`);
        
        // Notificar todos sobre desconexão
        io.emit('user-offline', {
          userId,
          timestamp: new Date()
        });
      }
    });

    // ===== SALAS PESSOAIS =====
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

    // ===== CHAT EM EQUIPES =====
    // Entrar em sala de equipe
    socket.on('join-team', (teamId) => {
      socket.join(`team-${teamId}`);
      console.log(`📢 Usuário entrou na equipe ${teamId}`);
      io.to(`team-${teamId}`).emit('user-joined', { teamId, socketId: socket.id });
    });

    // Enviar mensagem em equipe
    socket.on('send-team-message', (data) => {
      const { teamId, message, sender, timestamp } = data;
      io.to(`team-${teamId}`).emit('receive-team-message', {
        teamId,
        message,
        sender,
        timestamp: timestamp || new Date(),
        socketId: socket.id
      });
      console.log(`💬 Mensagem de equipe em ${teamId} de ${sender}`);
    });

    // Indicador de digitação
    socket.on('user-typing', (data) => {
      const { teamId, userId, userName, isTyping } = data;
      if (isTyping) {
        console.log(`⌨️ ${userName} está digitando no time ${teamId}`);
      }
      io.to(`team-${teamId}`).emit('user-typing', {
        userId,
        userName,
        isTyping,
        teamId
      });
    });

    // ===== NOTAS EM TEMPO REAL =====
    // Professor envia nota para aluno
    socket.on('send-grade', (data) => {
      const { studentId, projectId, finalGrade, feedback, teacher } = data;
      io.to(`student-${studentId}`).emit('grade-received', {
        projectId,
        finalGrade,
        feedback,
        teacher,
        timestamp: new Date()
      });
      console.log(`📝 Nota enviada para aluno ${studentId}`);
    });

    // Notificar atualização de nota
    socket.on('grade-updated', (data) => {
      const { studentId, gradeId, finalGrade } = data;
      io.to(`student-${studentId}`).emit('grade-update-notification', {
        gradeId,
        finalGrade,
        timestamp: new Date()
      });
      console.log(`📝 Atualização de nota para aluno ${studentId}`);
    });

    // ===== PRESENÇA EM TEMPO REAL =====
    // Professor marca presença
    socket.on('mark-attendance', (data) => {
      const { studentId, status, classId } = data;
      io.to(`student-${studentId}`).emit('attendance-marked', {
        status,
        classId,
        timestamp: new Date()
      });
      console.log(`✅ Presença marcada para aluno ${studentId}: ${status}`);
    });

    // Notificar atualização de presença
    socket.on('attendance-updated', (data) => {
      const { studentId, attendanceId, status } = data;
      io.to(`student-${studentId}`).emit('attendance-update-notification', {
        attendanceId,
        status,
        timestamp: new Date()
      });
      console.log(`✅ Atualização de presença para aluno ${studentId}`);
    });

    // ===== NOTIFICAÇÕES =====
    // Enviar notificação para usuário específico
    socket.on('send-notification', (data) => {
      const { userId, type, title, message } = data;
      io.to(`student-${userId}`).emit('notification-received', {
        type,
        title,
        message,
        timestamp: new Date()
      });
      console.log(`🔔 Notificação enviada para ${userId}`);
    });

    // Broadcast de status offline
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
      
      // Encontrar e remover usuário offline
      for (const [userId, user] of onlineUsers.entries()) {
        if (user.socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`🔴 ${user.name} (${userId}) desconectado (disconnect)`);
          
          io.emit('user-offline', {
            userId,
            timestamp: new Date()
          });
          break;
        }
      }
    });
  });

  // Iniciar servidor IMEDIATAMENTE (sem bloquear na conexão do banco)
  const isProduction = process.env.NODE_ENV === 'production';
  const host = isProduction ? '0.0.0.0' : '127.0.0.1';

  server.listen(PORT, '0.0.0.0', () => {
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
  if (sequelize) {
    sequelize.authenticate()
      .then(() => {
        console.log('✅ Banco de dados conectado com sucesso!');
        return sequelize.sync({ alter: true, force: false });
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
}

// Sincronizar todos os modelos com o banco de dados
async function syncDatabase() {
    try {
        if (sequelize) {
            await sequelize.sync({ alter: true, force: false });
            console.log('✅ Banco de dados sincronizado com sucesso!');
        }
    } catch (error) {
        console.error('❌ Erro ao sincronizar banco de dados:', error);
    }
}

syncDatabase();

// Adicionando logs para identificar problemas durante a inicialização
console.log('✅ Inicializando servidor...');

// Verificar conexão com o banco de dados
if (sequelize) {
  sequelize.authenticate()
    .then(() => {
      console.log('✅ Conexão com o banco de dados bem-sucedida!');
    })
    .catch((err) => {
      console.error('❌ Erro ao conectar ao banco de dados:', err);
    });
}

// Log para verificar se o servidor está escutando na porta correta
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

// Log para verificar se os arquivos estáticos estão sendo servidos
const staticPath = path.join(__dirname, 'dist');
if (fs.existsSync(staticPath)) {
  console.log(`✅ Servindo arquivos estáticos de: ${staticPath}`);
} else {
  console.error(`❌ Pasta estática não encontrada: ${staticPath}`);
}

// ===== MIDDLEWARE DE ERRO (DEVE ESTAR AO FINAL) =====
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
