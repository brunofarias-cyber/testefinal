import React, { useState } from 'react';
import { BarChart2, Target, TrendingUp, Calendar, Zap, Award } from 'lucide-react';
import { MOCK_STUDENT_PROGRESS } from '../mockDataExtended';

const StudentProgressComponent = () => {
    const [progress] = useState(MOCK_STUDENT_PROGRESS);
    const [timeframe, setTimeframe] = useState('month');

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Meu Progresso 📊</h2>
                    <p className="text-slate-500">Acompanhe sua evolução acadêmica</p>
                </div>
                <div className="flex gap-2">
                    {['week', 'month', 'year'].map(tf => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                                timeframe === tf
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {tf === 'week' ? 'Semana' : tf === 'month' ? 'Mês' : 'Ano'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Estatísticas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <TrendingUp size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Média</p>
                            <p className="text-2xl font-bold text-slate-800">{progress.stats.average}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <TrendingUp size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Evolução</p>
                            <p className="text-2xl font-bold text-slate-800">+{progress.stats.evolution}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Award size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Badges</p>
                            <p className="text-2xl font-bold text-slate-800">{progress.stats.badges}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <Zap size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">XP/Semana</p>
                            <p className="text-2xl font-bold text-slate-800">{progress.stats.weeklyXP}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Objetivos */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <Target size={20} className="text-indigo-600" />
                    Objetivos do Período
                </h3>
                <div className="space-y-4">
                    {progress.objectives.map(obj => (
                        <div key={obj.id}>
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-slate-700">{obj.title}</span>
                                <span className="text-sm font-bold text-indigo-600">{obj.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all"
                                    style={{ width: `${obj.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Projetos em Andamento */}
            <div>
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart2 size={20} className="text-indigo-600" />
                    Projetos e Grades
                </h3>
                <div className="space-y-3">
                    {progress.projects.map(proj => (
                        <div key={proj.id} className="bg-white rounded-xl border border-slate-100 p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-slate-800">{proj.title}</h4>
                                <span className="text-lg font-bold text-indigo-600">{proj.grade}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-indigo-500 h-full rounded-full"
                                    style={{ width: `${proj.progress}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-2 text-right">{proj.progress}% Concluído</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProgressComponent;
