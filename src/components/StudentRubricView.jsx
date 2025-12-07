import React, { useState, useEffect } from 'react';
import { Target, Award, CheckCircle, AlertCircle, TrendingUp, Star, ChevronLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '';
const api = (path) => (API_BASE ? `${API_BASE}${path}` : path);

const StudentRubricView = ({ projectId, currentUserId = 101 }) => {
    const [rubric, setRubric] = useState(null);
    const [myGrades, setMyGrades] = useState({});
    const [loading, setLoading] = useState(true);
    const [showBack, setShowBack] = useState(false);

    useEffect(() => {
        loadRubric();
        loadMyGrades();
    }, [projectId]);

    const loadRubric = async () => {
        setLoading(true);
        try {
            // Simulando API - substituir por endpoint real
            const mockRubric = {
                projectId,
                projectName: "Horta Sustentável",
                criteria: [
                    {
                        id: 1,
                        name: "Investigação Científica",
                        weight: 40,
                        description: "Capacidade de pesquisar, coletar e analisar dados",
                        levels: [
                            { score: 1, label: "Insuficiente", description: "Não apresentou dados relevantes" },
                            { score: 2, label: "Básico", description: "Dados superficiais sem análise" },
                            { score: 3, label: "Proficiente", description: "Dados relevantes com boa análise" },
                            { score: 4, label: "Avançado", description: "Análise profunda com fontes diversas" }
                        ]
                    },
                    {
                        id: 2,
                        name: "Trabalho em Equipe",
                        weight: 30,
                        description: "Colaboração, comunicação e resolução de conflitos",
                        levels: [
                            { score: 1, label: "Insuficiente", description: "Conflitos constantes, pouca colaboração" },
                            { score: 2, label: "Básico", description: "Colaboração mínima, comunicação irregular" },
                            { score: 3, label: "Proficiente", description: "Boa divisão de tarefas e comunicação" },
                            { score: 4, label: "Avançado", description: "Sinergia, apoio mútuo e liderança positiva" }
                        ]
                    },
                    {
                        id: 3,
                        name: "Comunicação Oral",
                        weight: 30,
                        description: "Clareza, organização e engajamento na apresentação",
                        levels: [
                            { score: 1, label: "Insuficiente", description: "Apenas leitura de slides" },
                            { score: 2, label: "Básico", description: "Fala pouco clara, sem contato visual" },
                            { score: 3, label: "Proficiente", description: "Boa oratória e organização" },
                            { score: 4, label: "Avançado", description: "Apresentação engajadora e profissional" }
                        ]
                    }
                ]
            };

            setRubric(mockRubric);
        } catch (error) {
            console.error('❌ Erro ao carregar rubrica:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMyGrades = async () => {
        try {
            // Simulando notas do aluno
            const mockGrades = {
                1: 3, // Investigação Científica: Proficiente
                2: 4, // Trabalho em Equipe: Avançado
                3: 3  // Comunicação Oral: Proficiente
            };
            setMyGrades(mockGrades);
        } catch (error) {
            console.error('❌ Erro ao carregar notas:', error);
        }
    };

    const calculateTotalScore = () => {
        if (!rubric || Object.keys(myGrades).length === 0) return null;

        let totalWeightedScore = 0;
        let totalWeight = 0;

        rubric.criteria.forEach(criterion => {
            const myScore = myGrades[criterion.id];
            if (myScore) {
                totalWeightedScore += myScore * criterion.weight;
                totalWeight += criterion.weight * 4; // 4 é o score máximo
            }
        });

        return totalWeight > 0 ? ((totalWeightedScore / totalWeight) * 10).toFixed(1) : null;
    };

    const getLevelColor = (score) => {
        const colors = {
            1: 'bg-red-100 text-red-700 border-red-300',
            2: 'bg-orange-100 text-orange-700 border-orange-300',
            3: 'bg-blue-100 text-blue-700 border-blue-300',
            4: 'bg-green-100 text-green-700 border-green-300'
        };
        return colors[score] || 'bg-slate-100 text-slate-700 border-slate-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!rubric) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl">
                <AlertCircle size={48} className="text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Nenhuma rubrica disponível para este projeto</p>
            </div>
        );
    }

    const totalScore = calculateTotalScore();

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-2">Critérios de Avaliação</h2>
                        <p className="text-indigo-100">Projeto: {rubric.projectName}</p>
                    </div>
                    {totalScore && (
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
                            <p className="text-xs font-bold uppercase opacity-80 mb-1">Nota Final</p>
                            <p className="text-5xl font-extrabold">{totalScore}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Explicação */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-blue-900 mb-1">Como funciona a avaliação?</h3>
                        <p className="text-sm text-blue-700">
                            Cada critério tem 4 níveis de desempenho. Seu professor avaliará seu trabalho 
                            e indicará em qual nível você se encontra. A nota final é calculada com base 
                            nos pesos de cada critério.
                        </p>
                    </div>
                </div>
            </div>

            {/* Critérios */}
            <div className="space-y-6">
                {rubric.criteria.map((criterion, idx) => (
                    <div key={criterion.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-6 border-b border-slate-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">{criterion.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 ml-11">{criterion.description}</p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Peso</p>
                                    <p className="text-2xl font-bold text-indigo-600">{criterion.weight}%</p>
                                </div>
                            </div>

                            {/* Minha Nota */}
                            {myGrades[criterion.id] && (
                                <div className="mt-4 bg-white rounded-lg p-4 border-2 border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle size={24} className="text-green-600" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase">Sua Avaliação</p>
                                                <p className="text-lg font-bold text-slate-800">
                                                    {criterion.levels.find(l => l.score === myGrades[criterion.id])?.label}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {[...Array(myGrades[criterion.id])].map((_, i) => (
                                                <Star key={i} size={20} className="text-yellow-500 fill-yellow-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Níveis */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {criterion.levels.map((level) => (
                                    <div
                                        key={level.score}
                                        className={`p-4 rounded-xl border-2 transition-all ${
                                            myGrades[criterion.id] === level.score
                                                ? 'ring-4 ring-green-200 shadow-lg scale-105'
                                                : 'opacity-60 hover:opacity-100'
                                        } ${getLevelColor(level.score)}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold uppercase">{level.label}</span>
                                            <span className="text-lg font-bold">{level.score}</span>
                                        </div>
                                        <p className="text-xs leading-relaxed">{level.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dicas */}
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-start gap-3">
                    <TrendingUp size={24} className="text-purple-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-purple-900 mb-2">💡 Dicas para melhorar</h3>
                        <ul className="space-y-1 text-sm text-purple-700">
                            <li>• Peça feedback detalhado ao professor sobre cada critério</li>
                            <li>• Revise os níveis antes de começar o projeto para saber o que é esperado</li>
                            <li>• Documente seu processo de trabalho para facilitar a apresentação</li>
                            <li>• Trabalhe em equipe de forma organizada e comunique-se bem</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRubricView;
