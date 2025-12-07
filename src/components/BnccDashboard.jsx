import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Award } from 'lucide-react';

// ==========================================
// 1. OverviewCards
// ==========================================
export const OverviewCards = ({ projectId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/bncc-dashboard/overview/${projectId}`);
            const json = await res.json();
            setData(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!data) return <p>Sem dados</p>;

    const levelCounts = data.levelDistribution.reduce((acc, ld) => {
        acc[ld.level] = ld.count;
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Avaliações</p>
                <p className="text-3xl font-bold text-indigo-600">{data.totalEvaluations}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Alunos Avaliados</p>
                <p className="text-3xl font-bold text-blue-600">{data.studentsEvaluated}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Média Pontos</p>
                <p className="text-3xl font-bold text-green-600">{data.averagePoints}/10</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Desenvolvidas (4-5)</p>
                <p className="text-3xl font-bold text-purple-600">
                    {(levelCounts[4] || 0) + (levelCounts[5] || 0)}
                </p>
            </div>
        </div>
    );
};

// ==========================================
// 2. LevelDistributionChart
// ==========================================
export const LevelDistributionChart = ({ projectId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/bncc-dashboard/overview/${projectId}`);
            const json = await res.json();
            const chartData = json.data.levelDistribution.map(ld => ({
                name: `Nível ${ld.level}`,
                value: ld.count,
            }));
            setData(chartData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Distribuição por Nível</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

// ==========================================
// 3. DisciplinePerformance
// ==========================================
export const DisciplinePerformance = ({ projectId }) => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/bncc-dashboard/by-discipline/${projectId}`);
            const json = await res.json();
            setData(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!data || Object.keys(data).length === 0) return <p>Sem dados disponíveis</p>;

    const chartData = Object.entries(data).map(([disc, levels]) => ({
        name: disc,
        level4_5: (levels[4] || 0) + (levels[5] || 0),
        level3: levels[3] || 0,
        level1_2: (levels[1] || 0) + (levels[2] || 0),
    }));

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Performance por Disciplina</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="level4_5" fill="#10b981" name="Desenvolvidas (4-5)" />
                    <Bar dataKey="level3" fill="#f59e0b" name="Em Prog. (3)" />
                    <Bar dataKey="level1_2" fill="#ef4444" name="Não Apresentadas (1-2)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// ==========================================
// 4. CoverageIndicator
// ==========================================
export const CoverageIndicator = ({ projectId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/bncc-dashboard/coverage/${projectId}`);
            const json = await res.json();
            setData(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!data) return <p>Sem dados</p>;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Cobertura BNCC</h3>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-slate-600">Habilidades Cobertas</span>
                        <span className="text-sm font-bold text-indigo-600">{data.percentageCovered}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${data.percentageCovered}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{data.evaluated} de {data.total} habilidades avaliadas</p>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-slate-600">Habilidades Desenvolvidas</span>
                        <span className="text-sm font-bold text-green-600">{data.percentageDeveloped}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div className="bg-green-600 h-full rounded-full" style={{ width: `${data.percentageDeveloped}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{data.developed} de {data.total} habilidades em Nível 4-5</p>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-600 uppercase mb-3">Por Disciplina</p>
                <div className="space-y-2">
                    {data.byDiscipline.map(bd => (
                        <div key={bd.discipline} className="flex justify-between text-sm">
                            <span className="text-slate-600">{bd.discipline}</span>
                            <span className="font-bold text-slate-800">{bd.total} habilidades</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 5. TopStudents
// ==========================================
export const TopStudents = ({ projectId }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/bncc-dashboard/top-students/${projectId}?limit=5`);
            const json = await res.json();
            setStudents(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!students || !Array.isArray(students) || students.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Award size={20} className="text-yellow-500" />
                    Top Performers
                </h3>
                <p className="text-slate-500">Nenhum aluno com avaliações disponível</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Award size={20} className="text-yellow-500" />
                Top Performers
            </h3>

            <div className="space-y-3">
                {students.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                            <p className="font-bold text-slate-800">Aluno #{student.studentId}</p>
                            <p className="text-xs text-slate-500">{student.totalEvaluations} avaliações</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">{student.averagePoints}</p>
                            <p className="text-xs text-slate-500">/10</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 6. AtRiskStudents
// ==========================================
export const AtRiskStudents = ({ projectId }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/bncc-dashboard/at-risk/${projectId}`);
            const json = await res.json();
            setStudents(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;

    if (!students || !Array.isArray(students) || students.length === 0) {
        return (
            <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
                <p className="text-green-700 font-bold flex items-center gap-2">✅ Nenhum aluno em risco!</p>
            </div>
        );
    }

    return (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} />
                Alunos em Risco
            </h3>

            <div className="space-y-3">
                {students.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                        <div>
                            <p className="font-bold text-slate-800">Aluno #{student.studentId}</p>
                            <p className="text-xs text-red-600">{student.skillsAtRisk} habilidades em risco</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-red-600">{student.averageLevel}</p>
                            <p className="text-xs text-slate-500">média de nível</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 7. SkillsPerformance
// ==========================================
export const SkillsPerformance = ({ projectId }) => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/bncc-dashboard/skills-performance/${projectId}`);
            const json = await res.json();
            setSkills(json.data.slice(0, 10));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Performance por Habilidade (Top 10)</h3>
                <p className="text-slate-500">Nenhuma habilidade disponível</p>
            </div>
        );
    }

    const chartData = skills.map(s => ({
        code: s.skillCode,
        developed: s.developmentPercentage,
    }));

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Performance por Habilidade (Top 10)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="code" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="developed" fill="#3b82f6" name="% Desenvolvida" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// ==========================================
// 8. CompleteDashboard (Tudo junto)
// ==========================================
export const CompleteDashboard = ({ projectId }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard BNCC</h2>
                <p className="text-slate-500">Análise completa de habilidades e competências</p>
            </div>

            <OverviewCards projectId={projectId} />

            <div className="grid grid-cols-2 gap-6">
                <LevelDistributionChart projectId={projectId} />
                <CoverageIndicator projectId={projectId} />
            </div>

            <DisciplinePerformance projectId={projectId} />

            <div className="grid grid-cols-2 gap-6">
                <TopStudents projectId={projectId} />
                <AtRiskStudents projectId={projectId} />
            </div>

            <SkillsPerformance projectId={projectId} />
        </div>
    );
};

export default CompleteDashboard;
