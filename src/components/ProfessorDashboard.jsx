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
    TrendingDown,
    Zap,
    MessageSquare,
    FileText,
    ArrowRight,
    MoreVertical,
    Moon,
    Sun,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL COM TODAS AS MELHORIAS
// ═══════════════════════════════════════════════════════════════════════

const ProfessorDashboard = ({
    teacherId = "default_teacher",
    classId = "default_class",
    onNavigateTo = () => {}
}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [lastKeyPressed, setLastKeyPressed] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);

    // ⌨️ Atalhos de teclado com feedback visual (Melhoria #8)
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.matches('input, textarea')) return;

            const key = e.key.toUpperCase();
            if (['R', 'M', 'P'].includes(key)) {
                setLastKeyPressed(key);
                setTimeout(() => setLastKeyPressed(null), 200);
                
                const map = { 'R': 'reports', 'M': 'messages', 'P': 'planning' };
                onNavigateTo(map[key]);
                
                // Toast notification (Melhoria #7)
                const labels = { 'R': 'Relatórios', 'M': 'Mensagens', 'P': 'Projetos' };
                showToast(`Navegando para ${labels[key]}...`, 'success');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onNavigateTo]);

    // 🔄 Buscar dados da API
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `/api/dashboard/stats/${teacherId}/${classId}`
                );

                if (!response.ok) throw new Error('Erro ao carregar dashboard');

                const dadosAPI = await response.json();
                setData(dadosAPI);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Erro desconhecido');
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();

        const interval = setInterval(fetchDashboard, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [teacherId, classId]);

    const showToast = (mensagem, tipo = 'success') => {
        setToast({ mensagem, tipo });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) return <LoadingState darkMode={darkMode} />;
    if (error) return <ErrorState message={error} darkMode={darkMode} />;
    if (!data) return <div>Nenhum dado disponível</div>;

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'} p-8 transition-colors duration-300`}>
            {/* Feedback visual do atalho (Melhoria #8) */}
            {lastKeyPressed && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 
                            bg-indigo-600 text-white px-4 py-2 rounded-lg
                            animate-in fade-in duration-200 z-50 font-bold">
                    ⌨️ Atalho: {lastKeyPressed}
                </div>
            )}

            {/* Toast Notification (Melhoria #7) */}
            {toast && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg
                        animate-in slide-in-from-right-4 duration-300 z-50 font-semibold text-sm
                        ${toast.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'}
                        text-white`}>
                    {toast.mensagem}
                </div>
            )}

            {/* HEADER */}
            <div className={`mb-8 flex justify-between items-start`}>
                <div>
                    <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                        🎯 Central de Inteligência
                    </h1>
                    <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                        Visão 360° do desempenho da sua turma em tempo real
                    </p>
                    <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'} px-3 py-1.5 rounded-lg w-fit mt-4`}>
                        <span className="font-mono">⌨️ Atalhos:</span>
                        <kbd className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'} px-1.5 py-0.5 rounded border`}>R</kbd>
                        <span>Relatórios</span>
                        <kbd className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'} px-1.5 py-0.5 rounded border`}>M</kbd>
                        <span>Mensagens</span>
                        <kbd className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-300'} px-1.5 py-0.5 rounded border`}>P</kbd>
                        <span>Projetos</span>
                    </div>
                </div>
                
                {/* Dark Mode Toggle (Melhoria #10) */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-200 text-slate-600'} hover:scale-110`}
                    title={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
                >
                    {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
            </div>

            {/* KPIs CARDS COM TODAS AS MELHORIAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Correções Pendentes */}
                <KPICard
                    titulo="Correções Pendentes"
                    valor={data?.kpis?.correcoesPendentes || 0}
                    icone={<FileText size={28} />}
                    corFundo="from-blue-50 to-blue-100"
                    corTexto="text-blue-700"
                    corIcone="bg-blue-200 text-blue-600"
                    descricao="Entregas aguardando avaliação"
                    destaque={(data?.kpis?.correcoesPendentes || 0) > 0}
                    trending={+5}
                    onClick={() => onNavigateTo('reports')}
                    acao="Ir para Relatórios"
                    darkMode={darkMode}
                    onMenu={() => setOpenMenu(openMenu === 'correções' ? null : 'correções')}
                    menuOpen={openMenu === 'correções'}
                />

                {/* Card 2: Alunos em Risco */}
                <KPICard
                    titulo="Alunos em Risco"
                    valor={data?.kpis?.alunosEmRisco || 0}
                    icone={<AlertCircle size={28} />}
                    corFundo="from-red-50 to-red-100"
                    corTexto="text-red-700"
                    corIcone="bg-red-200 text-red-600"
                    descricao="Média abaixo de 6.0"
                    destaque={(data?.kpis?.alunosEmRisco || 0) > 0}
                    alerta={true}
                    trending={-2}
                    onClick={() => onNavigateTo('messages')}
                    acao="Enviar Mensagem"
                    darkMode={darkMode}
                    onMenu={() => setOpenMenu(openMenu === 'risco' ? null : 'risco')}
                    menuOpen={openMenu === 'risco'}
                />

                {/* Card 3: Projetos Concluídos com Progresso Circular (Melhoria #2) */}
                <KPICard
                    titulo="Projetos Concluídos"
                    valor={`${data?.kpis?.projetosConcluidos || 0}%`}
                    valorNumerico={data?.kpis?.projetosConcluidos || 0}
                    showCircleProgress={true}
                    icone={<CheckCircle size={28} />}
                    corFundo="from-green-50 to-green-100"
                    corTexto="text-green-700"
                    corIcone="bg-green-200 text-green-600"
                    descricao="Progresso geral da turma"
                    destaque={(data?.kpis?.projetosConcluidos || 0) === 100}
                    trending={+8}
                    onClick={() => onNavigateTo('planning')}
                    acao="Ver Projetos"
                    darkMode={darkMode}
                    onMenu={() => setOpenMenu(openMenu === 'projetos' ? null : 'projetos')}
                    menuOpen={openMenu === 'projetos'}
                />
            </div>

            {/* GRÁFICO EVOLUTIVO */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-lg p-8 mb-8 border ${darkMode ? 'border-slate-700' : 'border-slate-100'} transition-colors`}>
                <div className="mb-6">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} flex items-center gap-3 mb-2`}>
                        <TrendingUp className="text-indigo-600" size={28} />
                        Evolução das Notas
                    </h2>
                    <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>
                        Acompanhe a tendência de desempenho da turma nos últimos 30 dias
                    </p>
                </div>

                {data?.graficoEvolucao?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart
                            data={data.graficoEvolucao}
                            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#475569' : '#e2e8f0'} />
                            <XAxis
                                dataKey="data"
                                stroke={darkMode ? '#94a3b8' : '#64748b'}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                stroke={darkMode ? '#94a3b8' : '#64748b'}
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

                            <Line
                                type="monotone"
                                dataKey="mediaNotas"
                                stroke="#4f46e5"
                                strokeWidth={3}
                                dot={{ fill: '#4f46e5', r: 6 }}
                                activeDot={{ r: 8 }}
                                name="Média de Notas"
                            />

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
                    <div className={`h-64 flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-slate-50'} rounded-xl`}>
                        <p className={darkMode ? 'text-slate-400' : 'text-slate-400'}>Dados não disponíveis ainda</p>
                    </div>
                )}

                {/* Insights */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InsightBox
                        label="Média Atual"
                        valor={data?.graficoEvolucao?.length > 0
                            ? Number(data.graficoEvolucao[data.graficoEvolucao.length - 1]?.mediaNotas || 0).toFixed(1)
                            : '-'}
                        cor="indigo"
                        darkMode={darkMode}
                    />
                    <InsightBox
                        label="Melhor Desempenho"
                        valor={data?.graficoEvolucao?.length > 0
                            ? Math.max(...(data.graficoEvolucao?.map(d => d?.mediaNotas || 0) || [0])).toFixed(1)
                            : '-'}
                        cor="green"
                        darkMode={darkMode}
                    />
                    <InsightBox
                        label="Total de Avaliações"
                        valor={(data?.graficoEvolucao?.length || 0).toString()}
                        cor="blue"
                        darkMode={darkMode}
                    />
                </div>
            </div>

            {/* TIMELINE */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-lg p-8 border ${darkMode ? 'border-slate-700' : 'border-slate-100'} transition-colors`}>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} flex items-center gap-3 mb-6`}>
                    <Activity className="text-purple-600" size={28} />
                    Atividades Recentes
                </h2>

                {data?.timeline?.length > 0 ? (
                    <div className="space-y-4">
                        {data.timeline.map((atividade, idx) => (
                            <TimelineItem
                                key={atividade.id}
                                atividade={atividade}
                                isFirst={idx === 0}
                                isLast={idx === data.timeline.length - 1}
                                darkMode={darkMode}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={`py-8 text-center ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        Nenhuma atividade ainda
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// KPI CARD COM TODAS AS MELHORIAS
// ═══════════════════════════════════════════════════════════════════════

const KPICard = ({
    titulo,
    valor,
    valorNumerico,
    showCircleProgress,
    icone,
    corFundo,
    corTexto,
    corIcone,
    descricao,
    destaque,
    alerta,
    trending,
    onClick,
    acao,
    darkMode,
    onMenu,
    menuOpen
}) => {
    const menuItems = [
        { label: '📊 Ver Detalhes', action: () => {} },
        { label: '📧 Enviar Relatório', action: () => {} },
        { label: '⭐ Fixar Card', action: () => {} },
    ];

    return (
        <button
            onClick={onClick}
            className={`w-full text-left rounded-2xl p-6 border-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4
                ${destaque ? 'border-yellow-400 shadow-lg' : darkMode ? 'border-slate-700' : 'border-slate-100'}
                hover:shadow-2xl hover:scale-105 hover:-translate-y-1
                ${alerta ? 'ring-2 ring-red-300' : ''}
                cursor-pointer group relative
                ${darkMode ? 'bg-slate-800' : 'bg-gradient-to-br ' + corFundo}`}
        >
            {/* Menu (Melhoria #9) */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <button 
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMenu();
                    }}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-white/50'}`}
                >
                    <MoreVertical size={18} className={corTexto} />
                </button>
                
                {menuOpen && (
                    <div className={`absolute top-10 right-0 rounded-lg shadow-xl border py-2 z-50 min-w-48
                        ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                        {menuItems.map((item, idx) => (
                            <button
                                type="button"
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    item.action();
                                    onMenu();
                                }}
                                className={`w-full px-4 py-2 text-left text-sm transition-colors
                                    ${darkMode ? 'hover:bg-slate-600 text-slate-100' : 'hover:bg-slate-50 text-slate-900'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className={`${corIcone} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    {icone}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-white/80 text-slate-600'}`}>
                        {acao}
                    </span>
                    <ArrowRight size={16} className={corTexto} />
                </div>
                {destaque && (
                    <div className="group relative">
                        <span className="text-sm font-bold text-yellow-600 cursor-help">⭐</span>
                        <div className={`hidden group-hover:block absolute bottom-full right-0 mb-2 
                                text-xs px-3 py-2 rounded-lg whitespace-nowrap
                                pointer-events-none z-10 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-900 text-white'}`}>
                            Métrica crítica
                            <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-slate-900 rotate-45"></div>
                        </div>
                    </div>
                )}
            </div>

            <h3 className={`text-sm font-bold ${corTexto} uppercase tracking-wider mb-2`}>
                {titulo}
            </h3>

            {/* Progresso Circular (Melhoria #2) */}
            {showCircleProgress && valorNumerico ? (
                <div className="flex items-center gap-4 mb-4">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke={darkMode ? '#475569' : '#e5e7eb'} strokeWidth="8" />
                        <circle 
                            cx="50" cy="50" r="45" 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="8"
                            strokeDasharray={`${valorNumerico * 2.83} 283`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                        />
                        <text 
                            x="50" y="55" 
                            textAnchor="middle" 
                            className="text-xl font-bold fill-green-700"
                        >
                            {valorNumerico}%
                        </text>
                    </svg>
                    <div>
                        <p className={`text-4xl font-extrabold ${corTexto}`}>{valor}</p>
                    </div>
                </div>
            ) : (
                <p className={`text-4xl font-extrabold ${corTexto} mb-2`}>{valor}</p>
            )}

            {/* Comparação Período (Melhoria #4) */}
            <div className="flex justify-between items-end">
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{descricao}</p>
                {trending !== undefined && (
                    <div className="flex items-center gap-1 text-xs font-bold">
                        {trending > 0 ? (
                            <>
                                <TrendingUp size={14} className="text-green-600" />
                                <span className="text-green-600">+{trending}%</span>
                            </>
                        ) : trending < 0 ? (
                            <>
                                <TrendingDown size={14} className="text-red-600" />
                                <span className="text-red-600">{trending}%</span>
                            </>
                        ) : (
                            <span className="text-slate-500">=</span>
                        )}
                    </div>
                )}
            </div>

            {/* Mini Sparkline (Melhoria #5) */}
            <div className="mt-4 h-6 bg-white/20 rounded-lg p-1 hidden sm:block">
                <svg viewBox="0 0 100 20" className="w-full h-full">
                    <polyline 
                        points="0,15 15,12 30,14 45,10 60,8 75,11 90,6 100,5" 
                        fill="none" 
                        stroke={corTexto === 'text-green-700' ? '#10b981' : corTexto === 'text-red-700' ? '#ef4444' : '#4f46e5'} 
                        strokeWidth="2"
                        opacity="0.7"
                    />
                </svg>
            </div>
        </button>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// TIMELINE ITEM
// ═══════════════════════════════════════════════════════════════════════

const TimelineItem = ({
    atividade,
    isFirst,
    isLast,
    darkMode
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
        <div className="flex gap-4 pb-4 animate-in fade-in slide-in-from-left-2 duration-500">
            <div className="flex flex-col items-center">
                <div className={`${cor} p-2 rounded-full`}>{icone}</div>
                {!isLast && <div className={`w-1 h-12 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} mt-2`} />}
            </div>

            <div className="flex-1 pt-1">
                <p className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{atividade.acao}</p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{atividade.descricao}</p>
                <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    {formatarDataRelativa(new Date(atividade.data))}
                </p>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// INSIGHT BOX
// ═══════════════════════════════════════════════════════════════════════

const InsightBox = ({ label, valor, cor, darkMode }) => {
    const corPalete = {
        indigo: darkMode ? 'bg-slate-700 text-indigo-400 border-slate-600' : 'bg-indigo-50 text-indigo-700 border-indigo-200',
        green: darkMode ? 'bg-slate-700 text-green-400 border-slate-600' : 'bg-green-50 text-green-700 border-green-200',
        blue: darkMode ? 'bg-slate-700 text-blue-400 border-slate-600' : 'bg-blue-50 text-blue-700 border-blue-200',
    };

    return (
        <div className={`${corPalete[cor]} border rounded-lg p-3 text-center transition-colors`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'opacity-60' : 'opacity-70'}`}>
                {label}
            </p>
            <p className="text-2xl font-extrabold">{valor}</p>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════
// LOADING STATE COM SKELETON (Melhoria #6)
// ═══════════════════════════════════════════════════════════════════════

const LoadingState = ({ darkMode }) => (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'} p-8`}>
        <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className={`h-10 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded-lg w-1/3 mb-4 animate-pulse`}></div>
                <div className={`h-5 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'} rounded w-1/2 animate-pulse`}></div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[...Array(3)].map((_, i) => (
                    <div 
                        key={i}
                        className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 border-2 ${darkMode ? 'border-slate-700' : 'border-slate-100'} animate-pulse`}
                    >
                        <div className={`w-12 h-12 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-xl mb-4`}></div>
                        <div className={`h-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded mb-3 w-3/4`}></div>
                        <div className={`h-8 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded w-full`}></div>
                    </div>
                ))}
            </div>

            {/* Chart Skeleton */}
            <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl p-8 border ${darkMode ? 'border-slate-700' : 'border-slate-100'} animate-pulse`}>
                <div className={`h-64 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-lg`}></div>
            </div>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════
// ERROR STATE
// ═══════════════════════════════════════════════════════════════════════

const ErrorState = ({ message, darkMode }) => (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'} flex items-center justify-center p-6`}>
        <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl shadow-lg p-8 max-w-md text-center border-l-4 border-red-500`}>
            <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} mb-2`}>Erro ao carregar</h2>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>{message}</p>
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

    if (minutos < 1) return 'agora mesmo';
    if (minutos < 60) return `${minutos}min atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias}d atrás`;
    
    return data.toLocaleDateString('pt-BR');
}

export default ProfessorDashboard;
