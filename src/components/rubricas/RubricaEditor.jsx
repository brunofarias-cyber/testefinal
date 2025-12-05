import React, { useState, useEffect } from 'react';
import { Plus, Trash, Save, Edit2, Check, X } from 'lucide-react';

const RubricaEditor = ({ projectId, onSave, initialData }) => {
    const [rubrica, setRubrica] = useState({
        titulo: '',
        descricao: '',
        criterios: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (initialData) {
            setRubrica(initialData);
        } else {
            // Carregar rubrica existente se houver
            fetchRubrica();
        }
    }, [projectId, initialData]);

    const fetchRubrica = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/rubricas-v2/projeto/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.sucesso && data.dados) {
                    setRubrica(data.dados);
                }
            }
        } catch (err) {
            console.error("Erro ao buscar rubrica", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCriterio = () => {
        setRubrica(prev => ({
            ...prev,
            criterios: [
                ...prev.criterios,
                {
                    id: `temp-${Date.now()}`,
                    nome: '',
                    descricao: '',
                    peso: 10,
                    niveis: [
                        { nome: 'Insuficiente', pontos: 1, descricao: '' },
                        { nome: 'Básico', pontos: 2, descricao: '' },
                        { nome: 'Proficiente', pontos: 3, descricao: '' },
                        { nome: 'Avançado', pontos: 4, descricao: '' }
                    ]
                }
            ]
        }));
    };

    const handleUpdateCriterio = (index, field, value) => {
        const newCriterios = [...rubrica.criterios];
        newCriterios[index] = { ...newCriterios[index], [field]: value };
        setRubrica(prev => ({ ...prev, criterios: newCriterios }));
    };

    const handleRemoveCriterio = (index) => {
        const newCriterios = rubrica.criterios.filter((_, i) => i !== index);
        setRubrica(prev => ({ ...prev, criterios: newCriterios }));
    };

    const handleUpdateNivel = (criterioIndex, nivelIndex, field, value) => {
        const newCriterios = [...rubrica.criterios];
        const newNiveis = [...newCriterios[criterioIndex].niveis];
        newNiveis[nivelIndex] = { ...newNiveis[nivelIndex], [field]: value };
        newCriterios[criterioIndex].niveis = newNiveis;
        setRubrica(prev => ({ ...prev, criterios: newCriterios }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const token = localStorage.getItem('token');
            // Validar pesos
            const totalPeso = rubrica.criterios.reduce((acc, curr) => acc + parseFloat(curr.peso || 0), 0);

            if (Math.abs(totalPeso - 100) > 1) {
                setError(`A soma dos pesos deve ser 100%. Atual: ${totalPeso}%`);
                setLoading(false);
                return;
            }

            const response = await fetch(`http://localhost:3000/api/rubricas-v2/projeto/${projectId}/criar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(rubrica)
            });

            const data = await response.json();

            if (data.sucesso) {
                setSuccess('Rubrica salva com sucesso!');
                setRubrica(data.dados);
                if (onSave) onSave(data.dados);
            } else {
                setError(data.erro || 'Erro ao salvar rubrica');
            }
        } catch (err) {
            setError('Erro de conexão ao salvar');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Edit2 className="w-6 h-6 text-purple-600" />
                    Editor de Rubricas
                </h2>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : (
                        <>
                            <Save className="w-4 h-4" /> Salvar Rubrica
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 flex items-center gap-2">
                    <X className="w-5 h-5" /> {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5" /> {success}
                </div>
            )}

            <div className="space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título da Rubrica</label>
                    <input
                        type="text"
                        value={rubrica.titulo}
                        onChange={(e) => setRubrica({ ...rubrica, titulo: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Ex: Rubrica de Avaliação Final"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                        value={rubrica.descricao}
                        onChange={(e) => setRubrica({ ...rubrica, descricao: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Descrição geral dos critérios de avaliação..."
                        rows={3}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-700">Critérios de Avaliação</h3>
                    <button
                        onClick={handleAddCriterio}
                        className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Adicionar Critério
                    </button>
                </div>

                {rubrica.criterios.map((criterio, cIndex) => (
                    <div key={criterio.id || cIndex} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-8">
                                    <input
                                        type="text"
                                        value={criterio.nome}
                                        onChange={(e) => handleUpdateCriterio(cIndex, 'nome', e.target.value)}
                                        className="w-full font-semibold bg-transparent border-b border-gray-300 focus:border-purple-500 py-1 px-2"
                                        placeholder="Nome do Critério (ex: Pesquisa)"
                                    />
                                    <input
                                        type="text"
                                        value={criterio.descricao}
                                        onChange={(e) => handleUpdateCriterio(cIndex, 'descricao', e.target.value)}
                                        className="w-full text-sm text-gray-600 bg-transparent border-b border-gray-200 focus:border-purple-500 py-1 px-2 mt-2"
                                        placeholder="Descrição do critério..."
                                    />
                                </div>
                                <div className="md:col-span-4 flex items-center gap-2">
                                    <label className="text-sm text-gray-600 whitespace-nowrap">Peso (%):</label>
                                    <input
                                        type="number"
                                        value={criterio.peso}
                                        onChange={(e) => handleUpdateCriterio(cIndex, 'peso', parseFloat(e.target.value))}
                                        className="w-20 px-2 py-1 border rounded focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveCriterio(cIndex)}
                                className="text-red-500 hover:text-red-700 ml-4 p-1 rounded hover:bg-red-50"
                            >
                                <Trash className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                            {criterio.niveis?.map((nivel, nIndex) => (
                                <div key={nIndex} className={`p-3 rounded border ${nIndex === 0 ? 'bg-red-50 border-red-100' :
                                        nIndex === 1 ? 'bg-orange-50 border-orange-100' :
                                            nIndex === 2 ? 'bg-blue-50 border-blue-100' :
                                                'bg-green-50 border-green-100'
                                    }`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={`text-xs font-bold uppercase ${nIndex === 0 ? 'text-red-700' :
                                                nIndex === 1 ? 'text-orange-700' :
                                                    nIndex === 2 ? 'text-blue-700' :
                                                        'text-green-700'
                                            }`}>{nivel.nome}</span>
                                        <span className="text-xs font-bold bg-white px-2 py-0.5 rounded shadow-sm">
                                            {nivel.pontos} pts
                                        </span>
                                    </div>
                                    <textarea
                                        value={nivel.descricao}
                                        onChange={(e) => handleUpdateNivel(cIndex, nIndex, 'descricao', e.target.value)}
                                        className="w-full text-xs p-2 rounded bg-white/50 border-none focus:ring-1 focus:ring-gray-300 resize-none h-20"
                                        placeholder={`Descrição para nível ${nivel.nome}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {rubrica.criterios.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        Nenhum critério adicionado. Clique no botão acima para começar.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RubricaEditor;
