import React, { useState, useEffect } from 'react';

export const ProjectReport = ({ projectId }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, [projectId]);

    const fetchReport = async () => {
        try {
            const res = await fetch(`/api/bncc/reports/project/${projectId}`);
            const json = await res.json();
            setReport(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando relatório...</p>;
    if (!report) return <p>Nenhum dado</p>;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Relatório do Projeto</h3>
                <p className="text-slate-600 mb-4">Total de avaliações: {report.totalEvaluations}</p>

                <div className="mb-6">
                    <h4 className="font-bold text-slate-700 mb-3">Por Disciplina</h4>
                    <div className="space-y-3">
                        {Object.entries(report.byDiscipline).map(([disc, data]) => (
                            <div key={disc} className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-bold text-slate-800">{disc}</p>
                                <p className="text-xs text-slate-500">
                                    Nível 4-5: {data.levels[4] + data.levels[5]} |
                                    Nível 3: {data.levels[3]} |
                                    Nível 1-2: {data.levels[1] + data.levels[2]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectReport;
