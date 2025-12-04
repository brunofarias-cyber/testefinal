import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Save, Check } from 'lucide-react';

const WeeklyDeliverables = ({ projectId, project }) => {
    const [weeks, setWeeks] = useState([
        { week: 1, deadline: "2024-01-20", task: "Pesquisa inicial", status: "pending", description: "" },
        { week: 2, deadline: "2024-01-27", task: "Coleta de dados", status: "pending", description: "" },
        { week: 3, deadline: "2024-02-03", task: "Análise", status: "pending", description: "" },
        { week: 4, deadline: "2024-02-10", task: "Apresentação Final", status: "pending", description: "" },
    ]);
    const [saved, setSaved] = useState(false);

    const handleEditWeek = (week, field, value) => {
        setWeeks(weeks.map(w => w.week === week ? { ...w, [field]: value } : w));
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Cronograma de Entregas Semanais</h2>
                {saved && (
                    <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                        <Check size={16} /> Salvo com sucesso
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {weeks.map(w => (
                    <div key={w.week} className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex items-start gap-4 mb-3">
                            <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0">
                                <div className="text-center">
                                    <div className="text-sm">Sem</div>
                                    <div className="text-xl">{w.week}</div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={w.task}
                                    onChange={(e) => handleEditWeek(w.week, 'task', e.target.value)}
                                    className="w-full px-3 py-1 border border-slate-200 rounded-lg mb-2 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Nome da tarefa"
                                />
                                <textarea
                                    value={w.description}
                                    onChange={(e) => handleEditWeek(w.week, 'description', e.target.value)}
                                    className="w-full px-3 py-1 border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-12"
                                    placeholder="Descrição da entrega"
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="flex items-center gap-1">
                                    <CalendarIcon size={16} className="text-slate-400" />
                                    <input
                                        type="date"
                                        value={w.deadline}
                                        onChange={(e) => handleEditWeek(w.week, 'deadline', e.target.value)}
                                        className="px-3 py-1 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <select
                                value={w.status}
                                onChange={(e) => handleEditWeek(w.week, 'status', e.target.value)}
                                className={`px-3 py-2 rounded-lg text-sm font-bold border flex-shrink-0 focus:ring-2 focus:ring-indigo-500 outline-none transition ${w.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                                        w.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                                            'bg-slate-100 text-slate-700 border-slate-300'
                                    }`}
                            >
                                <option value="pending">Pendente</option>
                                <option value="in-progress">Em Progresso</option>
                                <option value="completed">Concluído</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
                <Save size={18} />
                {saved ? "Salvo!" : "Salvar Cronograma"}
            </button>
        </div>
    );
};

export default WeeklyDeliverables;
