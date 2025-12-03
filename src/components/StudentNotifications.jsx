import React, { useState } from "react";
import {
    AlertCircle, CheckCircle, MessageSquare, Award, Bell, X, Check, Filter,
    Clock, Zap, BookOpen, Users
} from "lucide-react";

const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        type: "deadline",
        title: "Entrega da Horta em 2 dias",
        message: "Relatório de Crescimento - Profª Ana Silva",
        date: "2023-11-13",
        read: false,
        priority: "high",
        icon: "deadline"
    },
    {
        id: 2,
        type: "feedback",
        title: "Feedback: Horta Sustentável",
        message: "Sua nota: 9.0 - Excelente trabalho! Documentação muito clara.",
        date: "2023-11-12",
        read: false,
        priority: "high",
        icon: "feedback"
    },
    {
        id: 3,
        type: "message",
        title: "Nova mensagem de Prof. Carlos Souza",
        message: "João, veja o email que enviei sobre o Jornal Digital.",
        date: "2023-11-11",
        read: true,
        priority: "normal",
        icon: "message"
    },
    {
        id: 4,
        type: "achievement",
        title: "Conquista desbloqueada!",
        message: "A Volta por Cima - Melhoraste em relação ao projeto anterior.",
        date: "2023-11-10",
        read: true,
        priority: "normal",
        icon: "achievement"
    },
    {
        id: 5,
        type: "announcement",
        title: "Novo projeto: Jornal Digital",
        message: "Prof. Carlos abriu o novo projeto. Clique para ver detalhes.",
        date: "2023-11-09",
        read: true,
        priority: "normal",
        icon: "announcement"
    },
    {
        id: 6,
        type: "deadline",
        title: "Próxima entrega: Robótica",
        message: "Apresentação Final - Prof. Roberto Lima",
        date: "2023-11-05",
        read: true,
        priority: "normal",
        icon: "deadline"
    }
];

const getNotificationIcon = (type) => {
    const icons = {
        deadline: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
        feedback: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
        message: { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
        achievement: { icon: Award, color: "text-yellow-600", bg: "bg-yellow-50" },
        announcement: { icon: Bell, color: "text-purple-600", bg: "bg-purple-50" }
    };
    return icons[type] || icons.announcement;
};

const getNotificationLabel = (type) => {
    const labels = {
        deadline: "📋 Entrega",
        feedback: "✅ Feedback",
        message: "💬 Mensagem",
        achievement: "🏆 Conquista",
        announcement: "📢 Comunicado"
    };
    return labels[type];
};

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filterType, setFilterType] = useState("all");

    const unreadCount = notifications.filter((n) => !n.read).length;

    const filteredNotifications = notifications.filter((n) => {
        if (filterType === "all") return true;
        return n.type === filterType;
    });

    const handleMarkAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleDelete = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Notificações</h2>
                    <p className="text-slate-500">Acompanhe avisos, feedbacks e conquistas</p>
                </div>
                {unreadCount > 0 && (
                    <div className="flex gap-3">
                        <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
                        </span>
                        <button
                            onClick={handleMarkAllAsRead}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition shadow-lg"
                        >
                            Marcar todas como lidas
                        </button>
                    </div>
                )}
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter size={20} className="text-slate-600" />
                    <h3 className="font-bold text-slate-800">Filtrar por tipo</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "all", label: "Todas", icon: "📊" },
                        { id: "deadline", label: "Entregas", icon: "📋" },
                        { id: "feedback", label: "Feedback", icon: "✅" },
                        { id: "message", label: "Mensagens", icon: "💬" },
                        { id: "achievement", label: "Conquistas", icon: "🏆" },
                        { id: "announcement", label: "Comunicados", icon: "📢" }
                    ].map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => setFilterType(filter.id)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${filterType === filter.id
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {filter.icon} {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed de Notificações */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => {
                        const notifIcon = getNotificationIcon(notification.type);
                        const NotifIcon = notifIcon.icon;

                        return (
                            <div
                                key={notification.id}
                                className={`rounded-2xl border transition-all p-6 flex items-start gap-4 ${notification.read
                                        ? "bg-white border-slate-100 shadow-sm hover:shadow-md"
                                        : "bg-slate-50 border-indigo-200 shadow-md"
                                    }`}
                            >
                                {/* Ícone */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${notifIcon.bg}`}>
                                    <NotifIcon size={24} className={notifIcon.color} />
                                </div>

                                {/* Conteúdo */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <h3 className={`font-bold text-sm ${notification.read ? "text-slate-800" : "text-slate-900"}`}>
                                                {notification.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">{getNotificationLabel(notification.type)}</p>
                                        </div>
                                        {!notification.read && (
                                            <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5"></span>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-600 mb-3">{notification.message}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">
                                            {new Date(notification.date).toLocaleDateString("pt-BR")}
                                        </span>

                                        <div className="flex gap-2">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                                    title="Marcar como lido"
                                                >
                                                    <Check size={14} /> Marcar lido
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-lg transition"
                                                title="Remover"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                        <Bell size={40} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 font-bold mb-1">Nenhuma notificação</p>
                        <p className="text-sm text-slate-500">Você está tudo certo! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotifications;
