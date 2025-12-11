import React, { useState } from 'react';
import { X, Send, Loader } from 'lucide-react';

/**
 * Modal para Professor enviar/atualizar notas de forma integrada
 * Envia dados para API /api/grades e notifica aluno em tempo real
 */
const GradeSubmissionModal = ({ studentName, studentId, projectTitle, projectId, onClose, onSubmit }) => {
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validar dados
            if (!grade || isNaN(grade) || grade < 0 || grade > 10) {
                throw new Error('Nota deve estar entre 0 e 10');
            }

            // Enviar para API
            const response = await fetch('/api/grades/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: parseInt(studentId),
                    projectId: parseInt(projectId),
                    grade: parseFloat(grade),
                    feedback: feedback,
                    teacherName: 'Professor', // Usar nome real do professor autenticado
                    projectTitle: projectTitle
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao enviar nota');
            }

            const data = await response.json();
            
            setSuccess(true);
            setTimeout(() => {
                onClose();
                if (onSubmit) onSubmit(data);
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 max-w-md text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Sucesso!</h2>
                    <p className="text-slate-600">Nota enviada para {studentName}</p>
                    <p className="text-sm text-slate-500 mt-4">O aluno será notificado em tempo real</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Atribuir Nota</h2>
                        <p className="text-indigo-100 text-sm mt-1">{studentName} • {projectTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 p-2 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {/* Nota Input */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Nota (0-10)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                placeholder="7.5"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-2xl font-bold text-center"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">/10</span>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Feedback (opcional)
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Deixe um comentário construtivo para o aluno..."
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                        />
                        <p className="text-xs text-slate-500 mt-1">{feedback.length}/500 caracteres</p>
                    </div>

                    {/* Info */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-700">
                        <p className="font-semibold mb-1">🔔 Notificação em Tempo Real</p>
                        <p>O aluno receberá uma notificação imediata assim que a nota for enviada.</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !grade}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Enviar Nota
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GradeSubmissionModal;
