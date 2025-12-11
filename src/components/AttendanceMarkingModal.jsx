import React, { useState } from 'react';
import { X, Check, AlertCircle, Loader } from 'lucide-react';

const AttendanceMarkingModal = ({
    studentName = 'João Silva',
    studentId = 101,
    className = 'Biologia - Turma A',
    classId = 1,
    teacherName = 'Prof. Ana Silva',
    onClose = () => {},
    onSubmit = () => {}
}) => {
    const [status, setStatus] = useState('presente');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/attendance/mark', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: parseInt(studentId),
                    classId: parseInt(classId),
                    className: className,
                    status: status,
                    teacherName: teacherName,
                    notes: notes || null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao marcar presença');
            }

            console.log('✅ Presença marcada:', data);
            setSuccess(true);

            // Fechar automaticamente após 2 segundos
            setTimeout(() => {
                if (onSubmit) onSubmit(data);
                onClose();
            }, 2000);

        } catch (err) {
            console.error('❌ Erro:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Mapeamento de status
    const statusInfo = {
        presente: {
            icon: '✅',
            color: 'from-green-500 to-emerald-600',
            label: 'Presente',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        falta: {
            icon: '❌',
            color: 'from-red-500 to-rose-600',
            label: 'Falta',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        atraso: {
            icon: '⏱️',
            color: 'from-yellow-500 to-amber-600',
            label: 'Atraso',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        }
    };

    const current = statusInfo[status];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all animate-scaleIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 rounded-t-3xl flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <span className="text-3xl">📋</span>
                        Marcar Presença
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                {!success ? (
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Info Banner */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                            <p className="text-xs font-bold text-blue-900 mb-1 tracking-wide">📌 AULA</p>
                            <p className="font-bold text-blue-900">{className}</p>
                            <p className="text-sm text-blue-700 mt-1">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}</p>
                        </div>

                        {/* Aluno */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p className="text-xs font-bold text-slate-600 mb-2 tracking-wide">👤 ALUNO</p>
                            <p className="font-bold text-slate-800">{studentName}</p>
                            <p className="text-sm text-slate-600">ID: {studentId}</p>
                        </div>

                        {/* Status Selection */}
                        <div>
                            <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                <AlertCircle size={18} className="text-indigo-600" />
                                Selecione o Status
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.entries(statusInfo).map(([key, info]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setStatus(key)}
                                        className={`p-4 rounded-xl border-2 font-bold text-center transition-all transform hover:scale-105 ${
                                            status === key
                                                ? `border-indigo-600 ${info.bgColor} shadow-lg`
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="text-2xl mb-2">{info.icon}</div>
                                        <div className={`text-sm ${status === key ? info.textColor : 'text-slate-600'}`}>
                                            {info.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Status Preview */}
                        <div className={`p-4 rounded-xl ${current.bgColor} border-l-4 ${current.textColor.replace('text-', 'border-')}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{current.icon}</span>
                                <p className="font-bold text-sm">{current.label}</p>
                            </div>
                            <p className="text-xs text-slate-600">
                                {status === 'presente' && '✅ Aluno compareceu à aula'}
                                {status === 'falta' && '❌ Aluno faltou à aula'}
                                {status === 'atraso' && '⏱️ Aluno chegou atrasado'}
                            </p>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                📝 Observações (opcional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value.slice(0, 200))}
                                placeholder="Ex: Aluno chegou 10 min atrasado por razões pessoais..."
                                maxLength={200}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none text-sm"
                                rows={3}
                            />
                            <p className="text-xs text-slate-500 mt-1">{notes.length}/200</p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                                <p className="text-sm text-red-700 font-semibold">❌ Erro: {error}</p>
                            </div>
                        )}

                        {/* Info */}
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg text-sm text-indigo-900">
                            <p className="font-semibold mb-1">🔔 O aluno será notificado em tempo real</p>
                            <p className="text-xs text-indigo-800">
                                A marcação de presença será sincronizada instantaneamente e o aluno receberá uma notificação.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex-1 px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                                    loading
                                        ? 'bg-slate-400 cursor-not-allowed'
                                        : `bg-gradient-to-r ${current.color} hover:shadow-lg`
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader size={18} className="animate-spin" />
                                        Marcando...
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        Marcar Presença
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    // Success State
                    <div className="p-12 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className={`p-6 rounded-full bg-gradient-to-r ${current.color} shadow-lg`}>
                                <Check size={48} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Presença Marcada! ✅</h3>
                            <p className="text-slate-600 mb-4">
                                {studentName} - <span className="font-bold text-indigo-600">{current.label}</span>
                            </p>
                            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                                <p className="text-sm text-green-800">
                                    <span className="font-bold">🔔 Notificação enviada!</span>
                                    {'\n'}O aluno foi notificado em tempo real sobre a marcação de presença.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceMarkingModal;
