import React, { useState } from "react";
import { BarChart2, TrendingUp, Award, Zap, Target } from "lucide-react";

const StudentProgress = () => {
    const [timeframe, setTimeframe] = useState('month');

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Meu Progresso</h2>
                    <p className="text-slate-500">Acompanhe sua evolução ao longo do tempo.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTimeframe('week')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                            timeframe === 'week'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        Semana
                    </button>
                    <button
                        onClick={() => setTimeframe('month')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                            timeframe === 'month'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        Mês
                    </button>
                    <button
                        onClick={() => setTimeframe('year')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                            timeframe === 'year'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        Ano
                    </button>
                </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <BarChart2 size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Média</p>
                            <p className="text-2xl font-bold text-slate-800">8.5</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Desempenho no período</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <TrendingUp size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Evolução</p>
                            <p className="text-2xl font-bold text-green-600">+1.2</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Comparado ao período anterior</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Award size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Badges</p>
                            <p className="text-2xl font-bold text-slate-800">12</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Conquistadas até agora</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Zap size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">XP/Semana</p>
                            <p className="text-2xl font-bold text-slate-800">450</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">Ganhos nesta semana</p>
                </div>
            </div>

            {/* Gráfico de Evolução */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <BarChart2 size={20} className="text-indigo-600" />
                    Evolução das Notas
                </h3>
                <div className="space-y-4">
                    {[
                        { project: 'Horta Sustentável', grade: 9.5 },
                        { project: 'Robótica', grade: 9.0 },
                        { project: 'Teatro', grade: 8.5 },
                        { project: 'Jornal Digital', grade: 8.0 }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-32 text-sm font-medium text-slate-600 flex-shrink-0">
                                {item.project}
                            </div>
                            <div className="flex-1">
                                <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full rounded-lg flex items-center justify-end px-3 bg-gradient-to-r from-indigo-500 to-purple-500"
                                        style={{ width: `${item.grade * 10}%` }}
                                    >
                                        <span className="text-white font-bold text-sm">{item.grade}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Próximos Objetivos */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <Target size={20} className="text-indigo-600" />
                    Próximos Objetivos
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-300 transition cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-bold text-slate-800">Alcançar Média 9.0</h4>
                                <p className="text-sm text-slate-500 mt-1">Melhorar performance geral</p>
                            </div>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold">
                                +200 XP
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">8.5/9.0</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-300 transition cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h4 className="font-bold text-slate-800">Completar 10 Projetos</h4>
                                <p className="text-sm text-slate-500 mt-1">Expandir portfólio</p>
                            </div>
                            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-xs font-bold">
                                +500 XP
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-600 h-full rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">4/10</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;
