import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, Phone, Video, Info, X, ArrowLeft } from 'lucide-react';

// DADOS MOCK DE CONVERSAS
const MOCK_CONVERSATIONS = [
    {
        id: 1,
        participant: { id: 101, name: "João Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao", role: "student" },
        lastMessage: "Professor, tenho uma dúvida sobre a horta sustentável...",
        timestamp: "2023-12-01T14:30:00",
        unread: 2,
        messages: [
            { id: 1, sender: "student", text: "Bom dia, professor! Tudo bem?", timestamp: "2023-12-01T09:00:00", read: true },
            { id: 2, sender: "teacher", text: "Bom dia, João! Tudo ótimo, e você?", timestamp: "2023-12-01T09:15:00", read: true },
            { id: 3, sender: "student", text: "Tô bem! Tenho uma dúvida sobre o projeto da horta.", timestamp: "2023-12-01T14:20:00", read: true },
            { id: 4, sender: "student", text: "Qual é o melhor tipo de solo para cenouras?", timestamp: "2023-12-01T14:30:00", read: false },
        ]
    },
    {
        id: 2,
        participant: { id: 102, name: "Maria Oliveira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", role: "student" },
        lastMessage: "Obrigada pela explicação! Ficou claro agora.",
        timestamp: "2023-11-30T16:45:00",
        unread: 0,
        messages: [
            { id: 1, sender: "student", text: "Professor, não entendi a parte da rubrica sobre trabalho em equipe", timestamp: "2023-11-30T15:00:00", read: true },
            { id: 2, sender: "teacher", text: "Oi Maria! Vou te explicar. A rubrica avalia...", timestamp: "2023-11-30T15:30:00", read: true },
            { id: 3, sender: "student", text: "Obrigada pela explicação! Ficou claro agora.", timestamp: "2023-11-30T16:45:00", read: true },
        ]
    },
    {
        id: 3,
        participant: { id: 103, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", role: "student" },
        lastMessage: "Posso entregar amanhã?",
        timestamp: "2023-11-29T11:20:00",
        unread: 1,
        messages: [
            { id: 1, sender: "student", text: "Professor, tive um problema e não consegui terminar o relatório", timestamp: "2023-11-29T10:00:00", read: true },
            { id: 2, sender: "student", text: "Posso entregar amanhã?", timestamp: "2023-11-29T11:20:00", read: false },
        ]
    },
    {
        id: 4,
        participant: { id: 1, name: "Profª Ana Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", role: "teacher" },
        lastMessage: "Parabéns pelo seu desempenho no último projeto!",
        timestamp: "2023-11-28T10:00:00",
        unread: 0,
        messages: [
            { id: 1, sender: "teacher", text: "Olá João! Vi sua entrega.", timestamp: "2023-11-28T09:30:00", read: true },
            { id: 2, sender: "teacher", text: "Parabéns pelo seu desempenho no último projeto!", timestamp: "2023-11-28T10:00:00", read: true },
            { id: 3, sender: "student", text: "Muito obrigado, professora! ❤️", timestamp: "2023-11-28T10:15:00", read: true },
        ]
    }
];

const MessagingSystem = ({ userRole = "teacher" }) => {
    const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showInfo, setShowInfo] = useState(false);

    // Filtrar conversas por busca
    const filteredConversations = conversations.filter(conv =>
        conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Enviar mensagem
    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedConversation) return;

        const newMessage = {
            id: selectedConversation.messages.length + 1,
            sender: userRole,
            text: messageText,
            timestamp: new Date().toISOString(),
            read: false
        };

        const updatedConversations = conversations.map(conv => {
            if (conv.id === selectedConversation.id) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    lastMessage: messageText,
                    timestamp: newMessage.timestamp,
                    unread: 0
                };
            }
            return conv;
        });

        setConversations(updatedConversations);
        setSelectedConversation({
            ...selectedConversation,
            messages: [...selectedConversation.messages, newMessage]
        });
        setMessageText("");
    };

    // Marcar como lido
    const handleOpenConversation = (conversation) => {
        const updated = {
            ...conversation,
            unread: 0
        };
        setSelectedConversation(updated);
    };

    if (selectedConversation) {
        return (
            <div className="max-w-4xl mx-auto h-screen flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedConversation(null)}
                            className="hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <img
                            src={selectedConversation.participant.avatar}
                            alt={selectedConversation.participant.name}
                            className="w-10 h-10 rounded-full border-2 border-white/30"
                        />
                        <div>
                            <p className="font-bold">{selectedConversation.participant.name}</p>
                            <p className="text-xs opacity-80">Ativo agora</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="hover:bg-white/20 p-2 rounded-lg transition">
                            <Phone size={18} />
                        </button>
                        <button className="hover:bg-white/20 p-2 rounded-lg transition">
                            <Video size={18} />
                        </button>
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className="hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            <Info size={18} />
                        </button>
                    </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {selectedConversation.messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === userRole ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === userRole
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-100 text-slate-800'
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === userRole ? 'opacity-70' : 'text-slate-500'
                                    }`}>
                                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition flex items-center gap-2 font-bold"
                        >
                            <Send size={18} />
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Lista de Conversas */}
                <div className="lg:col-span-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Mensagens</h2>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar conversas..."
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {filteredConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => handleOpenConversation(conv)}
                                className="w-full p-4 hover:bg-slate-50 transition text-left"
                            >
                                <div className="flex gap-3">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={conv.participant.avatar}
                                            alt={conv.participant.name}
                                            className="w-12 h-12 rounded-full border border-slate-200"
                                        />
                                        {conv.unread > 0 && (
                                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {conv.unread}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800">{conv.participant.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(conv.timestamp).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Área Vazia */}
                <div className="lg:col-span-2 hidden lg:flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <div className="text-center">
                        <MessageSquare size={48} className="text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhuma conversa selecionada</h3>
                        <p className="text-slate-600">Clique em uma conversa para começar</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingSystem;
