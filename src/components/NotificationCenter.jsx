import React, { useState } from 'react';
import { X } from 'lucide-react';

const MOCK_TEACHER_NOTIFICATIONS = [
    { id: 1, type: "success", message: "Projeto 'Horta' foi avaliado com sucesso!", time: "2 horas atrás", read: false },
    { id: 2, type: "warning", message: "Pedro Santos está em risco no projeto", time: "5 horas atrás", read: false },
    { id: 3, type: "info", message: "Rubrica foi atualizada", time: "1 dia atrás", read: true },
];

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState(MOCK_TEACHER_NOTIFICATIONS);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Notificações</h2>
                {unreadCount > 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                        {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition ${notif.read
                                ? 'bg-slate-50 border-slate-200'
                                : 'bg-blue-50 border-blue-200 shadow-sm'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${notif.type === 'success' ? 'bg-green-500' :
                                    notif.type === 'warning' ? 'bg-orange-500' :
                                        'bg-blue-500'
                                }`}></div>
                            <div className="flex-1">
                                <p className={`font-bold ${notif.read ? 'text-slate-600' : 'text-slate-800'}`}>
                                    {notif.message}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notif.id);
                                }}
                                className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {notifications.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-slate-500 text-lg">Nenhuma notificação</p>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
