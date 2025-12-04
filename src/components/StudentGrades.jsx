import React, { useState } from "react";
import { Star, TrendingUp, Award, AlertCircle, Download, Filter, CheckCircle } from "lucide-react";

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

    const filteredGrades = MOCK_STUDENT_GRADES.filter(g => {
        if (filterStatus === "all") return true;
        if (filterStatus === "graded" && g.finalGrade) return true;
        if (filterStatus === "pending" && !g.finalGrade) return true;
        return false;
    });

    const calculateOverallAverage = () => {
        const graded = MOCK_STUDENT_GRADES.filter(g => g.finalGrade);
        if (graded.length === 0) return 0;
        return (graded.reduce((sum, g) => sum + g.finalGrade, 0) / graded.length).toFixed(1);
    };

    if (selectedProject) {
        const project = MOCK_STUDENT_GRADES.find(g => g.id === selectedProject);

        return (
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => setSelectedProject(null)}
                    className="mb-6 text-slate-500 hover:text-indigo-600 font-semibold"
                >
                    ← Voltar
                </button>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{project.projectTitle}</h1>
                            <p className="text-indigo-100">Prof. {project.teacher}</p>
                        </div>
                        {project.finalGrade ? (
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                                <p className="text-xs font-bold opacity-70 mb-1">NOTA FINAL</p>
                                <p className="text-5xl font-extrabold">{project.finalGrade}</p>
                                <p className="text-xs opacity-70 mt-1">/ 10.0</p>
                            </div>
                        ) : (
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                                <p className="text-xs font-bold opacity-70 mb-1">STATUS</p>
                                <p className="text-lg font-bold">Em Progresso</p>
                            </div>
                        )}
                    </div>
                </div>

                {project.status === "Entregue" && project.rubricBreakdown.length > 0 ? (
                    <>
                        {/* Breakdown por Critério */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">📊 Análise Detalhada</h2>

                            <div className="space-y-6">
                                {project.rubricBreakdown.map((item, idx) => (
                                    <div key={idx} className="border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <h3 className="font-bold text-slate-800">{item.criterion}</h3>
                                                <p className="text-sm text-slate-500">Peso: {item.weight}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-indigo-600">{item.earned.toFixed(1)}/{item.maxScore}</p>
                                                <p className="text-sm text-slate-500">{item.percentage}%</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${item.percentage >= 90 ? "bg-green-500" :
                                                        item.percentage >= 80 ? "bg-blue-500" :
                                                            item.percentage >= 70 ? "bg-yellow-500" : "bg-red-500"
                                                    }`}
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cálculo Final */}
                            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                                <p className="text-sm text-indigo-900 mb-2">
                                    <strong>Cálculo:</strong> (1.9×0.40 + 1.8×0.30 + 1.8×0.30) × 2.5 = {project.finalGrade}
                                </p>
                                <p className="text-xs text-indigo-700">
                                    Cada ponto é multiplicado por 2.5 para chegar à escala de 0-10
                                </p>
                            </div>
                        </div>

                        {/* Feedback do Professor */}
                        <div className="bg-green-50 border-l-4 border-green-500 rounded-2xl p-6 mb-6">
                            <h2 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                                <CheckCircle size={20} /> Feedback do Professor
                            </h2>
                            <p className="text-green-900">{project.feedback}</p>
                        </div>

                        {/* Detalhes Técnicos */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">📋 Detalhes</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Entregue em</p>
                                    <p className="font-bold text-slate-800">{new Date(project.submissionDate).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                                    <p className="font-bold text-green-600">{project.status}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center">
                        <AlertCircle size={40} className="text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 font-bold mb-1">Projeto ainda não foi avaliado</p>
                        <p className="text-sm text-slate-500">Continue acompanhando o progresso</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">📊 Minhas Notas</h2>
                    <p className="text-slate-500">Acompanhe suas avaliações por projeto</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 flex items-center gap-2">
                    <Download size={16} /> Exportar
                </button>
            </div>

            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase">Média Geral</p>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">{calculateOverallAverage()}</p>
                    <p className="text-xs text-slate-500 mt-1">Em {MOCK_STUDENT_GRADES.filter(g => g.finalGrade).length} projetos</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase">Avaliados</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">{MOCK_STUDENT_GRADES.filter(g => g.finalGrade).length}</p>
                    <p className="text-xs text-slate-500 mt-1">de {MOCK_STUDENT_GRADES.length} projetos</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <p className="text-xs font-bold text-slate-400 uppercase">Melhor Nota</p>
                    <p className="text-4xl font-bold text-yellow-600 mt-2">
                        {Math.max(...MOCK_STUDENT_GRADES.filter(g => g.finalGrade).map(g => g.finalGrade))}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">neste semestre</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={18} className="text-slate-600" />
                    <span className="text-sm font-bold text-slate-700">Filtrar:</span>
                </div>
                <div className="flex gap-2">
                    {[
                        { id: "all", label: "Todos" },
                        { id: "graded", label: "Avaliados" },
                        { id: "pending", label: "Em Progresso" }
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setFilterStatus(filter.id)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${filterStatus === filter.id
                                    ? "bg-indigo-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cards de Notas */}
            <div className="space-y-4">
                {filteredGrades.map((grade) => (
                    <div
                        key={grade.id}
                        onClick={() => setSelectedProject(grade.id)}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg hover:border-indigo-200 transition cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-800 mb-1">{grade.projectTitle}</h3>
                                <p className="text-sm text-slate-500">Prof. {grade.teacher}</p>
                            </div>

                            {grade.finalGrade ? (
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-indigo-600">{grade.finalGrade}</div>
                                    <div className="flex items-center gap-1 mt-1 justify-end">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < Math.round(grade.finalGrade / 2) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                        ⏳ Pendente
                                    </span>
                                </div>
                            )}
                        </div>

                        {grade.finalGrade && grade.rubricBreakdown.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        {grade.rubricBreakdown.map((rb, idx) => (
                                            <div key={idx} className="text-xs">
                                                <p className="text-slate-500 font-bold">{rb.criterion.split(' ')[0]}</p>
                                                <p className="text-slate-700 font-bold">{rb.percentage}%</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-indigo-600 hover:text-indigo-700">
                                        Ver Detalhes →
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentGrades;
