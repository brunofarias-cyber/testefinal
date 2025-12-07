import React, { useState, useEffect } from "react";
import {
    Home,
    Book,
    Users,
    Plus,
    Check,
    Clock,
    Award,
    Calendar,
    BarChart2,
    Settings,
    Edit,
    X,
    AlertCircle,
    Grid,
    Rocket,
    LogOut,
    Upload,
    Download,
    Link,
    ArrowRight,
    ClipboardList,
    CheckSquare,
    ChevronLeft,
    MoreVertical,
    Trash2,
    FileText,
    MessageSquare,
    Save,
    Zap,
    TrendingUp,
    Star,
    Video,
    Target,
    BookOpen,
    Filter,
    Lock,
    Search,
    Send,
    Bell,
    FolderKanban,
    Network,
    Trophy
} from "lucide-react";
import TeacherPlanning from "./components/TeacherPlanning";
import ProjectWizardBNCC from "./components/ProjectWizardBNCC";
import MessagingSystem from "./components/MessagingSystem";
import MessagingSystemV2 from "./components/MessagingSystemV2";
import TeacherPerformance from "./components/TeacherPerformance";
import { AuthManager, LoginScreen } from "./components/AuthSystemAPI";
import StudentDashboard from "./components/StudentDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard";
// import CopilotoIA from "./features/CopilotoIA";
// import EarlyWarning from "./features/EarlyWarning";
// import MissoesColaborativas from "./features/MissoesColaborativas";
// import PortfolioDigital from "./features/PortfolioDigital";
// import EcossistemaConectado from "./features/EcossistemaConectado";
import StudentProgressDashboard from "./components/StudentProgressDashboard";
import TeacherClassManager from "./components/TeacherClassManager";

import { NotificationCenter, StudentProgress } from "./components/NotificationCenter";
import CoordinatorAdvanced from "./components/CoordinatorAdvanced";
import StudentGrades from "./components/StudentGrades";
import TeacherRubricEditablePoints from "./components/TeacherRubricEditablePoints";
import { TeacherReportsEditavel } from "./components/TeacherReportsEditavel";
import TeacherBnccPage from "./pages/TeacherBnccPage";
import StudentBnccPage from "./pages/StudentBnccPage";

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import GerenciadorColaboradores from "./components/coteaching/GerenciadorColaboradores";
import AceitarConvite from "./components/coteaching/AceitarConvite";
import ProjetoCardComRole from "./components/coteaching/ProjetoCardComRole";


// --- DADOS MOCKADOS ---



const MOCK_STUDENTS_DATA = [
    {
        id: 101,
        name: "João Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        grades: [7.5, 8.0, 8.5, 9.0],
        attendance: 95,
        engagement: 88,
        projects: 4,
        status: "excellent",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 9.0, date: "2023-11-15" },
            { project: "Robótica", grade: 8.5, date: "2023-10-20" },
            { project: "Teatro", grade: 8.0, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 7.5, date: "2023-08-05" }
        ]
    },
    {
        id: 102,
        name: "Maria Oliveira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        grades: [9.0, 9.5, 9.0, 9.5],
        attendance: 98,
        engagement: 95,
        projects: 4,
        status: "excellent",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 9.5, date: "2023-11-15" },
            { project: "Robótica", grade: 9.0, date: "2023-10-20" },
            { project: "Teatro", grade: 9.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 9.0, date: "2023-08-05" }
        ]
    },
    {
        id: 103,
        name: "Pedro Santos",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
        grades: [6.0, 5.5, 6.5, 5.0],
        attendance: 75,
        engagement: 60,
        projects: 4,
        status: "at-risk",
        alerts: ["Baixa frequência", "Notas em queda", "Baixo engajamento"],
        evolution: [
            { project: "Horta Sustentável", grade: 5.0, date: "2023-11-15" },
            { project: "Robótica", grade: 6.5, date: "2023-10-20" },
            { project: "Teatro", grade: 5.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 6.0, date: "2023-08-05" }
        ]
    },
    {
        id: 104,
        name: "Ana Costa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaC",
        grades: [8.0, 8.5, 8.0, 8.5],
        attendance: 92,
        engagement: 85,
        projects: 4,
        status: "good",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 8.5, date: "2023-11-15" },
            { project: "Robótica", grade: 8.0, date: "2023-10-20" },
            { project: "Teatro", grade: 8.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 8.0, date: "2023-08-05" }
        ]
    },
    {
        id: 105,
        name: "Lucas Pereira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
        grades: [7.0, 7.5, 8.0, 8.5],
        attendance: 88,
        engagement: 82,
        projects: 4,
        status: "improving",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 8.5, date: "2023-11-15" },
            { project: "Robótica", grade: 8.0, date: "2023-10-20" },
            { project: "Teatro", grade: 7.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 7.0, date: "2023-08-05" }
        ]
    }
];

const MOCK_STUDENTS_LIST = [
    { id: 101, name: "João Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao", status: "Presente" },
    { id: 102, name: "Maria Oliveira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", status: "Presente" },
    { id: 103, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", status: "Ausente" },
    { id: 104, name: "Ana Costa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaC", status: "Presente" },
    { id: 105, name: "Lucas Pereira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", status: "Presente" },
    { id: 106, name: "Julia Souza", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia", status: "Presente" },
    { id: 107, name: "Beatriz Lima", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bia", status: "Ausente" },
    { id: 108, name: "Gabriel Alves", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Griel", status: "Presente" }
];

const MOCK_STUDENT_PERFORMANCE = [
    {
        id: 1,
        name: "Equipe Alpha",
        project: "Horta Sustentável",
        members: [
            { id: 101, name: "João Silva", role: "Líder", feedback: "Excelente liderança na organização das tarefas.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" },
            { id: 102, name: "Maria Oliveira", role: "Pesquisadora", feedback: "", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
            { id: 103, name: "Pedro Santos", role: "Documentador", feedback: "", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro" }
        ],
        teamFeedback: "A equipe está bem alinhada, mas precisa melhorar a documentação fotográfica do processo."
    },
    {
        id: 2,
        name: "Equipe Beta",
        project: "Robótica Sucata",
        members: [
            { id: 104, name: "Ana Costa", role: "Engenheira", feedback: "", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaC" },
            { id: 105, name: "Lucas Pereira", role: "Programador", feedback: "Ótima lógica de programação, mas precisa comentar mais o código.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" }
        ],
        teamFeedback: ""
    }
];

const MOCK_TEACHERS = [
    { id: 1, name: "Ana Silva", subject: "Biologia", projects: 4, rating: 4.8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
    { id: 2, name: "Carlos Souza", subject: "História", projects: 2, rating: 4.5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
    { id: 3, name: "Roberto Lima", subject: "Física", projects: 3, rating: 4.9, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto" },
    { id: 4, name: "Mariana Dias", subject: "Inglês", projects: 1, rating: 4.2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana" }
];

const MOCK_PROJECTS = [
    {
        id: 1,
        title: "Horta Sustentável",
        subject: "Bio & Mat",
        status: "Em Andamento",
        progress: 65,
        students: 24,
        nextDeadline: "2023-11-12",
        deadlineLabel: "Relatório de Crescimento",
        theme: "green",
        teacher: "Ana Silva",
        delayed: false,
        tasks: [
            { id: 't1', title: 'Comprar sementes', status: 'done', assignee: 'João' },
            { id: 't2', title: 'Preparar solo', status: 'done', assignee: 'Maria' },
            { id: 't3', title: 'Regar plantas (Semana 1)', status: 'todo', assignee: 'Pedro' },
            { id: 't4', title: 'Tirar fotos para relatório', status: 'in-progress', assignee: 'João' }
        ],
        bnccCoverage: 85
    },
    { id: 2, title: "Jornal Digital", subject: "Port & Hist", status: "Planejamento", progress: 15, students: 18, nextDeadline: "2023-11-20", deadlineLabel: "Definição de Pautas", theme: "blue", teacher: "Carlos Souza", delayed: false, tasks: [], bnccCoverage: 40 },
    { id: 3, title: "Robótica Sucata", subject: "Fís & Art", status: "Para Avaliação", progress: 100, students: 30, nextDeadline: "2023-10-30", deadlineLabel: "Apresentação Final", theme: "purple", teacher: "Roberto Lima", delayed: false, tasks: [], bnccCoverage: 92 },
    { id: 4, title: "Teatro Shake", subject: "Lit & Ing", status: "Atrasado", progress: 40, students: 22, nextDeadline: "2023-10-15", deadlineLabel: "Ensaios Gerais", theme: "red", teacher: "Mariana Dias", delayed: true, tasks: [], bnccCoverage: 25 }
];

const MOCK_ACHIEVEMENTS = [
    { id: 1, title: "Madrugador", desc: "Entregar tarefa com 24h de antecedência.", xp: 500, progress: 1, total: 1, icon: "Zap", unlocked: true },
    { id: 2, title: "A Volta por Cima", desc: "Melhorar a nota em relação ao último projeto.", xp: 800, progress: 1, total: 1, icon: "TrendingUp", unlocked: true },
    { id: 3, title: "Líder Nato", desc: "Ser líder de equipe em 2 projetos.", xp: 1000, progress: 1, total: 2, icon: "Star", unlocked: false },
    { id: 4, title: "Multimídia", desc: "Enviar entrega em formato de vídeo.", xp: 300, progress: 0, total: 1, icon: "Video", unlocked: false },
    { id: 5, title: "Na Mosca", desc: "100% de pontuação em um critério da rubrica.", xp: 600, progress: 2, total: 5, icon: "Target", unlocked: false },
    { id: 6, title: "Explorador", desc: "Participar de 5 projetos diferentes.", xp: 1200, progress: 2, total: 5, icon: "Rocket", unlocked: false },
    { id: 7, title: "Colaborador", desc: "Comentar em 10 tarefas de colegas.", xp: 400, progress: 7, total: 10, icon: "MessageSquare", unlocked: false },
    { id: 8, title: "Organizado", desc: "Completar 20 tarefas no Kanban.", xp: 700, progress: 15, total: 20, icon: "CheckSquare", unlocked: false },
    { id: 9, title: "Pesquisador", desc: "Adicionar 5 referências bibliográficas.", xp: 500, progress: 3, total: 5, icon: "Book", unlocked: false },
    { id: 10, title: "Apresentador", desc: "Fazer 3 apresentações com nota acima de 8.", xp: 900, progress: 1, total: 3, icon: "Users", unlocked: false },
    { id: 11, title: "Criativo", desc: "Usar 3 formatos diferentes de entrega.", xp: 600, progress: 2, total: 3, icon: "Zap", unlocked: false },
    { id: 12, title: "Pontual", desc: "Entregar 10 atividades no prazo.", xp: 1000, progress: 8, total: 10, icon: "Clock", unlocked: false },
];

const MOCK_RUBRIC = [
    { criteria: "Investigação Científica", weight: 40, levels: ["Não apresentou dados.", "Dados superficiais.", "Dados relevantes e bem analisados.", "Análise profunda com fontes extras."] },
    { criteria: "Trabalho em Equipe", weight: 30, levels: ["Conflitos constantes.", "Colaboração mínima.", "Boa divisão de tarefas.", "Sinergia e apoio mútuo."] },
    { criteria: "Comunicação Oral", weight: 30, levels: ["Leitura de slides.", "Fala pouco clara.", "Boa oratória.", "Apresentação engajadora e profissional."] }
];

const INITIAL_EVENTS = [
    { date: '2023-11-12', title: 'Relatório de Crescimento', type: 'deadline' },
    { date: '2023-11-20', title: 'Definição de Pautas', type: 'deadline' },
    { date: '2023-11-15', title: 'Reunião Pedagógica', type: 'meeting' }
];

// --- COMPONENTS ---

const BrandLogo = ({ size = 40, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
            <linearGradient id="bookGradient" x1="0" y1="100" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4338ca" />
                <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="plantGradient" x1="50" y1="100" x2="50" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#15803d" />
                <stop offset="1" stopColor="#4ade80" />
            </linearGradient>
        </defs>
        <path d="M10 75 C10 75 30 85 50 75 C70 65 90 75 90 75 V 85 C90 85 70 75 50 85 C30 95 10 85 10 85 V 75 Z" fill="url(#bookGradient)" opacity="0.8" />
        <path d="M10 70 C10 70 30 80 50 70 C70 60 90 70 90 70 V 80 C90 80 70 70 50 80 C30 90 10 80 10 80 V 70 Z" fill="white" opacity="0.3" />
        <path d="M50 75 V 85" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 75 Q 50 50 50 30" stroke="url(#plantGradient)" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 50 Q 70 40 80 20 Q 60 20 50 50" fill="url(#plantGradient)" />
        <path d="M50 40 Q 30 30 20 10 Q 40 10 50 40" fill="url(#plantGradient)" opacity="0.9" />
        <circle cx="20" cy="10" r="4" fill="#8b5cf6" />
        <circle cx="80" cy="20" r="4" fill="#8b5cf6" />
        <circle cx="35" cy="25" r="3" fill="#8b5cf6" />
        <circle cx="65" cy="30" r="3" fill="#8b5cf6" />
    </svg>
);

const Sidebar = ({ activeTab, setActiveTab, role, onLogout, currentUser }) => {
    const getRoleLabel = () => {
        if (role === 'teacher') return 'Professor';
        if (role === 'student') return 'Aluno';
        if (role === 'coordinator') return 'Coordenador';
    };

    return (
        <div className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-slate-200 flex flex-col shadow-xl z-50">
            <div className="p-8 flex items-center gap-3">
                <BrandLogo size={36} />
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">BProjetos</h1>
            </div>

            <div className="px-4 flex-1 overflow-y-auto">
                <div className="mb-6">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Navegação
                    </p>
                    <nav className="space-y-1">
                        <NavItem icon={<Home size={20} />} label="Visão Geral" active={activeTab === 'dashboard' || activeTab === 'kanban' || activeTab === 'student-home'} onClick={() => {
                            if (role === 'coordinator') setActiveTab('kanban');
                            else if (role === 'student') setActiveTab('student-home');
                            else setActiveTab('dashboard');
                        }} />
                    </nav>
                </div>

                <div className="mb-6">
                    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        {role === 'teacher' ? 'Gestão' : role === 'student' ? 'Acadêmico' : 'Administração'}
                    </p>
                    <nav className="space-y-1">
                        {role === 'teacher' && (
                            <>
                                <NavItem
                                    icon={<Users size={20} />}
                                    label="Turmas"
                                    active={activeTab === 'classes' || activeTab === 'manage-classes'}
                                    onClick={() => setActiveTab('classes')}
                                />
                                <NavItem icon={<Calendar size={20} />} label="Calendário" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                                <NavItem icon={<FileText size={20} />} label="Planejamento" active={activeTab === 'planning'} onClick={() => setActiveTab('planning')} />
                                <NavItem icon={<CheckSquare size={20} />} label="Chamada" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
                                <NavItem icon={<BarChart2 size={20} />} label="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
                                <NavItem icon={<MessageSquare size={20} />} label="Mensagens" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
                                <NavItem icon={<ClipboardList size={20} />} label="Relatórios" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                                <NavItem icon={<FileText size={20} />} label="Rubricas" active={activeTab === 'rubrics'} onClick={() => setActiveTab('rubrics')} />
                                <NavItem icon={<BookOpen size={20} />} label="BNCC" active={activeTab === 'bncc'} onClick={() => setActiveTab('bncc')} />
                                <NavItem icon={<Zap size={20} />} label="Copiloto IA" active={activeTab === 'copiloto-ia'} onClick={() => setActiveTab('copiloto-ia')} />
                                <NavItem icon={<AlertCircle size={20} />} label="Early Warning" active={activeTab === 'early-warning'} onClick={() => setActiveTab('early-warning')} />
                                <NavItem icon={<Trophy size={20} />} label="Missões" active={activeTab === 'missoes'} onClick={() => setActiveTab('missoes')} />
                                <NavItem icon={<FolderKanban size={20} />} label="Portfólio" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
                                <NavItem icon={<Network size={20} />} label="Ecossistema" active={activeTab === 'ecossistema'} onClick={() => setActiveTab('ecossistema')} />
                            </>
                        )}
                        {role === 'student' && (
                            <>
                                <NavItem icon={<Book size={20} />} label="Projetos" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                                <NavItem icon={<BarChart2 size={20} />} label="Progresso" active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
                                <NavItem icon={<Award size={20} />} label="Notas" active={activeTab === 'grades'} onClick={() => setActiveTab('grades')} />
                                <NavItem icon={<Calendar size={20} />} label="Calendário" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
                                <NavItem icon={<MessageSquare size={20} />} label="Mensagens" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
                                <NavItem icon={<AlertCircle size={20} />} label="Notificações" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                                <NavItem icon={<Award size={20} />} label="Conquistas" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
                                <NavItem icon={<Target size={20} />} label="Competências" active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} />
                            </>
                        )}
                        {role === 'coordinator' && (
                            <>
                                <NavItem icon={<Grid size={20} />} label="Kanban" active={activeTab === 'kanban'} onClick={() => setActiveTab('kanban')} />
                                <NavItem icon={<Users size={20} />} label="Professores" active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} />
                                <NavItem icon={<BarChart2 size={20} />} label="Indicadores" active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} />
                                <NavItem icon={<TrendingUp size={20} />} label="Dashboard Avançado" active={activeTab === 'coordinator-advanced'} onClick={() => setActiveTab('coordinator-advanced')} />
                            </>
                        )}
                    </nav>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                {currentUser && (
                    <div className="mb-3 px-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                )}
                <button onClick={onLogout} className="flex items-center gap-3 px-3 py-3 w-full hover:bg-white hover:shadow-md rounded-xl transition-all text-left group border border-transparent hover:border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                        <LogOut size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700 group-hover:text-red-600 transition-colors">Sair</p>
                        <p className="text-xs text-slate-500">{getRoleLabel()}</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
    >
        {icon}
        {label}
    </button>
);

const LandingPage = ({ onEnter }) => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col relative overflow-hidden">
        <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
                <BrandLogo size={40} />
                <span className="text-2xl font-bold text-slate-800 tracking-tight">BProjetos</span>
            </div>
            <button className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-sm">
                Agendar Demo
            </button>
        </nav>

        <div className="flex-1 flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 md:px-12 gap-12 py-12">

            <div className="md:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                    Plataforma #1 para Escolas Inovadoras
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
                    Projetos que <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Engajam Alunos</span>
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                    Centralize a gestão pedagógica, automatize o acompanhamento da BNCC e transforme atividades escolares em experiências gamificadas.
                </p>
            </div>

            <div className="md:w-1/2 w-full grid gap-4">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Acesso Rápido (Ambiente Demo)</p>

                <button onClick={() => onEnter('teacher')} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex items-center gap-6 hover:scale-105 transition-all shadow-sm hover:shadow-xl group cursor-pointer text-left border border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                        <Book size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Sou Professor</h3>
                        <p className="text-sm text-slate-500">Gerenciar projetos, turmas e rubricas.</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-blue-500 transition-colors" size={20} />
                </button>

                <button onClick={() => onEnter('student')} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex items-center gap-6 hover:scale-105 transition-all shadow-sm hover:shadow-xl group cursor-pointer text-left border border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                        <Rocket size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Sou Aluno</h3>
                        <p className="text-sm text-slate-500">Ver missões, XP e enviar atividades.</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-purple-500 transition-colors" size={20} />
                </button>

                <button onClick={() => onEnter('coordinator')} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex items-center gap-6 hover:scale-105 transition-all shadow-sm hover:shadow-xl group cursor-pointer text-left border border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                        <Grid size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Coordenação</h3>
                        <p className="text-sm text-slate-500">Monitorar Kanban e desempenho docente.</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-orange-500 transition-colors" size={20} />
                </button>
            </div>
        </div>
    </div>
);

// Calendário do Professor (Gerenciamento)
const TeacherCalendar = ({ events, onAddEvent }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventType, setNewEventType] = useState("deadline");

    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    const handleDayClick = (day) => {
        const dateStr = `2023-11-${day.toString().padStart(2, '0')}`;
        setSelectedDate(dateStr);
        setShowModal(true);
    };

    const addEvent = () => {
        if (selectedDate && newEventTitle) {
            onAddEvent({ date: selectedDate, title: newEventTitle, type: newEventType });
            setShowModal(false);
            setNewEventTitle("");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Gerenciar Calendário</h2>
                    <p className="text-slate-500">Defina entregas e reuniões para os alunos.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="grid grid-cols-7 gap-4 mb-4 text-center text-xs font-bold text-slate-400 uppercase">
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sab</div>
                </div>
                <div className="grid grid-cols-7 gap-4">
                    <div></div><div></div><div></div>
                    {daysInMonth.map(day => {
                        const dateStr = `2023-11-${day.toString().padStart(2, '0')}`;
                        const dayEvents = events.filter(e => e.date === dateStr);
                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className="min-h-[100px] border border-slate-100 rounded-xl p-2 hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition flex flex-col gap-1 relative group"
                            >
                                <span className={`text-sm font-bold ${dayEvents.length > 0 ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</span>
                                {dayEvents.map((evt, idx) => (
                                    <div key={idx} className={`text-[10px] p-1 rounded font-bold truncate ${evt.type === 'deadline' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                        {evt.title}
                                    </div>
                                ))}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-indigo-400">
                                    <Plus size={16} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-800">Novo Evento</h3>
                            <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <p className="text-xs font-bold text-indigo-500 mb-4 bg-indigo-50 inline-block px-2 py-1 rounded">{selectedDate}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                                    placeholder="Ex: Entrega Final"
                                    value={newEventTitle}
                                    onChange={e => setNewEventTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Evento</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setNewEventType("meeting")}
                                        className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold border transition-all flex flex-col items-center gap-2 ${newEventType === 'meeting' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <Users size={16} />
                                        Reunião
                                    </button>
                                    <button
                                        onClick={() => setNewEventType("deadline")}
                                        className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold border transition-all flex flex-col items-center gap-2 ${newEventType === 'deadline' ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <AlertCircle size={16} />
                                        Entrega
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={addEvent}
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Adicionar ao Calendário
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Calendário do Aluno (Visualização)
const StudentCalendar = ({ events }) => {
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Minha Agenda</h2>
                    <p className="text-slate-500">Eventos e prazos definidos pelos professores.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-xs font-bold text-slate-500 uppercase">Entregas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-bold text-slate-500 uppercase">Reuniões</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="grid grid-cols-7 gap-4 mb-4 text-center text-xs font-bold text-slate-400 uppercase">
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sab</div>
                </div>
                <div className="grid grid-cols-7 gap-4">
                    <div></div><div></div><div></div>

                    {daysInMonth.map(day => {
                        const dateStr = `2023-11-${day.toString().padStart(2, '0')}`;
                        const dayEvents = events.filter((e) => e.date === dateStr);
                        return (
                            <div
                                key={day}
                                className="min-h-[100px] border border-slate-100 rounded-xl p-2 bg-slate-50/30 flex flex-col gap-1"
                            >
                                <span className={`text-sm font-bold ${dayEvents.length > 0 ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</span>
                                {dayEvents.map((evt, idx) => (
                                    <div key={idx} className={`text-[10px] p-1 rounded font-bold truncate flex items-center gap-1 ${evt.type === 'deadline' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${evt.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                        {evt.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Chamada/Frequência do Professor com Histórico
const TeacherAttendance = () => {
    const [students, setStudents] = useState(MOCK_STUDENTS_LIST);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [saved, setSaved] = useState(false);
    const [selectedClass, setSelectedClass] = useState("1º Ano A");
    const [showHistory, setShowHistory] = useState(false);
    const [attendanceHistory] = useState([
        { date: '2023-11-28', class: '1º Ano A', present: 6, absent: 2 },
        { date: '2023-11-27', class: '1º Ano A', present: 7, absent: 1 },
        { date: '2023-11-24', class: '1º Ano A', present: 5, absent: 3 },
        { date: '2023-11-23', class: '1º Ano A', present: 8, absent: 0 },
        { date: '2023-11-22', class: '1º Ano A', present: 6, absent: 2 },
    ]);

    const toggleStatus = (id) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, status: s.status === "Presente" ? "Ausente" : "Presente" } : s
        ));
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleExport = () => {
        const data = students.map(s => `${s.name},${s.id},${s.status}`).join('\n');
        const header = 'Nome,Matrícula,Status\n';
        const csv = header + data;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chamada_${selectedClass}_${date}.csv`;
        a.click();
    };

    const handleExportHistory = () => {
        let csv = 'Data,Turma,Presentes,Ausentes,Total\n';
        attendanceHistory.forEach(record => {
            csv += `${record.date},${record.class},${record.present},${record.absent},${record.present + record.absent}\n`;
        });

        // Adiciona detalhamento por aluno
        csv += '\n\nDetalhamento por Aluno\n';
        csv += 'Data,Nome,Matrícula,Status\n';
        attendanceHistory.forEach(record => {
            students.forEach(s => {
                csv += `${record.date},${s.name},${s.id},${Math.random() > 0.2 ? 'Presente' : 'Ausente'}\n`;
            });
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historico_chamadas_${selectedClass}.csv`;
        a.click();
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Chamada Online</h2>
                    <p className="text-slate-500">Registre a frequência dos alunos.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`px-4 py-2 rounded-xl border font-semibold shadow-sm transition flex items-center gap-2 ${showHistory
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Clock size={18} />
                        {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
                    </button>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-medium"
                    >
                        <option>1º Ano A</option>
                        <option>2º Ano B</option>
                        <option>3º Ano C</option>
                    </select>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 font-medium"
                    />
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold shadow-sm transition flex items-center gap-2"
                    >
                        <Download size={18} />
                        Exportar Hoje
                    </button>
                </div>
            </div>

            {/* Histórico de Chamadas */}
            {showHistory && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Histórico de Chamadas - {selectedClass}</h3>
                        <button
                            onClick={handleExportHistory}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2"
                        >
                            <Download size={16} />
                            Exportar Histórico Completo
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Presentes</th>
                                    <th className="px-6 py-4">Ausentes</th>
                                    <th className="px-6 py-4">Taxa de Presença</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {attendanceHistory.map((record, idx) => {
                                    const total = record.present + record.absent;
                                    const percentage = ((record.present / total) * 100).toFixed(0);
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-bold text-slate-700">
                                                {new Date(record.date).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                                    {record.present}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                                                    {record.absent}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-slate-100 h-2 rounded-full">
                                                        <div
                                                            className={`h-full rounded-full ${percentage >= 80 ? 'bg-green-500' :
                                                                percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">{percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${percentage >= 80 ? 'bg-green-100 text-green-700' :
                                                    percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {percentage >= 80 ? 'Excelente' : percentage >= 60 ? 'Regular' : 'Crítico'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Chamada do Dia */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800">Lista de Alunos - {new Date(date).toLocaleDateString('pt-BR')}</h3>
                    <div className="flex gap-2">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            {students.filter(s => s.status === "Presente").length} Presentes
                        </span>
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                            {students.filter(s => s.status === "Ausente").length} Ausentes
                        </span>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {students.map(student => (
                        <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                                <span className="font-bold text-slate-700">{student.name}</span>
                            </div>
                            <button
                                onClick={() => toggleStatus(student.id)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${student.status === "Presente"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                    }`}
                            >
                                {student.status === "Presente" ? <Check size={16} /> : <X size={16} />}
                                {student.status}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                        {saved ? <Check size={20} /> : <ClipboardList size={20} />}
                        {saved ? "Salvo!" : "Salvar Chamada"}
                    </button>
                </div>
            </div>
        </div>
    );
};


// Planejamento & Feedback do Professor

// NOTE: TeacherPerformance component is now imported from /src/components/TeacherPerformance.jsx

// Gestão de Turmas
const TeacherClasses = () => {
    const [view, setView] = useState("list");
    const [selectedClass, setSelectedClass] = useState(null);

    const classes = [
        { name: '1º Ano A', students: 32, engagement: 75, theme: 'blue' },
        { name: '2º Ano B', students: 28, engagement: 82, theme: 'purple' },
        { name: '3º Ano C', students: 30, engagement: 68, theme: 'orange' }
    ];

    if (view === "details" && selectedClass) {
        return (
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => setView("list")}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
                >
                    <ChevronLeft size={20} /> Voltar para Turmas
                </button>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">{selectedClass}</h2>
                    <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">
                        Exportar Lista
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Estudante</th>
                                <th className="px-6 py-4">Matrícula</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_STUDENTS_LIST.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-3">
                                        <img src={student.avatar} className="w-8 h-8 rounded-full bg-slate-100" />
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono">2023{student.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Matriculado</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Minhas Turmas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((c, i) => (
                    <div
                        key={i}
                        onClick={() => { setSelectedClass(c.name); setView("details"); }}
                        className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group"
                    >
                        <div className="flex justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{c.name}</h3>
                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{c.students} Alunos</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div
                                className={`h-full ${c.theme === 'blue' ? 'bg-indigo-500' : c.theme === 'purple' ? 'bg-purple-500' : 'bg-orange-500'}`}
                                style={{ width: `${c.engagement}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-400 flex justify-between">
                            <span>Engajamento</span>
                            <span className="font-bold text-slate-600">{c.engagement}%</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};



// Rubricas de Avaliação EDITÁVEL
const TeacherRubrics = () => {
    const [rubrics, setRubrics] = useState(MOCK_RUBRIC);
    const [editingCell, setEditingCell] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [projectName, setProjectName] = useState("Horta Sustentável Urbana");
    const [isEditingProject, setIsEditingProject] = useState(false);

    const handleStartEdit = (rowIdx, colIdx, currentValue) => {
        setEditingCell({ row: rowIdx, col: colIdx });
        setEditValue(currentValue);
    };

    const handleSaveEdit = () => {
        if (editingCell) {
            const { row, col } = editingCell;
            const newRubrics = [...rubrics];
            if (col === 'criteria') {
                newRubrics[row].criteria = editValue;
            } else if (col === 'weight') {
                newRubrics[row].weight = parseInt(editValue) || 0;
            } else {
                newRubrics[row].levels[col] = editValue;
            }
            setRubrics(newRubrics);
        }
        setEditingCell(null);
        setEditValue("");
    };

    const addCriteria = () => {
        setRubrics([...rubrics, {
            criteria: "Novo Critério",
            weight: 10,
            levels: ["", "", "", ""]
        }]);
    };

    const removeCriteria = (idx) => {
        setRubrics(rubrics.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Rubricas de Avaliação</h2>
                    <p className="text-slate-500">Crie e edite critérios para os projetos.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={addCriteria}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 flex items-center gap-2 transition shadow-lg shadow-indigo-200"
                    >
                        <Plus size={18} /> Adicionar Critério
                    </button>
                    <button className="bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 flex items-center gap-2 transition shadow-sm">
                        <Download size={18} /> Exportar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    {isEditingProject ? (
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onBlur={() => setIsEditingProject(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingProject(false)}
                            className="font-bold text-lg text-slate-800 border-b-2 border-indigo-500 outline-none bg-transparent"
                            autoFocus
                        />
                    ) : (
                        <h3
                            onClick={() => setIsEditingProject(true)}
                            className="font-bold text-lg text-slate-800 cursor-pointer hover:text-indigo-600 transition"
                        >
                            Projeto: {projectName} <Edit size={14} className="inline ml-2 opacity-50" />
                        </h3>
                    )}
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">Editável</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 font-bold text-slate-700">Critério & Peso</th>
                                <th className="px-6 py-4 font-semibold text-red-500">Insuficiente (1)</th>
                                <th className="px-6 py-4 font-semibold text-orange-500">Básico (2)</th>
                                <th className="px-6 py-4 font-semibold text-blue-500">Proficiente (3)</th>
                                <th className="px-6 py-4 font-semibold text-green-600">Avançado (4)</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rubrics.map((row, rowIdx) => (
                                <tr key={rowIdx} className="hover:bg-slate-50 transition group">
                                    <td className="px-6 py-6 align-top">
                                        {editingCell?.row === rowIdx && editingCell?.col === 'criteria' ? (
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={handleSaveEdit}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                                className="font-bold text-slate-800 text-base border-b-2 border-indigo-500 outline-none w-full"
                                                autoFocus
                                            />
                                        ) : (
                                            <p
                                                onClick={() => handleStartEdit(rowIdx, 'criteria', row.criteria)}
                                                className="font-bold text-slate-800 text-base cursor-pointer hover:text-indigo-600"
                                            >
                                                {row.criteria}
                                            </p>
                                        )}

                                        {editingCell?.row === rowIdx && editingCell?.col === 'weight' ? (
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={handleSaveEdit}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                                className="text-xs font-bold text-slate-400 uppercase mt-1 border-b-2 border-indigo-500 outline-none w-20"
                                                autoFocus
                                            />
                                        ) : (
                                            <p
                                                onClick={() => handleStartEdit(rowIdx, 'weight', row.weight.toString())}
                                                className="text-xs font-bold text-slate-400 uppercase mt-1 cursor-pointer hover:text-indigo-600"
                                            >
                                                Peso: {row.weight}%
                                            </p>
                                        )}
                                    </td>
                                    {row.levels.map((level, lvlIdx) => (
                                        <td key={lvlIdx} className="px-6 py-6 align-top">
                                            {editingCell?.row === rowIdx && editingCell?.col === lvlIdx ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={handleSaveEdit}
                                                    className="w-full text-slate-600 border-2 border-indigo-500 rounded-lg p-2 outline-none resize-none"
                                                    rows={3}
                                                    autoFocus
                                                />
                                            ) : (
                                                <p
                                                    onClick={() => handleStartEdit(rowIdx, lvlIdx, level)}
                                                    className="text-slate-600 cursor-pointer hover:text-slate-800 hover:bg-slate-100 p-2 rounded transition"
                                                >
                                                    {level || "Clique para editar..."}
                                                </p>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-6 align-top">
                                        <button
                                            onClick={() => removeCriteria(rowIdx)}
                                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 text-red-500 rounded-lg transition"
                                            title="Remover critério"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-sm text-slate-500">
                        <strong>Dica:</strong> Clique em qualquer campo para editar. Pressione Enter para salvar.
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition">
                            Cancelar
                        </button>
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2">
                            <Save size={16} />
                            Salvar Rubrica
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Lista de Professores (Coordenador)
const CoordinatorTeachersList = () => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Corpo Docente</h2>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                    <tr>
                        <th className="px-6 py-4">Nome</th>
                        <th className="px-6 py-4">Disciplina</th>
                        <th className="px-6 py-4">Projetos</th>
                        <th className="px-6 py-4">Avaliação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_TEACHERS.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-3">
                                <img src={t.avatar} className="w-8 h-8 rounded-full" />
                                {t.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{t.subject}</td>
                            <td className="px-6 py-4 text-slate-600">{t.projects} ativos</td>
                            <td className="px-6 py-4 font-bold text-green-600">{t.rating} ★</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// Métricas (Coordenador)
const CoordinatorMetrics = () => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Indicadores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-sm font-bold uppercase">Conclusão</p>
                <p className="text-4xl font-extrabold text-indigo-600 mt-2">92%</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-sm font-bold uppercase">Satisfação</p>
                <p className="text-4xl font-extrabold text-green-500 mt-2">4.8</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-sm font-bold uppercase">Engajamento</p>
                <p className="text-4xl font-extrabold text-purple-500 mt-2">87%</p>
            </div>
        </div>
    </div>
);

// Detalhes do Projeto
const ProjectDetails = ({ project, onBack }) => {
    const [activeSection, setActiveSection] = useState('overview');

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
            >
                <ChevronLeft size={20} /> Voltar para Dashboard
            </button>

            {/* Header do Projeto */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm`}>
                                {project.subject}
                            </span>
                            <h1 className="text-4xl font-extrabold mt-3">{project.title}</h1>
                            <p className="text-indigo-100 mt-2">Professor: {project.teacher}</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                <p className="text-xs font-bold opacity-80">Progresso</p>
                                <p className="text-3xl font-extrabold">{project.progress}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Users size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-bold">{project.students}</p>
                            <p className="text-xs opacity-80">Alunos</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Clock size={20} className="mb-2 opacity-80" />
                            <p className="text-lg font-bold">{project.nextDeadline}</p>
                            <p className="text-xs opacity-80">Próximo prazo</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <AlertCircle size={20} className="mb-2 opacity-80" />
                            <p className="text-lg font-bold">{project.status}</p>
                            <p className="text-xs opacity-80">Status</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs de Navegação */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 p-2 flex gap-2">
                <button
                    onClick={() => setActiveSection('overview')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition ${activeSection === 'overview'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <BarChart2 size={16} className="inline mr-2" />
                    Visão Geral
                </button>
                <button
                    onClick={() => setActiveSection('timeline')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition ${activeSection === 'timeline'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <Clock size={16} className="inline mr-2" />
                    Cronograma
                </button>
                <button
                    onClick={() => setActiveSection('students')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition ${activeSection === 'students'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <Users size={16} className="inline mr-2" />
                    Alunos
                </button>
                <button
                    onClick={() => setActiveSection('collaborators')}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition ${activeSection === 'collaborators'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <Users size={16} className="inline mr-2" />
                    Colaboradores
                </button>
            </div>

            {/* Conteúdo das Tabs */}
            {activeSection === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <Target size={20} className="text-indigo-600" />
                            Objetivos de Aprendizagem
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-slate-600">Desenvolver pensamento científico através da observação</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-slate-600">Aplicar conceitos matemáticos em contexto prático</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check size={16} className="text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-slate-600">Trabalhar colaborativamente em equipes</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <Book size={20} className="text-indigo-600" />
                            Competências BNCC
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-600">Conhecimento</span>
                                    <span className="text-sm font-bold text-indigo-600">{project.bnccCoverage || 0}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${project.bnccCoverage || 0}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-600">Pensamento Científico</span>
                                    <span className="text-sm font-bold text-indigo-600">92%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '92%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-600">Trabalho em Equipe</span>
                                    <span className="text-sm font-bold text-indigo-600">78%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 lg:col-span-2">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-indigo-600" />
                            Descrição do Projeto
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            Os alunos desenvolverão uma horta sustentável na escola, aplicando conceitos de biologia,
                            matemática e sustentabilidade. O projeto envolve pesquisa sobre plantas adequadas ao clima local,
                            cálculos de área e espaçamento, além de documentação fotográfica e relatórios semanais de crescimento.
                        </p>
                    </div>
                </div>
            )}

            {activeSection === 'timeline' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">Linha do Tempo</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <Check size={20} />
                                </div>
                                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <p className="font-bold text-slate-800">Planejamento Inicial</p>
                                <p className="text-sm text-slate-500 mt-1">Concluído em 15/10/2023</p>
                                <p className="text-sm text-slate-600 mt-2">Definição de objetivos, formação de equipes e pesquisa inicial.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 animate-pulse">
                                    <Clock size={20} />
                                </div>
                                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <p className="font-bold text-slate-800">Preparação do Solo</p>
                                <p className="text-sm text-slate-500 mt-1">Em andamento</p>
                                <p className="text-sm text-slate-600 mt-2">Preparação da área, análise do solo e compra de insumos.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <AlertCircle size={20} />
                                </div>
                                <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <p className="font-bold text-slate-400">Plantio</p>
                                <p className="text-sm text-slate-400 mt-1">Previsto para 20/11/2023</p>
                                <p className="text-sm text-slate-400 mt-2">Plantio das sementes e criação do sistema de irrigação.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Star size={20} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-400">Apresentação Final</p>
                                <p className="text-sm text-slate-400 mt-1">Previsto para 15/12/2023</p>
                                <p className="text-sm text-slate-400 mt-2">Relatório final, apresentação de resultados e colheita.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'students' && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-lg text-slate-800">Alunos Participantes</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {MOCK_STUDENTS_LIST.slice(0, 6).map((student) => (
                            <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                                <div className="flex items-center gap-3">
                                    <img src={student.avatar} className="w-10 h-10 rounded-full bg-slate-100" />
                                    <div>
                                        <p className="font-bold text-slate-700">{student.name}</p>
                                        <p className="text-xs text-slate-400">Equipe Alpha</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-indigo-600">85%</span>
                                    <div className="w-20 bg-slate-100 h-2 rounded-full">
                                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'collaborators' && (
                <GerenciadorColaboradores projetoId={project.id} projetoTitulo={project.title} />
            )}
        </div>
    );
};

// Dashboard do Professor
const TeacherDashboard = ({ projects, onProjectClick }) => {
    const [filterBncc, setFilterBncc] = useState('all');

    const filteredProjects = projects.filter(p => {
        if (filterBncc === 'all') return true;
        if (filterBncc === 'high') return (p.bnccCoverage || 0) >= 80;
        if (filterBncc === 'low') return (p.bnccCoverage || 0) < 80;
        return true;
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Painel do Professor</h2>
                    <p className="text-slate-500">Visão geral dos projetos em andamento.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            value={filterBncc}
                            onChange={(e) => setFilterBncc(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8 cursor-pointer"
                        >
                            <option value="all">Todos os Projetos</option>
                            <option value="high">Alta Cobertura BNCC</option>
                            <option value="low">Baixa Cobertura BNCC</option>
                        </select>
                        <Filter size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                    <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2">
                        <Plus size={18} /> Novo Projeto
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((p) => (
                    <ProjetoCardComRole
                        key={p.id}
                        projeto={p}
                        role={p.role || (p.teacher === 'Você' ? 'owner' : 'collaborator')} // Fallback logic if API doesn't return role yet
                        onClick={onProjectClick}
                    />
                ))}
            </div>
        </div>
    );
};

// Home do Aluno com modal de envio
const StudentHome = ({ projects, onProjectClick }) => {
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedProjectForSubmit, setSelectedProjectForSubmit] = useState(null);
    const [submitType, setSubmitType] = useState('file');
    const [linkUrl, setLinkUrl] = useState('');
    const [comment, setComment] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleOpenSubmit = (project) => {
        setSelectedProjectForSubmit(project);
        setShowSubmitModal(true);
    };

    const handleSubmit = () => {
        setShowSubmitModal(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        setLinkUrl('');
        setComment('');
        setSelectedProjectForSubmit(null);
    };

    return (
        <div className="space-y-8">
            {showSuccessToast && (
                <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl shadow-green-200 animate-fade-in flex items-center gap-3 z-50">
                    <div className="bg-white/20 rounded-full p-1"><Check size={16} /></div>
                    <div><p className="font-bold text-sm">Sucesso!</p><p className="text-xs opacity-90">Atividade entregue.</p></div>
                </div>
            )}

            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Olá, João! 👋</h2>
                        <p className="text-indigo-100">Você tem <span className="font-bold bg-white/20 px-2 py-0.5 rounded">2 missões</span> pendentes.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase opacity-70 mb-1">Nível 5</p>
                        <div className="text-4xl font-extrabold tracking-tight">1.250 XP</div>
                    </div>
                </div>
                <div className="mt-6 bg-black/20 h-2 rounded-full overflow-hidden backdrop-blur-md">
                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Meus Projetos Ativos</h3>
                <div className="grid gap-4">
                    {projects.slice(0, 2).map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0 ${p.theme === 'green' ? 'bg-green-500' :
                                        p.theme === 'red' ? 'bg-red-500' : 'bg-indigo-500'
                                        }`}>
                                        <Book size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{p.deadlineLabel}</h4>
                                        <p className="text-sm text-slate-500">{p.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">Prazo: {p.nextDeadline}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onProjectClick && onProjectClick(p)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-sm transition flex items-center gap-2"
                                    >
                                        <Grid size={16} />
                                        Área de Trabalho
                                    </button>
                                    <button
                                        onClick={() => handleOpenSubmit(p)}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition"
                                    >
                                        Enviar Entrega
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Envio de Evidências */}
            {showSubmitModal && selectedProjectForSubmit && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Enviar Entrega</h3>
                            <button onClick={() => setShowSubmitModal(false)} className="hover:bg-slate-200 p-1 rounded-full transition">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-slate-500 mb-4">Atividade: <strong className="text-slate-700">{selectedProjectForSubmit.deadlineLabel}</strong></p>
                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={() => setSubmitType('file')}
                                    className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${submitType === 'file' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-inner' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <Upload size={24} />
                                    <span className="text-xs font-bold uppercase tracking-wide">Arquivo</span>
                                </button>
                                <button
                                    onClick={() => setSubmitType('link')}
                                    className={`flex-1 py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${submitType === 'link' ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-inner' : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <Link size={24} />
                                    <span className="text-xs font-bold uppercase tracking-wide">Link</span>
                                </button>
                            </div>

                            {submitType === 'file' ? (
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer group">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-sm text-slate-600 font-semibold">Clique para selecionar</p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG (Max 10MB)</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">URL do Trabalho</label>
                                    <input
                                        type="url"
                                        placeholder="https://docs.google.com/..."
                                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        value={linkUrl}
                                        onChange={e => setLinkUrl(e.target.value)}
                                    />
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                        <Check size={12} /> Drive, YouTube, Canva suportados.
                                    </p>
                                </div>
                            )}

                            <div className="mt-6">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Comentário</label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-lg h-24 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    placeholder="Adicione uma observação para o professor..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 flex items-center gap-2 transition hover:-translate-y-0.5"
                            >
                                Enviar Agora
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Kanban de Equipe do Aluno
const StudentTeamKanban = ({ project, onBack }) => {
    const [tasks, setTasks] = useState(project.tasks && project.tasks.length > 0 ? project.tasks : [
        { id: 't1', title: 'Pesquisar tema', status: 'done', assignee: 'Eu' },
        { id: 't2', title: 'Criar slides', status: 'in-progress', assignee: 'Maria' },
        { id: 't3', title: 'Gravar vídeo', status: 'todo', assignee: 'João' }
    ]);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const moveTask = (taskId, newStatus) => {
        setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const addTask = (status) => {
        if (!newTaskTitle) return;
        const newTask = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTaskTitle,
            status,
            assignee: 'Eu'
        };
        setTasks([...tasks, newTask]);
        setNewTaskTitle("");
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    const columns = [
        { id: 'todo', label: 'A Fazer', color: 'bg-slate-100', dot: 'bg-slate-400' },
        { id: 'in-progress', label: 'Em Progresso', color: 'bg-blue-50', dot: 'bg-blue-500' },
        { id: 'done', label: 'Concluído', color: 'bg-green-50', dot: 'bg-green-500' }
    ];

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col">
            <button
                onClick={onBack}
                className="mb-4 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
            >
                <ChevronLeft size={20} /> Voltar para Projetos
            </button>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Área de Trabalho da Equipe</h2>
                    <p className="text-slate-500">Projeto: <span className="font-bold text-indigo-600">{project.title}</span></p>
                </div>
                <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">Eu</div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">M</div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white">J</div>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden pb-2">
                {columns.map(col => (
                    <div key={col.id} className={`rounded-2xl p-4 flex flex-col h-full border border-slate-200/60 ${col.color}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${col.dot}`}></span>
                                {col.label}
                            </h3>
                            <span className="text-xs font-bold bg-white px-2 py-0.5 rounded text-slate-400 shadow-sm">
                                {tasks.filter((t) => t.status === col.id).length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {tasks.filter((t) => t.status === col.id).map((task) => (
                                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group relative">
                                    <p className="font-semibold text-slate-800 text-sm mb-2">{task.title}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{task.assignee}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                                            {col.id !== 'todo' && (
                                                <button
                                                    onClick={() => moveTask(task.id, col.id === 'done' ? 'in-progress' : 'todo')}
                                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                                                    title="Mover para trás"
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                            )}
                                            {col.id !== 'done' && (
                                                <button
                                                    onClick={() => moveTask(task.id, col.id === 'todo' ? 'in-progress' : 'done')}
                                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                                                    title="Avançar"
                                                >
                                                    <ArrowRight size={14} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600"
                                                title="Excluir"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {col.id === 'todo' && (
                            <div className="mt-4 pt-4 border-t border-slate-200/50">
                                <input
                                    type="text"
                                    placeholder="+ Nova tarefa..."
                                    className="w-full bg-white p-3 rounded-xl text-sm border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                    value={newTaskTitle}
                                    onChange={e => setNewTaskTitle(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addTask('todo')}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
const StudentAchievements = () => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Sala de Troféus</h2>
        <p className="text-slate-500 mb-8">Conquiste emblemas completando desafios.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_ACHIEVEMENTS.map(a => {
                const IconComponent = {
                    "Zap": Zap,
                    "TrendingUp": TrendingUp,
                    "Star": Star,
                    "Video": Video,
                    "Target": Target
                }[a.icon] || Award;

                return (
                    <div key={a.id} className={`p-6 rounded-2xl border transition-all relative overflow-hidden ${a.unlocked
                        ? 'bg-white border-indigo-100 shadow-lg'
                        : 'bg-slate-50 border-slate-200 opacity-70'
                        }`}>
                        {a.unlocked && (
                            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                                DESBLOQUEADO
                            </div>
                        )}

                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner ${a.unlocked ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'
                            }`}>
                            <IconComponent size={28} strokeWidth={2} />
                        </div>

                        <h3 className="font-bold text-slate-800 text-lg">{a.title}</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-4">{a.desc}</p>

                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${a.unlocked ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-300'
                                    }`}
                                style={{ width: `${(a.progress / a.total) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-right mt-1 font-bold text-slate-400">{a.progress}/{a.total}</p>
                    </div>
                );
            })}
        </div>
    </div>
);

// Kanban do Coordenador
const CoordinatorKanban = ({ projects }) => (
    <div className="h-full flex flex-col">
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Kanban Geral</h2>
            <p className="text-slate-500">Acompanhamento macro da escola.</p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 flex-1">
            {["Planejamento", "Em Andamento", "Para Avaliação", "Atrasado"].map(status => (
                <div key={status} className="min-w-[300px] bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">{status}</h3>
                        <span className="bg-white px-2 py-0.5 rounded text-xs font-bold text-slate-400 shadow-sm">
                            {projects.filter((p) =>
                                (status === "Atrasado" && (p.status === "Atrasado" || p.delayed)) ||
                                (p.status === status && status !== "Atrasado")
                            ).length}
                        </span>
                    </div>
                    <div className="space-y-3 overflow-y-auto flex-1">
                        {projects
                            .filter((p) =>
                                (status === "Atrasado" && (p.status === "Atrasado" || p.delayed)) ||
                                (p.status === status && status !== "Atrasado")
                            )
                            .map((p) => (
                                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-bold text-sm text-slate-800 leading-tight">{p.title}</h4>
                                        {status === "Atrasado" && <AlertCircle size={14} className="text-red-500" />}
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">{p.teacher}</p>
                                    <div className={`h-1.5 rounded-full w-full ${status === 'Atrasado' ? 'bg-red-100' : 'bg-indigo-100'}`}>
                                        <div
                                            className={`h-full rounded-full ${status === 'Atrasado' ? 'bg-red-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${p.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

function App() {
    return (
        <Routes>
            <Route path="/convite/aceitar/:token" element={<AceitarConvite />} />
            <Route path="*" element={<DashboardApp />} />
        </Routes>
    );
}

function DashboardApp() {
    const [viewState, setViewState] = useState('landing');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [role, setRole] = useState('teacher');
    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState(MOCK_PROJECTS);
    const [calendarEvents, setCalendarEvents] = useState(INITIAL_EVENTS);
    const [selectedProject, setSelectedProject] = useState(null);

    // Fetch real projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');
            if (token && role === 'teacher') {
                try {
                    const response = await fetch('/api/coteaching/meus-projetos', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (data.sucesso && data.dados.length > 0) {
                        // Merge API data with mocks or replace.
                        // For now we will append or replace if we have real data to show connectivity.
                        // Mapping API structure to frontend structure might be needed.
                        const apiProjects = data.dados.map(p => ({
                            id: p.id,
                            title: p.titulo,
                            subject: "Geral", // Check if backend has subject
                            status: p.status || "Em Andamento",
                            progress: p.progresso || 0,
                            students: p.totalAlunos || 0,
                            nextDeadline: "Indefinido",
                            deadlineLabel: "Próxima Entrega",
                            theme: "indigo",
                            teacher: "Você",
                            delayed: false,
                            tasks: [],
                            bnccCoverage: 0,
                            role: p.papel // owner or collaborator
                        }));
                        setProjects(apiProjects);
                    }
                } catch (error) {
                    console.error("Erro ao buscar projetos:", error);
                }
            }
        };

        if (currentUser) {
            fetchProjects();
        }
    }, [currentUser, role]);

    useEffect(() => {
        const user = AuthManager.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setRole(user.role);
            setViewState('app');
            if (user.role === 'coordinator') setActiveTab('kanban');
            else if (user.role === 'student') setActiveTab('student-home');
            else setActiveTab('dashboard');
        }
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setRole(user.role);
        setViewState('app');
        if (user.role === 'coordinator') setActiveTab('kanban');
        else if (user.role === 'student') setActiveTab('student-home');
        else setActiveTab('dashboard');
    };

    const handleLogout = () => {
        AuthManager.logout();
        setCurrentUser(null);
        setViewState('landing');
        setActiveTab('dashboard');
        setSelectedProject(null);
    };

    const handleAddCalendarEvent = (newEvent) => {
        setCalendarEvents([...calendarEvents, newEvent]);
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleBackFromProject = () => {
        setSelectedProject(null);
    };

    const renderContent = () => {
        // Se há projeto selecionado no dashboard do professor
        if (selectedProject && role === 'teacher' && activeTab === 'dashboard') {
            return <ProjectDetails project={selectedProject} onBack={handleBackFromProject} />;
        }

        // Se há projeto selecionado na visão do aluno
        if (selectedProject && role === 'student' && (activeTab === 'student-home' || activeTab === 'projects')) {
            return <StudentTeamKanban project={selectedProject} onBack={handleBackFromProject} />;
        }

        if (role === 'teacher') {
            if (activeTab === 'dashboard') return <ProfessorDashboard />;
            if (activeTab === 'classes' || activeTab === 'manage-classes') return <TeacherClassManager />;
            if (activeTab === 'attendance') return <TeacherAttendance />;
            if (activeTab === 'calendar') return <TeacherCalendar events={calendarEvents} onAddEvent={handleAddCalendarEvent} />;
            if (activeTab === 'planning') return <ProjectWizardBNCC />;
            if (activeTab === 'performance') return <TeacherPerformance />;
            if (activeTab === 'messages') return <MessagingSystemV2 userRole="teacher" currentUserId={currentUser?.id || 1} currentUserName={currentUser?.name || 'Professor'} />;
            if (activeTab === 'reports') return <TeacherReportsEditavel />;
            if (activeTab === 'rubrics') return <TeacherRubricEditablePoints />;
            if (activeTab === 'bncc') return <TeacherBnccPage projectId={1} classId={1} />;
            // if (activeTab === 'copiloto-ia') return <CopilotoIA projectId={selectedProject?.id} role={role} />;
            // if (activeTab === 'early-warning') return <EarlyWarning />;
            // if (activeTab === 'missoes') return <MissoesColaborativas />;
            // if (activeTab === 'portfolio') return <PortfolioDigital />;
            // if (activeTab === 'ecossistema') return <EcossistemaConectado />;
            return <div className="text-center py-20"><h3 className="text-2xl font-bold text-slate-800 mb-2">Em desenvolvimento</h3><p className="text-slate-500">Esta funcionalidade será implementada em breve!</p></div>;
        }
        if (role === 'coordinator') {
            if (activeTab === 'kanban') return <CoordinatorKanban projects={projects} />;
            if (activeTab === 'teachers') return <CoordinatorTeachersList />;
            if (activeTab === 'metrics') return <CoordinatorMetrics />;
            if (activeTab === 'coordinator-advanced') return <CoordinatorAdvanced />;
            return <div className="text-center py-20"><h3 className="text-2xl font-bold text-slate-800 mb-2">Em desenvolvimento</h3><p className="text-slate-500">Esta funcionalidade será implementada em breve!</p></div>;
        }
        if (role === 'student') {
            if (activeTab === 'student-home' || activeTab === 'projects') return <StudentDashboard currentUserId={currentUser?.id || 101} />;
            if (activeTab === 'progress') return <StudentProgressDashboard />;
            if (activeTab === 'grades') return <StudentGrades />;
            if (activeTab === 'achievements') return <StudentAchievements />;
            if (activeTab === 'calendar') return <StudentCalendar events={calendarEvents} />;
            if (activeTab === 'messages') return <MessagingSystemV2 userRole="student" currentUserId={currentUser?.id || 101} currentUserName={currentUser?.name || 'Aluno'} />;
            if (activeTab === 'notifications') return <NotificationCenter />;
            if (activeTab === 'skills') return <StudentBnccPage studentId={currentUser?.id || 101} />;
            return <div className="text-center py-20"><h3 className="text-2xl font-bold text-slate-800 mb-2">Em desenvolvimento</h3><p className="text-slate-500">Esta funcionalidade será implementada em breve!</p></div>;
        }
        return <div className="text-center py-20"><h3 className="text-2xl font-bold text-slate-800 mb-2">Sistema BProjetos</h3><p className="text-slate-500">Navegue pelo menu lateral para explorar as funcionalidades!</p></div>;
    };

    if (viewState === 'landing') return <LoginScreen onLogin={handleLogin} />;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={role} onLogout={handleLogout} currentUser={currentUser} />
            <main className="flex-1 ml-72 p-8 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xs font-extrabold uppercase text-indigo-400 tracking-widest mb-1">Ambiente</h2>
                        <div className="text-sm font-bold text-slate-600 bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100 inline-block">Demo v5.0</div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm border border-slate-100 pr-4">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || role}`} className="w-8 h-8 rounded-full bg-slate-100" />
                        <div className="text-xs text-right">
                            <p className="font-bold text-slate-700 capitalize">{currentUser?.name || role}</p>
                        </div>
                    </div>
                </div>
                {renderContent()}
            </main>
        </div>
    );
}


export default App;