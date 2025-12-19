import { useState, useCallback, useEffect } from 'react';
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
 * Hook useRealTimeTeamChat - Gerenciar chat de time em tempo real
 */
export const useRealTimeTeamChat = (teamId, userId) => {
  const { socket, connected } = useSocket();
  const emit = useEmitEvent(socket, connected);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Juntar ao time ao montar
  useEffect(() => {
    if (socket && teamId) {
      socket.emit('join-team', teamId);
      console.log(`✅ Entrou no time: ${teamId}`);
    }
  }, [socket, teamId]);

  // Escutar mensagens do time
  const handleTeamMessage = useCallback((data) => {
    console.log('💬 Mensagem recebida:', data);
    setMessages(prev => [{
      id: Date.now(),
      ...data,
      received: true
    }, ...prev]);
  }, []);

  useSocketEvent(socket, 'receive-team-message', handleTeamMessage);

  // Enviar mensagem de time
  const sendTeamMessage = useCallback((messageText) => {
    emit('send-team-message', {
      teamId,
      message: messageText,
      sender: userId,
      timestamp: new Date()
    });
  }, [teamId, userId, emit]);

  return {
    messages,
    loading,
    sendTeamMessage
  };
};
