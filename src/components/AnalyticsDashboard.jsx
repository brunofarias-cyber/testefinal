import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    AlertCircle,
    Zap,
    FileText,
    Eye,
} from 'lucide-react';

export const AnalyticsDashboard = ({ projectId }) => {
    const [heatmap, setHeatmap] = useState([]);
    const [report, setReport] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('heatmap');

    useEffect(() => {
        fetchAnalytics();
    }, [projectId]);

    const fetchAnalytics = async () => {
        try {
            const [heatmapRes, reportRes] = await Promise.all([
                fetch(`/api/ai/heatmap/${projectId}`),
                fetch(`/api/ai/report`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectId, classId: 1 }),
                }),
            ]);

            const heatmapData = await heatmapRes.json();
            const reportData = await reportRes.json();

            setHeatmap(heatmapData.data || []);
            setReport(reportData.report);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-600">Carregando analytics...</div>;

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
                {[
                    { id: 'heatmap', label: 'Heatmap de Dificuldade', icon: BarChart3 },
                    { id: 'report', label: 'Relatório', icon: FileText },
                    { id: 'predict', label: 'Previsões', icon: TrendingUp },
                ].map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 transition ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-slate-600 hover:text-slate-800'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Heatmap */}
            {activeTab === 'heatmap' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <p className="text-xs text-green-600 font-bold mb-1">FÁCIL</p>
                            <p className="text-2xl font-bold text-green-700">≥ 4.0</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                            <p className="text-xs text-yellow-600 font-bold mb-1">MÉDIO</p>
                            <p className="text-2xl font-bold text-yellow-700">3.0-4.0</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                            <p className="text-xs text-orange-600 font-bold mb-1">DIFÍCIL</p>
                            <p className="text-2xl font-bold text-orange-700">2.0-3.0</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                            <p className="text-xs text-red-600 font-bold mb-1">MTO DIFÍCIL</p>
                            <p className="text-2xl font-bold text-red-700">&lt; 2.0</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="font-bold text-lg text-slate-800">
                                Dificuldade por Habilidade
                            </h3>
                        </div>
                        <div className="space-y-3 p-6">
                            {heatmap.map(skill => (
                                <div key={skill.skillCode} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-slate-800">{skill.skillCode}</p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${skill.difficulty === 'easy'
                                                    ? 'bg-green-100 text-green-700'
                                                    : skill.difficulty === 'medium'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : skill.difficulty === 'hard'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {skill.avgLevel}/5
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                                        <div
                                            className="h-full"
                                            style={{
                                                width: `${(skill.avgLevel / 5) * 100}%`,
                                                backgroundColor: skill.color
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {skill.count} alunos avaliados
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Relatório */}
            {activeTab === 'report' && report && (
                <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                            <p className="text-xs font-bold text-blue-600 uppercase mb-2">
                                Média Geral
                            </p>
                            <p className="text-3xl font-bold text-blue-700">{report.avgGrade}</p>
                            <p className="text-xs text-blue-600 mt-1">/10</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                            <p className="text-xs font-bold text-purple-600 uppercase mb-2">
                                Taxa de Aprovação
                            </p>
                            <p className="text-3xl font-bold text-purple-700">
                                {report.passRate}%
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                                {Math.round((report.totalStudents * report.passRate) / 100)} alunos
                            </p>
                        </div>
                        <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                            <p className="text-xs font-bold text-red-600 uppercase mb-2">
                                Precisam de Apoio
                            </p>
                            <p className="text-3xl font-bold text-red-700">
                                {report.needsSupport.length}
                            </p>
                            <p className="text-xs text-red-600 mt-1">alunos</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                            <p className="text-xs font-bold text-green-600 uppercase mb-2">
                                Excelentes
                            </p>
                            <p className="text-3xl font-bold text-green-700">
                                {report.topPerformers.length}
                            </p>
                            <p className="text-xs text-green-600 mt-1">alunos</p>
                        </div>
                    </div>

                    {/* Top Performers */}
                    {report.topPerformers.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                ⭐ Top Performers
                            </h3>
                            <div className="space-y-2">
                                {report.topPerformers.map((student, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                                    >
                                        <p className="font-bold text-slate-800">{student.name}</p>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-bold text-sm">
                                            {student.grade}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Precisa de Apoio */}
                    {report.needsSupport.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                                <AlertCircle size={20} className="text-red-600" />
                                Precisam de Apoio
                            </h3>
                            <div className="space-y-2">
                                {report.needsSupport.map((student, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                                    >
                                        <p className="font-bold text-slate-800">{student.name}</p>
                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded font-bold text-sm">
                                            {student.grade}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Insights */}
                    {report.aiInsights && (
                        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
                            <h3 className="font-bold text-lg text-purple-900 mb-3 flex items-center gap-2">
                                <Zap size={20} className="text-purple-600" />
                                Insights IA
                            </h3>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                {report.aiInsights}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Previsões */}
            {activeTab === 'predict' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <p className="text-slate-600">
                        Previsões por aluno serão calculadas durante a navegação...
                    </p>
                </div>
            )}
        </div>
    );
};
