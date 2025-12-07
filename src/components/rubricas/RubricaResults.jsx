import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingUp, Users } from 'lucide-react';

const RubricaResults = ({ projectId }) => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [stats, setStats] = useState({ media: 0, maiorNota: 0, menorNota: 0, totalAvaliacoes: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const listRes = await fetch(`/api/rubricas/avaliacoes/${projectId}`, { headers });
            if (listRes.ok) {
                const listData = await listRes.json();
                const avals = Array.isArray(listData?.data) ? listData.data : Array.isArray(listData) ? listData : [];
                setAvaliacoes(avals);
                if (avals.length > 0) {
                    const notas = avals
                        .map((a) => parseFloat(a.notaFinal || 0))
                        .filter((n) => !Number.isNaN(n));
                    const media = notas.length ? (notas.reduce((s, n) => s + n, 0) / notas.length).toFixed(2) : 0;
                    const maior = notas.length ? Math.max(...notas).toFixed(2) : 0;
                    const menor = notas.length ? Math.min(...notas).toFixed(2) : 0;
                    setStats({ media, maiorNota: maior, menorNota: menor, totalAvaliacoes: avals.length });
                } else {
                    setStats({ media: 0, maiorNota: 0, menorNota: 0, totalAvaliacoes: 0 });
                }
            } else {
                setAvaliacoes([]);
                setStats({ media: 0, maiorNota: 0, menorNota: 0, totalAvaliacoes: 0 });
            }
        } catch (err) {
            console.error('Erro ao buscar resultados', err);
            setAvaliacoes([]);
            setStats({ media: 0, maiorNota: 0, menorNota: 0, totalAvaliacoes: 0 });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando resultados...</div>;

    const chartData = avaliacoes.map((av) => ({
        name: av.equipe?.name || (av.equipeId ? `Equipe ${av.equipeId}` : 'Equipe'),
        nota: parseFloat(av.notaFinal || 0)
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Média da Turma</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.media}</p>
                        <p className="text-sm text-gray-400">Desempenho médio das equipes</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                        <Award className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Melhor Nota</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.maiorNota}</p>
                        <p className="text-sm text-gray-400">Melhor desempenho registrado</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-rose-100 rounded-full text-rose-600">
                        <TrendingUp className="w-8 h-8 rotate-180" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pior Nota</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.menorNota}</p>
                        <p className="text-sm text-gray-400">Ponto de atenção</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total de Avaliações</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalAvaliacoes}</p>
                        <p className="text-sm text-gray-400">Avaliações registradas</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Distribuição de Notas</h3>
                    <span className="text-sm text-gray-500">{avaliacoes.length} equipes</span>
                </div>
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} />
                            <YAxis domain={[0, 'auto']} />
                            <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                            <Bar dataKey="nota" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Detalhamento por Equipe</h3>
                        <p className="text-sm text-gray-500">Notas e comentários registrados</p>
                    </div>
                    {avaliacoes.length === 0 && <span className="text-sm text-gray-400">Nenhuma avaliação registrada</span>}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipe</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota Final</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentário</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {avaliacoes.map((av, idx) => (
                                <tr key={av.id || idx}>
                                    <td className="px-4 py-3 text-sm text-gray-700">{av.equipe?.name || (av.equipeId ? `Equipe ${av.equipeId}` : 'Equipe')}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-800">{av.notaFinal !== undefined && av.notaFinal !== null ? Number(av.notaFinal).toFixed(2) : '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xl">{av.comentario || 'Sem comentário'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RubricaResults;
