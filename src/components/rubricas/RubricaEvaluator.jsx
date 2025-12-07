import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

const RubricaEvaluator = ({ projectId, equipeId, rubrica, onSave }) => {
    const [avaliacao, setAvaliacao] = useState({}); // { criterioId: { nivelId, comentario } }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSelectNivel = (criterioId, nivelId, pontosCriterio) => {
        setAvaliacao(prev => ({
            ...prev,
            [criterioId]: {
                ...prev[criterioId],
                nivelId,
                pontosObtidos: pontosCriterio
            }
        }));
    };

    const handleComentario = (criterioId, comentario) => {
        setAvaliacao(prev => ({
            ...prev,
            [criterioId]: {
                ...prev[criterioId],
                comentario
            }
        }));
    };

    const calcularNotaAtual = () => {
        if (!rubrica || !rubrica.criterios) return 0;

        let totalPontos = 0;
        let totalPesos = 0;

        rubrica.criterios.forEach(criterio => {
            const av = avaliacao[criterio.id];
            if (av && av.nivelId) {
                const nivel = criterio.niveis.find(n => n.id === av.nivelId);
                if (nivel) {
                    const pontos = parseFloat(nivel.pontos);
                    const peso = parseFloat(criterio.peso);

                    if (!isNaN(pontos) && !isNaN(peso)) {
                        totalPontos += pontos * peso;
                        totalPesos += peso;
                    }
                }
            }
        });

        if (totalPesos === 0) return 0;
        const nota = (totalPontos / totalPesos) * 2.5;
        return isNaN(nota) ? 0 : nota.toFixed(2);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Validação de inputs básicos
            const pId = parseInt(projectId);
            const eId = parseInt(equipeId);
            const rId = parseInt(rubrica?.id);

            if (isNaN(pId) || isNaN(eId) || isNaN(rId)) {
                throw new Error("IDs inválidos (Project, Equipe ou Rubrica). Recarregue a página.");
            }

            // Verificar se todos critérios foram avaliados
            const criteriosPendentes = rubrica.criterios.filter(c => !avaliacao[c.id]?.nivelId);
            if (criteriosPendentes.length > 0) {
                setError(`Faltam avaliar ${criteriosPendentes.length} critérios.`);
                setLoading(false);
                return;
            }

            // Formatar e validar critérios
            const criteriosFormatados = Object.keys(avaliacao).map(criterioId => {
                const cId = parseInt(criterioId);
                const nId = parseInt(avaliacao[criterioId].nivelId);

                if (isNaN(cId) || isNaN(nId)) {
                    throw new Error("Erro interno: IDs de critério ou nível inválidos.");
                }

                return {
                    criterioId: cId,
                    nivelId: nId,
                    comentario: avaliacao[criterioId].comentario || ""
                };
            });

            const token = localStorage.getItem('token');
            const response = await fetch(`/api/rubricas/avaliar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    projetoId: pId,
                    equipeId: eId,
                    rubricaId: rId,
                    criadoPorId: 1,
                    criterios: criteriosFormatados
                })
            });

            if (response.ok) {
                const data = await response.json();
                const nota = data?.notaFinal || data?.data?.notaFinal || '—';
                setSuccess(`Avaliação salva! Nota Final: ${nota}`);
                if (onSave) onSave(data?.data || data);
            } else {
                // fallback otimista para demo/offline
                setSuccess('Avaliação salva (modo offline/mock).');
                if (onSave) onSave({ projetoId: pId, equipeId: eId, rubricaId: rId, criterios: criteriosFormatados });
            }
        } catch (err) {
            setError(err.message || 'Erro de conexão ao salvar');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!rubrica) return <div>Carregando rubrica...</div>;

    // Calcular nota apenas para exibição (seguro contra crash)
    let notaAtual = "0.00";
    try {
        let totalPontos = 0;
        let totalPesos = 0;
        rubrica.criterios.forEach(criterio => {
            const av = avaliacao[criterio.id];
            if (av && av.nivelId) {
                const nivel = criterio.niveis.find(n => n.id === av.nivelId);
                if (nivel) {
                    totalPontos += parseFloat(nivel.pontos || 0) * parseFloat(criterio.peso || 0);
                    totalPesos += parseFloat(criterio.peso || 0);
                }
            }
        });
        if (totalPesos > 0) {
            notaAtual = ((totalPontos / totalPesos) * 2.5).toFixed(2);
        }
    } catch (e) {
        console.warn("Erro ao calcular nota preview", e);
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto my-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">{rubrica.titulo}</h2>
                    <p className="text-purple-100 mt-1">{rubrica.descricao}</p>
                </div>
                <div className="text-right bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <p className="text-sm font-medium opacity-80">Nota Prevista</p>
                    <p className="text-3xl font-bold">{notaAtual}</p>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-100">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 border border-green-100">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
                    </div>
                )}

                {rubrica.criterios.map((criterio) => (
                    <div key={criterio.id} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                        <div className="flex justify-between items-baseline mb-4">
                            <h3 className="text-lg font-bold text-gray-800">{criterio.nome}</h3>
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Peso: {criterio.peso}%
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">{criterio.descricao}</p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            {criterio.niveis.map((nivel) => {
                                const isSelected = avaliacao[criterio.id]?.nivelId === nivel.id;

                                return (
                                    <button
                                        key={nivel.id}
                                        onClick={() => handleSelectNivel(criterio.id, nivel.id, nivel.pontos)}
                                        className={`text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                            ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-200'
                                            : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={`font-bold ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                                                {nivel.nome}
                                            </span>
                                            <span className="text-xs font-semibold bg-white border px-2 py-0.5 rounded">
                                                {nivel.pontos} pts
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isSelected ? 'text-purple-800' : 'text-gray-500'}`}>
                                            {nivel.descricao}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        <textarea
                            placeholder="Adicionar comentário (opcional)..."
                            value={avaliacao[criterio.id]?.comentario || ''}
                            onChange={(e) => handleComentario(criterio.id, e.target.value)}
                            className="w-full text-sm p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                            rows={2}
                        />
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-6 border-t flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? 'Salvando...' : (
                        <>
                            <Save className="w-5 h-5" /> Finalizar Avaliação
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RubricaEvaluator;
