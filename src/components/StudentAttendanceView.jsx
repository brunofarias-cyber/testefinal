import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Calendar, BarChart3, TrendingUp, CheckCircle, AlertCircle, Clock, Bell, User } from 'lucide-react';

const MOCK_ATTENDANCE = [
    {
        id: 1,
        className: 'Biologia - Turma A',
        date: '2024-12-10',
        status: 'presente',
        teacherName: 'Prof. Ana Silva'
    },
    {
        id: 2,
        className: 'Biologia - Turma A',
        date: '2024-12-09',
        status: 'presente',
        teacherName: 'Prof. Ana Silva'
    },
    {
        id: 3,
        className: 'Matemática - Turma A',
        date: '2024-12-10',
        status: 'falta',
        teacherName: 'Prof. Roberto Lima'
    },
    {
        id: 4,
        className: 'História - Turma A',
        date: '2024-12-08',
        status: 'atraso',
        teacherName: 'Prof. Carlos Souza'
    }
];

const StudentAttendanceView = () => {
    const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
    const [notification, setNotification] = useState(null);
    const [socket, setSocket] = useState(null);
    const [filter, setFilter] = useState('all');

    // Conectar ao Socket.io
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');

        newSocket.on('connect', () => {
            console.log('✅ Conectado ao servidor');
            const studentId = 101; // Use authenticated student ID
            newSocket.emit('join-student', studentId);
        });

        // Escutar notificações de presença marcada
        newSocket.on('attendance-marked', (data) => {
            console.log('🔔 Presença marcada:', data);

            // Criar novo registro de presença
            const newRecord = {
                id: attendance.length + 1,
                className: data.className,
                date: new Date().toISOString().split('T')[0],
                status: data.status,
                teacherName: data.teacher,
                notes: data.notes
            };

            setAttendance(prev => [newRecord, ...prev]);

            // Mostrar notificação
            setNotification({
                type: 'success',
                message: `Prof. ${data.teacher} marcou sua presença como "${data.status}" em ${data.className}`,
                status: data.status
            });

            setTimeout(() => setNotification(null), 5000);
        });

        newSocket.on('attendance-updated', (data) => {
            console.log('📝 Presença atualizada:', data);

            // Atualizar registro existente
            setAttendance(prev =>
                prev.map(a =>
                    a.className === data.className
                        ? { ...a, status: data.status }
                        : a
                )
            );

            setNotification({
                type: 'info',
                message: `Sua presença em ${data.className} foi atualizada para "${data.status}"`,
                status: data.status
            });

            setTimeout(() => setNotification(null), 5000);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Calcular estatísticas
    const calculateStats = () => {
        const total = attendance.length;
        const presentes = attendance.filter(a => a.status === 'presente').length;
        const faltas = attendance.filter(a => a.status === 'falta').length;
        const atrasos = attendance.filter(a => a.status === 'atraso').length;
        const percentage = total > 0 ? ((presentes / total) * 100).toFixed(1) : 0;

        return { total, presentes, faltas, atrasos, percentage };
    };

    // Filtrar registros
    const getFilteredAttendance = () => {
        if (filter === 'all') return attendance;
        return attendance.filter(a => a.status === filter);
    };

    const stats = calculateStats();
    const filtered = getFilteredAttendance();

    // Ícones e cores
    const getStatusInfo = (status) => {
        switch (status) {
            case 'presente':
                return {
                    icon: '✅',
                    color: 'from-green-500 to-emerald-600',
                    label: 'Presente',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-700'
                };
            case 'falta':
                return {
                    icon: '❌',
                    color: 'from-red-500 to-rose-600',
                    label: 'Falta',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-700'
                };
            case 'atraso':
                return {
                    icon: '⏱️',
                    color: 'from-yellow-500 to-amber-600',
                    label: 'Atraso',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700'
                };
            default:
                return {};
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                    <Calendar size={28} className="text-white" />
                                </div>
                                Minha Presença
                            </h2>
                            <p className="text-slate-500 text-base">Acompanhe sua frequência nas aulas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔔 Notificação de Presença Marcada */}
            {notification && (
                <div className="fixed top-6 right-6 max-w-md z-50 animate-bounce">
                    <div className={`bg-gradient-to-r ${getStatusInfo(notification.status).color} text-white rounded-2xl shadow-xl p-4 flex items-start gap-4`}>
                        <div className="flex-shrink-0">
                            <Bell size={24} className="text-white animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold mb-1">Presença Marcada! 📋</h3>
                            <p className="text-sm opacity-90">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Aulas</p>
                            <div className="p-2.5 bg-indigo-100 rounded-lg">
                                <Calendar size={20} className="text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-indigo-600 mb-2">{stats.total}</p>
                        <p className="text-xs text-slate-500">aulas registradas</p>
                    </div>

                    {/* Presentes */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presentes</p>
                            <div className="p-2.5 bg-green-100 rounded-lg">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-green-600 mb-2">{stats.presentes}</p>
                        <p className="text-xs text-slate-500">frequência regular</p>
                    </div>

                    {/* Faltas */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faltas</p>
                            <div className="p-2.5 bg-red-100 rounded-lg">
                                <AlertCircle size={20} className="text-red-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-red-600 mb-2">{stats.faltas}</p>
                        <p className="text-xs text-slate-500">aulas perdidas</p>
                    </div>

                    {/* Porcentagem */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frequência</p>
                            <div className="p-2.5 bg-yellow-100 rounded-lg">
                                <TrendingUp size={20} className="text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-yellow-600 mb-2">{stats.percentage}%</p>
                        <p className="text-xs text-slate-500">de presença</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 rounded-2xl p-6 mb-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                            <AlertCircle size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-indigo-900 mb-1">📋 Frequência em Tempo Real</p>
                            <p className="text-sm text-indigo-800">
                                Sua presença é marcada pelos professores durante a aula. <strong>Você será notificado instantaneamente</strong> quando sua presença for registrada.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Calendar size={18} className="text-slate-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Filtrar por Status:</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { id: 'all', label: 'Todos', icon: '📋' },
                            { id: 'presente', label: 'Presentes', icon: '✅' },
                            { id: 'falta', label: 'Faltas', icon: '❌' },
                            { id: 'atraso', label: 'Atrasos', icon: '⏱️' }
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id)}
                                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                                    filter === f.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {f.icon} {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de Presença */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-slate-100 rounded-full">
                                    <Calendar size={32} className="text-slate-400" />
                                </div>
                            </div>
                            <p className="text-slate-600 font-bold mb-1">Nenhum registro encontrado</p>
                            <p className="text-sm text-slate-500">Tente ajustar seus filtros</p>
                        </div>
                    ) : (
                        filtered.map((record) => {
                            const info = getStatusInfo(record.status);
                            const date = new Date(record.date).toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });

                            return (
                                <div
                                    key={record.id}
                                    className={`${info.bgColor} border-l-4 ${info.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-3xl">{info.icon}</span>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800">
                                                        {record.className}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                                        <User size={14} />
                                                        <p>Prof. {record.teacherName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className={`inline-block px-4 py-2 rounded-xl font-bold text-sm ${info.textColor} ${info.bgColor}`}>
                                                {info.label}
                                            </div>
                                            <p className="text-xs text-slate-600 mt-2 flex items-center gap-1 justify-end">
                                                <Clock size={12} />
                                                {date}
                                            </p>
                                        </div>
                                    </div>

                                    {record.notes && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <p className="text-xs font-semibold text-slate-600 mb-1">📝 Observações:</p>
                                            <p className="text-sm text-slate-700">{record.notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceView;
