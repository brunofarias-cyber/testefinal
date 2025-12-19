import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { useRealTimeGrades } from '../hooks/useRealTime';
import { 
  Star, TrendingUp, Award, AlertCircle, Download, Filter, CheckCircle,
  BarChart3, Zap, Target, LineChart, ChevronRight, Calendar, User,
  GraduationCap, Flame, Clock, Trophy, Bell
} from "lucide-react";

const MOCK_STUDENT_GRADES = [
    {
        id: 1,
        projectTitle: "Horta Sustentável",
        teacher: "Profª Ana Silva",
        finalGrade: 9.0,
        rubricBreakdown: [
            { criterion: "Investigação Científica", maxScore: 2, earned: 1.9, weight: 40, percentage: 95 },
            { criterion: "Trabalho em Equipe", maxScore: 2, earned: 1.8, weight: 30, percentage: 90 },
            { criterion: "Comunicação Oral", maxScore: 2, earned: 1.8, weight: 30, percentage: 90 }
        ],
        submissionDate: "2023-11-15",
        status: "Entregue",
        feedback: "Excelente trabalho! Sua documentação foi muito clara e os resultados bem apresentados. Parabéns pela organização!"
    },
    {
        id: 2,
        projectTitle: "Robótica com Sucata",
        teacher: "Prof. Roberto Lima",
        finalGrade: 8.5,
        rubricBreakdown: [
            { criterion: "Investigação Científica", maxScore: 2, earned: 1.8, weight: 40, percentage: 90 },
            { criterion: "Trabalho em Equipe", maxScore: 2, earned: 1.7, weight: 30, percentage: 85 },
            { criterion: "Comunicação Oral", maxScore: 2, earned: 1.7, weight: 30, percentage: 85 }
        ],
        submissionDate: "2023-10-20",
        status: "Entregue",
        feedback: "Muito bom! O protótipo funcionou bem. Apenas trabalhe mais na clareza das explicações técnicas."
    },
    {
        id: 3,
        projectTitle: "Jornal Digital",
        teacher: "Prof. Carlos Souza",
        finalGrade: null,
        rubricBreakdown: [],
        submissionDate: null,
        status: "Em Progresso",
        feedback: null
    }
];

const StudentGrades = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [grades, setGrades] = useState(MOCK_STUDENT_GRADES);
    const [notification, setNotification] = useState(null);
    const [socket, setSocket] = useState(null);

    // Usar hook de grades em tempo real
    const { grades: realtimeGrades } = useRealTimeGrades(101); // ID do aluno

    // Conectar ao Socket.io para receber notificações em tempo real
    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
        
        newSocket.on('connect', () => {
            console.log('✅ Conectado ao servidor');
            // Informar servidor que é um aluno
            const studentId = 101; // Usar ID do aluno autenticado
            newSocket.emit('join-student', studentId);
        });

        // Escutar notificações de notas atualizadas
        newSocket.on('grade-updated', (data) => {
            console.log('🔔 Nota atualizada:', data);
            
            // Atualizar grades locais
            setGrades(prevGrades =>
                prevGrades.map(g =>
                    g.projectTitle === data.projectTitle
                        ? {
                            ...g,
                            finalGrade: data.grade,
                            feedback: data.feedback,
                            status: 'Entregue'
                          }
                        : g
                )
            );

            // Mostrar notificação
            setNotification({
                type: 'success',
                message: `Prof. ${data.teacher} atualizou sua nota em "${data.projectTitle}"!`,
                grade: data.grade
            });

            setTimeout(() => setNotification(null), 5000);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Combinar grades reais do hook com dados locais
    useEffect(() => {
        if (realtimeGrades && realtimeGrades.length > 0) {
            setGrades(prevGrades => {
                // Merge grades do hook com locais, evitando duplicatas
                const gradeMap = new Map(prevGrades.map(g => [g.id, g]));
                realtimeGrades.forEach(rg => {
                    if (!gradeMap.has(rg.id)) {
                        gradeMap.set(rg.id, rg);
                    }
                });
                return Array.from(gradeMap.values());
            });
        }
    }, [realtimeGrades]);

    const filteredGrades = grades.filter(g => {
        if (filterStatus === "all") return true;
        if (filterStatus === "graded" && g.finalGrade) return true;
        if (filterStatus === "pending" && !g.finalGrade) return true;
        return false;
    });

    const calculateOverallAverage = () => {
        const graded = grades.filter(g => g.finalGrade);
        if (graded.length === 0) return 0;
        return (graded.reduce((sum, g) => sum + g.finalGrade, 0) / graded.length).toFixed(1);
    };

    if (selectedProject) {
        const project = grades.find(g => g.id === selectedProject);

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Header com Voltar */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                    <div className="max-w-5xl mx-auto px-6 py-4">
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition"
                        >
                            ← Voltar para Notas
                        </button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-6 py-8">
                    {/* Card Principal com Grade */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 rounded-3xl p-8 text-white mb-8 shadow-2xl overflow-hidden relative">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-bold mb-2">{project.projectTitle}</h1>
                                    <div className="flex items-center gap-2 text-indigo-100">
                                        <User size={16} />
                                        <p className="text-lg">Prof. {project.teacher}</p>
                                    </div>
                                </div>
                                {project.finalGrade ? (
                                    <div className="bg-white/15 backdrop-blur-lg px-8 py-6 rounded-3xl border border-white/20 text-center">
                                        <p className="text-xs font-bold opacity-90 mb-2 tracking-wider">NOTA FINAL</p>
                                        <p className="text-6xl font-extrabold mb-1">{project.finalGrade}</p>
                                        <p className="text-sm opacity-80">de 10.0</p>
                                        <div className="mt-3 flex justify-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={i < Math.round(project.finalGrade / 2) ? "fill-yellow-300 text-yellow-300" : "text-white/30"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white/15 backdrop-blur-lg px-8 py-6 rounded-3xl border border-white/20">
                                        <p className="text-xs font-bold opacity-90 mb-2">STATUS</p>
                                        <p className="text-lg font-bold">⏳ Em Progresso</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {project.status === "Entregue" && project.rubricBreakdown.length > 0 ? (
                        <>
                            {/* Grid de Análise */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Card: Desempenho Geral */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-800">Desempenho</h3>
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <BarChart3 size={20} className="text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-slate-600">Aproveitamento</span>
                                                <span className="text-sm font-bold text-slate-800">{(project.finalGrade / 10 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                                    style={{ width: `${project.finalGrade / 10 * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card: Avaliação */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-800">Avaliação</h3>
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Award size={20} className="text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Status</p>
                                            <p className="text-sm font-bold text-green-600 flex items-center gap-2">
                                                <CheckCircle size={16} /> Avaliado
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1">Entregue em</p>
                                            <p className="text-sm font-bold text-slate-800">
                                                {new Date(project.submissionDate).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card: Classificação */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-800">Classificação</h3>
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <Trophy size={20} className="text-yellow-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold">
                                            {project.finalGrade >= 9 ? '🏆 Excelente' :
                                             project.finalGrade >= 8 ? '⭐ Muito Bom' :
                                             project.finalGrade >= 7 ? '👍 Bom' :
                                             project.finalGrade >= 6 ? '📊 Satisfatório' : '⚠️ Insuficiente'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Análise Detalhada */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <BarChart3 size={24} className="text-indigo-600" />
                                    </div>
                                    Análise Detalhada por Critério
                                </h2>

                                <div className="space-y-8">
                                    {project.rubricBreakdown.map((item, idx) => {
                                        const performanceLevel = item.percentage >= 90 ? 'Excelente' :
                                                               item.percentage >= 80 ? 'Muito Bom' :
                                                               item.percentage >= 70 ? 'Bom' : 'Precisa Melhorar';
                                        const performanceColor = item.percentage >= 90 ? 'from-green-500 to-green-600' :
                                                               item.percentage >= 80 ? 'from-blue-500 to-blue-600' :
                                                               item.percentage >= 70 ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600';
                                        
                                        return (
                                            <div key={idx} className="pb-8 border-b border-slate-100 last:border-b-0 last:pb-0">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-slate-800 mb-1">{item.criterion}</h3>
                                                        <p className="text-sm text-slate-500">Peso na avaliação: <span className="font-bold text-slate-700">{item.weight}%</span></p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-3xl font-bold text-indigo-600">{item.earned.toFixed(1)}</p>
                                                        <p className="text-xs text-slate-500">de {item.maxScore} pontos</p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mb-4">
                                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-r ${performanceColor} transition-all duration-500`}
                                                            style={{ width: `${item.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-slate-600">{item.percentage}% atingido</span>
                                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                                            item.percentage >= 90 ? 'bg-green-100 text-green-700' :
                                                            item.percentage >= 80 ? 'bg-blue-100 text-blue-700' :
                                                            item.percentage >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {performanceLevel}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Análise de Pontos */}
                                                <div className="bg-slate-50 rounded-lg p-4">
                                                    <p className="text-xs text-slate-600 mb-2"><strong>Contribuição para nota final:</strong></p>
                                                    <p className="text-sm text-slate-800 font-bold">
                                                        {item.earned.toFixed(1)} × {item.weight}% = {(item.earned * item.weight / 100).toFixed(2)} pontos
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Cálculo da Nota Final */}
                                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                                    <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                                        <Target size={20} /> Como sua nota foi calculada
                                    </h3>
                                    <div className="space-y-2 font-mono text-sm text-indigo-800">
                                        <p>Nota Final = Σ(Pontos × Peso)</p>
                                        <p className="text-slate-600">
                                            {project.rubricBreakdown.map((rb, i) => 
                                                `${rb.earned.toFixed(1)} × ${rb.weight}%${i < project.rubricBreakdown.length - 1 ? ' + ' : ''}`
                                            ).join('')}
                                        </p>
                                        <p className="pt-2 border-t border-indigo-300 font-bold text-lg text-indigo-900">
                                            = {project.finalGrade} / 10
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback do Professor */}
                            {project.feedback && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-8 shadow-sm">
                                    <h2 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-3">
                                        <div className="p-2 bg-green-200 rounded-lg">
                                            <CheckCircle size={20} className="text-green-700" />
                                        </div>
                                        Feedback do Professor
                                    </h2>
                                    <p className="text-green-900 leading-relaxed text-base">{project.feedback}</p>
                                </div>
                            )}

                            {/* Recomendações */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg">
                                        <Zap size={20} className="text-amber-600" />
                                    </div>
                                    Dicas para Melhorar
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.rubricBreakdown.map((item, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                                            item.percentage < 90 ? 'border-amber-400 bg-amber-50' : 'border-green-400 bg-green-50'
                                        }`}>
                                            <p className={`text-sm font-bold mb-1 ${
                                                item.percentage < 90 ? 'text-amber-900' : 'text-green-900'
                                            }`}>
                                                {item.criterion}
                                            </p>
                                            <p className={`text-xs ${
                                                item.percentage < 90 ? 'text-amber-800' : 'text-green-800'
                                            }`}>
                                                {item.percentage < 90 
                                                    ? `Você atingiu ${item.percentage}%. Trabalhe nesta área para melhorar seus resultados nos próximos projetos.`
                                                    : `Excelente trabalho! Continue assim! 🎉`
                                                }
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-amber-100 rounded-full">
                                    <Clock size={32} className="text-amber-600" />
                                </div>
                            </div>
                            <p className="text-slate-800 font-bold text-lg mb-2">Projeto ainda não foi avaliado</p>
                            <p className="text-sm text-slate-500 mb-6">
                                O professor ainda está analisando seu trabalho. Continue acompanhando!
                            </p>
                            <div className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold">
                                ⏳ Aguardando Avaliação
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                    <GraduationCap size={28} className="text-white" />
                                </div>
                                Minhas Notas e Avaliações
                            </h2>
                            <p className="text-slate-500 text-base">Acompanhe todas as suas avaliações e feedback dos professores</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
                                📋 Início
                            </button>
                            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                                <Download size={18} /> Exportar Relatório
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔔 Notificação de Nota Atualizada */}
            {notification && (
                <div className="fixed top-6 right-6 max-w-md z-50 animate-bounce">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-4 flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Bell size={24} className="text-white animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold mb-1">Nota Atualizada! 🎉</h3>
                            <p className="text-sm text-emerald-50">{notification.message}</p>
                            {notification.grade && (
                                <p className="text-2xl font-extrabold mt-2 text-white">{notification.grade}/10</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Resumo Geral - Cards Estatísticos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Média Geral */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Média Geral</p>
                            <div className="p-2.5 bg-indigo-100 rounded-lg">
                                <TrendingUp size={20} className="text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-indigo-600 mb-2">{calculateOverallAverage()}</p>
                        <p className="text-xs text-slate-500">Em {MOCK_STUDENT_GRADES.filter(g => g.finalGrade).length} de {MOCK_STUDENT_GRADES.length} projetos</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={i < Math.round(calculateOverallAverage() / 2) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Avaliados */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avaliados</p>
                            <div className="p-2.5 bg-green-100 rounded-lg">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-green-600 mb-2">{MOCK_STUDENT_GRADES.filter(g => g.finalGrade).length}</p>
                        <p className="text-xs text-slate-500">de {MOCK_STUDENT_GRADES.length} projetos concluídos</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                                    style={{ width: `${(MOCK_STUDENT_GRADES.filter(g => g.finalGrade).length / MOCK_STUDENT_GRADES.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Melhor Nota */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Melhor Nota</p>
                            <div className="p-2.5 bg-yellow-100 rounded-lg">
                                <Trophy size={20} className="text-yellow-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-yellow-600 mb-2">
                            {Math.max(...MOCK_STUDENT_GRADES.filter(g => g.finalGrade).map(g => g.finalGrade))}
                        </p>
                        <p className="text-xs text-slate-500">neste semestre</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">🏆 Excelente</span>
                        </div>
                    </div>

                    {/* Em Progresso */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Em Progresso</p>
                            <div className="p-2.5 bg-blue-100 rounded-lg">
                                <Clock size={20} className="text-blue-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-blue-600 mb-2">{MOCK_STUDENT_GRADES.filter(g => !g.finalGrade).length}</p>
                        <p className="text-xs text-slate-500">aguardando avaliação</p>
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">⏳ Pendente</span>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 rounded-2xl p-6 mb-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                            <AlertCircle size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-indigo-900 mb-1">📋 Avaliação Transparente</p>
                            <p className="text-sm text-indigo-800">
                                Suas notas são calculadas automaticamente com base nas <strong>rubricas de avaliação</strong> criadas pelos professores. 
                                Clique em qualquer projeto para ver o detalhamento completo de como sua nota foi calculada.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Filter size={18} className="text-slate-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Filtrar Notas:</span>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { id: "all", label: "Todos os Projetos", icon: "📋" },
                            { id: "graded", label: "Avaliados", icon: "✅" },
                            { id: "pending", label: "Em Progresso", icon: "⏳" }
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setFilterStatus(filter.id)}
                                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${filterStatus === filter.id
                                        ? "bg-indigo-600 text-white shadow-md"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                            >
                                {filter.icon} {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de Notas - Cards */}
                <div className="space-y-4">
                    {filteredGrades.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                            <p className="text-slate-600 font-bold mb-1">Nenhum projeto encontrado</p>
                            <p className="text-sm text-slate-500">Tente ajustar seus filtros</p>
                        </div>
                    ) : (
                        filteredGrades.map((grade) => (
                            <div
                                key={grade.id}
                                onClick={() => setSelectedProject(grade.id)}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer transform hover:scale-[1.02]"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-800 mb-1">{grade.projectTitle}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <User size={14} />
                                            <p>Prof. {grade.teacher}</p>
                                        </div>
                                    </div>

                                    {grade.finalGrade ? (
                                        <div className="text-right">
                                            <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-300">
                                                <div className="text-center">
                                                    <p className="text-3xl font-extrabold text-indigo-600">{grade.finalGrade}</p>
                                                    <p className="text-xs text-indigo-500 font-bold">/10</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-center gap-1 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < Math.round(grade.finalGrade / 2) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-right">
                                            <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-sm font-bold flex items-center gap-2">
                                                <Clock size={16} />
                                                Pendente
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {grade.finalGrade && grade.rubricBreakdown.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-600 mb-3">CRITÉRIOS AVALIADOS:</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {grade.rubricBreakdown.map((rb, idx) => (
                                                <div key={idx} className="bg-slate-50 rounded-lg p-3 text-center border border-slate-200">
                                                    <p className="text-xs text-slate-600 font-semibold mb-1">{rb.criterion}</p>
                                                    <p className="text-lg font-bold text-indigo-600">{rb.percentage}%</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                                            <span className="text-indigo-600 font-semibold text-sm flex items-center gap-1">
                                                Ver Detalhes <ChevronRight size={16} />
                                            </span>
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

export default StudentGrades;
