import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Hook useSocket - Gerenciar conexão Socket.io
 * Garante que apenas uma conexão seja mantida
 */
let globalSocket = null;

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (globalSocket) {
      setSocket(globalSocket);
      setConnected(globalSocket.connected);
      return;
    }

    let socketUrl;
    if (API_BASE) {
      socketUrl = API_BASE;
    } else if (typeof window !== 'undefined' && window.location.origin) {
      socketUrl = window.location.origin;
    } else {
      socketUrl = 'http://localhost:3000';
    }

    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket.io conectado:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.io desconectado');
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.warn('⚠️ Socket.io erro:', error);
      setConnected(false);
    });

    globalSocket = newSocket;
    setSocket(newSocket);

    return () => {
      // Não fecha aqui para manter conexão global
    };
  }, []);

  return { socket, connected };
};

/**
 * Hook useSocketEvent - Escutar eventos do Socket.io
 */
export const useSocketEvent = (socket, eventName, handler) => {
  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [socket, eventName, handler]);
};

/**
 * Hook useEmitEvent - Emitir eventos via Socket.io
 */
export const useEmitEvent = (socket, connected) => {
  return useCallback((eventName, data) => {
    if (socket && connected) {
      socket.emit(eventName, data);
      console.log(`📤 Evento emitido: ${eventName}`, data);
      return true;
    }
    console.warn(`⚠️ Socket não conectado para: ${eventName}`);
    return false;
  }, [socket, connected]);
};
