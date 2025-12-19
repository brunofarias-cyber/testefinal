# Exemplos de Integração: Socket.io Real-Time

## 1. Adicionar NotificationCenter ao App.jsx (5 min)

### Before
```javascript
// src/App.jsx
export default function App() {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only page content, no notifications */}
    </div>
  );
}
```

### After
```javascript
// src/App.jsx
import { NotificationCenter } from '@/components/RealTimeComponents';

export default function App() {
  const [userId, setUserId] = useState(null); // Get from auth context
  
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 border-b">
        <h1>Dashboard</h1>
        {userId && <NotificationCenter userId={userId} />}
      </div>

      {/* Page content */}
    </div>
  );
}
```

---

## 2. Implementar Real-Time Grades (10 min)

### Before (Polling)
```javascript
// src/components/GradesList.jsx
export const GradesList = ({ studentId }) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Polling every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/grades/student/${studentId}`);
      const data = await res.json();
      setGrades(data);
    }, 5000);

    return () => clearInterval(interval);
  }, [studentId]);

  return (
    <div>
      {grades.map(g => (
        <div key={g.id}>{g.projectId}: {g.finalGrade}/10</div>
      ))}
    </div>
  );
};
```

### After (Real-Time)
```javascript
// src/components/GradesList.jsx
import { useRealTimeGrades } from '@/hooks/useRealTime';

export const GradesList = ({ studentId }) => {
  // Load initial grades from API
  const [grades, setGrades] = useState([]);

  // Get initial grades on mount
  useEffect(() => {
    fetch(`/api/grades/student/${studentId}`)
      .then(r => r.json())
      .then(setGrades);
  }, [studentId]);

  // Listen to real-time updates
  const { grades: realtimeGrades } = useRealTimeGrades(studentId);
  
  const allGrades = [...realtimeGrades, ...grades];
  const uniqueGrades = Array.from(
    new Map(allGrades.map(g => [g.id, g])).values()
  );

  return (
    <div>
      {uniqueGrades.map(g => (
        <div key={g.id} className="p-4 border-l-4 border-blue-500">
          <strong>{g.projectId}</strong>: {g.finalGrade}/10
          {g.status === 'new' && <span className="text-green-500"> ✨ NOVA</span>}
          <p className="text-sm text-gray-600">{g.feedback}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 3. Implementar Real-Time Attendance (10 min)

### Before (Manual Refresh)
```javascript
// src/components/AttendanceList.jsx
export const AttendanceList = ({ studentId }) => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await fetch(`/api/attendance/student/${studentId}`);
      const data = await res.json();
      setAttendance(data);
    };

    fetchAttendance();
  }, [studentId]);

  // User must manually refresh page to see updates

  return (
    <div>
      {attendance.map(a => (
        <div key={a.id}>
          {a.classId}: {a.status}
        </div>
      ))}
    </div>
  );
};
```

### After (Real-Time)
```javascript
// src/components/AttendanceList.jsx
import { useRealTimeAttendance } from '@/hooks/useRealTime';

export const AttendanceList = ({ studentId }) => {
  // Load initial from API
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch(`/api/attendance/student/${studentId}`)
      .then(r => r.json())
      .then(setAttendance);
  }, [studentId]);

  // Real-time updates
  const { attendance: rtAttendance } = useRealTimeAttendance(studentId);

  const allRecords = [...rtAttendance, ...attendance];
  const uniqueRecords = Array.from(
    new Map(allRecords.map(a => [a.id, a])).values()
  );

  return (
    <div>
      {uniqueRecords.map(a => (
        <div key={a.id} className={`p-3 border-l-4 ${
          a.status === 'present' ? 'border-green-500' :
          a.status === 'absent' ? 'border-red-500' :
          'border-yellow-500'
        }`}>
          <div className="font-semibold">{a.classId}</div>
          <div className="text-sm">Status: {a.status}</div>
          {a.status === 'updated' && <div className="text-green-500">✓ Atualizado</div>}
          {a.notes && <div className="text-gray-600 text-sm">{a.notes}</div>}
        </div>
      ))}
    </div>
  );
};
```

---

## 4. Implementar Real-Time Team Chat (15 min)

### Opção A: Usar componente pronto
```javascript
// src/pages/TeamPage.jsx
import { RealTimeTeamChat } from '@/components/RealTimeComponents';

export const TeamPage = ({ teamId, userId, userName }) => {
  return (
    <div className="container mx-auto p-4">
      <h1>Chat do Time</h1>
      <div className="h-96">
        <RealTimeTeamChat 
          teamId={teamId}
          userId={userId}
          userName={userName}
        />
      </div>
    </div>
  );
};
```

### Opção B: Usar hook customizado
```javascript
// src/components/CustomTeamChat.jsx
import { useRealTimeTeamChat } from '@/hooks/useRealTime';
import { Send } from 'lucide-react';

export const CustomTeamChat = ({ teamId, userId, userName }) => {
  const { messages, sendTeamMessage } = useRealTimeTeamChat(teamId, userId);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendTeamMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Custom messages UI */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-4 ${
            msg.sender === userId ? 'text-right' : 'text-left'
          }`}>
            <div className={`inline-block max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === userId 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-black'
            }`}>
              {msg.message}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString('pt-BR')}
            </div>
          </div>
        ))}
      </div>

      {/* Custom input UI */}
      <form onSubmit={handleSend} className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
```

---

## 5. Adicionar Notifications ao Professor (10 min)

### Before (Sem notificações de Grades)
```javascript
// src/components/ProfessorGradeForm.jsx
export const ProfessorGradeForm = ({ studentId, projectId }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('/api/grades/create', {
      method: 'POST',
      body: JSON.stringify({ studentId, projectId, finalGrade: 8.5 })
    });

    // Grade is saved, but student doesn't know yet!
    // They have to refresh or wait for polling
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

### After (Com notificações real-time)
```javascript
// src/components/ProfessorGradeForm.jsx
import { useRealTimeGrades } from '@/hooks/useRealTime';

export const ProfessorGradeForm = ({ studentId, projectId }) => {
  const { broadcastGradeUpdate } = useRealTimeGrades(studentId);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save to BD
    const response = await fetch('/api/grades/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        studentId, 
        projectId, 
        finalGrade: 8.5,
        feedback
      })
    });

    if (response.ok) {
      const grade = await response.json();
      
      // NOVO: Notificar aluno em tempo real
      broadcastGradeUpdate({
        projectId,
        finalGrade: 8.5,
        feedback,
        teacher: 'Prof. Silva'
      });

      alert('Nota enviada e aluno foi notificado!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={feedback} 
        onChange={e => setFeedback(e.target.value)}
        placeholder="Feedback do aluno..."
      />
      <button type="submit">Enviar Nota</button>
    </form>
  );
};
```

---

## 6. Adicionar Notifications ao Chamador (10 min)

### Before (Sem notificações de Presença)
```javascript
// src/components/AttendanceSheet.jsx
export const AttendanceSheet = ({ classId, students }) => {
  const [marked, setMarked] = useState({});

  const handleMark = async (studentId, status) => {
    await fetch('/api/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ studentId, classId, status })
    });

    setMarked(prev => ({ ...prev, [studentId]: status }));
    // Student has no idea their attendance was marked!
  };

  return (
    <div>
      {students.map(s => (
        <button key={s.id} onClick={() => handleMark(s.id, 'present')}>
          Mark {s.name} Present
        </button>
      ))}
    </div>
  );
};
```

### After (Com notificações real-time)
```javascript
// src/components/AttendanceSheet.jsx
import { useRealTimeAttendance } from '@/hooks/useRealTime';

export const AttendanceSheet = ({ classId, students }) => {
  const [marked, setMarked] = useState({});

  // Para cada aluno, podemos notificá-lo
  const handleMark = async (studentId, status) => {
    await fetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, classId, status })
    });

    // NOVO: Notificar aluno em tempo real
    const studentAttendance = useRealTimeAttendance(studentId);
    studentAttendance.broadcastAttendanceMark({
      classId,
      status,
      timestamp: new Date()
    });

    setMarked(prev => ({ ...prev, [studentId]: status }));
  };

  return (
    <div className="space-y-2">
      {students.map(s => (
        <div key={s.id} className="flex gap-2">
          <span>{s.name}</span>
          <button
            onClick={() => handleMark(s.id, 'present')}
            className={`px-3 py-1 rounded ${
              marked[s.id] === 'present' ? 'bg-green-500 text-white' : 'bg-gray-200'
            }`}
          >
            Presente
          </button>
          <button
            onClick={() => handleMark(s.id, 'absent')}
            className={`px-3 py-1 rounded ${
              marked[s.id] === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
          >
            Ausente
          </button>
          <button
            onClick={() => handleMark(s.id, 'late')}
            className={`px-3 py-1 rounded ${
              marked[s.id] === 'late' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
            }`}
          >
            Atrasado
          </button>
        </div>
      ))}
    </div>
  );
};
```

---

## 7. Custom Notification Toast (10 min)

### Adicionar Toast notifications na tela
```javascript
// src/components/ToastNotification.jsx
import { X } from 'lucide-react';
import { useEffect } from 'react';

export const ToastNotification = ({ notification, onClose, autoCloseDuration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, autoCloseDuration);
    return () => clearTimeout(timer);
  }, [onClose, autoCloseDuration]);

  const bgColor = {
    grade: 'bg-blue-500',
    attendance: 'bg-green-500',
    message: 'bg-purple-500',
    default: 'bg-gray-500'
  }[notification.type] || 'bg-gray-500';

  return (
    <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex justify-between items-center animate-slide-in`}>
      <div>
        <h4 className="font-semibold">{notification.title}</h4>
        <p className="text-sm">{notification.message}</p>
      </div>
      <button onClick={onClose} className="ml-4">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// src/components/NotificationContainer.jsx
import { useState } from 'react';
import { useRealTimeNotifications } from '@/hooks/useRealTime';
import { ToastNotification } from './ToastNotification';

export const NotificationContainer = ({ userId }) => {
  const { notifications, clearNotification } = useRealTimeNotifications(userId);
  const [showing, setShowing] = useState(new Set());

  // Show new notifications as toasts
  useEffect(() => {
    notifications.forEach(n => {
      if (!showing.has(n.id)) {
        setShowing(prev => new Set([...prev, n.id]));
        
        // Auto-hide after 5s
        setTimeout(() => {
          setShowing(prev => {
            const next = new Set(prev);
            next.delete(n.id);
            return next;
          });
        }, 5000);
      }
    });
  }, [notifications, showing]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {Array.from(showing).map(id => {
        const notif = notifications.find(n => n.id === id);
        return notif && (
          <ToastNotification
            key={id}
            notification={notif}
            onClose={() => clearNotification(id)}
          />
        );
      })}
    </div>
  );
};
```

---

## 8. Integração com Dashboard Existente (5 min)

```javascript
// src/pages/StudentDashboard.jsx
import { useRealTimeNotifications, useRealTimeGrades, useRealTimeAttendance } from '@/hooks/useRealTime';
import { NotificationContainer } from '@/components/NotificationContainer';
import { RealTimeTeamChat } from '@/components/RealTimeComponents';

export const StudentDashboard = ({ userId, studentId, teamId }) => {
  const { notifications, unreadCount } = useRealTimeNotifications(userId);
  const { grades } = useRealTimeGrades(studentId);
  const { attendance } = useRealTimeAttendance(studentId);

  return (
    <div>
      {/* Toast notifications */}
      <NotificationContainer userId={userId} />

      {/* Existing dashboard content */}
      <div className="grid grid-cols-3 gap-4">
        {/* Stats */}
        <div className="p-4 bg-white rounded-lg shadow">
          <h3>Notificações Não Lidas</h3>
          <p className="text-2xl font-bold text-red-500">{unreadCount}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3>Notas Recentes</h3>
          <p className="text-2xl font-bold text-blue-500">{grades.length}</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h3>Registros de Presença</h3>
          <p className="text-2xl font-bold text-green-500">{attendance.length}</p>
        </div>
      </div>

      {/* Team chat */}
      <div className="mt-8">
        <h2>Chat do Time</h2>
        <RealTimeTeamChat teamId={teamId} userId={userId} userName={/* get from auth */} />
      </div>
    </div>
  );
};
```

---

## Checklist de Implementação

### Fase 1: Base (30 min)
- [ ] Adicionar NotificationCenter ao App.jsx header
- [ ] Adicionar NotificationContainer para toasts
- [ ] Testar Socket.io connection no console

### Fase 2: Grades (15 min)
- [ ] Implementar useRealTimeGrades no GradesList
- [ ] Adicionar broadcastGradeUpdate no ProfessorGradeForm
- [ ] Testar ponta-a-ponta: Professor grava → Aluno vê notificação

### Fase 3: Attendance (15 min)
- [ ] Implementar useRealTimeAttendance no AttendanceList
- [ ] Adicionar broadcastAttendanceMark no AttendanceSheet
- [ ] Testar ponta-a-ponta: Professor marca → Aluno vê notificação

### Fase 4: Team Chat (15 min)
- [ ] Adicionar RealTimeTeamChat ao TeamPage
- [ ] Testar chat entre 2 abas
- [ ] Verificar mensagens aparecem < 100ms

### Fase 5: Polish (30 min)
- [ ] Adicionar animações aos toasts
- [ ] Customizar cores por tipo de notificação
- [ ] Testar reconnection (DevTools → Throttle → Offline)

---

## Dicas Importantes

1. **Sempre use hooks ao invés de conectar diretamente ao Socket.io**
   - Garante conexão única global
   - Evita memory leaks
   - Facilita testing

2. **Combine dados da API com dados real-time**
   - Primeiro load do API (dados históricos)
   - Real-time updates (dados novos)
   - Deduplicate by ID

3. **Teste com múltiplas abas**
   - Abra 2 instances da aplicação
   - Uma como Professor, outra como Aluno
   - Envie notificações e verifique

4. **Monitore Socket.io no browser**
   - DevTools → Network → Filter by "WS"
   - Veja cada emit/on em tempo real

5. **Graceful degradation**
   - App funciona mesmo sem Socket.io
   - Fallback para polling se WebSocket indisponível
   - Enxergará "⚠️ Socket não conectado" no console
