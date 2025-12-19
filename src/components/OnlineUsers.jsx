import React from 'react';
import { usePresence } from '../hooks/usePresence';
import { Users, Wifi, WifiOff, Circle } from 'lucide-react';

/**
 * OnlineUsersIndicator - Mostra lista de usuários online
 */
export const OnlineUsersIndicator = ({ userId, userName }) => {
  const { isOnline, onlineCount, getOtherUsersOnline } = usePresence(userId, userName);
  const otherUsers = getOtherUsersOnline();

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isOnline ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600">Desconectado</span>
            </>
          )}
        </div>
      </div>

      {/* Online Users */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-sm text-gray-900">
            {otherUsers.length} online
          </h3>
        </div>

        {otherUsers.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            Você é o único aqui
          </div>
        ) : (
          <div className="space-y-2">
            {otherUsers.map(user => (
              <div
                key={user.userId}
                className="flex items-center gap-2 p-2 rounded bg-gray-50 hover:bg-gray-100 transition"
              >
                <Circle className="w-3 h-3 text-green-500 fill-green-500" />
                <span className="text-sm text-gray-700 flex-1 truncate">
                  {user.name}
                </span>
                <span className="text-xs text-gray-400">
                  agora
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * StatusBadge - Badge compacto de status de conexão
 */
export const StatusBadge = ({ userId, userName }) => {
  const { isOnline, onlineCount } = usePresence(userId, userName);

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" 
         style={{
           backgroundColor: isOnline ? '#dcfce7' : '#fee2e2',
           color: isOnline ? '#166534' : '#991b1b'
         }}>
      <Circle className="w-2 h-2" style={{ fill: 'currentColor' }} />
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
};

export default {
  OnlineUsersIndicator,
  StatusBadge
};
