import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Award, TrendingUp } from 'lucide-react';
import io from 'socket.io-client';

const StudentRubricsView = ({ studentId = 101 }) => {
    const [rubricScores, setRubricScores] = useState([]);
    const [rubrics, setRubrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, graded
    const [expandedScore, setExpandedScore] = useState(null);

    useEffect(() => {
        // Carregar rúbricas e avaliações
        loadRubricScores();

        // Socket.io listener
        const socket = io();

        socket.on('connect', () => {
            socket.emit('join-student', studentId);
        });

        socket.on('rubric-evaluated', (data) => {
            setNotification({
                type: 'success',
                title: 'Nova Avaliação!',
                message: `${data.projectTitle}: ${data.percentage}% - ${data.evaluatedBy}`,
                timestamp: new Date(data.evaluatedAt).toLocaleTimeString()
            });

            // Recarregar dados
            loadRubricScores();

            setTimeout(() => setNotification(null), 7000);
        });

        socket.on('rubric-updated', (data) => {
            setNotification({
                type: 'info',
                title: 'Avaliação Atualizada',
                message: `${data.projectTitle}: ${data.percentage}% (${data.totalPoints} pontos)`,
                timestamp: new Date(data.updatedAt).toLocaleTimeString()
            });

            loadRubricScores();

            setTimeout(() => setNotification(null), 7000);
        });

        socket.on('rubric-score-deleted', (data) => {
            setNotification({
                type: 'warning',
                title: 'Avaliação Removida',
                message: `Sua avaliação de ${data.projectTitle} foi removida`,
                timestamp: new Date().toLocaleTimeString()
            });

            loadRubricScores();

            setTimeout(() => setNotification(null), 7000);
        });

        return () => {
            socket.disconnect();
        };
    }, [studentId]);

    const loadRubricScores = async () => {
        try {
            setLoading(true);

            // Simular carregamento de todas as avaliações do aluno
            const response = await fetch(`/api/rubrics?studentId=${studentId}`);
            if (response.ok) {
                const data = await response.json();
                // Por enquanto, usamos os dados mockados
                const mockScores = [
                    {
                        id: 1,
                        rubricId: 1,
                        projectTitle: 'Horta Sustentável',
                        scores: [
                            { criteriaName: 'Planejamento', points: 23, feedback: 'Excelente planejamento' },
                            { criteriaName: 'Execução', points: 24, feedback: 'Executado com precisão' },
                            { criteriaName: 'Documentação', points: 22, feedback: 'Bem documentado' },
                            { criteriaName: 'Apresentação', points: 23, feedback: 'Apresentação clara' }
                        ],
                        totalPoints: 92,
                        percentage: 92,
                        status: 'graded',
                        evaluatedAt: new Date().toISOString(),
                        evaluatedBy: 'Prof. Ana Silva',
                        comments: 'Trabalho excepcional, parabéns!'
                    }
                ];

                setRubricScores(mockScores);
            }
        } catch (error) {
            console.error('Erro ao carregar avaliações:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'graded') {
            return <CheckCircle className="text-green-600" size={20} />;
        }
        return <Clock className="text-orange-600" size={20} />;
    };

    const getStatusBadge = (percentage) => {
        if (percentage >= 90) return 'Excelente';
        if (percentage >= 80) return 'Muito Bom';
        if (percentage >= 70) return 'Bom';
        if (percentage >= 60) return 'Satisfatório';
        return 'Precisa Melhorar';
    };

    const getStatusColor = (percentage) => {
        if (percentage >= 90) return 'bg-green-100 text-green-800 border-green-300';
        if (percentage >= 80) return 'bg-blue-100 text-blue-800 border-blue-300';
        if (percentage >= 70) return 'bg-cyan-100 text-cyan-800 border-cyan-300';
        if (percentage >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        return 'bg-red-100 text-red-800 border-red-300';
    };

    const filteredScores = rubricScores.filter(score => {
        if (filterStatus === 'graded') return score.status === 'graded';
        if (filterStatus === 'pending') return score.status !== 'graded';
        return true;
    });

    const statistics = {
        total: rubricScores.length,
        graded: rubricScores.filter(s => s.status === 'graded').length,
        average: rubricScores.length > 0
            ? Math.round(rubricScores.reduce((sum, s) => sum + s.percentage, 0) / rubricScores.length)
            : 0
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Carregando avaliações...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
                    <div className={`rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md ${
                        notification.type === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : notification.type === 'info'
                            ? 'bg-blue-50 border border-blue-200'
                            : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                        {notification.type === 'success' && (
                            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                        )}
                        {notification.type === 'info' && (
                            <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                        )}
                        {notification.type === 'warning' && (
                            <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                        )}
                        <div>
                            <p className={`font-semibold ${
                                notification.type === 'success'
                                    ? 'text-green-800'
                                    : notification.type === 'info'
                                    ? 'text-blue-800'
                                    : 'text-yellow-800'
                            }`}>
                                {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900">Minhas Avaliações</h1>
                <p className="text-gray-600 mt-2">
                    Visualize suas avaliações detalhadas com feedback dos professores
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total de Projetos</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.total}</p>
                        </div>
                        <Award className="text-purple-600" size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Avaliados</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.graded}</p>
                        </div>
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Média Geral</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{statistics.average}%</p>
                        </div>
                        <TrendingUp className="text-blue-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            {rubricScores.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-blue-900 text-sm">
                        <strong>💡 Dica:</strong> Clique em um projeto para ver o feedback detalhado de cada critério de avaliação.
                    </p>
                </div>
            )}

            {/* Filter Buttons */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === 'all'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Todos ({rubricScores.length})
                </button>
                <button
                    onClick={() => setFilterStatus('graded')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === 'graded'
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Avaliados ({statistics.graded})
                </button>
                <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        filterStatus === 'pending'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Aguardando ({rubricScores.length - statistics.graded})
                </button>
            </div>

            {/* Rubric Scores List */}
            {filteredScores.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg font-medium">
                        Nenhuma avaliação encontrada
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        As avaliações aparecerão aqui quando os professores avaliarem seus projetos
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredScores.map((score) => (
                        <div key={score.id} className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200">
                            {/* Card Header */}
                            <div
                                onClick={() => setExpandedScore(expandedScore === score.id ? null : score.id)}
                                className="p-6 cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusIcon(score.status)}
                                            <h3 className="text-xl font-bold text-gray-900">{score.projectTitle}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Avaliado por {score.evaluatedBy} em {new Date(score.evaluatedAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>

                                    <div className="text-right ml-4">
                                        <div className={`inline-block px-4 py-2 rounded-full border font-bold ${
                                            getStatusColor(score.percentage)
                                        }`}>
                                            {score.totalPoints}/{100} ({score.percentage}%)
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{getStatusBadge(score.percentage)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expandable Content */}
                            {expandedScore === score.id && (
                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                    {/* Criteria Breakdown */}
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Breakdown por Critério</h4>
                                        <div className="space-y-3">
                                            {score.scores.map((criteriaScore, idx) => (
                                                <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-medium text-gray-900">{criteriaScore.criteriaName}</h5>
                                                        <span className="font-bold text-purple-600">
                                                            {criteriaScore.points}/{criteriaScore.criteriaName === 'Planejamento' ? '25' : 
                                                             criteriaScore.criteriaName === 'Execução' ? '25' :
                                                             criteriaScore.criteriaName === 'Documentação' ? '25' : '25'}
                                                        </span>
                                                    </div>
                                                    {criteriaScore.feedback && (
                                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border-l-2 border-purple-600">
                                                            <strong>Feedback:</strong> {criteriaScore.feedback}
                                                        </p>
                                                    )}
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                                                            style={{
                                                                width: `${(criteriaScore.points / (criteriaScore.criteriaName === 'Planejamento' ? 25 : 
                                                                           criteriaScore.criteriaName === 'Execução' ? 25 :
                                                                           criteriaScore.criteriaName === 'Documentação' ? 25 : 25)) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Overall Feedback */}
                                    {score.comments && (
                                        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                            <h4 className="font-semibold text-blue-900 mb-2">Comentários do Professor</h4>
                                            <p className="text-blue-800 text-sm">{score.comments}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentRubricsView;
