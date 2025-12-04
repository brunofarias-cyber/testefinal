import React, { useState, useEffect } from 'react';
import { Zap, FileText, AlertCircle, CheckCircle, Send, Upload } from 'lucide-react';

export const SmartEvaluationTab = ({ projectId, studentId, skillCode }) => {
    const [evidence, setEvidence] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [manualLevel, setManualLevel] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [references, setReferences] = useState([]);
    const [showTheory, setShowTheory] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);

    useEffect(() => {
        fetchReferences();
    }, []);

    const fetchReferences = async () => {
        try {
            const res = await fetch('/api/references');
            const data = await res.json();
            setReferences(data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUploadPdf = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('pdf', file);

        setLoading(true);
        try {
            const res = await fetch('/api/references/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            alert('PDF processado com sucesso!');
            fetchReferences();
        } catch (error) {
            alert('Erro ao processar PDF');
        } finally {
            setLoading(false);
        }
    };

    const handleGetAISuggestion = async () => {
        if (!evidence.trim()) {
            alert('Por favor, adicione uma evidência');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/evaluate-with-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    projectId,
                    skillCode,
                    studentEvidence: evidence,
                    rubric: {}, // Será preenchido do banco
                }),
            });
            const data = await res.json();
            setAiSuggestion(data.aiAnalysis);
        } catch (error) {
            alert('Erro ao obter sugestão IA');
        } finally {
            setLoading(false);
        }
    };

    const handleCompareEvaluations = async () => {
        if (!manualLevel) {
            alert('Por favor, selecione um nível manual');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/compare-evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    projectId,
                    skillCode,
                    manualLevel,
                }),
            });
            const data = await res.json();
            setComparison(data.comparison);
        } catch (error) {
            alert('Erro ao comparar avaliações');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateFeedback = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/generate-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, projectId, skillCode }),
            });
            const data = await res.json();
            setFeedback(data.feedback);
        } catch (error) {
            alert('Erro ao gerar feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Banner IA */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <Zap size={24} /> Avaliação Inteligente com IA
                        </h3>
                        <p className="text-purple-100">
                            Baseada em referências teóricas de metodologias ativas (Bacich & Moran)
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                        <p className="text-xs font-bold">BETA</p>
                    </div>
                </div>
            </div>

            {/* Upload de PDFs */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-indigo-600" />
                    Base de Conhecimento Teórico
                </h3>

                {references.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                        <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                        <p className="text-slate-600 font-semibold mb-2">
                            Nenhuma referência carregada
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                            Envie PDFs com referências teóricas para alimentar a IA
                        </p>
                        <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer inline-block hover:bg-indigo-700">
                            Selecionar PDF
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleUploadPdf}
                                disabled={loading}
                                className="hidden"
                            />
                        </label>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {references.map(ref => (
                            <div
                                key={ref.id}
                                className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                                <p className="font-bold text-slate-800">{ref.title}</p>
                                <p className="text-xs text-slate-500">
                                    {ref.authors} ({ref.publicationYear})
                                </p>
                                <p className="text-xs text-indigo-600 mt-1">✓ Processado</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Entrada de Evidência */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">
                    Evidência do Aluno
                </h3>
                <textarea
                    value={evidence}
                    onChange={e => setEvidence(e.target.value)}
                    placeholder="Cole a descrição da atividade, projeto ou demonstração de competência..."
                    className="w-full h-40 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
                <button
                    onClick={handleGetAISuggestion}
                    disabled={loading || !evidence.trim()}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 flex items-center gap-2"
                >
                    <Zap size={18} />
                    {loading ? 'Analisando...' : 'Obter Sugestão IA'}
                </button>
            </div>

            {/* Sugestão IA */}
            {aiSuggestion && (
                <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6 space-y-4">
                    <h3 className="font-bold text-lg text-purple-900 flex items-center gap-2">
                        <Zap size={20} className="text-purple-600" />
                        Análise da IA
                    </h3>

                    {/* Nível Recomendado */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <p className="text-sm text-slate-600 mb-2">Nível Recomendado</p>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <div
                                        key={level}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${level <= aiSuggestion['Nível Recomendado']
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-slate-200 text-slate-400'
                                            }`}
                                    >
                                        {level}
                                    </div>
                                ))}
                            </div>
                            <span className="font-bold text-xl text-purple-600">
                                {aiSuggestion['Nível Recomendado']}/5
                            </span>
                        </div>
                    </div>

                    {/* Análise Teórica */}
                    <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <p className="text-sm font-bold text-slate-800 mb-2">
                            Análise Teórica
                        </p>
                        <p className="text-slate-700 text-sm leading-relaxed">
                            {aiSuggestion['Análise Teórica']}
                        </p>
                    </div>

                    {/* Pontos Fortes */}
                    <div className="bg-white rounded-xl p-4 border border-green-200">
                        <p className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                            <CheckCircle size={16} /> Pontos Fortes
                        </p>
                        <p className="text-slate-700 text-sm">
                            {aiSuggestion['Pontos Fortes']}
                        </p>
                    </div>

                    {/* Áreas de Melhoria */}
                    <div className="bg-white rounded-xl p-4 border border-orange-200">
                        <p className="text-sm font-bold text-orange-900 mb-2 flex items-center gap-2">
                            <AlertCircle size={16} /> Áreas de Melhoria
                        </p>
                        <p className="text-slate-700 text-sm">
                            {aiSuggestion['Áreas de Melhoria']}
                        </p>
                    </div>

                    {/* Próximos Passos */}
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                        <p className="text-sm font-bold text-blue-900 mb-2">Próximos Passos</p>
                        <p className="text-slate-700 text-sm">
                            {aiSuggestion['Próximos Passos']}
                        </p>
                    </div>

                    <div className="text-xs text-slate-500">
                        Confiança: {aiSuggestion['Confiança']}/10
                    </div>
                </div>
            )}

            {/* Comparação Manual vs IA */}
            {aiSuggestion && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h3 className="font-bold text-lg text-slate-800">
                        Comparar com Avaliação Manual
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Seu Nível
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setManualLevel(level)}
                                        className={`w-10 h-10 rounded-lg font-bold transition ${manualLevel === level
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Sugestão IA
                            </label>
                            <div className="flex gap-1 items-center">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <div
                                        key={level}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${level <= aiSuggestion['Nível Recomendado']
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-slate-200 text-slate-400'
                                            }`}
                                    >
                                        {level}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCompareEvaluations}
                        disabled={!manualLevel || loading}
                        className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 disabled:bg-slate-100"
                    >
                        Comparar Avaliações
                    </button>

                    {comparison && (
                        <div className={`p-4 rounded-xl border-2 ${comparison.difference === 0
                                ? 'bg-green-50 border-green-200'
                                : comparison.difference <= 1
                                    ? 'bg-yellow-50 border-yellow-200'
                                    : 'bg-red-50 border-red-200'
                            }`}>
                            <p className="font-bold text-slate-800 mb-2">
                                {comparison.feedback}
                            </p>
                            <p className="text-sm text-slate-700">
                                {comparison.recommendation}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Gerar Feedback */}
            {aiSuggestion && (
                <button
                    onClick={handleGenerateFeedback}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-slate-300 flex items-center justify-center gap-2"
                >
                    <Send size={18} />
                    {loading ? 'Gerando...' : 'Gerar Feedback para Aluno'}
                </button>
            )}

            {feedback && (
                <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
                    <p className="font-bold text-green-900 mb-3">Feedback Gerado</p>
                    <p className="text-slate-700 leading-relaxed">{feedback}</p>
                </div>
            )}
        </div>
    );
};
