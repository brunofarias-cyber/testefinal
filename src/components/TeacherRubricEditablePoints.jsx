import React, { useState } from "react";
import { Edit, Save, X, Plus, Trash2, AlertCircle, Check } from "lucide-react";

const MOCK_RUBRIC_DATA = [
    {
        id: 1,
        project: "Horta Sustentável",
        criteria: [
            { id: "c1", name: "Investigação Científica", maxPoints: 2, description: "Qualidade da pesquisa e análise", weight: 40 },
            { id: "c2", name: "Trabalho em Equipe", maxPoints: 2, description: "Colaboração e comunicação", weight: 30 },
            { id: "c3", name: "Comunicação Oral", maxPoints: 2, description: "Clareza e organização", weight: 30 }
        ],
        levels: [
            { points: 0, description: "Não apresentou ou muito inadequado" },
            { points: 0.5, description: "Inadequado" },
            { points: 1, description: "Básico" },
            { points: 1.5, description: "Proficiente" },
            { points: 2, description: "Avançado" }
        ]
    }
];

const TeacherRubricEditablePoints = () => {
    const [rubrics, setRubrics] = useState(MOCK_RUBRIC_DATA);
    const [selectedRubric, setSelectedRubric] = useState(rubrics[0].id);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCriteria, setEditingCriteria] = useState(null);
    const [saveMessage, setSaveMessage] = useState("");

    const currentRubric = rubrics.find(r => r.id === selectedRubric);

    const updateCriteria = (criteriaId, field, value) => {
        setRubrics(prev => prev.map(r => {
            if (r.id === selectedRubric) {
                return {
                    ...r,
                    criteria: r.criteria.map(c => c.id === criteriaId ? { ...c, [field]: value } : c)
                };
            }
            return r;
        }));
    };

    const deleteCriteria = (criteriaId) => {
        setRubrics(prev => prev.map(r => {
            if (r.id === selectedRubric) {
                return {
                    ...r,
                    criteria: r.criteria.filter(c => c.id !== criteriaId)
                };
            }
            return r;
        }));
    };

    const addCriteria = () => {
        const newCriteria = {
            id: `c${Date.now()}`,
            name: "Novo Critério",
            maxPoints: 2,
            description: "Descrição",
            weight: 10
        };
        setRubrics(prev => prev.map(r => {
            if (r.id === selectedRubric) {
                return {
                    ...r,
                    criteria: [...r.criteria, newCriteria]
                };
            }
            return r;
        }));
    };

    const handleSave = () => {
        setSaveMessage("✅ Rubrica salva com sucesso!");
        setTimeout(() => setSaveMessage(""), 3000);
        setIsEditing(false);
    };

    const calculateTotal = () => {
        return currentRubric.criteria.reduce((sum, c) => sum + c.weight, 0);
    };

    const totalWeight = calculateTotal();
    const isValidWeight = totalWeight === 100;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">📋 Rubricas de Avaliação</h2>
                    <p className="text-slate-500">Escala de 0 a 2 pontos por critério</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition ${isEditing
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
                        }`}
                >
                    {isEditing ? <X size={18} /> : <Edit size={18} />}
                    {isEditing ? "Cancelar Edição" : "Editar Rubrica"}
                </button>
            </div>

            {saveMessage && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-2 text-green-700">
                    <Check size={18} />
                    {saveMessage}
                </div>
            )}

            {/* Seletor de Projeto */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Projeto</label>
                <select
                    value={selectedRubric}
                    onChange={(e) => setSelectedRubric(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    {rubrics.map(r => (
                        <option key={r.id} value={r.id}>{r.project}</option>
                    ))}
                </select>
            </div>

            {/* Tabela de Rubrica */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h3 className="font-bold text-lg text-slate-800">{currentRubric.project}</h3>
                    <p className="text-sm text-slate-600 mt-1">Total de peso: <span className={`font-bold ${isValidWeight ? 'text-green-600' : 'text-red-600'}`}>{totalWeight}%</span></p>
                </div>

                {/* Explicação da Escala */}
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-bold text-slate-800 mb-3">📊 Escala de Pontos:</p>
                    <div className="grid grid-cols-5 gap-2">
                        {currentRubric.levels.map((level, idx) => (
                            <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                                <p className="font-bold text-indigo-600 text-sm">{level.points}</p>
                                <p className="text-xs text-slate-600">{level.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Critérios */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-700">Critério</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Descrição</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Máx. Pontos</th>
                                <th className="px-6 py-4 font-bold text-slate-700">Peso</th>
                                {isEditing && <th className="px-6 py-4 font-bold text-slate-700">Ações</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentRubric.criteria.map((criteria) => (
                                <tr key={criteria.id} className="hover:bg-slate-50 transition group">
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={criteria.name}
                                                onChange={(e) => updateCriteria(criteria.id, "name", e.target.value)}
                                                className="w-full px-2 py-1 border border-slate-200 rounded font-bold text-slate-800"
                                            />
                                        ) : (
                                            <p className="font-bold text-slate-800">{criteria.name}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={criteria.description}
                                                onChange={(e) => updateCriteria(criteria.id, "description", e.target.value)}
                                                className="w-full px-2 py-1 border border-slate-200 rounded text-sm text-slate-600"
                                            />
                                        ) : (
                                            <p className="text-slate-600">{criteria.description}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <select
                                                value={criteria.maxPoints}
                                                onChange={(e) => updateCriteria(criteria.id, "maxPoints", parseFloat(e.target.value))}
                                                className="px-2 py-1 border border-slate-200 rounded font-bold text-slate-800"
                                            >
                                                <option value="1">1 ponto</option>
                                                <option value="2">2 pontos</option>
                                                <option value="3">3 pontos</option>
                                            </select>
                                        ) : (
                                            <p className="font-bold text-indigo-600">{criteria.maxPoints} pontos</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={criteria.weight}
                                                    onChange={(e) => updateCriteria(criteria.id, "weight", parseInt(e.target.value))}
                                                    className="w-16 px-2 py-1 border border-slate-200 rounded text-center font-bold"
                                                />
                                                <span className="text-slate-600">%</span>
                                            </div>
                                        ) : (
                                            <p className="font-bold text-slate-800">{criteria.weight}%</p>
                                        )}
                                    </td>
                                    {isEditing && (
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => deleteCriteria(criteria.id)}
                                                className="p-1 hover:bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition"
                                                title="Remover"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isEditing && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50">
                        <button
                            onClick={addCriteria}
                            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold text-sm transition flex items-center gap-2"
                        >
                            <Plus size={16} /> Adicionar Critério
                        </button>
                    </div>
                )}
            </div>

            {/* Avisos e Informações */}
            <div className="mt-6 space-y-4">
                {!isValidWeight && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-yellow-900">⚠️ Peso Total Incorreto</p>
                            <p className="text-sm text-yellow-800">O peso total dos critérios deve ser 100%, não {totalWeight}%</p>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 mb-2">
                        <strong>ℹ️ Como a nota funciona:</strong>
                    </p>
                    <ul className="text-sm text-blue-900 space-y-1">
                        <li>• Cada critério é avaliado de 0 a 2 pontos</li>
                        <li>• A pontuação é multiplicada pelo peso (%) do critério</li>
                        <li>• A soma ponderada é multiplicada por 2.5 para chegar à escala 0-10</li>
                        <li>• Exemplo: (1.8 × 0.40 + 1.9 × 0.30 + 1.8 × 0.30) × 2.5 = 8.95</li>
                    </ul>
                </div>
            </div>

            {/* Botão Salvar */}
            {isEditing && (
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isValidWeight}
                        className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${isValidWeight
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        <Save size={18} />
                        Salvar Rubrica
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeacherRubricEditablePoints;
