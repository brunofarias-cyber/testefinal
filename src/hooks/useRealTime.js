import { useState, useCallback, useEffect, useRef } from 'react';
import { useSocket, useSocketEvent, useEmitEvent } from './useSocket';

/**
 * Hook useRealTimeNotifications - Gerenciar notificações em tempo real
 */
export const useRealTimeNotifications = (userId) => {
  const { socket, connected } = useSocket();
  const emit = useEmitEvent(socket, connected);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Escutar notificações recebidas
  const handleNotification = useCallback((data) => {
    console.log('🔔 Notificação recebida:', data);
    setNotifications(prev => [{
      id: Date.now(),
      ...data,
      read: false,
      timestamp: new Date()
    }, ...prev]);
  }, []);

  useSocketEvent(socket, 'notification-received', handleNotification);

  // Escutar atualizações de grades
  const handleGradeUpdate = useCallback((data) => {
    console.log('📝 Grade atualizada:', data);
    handleNotification({
      type: 'grade',
      title: 'Nova Nota Recebida',
      message: `Você recebeu uma nota em ${data.projectId}: ${data.finalGrade}/10`,
      data
    });
  }, [handleNotification]);

  useSocketEvent(socket, 'grade-received', handleGradeUpdate);

  // Escutar atualizações de presença
  const handleAttendanceUpdate = useCallback((data) => {
    console.log('👤 Presença atualizada:', data);
    handleNotification({
      type: 'attendance',
      title: 'Presença Registrada',
      message: `Sua presença foi marcada em ${data.classId}`,
      data
    });
  }, [handleNotification]);

  useSocketEvent(socket, 'attendance-updated', handleAttendanceUpdate);

  // Escutar mensagens de time
  const handleTeamMessage = useCallback((data) => {
    console.log('💬 Mensagem de time:', data);
    if (data.sender !== userId) {
      handleNotification({
        type: 'message',
        title: `Mensagem de ${data.sender}`,
        message: data.message,
        data
      });
    }
  }, [userId, handleNotification]);

  useSocketEvent(socket, 'receive-team-message', handleTeamMessage);

  // Marcar notificação como lida
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  // Limpar notificação
  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Enviar notificação via socket
  const sendNotification = useCallback((targetUserId, notificationData) => {
    emit('send-notification', {
      userId: targetUserId,
      ...notificationData,
      timestamp: new Date()
    });
  }, [emit]);

  return {
    notifications,
    loading,
    markAsRead,
    clearNotification,
    sendNotification,
    unreadCount: notifications.filter(n => !n.read).length
  };
};

/**
 * Hook useRealTimeGrades - Gerenciar notas em tempo real
 */
export const useRealTimeGrades = (studentId) => {
  const { socket, connected } = useSocket();
  const emit = useEmitEvent(socket, connected);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Escutar nova nota recebida
  const handleGradeReceived = useCallback((data) => {
    console.log('📝 Nota recebida:', data);
    setGrades(prev => [{
      id: Date.now(),
      ...data,
      status: 'new'
    }, ...prev]);
  }, []);

  useSocketEvent(socket, 'grade-received', handleGradeReceived);

  // Emitir quando uma nota é atualizável
  const broadcastGradeUpdate = useCallback((gradeData) => {
    emit('send-grade', {
      studentId,
      ...gradeData,
      timestamp: new Date()
    });
  }, [studentId, emit]);

  return {
    grades,
    loading,
    broadcastGradeUpdate
  };
};

/**
 * Hook useRealTimeAttendance - Gerenciar presença em tempo real
 */
export const useRealTimeAttendance = (studentId) => {
  const { socket, connected } = useSocket();
  const emit = useEmitEvent(socket, connected);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Escutar presença atualizada
  const handleAttendanceUpdated = useCallback((data) => {
    console.log('👤 Presença atualizada:', data);
    setAttendance(prev => [{
      id: Date.now(),
      ...data,
      status: 'updated'
    }, ...prev]);
  }, []);

  useSocketEvent(socket, 'attendance-updated', handleAttendanceUpdated);

  // Emitir marcação de presença
  const broadcastAttendanceMark = useCallback((attendanceData) => {
    emit('mark-attendance', {
      studentId,
      ...attendanceData,
      timestamp: new Date()
    });
  }, [studentId, emit]);

  return {
    attendance,
    loading,
    broadcastAttendanceMark
  };
};

/**
 * Hook useRealTimeTeamChat - Gerenciar chat de time em tempo real com persistência e typing indicators
 */
export const useRealTimeTeamChat = (teamId, userId) => {
  const { socket, connected } = useSocket();
  const emit = useEmitEvent(socket, connected);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef({});

  // Carregar mensagens iniciais do banco de dados
  useEffect(() => {
    if (!teamId || loading) return;

    setLoading(true);
    fetch(`/api/team-messages/${teamId}?limit=50`)
      .then(res => res.json())
      .then(data => {
        console.log(`📚 ${data.messages.length} mensagens carregadas do BD`);
        setMessages(data.messages);
        setHasMoreMessages(data.pagination.total > 50);
      })
      .catch(err => console.error('❌ Erro ao carregar mensagens:', err))
      .finally(() => setLoading(false));
  }, [teamId]);

  // Juntar ao time ao montar
  useEffect(() => {
    if (socket && teamId) {
      socket.emit('join-team', teamId);
      console.log(`✅ Entrou no time: ${teamId}`);
    }
  }, [socket, teamId]);

  // Escutar mensagens do time em tempo real
  const handleTeamMessage = useCallback((data) => {
    console.log('💬 Mensagem recebida em tempo real:', data);
    
    // Evitar duplicação se a mensagem foi enviada por este usuário
    if (data.socketId && data.senderId === userId) {
      setMessages(prev => prev.map(m => 
        m.pending ? { ...m, pending: false, id: data.id } : m
      ));
    } else {
      setMessages(prev => [{
        id: data.id || Date.now(),
        ...data,
        received: true
      }, ...prev]);
    }

    // Remover indicador de digitação do usuário que enviou
    setTypingUsers(prev => {
      const newTyping = { ...prev };
      delete newTyping[data.senderId || data.sender];
      return newTyping;
    });
  }, [userId]);

  useSocketEvent(socket, 'receive-team-message', handleTeamMessage);

  // Escutar indicadores de digitação
  const handleUserTyping = useCallback((data) => {
    const { userId: typingUserId, userName } = data;
    
    if (typingUserId === userId) return; // Ignorar se for o próprio usuário

    // Limpar timeout anterior
    if (typingTimeoutRef.current[typingUserId]) {
      clearTimeout(typingTimeoutRef.current[typingUserId]);
    }

    // Adicionar usuário à lista de digitação
    setTypingUsers(prev => ({
      ...prev,
      [typingUserId]: { name: userName, timestamp: Date.now() }
    }));

    // Auto-remover após 3 segundos de inatividade
    typingTimeoutRef.current[typingUserId] = setTimeout(() => {
      setTypingUsers(prev => {
        const newTyping = { ...prev };
        delete newTyping[typingUserId];
        return newTyping;
      });
    }, 3000);
  }, [userId]);

  useSocketEvent(socket, 'user-typing', handleUserTyping);

  // Enviar mensagem de tipo
  const sendTeamMessage = useCallback((messageText) => {
    // Criar mensagem pendente local
    const tempMessage = {
      id: `pending-${Date.now()}`,
      teamId,
      message: messageText,
      sender: userId,
      senderName: 'Você',
      timestamp: new Date(),
      pending: true
    };

    // Adicionar à UI imediatamente
    setMessages(prev => [tempMessage, ...prev]);

    // Notificar que parou de digitar
    emit('user-typing', {
      teamId,
      userId,
      userName: 'Você',
      isTyping: false
    });

    // Enviar para servidor
    emit('send-team-message', {
      teamId,
      message: messageText,
      sender: userId,
      timestamp: new Date()
    });

    // Também salvar no BD para persistência
    fetch('/api/team-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamId,
        senderId: userId,
        message: messageText,
        messageType: 'text'
      })
    }).catch(err => console.error('❌ Erro ao salvar mensagem:', err));
  }, [teamId, userId, emit]);

  // Notificar que está digitando (com debounce)
  const notifyTyping = useCallback((isTyping = true) => {
    emit('user-typing', {
      teamId,
      userId,
      userName: 'Usuário',
      isTyping
    });
  }, [teamId, userId, emit]);

  // Carregar mais mensagens antigas
  const loadMoreMessages = useCallback((offset) => {
    fetch(`/api/team-messages/${teamId}?limit=50&offset=${offset}`)
      .then(res => res.json())
      .then(data => {
        console.log(`📚 ${data.messages.length} mensagens antigas carregadas`);
        setMessages(prev => [...prev, ...data.messages]);
        setHasMoreMessages(data.pagination.offset + data.pagination.limit < data.pagination.total);
      })
      .catch(err => console.error('❌ Erro ao carregar mais mensagens:', err));
  }, [teamId]);

  // Cleanup
  useEffect(() => {
    return () => {
      Object.values(typingTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  return {
    messages,
    loading,
    sendTeamMessage,
    loadMoreMessages,
    hasMoreMessages,
    typingUsers,
    notifyTyping
  };
};
