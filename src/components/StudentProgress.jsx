import React, { useState } from 'react';
import {
    Trophy, Star, Target, TrendingUp, Calendar, Clock,
    CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
    Book, Award, Zap, MessageSquare
} from 'lucide-react';

const MOCK_PROGRESS_DATA = {
    student: {
        name: "Bruno Farias",
        level: 5,
        xp: 2450,
        nextLevelXp: 3000,
        stats: {
            average: 8.5,
            attendance: 92,
            engagement: 88,
            completedProjects: 4
        }
    },
    projects: [
        {
            id: 1,
            name: "Horta Comunitária Inteligente",
            subject: "Biologia & IoT",
            progress: 75,
            status: "active",
            feedback: "Ótimo trabalho na implementação dos sensores de umidade!",
            tasks: [
                { id: 1, title: "Configurar sensores Arduino", status: "completed" },
                { id: 2, title: "Calibrar leitura de umidade", status: "completed" },
                { id: 3, title: "Desenvolver dashboard de dados", status: "in-progress" },
                { id: 4, title: "Documentação final", status: "pending" }
            ]
        },
        {
            id: 2,
            name: "História Local em VR",
            subject: "História & Tecnologia",
            progress: 40,
            status: "active",
            feedback: "Precisa aprofundar mais na pesquisa histórica do século XIX.",
            tasks: [
                { id: 1, title: "Levantamento bibliográfico", status: "completed" },
                { id: 2, title: "Roteiro da experiência", status: "in-progress" },
                { id: 3, title: "Modelagem 3D da praça", status: "pending" }
            ]
        },
        {
            id: 3,
            name: "Clube de Debates",
            subject: "Português & Sociologia",
            progress: 100,
            status: "completed",
            feedback: "Excelente argumentação e oratória na apresentação final.",
            tasks: [
                { id: 1, title: "Pesquisa de argumentos", status: "completed" },
                { id: 2, title: "Ensaio geral", status: "completed" },
                { id: 3, title: "Debate final", status: "completed" }
            ]
        }
    ],
    achievements: [
        { id: 1, title: "Primeiro Código", icon: "💻", description: "Completou o primeiro projeto de programação" },
        { id: 2, title: "Orador Nato", icon: "🗣️", description: "Nota máxima em apresentação oral" },
        { id: 3, title: "Cientista Jr", icon: "🔬", description: "Experimento de laboratório sem erros" },
        { id: 4, title: "Pontualidade", icon: "⏰", description: "1 mês sem atrasos" }
    ]
};

const StudentProgress = () => {
    const [expandedProject, setExpandedProject] = useState(null);
    const { student, projects, achievements } = MOCK_PROGRESS_DATA;

    const toggleProject = (id) => {
        setExpandedProject(expandedProject === id ? null : id);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header com Nível e XP */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                                <Trophy size={40} className="text-yellow-300" />
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-violet-900 border-4 border-violet-600">
                                {student.level}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Progresso Acadêmico</h1>
                            <p className="text-indigo-100">Continue evoluindo para desbloquear novas conquistas!</p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/3">
                        <div className="flex justify-between text-sm font-bold mb-2">
                            <span>XP Atual</span>
                            <span>{student.xp} / {student.nextLevelXp} XP</span>
                        </div>
                        <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                style={{ width: `${(student.xp / student.nextLevelXp) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-right mt-2 text-indigo-200">
                            Faltam {student.nextLevelXp - student.xp} XP para o nível {student.level + 1}
                        </p>
                    </div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                            <Star size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-400 uppercase">Média Geral</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800">{student.stats.average}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-400 uppercase">Frequência</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800">{student.stats.attendance}%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                            <Zap size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-400 uppercase">Engajamento</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800">{student.stats.engagement}%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                            <Book size={24} />
                        </div>
                        <span className="text-sm font-bold text-slate-400 uppercase">Projetos</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-800">{student.stats.completedProjects}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Projetos */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Target className="text-indigo-600" />
                        Projetos em Andamento
                    </h2>

                    <div className="space-y-4">
                        {projects.map(project => (
                            <div key={project.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleProject(project.id)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{project.name}</h3>
                                            <p className="text-sm text-slate-500">{project.subject}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {project.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-slate-600">
                                            <span>Progresso</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                                    }`}
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {project.feedback && (
                                        <div className="mt-4 flex items-start gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
                                            <MessageSquare size={18} className="text-green-600 mt-0.5" />
                                            <p className="text-sm text-green-800 font-medium">"{project.feedback}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tarefas Expansíveis */}
                                {expandedProject === project.id && (
                                    <div className="bg-slate-50 border-t border-slate-100 p-6">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Tarefas do Projeto</h4>
                                        <div className="space-y-3">
                                            {project.tasks.map(task => (
                                                <div key={task.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200">
                                                    {task.status === 'completed' ? (
                                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                                            <CheckCircle2 size={14} />
                                                        </div>
                                                    ) : task.status === 'in-progress' ? (
                                                        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                                                    )}
                                                    <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'
                                                        }`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div
                                    className="bg-slate-50 p-2 text-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors border-t border-slate-100"
                                    onClick={() => toggleProject(project.id)}
                                >
                                    {expandedProject === project.id ? <ChevronUp size={20} className="mx-auto" /> : <ChevronDown size={20} className="mx-auto" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Conquistas */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Award className="text-yellow-500" />
                        Conquistas Desbloqueadas
                    </h2>
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                        <div className="grid grid-cols-1 gap-4">
                            {achievements.map(achievement => (
                                <div key={achievement.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                        {achievement.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{achievement.title}</h4>
                                        <p className="text-xs text-slate-500">{achievement.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                            Ver Todas as Conquistas
                        </button>
                    </div>

                    {/* Próximo Objetivo */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="text-green-400" />
                            <h3 className="font-bold">Próximo Objetivo</h3>
                        </div>
                        <p className="text-slate-300 text-sm mb-4">
                            Complete o projeto "História Local em VR" para ganhar +500 XP e a badge "Historiador Digital".
                        </p>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 w-2/5"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProgress;
