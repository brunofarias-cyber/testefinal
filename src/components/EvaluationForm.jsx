import React, { useState, useEffect } from 'react';

export const EvaluationForm = ({ projectId, studentId, skillCode, onSaved }) => {
    const [level, setLevel] = useState(3);
    const [evidence, setEvidence] = useState('');
    const [feedback, setFeedback] = useState('');
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIndicators();
    }, []);

    const fetchIndicators = async () => {
        try {
            const res = await fetch(`/api/bncc/projects/${projectId}/indicators/${skillCode}`);
            const json = await res.json();
            setIndicators(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/bncc/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId,
                    studentId,
                    skillCode,
                    chosenLevel: level,
                    evidence,
                    feedback,
                }),
            });
            if (res.ok) {
                onSaved();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Avaliar: {skillCode}</h3>

            <div className="mb-6">
                <p className="text-sm font-bold text-slate-600 mb-3">Qual é o nível?</p>
                <div className="grid grid-cols-5 gap-2">
                    {indicators.map(ind => (
                        <button
                            key={ind.level}
                            type="button"
                            onClick={() => setLevel(ind.level)}
                            className={`p-3 rounded-lg border font-bold text-sm transition ${level === ind.level ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                                }`}
                        >
                            <p className="text-xs opacity-80">{ind.levelLabel}</p>
                            <p>{ind.level}</p>
                        </button>
                    ))}
                </div>
                {indicators[level - 1] && <p className="text-xs text-slate-500 mt-2">{indicators[level - 1].observableBehavior}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold text-slate-600 mb-2">O que você observou? (Evidência)</label>
                <textarea
                    value={evidence}
                    onChange={(e) => setEvidence(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                    placeholder="Ex: João calculou corretamente o espaçamento de 50 plantas..."
                />
            </div>

            {/* Feedback */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-600 mb-2">Feedback para o aluno (opcional)</label>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none h-20"
                    placeholder="Ex: Parabéns! Seu cálculo estava perfeito!"
                />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700">
                Salvar Avaliação
            </button>
        </form>
    );
};

export default EvaluationForm;
