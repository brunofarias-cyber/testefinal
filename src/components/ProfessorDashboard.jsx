import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    AlertCircle,
    CheckCircle,
    Activity,
    TrendingUp,
    Zap,
    MessageSquare,
    FileText,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

const ProfessorDashboard = ({
    teacherId = "default_teacher",
    classId = "default_class"
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔄 Buscar dados da API
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                // Using the route we defined. The route /api/dashboard/stats/:teacherId/:classId
                // needs to be matched in backend or we treat parameters as optional/query
                const response = await fetch(
                    `/api/dashboard/stats/${teacherId}/${classId}`
                );

                if (!response.ok) throw new Error('Erro ao carregar dashboard');

                const dadosAPI = await response.json();
                setData(dadosAPI);
                setError(null);
            } catch (err) {
                console.error(err);
                // Fallback or Error state - for now showing error
                setError(err.message || 'Erro desconhecido');
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

        // 🔄 Auto-refresh a cada 5 minutos
        const interval = setInterval(fetchDashboard, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [teacherId, classId]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!data) return <div>Nenhum dado disponível</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* HEADER */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                    🎯 Central de Inteligência
                </h1>
                <p className="text-slate-600">
                    Visão 360° do desempenho da sua turma em tempo real
                </p>
                <p className="text-xs text-slate-400 mt-2">
                    Última atualização: {new Date(data.timestamp).toLocaleTimeString('pt-BR')}
                </p>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 1️⃣ KPIs CARDS - NÚMEROS IMPORTANTES */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Correções Pendentes */}
                <KPICard
                    titulo="Correções Pendentes"
                    valor={data.kpis.correcoesPendentes}
                    icone={<FileText size={28} />}
                    corFundo="from-blue-50 to-blue-100"
                    corTexto="text-blue-700"
                    corIcone="bg-blue-200 text-blue-600"
                    descricao="Entregas aguardando avaliação"
                    destaque={data.kpis.correcoesPendentes > 0}
                />

                {/* Card 2: Alunos em Risco */}
                <KPICard
                    titulo="Alunos em Risco"
                    valor={data.kpis.alunosEmRisco}
                    icone={<AlertCircle size={28} />}
                    corFundo="from-red-50 to-red-100"
                    corTexto="text-red-700"
                    corIcone="bg-red-200 text-red-600"
                    descricao="Média abaixo de 6.0"
                    destaque={data.kpis.alunosEmRisco > 0}
                    alerta={true}
                />

                {/* Card 3: Projetos Concluídos */}
                <KPICard
                    titulo="Projetos Concluídos"
                    valor={`${data.kpis.projetosConcluidos}%`}
                    icone={<CheckCircle size={28} />}
                    corFundo="from-green-50 to-green-100"
                    corTexto="text-green-700"
                    corIcone="bg-green-200 text-green-600"
                    descricao="Progresso geral da turma"
                    destaque={data.kpis.projetosConcluidos === 100}
                />
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 2️⃣ GRÁFICO EVOLUTIVO - MÉDIA DE NOTAS */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-slate-100">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 mb-2">
                        <TrendingUp className="text-indigo-600" size={28} />
                        Evolução das Notas
                    </h2>
                    <p className="text-slate-500">
                        Acompanhe a tendência de desempenho da turma nos últimos 30 dias
                    </p>
                </div>

                {data.graficoEvolucao.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                            data={data.graficoEvolucao}
                            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="data"
                                stroke="#64748b"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#64748b"
                                tick={{ fontSize: 12 }}
                                domain={[0, 10]}
                                label={{ value: 'Média', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                                formatter={(value) => [
                                    `${Number(value).toFixed(1)}`,
                                    'Média',
                                ]}
                                labelFormatter={(label) => `Data: ${label}`}
                            />
                            <Legend />

                            {/* Linha principal: Média de Notas */}
                            <Line
                                type="monotone"
                                dataKey="mediaNotas"
                                stroke="#4f46e5"
                                strokeWidth={3}
                                dot={{ fill: '#4f46e5', r: 6 }}
                                activeDot={{ r: 8 }}
                                name="Média de Notas"
                            />

                            {/* Linha secundária: Qtd de alunos (se quiser visualizar participação) */}
                            <Line
                                type="monotone"
                                dataKey="qtdAlunos"
                                stroke="#10b981"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ fill: '#10b981', r: 4 }}
                                name="Qtd. de Alunos"
                                yAxisId="right"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl">
                        <p className="text-slate-400">Dados não disponíveis ainda</p>
                    </div>
                )}

                {/* Insights abaixo do gráfico */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InsightBox
                        label="Média Atual"
                        valor={data.graficoEvolucao.length > 0
                            ? Number(data.graficoEvolucao[data.graficoEvolucao.length - 1].mediaNotas).toFixed(1)
                            : '-'}
                        cor="indigo"
                    />
                    <InsightBox
                        label="Melhor Desempenho"
                        valor={data.graficoEvolucao.length > 0
                            ? Math.max(...data.graficoEvolucao.map(d => d.mediaNotas)).toFixed(1)
                            : '-'}
                        cor="green"
                    />
                    <InsightBox
                        label="Total de Avaliações"
                        valor={data.graficoEvolucao.length.toString()}
                        cor="blue"
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* 3️⃣ TIMELINE - ATIVIDADES RECENTES */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 mb-6">
                    <Activity className="text-purple-600" size={28} />
                    Atividades Recentes
                </h2>

                {data.timeline.length > 0 ? (
                    <div className="space-y-4">
                        {data.timeline.map((atividade, idx) => (
                            <TimelineItem
                                key={atividade.id}
                                atividade={atividade}
                                isFirst={idx === 0}
                                isLast={idx === data.timeline.length - 1}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-slate-400">
                        Nenhuma atividade ainda
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════

const KPICard = ({
    titulo,
    valor,
    icone,
    corFundo,
    corTexto,
    corIcone,
    descricao,
    destaque,
    alerta,
}) => (
    <div
        className={`bg-gradient-to-br ${corFundo} rounded-2xl p-6 border-2 ${destaque ? 'border-yellow-400 shadow-lg' : 'border-slate-100'
            } transition-all hover:shadow-lg hover:scale-105 ${alerta ? 'ring-2 ring-red-300' : ''
            }`}
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`${corIcone} p-3 rounded-xl`}>{icone}</div>
            {destaque && <span className="text-sm font-bold text-yellow-600">⭐ Destaque</span>}
        </div>

        <h3 className={`text-sm font-bold ${corTexto} uppercase tracking-wider mb-2`}>
            {titulo}
        </h3>

        <p className={`text-4xl font-extrabold ${corTexto} mb-2`}>{valor}</p>

        <p className="text-sm text-slate-600">{descricao}</p>
    </div>
);

const TimelineItem = ({
    atividade,
    isFirst,
    isLast,
}) => {
    const getIconeECor = (tipo) => {
        switch (tipo) {
            case 'entrega':
                return {
                    icone: <FileText size={20} />,
                    cor: 'bg-blue-100 text-blue-600',
                    label: '📤',
                };
            case 'comentario':
                return {
                    icone: <MessageSquare size={20} />,
                    cor: 'bg-green-100 text-green-600',
                    label: '💬',
                };
            case 'avaliacao':
                return {
                    icone: <CheckCircle size={20} />,
                    cor: 'bg-purple-100 text-purple-600',
                    label: '✅',
                };
            default:
                return { icone: <Activity size={20} />, cor: 'bg-slate-100', label: '•' };
        }
    };

    const { icone, cor } = getIconeECor(atividade.tipo);

    return (
        <div className="flex gap-4 pb-4">
            {/* Linha vertical */}
            <div className="flex flex-col items-center">
                <div className={`${cor} p-2 rounded-full`}>{icone}</div>
                {!isLast && <div className="w-1 h-12 bg-slate-200 mt-2" />}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pt-1">
                <p className="font-bold text-slate-800">{atividade.acao}</p>
                <p className="text-sm text-slate-600 mt-1">{atividade.descricao}</p>
                <p className="text-xs text-slate-400 mt-2">
                    {formatarDataRelativa(new Date(atividade.data))}
                </p>
            </div>
        </div>
    );
};

const InsightBox = ({ label, valor, cor }) => {
    const corPalete = {
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        green: 'bg-green-50 text-green-700 border-green-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    return (
        <div className={`${corPalete[cor]} border rounded-lg p-3 text-center`}>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">
                {label}
            </p>
            <p className="text-2xl font-extrabold">{valor}</p>
        </div>
    );
};

const LoadingState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
            <Zap className="animate-spin text-indigo-600 mx-auto mb-4" size={40} />
            <p className="text-slate-600 font-semibold">Carregando inteligência...</p>
        </div>
    </div>
);

const ErrorState = ({ message }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border-l-4 border-red-500">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Erro ao carregar</h2>
            <p className="text-slate-600 mb-4">{message}</p>
            <button
                onClick={() => window.location.reload()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
            >
                Tentar novamente
            </button>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ═══════════════════════════════════════════════════════════════════════

function formatarDataRelativa(data) {
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(diferenca / 3600000);
    const dias = Math.floor(diferenca / 86400000);

    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `${minutos}m atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 30) return `${dias}d atrás`;

    return data.toLocaleDateString('pt-BR');
}

export default ProfessorDashboard;
