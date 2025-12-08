import React, { useState, useEffect } from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Users,
    TrendingDown,
    FileText,
    MessageSquare,
    Zap,
    ArrowRight,
    ChevronRight,
    X,
    Target,
    Award,
    Activity,
    ListTodo,
    CheckSquare,
    Play,
    Pause,
    Trash2
} from "lucide-react";

const TeacherIntelligenceCenter = ({ onNavigateTo }) => {
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [dismissedAlerts, setDismissedAlerts] = useState([]);
    const [actionPlan, setActionPlan] = useState([]);
    const [showActionPlan, setShowActionPlan] = useState(false);

    // Alertas inteligentes para professor
    const alerts = [
        {
            id: "submissions-pending",
            type: "warning",
            icon: <FileText size={24} className="text-blue-500" />,
            title: "Entregas Pendentes de Avaliação",
            count: 12,
            subtitle: "Atividades aguardando feedback",
            description: "12 trabalhos foram enviados pelos alunos e estão aguardando sua avaliação. Procrastinar afeta o aprendizado dos alunos!",
            actions: [
                {
                    label: "Avaliar Agora",
                    color: "blue",
                    relatedTab: 'reports',
                    action: null
                },
                {
                    label: "Adicionar ao Plano de Ação",
                    color: "slate",
                    relatedTab: 'reports',
                    action: null
                }
            ],
            priority: "high",
            lastUpdated: "13:05:42",
            estimatedTime: "~45min"
        },
        {
            id: "low-performers",
            type: "danger",
            icon: <TrendingDown size={24} className="text-red-500" />,
            title: "Alunos com Desempenho Baixo",
            count: 4,
            subtitle: "Notas abaixo de 6.0",
            description: "4 alunos estão com desempenho insuficiente. Ofereça reforço, atividades extras e acompanhamento personalizado.",
            actions: [
                {
                    label: "Enviar Mensagem de Suporte",
                    color: "red",
                    relatedTab: 'messages',
                    action: null
                },
                {
                    label: "Adicionar ao Plano de Ação",
                    color: "slate",
                    relatedTab: 'messages',
                    action: null
                }
            ],
            priority: "critical",
            lastUpdated: "13:00:15",
            estimatedTime: "~20min"
        },
        {
            id: "bncc-coverage",
            type: "info",
            icon: <Target size={24} className="text-orange-500" />,
            title: "Cobertura BNCC - Abaixo da Meta",
            count: 65,
            subtitle: "65% de cobertura no projeto atual",
            description: "Seu projeto atual cobre apenas 65% das competências BNCC esperadas. Revise o planejamento para aumentar a integração curricular.",
            actions: [
                {
                    label: "Revisar Planejamento",
                    color: "orange",
                    relatedTab: 'planning',
                    action: null
                },
                {
                    label: "Adicionar ao Plano de Ação",
                    color: "slate",
                    relatedTab: 'planning',
                    action: null
                }
            ],
            priority: "medium",
            lastUpdated: "12:55:30",
            estimatedTime: "~30min"
        },
        {
            id: "attendance-issues",
            type: "warning",
            icon: <Clock size={24} className="text-orange-500" />,
            title: "Alunos com Faltas Recorrentes",
            count: 3,
            subtitle: "Frequência abaixo de 75%",
            description: "3 alunos faltaram em 6+ aulas este mês. Investigue as causas e considere contato com responsáveis.",
            actions: [
                {
                    label: "Contactar Responsáveis",
                    color: "orange",
                    relatedTab: 'messages',
                    action: null
                },
                {
                    label: "Adicionar ao Plano de Ação",
                    color: "slate",
                    relatedTab: 'messages',
                    action: null
                }
            ],
            priority: "high",
            lastUpdated: "12:50:45",
            estimatedTime: "~15min"
        },
        {
            id: "team-conflicts",
            type: "warning",
            icon: <Users size={24} className="text-yellow-500" />,
            title: "Conflitos em Equipes de Projeto",
            count: 2,
            subtitle: "2 equipes com dificuldades",
            description: "Equipes A e C reportaram dificuldades de colaboração. Mediar discussões e reorganizar papéis pode ajudar.",
            actions: [
                {
                    label: "Reunir Equipe",
                    color: "yellow",
                    relatedTab: 'teams',
                    action: null
                },
                {
                    label: "Adicionar ao Plano de Ação",
                    color: "slate",
                    relatedTab: 'teams',
                    action: null
                }
            ],
            priority: "high",
            lastUpdated: "12:45:20",
            estimatedTime: "~25min"
        },
        {
            id: "rubric-incomplete",
            type: "info",
            icon: <Award size={24} className="text-purple-500" />,
            title: "Rubrica Incompleta",
            count: 2,
            subtitle: "2 projetos sem rubrica definida",
            description: "Defina critérios claros para avaliação. Rubricas bem estruturadas melhoram transparência e justiça na avaliação.",
            actions: [
                {
                    label: "Criar/Editar Rubrica",
                    color: "purple",
                    relatedTab: 'rubrics',
                    action: null
                },
                {
                    label: "Adicionar ao Plano de Ação",
                    color: "slate",
                    relatedTab: 'rubrics',
                    action: null
                }
            ],
            priority: "medium",
            lastUpdated: "12:40:10",
            estimatedTime: "~20min"
        },
        {
            id: "deadline-approaching",
            type: "warning",
            icon: <Clock size={24} className="text-blue-500" />,
            title: "Prazo Importante se Aproximando",
            count: 1,
            subtitle: "Entrega em 2 dias",
            description: "O projeto 'Horta Sustentável' vence em 2 dias. Certifique-se que os alunos estão alinhados e prontos para entregar.",
            actions: [
                {
                    label: "Enviar Lembrete",
                    color: "blue",
                    relatedTab: 'messages',
                    action: null
                },
                {
                    label: "Adicionar ao Plano de Ação",
                    color: "slate",
                    relatedTab: 'messages',
                    action: null
                }
            ],
            priority: "high",
            lastUpdated: "12:35:50",
            estimatedTime: "~10min"
        },
        {
            id: "disengagement",
            type: "warning",
            icon: <Activity size={24} className="text-red-500" />,
            title: "Alunos Desengajados",
            count: 5,
            subtitle: "Baixa participação em atividades",
            description: "5 alunos não participam das atividades colaborativas. Ofereça suporte, ajuste a dificuldade ou use estratégias de gamificação.",
            actions: [
                {
                    label: "Diversificar Atividades",
                    color: "red",
                    relatedTab: 'planning',
                    action: null
                },
                {
                    label: "Conversar em Particular",
                    color: "slate",
                    relatedTab: 'messages',
                    action: null
                }
            ],
            priority: "high",
            lastUpdated: "12:30:25",
            estimatedTime: "~30min"
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

    // Sistema de Plano de Ação
    const addToActionPlan = (alert, action) => {
        const newTask = {
            id: `task-${Date.now()}`,
            alertId: alert.id,
            alertTitle: alert.title,
            action: action.label,
            status: 'pending', // pending, in-progress, completed
            createdAt: new Date().toLocaleTimeString('pt-BR'),
            dueDate: alert.id === 'deadline-approaching' ? '2 dias' : 'Sem prazo',
            relatedTab: action.relatedTab || 'reports'
        };
        setActionPlan([newTask, ...actionPlan]);
        setSelectedAlert(null);
    };

    const updateTaskStatus = (taskId, newStatus) => {
        setActionPlan(actionPlan.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
    };

    const deleteTask = (taskId) => {
        setActionPlan(actionPlan.filter(task => task.id !== taskId));
    };

    const executeAction = (task) => {
        updateTaskStatus(task.id, 'in-progress');
        onNavigateTo(task.relatedTab);
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

    // Calcular estatísticas
    const criticalCount = activeAlerts.filter(a => a.priority === 'critical').length;
    const highCount = activeAlerts.filter(a => a.priority === 'high').length;
    const estimatedTotalTime = activeAlerts.reduce((acc, alert) => {
        const minutes = parseInt(alert.estimatedTime.match(/\d+/)[0]);
        return acc + minutes;
    }, 0);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                        🧠
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900">Central de Inteligência 360°</h1>
                        <p className="text-slate-600">Acompanhamento inteligente da sua turma e projetos</p>
                    </div>
                </div>
                <p className="text-sm text-slate-500">Última atualização: {new Date().toLocaleTimeString('pt-BR')}</p>
            </div>

            {/* Botão para Mostrar/Ocultar Plano de Ação */}
            {actionPlan.length > 0 && (
                <div className="mb-8">
                    <button
                        onClick={() => setShowActionPlan(!showActionPlan)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition flex items-center justify-between"
                    >
                        <span className="flex items-center gap-2">
                            <ListTodo size={20} />
                            Plano de Ação ({actionPlan.filter(t => t.status !== 'completed').length} pendentes)
                        </span>
                        <ChevronRight size={20} className={`transition ${showActionPlan ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Plano de Ação Expandido */}
                    {showActionPlan && (
                        <div className="mt-4 bg-white rounded-xl border-2 border-blue-200 p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <ListTodo size={24} className="text-blue-600" />
                                Suas Ações Agendadas
                            </h2>
                            <div className="space-y-3">
                                {actionPlan.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`p-4 rounded-lg border-2 transition ${
                                            task.status === 'completed'
                                                ? 'bg-green-50 border-green-300 opacity-70'
                                                : task.status === 'in-progress'
                                                ? 'bg-blue-50 border-blue-300'
                                                : 'bg-slate-50 border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900">{task.alertTitle}</h4>
                                                <p className="text-sm text-slate-600 mt-1">{task.action}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                                                        task.status === 'completed' ? 'bg-green-200 text-green-800' :
                                                        task.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                                                        'bg-slate-200 text-slate-800'
                                                    }`}>
                                                        {task.status === 'completed' ? '✓ Concluído' :
                                                         task.status === 'in-progress' ? '▶ Em Andamento' :
                                                         '○ Pendente'}
                                                    </span>
                                                    <span className="text-xs text-slate-500">Criado às {task.createdAt}</span>
                                                    {task.dueDate !== 'Sem prazo' && (
                                                        <span className="text-xs text-red-600 font-bold">Prazo: {task.dueDate}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {task.status !== 'completed' && (
                                                    <>
                                                        <button
                                                            onClick={() => executeAction(task)}
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                            title="Executar ação"
                                                        >
                                                            <Play size={18} />
                                                        </button>
                                                        {task.status === 'in-progress' && (
                                                            <button
                                                                onClick={() => updateTaskStatus(task.id, 'pending')}
                                                                className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition"
                                                                title="Pausar"
                                                            >
                                                                <Pause size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => updateTaskStatus(task.id, 'completed')}
                                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                                                            title="Marcar como concluído"
                                                        >
                                                            <CheckSquare size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => deleteTask(task.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                    title="Remover"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Alertas Ativos</p>
                    <p className="text-3xl font-extrabold text-red-600 mt-1">{activeAlerts.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Críticos</p>
                    <p className="text-3xl font-extrabold text-red-700 mt-1">{criticalCount}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Altos</p>
                    <p className="text-3xl font-extrabold text-orange-600 mt-1">{highCount}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Tempo Estimado</p>
                    <p className="text-3xl font-extrabold text-blue-600 mt-1">{estimatedTotalTime}m</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-600 font-bold">Resolvidos</p>
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
                                {alert.estimatedTime && (
                                    <p className="text-xs text-slate-600 mt-2">⏱️ {alert.estimatedTime} para resolver</p>
                                )}
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
                    <h3 className="text-2xl font-bold text-green-900 mb-2">Parabéns! Tudo em Dia! ✨</h3>
                    <p className="text-green-700">Nenhum alerta pendente. Sua turma está em perfeito andamento!</p>
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
                                {selectedAlert.estimatedTime && (
                                    <p className="text-xs text-slate-500 mt-3">⏱️ Tempo estimado: {selectedAlert.estimatedTime}</p>
                                )}
                            </div>

                            {/* Descrição */}
                            <div className="mb-6">
                                <h3 className="font-bold text-slate-800 mb-2">Sobre este alerta:</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{selectedAlert.description}</p>
                            </div>

                            {/* Ações */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-slate-800">O que você pode fazer agora?</h3>
                                {selectedAlert.actions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (action.label === 'Adicionar ao Plano de Ação') {
                                                addToActionPlan(selectedAlert, action);
                                            } else {
                                                executeAction({
                                                    id: `task-${Date.now()}`,
                                                    alertId: selectedAlert.id,
                                                    alertTitle: selectedAlert.title,
                                                    action: action.label,
                                                    relatedTab: action.relatedTab
                                                });
                                            }
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
                                                : action.color === 'purple'
                                                ? 'bg-purple-600 text-white hover:bg-purple-700'
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

export default TeacherIntelligenceCenter;
