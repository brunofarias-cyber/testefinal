import React, { useState, useEffect } from "react";
import {
    BarChart2,
    TrendingUp,
    Award,
    Zap,
    Clock,
    Target,
    CheckCircle,
    BookOpen,
    Users
} from "lucide-react";

const StudentOverview = ({ currentUserId = 101, onNavigateTo }) => {
    const [studentData, setStudentData] = useState({
        name: "João Silva",
        class: "9º Ano A",
        school: "E.E. Prof. Carlos Souza",
        level: 5,
        xp: 1250,
        xpProgress: 62,
        avgGrade: 8.58,
        activeProjects: 3,
        completedProjects: 6,
        nextDeadline: "15/12/2025",
        engagementRate: 92
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Cabeçalho Principal */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl mb-8">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-4xl font-extrabold mb-1">Bem-vindo, {studentData.name}! 👋</h1>
                            <p className="text-indigo-100">{studentData.class} • {studentData.school}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold opacity-80 mb-2">SEU NÍVEL</p>
                            <div className="flex items-end gap-3 justify-end">
                                <div>
                                    <p className="text-4xl font-extrabold">{studentData.level}</p>
                                    <p className="text-xs opacity-80">Nível</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-extrabold text-yellow-300">{studentData.xp}</p>
                                    <p className="text-xs opacity-80">XP</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 bg-black/20 h-3 rounded-full overflow-hidden">
                        <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${studentData.xpProgress}%` }}></div>
                    </div>
                    <p className="text-xs opacity-75 mt-2">{studentData.xpProgress}% até o próximo nível</p>
                </div>

                {/* Grid de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* Card Média */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-semibold">Média Geral</p>
                                <p className="text-3xl font-extrabold text-indigo-600 mt-2">{studentData.avgGrade}</p>
                                <p className="text-xs text-slate-500 mt-1">de 10.0</p>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-xl">
                                <BarChart2 size={24} className="text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Card Projetos Ativos */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-semibold">Projetos Ativos</p>
                                <p className="text-3xl font-extrabold text-green-600 mt-2">{studentData.activeProjects}</p>
                                <p className="text-xs text-slate-500 mt-1">em progresso</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <BookOpen size={24} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Card Projetos Completos */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-semibold">Projetos Completos</p>
                                <p className="text-3xl font-extrabold text-blue-600 mt-2">{studentData.completedProjects}</p>
                                <p className="text-xs text-slate-500 mt-1">finalizados</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <CheckCircle size={24} className="text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Card Engajamento */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-semibold">Engajamento</p>
                                <p className="text-3xl font-extrabold text-purple-600 mt-2">{studentData.engagementRate}%</p>
                                <p className="text-xs text-slate-500 mt-1">participação</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Zap size={24} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Próximas Ações */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Próximo Prazo */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-orange-500" />
                            Próximo Prazo
                        </h3>
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                            <p className="font-bold text-slate-800">Entrega - Projeto Sustentável</p>
                            <p className="text-sm text-slate-600 mt-1">{studentData.nextDeadline}</p>
                            <div className="mt-3 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full rounded-full" style={{ width: "35%" }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">5 dias restantes</p>
                        </div>
                    </div>

                    {/* Atalhos Rápidos */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Atalhos Rápidos</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => onNavigateTo && onNavigateTo('projects')}
                                className="w-full text-left px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition font-semibold text-indigo-700"
                            >
                                📚 Ver Todos os Projetos
                            </button>
                            <button
                                onClick={() => onNavigateTo && onNavigateTo('grades')}
                                className="w-full text-left px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition font-semibold text-blue-700"
                            >
                                📊 Minhas Notas
                            </button>
                            <button
                                onClick={() => onNavigateTo && onNavigateTo('new-missions')}
                                className="w-full text-left px-4 py-3 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition font-semibold text-purple-700"
                            >
                                🎮 Missões & Conquistas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentOverview;
