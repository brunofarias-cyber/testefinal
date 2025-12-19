import React, { useState } from 'react';
import { RealTimeTeamChat } from '../components/RealTimeComponents';
import { ArrowLeft } from 'lucide-react';

/**
 * TeamChatPage - Página dedicada para chat de time em tempo real
 * Usa o componente RealTimeTeamChat que já tem Socket.io integrado
 */
const TeamChatPage = ({ teamId, teamName, userId, userName, onBack }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition"
      >
        Abrir Chat
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-200 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Chat do Time</h1>
              <p className="text-slate-500">{teamName}</p>
            </div>
          </div>
        </div>

        {/* Chat Component */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 h-96 md:h-[600px]">
          <RealTimeTeamChat
            teamId={teamId}
            userId={userId}
            userName={userName}
          />
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Este é um chat em tempo real. As mensagens aparecem instantaneamente para todos os membros do time!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamChatPage;
