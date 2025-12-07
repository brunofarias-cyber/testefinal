import React, { useState, useEffect } from "react";
import {
    BarChart2,
    TrendingUp,
    Award,
    AlertCircle,
    CheckCircle,
    Calendar,
    Users,
    Zap,
    Clock,
    Target
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || '';
const api = (path) => (API_BASE ? `${API_BASE}${path}` : path);

const StudentDashboard = ({ currentUserId = 101 }) => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carregar projetos da turma do aluno
    useEffect(() => {
        loadStudentProjects();
        loadStudentStats();
    }, [currentUserId]);

    const loadStudentProjects = async () => {
        setLoading(true);
        try {
            const response = await fetch(api(`/api/student-projects/${currentUserId}`));
            if (response.ok) {
                const data = await response.json();
                setProjects(data.data.projects || []);
                console.log(`✅ Projetos carregados (Turma ${data.data.classId}):`, data.data.projects.length);
            } else {
                // Fallback para mock
                console.log('⚠️ Usando projetos mock');
                setProjects(MOCK_PROJECTS_FALLBACK);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar projetos:', error);
            setProjects(MOCK_PROJECTS_FALLBACK);
        } finally {
            setLoading(false);
        }
    };

    const loadStudentStats = async () => {
        try {
            const response = await fetch(api(`/api/student-projects/${currentUserId}/stats`));
            if (response.ok) {
                const data = await response.json();
                setStats(data.data);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
        }
    };

    const studentData = {
        name: "João Silva",
        class: "7º Ano A",
        school: "Escola Inovadora",
        xp: 1250,
        level: 5,
        xpProgress: 65,
        average: stats?.average || 8.5,
        attendance: 95,
        engagement: 88
    };

    // Fallback mock projects
    const MOCK_PROJECTS_FALLBACK = [
        {
            id: 1,
            name: "Horta Sustentável",
            progress: 85,
            dueDate: "2023-11-15",
            grade: 9.0,
            teacher: "Profª Ana Silva",
            status: "completed",
            tasksDone: 3,
            tasksTotal: 4
        },
        {
            id: 2,
            name: "Robótica",
            progress: 60,
            dueDate: "2023-12-20",
            grade: null,
            teacher: "Prof. Roberto Lima",
            status: "in-progress",
            tasksDone: 2,
            tasksTotal: 4
        }
    ];

    const upcomingTasks = [
        {
            id: 1,
            title: "Entrega do Relatório Final",
            project: "Horta Sustentável",
            dueDate: "2023-11-15",
            days: 2,
            priority: "high"
        },
        {
            id: 2,
            title: "Programação do Robô",
            project: "Robótica",
            dueDate: "2023-11-25",
            days: 12,
            priority: "normal"
        },
        {
            id: 3,
            title: "Definição de Pautas",
            project: "Jornal Digital",
            dueDate: "2023-11-30",
            days: 17,
            priority: "normal"
        }
    ];

    const achievements = [
        { name: "Madrugador", icon: "⚡", date: "2023-11-05" },
        { name: "A Volta por Cima", icon: "📈", date: "2023-11-12" }
    ];

    const alerts = [
        { type: "deadline", message: "Entrega em 2 dias: Horta Sustentável", color: "bg-red-50 border-red-200" },
        { type: "achievement", message: "Você desbloqueou 'A Volta por Cima'!", color: "bg-yellow-50 border-yellow-200" }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Alertas */}
            {alerts.length > 0 && (
                <div className="space-y-2">
                    {alerts.map((alert, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border ${alert.color} flex items-center gap-3`}>
                            {alert.type === "deadline" ? (
                                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                            ) : (
                                <Award size={20} className="text-yellow-500 flex-shrink-0" />
                            )}
                            <p className="font-semibold text-slate-800">{alert.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Cabeçalho Principal */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-1">Bem-vindo, {studentData.name}! 👋</h1>
                        <p className="text-indigo-100">{studentData.class} • {studentData.school}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold opacity-80 mb-2">SEU NÍVEL</p>
                        <div className="flex items-end gap-3 justify-end">
                            <div>
                                <p className="text-4xl font-extrabold">{studentData.level}</p>
                                <p className="text-xs opacity-80">Nível</p>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-yellow-300">{studentData.xp}</p>
                                <p className="text-xs opacity-80">XP</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 bg-black/20 h-3 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${studentData.xpProgress}%` }}></div>
                </div>
                <p className="text-xs opacity-75 mt-2">{studentData.xpProgress}% até o próximo nível</p>
            </div>

            {/* KPIs Principais */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Média Geral</p>
                    <p className="text-4xl font-extrabold text-indigo-600 mt-3">{studentData.average}</p>
                    <p className="text-xs text-slate-500 mt-2">Excelente desempenho</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Frequência</p>
                    <p className="text-4xl font-extrabold text-green-600 mt-3">{studentData.attendance}%</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: `${studentData.attendance}%` }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Engajamento</p>
                    <p className="text-4xl font-extrabold text-purple-600 mt-3">{studentData.engagement}%</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${studentData.engagement}%` }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Projetos</p>
                    <p className="text-4xl font-extrabold text-blue-600 mt-3">{projects.length}</p>
                    <p className="text-xs text-slate-500 mt-2">Em andamento</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Projetos Recentes */}
                <div className="col-span-2">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Meus Projetos</h2>
                    <div className="space-y-3">
                        {projects.map(proj => (
                            <div
                                key={proj.id}
                                className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition cursor-pointer"
                                onClick={() => setSelectedProject(proj)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{proj.teacher}</p>
                                    </div>
                                    {proj.grade && (
                                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                            {proj.grade}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                                            style={{ width: `${proj.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">{proj.progress}%</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">{proj.tasksDone}/{proj.tasksTotal} tarefas</span>
                                    <span className="text-slate-500">Entrega: {proj.dueDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Próximas Tarefas */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Próximas Tarefas</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {upcomingTasks.map(task => (
                            <div
                                key={task.id}
                                className={`p-4 rounded-lg border-l-4 ${task.priority === "high"
                                        ? "bg-red-50 border-red-500"
                                        : "bg-blue-50 border-blue-500"
                                    }`}
                            >
                                <div className="flex items-start gap-2 mb-2">
                                    <Clock size={16} className={task.priority === "high" ? "text-red-500" : "text-blue-500"} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">{task.title}</p>
                                        <p className="text-xs text-slate-600 mt-1">{task.project}</p>
                                    </div>
                                </div>
                                <p className={`text-sm font-bold ${task.days <= 3 ? "text-red-600" : "text-slate-600"
                                    }`}>
                                    {task.days} dia{task.days !== 1 ? "s" : ""} restante{task.days !== 1 ? "s" : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conquistas */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Award size={24} className="text-yellow-500" /> Conquistas Recentes
                </h2>
                <div className="grid grid-cols-6 gap-4">
                    {achievements.map((ach, idx) => (
                        <div
                            key={idx}
                            className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-300 text-center"
                        >
                            <p className="text-3xl mb-2">{ach.icon}</p>
                            <p className="font-bold text-sm text-slate-800">{ach.name}</p>
                            <p className="text-xs text-slate-500 mt-1">✓ Desbloqueado</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
