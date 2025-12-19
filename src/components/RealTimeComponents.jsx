import React, { useState, useRef, useEffect } from 'react';
import { useRealTimeNotifications, useRealTimeTeamChat } from '../hooks/useRealTime';
import { Bell, Send, Trash2, ChevronUp } from 'lucide-react';

/**
 * NotificationCenter - Exibe notificações em tempo real
 */
export const NotificationCenter = ({ userId }) => {
  const { notifications, markAsRead, clearNotification, unreadCount } = 
    useRealTimeNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center 
            px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 
            -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhuma notificação
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition 
                  ${!notif.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {notif.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-2 block">
                      {new Date(notif.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(notif.id);
                    }}
                    className="text-gray-400 hover:text-red-500 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

/**
 * RealTimeTeamChat - Chat de time com Socket.io e Persistência
 */
export const RealTimeTeamChat = ({ teamId, userId, userName }) => {
  const { messages, loading, sendTeamMessage, loadMoreMessages, hasMoreMessages } = 
    useRealTimeTeamChat(teamId, userId);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll ao final quando novas mensagens chegam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendTeamMessage(messageText);
      setMessageText('');
    }
  };

  const handleLoadMore = () => {
    if (hasMoreMessages) {
      loadMoreMessages(messages.length);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
        <h3 className="font-semibold text-sm">💬 Chat do Time</h3>
        <p className="text-xs opacity-90">{messages.length} mensagens</p>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Load More Button */}
        {hasMoreMessages && messages.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full py-2 text-sm text-blue-500 hover:bg-blue-50 rounded transition disabled:opacity-50"
          >
            {loading ? '⏳ Carregando...' : (
              <>
                <ChevronUp className="w-4 h-4 inline" /> Carregar mensagens antigas
              </>
            )}
          </button>
        )}

        {messages.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Nenhuma mensagem ainda. Comece a conversar!
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === userId || msg.sender === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.senderId === userId || msg.sender === userId
                    ? `bg-blue-500 text-white ${msg.pending ? 'opacity-60' : ''}`
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {(msg.senderId !== userId && msg.sender !== userId) && (
                  <p className="text-xs font-semibold mb-1">
                    {msg.senderName || msg.sender}
                  </p>
                )}
                <p className="break-words">{msg.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {msg.pending && ' 📤'}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!messageText.trim() || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default {
  NotificationCenter,
  RealTimeTeamChat
};
