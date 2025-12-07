import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
            const headers = { 'Authorization': `Bearer ${token}` };

            // Buscar Stats
            // Note: RubricaId 1 is hardcoded for demo, normally would come from selected rubric
            const statsRes = await fetch(`/api/rubricas-v2/${projectId}/1/estatisticas`, { headers });
            const statsData = await statsRes.json();

            // Buscar Avaliações
            const listRes = await fetch(`/api/rubricas-v2/${projectId}/avaliacoes`, { headers });
            const listData = await listRes.json();

            if (statsData.sucesso) setStats(statsData.dados);
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
                        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                        const listRes = await fetch(`/api/rubricas/avaliacoes/${projectId}`, { headers });
                        if (listRes.ok) {
                            const listData = await listRes.json();
                            const avals = Array.isArray(listData?.data) ? listData.data : (Array.isArray(listData) ? listData : []);
                            setAvaliacoes(avals);
                            if (avals.length > 0) {
                                const notas = avals.map(a => parseFloat(a.notaFinal || 0)).filter(n => !isNaN(n));
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

                const chartData = avaliacoes.map(av => ({
                    name: av.equipe?.name || `Equipe ${av.equipeId}`,
                    nota: parseFloat(av.notaFinal || 0)
                }));

                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Média da Turma</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.media}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-full text-green-600">
                                    <Award className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Maior Nota</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.maiorNota}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Avaliações</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalAvaliacoes}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Desempenho por Equipe</h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 10]} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey="nota" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Nota Final" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Equipe</th>
                                        <th className="p-4 font-semibold">Avaliador</th>
                                        <th className="p-4 font-semibold">Data</th>
                                        <th className="p-4 font-semibold text-right">Nota Final</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {avaliacoes.map((av) => (
                                        <tr key={av.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium text-gray-900">{av.equipe?.name || 'Equipe ' + av.equipeId}</td>
                                            <td className="p-4 text-gray-600">{av.criadoPor?.name || 'Professor'}</td>
                                            <td className="p-4 text-gray-500">{av.avaliadaEm ? new Date(av.avaliadaEm).toLocaleDateString() : '-'}</td>
                                            <td className="p-4 text-right font-bold text-gray-800">
                                                <span className={`px-2 py-1 rounded ${av.notaFinal >= 7 ? 'bg-green-100 text-green-700' :
                                                    av.notaFinal >= 5 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {av.notaFinal}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            };

            export default RubricaResults;
