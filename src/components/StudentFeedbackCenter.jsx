import React, { useState, useEffect } from 'react';
import { MessageSquare, User, Calendar, Star, TrendingUp, Award, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const api = (path) => (API_BASE ? `${API_BASE}${path}` : path);

const StudentFeedbackCenter = ({ currentUserId = 101 }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'individual', 'team'
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeedbacks();
    }, [currentUserId]);

    const loadFeedbacks = async () => {
        setLoading(true);
        try {
            // Simulando API - substituir por endpoint real
            const mockFeedbacks = [
                {
                    id: 1,
                    type: 'individual',
                    projectName: 'Horta Sustentável',
                    teacherName: 'Profª Ana Silva',
                    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
                    date: '2023-11-20',
                    grade: 9.0,
                    feedback: 'Excelente trabalho, João! Sua pesquisa sobre tipos de solo foi muito bem fundamentada. Continue assim! Você demonstrou grande interesse e dedicação.',
                    highlights: ['Pesquisa aprofundada', 'Ótima organização', 'Dados bem apresentados'],
                    improvements: ['Poderia incluir mais fotos do processo'],
                    read: true
                },
                {
                    id: 2,
                    type: 'team',
                    projectName: 'Horta Sustentável',
                    teamName: 'Equipe Alpha',
                    teacherName: 'Profª Ana Silva',
                    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
                    date: '2023-11-18',
                    feedback: 'A equipe está bem alinhada e a divisão de tarefas funcionou bem. Para o próximo projeto, seria interessante melhorar a documentação fotográfica do processo.',
                    highlights: ['Boa colaboração', 'Tarefas bem divididas'],
                    improvements: ['Melhorar documentação fotográfica', 'Comunicação mais frequente'],
                    read: true
                },
                {
                    id: 3,
                    type: 'individual',
                    projectName: 'Robótica',
                    teacherName: 'Prof. Roberto Lima',
                    teacherAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
                    date: '2023-11-15',
                    grade: 8.5,
                    feedback: 'Ótima lógica de programação no código do robô. Para melhorar, tente adicionar mais comentários explicativos no código.',
                    highlights: ['Lógica de programação excelente', 'Criatividade na solução'],
                    improvements: ['Adicionar comentários no código', 'Documentar processo de testes'],
                    read: false
                }
            ];

            setFeedbacks(mockFeedbacks);
            console.log('✅ Feedbacks carregados:', mockFeedbacks.length);
        } catch (error) {
            console.error('❌ Erro ao carregar feedbacks:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (feedbackId) => {
        try {
            setFeedbacks(feedbacks.map(f => 
                f.id === feedbackId ? { ...f, read: true } : f
            ));
        } catch (error) {
            console.error('❌ Erro ao marcar como lido:', error);
        }
    };

    const toggleExpand = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            const feedback = feedbacks.find(f => f.id === id);
            if (feedback && !feedback.read) {
                markAsRead(id);
            }
        }
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        if (filter === 'all') return true;
        return f.type === filter;
    });

    const unreadCount = feedbacks.filter(f => !f.read).length;
    const averageGrade = feedbacks
        .filter(f => f.grade)
        .reduce((sum, f, _, arr) => sum + (f.grade / arr.length), 0)
        .toFixed(1);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-extrabold mb-2">Central de Feedbacks</h2>
                <p className="text-indigo-100">Acompanhe suas avaliações e orientações dos professores</p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                            <MessageSquare size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                            <p className="text-2xl font-bold text-slate-800">{feedbacks.length}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Feedbacks recebidos</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <Star size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Média</p>
                            <p className="text-2xl font-bold text-slate-800">{averageGrade}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Nota média geral</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <Award size={24} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Não Lidos</p>
                            <p className="text-2xl font-bold text-slate-800">{unreadCount}</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Aguardando leitura</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <div className="flex gap-3">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition ${
                            filter === 'all'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Todos ({feedbacks.length})
                    </button>
                    <button
                        onClick={() => setFilter('individual')}
                        className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition ${
                            filter === 'individual'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Individuais ({feedbacks.filter(f => f.type === 'individual').length})
                    </button>
                    <button
                        onClick={() => setFilter('team')}
                        className={`flex-1 px-4 py-2 rounded-lg font-bold text-sm transition ${
                            filter === 'team'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        Equipe ({feedbacks.filter(f => f.type === 'team').length})
                    </button>
                </div>
            </div>

            {/* Lista de Feedbacks */}
            <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl">
                        <MessageSquare size={48} className="text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">Nenhum feedback disponível</p>
                    </div>
                ) : (
                    filteredFeedbacks.map((feedback) => (
                        <div
                            key={feedback.id}
                            className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                                !feedback.read ? 'border-indigo-300 shadow-indigo-100' : 'border-slate-200'
                            }`}
                        >
                            <div
                                className="p-6 cursor-pointer hover:bg-slate-50 transition"
                                onClick={() => toggleExpand(feedback.id)}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <img
                                            src={feedback.teacherAvatar}
                                            className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-slate-800">
                                                    {feedback.projectName}
                                                </h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    feedback.type === 'individual'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {feedback.type === 'individual' ? 'Individual' : 'Equipe'}
                                                </span>
                                                {!feedback.read && (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                        Novo
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 mb-2">
                                                {feedback.teacherName} • {new Date(feedback.date).toLocaleDateString('pt-BR')}
                                            </p>
                                            <p className="text-sm text-slate-700 line-clamp-2">
                                                {feedback.feedback}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {feedback.grade && (
                                            <div className="text-center px-4 py-2 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Nota</p>
                                                <p className="text-2xl font-bold text-indigo-600">{feedback.grade}</p>
                                            </div>
                                        )}
                                        {expandedId === feedback.id ? (
                                            <ChevronUp size={20} className="text-slate-400" />
                                        ) : (
                                            <ChevronDown size={20} className="text-slate-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Conteúdo Expandido */}
                            {expandedId === feedback.id && (
                                <div className="px-6 pb-6 border-t border-slate-100 pt-6 space-y-4 animate-fade-in">
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-sm leading-relaxed text-slate-700">{feedback.feedback}</p>
                                    </div>

                                    {feedback.highlights && feedback.highlights.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-600" />
                                                Pontos Fortes
                                            </h4>
                                            <ul className="space-y-1">
                                                {feedback.highlights.map((highlight, idx) => (
                                                    <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                                                        <span className="text-green-500 font-bold">✓</span>
                                                        {highlight}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {feedback.improvements && feedback.improvements.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-blue-600" />
                                                Oportunidades de Melhoria
                                            </h4>
                                            <ul className="space-y-1">
                                                {feedback.improvements.map((improvement, idx) => (
                                                    <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                                                        <span className="text-blue-500 font-bold">→</span>
                                                        {improvement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentFeedbackCenter;
