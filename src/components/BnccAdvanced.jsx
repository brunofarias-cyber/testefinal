import React, { useState, useEffect } from 'react';
import { Send, AlertCircle, CheckCircle, Share2, Bell } from 'lucide-react';

// ==========================================
// 6. CoverageDashboard
// ==========================================
export const CoverageDashboard = ({ classId, year }) => {
    const [coverage, setCoverage] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoverage();
    }, [classId, year]);

    const fetchCoverage = async () => {
        try {
            const res = await fetch(`/api/bncc-advanced/coverage/by-year/${classId}/${year}`);
            const json = await res.json();
            setCoverage(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Cobertura BNCC - {year}º Ano</h3>
            <div className="space-y-4">
                {coverage.map(c => (
                    <div key={c.discipline}>
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-slate-600">{c.discipline}</span>
                            <span className="text-sm font-bold text-indigo-600">{c.coveragePercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                            <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${c.coveragePercent}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {c.evaluated}/{c.total} habilidades avaliadas
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 7. ClassComparison
// ==========================================
export const ClassComparison = ({ schoolId, year }) => {
    const [comparison, setComparison] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComparison();
    }, [schoolId, year]);

    const fetchComparison = async () => {
        try {
            const res = await fetch(`/api/bncc-advanced/compare-classes/${schoolId}/${year}`);
            const json = await res.json();
            setComparison(json.data.sort((a, b) => b.averagePoints - a.averagePoints));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Comparação Entre Turmas</h3>
            <div className="space-y-3">
                {comparison.map((c, idx) => (
                    <div key={c.classId} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-800">#{idx + 1} {c.className}</p>
                                <p className="text-sm text-slate-600">{c.skillsDeveloped} habilidades desenvolvidas</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-indigo-600">{c.averagePoints}/10</p>
                                <p className="text-xs text-slate-500">média</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 8. SuggestionsPanel
// ==========================================
export const SuggestionsPanel = ({ studentId, projectId }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuggestions();
    }, [studentId, projectId]);

    const fetchSuggestions = async () => {
        try {
            const res = await fetch(`/api/bncc-advanced/suggestions/${studentId}/${projectId}`, {
                method: 'POST',
            });
            const json = await res.json();
            setSuggestions(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (suggestions.length === 0) return <p className="text-green-600">Sem sugestões - aluno está indo bem!</p>;

    return (
        <div className="space-y-3">
            {suggestions.map((s, idx) => (
                <div key={idx} className={`rounded-lg border p-4 ${s.type === 'warning' ? 'bg-red-50 border-red-200' :
                        s.type === 'success' ? 'bg-green-50 border-green-200' :
                            'bg-blue-50 border-blue-200'
                    }`}>
                    <div className="flex items-start gap-3">
                        {s.type === 'warning' && <AlertCircle size={20} className="text-red-600" />}
                        {s.type === 'success' && <CheckCircle size={20} className="text-green-600" />}
                        {s.type === 'info' && <AlertCircle size={20} className="text-blue-600" />}
                        <div className="flex-1">
                            <p className="font-bold text-slate-800">{s.title}</p>
                            <p className="text-sm text-slate-600 mt-1">{s.description}</p>
                            <p className="text-xs text-slate-500 mt-2 italic">{s.recommendation}</p>
                        </div>
                        {s.priority === 'high' && (
                            <span className="text-xs font-bold bg-red-200 text-red-700 px-2 py-1 rounded">
                                URGENTE
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ==========================================
// 9. ShareRelatorio
// ==========================================
export const ShareRelatorio = ({ projectId, studentId }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/bncc-advanced/share/${projectId}/${studentId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipientEmail: email, recipientName: name }),
            });
            if (res.ok) {
                setSent(true);
                setEmail('');
                setName('');
                setTimeout(() => setSent(false), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleShare} className="bg-white rounded-lg border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Share2 size={18} />
                Compartilhar Relatório
            </h3>

            {sent && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm font-bold">
                    ✅ Relatório enviado com sucesso!
                </div>
            )}

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Nome do destinatário"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-200 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-200 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 disabled:bg-slate-300 flex items-center justify-center gap-2"
                >
                    <Send size={16} />
                    {loading ? 'Enviando...' : 'Enviar Relatório'}
                </button>
            </div>
        </form>
    );
};

// ==========================================
// 10. NotificationCenter
// ==========================================
export const NotificationCenter = ({ studentId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, [studentId]);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`/api/bncc-advanced/notifications/${studentId}`);
            const json = await res.json();
            const list = Array.isArray(json?.data) ? json.data : [];
            setNotifications(list);
        } catch (error) {
            console.error(error);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await fetch(`/api/bncc-advanced/notifications/${id}/read`, { method: 'POST' });
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p>Carregando...</p>;

    const unread = Array.isArray(notifications) ? notifications.filter(n => !n.read) : [];

    return (
        <div className="space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell size={18} />
                Notificações ({unread.length} novas)
            </h3>

            {notifications.length === 0 ? (
                <p className="text-slate-500">Sem notificações</p>
            ) : (
                <div className="space-y-2">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            className={`p-3 rounded-lg border ${n.read
                                    ? 'bg-white border-slate-200'
                                    : 'bg-indigo-50 border-indigo-200'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className={`text-sm ${n.read ? 'text-slate-600' : 'font-bold text-slate-800'}`}>
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(n.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                {!n.read && (
                                    <button
                                        onClick={() => handleMarkAsRead(n.id)}
                                        className="text-xs font-bold bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                                    >
                                        ✓
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CoverageDashboard;
