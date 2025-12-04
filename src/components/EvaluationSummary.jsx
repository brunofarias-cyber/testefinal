import React, { useState, useEffect } from 'react';

export const EvaluationSummary = ({ projectId, studentId }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, [projectId, studentId]);

    const fetchSummary = async () => {
        try {
            const res = await fetch(`/api/bncc/summary/${projectId}/${studentId}`);
            const json = await res.json();
            setSummary(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (!summary) return <p>Nenhuma avaliação encontrada</p>;

    const { summary: sum, byDiscipline } = summary;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-400">Total Avaliadas</p>
                    <p className="text-3xl font-bold text-indigo-600">{sum.skillsEvaluated}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-xs font-bold text-green-600">Desenvolvidas (4-5)</p>
                    <p className="text-3xl font-bold text-green-600">{sum.skillsDeveloped45}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-xs font-bold text-yellow-600">Em Prog. (3)</p>
                    <p className="text-3xl font-bold text-yellow-600">{sum.skillsInProgress3}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-xs font-bold text-red-600">Não Apresentadas (1-2)</p>
                    <p className="text-3xl font-bold text-red-600">{sum.skillsNotPresented12}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Por Disciplina</h3>
                <div className="space-y-4">
                    {Object.entries(byDiscipline).map(([disciplina, evals]) => (
                        <div key={disciplina} className="pb-4 border-b border-slate-100 last:border-0">
                            <p className="font-bold text-slate-700 mb-2">{disciplina}</p>
                            <div className="space-y-2">
                                {evals.map((e, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">{e.skillCode}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${e.chosenLevel >= 4 ? 'bg-green-100 text-green-700' :
                                                e.chosenLevel === 3 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            Nível {e.chosenLevel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EvaluationSummary;
