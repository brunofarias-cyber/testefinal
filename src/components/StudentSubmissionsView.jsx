import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Upload, CheckCircle, AlertCircle, Clock, Bell, User, Download, FileText, Star } from 'lucide-react';

const MOCK_SUBMISSIONS = [
    {
        id: 1,
        projectTitle: 'Horta Sustentável',
        fileName: 'horta_projeto.pdf',
        fileUrl: '/uploads/horta_projeto.pdf',
        fileSize: 2048000,
        submittedAt: '2024-11-15T18:30:00Z',
        status: 'submitted',
        feedback: null,
        grade: null,
        comments: 'Inclui fotos do resultado final'
    },
    {
        id: 2,
        projectTitle: 'Robótica com Sucata',
        fileName: 'robotica_relatorio.docx',
        fileUrl: '/uploads/robotica_relatorio.docx',
        fileSize: 1536000,
        submittedAt: '2024-10-20T14:45:00Z',
        status: 'graded',
        feedback: 'Excelente relatório! Parabéns pela organização e detalhamento.',
        grade: 8.5,
        comments: 'Relatório técnico completo'
    }
];

const StudentSubmissionsView = () => {
    const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
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

        // Escutar notificação de entrega enviada
        newSocket.on('submission-uploaded', (data) => {
            console.log('📤 Entrega enviada:', data);

            // Criar novo registro
            const newSubmission = {
                id: submissions.length + 1,
                projectTitle: data.projectTitle,
                fileName: data.fileName,
                fileUrl: `/uploads/${data.fileName}`,
                fileSize: data.fileSize,
                submittedAt: new Date().toISOString(),
                status: 'submitted',
                feedback: null,
                grade: null
            };

            setSubmissions(prev => [newSubmission, ...prev]);

            setNotification({
                type: 'success',
                message: `${data.fileName} foi enviado com sucesso!`,
                projectTitle: data.projectTitle
            });

            setTimeout(() => setNotification(null), 5000);
        });

        // Escutar notificação de feedback
        newSocket.on('submission-feedback', (data) => {
            console.log('📝 Feedback recebido:', data);

            // Atualizar submissão existente
            setSubmissions(prev =>
                prev.map(s =>
                    s.projectTitle === data.projectTitle
                        ? {
                            ...s,
                            feedback: data.feedback,
                            grade: data.grade,
                            status: data.status
                          }
                        : s
                )
            );

            setNotification({
                type: 'feedback',
                message: `Prof. deixou feedback em "${data.projectTitle}"`,
                grade: data.grade,
                projectTitle: data.projectTitle
            });

            setTimeout(() => setNotification(null), 7000);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Calcular estatísticas
    const calculateStats = () => {
        const total = submissions.length;
        const submitted = submissions.filter(s => s.status === 'submitted').length;
        const graded = submissions.filter(s => s.status === 'graded').length;
        const withFeedback = submissions.filter(s => s.feedback).length;

        const avgGrade = graded > 0
            ? (submissions
                .filter(s => s.grade)
                .reduce((sum, s) => sum + s.grade, 0) / graded).toFixed(1)
            : 0;

        return { total, submitted, graded, withFeedback, avgGrade };
    };

    // Filtrar submissões
    const getFilteredSubmissions = () => {
        if (filter === 'all') return submissions;
        return submissions.filter(s => s.status === filter);
    };

    const stats = calculateStats();
    const filtered = getFilteredSubmissions();

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDownload = (submission) => {
        // Simular download do arquivo
        console.log('📥 Baixando arquivo:', submission.fileName);
        
        // Criar um elemento 'a' temporário para simular download
        const link = document.createElement('a');
        link.href = submission.fileUrl;
        link.download = submission.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Mostrar notificação
        setNotification({
            type: 'success',
            message: `Download de "${submission.fileName}" iniciado!`
        });
        setTimeout(() => setNotification(null), 3000);
    };

    const [expandedId, setExpandedId] = useState(null);

    const handleViewDetails = (submissionId) => {
        setExpandedId(expandedId === submissionId ? null : submissionId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                                    <Upload size={28} className="text-white" />
                                </div>
                                Minhas Entregas
                            </h2>
                            <p className="text-slate-500 text-base">Acompanhe seus envios e receba feedback dos professores</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔔 Notificação de Entrega/Feedback */}
            {notification && (
                <div className="fixed top-6 right-6 max-w-md z-50 animate-bounce">
                    <div className={`rounded-2xl shadow-xl p-4 flex items-start gap-4 ${
                        notification.type === 'feedback'
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                    }`}>
                        <div className="flex-shrink-0">
                            <Bell size={24} className="text-white animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold mb-1">
                                {notification.type === 'feedback' ? '📝 Novo Feedback!' : '✅ Entrega Confirmada!'}
                            </h3>
                            <p className="text-sm opacity-90">{notification.message}</p>
                            {notification.grade && (
                                <p className="text-lg font-extrabold mt-2">{notification.grade}/10</p>
                            )}
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
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Entregas</p>
                            <div className="p-2.5 bg-purple-100 rounded-lg">
                                <Upload size={20} className="text-purple-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-purple-600 mb-2">{stats.total}</p>
                        <p className="text-xs text-slate-500">projetos enviados</p>
                    </div>

                    {/* Pendente */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Em Avaliação</p>
                            <div className="p-2.5 bg-blue-100 rounded-lg">
                                <Clock size={20} className="text-blue-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-blue-600 mb-2">{stats.submitted}</p>
                        <p className="text-xs text-slate-500">aguardando feedback</p>
                    </div>

                    {/* Avaliado */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avaliados</p>
                            <div className="p-2.5 bg-green-100 rounded-lg">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-green-600 mb-2">{stats.graded}</p>
                        <p className="text-xs text-slate-500">com nota final</p>
                    </div>

                    {/* Média */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Média</p>
                            <div className="p-2.5 bg-yellow-100 rounded-lg">
                                <Star size={20} className="text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-yellow-600 mb-2">{stats.avgGrade}</p>
                        <p className="text-xs text-slate-500">de 10.0</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-indigo-500 rounded-2xl p-6 mb-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                            <AlertCircle size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-indigo-900 mb-1">📤 Como Enviar Trabalho</p>
                            <p className="text-sm text-indigo-800">
                                Clique em "Enviar Trabalho" para fazer upload de seus arquivos. <strong>Máximo 50MB</strong>. 
                                O professor será notificado automaticamente e você receberá feedback quando a avaliação estiver pronta.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Upload size={18} className="text-slate-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Filtrar por Status:</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { id: 'all', label: 'Todas', icon: '📋' },
                            { id: 'submitted', label: 'Em Avaliação', icon: '⏳' },
                            { id: 'graded', label: 'Avaliados', icon: '✅' }
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

                {/* Lista de Entregas */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-slate-100 rounded-full">
                                    <Upload size={32} className="text-slate-400" />
                                </div>
                            </div>
                            <p className="text-slate-600 font-bold mb-1">Nenhuma entrega encontrada</p>
                            <p className="text-sm text-slate-500">Tente ajustar seus filtros</p>
                        </div>
                    ) : (
                        filtered.map((submission) => (
                            <div
                                key={submission.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2.5 bg-purple-100 rounded-lg">
                                                <FileText size={20} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">
                                                    {submission.projectTitle}
                                                </h3>
                                                <p className="text-sm text-slate-600 mt-1">
                                                    📎 {submission.fileName} • {formatFileSize(submission.fileSize)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        {submission.status === 'graded' && submission.grade ? (
                                            <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm text-center">
                                                <div className="text-2xl font-extrabold">{submission.grade}</div>
                                                <div className="text-xs">Nota Final</div>
                                            </div>
                                        ) : (
                                            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold text-sm text-center">
                                                <div className="flex items-center gap-1 justify-center">
                                                    <Clock size={16} />
                                                    Em Avaliação
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Meta info */}
                                <div className="flex items-center gap-4 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-1">
                                        <Upload size={14} />
                                        Enviado: {formatDate(submission.submittedAt)}
                                    </div>
                                </div>

                                {/* Comments/Feedback */}
                                {submission.comments && (
                                    <div className="bg-slate-50 p-4 rounded-lg mb-4">
                                        <p className="text-xs font-bold text-slate-600 mb-2">💬 Seus comentários:</p>
                                        <p className="text-sm text-slate-800">{submission.comments}</p>
                                    </div>
                                )}

                                {/* Feedback */}
                                {submission.feedback && (
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
                                        <p className="text-xs font-bold text-green-900 mb-2">📝 Feedback do Professor:</p>
                                        <p className="text-sm text-green-900">{submission.feedback}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleDownload(submission)}
                                        className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                    {submission.status === 'graded' && submission.feedback && (
                                        <button 
                                            onClick={() => handleViewDetails(submission.id)}
                                            className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <CheckCircle size={16} />
                                            Ver Detalhes
                                        </button>
                                    )}
                                </div>

                                {/* Detalhes Expandidos */}
                                {expandedId === submission.id && submission.feedback && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 animate-in">
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
                                            <div className="mb-4">
                                                <p className="text-sm font-bold text-green-900 mb-2">📊 Avaliação Detalhada</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-lg p-3">
                                                        <p className="text-xs text-slate-600 mb-1">Nota Final</p>
                                                        <p className="text-2xl font-bold text-green-600">{submission.grade}/10</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3">
                                                        <p className="text-xs text-slate-600 mb-1">Percentual</p>
                                                        <p className="text-2xl font-bold text-green-600">{Math.round((submission.grade / 10) * 100)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-green-900 mb-2">💭 Comentário do Professor</p>
                                                <div className="bg-white rounded-lg p-3 text-sm text-slate-800">
                                                    {submission.feedback}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentSubmissionsView;
