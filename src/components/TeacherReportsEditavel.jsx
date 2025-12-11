import React, { useState } from 'react';
import { Download, Save, Edit2, X, Check } from 'lucide-react';

const TeacherReportsEditavel = () => {
    const [relatorio, setRelatorio] = useState({
        cobertura: 85,
        turmaDestaque: "1º Ano A",
        areaFoco: "Ciências da Natureza",
        projetosAtivos: 3,
        competencias: [
            { name: "Pensamento Científico, Crítico e Criativo", progress: 90 },
            { name: "Repertório Cultural", progress: 65 },
            { name: "Comunicação", progress: 80 },
            { name: "Cultura Digital", progress: 100 },
            { name: "Trabalho e Projeto de Vida", progress: 45 }
        ]
    });

    const [editando, setEditando] = useState(false);
    const [salvo, setSalvo] = useState(false);
    const [editValues, setEditValues] = useState(relatorio);

    // Iniciar edição
    const handleStartEdit = () => {
        setEditValues(relatorio);
        setEditando(true);
    };

    // Cancelar edição
    const handleCancelEdit = () => {
        setEditando(false);
    };

    // Salvar alterações
    const handleSave = () => {
        setRelatorio(editValues);
        setEditando(false);
        setSalvo(true);
        setTimeout(() => setSalvo(false), 3000);
    };

    // Atualizar competência
    const handleUpdateCompetencia = (idx, newProgress) => {
        const newCompetencias = [...editValues.competencias];
        newCompetencias[idx].progress = Math.max(0, Math.min(100, parseInt(newProgress) || 0));
        setEditValues({
            ...editValues,
            competencias: newCompetencias
        });
    };

    return (
        <div className="space-y-8">
            {/* Header com Ações */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Relatórios BNCC</h2>
                    <p className="text-slate-500">Acompanhamento das competências desenvolvidas.</p>
                </div>
                <div className="flex gap-3">
                    {editando ? (
                        <>
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2.5 bg-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-400 flex items-center gap-2 transition"
                            >
                                <X size={18} />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center gap-2 transition"
                            >
                                <Save size={18} />
                                Salvar Alterações
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleStartEdit}
                                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition"
                            >
                                <Edit2 size={18} />
                                Editar Relatório
                            </button>
                            <button className="px-4 py-2.5 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 shadow-lg shadow-slate-200 flex items-center gap-2 transition">
                                <Download size={18} />
                                Exportar PDF
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Mensagem de Sucesso */}
            {salvo && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <Check size={20} className="text-green-600" />
                    <p className="text-sm font-bold text-green-700">✓ Relatório salvo com sucesso!</p>
                </div>
            )}

            {/* Cards Principais - EDITÁVEIS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cobertura Total */}
                <div className={`p-6 rounded-2xl border ${editando ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100 bg-white'} shadow-sm transition`}>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Cobertura Total</p>
                    {editando ? (
                        <div className="mt-3 flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={editValues.cobertura}
                                onChange={(e) => setEditValues({
                                    ...editValues,
                                    cobertura: Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                                })}
                                className="w-20 px-2 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-2xl font-bold"
                            />
                            <span className="text-2xl font-bold text-slate-800">%</span>
                        </div>
                    ) : (
                        <p className="text-4xl font-extrabold text-indigo-600 mt-2">{editValues.cobertura}%</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">das competências gerais trabalhadas.</p>
                </div>

                {/* Turma Destaque */}
                <div className={`p-6 rounded-2xl border ${editando ? 'border-purple-300 bg-purple-50' : 'border-slate-100 bg-white'} shadow-sm transition`}>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Turma Destaque</p>
                    {editando ? (
                        <input
                            type="text"
                            value={editValues.turmaDestaque}
                            onChange={(e) => setEditValues({
                                ...editValues,
                                turmaDestaque: e.target.value
                            })}
                            className="w-full mt-3 px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-bold text-slate-800"
                        />
                    ) : (
                        <p className="text-xl font-bold text-slate-800 mt-3">{editValues.turmaDestaque}</p>
                    )}
                    <p className="text-xs text-green-600 font-bold mt-2">92% de aderência</p>
                </div>

                {/* Área de Foco */}
                <div className={`p-6 rounded-2xl border ${editando ? 'border-orange-300 bg-orange-50' : 'border-slate-100 bg-white'} shadow-sm transition`}>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Área de Foco</p>
                    {editando ? (
                        <input
                            type="text"
                            value={editValues.areaFoco}
                            onChange={(e) => setEditValues({
                                ...editValues,
                                areaFoco: e.target.value
                            })}
                            className="w-full mt-3 px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-800"
                        />
                    ) : (
                        <p className="text-xl font-bold text-slate-800 mt-3">{editValues.areaFoco}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">{editValues.projetosAtivos} Projetos ativos</p>
                </div>
            </div>

            {/* Matriz de Competências - EDITÁVEL */}
            <div className={`rounded-2xl border overflow-hidden shadow-sm transition ${editando ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100 bg-white'
                }`}>
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">Matriz de Competências (Gerais)</h3>
                    {editando && (
                        <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1">
                            💡 Clique nos números para editar os valores
                        </p>
                    )}
                </div>

                <div className="divide-y divide-slate-100">
                    {editValues.competencias.map((comp, idx) => (
                        <div key={idx} className="p-6 hover:bg-slate-50 transition">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-slate-700 text-sm">{comp.name}</span>
                                {editando ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={comp.progress}
                                            onChange={(e) => handleUpdateCompetencia(idx, e.target.value)}
                                            className="w-16 px-2 py-1 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-indigo-600"
                                        />
                                        <span className="font-bold text-slate-600">%</span>
                                    </div>
                                ) : (
                                    <span className="font-bold text-indigo-600">{comp.progress}%</span>
                                )}
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${comp.progress >= 90 ? 'bg-green-500' :
                                            comp.progress >= 70 ? 'bg-indigo-500' :
                                                comp.progress >= 50 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                        }`}
                                    style={{ width: `${comp.progress}%` }}
                                ></div>
                            </div>
                            {editando && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Clique no campo para editar
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Análise por Turma */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Análise por Turma</h3>
                    <div className="space-y-3">
                        {[
                            { turma: "1º Ano A", avg: 92 },
                            { turma: "2º Ano B", avg: 78 },
                            { turma: "3º Ano C", avg: 85 }
                        ].map((t, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="font-medium text-slate-700">{t.turma}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-indigo-600 h-full rounded-full"
                                            style={{ width: `${t.avg}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-bold text-indigo-600 w-8 text-right">{t.avg}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tendências */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Tendências</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-bold text-green-700">📈 Aumento em Comunicação</p>
                            <p className="text-xs text-green-600">+15% em relação ao trimestre anterior</p>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm font-bold text-yellow-700">⚠️ Atenção em Cultura Digital</p>
                            <p className="text-xs text-yellow-600">Precisa de reforço em 2º Ano B</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-bold text-blue-700">✓ Destaque: Ciências da Natureza</p>
                            <p className="text-xs text-blue-600">Consistente em todas as turmas</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Legenda */}
            {editando && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                        <strong>💡 Modo Edição Ativo:</strong> Você pode editar os valores de cobertura, turma destaque, área de foco e progresso das competências.
                        Clique em "Salvar Alterações" quando terminar.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TeacherReportsEditavel;
