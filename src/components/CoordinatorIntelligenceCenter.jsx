import React, { useState } from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Users,
    TrendingDown,
    FileText,
    MessageSquare,
    Settings,
    ArrowRight,
    ChevronRight,
    X
} from "lucide-react";

const CoordinatorIntelligenceCenter = ({ onNavigateTo }) => {
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [dismissedAlerts, setDismissedAlerts] = useState([]);

    // Alertas inteligentes baseados em dados
    const alerts = [
        {
            id: "pending-corrections",
            type: "warning",
            icon: <FileText size={24} className="text-blue-500" />,
            title: "Correções Pendentes",
            count: 7,
            subtitle: "Entregas aguardando avaliação",
            description: "7 trabalhos enviados pelos alunos precisam de correção e feedback.",
            actions: [
                {
                    label: "Avaliar Agora",
                    color: "blue",
                    action: () => onNavigateTo('reports')
                },
                {
                    label: "Ver Detalhes",
                    color: "slate",
                    action: () => console.log("Ver detalhes")
                }
            ],
            priority: "high",
            lastUpdated: "12:58:23"
        },
        {
            id: "at-risk-students",
            type: "danger",
            icon: <AlertCircle size={24} className="text-red-500" />,
            title: "Alunos em Risco",
            count: 3,
            subtitle: "Média abaixo de 6.0",
            description: "3 alunos apresentam desempenho insuficiente. Recomenda-se contato com responsáveis.",
            actions: [
                {
                    label: "Contatar Responsáveis",
                    color: "red",
                    action: () => onNavigateTo('messages')
                },
                {
                    label: "Oferecer Reforço",
                    color: "slate",
                    action: () => console.log("Oferecer reforço")
                }
            ],
            priority: "critical",
            lastUpdated: "12:50:15"
        },
        {
            id: "low-attendance",
            type: "warning",
            icon: <Clock size={24} className="text-orange-500" />,
            title: "Baixa Frequência",
            count: 5,
            subtitle: "Abaixo de 75%",
            description: "5 alunos têm frequência abaixo do limite mínimo. Verificar causas e intervir.",
            actions: [
                {
                    label: "Comunicar Pais",
                    color: "orange",
                    action: () => onNavigateTo('messages')
                },
                {
                    label: "Analisar Padrão",
                    color: "slate",
                    action: () => console.log("Analisar padrão")
                }
            ],
            priority: "high",
            lastUpdated: "12:45:30"
        },
        {
            id: "bncc-coverage",
            type: "info",
            icon: <TrendingDown size={24} className="text-orange-500" />,
            title: "Cobertura BNCC Baixa",
            count: 78,
            subtitle: "78% de cobertura",
            description: "Alguns componentes curriculares têm cobertura BNCC abaixo de 80%. Aumentar integração.",
            actions: [
                {
                    label: "Revisar Currículo",
                    color: "orange",
                    action: () => onNavigateTo('coordinator-advanced')
                },
                {
                    label: "Agendar Reunião",
                    color: "slate",
                    action: () => console.log("Agendar reunião")
                }
            ],
            priority: "medium",
            lastUpdated: "12:30:45"
        },
        {
            id: "evasion-risk",
            type: "danger",
            icon: <Users size={24} className="text-red-500" />,
            title: "Risco de Evasão",
            count: 2,
            subtitle: "2 alunos com sinais críticos",
            description: "2 alunos mostram sinais de possível abandono (faltas recorrentes + desempenho baixo).",
            actions: [
                {
                    label: "Intervir Agora",
                    color: "red",
                    action: () => onNavigateTo('messages')
                },
                {
                    label: "Histórico do Aluno",
                    color: "slate",
                    action: () => console.log("Histórico")
                }
            ],
            priority: "critical",
            lastUpdated: "12:25:10"
        },
        {
            id: "class-imbalance",
            type: "warning",
            icon: <Users size={24} className="text-yellow-500" />,
            title: "Desempenho Desigual entre Turmas",
            count: 2,
            subtitle: "7º Ano A vs 7º Ano B",
            description: "7º Ano A (95%) está muito melhor que 7º Ano B (85%). Investigar diferenças.",
            actions: [
                {
                    label: "Comparar Turmas",
                    color: "yellow",
                    action: () => onNavigateTo('metrics')
                },
                {
                    label: "Compartilhar Boas Práticas",
                    color: "slate",
                    action: () => console.log("Compartilhar")
                }
            ],
            priority: "medium",
            lastUpdated: "12:15:50"
        }
    ];

    // Filtrar alertas não descartados
    const activeAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

    // Organizar por prioridade
    const sortedAlerts = [...activeAlerts].sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const dismissAlert = (id) => {
        setDismissedAlerts([...dismissedAlerts, id]);
        setSelectedAlert(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "critical":
                return "border-red-500 bg-red-50";
            case "high":
                return "border-orange-500 bg-orange-50";
            case "medium":
                return "border-yellow-500 bg-yellow-50";
            default:
                return "border-blue-500 bg-blue-50";
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case "critical":
                return "🚨 Crítico";
            case "high":
                return "⚠️ Alto";
            case "medium":
                return "ℹ️ Médio";
            default:
                return "ℹ️ Baixo";
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white">
                        🎯
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900">Central de Inteligência</h1>
                        <p className="text-slate-600">Visão 360° do desempenho da sua turma em tempo real</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500">Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Alertas Ativos</p>
                    <p className="text-3xl font-extrabold text-red-600 mt-1">{activeAlerts.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Críticos</p>
                    <p className="text-3xl font-extrabold text-red-700 mt-1">{activeAlerts.filter(a => a.priority === 'critical').length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Altos</p>
                    <p className="text-3xl font-extrabold text-orange-600 mt-1">{activeAlerts.filter(a => a.priority === 'high').length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Taxa de Resolução</p>
                    <p className="text-3xl font-extrabold text-green-600 mt-1">{Math.round((dismissedAlerts.length / alerts.length) * 100)}%</p>
                </div>
            </div>

            {/* Alertas em Grid */}
            {sortedAlerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${getPriorityColor(alert.priority)}`}
                            onClick={() => setSelectedAlert(alert)}
                        >
                            {/* Header do Alerta */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 bg-white rounded-xl">{alert.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-slate-900">{alert.title}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{alert.subtitle}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dismissAlert(alert.id);
                                    }}
                                    className="text-slate-400 hover:text-slate-600 transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Número Destaque */}
                            <div className="mb-4 pb-4 border-b border-current border-opacity-10">
                                <p className="text-5xl font-extrabold text-slate-900">{alert.count}</p>
                            </div>

                            {/* Prioridade e Timestamp */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold">{getPriorityLabel(alert.priority)}</span>
                                <span className="text-xs text-slate-500">Atualizado às {alert.lastUpdated}</span>
                            </div>

                            {/* Seta Indicadora */}
                            <div className="mt-4 flex items-center justify-center">
                                <ChevronRight size={20} className="text-slate-600" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-12 text-center">
                    <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Tudo Ok! ✨</h3>
                    <p className="text-green-700">Nenhum alerta crítico no momento. Continue monitorando!</p>
                </div>
            )}

            {/* Modal do Alerta Selecionado */}
            {selectedAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header do Modal */}
                        <div className={`p-6 border-b-2 ${getPriorityColor(selectedAlert.priority)}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl">{selectedAlert.icon}</div>
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-slate-900">{selectedAlert.title}</h2>
                                        <p className="text-sm text-slate-600 mt-1">{selectedAlert.subtitle}</p>
                                        <p className="text-xs text-slate-500 mt-2">Prioridade: {getPriorityLabel(selectedAlert.priority)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAlert(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-6">
                            {/* Grande Número */}
                            <div className="mb-6 p-6 bg-slate-50 rounded-xl text-center">
                                <p className="text-6xl font-extrabold text-slate-900">{selectedAlert.count}</p>
                                <p className="text-sm text-slate-600 mt-2">{selectedAlert.subtitle}</p>
                            </div>

                            {/* Descrição */}
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-800 mb-2">Sobre este alerta:</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{selectedAlert.description}</p>
                            </div>

                            {/* Ações */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-800">O que fazer agora?</h3>
                                {selectedAlert.actions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            action.action();
                                            setSelectedAlert(null);
                                        }}
                                        className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition flex items-center justify-between ${
                                            action.color === 'red'
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : action.color === 'orange'
                                                ? 'bg-orange-600 text-white hover:bg-orange-700'
                                                : action.color === 'blue'
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : action.color === 'yellow'
                                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                                        }`}
                                    >
                                        {action.label}
                                        <ArrowRight size={18} />
                                    </button>
                                ))}
                            </div>

                            {/* Descartar */}
                            <button
                                onClick={() => {
                                    dismissAlert(selectedAlert.id);
                                }}
                                className="w-full mt-4 py-2 text-slate-600 hover:text-slate-800 font-bold text-sm transition"
                            >
                                Descartar este alerta
                            </button>
                        </div>

                        {/* Timestamp */}
                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
                            Última atualização: {selectedAlert.lastUpdated}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoordinatorIntelligenceCenter;
