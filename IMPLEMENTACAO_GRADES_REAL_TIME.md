# 🔧 IMPLEMENTAÇÃO PRÁTICA: Notas em Tempo Real

## Como implementar sincronização real de notas (Professor → Aluno)

### PASSO 1: Backend API (routes/grades.js)

```javascript
import express from 'express';
import { Grade, User, Student } from '../models/index.js';

const router = express.Router();

// ✅ GET: Aluno recupera suas notas
router.get('/student/:studentId', async (req, res) => {
    try {
        const grades = await Grade.findAll({
            where: { student_id: req.params.studentId },
            include: [
                { model: User, as: 'teacher', attributes: ['name', 'email'] }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({ success: true, data: grades });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ POST: Professor cria/atualiza nota
router.post('/create', async (req, res) => {
    try {
        const { studentId, projectId, grade, feedback, rubricBreakdown } = req.body;
        const teacherId = req.user.id;

        const gradeRecord = await Grade.create({
            student_id: studentId,
            project_id: projectId,
            teacher_id: teacherId,
            final_grade: grade,
            feedback: feedback,
            rubric_breakdown: JSON.stringify(rubricBreakdown),
            graded_at: new Date()
        });

        // 🔔 NOTIFICAR ALUNO EM TEMPO REAL
        if (req.app.io) {
            req.app.io.to(`student-${studentId}`).emit('grade-updated', {
                projectId,
                grade,
                feedback,
                teacher: req.user.name
            });
        }

        res.json({ success: true, data: gradeRecord });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ PUT: Professor edita nota
router.put('/:gradeId', async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        
        const gradeRecord = await Grade.findByPk(req.params.gradeId);
        
        await gradeRecord.update({
            final_grade: grade,
            feedback: feedback,
            updated_at: new Date()
        });

        // 🔔 NOTIFICAR ALUNO
        if (req.app.io) {
            req.app.io.to(`student-${gradeRecord.student_id}`).emit('grade-updated', {
                projectId: gradeRecord.project_id,
                grade,
                feedback
            });
        }

        res.json({ success: true, data: gradeRecord });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
```

---

### PASSO 2: Frontend - Professor (StudentGrades.jsx)

```javascript
// Adicionar ao useEffect
useEffect(() => {
    // Conectar ao Socket.io para ouví notificações
    socket.on('grade-submitted', (data) => {
        console.log('Nova nota recebida do aluno:', data);
        // Atualizar lista de notas
    });

    return () => socket.off('grade-submitted');
}, []);

// Função para salvar nota
const handleSaveGrade = async (studentId, grade, feedback) => {
    try {
        const response = await fetch('/api/grades/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId,
                projectId: selectedProject.id,
                grade,
                feedback,
                rubricBreakdown: selectedProject.rubric
            })
        });

        if (response.ok) {
            console.log('✅ Nota salva com sucesso!');
            // Recarregar notas
            loadGrades();
        }
    } catch (error) {
        console.error('❌ Erro ao salvar nota:', error);
    }
};
```

---

### PASSO 3: Frontend - Aluno (StudentGrades.jsx)

```javascript
// Conectar ao Socket.io para RECEBER notas atualizadas
useEffect(() => {
    const socket = io();
    
    // Entrar na sala do aluno
    socket.emit('join', { 
        userId: currentUserId,
        role: 'student'
    });

    // Escutar atualizações de notas
    socket.on('grade-updated', (data) => {
        console.log('🔔 Nota atualizada pelo professor:', data);
        
        // Atualizar estado local
        setGrades(grades => 
            grades.map(g => 
                g.projectId === data.projectId 
                    ? { ...g, finalGrade: data.grade, feedback: data.feedback }
                    : g
            )
        );

        // Mostrar notificação
        toast.success(`Prof. ${data.teacher} atualizou sua nota!`);
    });

    return () => socket.disconnect();
}, []);
```

---

### PASSO 4: Backend - Socket.io Setup (server.js)

```javascript
import { Server } from 'socket.io';

const io = new Server(server, {
    cors: { origin: '*' }
});

io.on('connection', (socket) => {
    console.log('✅ Cliente conectado:', socket.id);

    // Aluno entra em sua sala pessoal
    socket.on('join', (data) => {
        if (data.role === 'student') {
            socket.join(`student-${data.userId}`);
            console.log(`👨‍🎓 Aluno ${data.userId} conectado`);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado:', socket.id);
    });
});

// Exportar io para usar em rotas
app.io = io;
```

---

### PASSO 5: Registrar rotas (server.js)

```javascript
import gradesRoutes from './routes/grades.js';

// ... outras rotas ...

app.use('/api/grades', gradesRoutes);
```

---

## 📊 FLUXO COMPLETO APÓS IMPLEMENTAÇÃO

```
1. Professor edita nota em StudentGrades.jsx
   ↓
2. POST /api/grades/create é enviado
   ↓
3. Backend cria/atualiza Grade no banco
   ↓
4. io.to(`student-${studentId}`).emit('grade-updated')
   ↓
5. Socket.io envia notificação em tempo real
   ↓
6. Aluno recebe evento 'grade-updated' via Socket.io
   ↓
7. Estado React atualiza automaticamente
   ↓
8. UI do aluno mostra nota nova IMEDIATAMENTE ✅
```

---

## 🧪 TESTE MANUAL

### Abrir 2 abas
1. **Aba 1**: Login como Professor
2. **Aba 2**: Login como Aluno (João Silva)

### Procedimento
1. Professor vai para "Notas" → clica em "Editar"
2. Altera nota de 7.5 para 9.0
3. Clica "Salvar"
4. **Aba 2 (Aluno)**: Nota atualiza SOZINHA sem recarregar! ✅

---

## ⏱️ TEMPO DE IMPLEMENTAÇÃO

- **Backend**: 30-45 minutos
- **Frontend**: 20-30 minutos  
- **Teste**: 15 minutos
- **Total**: ~1-2 horas

---

## 🔗 INTEGRAÇÃO COM OUTROS SISTEMAS

Depois de implementar Notas, seguir o mesmo padrão para:
- ✅ Submissions (Entregas de alunos)
- ✅ Attendance (Presença)
- ✅ Rubric (Rubrica de avaliação)
- ✅ Feedback Center (Centro de notificações)
