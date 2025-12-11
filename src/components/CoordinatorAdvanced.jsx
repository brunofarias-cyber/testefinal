import React, { useState } from "react";
import {
    BarChart2, TrendingUp, AlertCircle, Users, Clock, CheckCircle, Download,
    Filter, Search, Calendar, PieChart, Target, Award, Mail, MessageSquare,
    ChevronDown, ChevronUp, Eye, ArrowRight, Plus, Trash2
} from "lucide-react";
import CommunicationHub from "./CommunicationHub";

const MOCK_COORDINATOR_DATA = {
    totalStudents: 245,
    totalTeachers: 18,
    totalProjects: 24,
    averageGrade: 8.2,
    attendanceRate: 92,
    atRiskStudents: 12,
    projects: [
        { id: 1, title: "Horta Sustentável", status: "Em Andamento", progress: 65, teacher: "Ana Silva", students: 45, avgGrade: 8.9 },
        { id: 2, title: "Robótica", status: "Em Andamento", progress: 60, teacher: "Roberto Lima", students: 38, avgGrade: 8.3 },
        { id: 3, title: "Jornal Digital", status: "Planejamento", progress: 15, teacher: "Carlos Souza", students: 42, avgGrade: null },
    ]
};

const CoordinatorAdvanced = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [expandedProject, setExpandedProject] = useState(null);

    // ========== 1. DASHBOARD DE SAÚDE ESCOLAR ==========
    const SchoolHealth = () => (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">📊 Saúde Escolar</h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Alunos</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{MOCK_COORDINATOR_DATA.totalStudents}</p>
                    <p className="text-xs text-green-600 mt-1">↑ +5 este mês</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Professores</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{MOCK_COORDINATOR_DATA.totalTeachers}</p>
                    <p className="text-xs text-slate-500 mt-1">Ativos</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Média Geral</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{MOCK_COORDINATOR_DATA.averageGrade}</p>
                    <p className="text-xs text-slate-500 mt-1">Todos alunos</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Frequência</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{MOCK_COORDINATOR_DATA.attendanceRate}%</p>
                    <p className="text-xs text-slate-500 mt-1">Média escola</p>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase">Em Risco</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{MOCK_COORDINATOR_DATA.atRiskStudents}</p>
                    <p className="text-xs text-red-600 mt-1">⚠️ Atenção</p>
                </div>
            </div>

            {/* Alunos em Risco */}
            <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-6">
                <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} /> {MOCK_COORDINATOR_DATA.atRiskStudents} Alunos em Risco
                </h3>
                <div className="space-y-2">
                    {[
                        { name: "Pedro Santos", issue: "Baixa frequência (75%)", action: "Contatar responsáveis" },
                        { name: "Lucas Silva", issue: "Notas em queda", action: "Oferecer reforço" },
                        { name: "Marina Costa", issue: "Desengajamento", action: "Conversar com aluno" }
                    ].map((student, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                                <p className="text-xs text-slate-600">{student.issue}</p>
                            </div>
                            <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200">
                                {student.action}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ========== 2. GESTÃO DE PROJETOS MACRO ==========
    const ProjectManagement = () => (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800">📋 Gestão de Projetos</h2>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">
                    <Plus size={18} className="inline mr-2" /> Novo Projeto
                </button>
            </div>

            <div className="space-y-4">
                {MOCK_COORDINATOR_DATA.projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div
                            onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                            className="p-6 cursor-pointer flex items-center justify-between hover:bg-slate-50"
                        >
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-800">{project.title}</h3>
                                <p className="text-sm text-slate-500">Prof. {project.teacher} • {project.students} alunos</p>
                            </div>
                            <div className="text-right mr-4">
                                <div className="w-24 bg-slate-100 h-2 rounded-full mb-1">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                                </div>
                                <p className="text-sm font-bold text-slate-800">{project.progress}%</p>
                            </div>
                            {expandedProject === project.id ? <ChevronUp /> : <ChevronDown />}
                        </div>

                        {expandedProject === project.id && (
                            <div className="border-t border-slate-100 p-6 bg-slate-50">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                                        <p className="font-bold text-slate-800">{project.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Participantes</p>
                                        <p className="font-bold text-slate-800">{project.students} alunos</p>
                                    </div>
                                    {project.avgGrade && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Média</p>
                                            <p className="font-bold text-green-600">{project.avgGrade}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-sm font-bold hover:bg-indigo-100">
                                        <Eye size={14} className="inline mr-1" /> Ver Detalhes
                                    </button>
                                    <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-sm font-bold hover:bg-slate-200">
                                        <Download size={14} className="inline mr-1" /> Exportar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    // ========== 3. RELATÓRIO PEDAGÓGICO ==========
    const PedagogicalReport = () => (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">📈 Relatório Pedagógico</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Desempenho por Disciplina */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Desempenho por Disciplina</h3>
                    <div className="space-y-3">
                        {[
                            { subject: "Ciências", avg: 8.7, color: "bg-green-500" },
                            { subject: "Português", avg: 8.2, color: "bg-blue-500" },
                            { subject: "Matemática", avg: 7.8, color: "bg-purple-500" },
                            { subject: "História", avg: 8.4, color: "bg-orange-500" }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-24 text-sm font-bold text-slate-700">{item.subject}</div>
                                <div className="flex-1 bg-slate-100 h-3 rounded-full">
                                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.avg * 10}%` }}></div>
                                </div>
                                <div className="text-sm font-bold text-slate-700 w-8 text-right">{item.avg}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Competências BNCC */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Competências BNCC - Cobertura</h3>
                    <div className="space-y-3">
                        {[
                            { comp: "Pensamento Científico", pct: 85 },
                            { comp: "Comunicação", pct: 78 },
                            { comp: "Cultura Digital", pct: 92 },
                            { comp: "Trabalho e Projeto de Vida", pct: 65 }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-32 text-sm font-bold text-slate-700">{item.comp}</div>
                                <div className="flex-1 bg-slate-100 h-3 rounded-full">
                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${item.pct}%` }}></div>
                                </div>
                                <div className="text-sm font-bold text-slate-700 w-8 text-right">{item.pct}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recomendações */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
                <h3 className="font-bold text-indigo-900 mb-4">💡 Recomendações para Próximo Semestre</h3>
                <ul className="space-y-2 text-sm text-indigo-900">
                    <li>• Aumentar projetos de "Trabalho e Projeto de Vida" (atualmente 65%)</li>
                    <li>• Oferecer treinamento em Cultura Digital para professores (92% atingido - manter!)</li>
                    <li>• Revisar metodologia de avaliação em Comunicação (78% abaixo da meta)</li>
                    <li>• Integrar mais componentes práticos nas aulas (Pensamento Científico excelente)</li>
                </ul>
            </div>
        </div>
    );

    // ========== RENDER ==========
    const sections = {
        dashboard: <SchoolHealth />,
        projects: <ProjectManagement />,
        report: <PedagogicalReport />,
        communication: <CommunicationHub />
    };

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-white rounded-2xl border border-slate-100 p-2 shadow-sm overflow-x-auto">
                {[
                    { id: "dashboard", label: "📊 Saúde Escolar", icon: "📊" },
                    { id: "projects", label: "📋 Projetos", icon: "📋" },
                    { id: "report", label: "📈 Relatório", icon: "📈" },
                    { id: "communication", label: "💬 Comunicação", icon: "💬" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id)}
                        className={`px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition ${activeSection === tab.id
                                ? "bg-indigo-600 text-white shadow-lg"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo */}
            {sections[activeSection]}
        </div>
    );
};

export default CoordinatorAdvanced;
