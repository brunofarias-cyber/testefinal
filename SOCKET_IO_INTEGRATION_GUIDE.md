# Guia de Integração: Socket.io Real-Time System

## Visão Geral

Sistema completo de comunicação em tempo real usando Socket.io com 3 layers:
1. **Backend (server.js)** - Handlers de eventos Socket.io
2. **Hooks (useSocket.js, useRealTime.js)** - Abstração de conexão e eventos
3. **Componentes (RealTimeComponents.jsx)** - UI reutilizável

---

## Arquitetura

### Server-Side Events

```
┌─────────────────────────────────────────────────────┐
│                    Socket.io Server                  │
├─────────────────────────────────────────────────────┤
│ Team Messaging                                       │
│ ├─ join-team → room: team-{teamId}                  │
│ ├─ send-team-message → emit to room                 │
│ └─ receive-team-message ← broadcast                 │
│                                                      │
│ Grades Real-Time                                     │
│ ├─ send-grade → emit to student room                │
│ └─ grade-received ← broadcast                        │
│                                                      │
│ Attendance Real-Time                                 │
│ ├─ mark-attendance → emit to student room            │
│ └─ attendance-updated ← broadcast                    │
│                                                      │
│ Notifications                                        │
│ ├─ send-notification → emit to user room             │
│ └─ notification-received ← broadcast                 │
│                                                      │
│ Presence                                             │
│ ├─ user-online → broadcast online                   │
│ └─ disconnect → broadcast offline                   │
└─────────────────────────────────────────────────────┘
```

### Client-Side Hooks

```javascript
useSocket()
├─ Gerencia conexão global única
├─ Retorna: { socket, connected }
└─ Transports: ['websocket', 'polling']

useSocketEvent(socket, eventName, handler)
├─ Escuta eventos do servidor
├─ Auto-cleanup ao desmontar
└─ Uso: useSocketEvent(socket, 'grade-received', handleGrade)

useEmitEvent(socket, connected)
├─ Emite eventos para servidor
├─ Retorna: callback(eventName, data)
└─ Uso: const emit = useEmitEvent(socket, connected)

useRealTimeNotifications(userId)
├─ Gerencia notificações centralizadas
├─ Retorna: { notifications, markAsRead, clearNotification, unreadCount }
└─ Escuta: notification-received, grade-received, attendance-updated, receive-team-message

useRealTimeGrades(studentId)
├─ Gerencia notas em tempo real
├─ Retorna: { grades, broadcastGradeUpdate }
└─ Escuta: grade-received

useRealTimeAttendance(studentId)
├─ Gerencia presença em tempo real
├─ Retorna: { attendance, broadcastAttendanceMark }
└─ Escuta: attendance-updated

useRealTimeTeamChat(teamId, userId)
├─ Gerencia chat de time
├─ Retorna: { messages, sendTeamMessage }
└─ Escuta: receive-team-message
```

---

## Exemplos de Uso

### 1. Usar NotificationCenter (Simplest)

```javascript
import { NotificationCenter } from '@/components/RealTimeComponents';

export const Header = ({ userId }) => {
  return (
    <header className="flex justify-between items-center p-4">
      <h1>Dashboard</h1>
      <NotificationCenter userId={userId} />
    </header>
  );
};
```

### 2. Implementar Real-Time Team Chat

```javascript
import { RealTimeTeamChat } from '@/components/RealTimeComponents';

export const TeamChatPage = ({ teamId, userId, userName }) => {
  return (
    <div className="container mx-auto p-4">
      <h1>Chat do Time</h1>
      <RealTimeTeamChat 
        teamId={teamId}
        userId={userId}
        userName={userName}
      />
    </div>
  );
};
```

### 3. Usar Hooks Diretamente (Custom Implementation)

```javascript
import { useRealTimeGrades } from '@/hooks/useRealTime';
import { useRealTimeNotifications } from '@/hooks/useRealTime';

export const StudentDashboard = ({ studentId, userId }) => {
  const { grades } = useRealTimeGrades(studentId);
  const { notifications, unreadCount } = useRealTimeNotifications(userId);

  return (
    <div>
      <h2>Notificações ({unreadCount})</h2>
      <div>
        {notifications.map(n => (
          <div key={n.id}>{n.title}: {n.message}</div>
        ))}
      </div>

      <h2>Notas Recentes</h2>
      <div>
        {grades.map(g => (
          <div key={g.id}>{g.projectId}: {g.finalGrade}/10</div>
        ))}
      </div>
    </div>
  );
};
```

### 4. Broadcast Grade Update (Teacher)

```javascript
import { useRealTimeGrades } from '@/hooks/useRealTime';

export const GradeForm = ({ studentId }) => {
  const { broadcastGradeUpdate } = useRealTimeGrades(studentId);

  const handleSubmitGrade = async (gradeData) => {
    // Salvar no BD
    await fetch(`/api/grades/create`, { 
      method: 'POST', 
      body: JSON.stringify(gradeData)
    });

    // Notificar em tempo real
    broadcastGradeUpdate({
      projectId: gradeData.projectId,
      finalGrade: gradeData.finalGrade,
      feedback: gradeData.feedback,
      teacher: 'Prof. Silva'
    });
  };

  // Form JSX...
};
```

### 5. Broadcast Attendance Mark (Professor)

```javascript
import { useRealTimeAttendance } from '@/hooks/useRealTime';

export const AttendanceSheet = ({ classId }) => {
  const students = [/* ... */];
  const [attendance, setAttendance] = useState({});

  // Broadcast para cada estudante
  const handleMarkAttendance = (studentId, status) => {
    const studentAttendance = useRealTimeAttendance(studentId);
    
    studentAttendance.broadcastAttendanceMark({
      classId,
      status, // 'present', 'absent', 'late'
      timestamp: new Date()
    });
  };

  // Grid JSX...
};
```

### 6. Custom Event Listener

```javascript
import { useSocket, useSocketEvent } from '@/hooks/useSocket';

export const CustomComponent = () => {
  const { socket, connected } = useSocket();

  // Escutar evento customizado
  const handleCustomEvent = (data) => {
    console.log('Evento recebido:', data);
  };

  useSocketEvent(socket, 'custom-event', handleCustomEvent);

  return (
    <div>
      Conectado: {connected ? '✅' : '❌'}
    </div>
  );
};
```

---

## Server-Side Implementation

### Já Implementado em server.js

```javascript
// Socket.io connection handler (lines 366-441)
io.on('connection', (socket) => {
  console.log('🔌 Cliente conectado:', socket.id);

  // Team Messaging
  socket.on('join-team', (teamId) => {
    socket.join(`team-${teamId}`);
    console.log(`📢 Usuário entrou na equipe ${teamId}`);
  });

  socket.on('send-team-message', (data) => {
    const { teamId, message, sender, timestamp } = data;
    io.to(`team-${teamId}`).emit('receive-team-message', {
      teamId, message, sender,
      timestamp: timestamp || new Date(),
      socketId: socket.id
    });
    console.log(`💬 Mensagem de equipe em ${teamId} de ${sender}`);
  });

  // Grades
  socket.on('send-grade', (data) => {
    const { studentId, projectId, finalGrade, feedback, teacher } = data;
    io.to(`student-${studentId}`).emit('grade-received', {
      projectId, finalGrade, feedback, teacher,
      timestamp: new Date()
    });
    console.log(`📝 Nota enviada para aluno ${studentId}`);
  });

  // Attendance
  socket.on('mark-attendance', (data) => {
    const { studentId, classId, status } = data;
    io.to(`student-${studentId}`).emit('attendance-updated', {
      classId, status,
      timestamp: new Date()
    });
    console.log(`✓ Presença marcada para aluno ${studentId}`);
  });

  // Notifications
  socket.on('send-notification', (data) => {
    const { userId, type, title, message } = data;
    io.to(`user-${userId}`).emit('notification-received', {
      type, title, message,
      timestamp: new Date()
    });
  });

  // Presence
  socket.on('user-online', (data) => {
    io.emit('user-online', {
      ...data,
      status: 'online',
      socketId: socket.id
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Cliente desconectado:', socket.id);
  });
});
```

---

## API Routes Integration

### Grades (routes/grades.js)

```javascript
// POST /api/grades/create
router.post('/create', async (req, res) => {
  // ... BD logic ...
  
  // Emit Socket.io event
  io.emit('grade-created', {
    studentId: grade.studentId,
    projectId: grade.projectId,
    finalGrade: grade.finalGrade,
    feedback: grade.feedback,
    teacherId: grade.teacherId
  });

  res.json(grade);
});

// PUT /api/grades/:id
router.put('/:id', async (req, res) => {
  // ... BD logic ...
  
  // Emit Socket.io event
  io.emit('grade-updated', {
    id: grade.id,
    studentId: grade.studentId,
    finalGrade: grade.finalGrade
  });

  res.json(grade);
});
```

### Attendance (routes/attendance.js)

```javascript
// POST /api/attendance/mark
router.post('/mark', async (req, res) => {
  // ... BD logic ...
  
  // Emit Socket.io event
  io.emit('attendance-marked', {
    studentId: attendance.studentId,
    classId: attendance.classId,
    status: attendance.status
  });

  res.json(attendance);
});
```

---

## Fluxo de Dados Completo

### Exemplo: Teacher Grades Student

```
1. Professor preenche formulário de nota
   └─ Clica: "Salvar e Notificar"

2. Frontend faz POST /api/grades/create
   └─ Esperando resposta BD

3. Backend salva no Sequelize (BD real)
   └─ Grade model: {studentId, projectId, finalGrade, feedback}

4. Backend emite Socket.io event
   └─ io.emit('grade-created', {...})
   └─ Cliente usa: broadcastGradeUpdate()

5. Server emite para Socket.io room
   └─ io.to(`student-${studentId}`).emit('grade-received', {...})

6. Frontend socket.on('grade-received')
   └─ Hook useRealTimeGrades recebe data
   └─ Atualiza state: setGrades(prev => [{...data}, ...prev])

7. useRealTimeNotifications detecta grade-received
   └─ Cria notificação: {type: 'grade', title: 'Nova Nota', message: '...'}

8. UI atualiza automaticamente
   └─ NotificationCenter mostra badge (+1)
   └─ Lista de notas atualiza em tempo real
   └─ Sem page refresh!
```

---

## Testing Checklist

```
✅ Socket.io Connection
  [ ] Browser console: "✅ Socket.io conectado: <id>"
  [ ] Network tab: ws:// connection established
  [ ] Fallback: Polling if ws unavailable

✅ Team Chat
  [ ] Multiple users can join same team
  [ ] Messages appear instantly in both clients
  [ ] Timestamp and sender displayed correctly
  [ ] Can send/receive in rapid succession

✅ Grades Real-Time
  [ ] Grade posted by teacher
  [ ] Student receives notification (< 1s)
  [ ] Notification center badge updates
  [ ] Grade appears in student grades list
  [ ] Can clear notification

✅ Attendance Real-Time
  [ ] Teacher marks attendance
  [ ] Student receives notification (< 1s)
  [ ] Attendance appears in student list
  [ ] Status correct (present/absent/late)

✅ Notifications
  [ ] Unread count badge shows
  [ ] Mark as read changes styling
  [ ] Delete notification removes from list
  [ ] Multiple notifications stack properly

✅ Reconnection
  [ ] Browser DevTools: Network → Throttle → Offline
  [ ] "Socket não conectado" warning in console
  [ ] Auto-reconnect when back online
  [ ] Pending messages queue and send after reconnect
```

---

## Deployment Checklist

- [x] server.js Socket.io handlers configured
- [x] useSocket.js hook created (global connection)
- [x] useRealTime.js hooks created (specific features)
- [x] RealTimeComponents.jsx examples created
- [ ] Build: `npm run build:render`
- [ ] Test locally
- [ ] Commit: `git commit -m "feat: Socket.io real-time system"`
- [ ] Deploy to Render
- [ ] Verify Socket.io in production

---

## Troubleshooting

### Socket not connecting

```javascript
// Check in browser console
console.log(io); // Should show Socket.io library
const { socket } = useSocket();
console.log(socket?.connected); // Should be true after 1-2s
```

### Events not received

```javascript
// Check server logs
// Should see: "💬 Mensagem recebida" or similar

// Check event names match EXACTLY
// client: socket.emit('send-team-message', ...)
// server: socket.on('send-team-message', ...)
```

### Stale data

```javascript
// Ensure using latest from DB, not cached
// Each emit should include timestamp
// Each broadcast should include socket.id to avoid echo
```

---

## Performance Considerations

1. **Connection Pooling**: Global socket reused across components
2. **Event Cleanup**: useSocketEvent removes listeners on unmount
3. **Debouncing**: Consider debouncing rapid-fire events
4. **Message History**: Currently only shows since connection, not persisted
5. **Scaling**: For 1000+ concurrent users, consider:
   - Redis adapter for Socket.io
   - Database persistence for message history
   - WebSocket compression

---

## Next Steps

1. Test Socket.io in browser
2. Verify grades notifications work end-to-end
3. Verify attendance notifications work end-to-end
4. Implement message persistence (optional)
5. Add typing indicators for chat (nice-to-have)
6. Add read receipts for messages (nice-to-have)
