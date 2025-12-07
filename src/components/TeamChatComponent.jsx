import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Users, Lock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const api = (path) => (API_BASE ? `${API_BASE}${path}` : path);

// ═══════════════════════════════════════════════════════════════════════
// DADOS MOCK - Para testes e desenvolvimento
// ═══════════════════════════════════════════════════════════════════════

const MOCK_CHAT_MESSAGES = [
  {
    id: 1,
    team_id: 1, // Equipe 1
    sender_id: 101,
    sender_name: 'João Silva',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
    sender_role: 'student',
    message: 'Pesquisei sobre hortas e encontrei informações interessantes!',
    timestamp: '2025-01-20T10:30:00',
    read: true
  },
  {
    id: 2,
    team_id: 1,
    sender_id: 1,
    sender_name: 'Profª Ana Silva',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    sender_role: 'teacher',
    message: 'Ótimo, João! Podem compartilhar as fontes com o grupo?',
    timestamp: '2025-01-20T10:35:00',
    read: true
  },
  {
    id: 3,
    team_id: 1,
    sender_id: 102,
    sender_name: 'Maria Santos',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    sender_role: 'student',
    message: 'Eu posso fazer um resumo das fontes para compartilhar',
    timestamp: '2025-01-20T10:40:00',
    read: false
  },
  {
    id: 4,
    team_id: 2, // Equipe 2 (isolada)
    sender_id: 201,
    sender_name: 'Carlos Lima',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    sender_role: 'student',
    message: 'Essa mensagem NÃO deve aparecer para a Equipe 1',
    timestamp: '2025-01-20T11:00:00',
    read: true
  }
];

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL - CHAT ISOLADO POR EQUIPE
// ═══════════════════════════════════════════════════════════════════════

const TeamChatComponent = ({ 
  teamId, 
  currentUserId, 
  currentUserRole = 'student', 
  teamName = 'Equipe Alpha',
  currentUserName = 'Você',
  currentUserAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
}) => {
  // ────────────────────────────────────────────────────────────────
  // ESTADO
  // ────────────────────────────────────────────────────────────────

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // ────────────────────────────────────────────────────────────────
  // AUTOSCROLL
  // ────────────────────────────────────────────────────────────────

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ────────────────────────────────────────────────────────────────
  // CARREGAR MENSAGENS INICIAIS
  // ────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadMessages();
  }, [teamId]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    
    try {
      // Tentar buscar do backend
        const response = await fetch(api(`/api/teams/${teamId}/messages`), {
        headers: {
          'user-id': currentUserId.toString(),
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
        console.log(`✅ Mensagens carregadas do backend: ${data.data?.length || 0}`);
      } else {
        throw new Error('Backend não disponível');
      }
    } catch (error) {
      console.log('⚠️ Backend offline, usando dados mock');
      // Fallback: Filtrar apenas mensagens da equipe atual
      const teamMessages = MOCK_CHAT_MESSAGES.filter(m => m.team_id === teamId);
      setMessages(teamMessages);
    } finally {
      setLoadingMessages(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // SOCKET.IO - ISOLAMENTO POR SALA (ROOM)
  // ────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Em produção, descomente isso:
    /*
    import io from 'socket.io-client';
    
    socketRef.current = io(API_BASE || window.location.origin, {
      transports: ['websocket'],
      auth: {
        userId: currentUserId,
        token: localStorage.getItem('token')
      }
    });

    const socket = socketRef.current;

    // Entrar na sala da equipe (ISOLAMENTO)
    socket.emit('join-team', { 
      teamId, 
      userId: currentUserId,
      userName: currentUserName 
    });

    socket.on('connect', () => {
      setConnected(true);
      console.log(`✅ Conectado ao Socket.io - Sala: team-${teamId}`);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('❌ Desconectado do Socket.io');
    });

    // Receber mensagens APENAS da equipe (room isolado)
    socket.on(`team-${teamId}-message`, (message) => {
      console.log(`📨 Nova mensagem na equipe ${teamId}:`, message);
      setMessages(prev => [...prev, message]);
    });

    // Notificação de usuário entrando
    socket.on('user-joined', (data) => {
      console.log(`👤 Usuário entrou na sala: ${data.userName}`);
    });

    // Notificação de usuário saindo
    socket.on('user-left', (data) => {
      console.log(`👤 Usuário saiu da sala: ${data.userName}`);
    });

    // Limpar ao desmontar
    return () => {
      socket.emit('leave-team', { teamId, userId: currentUserId });
      socket.off(`team-${teamId}-message`);
      socket.off('user-joined');
      socket.off('user-left');
      socket.disconnect();
    };
    */

    // Modo de desenvolvimento (simulado)
    console.log(`🔌 Conectado à sala: team-${teamId} (modo simulado)`);
    setConnected(true);

    return () => {
      console.log(`🔌 Desconectado da sala: team-${teamId}`);
      setConnected(false);
    };
  }, [teamId, currentUserId, currentUserName]);

  // ────────────────────────────────────────────────────────────────
  // ENVIAR MENSAGEM
  // ────────────────────────────────────────────────────────────────

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setLoading(true);

    // Criar mensagem otimista (aparece imediatamente)
    const messageToSend = {
      id: Date.now(),
      team_id: teamId,
      sender_id: currentUserId,
      sender_name: currentUserName,
      sender_avatar: currentUserAvatar,
      sender_role: currentUserRole,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      optimistic: true // Flag para identificar mensagem local
    };

    // Adicionar localmente (UX otimista)
    setMessages(prev => [...prev, messageToSend]);
    setNewMessage('');

    try {
      // Tentar enviar para o backend
      const response = await fetch(api(`/api/teams/${teamId}/messages`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': currentUserId.toString(),
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          senderId: currentUserId,
          message: newMessage.trim(),
          teamId,
          senderName: currentUserName,
          senderAvatar: currentUserAvatar,
          senderRole: currentUserRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Mensagem salva no backend:', data);
        
        // Substituir mensagem otimista pela do servidor
        setMessages(prev => 
          prev.map(m => 
            m.optimistic && m.timestamp === messageToSend.timestamp 
              ? { ...data.message, optimistic: false }
              : m
          )
        );

        // Se tiver Socket.io, emitir evento
        if (socketRef.current?.connected) {
          socketRef.current.emit('send-message', {
            teamId,
            userId: currentUserId,
            message: newMessage.trim(),
            sender: {
              name: currentUserName,
              avatar: currentUserAvatar,
              role: currentUserRole
            }
          });
        }
      } else {
        throw new Error('Erro ao enviar');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      // Manter mensagem local mesmo com erro (modo offline)
      console.log('⚠️ Mensagem salva apenas localmente (modo offline)');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // MARCAR COMO LIDO
  // ────────────────────────────────────────────────────────────────

  const handleMarkAsRead = async (messageId) => {
    // Atualizar localmente
    setMessages(messages.map(m =>
      m.id === messageId ? { ...m, read: true } : m
    ));

    // Enviar para backend (opcional)
    try {
      await fetch(api(`/api/teams/${teamId}/messages/${messageId}/read`), {
        method: 'PUT',
        headers: {
          'user-id': currentUserId.toString(),
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
    } catch (error) {
      console.log('⚠️ Não foi possível marcar como lido no backend');
    }
  };

  // ────────────────────────────────────────────────────────────────
  // FORMATAR DATA
  // ────────────────────────────────────────────────────────────────

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '00:00';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      
      if (date.toDateString() === today.toDateString()) {
        return 'Hoje';
      }
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Ontem';
      }
      
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
      return '';
    }
  };

  // ────────────────────────────────────────────────────────────────
  // AGRUPAR MENSAGENS POR DATA
  // ────────────────────────────────────────────────────────────────

  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(msg => {
      const dateKey = formatDate(msg.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  // ────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────

  if (loadingMessages) {
    return (
      <div className="flex flex-col h-screen bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500">Carregando mensagens...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-lg">
      
      {/* ══════════════════════════════════════════════════════════ */}
      {/* HEADER DO CHAT */}
      {/* ══════════════════════════════════════════════════════════ */}
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              💬 {teamName}
              <Lock size={16} className="opacity-75" />
            </h3>
            <p className="text-sm opacity-90 flex items-center gap-2">
              🔒 Conversa privada da equipe
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                {messages.length} {messages.length === 1 ? 'mensagem' : 'mensagens'}
              </span>
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full ${
            connected ? 'bg-green-500/30' : 'bg-red-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connected ? 'bg-green-300 animate-pulse' : 'bg-red-300'
            }`}></div>
            {connected ? 'Online' : 'Offline'}
          </div>
          <div className="text-xs opacity-75">
            team_id: {teamId}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ÁREA DE MENSAGENS */}
      {/* ══════════════════════════════════════════════════════════ */}
      
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={64} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium text-lg mb-2">
                Nenhuma mensagem nesta conversa
              </p>
              <p className="text-slate-400 text-sm">
                Seja o primeiro a enviar uma mensagem! 👋
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                {/* Divisor de data */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-slate-200 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                    {date}
                  </div>
                </div>

                {/* Mensagens do dia */}
                <div className="space-y-4">
                  {msgs.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'
                      }`}
                      onMouseEnter={() => !msg.read && msg.sender_id !== currentUserId && handleMarkAsRead(msg.id)}
                    >
                      {/* Avatar (esquerda se não é usuário) */}
                      {msg.sender_id !== currentUserId && (
                        <img
                          src={msg.sender_avatar}
                          alt={msg.sender_name}
                          className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white shadow-md"
                          title={msg.sender_name}
                        />
                      )}

                      {/* Mensagem */}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                          msg.sender_id === currentUserId
                            ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-br-none'
                            : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                        }`}
                      >
                        {/* Nome do remetente (apenas se não for o usuário) */}
                        {msg.sender_id !== currentUserId && (
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-bold text-indigo-600">
                              {msg.sender_name}
                            </p>
                            {msg.sender_role === 'teacher' && (
                              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                👨‍🏫 Professor
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Texto da mensagem */}
                        <p className="text-sm break-words leading-relaxed">
                          {msg.message}
                        </p>
                        
                        {/* Timestamp e status de leitura */}
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            msg.sender_id === currentUserId
                              ? 'text-white/70'
                              : 'text-slate-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                          
                          {msg.sender_id === currentUserId && (
                            <span className="text-xs text-white/70">
                              {msg.read ? '✓✓ Lido' : '✓ Enviado'}
                            </span>
                          )}
                          
                          {msg.optimistic && (
                            <span className="text-xs text-white/50 italic">
                              Enviando...
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Avatar (direita se é usuário) */}
                      {msg.sender_id === currentUserId && (
                        <img
                          src={msg.sender_avatar || currentUserAvatar}
                          alt="Você"
                          className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white shadow-md"
                          title="Você"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* INPUT DE MENSAGEM */}
      {/* ══════════════════════════════════════════════════════════ */}
      
      <div className="border-t border-slate-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite uma mensagem..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:bg-slate-100 transition"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send size={18} />
                <span className="hidden sm:inline">Enviar</span>
              </>
            )}
          </button>
        </form>
        
        {/* Contador de caracteres */}
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-slate-400">
            {newMessage.length}/500 caracteres
          </p>
          {!connected && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Modo offline - mensagens salvas localmente
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamChatComponent;
