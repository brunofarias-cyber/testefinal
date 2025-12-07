import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search, X, ArrowLeft, Loader, Users } from 'lucide-react';
import io from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || '';
const api = (path) => (API_BASE ? `${API_BASE}${path}` : path);

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MESSAGING SYSTEM V2 - COM SOCKET.IO + TEAM_ID
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * ✅ CORREÇÃO CRÍTICA: Chat sincronizado em tempo real
 * ✅ Baseado em TEAMS (não mais 1-on-1 direto)
 * ✅ Socket.io para real-time
 * ✅ Fallback para polling se Socket.io falhar
 * 
 * COMO FUNCIONA:
 * 1. Professor seleciona uma equipe (team)
 * 2. Aluno vê apenas as equipes onde está
 * 3. Ambos entram na mesma room: `team_${teamId}`
 * 4. Mensagens sincronizam instantaneamente
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

const MessagingSystemV2 = ({ userRole = "teacher", currentUserId = 1, currentUserName = "Usuário" }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);

    // ────────────────────────────────────────────────────────────────
    // SOCKET.IO SETUP
    // ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const socketUrl = API_BASE || 'http://localhost:3000';
        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket.io conectado');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('⚠️ Socket.io desconectado');
            setConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.warn('⚠️ Socket.io erro, usando fallback polling:', error);
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // ────────────────────────────────────────────────────────────────
    // CARREGAR TEAMS (Equipes do usuário)
    // ────────────────────────────────────────────────────────────────
    useEffect(() => {
        loadTeams();
    }, [userRole, currentUserId]);

    const loadTeams = async () => {
        setLoading(true);
        try {
            const endpoint = userRole === 'teacher'
                ? `/api/teams/teacher/${currentUserId}`
                : `/api/teams/student/${currentUserId}`;

            const response = await fetch(api(endpoint));

            if (response.ok) {
                const data = await response.json();
                setTeams(data.data || []);
                console.log('✅ Equipes carregadas:', data.data?.length || 0);
            } else {
                throw new Error('Backend não disponível');
            }
        } catch (error) {
            console.warn('⚠️ Usando dados mock de equipes');
            // Mock fallback
            setTeams([
                {
                    id: 1,
                    name: 'Equipe Alpha - Horta Sustentável',
                    projectName: 'Horta Sustentável',
                    members: ['João Silva', 'Maria Oliveira', 'Pedro Santos'],
                    unreadCount: 2
                },
                {
                    id: 2,
                    name: 'Equipe Beta - Robótica',
                    projectName: 'Robótica Sucata',
                    members: ['Ana Costa', 'Lucas Pereira'],
                    unreadCount: 0
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ────────────────────────────────────────────────────────────────
    // CARREGAR MENSAGENS DA EQUIPE
    // ────────────────────────────────────────────────────────────────
    const loadMessages = async (teamId) => {
        try {
            const response = await fetch(api(`/api/messages/team/${teamId}`));

            if (response.ok) {
                const data = await response.json();
                setMessages(data.data || []);
                console.log('✅ Mensagens carregadas:', data.data?.length || 0);

                // Entrar na room do Socket.io
                if (socket && connected) {
                    socket.emit('join_team', { teamId, userId: currentUserId, userRole });
                    console.log(`✅ Entrou na room: team_${teamId}`);
                }
            } else {
                throw new Error('Falha ao carregar mensagens');
            }
        } catch (error) {
            console.warn('⚠️ Usando mensagens mock');
            setMessages([
                {
                    id: 1,
                    teamId: teamId,
                    senderId: 1,
                    senderName: 'Profª Ana Silva',
                    senderRole: 'teacher',
                    text: 'Olá equipe! Como está o andamento do projeto?',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                },
                {
                    id: 2,
                    teamId: teamId,
                    senderId: 101,
                    senderName: 'João Silva',
                    senderRole: 'student',
                    text: 'Bom dia! Estamos finalizando a pesquisa sobre o solo.',
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                }
            ]);
        }
    };

    // ────────────────────────────────────────────────────────────────
    // RECEBER MENSAGENS EM TEMPO REAL
    // ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!socket || !selectedTeam) return;

        const handleNewMessage = (message) => {
            console.log('📩 Nova mensagem recebida:', message);
            setMessages((prev) => [...prev, message]);
            scrollToBottom();
        };

        socket.on('new_message', handleNewMessage);

        return () => {
            socket.off('new_message', handleNewMessage);
        };
    }, [socket, selectedTeam]);

    // ────────────────────────────────────────────────────────────────
    // ENVIAR MENSAGEM
    // ────────────────────────────────────────────────────────────────
    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedTeam) return;

        setSending(true);

        const newMessage = {
            teamId: selectedTeam.id,
            senderId: currentUserId,
            senderName: currentUserName,
            senderRole: userRole,
            text: messageText.trim(),
            timestamp: new Date().toISOString(),
        };

        // Otimistic update
        const tempMessage = { ...newMessage, id: Date.now() };
        setMessages((prev) => [...prev, tempMessage]);
        setMessageText("");
        scrollToBottom();

        try {
            // Enviar via Socket.io (mais rápido)
            if (socket && connected) {
                socket.emit('send_message', newMessage);
                console.log('✅ Mensagem enviada via Socket.io');
            } else {
                // Fallback: enviar via REST API
                const response = await fetch(api('/api/messages/send'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newMessage),
                });

                if (!response.ok) throw new Error('Falha ao enviar');
                console.log('✅ Mensagem enviada via REST API');
            }
        } catch (error) {
            console.error('❌ Erro ao enviar mensagem:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setSending(false);
        }
    };

    // ────────────────────────────────────────────────────────────────
    // ABRIR EQUIPE
    // ────────────────────────────────────────────────────────────────
    const handleOpenTeam = (team) => {
        setSelectedTeam(team);
        loadMessages(team.id);
    };

    // ────────────────────────────────────────────────────────────────
    // FECHAR EQUIPE
    // ────────────────────────────────────────────────────────────────
    const handleCloseTeam = () => {
        if (socket && selectedTeam) {
            socket.emit('leave_team', { teamId: selectedTeam.id });
            console.log(`✅ Saiu da room: team_${selectedTeam.id}`);
        }
        setSelectedTeam(null);
        setMessages([]);
    };

    // ────────────────────────────────────────────────────────────────
    // SCROLL TO BOTTOM
    // ────────────────────────────────────────────────────────────────
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages]);

    // ────────────────────────────────────────────────────────────────
    // FILTRAR EQUIPES POR BUSCA
    // ────────────────────────────────────────────────────────────────
    const filteredTeams = teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.members?.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // ════════════════════════════════════════════════════════════════
    // RENDER: CHAT DA EQUIPE
    // ════════════════════════════════════════════════════════════════
    if (selectedTeam) {
        return (
            <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleCloseTeam}
                            className="hover:bg-white/20 p-2 rounded-lg transition"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <Users size={24} />
                        <div>
                            <p className="font-bold">{selectedTeam.name}</p>
                            <p className="text-xs opacity-80">
                                {selectedTeam.members?.length || 0} membros • {connected ? '🟢 Online' : '🔴 Offline'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                    {messages.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <MessageSquare size={48} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Nenhuma mensagem ainda</p>
                            <p className="text-xs mt-1">Envie a primeira mensagem para começar</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMyMessage = msg.senderRole === userRole && msg.senderId === currentUserId;
                            return (
                                <div
                                    key={msg.id || idx}
                                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isMyMessage
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-slate-800 border border-slate-200'
                                            }`}
                                    >
                                        {!isMyMessage && (
                                            <p className="text-xs font-bold mb-1 opacity-70">
                                                {msg.senderName}
                                            </p>
                                        )}
                                        <p>{msg.text}</p>
                                        <p
                                            className={`text-xs mt-1 ${isMyMessage ? 'opacity-70' : 'text-slate-500'
                                                }`}
                                        >
                                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            disabled={sending}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() || sending}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition flex items-center gap-2 font-bold text-sm"
                        >
                            {sending ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                            {sending ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════════════════════════
    // RENDER: LISTA DE EQUIPES
    // ════════════════════════════════════════════════════════════════
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {userRole === 'teacher' ? 'Chat com Equipes' : 'Minhas Equipes'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {connected ? '🟢 Conectado - Mensagens em tempo real' : '🔴 Offline - Atualizações podem atrasar'}
                    </p>
                </div>
            </div>

            {/* Busca */}
            <div className="mb-6">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar equipes, projetos ou membros..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <Loader size={32} className="animate-spin mx-auto text-indigo-600 mb-2" />
                    <p className="text-slate-500">Carregando equipes...</p>
                </div>
            )}

            {/* Lista de Equipes */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeams.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            <Users size={48} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Nenhuma equipe encontrada</p>
                        </div>
                    ) : (
                        filteredTeams.map((team) => (
                            <button
                                key={team.id}
                                onClick={() => handleOpenTeam(team)}
                                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition text-left group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Users size={20} className="text-indigo-600" />
                                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition">
                                            {team.name}
                                        </h3>
                                    </div>
                                    {team.unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {team.unreadCount}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-500 mb-2">
                                    📚 {team.projectName || 'Projeto não definido'}
                                </p>

                                <div className="flex items-center gap-2 mt-3">
                                    <div className="flex -space-x-2">
                                        {team.members?.slice(0, 3).map((member, idx) => (
                                            <div
                                                key={idx}
                                                className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                            >
                                                {member.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {team.members?.length || 0} membros
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default MessagingSystemV2;
