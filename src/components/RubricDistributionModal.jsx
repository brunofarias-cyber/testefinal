import React, { useState } from 'react';
import { Plus, X, AlertCircle, CheckCircle } from 'lucide-react';

const RubricDistributionModal = ({
    projectTitle,
    projectId,
    onClose,
    onSubmit
}) => {
    const [step, setStep] = useState(1); // 1: criteria input, 2: review, 3: success
    const [criteria, setCriteria] = useState([
        { name: 'Planejamento', maxPoints: 25, description: '' },
        { name: 'Execução', maxPoints: 25, description: '' },
        { name: 'Documentação', maxPoints: 25, description: '' },
        { name: 'Apresentação', maxPoints: 25, description: '' }
    ]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const updateCriteria = (index, field, value) => {
        const updated = [...criteria];
        if (field === 'maxPoints') {
            updated[index][field] = parseInt(value) || 0;
        } else {
            updated[index][field] = value;
        }
        setCriteria(updated);
        setError('');
    };

    const addCriteria = () => {
        setCriteria([
            ...criteria,
            { name: '', maxPoints: 0, description: '' }
        ]);
    };

    const removeCriteria = (index) => {
        setCriteria(criteria.filter((_, i) => i !== index));
    };

    const getTotalPoints = () => {
        return criteria.reduce((sum, c) => sum + (c.maxPoints || 0), 0);
    };

    const validateCriteria = () => {
        if (criteria.length === 0) {
            setError('Adicione pelo menos 1 critério');
            return false;
        }

        for (const criterion of criteria) {
            if (!criterion.name.trim()) {
                setError('Todos os critérios devem ter um nome');
                return false;
            }
            if (criterion.maxPoints <= 0 || criterion.maxPoints > 100) {
                setError('Pontos devem estar entre 1 e 100');
                return false;
            }
        }

        const total = getTotalPoints();
        if (total !== 100) {
            setError(`Total deve ser 100. Atual: ${total}`);
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateCriteria()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/rubrics/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    projectTitle,
                    criteria: criteria.map(c => ({
                        name: c.name,
                        maxPoints: c.maxPoints,
                        description: c.description
                    })),
                    createdBy: 'Prof. Ana Silva'
                })
            });

            if (!response.ok) {
                const error = await response.json();
                setError(error.message || 'Erro ao criar rúbrica');
                setLoading(false);
                return;
            }

            setStep(3);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError('Erro de conexão: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center border-b">
                    <div>
                        <h2 className="text-2xl font-bold">Rúbrica de Avaliação</h2>
                        <p className="text-purple-100 text-sm mt-1">{projectTitle}</p>
                    </div>
                    {step !== 3 && (
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <>
                            {/* Error Alert */}
                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 flex gap-3">
                                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                                    <div>
                                        <p className="font-semibold text-red-800">Erro na rúbrica</p>
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                <p className="text-blue-900 text-sm">
                                    <strong>Instruções:</strong> Defina os critérios de avaliação. 
                                    O total de pontos deve ser exatamente <strong>100</strong>.
                                </p>
                            </div>

                            {/* Criteria List */}
                            <div className="space-y-4">
                                {criteria.map((criterion, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex gap-4 mb-3">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Critério {index + 1} - Nome *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={criterion.name}
                                                    onChange={(e) => updateCriteria(index, 'name', e.target.value)}
                                                    placeholder="Ex: Planejamento"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Pontos *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={criterion.maxPoints}
                                                    onChange={(e) => updateCriteria(index, 'maxPoints', e.target.value)}
                                                    min="0"
                                                    max="100"
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                                                />
                                            </div>
                                            {criteria.length > 1 && (
                                                <button
                                                    onClick={() => removeCriteria(index)}
                                                    className="mt-6 text-red-500 hover:bg-red-50 p-2 rounded"
                                                    title="Remover critério"
                                                >
                                                    <X size={20} />
                                                </button>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Descrição (opcional)
                                            </label>
                                            <input
                                                type="text"
                                                value={criterion.description}
                                                onChange={(e) => updateCriteria(index, 'description', e.target.value)}
                                                placeholder="Ex: Qualidade do planejamento"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={addCriteria}
                                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md border border-dashed border-gray-300"
                            >
                                <Plus size={18} />
                                Adicionar Critério
                            </button>

                            {/* Total Points */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Total de Pontos:</span>
                                    <span className={`text-2xl font-bold ${
                                        getTotalPoints() === 100 
                                            ? 'text-green-600' 
                                            : 'text-orange-600'
                                    }`}>
                                        {getTotalPoints()}/100
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div
                                        className={`h-2 rounded-full transition-all ${
                                            getTotalPoints() === 100
                                                ? 'bg-green-600'
                                                : 'bg-orange-600'
                                        }`}
                                        style={{ width: `${Math.min(getTotalPoints(), 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => validateCriteria() && setStep(2)}
                                    disabled={getTotalPoints() !== 100 || loading}
                                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium rounded-md transition"
                                >
                                    Revisar
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h3 className="text-lg font-bold text-gray-800 mb-4">
                                Revisar Rúbrica
                            </h3>

                            <div className="space-y-3 mb-6">
                                {criteria.map((criterion, index) => (
                                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-semibold text-gray-800">{criterion.name}</p>
                                            {criterion.description && (
                                                <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-purple-600 text-lg">{criterion.maxPoints}</p>
                                            <p className="text-xs text-gray-500">pontos</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-700">Total:</span>
                                    <span className="text-2xl font-bold text-green-600">{getTotalPoints()}/100</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium rounded-md transition flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        'Distribuir Rúbrica'
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="text-green-600" size={64} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Rúbrica Distribuída!
                            </h3>
                            <p className="text-gray-600">
                                A rúbrica para <strong>{projectTitle}</strong> foi criada com sucesso
                            </p>
                            <p className="text-gray-500 text-sm mt-2">
                                Redirecionando em 2 segundos...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RubricDistributionModal;
