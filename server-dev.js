import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// ===== MOCK API ENDPOINTS =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando com sucesso!' });
});

// Mock students
app.get('/api/students', (req, res) => {
  res.json([
    { id: 1, name: 'João Silva', email: 'joao@school.com', class: '7º Ano A', status: 'active' },
    { id: 2, name: 'Maria Santos', email: 'maria@school.com', class: '7º Ano A', status: 'active' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@school.com', class: '7º Ano B', status: 'active' },
    { id: 4, name: 'Ana Lima', email: 'ana@school.com', class: '7º Ano B', status: 'inactive' },
    { id: 5, name: 'Lucas Oliveira', email: 'lucas@school.com', class: '8º Ano A', status: 'active' },
    { id: 6, name: 'Julia Souza', email: 'julia@school.com', class: '8º Ano A', status: 'active' }
  ]);
});

// Mock teachers
app.get('/api/teachers', (req, res) => {
  res.json([
    { id: 1, name: 'Prof. João Ferreira', email: 'joao.ferreira@school.com', department: 'Português', status: 'active' },
    { id: 2, name: 'Prof. Ana Silva', email: 'ana.silva@school.com', department: 'Matemática', status: 'active' },
    { id: 3, name: 'Prof. Carlos Oliveira', email: 'carlos.oliveira@school.com', department: 'Ciências', status: 'active' },
    { id: 4, name: 'Prof. Rita Costa', email: 'rita.costa@school.com', department: 'História', status: 'inactive' }
  ]);
});

// Mock communication endpoints
app.post('/api/communications/send', (req, res) => {
  const { recipients, selectedClass, content } = req.body;
  res.json({ 
    id: Math.random(),
    status: 'sent',
    message: 'Comunicado enviado com sucesso',
    recipients
  });
});

app.get('/api/communications', (req, res) => {
  res.json([]);
});

// Mock projects endpoints
app.get('/api/projects', (req, res) => {
  res.json([]);
});

app.get('/api/teacher-projects/:teacherId', (req, res) => {
  res.json([]);
});

// Mock grades endpoints
app.get('/api/grades', (req, res) => {
  res.json([]);
});

app.post('/api/grades', (req, res) => {
  res.json({ success: true, message: 'Nota registrada' });
});

// Mock attendance endpoints
app.get('/api/attendance', (req, res) => {
  res.json([]);
});

app.post('/api/attendance', (req, res) => {
  res.json({ success: true, message: 'Presença marcada' });
});

// Mock submissions endpoints
app.get('/api/submissions', (req, res) => {
  res.json([]);
});

app.get('/api/submissions/:submissionId', (req, res) => {
  res.json({});
});

// Mock rubrics endpoints
app.get('/api/rubricas', (req, res) => {
  res.json([]);
});

app.get('/api/rubricas/:rubricId', (req, res) => {
  res.json({});
});

// Mock student projects endpoints
app.get('/api/student-projects/:studentId', (req, res) => {
  res.json([]);
});

app.get('/api/student-projects/:studentId/stats', (req, res) => {
  res.json({ 
    totalProjects: 0,
    completedProjects: 0,
    averageGrade: 0,
    totalSubmissions: 0
  });
});

// Error handler para APIs não encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint não encontrado', path: req.path });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Create HTTP server with Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);

  socket.on('join-student', (studentId) => {
    socket.join(`student-${studentId}`);
    console.log(`👨‍🎓 Aluno ${studentId} entrou na sala`);
  });

  socket.on('join-teacher', (teacherId) => {
    socket.join(`teacher-${teacherId}`);
    console.log(`👨‍🏫 Professor ${teacherId} entrou na sala`);
  });

  socket.on('coordinator-message', (data) => {
    console.log(`📢 Comunicado do coordenador:`, data);
    io.emit('communication-received', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor rodando com sucesso!`);
  console.log(`   🌐 URL: http://localhost:${PORT}`);
  console.log(`   🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`   📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🔌 Socket.io: ✅ Ativo`);
  console.log(`   💾 Banco de dados: ⚠️  Modo Mock (em desenvolvimento)`);
});

export default app;
