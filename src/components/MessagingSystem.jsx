import React, { useState, useRef, useEffect } from "react";
import {
    MessageCircle,
    Send,
    Search,
    X,
    Phone,
    Info,
    MoreVertical,
    Users,
    Plus,
    Check,
    CheckCheck,
    Clock
} from "lucide-react";

// Mock data de conversas conectadas com equipes
const MOCK_TEAM_CONVERSATIONS = [
    {
        id: "team-1",
        type: "team",
        name: "Equipe Alpha - Horta Sustentável",
        projectName: "Horta Sustentável Urbana",
        teamMembers: [
            { id: 101, name: "João Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao", role: "student" },
            { id: 102, name: "Maria Oliveira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", role: "student" },
            { id: 103, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", role: "student" }
        ],
        teacher: { id: 1, name: "Profª Ana Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
        unread: 3,
        lastMessage: "João: Preparamos o canteiro e vamos plantar amanhã!",
        timestamp: "2023-12-01T14:30:00",
        createdAt: "2023-11-01",
        messages: [
            { id: 1, sender: { id: 1, name: "Profª Ana Silva", type: "teacher" }, text: "Oi equipe! Como vai o projeto?", timestamp: "2023-12-01T09:00:00", read: true },
            { id: 2, sender: { id: 101, name: "João Silva", type: "student" }, text: "Bom dia, Profª! Tudo bem!", timestamp: "2023-12-01T09:15:00", read: true },
            { id: 3, sender: { id: 102, name: "Maria Oliveira", type: "student" }, text: "Finalizamos a pesquisa sobre os tipos de solo!", timestamp: "2023-12-01T10:30:00", read: true },
            { id: 4, sender: { id: 1, name: "Profª Ana Silva", type: "teacher" }, text: "Excelente! E sobre os materiais?", timestamp: "2023-12-01T11:00:00", read: true },
            { id: 5, sender: { id: 101, name: "João Silva", type: "student" }, text: "Compramos as sementes e a terra chegou hoje", timestamp: "2023-12-01T14:00:00", read: false },
            { id: 6, sender: { id: 103, name: "Pedro Santos", type: "student" }, text: "Preparamos o canteiro e vamos plantar amanhã!", timestamp: "2023-12-01T14:30:00", read: false },
            { id: 7, sender: { id: 101, name: "João Silva", type: "student" }, text: "Podemos começar a documentação com fotos?", timestamp: "2023-12-01T14:45:00", read: false }
        ],
        status: "active"
    },
    {
        id: "team-2",
        type: "team",
        name: "Equipe Beta - Robótica",
        projectName: "Robótica e IA",
        teamMembers: [
            { id: 104, name: "Ana Costa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaC", role: "student" },
            { id: 105, name: "Lucas Pereira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", role: "student" }
        ],
        teacher: { id: 3, name: "Prof. Roberto Lima", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto" },
        unread: 1,
        lastMessage: "Lucas: Conseguimos rodar o primeiro código!",
        timestamp: "2023-11-30T16:45:00",
        createdAt: "2023-11-15",
        messages: [
            { id: 1, sender: { id: 3, name: "Prof. Roberto Lima", type: "teacher" }, text: "Equipe, como vai com os componentes eletrônicos?", timestamp: "2023-11-30T15:00:00", read: true },
            { id: 2, sender: { id: 104, name: "Ana Costa", type: "student" }, text: "Todos chegaram! Começamos a montar", timestamp: "2023-11-30T15:30:00", read: true },
            { id: 3, sender: { id: 105, name: "Lucas Pereira", type: "student" }, text: "Conseguimos rodar o primeiro código!", timestamp: "2023-11-30T16:45:00", read: false }
        ],
        status: "active"
    },
    {
        id: "individual-1",
        type: "individual",
        name: "João Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        participant: { id: 101, name: "João Silva", type: "student" },
        teacher: { id: 1, name: "Profª Ana Silva" },
        unread: 0,
        lastMessage: "João: Qual é o melhor tipo de solo para cenouras?",
        timestamp: "2023-12-01T14:30:00",
        messages: [
            { id: 1, sender: { id: 101, name: "João Silva", type: "student" }, text: "Bom dia, Profª!", timestamp: "2023-12-01T09:00:00", read: true },
            { id: 2, sender: { id: 1, name: "Profª Ana Silva", type: "teacher" }, text: "Oi João! Tudo bem?", timestamp: "2023-12-01T09:15:00", read: true },
            { id: 3, sender: { id: 101, name: "João Silva", type: "student" }, text: "Qual é o melhor tipo de solo para cenouras?", timestamp: "2023-12-01T14:30:00", read: false }
        ],
        status: "active"
    },
    {
        id: "individual-2",
        type: "individual",
        name: "Maria Oliveira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        participant: { id: 102, name: "Maria Oliveira", type: "student" },
        teacher: { id: 1, name: "Profª Ana Silva" },
        unread: 0,
        lastMessage: "Obrigada pela explicação! Ficou claro agora.",
        timestamp: "2023-11-30T16:45:00",
        messages: [
            { id: 1, sender: { id: 102, name: "Maria Oliveira", type: "student" }, text: "Profª, não entendi a rubrica", timestamp: "2023-11-30T15:00:00", read: true },
            { id: 2, sender: { id: 1, name: "Profª Ana Silva", type: "teacher" }, text: "Oi Maria, vou explicar...", timestamp: "2023-11-30T15:30:00", read: true },
            { id: 3, sender: { id: 102, name: "Maria Oliveira", type: "student" }, text: "Obrigada pela explicação! Ficou claro agora.", timestamp: "2023-11-30T16:45:00", read: true }
        ],
        status: "active"
    }
];

const MessagingSystem = ({ userRole = "teacher" }) => {
    const [conversations, setConversations] = useState(MOCK_TEAM_CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
    const [messageText, setMessageText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const messagesEndRef = useRef(null);

    // Auto-scroll para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selectedConversation?.messages]);

    const filteredConversations = conversations.filter(conv => {
        const matchesSearch =
            conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            filterType === "all" ||
            (filterType === "teams" && conv.type === "team") ||
            (filterType === "individuals" && conv.type === "individual");

        return matchesSearch && matchesFilter;
    });

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedConversation) return;

        const newMessage = {
            id: selectedConversation.messages.length + 1,
            sender: {
                id: userRole === "teacher" ? 1 : 101,
                name: userRole === "teacher" ? "Você (Professor)" : "Você (Aluno)",
                type: userRole
            },
            text: messageText,
            timestamp: new Date().toISOString(),
            read: true
        };

        const updatedConversations = conversations.map(conv => {
            if (conv.id === selectedConversation.id) {
                return {
                    ...conv,
                    messages: [...conv.messages, newMessage],
                    lastMessage: messageText,
                    timestamp: new Date().toISOString(),
                    unread: 0
                };
            }
            return conv;
        });

        setConversations(updatedConversations);
        setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id));
        setMessageText("");
    };

    const handleMarkAsRead = (convId) => {
        const updatedConversations = conversations.map(conv => {
            if (conv.id === convId) {
                return {
                    ...conv,
                    unread: 0,
                    messages: conv.messages.map(msg => ({ ...msg, read: true }))
                };
            }
            return conv;
        });
        setConversations(updatedConversations);
        if (selectedConversation.id === convId) {
            setSelectedConversation(updatedConversations.find(c => c.id === convId));
        }
    };

    if (!selectedConversation) {
        return (
            <div className="flex items-center justify-center h-96 bg-slate-50 rounded-xl">
                <p className="text-slate-500 text-center">
                    <MessageCircle size={40} className="mx-auto mb-4 opacity-50" />
                    Nenhuma conversa selecionada
                </p>
            </div>
        );
    }

    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Mensagens</h2>
                    <p className="text-slate-500">
                        Chat com alunos, equipes e coordenação
                        {totalUnread > 0 && (
                            <span className="ml-2 inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                                {totalUnread} não lidas
                            </span>
                        )}
                    </p>
                </div>
                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 transition shadow-lg shadow-indigo-200">
                    <Plus size={18} />
                    Nova Conversa
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
                {/* Lista de Conversas */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    {/* Header da Lista */}
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative mb-3">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar conversa..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            />
                        </div>
                        <div className="flex gap-2 text-xs font-bold">
                            <button
                                onClick={() => setFilterType("all")}
                                className={`px-3 py-1 rounded-full transition ${filterType === "all"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setFilterType("teams")}
                                className={`px-3 py-1 rounded-full transition ${filterType === "teams"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                Equipes
                            </button>
                            <button
                                onClick={() => setFilterType("individuals")}
                                className={`px-3 py-1 rounded-full transition ${filterType === "individuals"
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                Individuais
                            </button>
                        </div>
                    </div>

                    {/* Lista de Conversas Scrollável */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">
                                Nenhuma conversa encontrada
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => {
                                        setSelectedConversation(conv);
                                        handleMarkAsRead(conv.id);
                                    }}
                                    className={`p-4 border-b border-slate-100 cursor-pointer transition ${selectedConversation.id === conv.id
                                            ? "bg-indigo-50 border-indigo-200"
                                            : "hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex gap-3 items-start mb-2">
                                        {conv.type === "team" ? (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                                                <Users size={18} />
                                            </div>
                                        ) : (
                                            <img
                                                src={conv.avatar}
                                                alt={conv.name}
                                                className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-slate-200"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h3 className="font-bold text-slate-800 truncate text-sm">
                                                    {conv.name}
                                                </h3>
                                                {conv.unread > 0 && (
                                                    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex-shrink-0">
                                                        {conv.unread}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate ${conv.unread > 0
                                                    ? "text-slate-700 font-semibold"
                                                    : "text-slate-500"
                                                }`}>
                                                {conv.lastMessage}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {formatTimeRelative(conv.timestamp)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Membros da Equipe (se for equipe) */}
                                    {conv.type === "team" && conv.teamMembers && (
                                        <div className="flex gap-1 mt-2 flex-wrap">
                                            {conv.teamMembers.slice(0, 3).map((member) => (
                                                <img
                                                    key={member.id}
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    title={member.name}
                                                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                />
                                            ))}
                                            {conv.teamMembers.length > 3 && (
                                                <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 text-[10px] font-bold flex items-center justify-center border-2 border-white">
                                                    +{conv.teamMembers.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Área de Chat */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    {/* Header do Chat */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{selectedConversation.name}</h3>
                            {selectedConversation.type === "team" && (
                                <p className="text-xs text-slate-500">
                                    Projeto: {selectedConversation.projectName} • {selectedConversation.teamMembers?.length || 0} membros
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600" title="Ligar">
                                <Phone size={18} />
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600" title="Informações">
                                <Info size={18} />
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-600">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 to-white">
                        {selectedConversation.messages.map((msg, idx) => {
                            const isOwn = userRole === "teacher"
                                ? msg.sender.type === "teacher"
                                : msg.sender.type === "student";

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isOwn ? "justify-end" : "justify-start"} gap-2 animate-slide-up`}
                                >
                                    {!isOwn && selectedConversation.type === "team" && (
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender.name.split(" ")[0]}`}
                                            alt={msg.sender.name}
                                            className="w-8 h-8 rounded-full flex-shrink-0 border border-slate-200"
                                        />
                                    )}

                                    <div className={`max-w-xs ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                                        {selectedConversation.type === "team" && !isOwn && (
                                            <p className="text-xs font-bold text-slate-600 mb-1">{msg.sender.name}</p>
                                        )}
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 break-words ${isOwn
                                                    ? "bg-indigo-600 text-white rounded-br-none"
                                                    : "bg-slate-100 text-slate-800 rounded-bl-none"
                                                }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                        <div className={`text-xs mt-1 flex items-center gap-1 ${isOwn ? "text-slate-500" : "text-slate-400"
                                            }`}>
                                            <span>{formatTimeRelative(msg.timestamp)}</span>
                                            {isOwn && msg.read && (
                                                <CheckCheck size={12} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input de Mensagem */}
                    <div className="p-4 border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Digite uma mensagem..."
                            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition flex items-center gap-2"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-sm text-indigo-900">
                    <span className="font-bold">💡 Dica:</span> Use este espaço para comunicação com alunos individuais ou equipes inteiras. As mensagens são agrupadas por conversa e equipe para melhor organização.
                </p>
            </div>
        </div>
    );
};

// Função auxiliar para formatar tempo
function formatTimeRelative(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "agora";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d atrás`;

    return date.toLocaleDateString("pt-BR");
}

export default MessagingSystem;
