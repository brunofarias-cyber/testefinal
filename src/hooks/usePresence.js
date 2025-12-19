import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

/**
 * Hook usePresence - Gerenciar presença online/offline de usuários
 */
export const usePresence = (userId, userName) => {
  const { socket, connected } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState({});
  const [isOnline, setIsOnline] = useState(connected);

  // Registrar quando conecta
  useEffect(() => {
    if (socket && connected && userId) {
      socket.emit('user-online', {
        userId,
        userName,
        timestamp: new Date(),
        socketId: socket.id
      });
      setIsOnline(true);
      console.log(`🟢 ${userName} (${userId}) conectado`);
    }
  }, [socket, connected, userId, userName]);

  // Escutar quando outros usuários vêm online
  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (data) => {
      console.log(`🟢 Usuário online: ${data.userName}`);
      setOnlineUsers(prev => ({
        ...prev,
        [data.userId]: {
          name: data.userName,
          timestamp: new Date(data.timestamp),
          socketId: data.socketId,
          status: 'online'
        }
      }));
    };

    const handleUserOffline = (data) => {
      console.log(`🔴 Usuário offline: ${data.userId}`);
      setOnlineUsers(prev => {
        const updated = { ...prev };
        if (updated[data.userId]) {
          updated[data.userId].status = 'offline';
        }
        return updated;
      });

      // Remover após 5 segundos
      setTimeout(() => {
        setOnlineUsers(prev => {
          const updated = { ...prev };
          delete updated[data.userId];
          return updated;
        });
      }, 5000);
    };

    const handleOnlineUsersList = (data) => {
      console.log(`📊 Recebido lista de ${data.users.length} usuários online`);
      const newOnlineUsers = {};
      data.users.forEach(user => {
        newOnlineUsers[user.userId] = {
          name: user.userName,
          timestamp: new Date(user.timestamp),
          socketId: user.socketId,
          status: 'online'
        };
      });
      setOnlineUsers(newOnlineUsers);
    };

    socket.on('user-online', handleUserOnline);
    socket.on('user-offline', handleUserOffline);
    socket.on('online-users-list', handleOnlineUsersList);

    // Solicitar lista inicial de usuários online
    socket.emit('get-online-users');

    return () => {
      socket.off('user-online', handleUserOnline);
      socket.off('user-offline', handleUserOffline);
      socket.off('online-users-list', handleOnlineUsersList);
    };
  }, [socket]);

  // Notificar quando desconecta
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socket && userId) {
        socket.emit('user-offline', {
          userId,
          timestamp: new Date()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [socket, userId]);

  // Verificar conexão periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(connected);
    }, 5000);

    return () => clearInterval(interval);
  }, [connected]);

  // Obter lista de usuários online (exclui o usuário atual)
  const getOtherUsersOnline = useCallback(() => {
    return Object.entries(onlineUsers)
      .filter(([id]) => id !== userId.toString())
      .map(([id, data]) => ({
        userId: parseInt(id),
        ...data
      }));
  }, [onlineUsers, userId]);

  // Verificar se usuário específico está online
  const isUserOnline = useCallback((checkUserId) => {
    return onlineUsers[checkUserId]?.status === 'online';
  }, [onlineUsers]);

  // Contar usuários online
  const onlineCount = Object.values(onlineUsers).filter(u => u.status === 'online').length;

  return {
    isOnline,
    onlineUsers,
    onlineCount,
    getOtherUsersOnline,
    isUserOnline
  };
};

export default usePresence;
