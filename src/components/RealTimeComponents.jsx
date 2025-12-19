import React, { useState } from 'react';
import { useRealTimeNotifications, useRealTimeTeamChat } from '../hooks/useRealTime';
import { Bell, Send, Trash2 } from 'lucide-react';

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
 * RealTimeTeamChat - Chat de time com Socket.io
 */
export const RealTimeTeamChat = ({ teamId, userId, userName }) => {
  const { messages, sendTeamMessage } = useRealTimeTeamChat(teamId, userId);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendTeamMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Nenhuma mensagem ainda
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.sender !== userId && (
                  <p className="text-xs font-semibold mb-1">
                    {msg.sender}
                  </p>
                )}
                <p className="break-words">{msg.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
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
