import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';

const NotificationCenter = ({ 
    userRole = "student", 
    notifications: propNotifications = null,
    setNotifications: propSetNotifications = null
}) => {
    const [localNotifications, setLocalNotifications] = useState([
        {
            id: 1,
            type: 'deadline',
            title: 'Prazo próximo: Horta Sustentável',
            message: 'Entrega em 2 dias - Complete seu relatório final',
            timestamp: '2023-12-01T10:30:00',
            read: false,
            icon: AlertCircle,
            color: 'bg-red-50 text-red-700'
        },
        {
            id: 2,
            type: 'feedback',
            title: 'Novo feedback recebido',
            message: 'Professor deixou comentário no seu projeto',
            timestamp: '2023-11-30T14:15:00',
            read: false,
            icon: Info,
            color: 'bg-blue-50 text-blue-700'
        },
        {
            id: 3,
            type: 'achievement',
            title: 'Conquista desbloqueada!',
            message: 'Você completou "Pesquisador" - +500 XP',
            timestamp: '2023-11-29T09:00:00',
            read: true,
            icon: CheckCircle,
            color: 'bg-green-50 text-green-700'
        },
        {
            id: 4,
            type: 'meeting',
            title: 'Reunião com professor',
            message: 'Próxima reunião: Quinta 14:00',
            timestamp: '2023-11-28T16:45:00',
            read: true,
            icon: Clock,
            color: 'bg-purple-50 text-purple-700'
        }
    ]);

    // Usar props se passadas, caso contrário usar state local
    const notifications = propNotifications !== null ? propNotifications : localNotifications;
    const setNotifications = propSetNotifications !== null ? propSetNotifications : setLocalNotifications;

    // Sincronizar quando props mudam
    useEffect(() => {
        if (propNotifications !== null) {
            setLocalNotifications(propNotifications);
        }
    }, [propNotifications]);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));

    };

    const handleDismiss = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Notificações</h2>
                    <p className="text-slate-500">Fique atualizado sobre seus projetos</p>
                </div>
                {unreadCount > 0 && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                        {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                        <Bell size={32} className="text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-600 font-medium">Nenhuma notificação</p>
                    </div>
                ) : (
                    notifications.map((notif) => {
                        const IconComponent = notif.icon;
                        return (
                            <div
                                key={notif.id}
                                className={`p-4 rounded-xl border-l-4 transition ${notif.read
                                        ? 'bg-slate-50 border-l-slate-300'
                                        : 'bg-white border-l-indigo-600 shadow-md'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg flex-shrink-0 ${notif.color}`}>
                                        <IconComponent size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800">{notif.title}</p>
                                        <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                                        <p className="text-xs text-slate-400 mt-2">
                                            {new Date(notif.timestamp).toLocaleDateString('pt-BR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {!notif.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notif.id)}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-200 transition"
                                            >
                                                Marcar como lida
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDismiss(notif.id)}
                                            className="p-2 hover:bg-slate-200 rounded-lg transition text-slate-400"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// ========================================
// COMPONENTE: StudentProgress.jsx
// ========================================

const StudentProgress = () => {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: "Horta Sustentável",
            progress: 85,
            grade: 8.5,
            status: "em-andamento",
            deadline: "2023-12-10"
        },
        {
            id: 2,
            name: "Jornal Digital",
            progress: 60,
            grade: 7.8,
            status: "em-andamento",
            deadline: "2023-12-15"
        },
        {
            id: 3,
            name: "Robótica Sucata",
            progress: 100,
            grade: 9.0,
            status: "concluído",
            deadline: "2023-11-30"
        },
        {
            id: 4,
            name: "Teatro Shakespeare",
            progress: 45,
            grade: null,
            status: "em-andamento",
            deadline: "2023-12-20"
        }
    ]);

    const calculateAverage = () => {
        const completed = projects.filter(p => p.grade).map(p => p.grade);
        if (completed.length === 0) return 0;
        return (completed.reduce((a, b) => a + b) / completed.length).toFixed(1);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'concluído':
                return 'bg-green-100 text-green-700';
            case 'em-andamento':
                return 'bg-blue-100 text-blue-700';
            case 'atrasado':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Média Geral</p>
                    <p className="text-4xl font-bold text-indigo-600">{calculateAverage()}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Projetos</p>
                    <p className="text-4xl font-bold text-indigo-600">{projects.length}</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Concluídos</p>
                    <p className="text-4xl font-bold text-green-600">
                        {projects.filter(p => p.status === 'concluído').length}
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Em Andamento</p>
                    <p className="text-4xl font-bold text-blue-600">
                        {projects.filter(p => p.status === 'em-andamento').length}
                    </p>
                </div>
            </div>

            {/* Lista de Projetos */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-800">Meus Projetos</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {projects.map((project) => (
                        <div key={project.id} className="p-6 hover:bg-slate-50 transition">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800">{project.name}</h4>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Entrega: {new Date(project.deadline).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                                        {project.status === 'concluído' ? '✓ Concluído' : 'Em Andamento'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${project.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                                }`}
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{project.progress}% concluído</p>
                                </div>
                                {project.grade && (
                                    <div className="ml-6 text-right">
                                        <p className="text-xs text-slate-500 uppercase font-bold">Nota</p>
                                        <p className={`text-2xl font-bold ${project.grade >= 8 ? 'text-green-600' :
                                                project.grade >= 6 ? 'text-yellow-600' :
                                                    'text-red-600'
                                            }`}>
                                            {project.grade}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { NotificationCenter, StudentProgress };
