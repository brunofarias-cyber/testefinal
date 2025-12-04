import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Plus, X } from 'lucide-react';

export const StudentChatPanel = ({ studentId, projectId }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [showNewChat, setShowNewChat] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
        fetchTeachers();
    }, [studentId]);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await fetch(`/api/messages/conversations/student/${studentId}`);
            const data = await res.json();
            setConversations(data.data || []);
            if (data.data.length > 0) {
                setSelectedConversation(data.data[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`/api/teachers`);
            const data = await res.json();
            setTeachers(data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const res = await fetch(`/api/messages/conversation/${conversationId}`);
            const data = await res.json();
            setMessages(data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const res = await fetch(`/api/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: selectedConversation.id,
                    senderId: studentId,
                    senderType: 'student',
                    message: newMessage,
                }),
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages(selectedConversation.id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateNewChat = async (teacherId) => {
        try {
            const res = await fetch(`/api/messages/conversations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    teacherId,
                    projectId,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setConversations([data.data, ...conversations]);
                setSelectedConversation(data.data);
                setShowNewChat(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex h-screen bg-white rounded-2xl border border-slate-100 overflow-hidden">
            {/* Sidebar de conversas */}
            <div className="w-64 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <button
                        onClick={() => setShowNewChat(!showNewChat)}
                        className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                    >
                        <Plus size={18} />
                        Nova Conversa
                    </button>
                </div>

                {showNewChat && (
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Selecione um professor</p>
                        <div className="space-y-2">
                            {teachers.map(teacher => (
                                <button
                                    key={teacher.id}
                                    onClick={() => handleCreateNewChat(teacher.id)}
                                    className="w-full p-2 text-left text-sm rounded hover:bg-slate-100 transition border border-slate-200"
                                >
                                    <p className="font-bold text-slate-700">{teacher.name}</p>
                                    <p className="text-xs text-slate-500">{teacher.subject}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`w-full p-4 text-left border-b border-slate-100 hover:bg-slate-50 transition ${selectedConversation?.id === conv.id ? 'bg-indigo-50' : ''
                                }`}
                        >
                            <p className="font-bold text-sm text-slate-800">{conv.teacherName}</p>
                            <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(conv.lastMessageDate).toLocaleDateString()}</p>
                            {conv.unreadCount > 0 && (
                                <span className="inline-block mt-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Área de mensagens */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                            <h3 className="font-bold text-lg">{selectedConversation.teacherName}</h3>
                            <p className="text-xs opacity-90">{selectedConversation.subject}</p>
                        </div>

                        {/* Mensagens */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderType === 'student' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderType === 'student'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-slate-100 text-slate-800 rounded-bl-none'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.message}</p>
                                        <p className={`text-xs mt-1 ${msg.senderType === 'student' ? 'opacity-70' : 'text-slate-500'
                                            }`}>
                                            {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500">
                        <div className="text-center">
                            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-bold">Nenhuma conversa iniciada</p>
                            <p className="text-sm mt-1">Clique em "Nova Conversa" para começar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
