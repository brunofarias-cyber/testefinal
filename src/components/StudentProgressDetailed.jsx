import React from 'react';

const StudentProgressDetailed = ({ project }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">{project.title} - Progresso Detalhado</h2>

            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(week => (
                    <div key={week} className="bg-white rounded-xl border border-slate-200 p-4">
                        <p className="font-bold text-slate-800 mb-2">Semana {week}</p>
                        <p className="text-sm text-slate-600 mb-3">Pesquisa inicial</p>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${week <= 2 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {week <= 2 ? '✓ Completo' : 'Em breve'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Etapas do Projeto</h3>
                <div className="space-y-3">
                    {[
                        { stage: 'Pesquisa', status: 'completed' },
                        { stage: 'Coleta de Dados', status: 'completed' },
                        { stage: 'Análise', status: 'in-progress' },
                        { stage: 'Apresentação', status: 'pending' }
                    ].map((stage, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${stage.status === 'completed' ? 'bg-green-500' :
                                    stage.status === 'in-progress' ? 'bg-yellow-500' :
                                        'bg-slate-300'
                                }`}>
                                {stage.status === 'completed' ? '✓' : idx + 1}
                            </div>
                            <p className="font-bold text-slate-800">{stage.stage}</p>
                            <span className="ml-auto text-xs font-bold text-slate-500">
                                {stage.status === 'completed' ? 'Concluído' :
                                    stage.status === 'in-progress' ? 'Em andamento' :
                                        'Aguardando'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProgressDetailed;
