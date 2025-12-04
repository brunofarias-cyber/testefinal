import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

// ==========================================
// StudentTimeline
// ==========================================
export const StudentTimeline = ({ studentId }) => {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTimeline();
    }, [studentId]);

    const fetchTimeline = async () => {
        try {
            const res = await fetch(`/api/bncc-history/student-timeline/${studentId}`);
            const json = await res.json();
            setTimeline(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (timeline.length === 0) return <p>Sem histórico</p>;

    return (
        <div className="space-y-4">
            {timeline.map((period, idx) => (
                <div key={idx} className="bg-white border-l-4 border-indigo-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-slate-800">Projeto #{period.projectId}</p>
                            <p className="text-xs text-slate-500">
                                {new Date(period.date).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-indigo-600">{period.averageLevel}/5</p>
                            <p className="text-sm text-slate-500">{period.evaluations} avaliações</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ==========================================
// SkillEvolution
// ==========================================
export const SkillEvolution = ({ studentId, skillCode }) => {
    const [evolution, setEvolution] = useState([]);
    const [improvement, setImprovement] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvolution();
    }, [studentId, skillCode]);

    const fetchEvolution = async () => {
        try {
            const res = await fetch(`/api/bncc-history/skill-evolution/${studentId}/${skillCode}`);
            const json = await res.json();
            setEvolution(json.data);
            setImprovement(json.improvement);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (evolution.length === 0) return <p>Sem histórico</p>;

    const chartData = evolution.map((e, idx) => ({
        avaliacao: idx + 1,
        nivel: e.level,
        pontos: e.points,
    }));

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">{skillCode}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-bold ${improvement > 0 ? 'bg-green-100 text-green-700' :
                            improvement < 0 ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-600'
                        }`}>
                        <TrendingUp size={16} />
                        {improvement > 0 ? '+' : ''}{improvement}
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="avaliacao" />
                        <YAxis domain={[1, 5]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="nivel" stroke="#3b82f6" strokeWidth={2} name="Nível" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-2">
                {evolution.map((e, idx) => (
                    <div key={idx} className="bg-slate-50 rounded p-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-bold">Avaliação {idx + 1}</span>
                            <span className="text-indigo-600 font-bold">Nível {e.level}</span>
                        </div>
                        {e.evidence && <p className="text-xs text-slate-600">{e.evidence}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// AnnualReport
// ==========================================
export const AnnualReport = ({ studentId, year }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, [studentId, year]);

    const fetchReport = async () => {
        try {
            const res = await fetch(`/api/bncc-history/annual-report/${studentId}/${year}`);
            const json = await res.json();
            setReport(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!report) return <p>Sem dados</p>;

    const improvementColor = report.improvementTrend > 0 ? 'text-green-600' :
        report.improvementTrend < 0 ? 'text-red-600' : 'text-slate-600';

    const chartData = report.trimesters || [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-slate-100 p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">Avaliações/Ano</p>
                    <p className="text-3xl font-bold text-indigo-600">{report.totalEvaluations}</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-100 p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">Nível Médio</p>
                    <p className="text-3xl font-bold text-blue-600">{report.yearAverageLevel}/5</p>
                </div>
                <div className="bg-white rounded-lg border border-slate-100 p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">Pontos Médios</p>
                    <p className="text-3xl font-bold text-green-600">{report.yearAveragePoints}/10</p>
                </div>
                <div className={`bg-white rounded-lg border border-slate-100 p-4 ${improvementColor}`}>
                    <p className="text-xs font-bold text-slate-400 uppercase">Evolução</p>
                    <p className="text-3xl font-bold">{report.improvementTrend > 0 ? '+' : ''}{report.improvementTrend}</p>
                </div>
            </div>

            {chartData.length > 0 && (
                <div className="bg-white rounded-lg border border-slate-100 p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Evolução Trimestral</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="trimester" label={{ value: 'Trimestre', position: 'insideBottomRight' }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="averageLevel" fill="#3b82f6" name="Nível Médio" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="bg-white rounded-lg border border-slate-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Detalhes por Trimestre</h3>
                <div className="space-y-3">
                    {report.trimesters && report.trimesters.map((trim, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded">
                            <p className="font-bold text-slate-800">{trim.trimester}º Trimestre</p>
                            <p className="text-sm text-slate-600">
                                {trim.evaluations} avaliações | Nível {trim.averageLevel} | {trim.skillsDeveloped} desenvolvidas
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentTimeline;
