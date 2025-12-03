import React, { useState } from "react";
import {
    ChevronLeft,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Calendar,
    Target,
    Users,
    BookOpen,
    Lightbulb,
    TrendingUp,
    Award,
    AlertCircle,
    Download,
    Eye,
    EyeOff,
    Check,
    Clock
} from "lucide-react";

// Mock data com projetos estruturados por BNCC e ciclos
const MOCK_PLANNING_DATA = [
    {
        id: 1,
        title: "Horta Sustentável Urbana",
        projectCode: "PROJ-2024-001",
        startDate: "2024-01-15",
        endDate: "2024-03-15",
        duration: "9 semanas",
        cycle: "Ciclo de Inovação e Sustentabilidade",
        grade: "7º Ano",
        subject: "Ciências, Matemática, Geografia",
        students: 24,
        teams: 4,

        // BNCC - Competências Gerais
        bnccGeneral: [
            { id: 1, name: "Pensamento Científico, Crítico e Criativo", coverage: 95, activities: ["Pesquisa sobre sustentabilidade", "Coleta de dados", "Análise de resultados"] },
            { id: 2, name: "Repertório Cultural", coverage: 70, activities: ["Documentação fotográfica", "Apresentação de resultados"] },
            { id: 3, name: "Comunicação", coverage: 88, activities: ["Apresentações", "Relatórios escritos", "Discussões em equipe"] },
            { id: 4, name: "Cultura Digital", coverage: 85, activities: ["Uso de sensores IoT", "Documentação digital", "Planilhas de dados"] },
            { id: 5, name: "Trabalho e Projeto de Vida", coverage: 92, activities: ["Liderança de equipe", "Resolução de problemas", "Colaboração"] }
        ],

        // Competências Específicas
        specificCompetencies: {
            science: [
                { name: "Processos de Vida", coverage: 95 },
                { name: "Matéria e Energia", coverage: 85 },
                { name: "Clima e Meteorologia", coverage: 80 }
            ],
            math: [
                { name: "Geometria e Espacialidade", coverage: 90 },
                { name: "Cálculos de Proporção", coverage: 88 },
                { name: "Análise de Dados", coverage: 85 }
            ]
        },

        // Novo Ciclo de Educação
        marketCycle: {
            name: "Inovação e Sustentabilidade 2024",
            focus: ["ODS 12 - Consumo e Produção Responsável", "ODS 13 - Ação Climática", "ODS 15 - Vida Terrestre"],
            marketTrends: ["Agroecologia", "Tecnologia Verde", "Economia Circular", "Empreendedorismo Social"],
            careerPaths: ["Engenheiro Agrônomo", "Especialista em Sustentabilidade", "Empreendedor Social", "Cientista de Dados Ambiental"]
        },

        // Objetivos de Aprendizagem
        learningObjectives: [
            "Desenvolver pensamento científico através da observação prática",
            "Aplicar conceitos matemáticos em contexto real de plantio",
            "Compreender sustentabilidade e responsabilidade ambiental",
            "Trabalhar em equipe para resolver problemas complexos",
            "Comunicar resultados científicos de forma clara e profissional",
            "Integrar tecnologia (sensores, apps) no acompanhamento ambiental"
        ],

        // Cronograma Detalhado
        timeline: [
            { week: 1, phase: "Planejamento e Pesquisa", description: "Definir objetivos, pesquisar plantas, analisar solo", status: "completed", deliverables: ["Proposta do projeto", "Pesquisa bibliográfica"] },
            { week: 2, phase: "Preparação do Espaço", description: "Preparar solo, construir canteiros, marcar áreas", status: "completed", deliverables: ["Foto dos canteiros prontos"] },
            { week: 3, phase: "Plantio", description: "Plantar sementes/mudas, instalar sistema de irrigação", status: "in-progress", deliverables: ["Registro fotográfico"] },
            { week: 4 - 5, phase: "Monitoramento Inicial", description: "Regar, observar germinação, registrar dados", status: "in-progress", deliverables: ["Relatório semanal com medidas"] },
            { week: 6 - 7, phase: "Análise e Otimização", description: "Analisar crescimento, ajustar cuidados", status: "pending", deliverables: ["Gráficos de crescimento"] },
            { week: 8, phase: "Colheita e Documentação Final", description: "Colher, medir produção, fotografar", status: "pending", deliverables: ["Fotos finais", "Dados de produção"] },
            { week: 9, phase: "Apresentação e Reflexão", description: "Apresentar para escola, refletir sobre aprendizados", status: "pending", deliverables: ["Apresentação", "Relatório final"] }
        ],

        // Recursos Necessários
        resources: {
            materials: [
                { name: "Sementes/mudas", quantity: 100, status: "adquirido" },
                { name: "Terra e adubo", quantity: "500L", status: "adquirido" },
                { name: "Ferramentas de jardinagem", quantity: 10, status: "adquirido" },
                { name: "Sensores de umidade", quantity: 5, status: "pendente" },
                { name: "Sistema de irrigação", quantity: 1, status: "em uso" }
            ],
            budget: { allocated: 2500, spent: 1800, remaining: 700 },
            technology: ["App de monitoramento (PlantSnap)", "Planilha Google Sheets", "Câmera para documentação"]
        },

        // Rubrica de Avaliação
        rubric: {
            criteria: [
                { name: "Pensamento Científico", weight: 30, maxScore: 10 },
                { name: "Trabalho em Equipe", weight: 25, maxScore: 10 },
                { name: "Comunicação", weight: 25, maxScore: 10 },
                { name: "Responsabilidade Ambiental", weight: 20, maxScore: 10 }
            ]
        },

        // Para Marketing/Comunicação
        marketingContent: {
            title: "Alunos Cultivam Sustentabilidade: Conheça o Projeto Horta",
            description: "Estudantes de 7º ano estão desenvolvendo uma horta sustentável, aprendendo sobre agricultura orgânica, responsabilidade ambiental e trabalho em equipe.",
            highlights: [
                "Projeto prático integrado com ciências, matemática e geografia",
                "Alunos aprendem sobre ODS (Objetivos de Desenvolvimento Sustentável)",
                "Desenvolvimento de habilidades do século 21",
                "Conexão com carreiras emergentes em sustentabilidade"
            ],
            mediaNeeded: ["Fotos do projeto", "Vídeo timelapse", "Depoimentos de alunos", "Dados de impacto ambiental"]
        },

        // Status Geral
        overallStatus: "in-progress",
        completion: 45
    },
    {
        id: 2,
        title: "Robótica e IA para Educação",
        projectCode: "PROJ-2024-002",
        startDate: "2024-02-01",
        endDate: "2024-04-30",
        duration: "12 semanas",
        cycle: "Transformação Digital e Carreiras Futuras",
        grade: "8º-9º Ano",
        subject: "Programação, Física, Engenharia",
        students: 32,
        teams: 6,

        bnccGeneral: [
            { id: 1, name: "Pensamento Científico, Crítico e Criativo", coverage: 98, activities: [] },
            { id: 4, name: "Cultura Digital", coverage: 100, activities: [] },
            { id: 5, name: "Trabalho e Projeto de Vida", coverage: 95, activities: [] }
        ],

        marketCycle: {
            name: "Transformação Digital 2024",
            focus: ["IA e Aprendizado de Máquina", "Automação Inteligente", "Robotização"],
            marketTrends: ["IA Generativa", "Robótica Colaborativa", "Computação em Nuvem", "Desenvolvimento Full Stack"],
            careerPaths: ["Engenheiro de Robótica", "Cientista de Dados", "Programador de IA", "Arquiteto de Soluções IoT"]
        },

        learningObjectives: [
            "Compreender fundamentos de programação e lógica",
            "Aplicar princípios de engenharia na construção de robôs",
            "Desenvolver pensamento computacional",
            "Aprender sobre IA e machine learning",
            "Resolver problemas reais com tecnologia"
        ],

        timeline: [
            { week: 1, phase: "Fundamentos de Programação", description: "Linguagem, variáveis, condições", status: "completed", deliverables: ["Códigos básicos"] },
            { week: 2, phase: "Robótica Básica", description: "Montagem e controle de robôs", status: "in-progress", deliverables: ["Robô montado"] },
            { week: 3, phase: "Integração de Sensores", description: "Adicionar sensores e câmeras", status: "pending", deliverables: ["Robô sensível"] },
            { week: 4, phase: "IA e Machine Learning", description: "Treinar modelos básicos", status: "pending", deliverables: ["Modelo treinado"] }
        ],

        overallStatus: "in-progress",
        completion: 30
    }
];

// Componente Principal
const TeacherPlanning = () => {
    const [projects, setProjects] = useState(MOCK_PLANNING_DATA);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [showModal, setShowModal] = useState(false);

    if (!projects || projects.length === 0) {
        return (
            <div className="p-8">
                <p className="text-red-600">Erro: Nenhum projeto encontrado</p>
            </div>
        );
    }

    if (selectedProject) {
        return (
            <ProjectDetailedPlanning
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Planejamento de Projetos</h2>
                    <p className="text-slate-500 mt-2">
                        Planejamento detalhado baseado em BNCC e Novos Ciclos Educacionais
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition"
                >
                    <Plus size={18} />
                    Novo Projeto
                </button>
            </div>

            {/* Grid de Projetos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden group"
                    >
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition">
                                        {project.title}
                                    </h3>
                                    <p className="text-xs font-bold text-indigo-600 mt-1">{project.projectCode}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.overallStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                        project.overallStatus === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {project.overallStatus === 'completed' ? '✓ Concluído' :
                                        project.overallStatus === 'in-progress' ? '🔄 Em Andamento' :
                                            '⏳ Planejamento'}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 mb-4 text-sm">
                                <p className="text-slate-600"><span className="font-semibold">Ciclo:</span> {project.marketCycle.name}</p>
                                <p className="text-slate-600"><span className="font-semibold">Disciplinas:</span> {project.subject}</p>
                                <p className="text-slate-600"><span className="font-semibold">Alunos/Equipes:</span> {project.students} alunos • {project.teams} equipes</p>
                            </div>

                            {/* Barra de Progresso */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Progresso Geral</span>
                                    <span className="text-sm font-bold text-indigo-600">{project.completion}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                                        style={{ width: `${project.completion}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Competências BNCC */}
                            <div className="mb-4 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                                <p className="text-xs font-bold text-indigo-900 mb-2">Cobertura BNCC</p>
                                <div className="space-y-1">
                                    {project.bnccGeneral.slice(0, 3).map((comp) => (
                                        <div key={comp.id} className="flex items-center gap-2">
                                            <div className="flex-1 bg-white h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-indigo-500 h-full"
                                                    style={{ width: `${comp.coverage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold text-indigo-700 w-8 text-right">{comp.coverage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Datas */}
                            <div className="flex gap-4 text-xs text-slate-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(project.startDate).toLocaleDateString("pt-BR")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {project.duration}
                                </span>
                            </div>

                            {/* Botão Ver Detalhes */}
                            <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition opacity-0 group-hover:opacity-100">
                                Ver Planejamento Completo →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente de Detalhes do Projeto
const ProjectDetailedPlanning = ({ project, onBack, activeTab, setActiveTab }) => {
    const [expandedSection, setExpandedSection] = useState(null);

    if (!project) {
        return (
            <div className="p-8 bg-red-50 rounded-xl border border-red-200">
                <p className="text-red-700 font-bold">Erro ao carregar projeto</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Botão Voltar */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
            >
                <ChevronLeft size={20} /> Voltar para Planejamentos
            </button>

            {/* Header do Projeto */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-bold mb-3">
                                {project.projectCode}
                            </span>
                            <h1 className="text-4xl font-extrabold mb-2">{project.title}</h1>
                            <p className="text-indigo-100">Ciclo: {project.marketCycle.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-80 mb-1">Conclusão</p>
                            <p className="text-4xl font-extrabold">{project.completion}%</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Users size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-bold">{project.students}</p>
                            <p className="text-xs opacity-80">Alunos</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Users size={20} className="mb-2 opacity-80" />
                            <p className="text-2xl font-bold">{project.teams}</p>
                            <p className="text-xs opacity-80">Equipes</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Calendar size={20} className="mb-2 opacity-80" />
                            <p className="text-xl font-bold">{project.duration}</p>
                            <p className="text-xs opacity-80">Duração</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Award size={20} className="mb-2 opacity-80" />
                            <p className="text-xl font-bold">{project.bnccGeneral.length}</p>
                            <p className="text-xs opacity-80">Competências</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Abas de Navegação */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${activeTab === "overview"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    📋 Visão Geral
                </button>
                <button
                    onClick={() => setActiveTab("bncc")}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${activeTab === "bncc"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    🎓 BNCC & Competências
                </button>
                <button
                    onClick={() => setActiveTab("timeline")}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${activeTab === "timeline"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    📅 Cronograma
                </button>
                <button
                    onClick={() => setActiveTab("market")}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${activeTab === "market"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    🚀 Mercado & Carreiras
                </button>
                <button
                    onClick={() => setActiveTab("resources")}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${activeTab === "resources"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    🔧 Recursos
                </button>
                <button
                    onClick={() => setActiveTab("marketing")}
                    className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition ${activeTab === "marketing"
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    📢 Marketing
                </button>
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === "overview" && (
                <OverviewTab project={project} />
            )}
            {activeTab === "bncc" && (
                <BNCCTab project={project} />
            )}
            {activeTab === "timeline" && (
                <TimelineTab project={project} />
            )}
            {activeTab === "market" && (
                <MarketTab project={project} />
            )}
            {activeTab === "resources" && (
                <ResourcesTab project={project} />
            )}
            {activeTab === "marketing" && (
                <MarketingTab project={project} />
            )}
        </div>
    );
};

// Tab: Visão Geral
const OverviewTab = ({ project }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600" />
                Objetivos de Aprendizagem
            </h3>
            <div className="space-y-3">
                {project.learningObjectives.map((obj, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{obj}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">📊 Status do Projeto</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Fase Atual</p>
                        <p className="text-lg font-bold text-indigo-600">{project.timeline[2]?.phase || "Em Progresso"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Data Início</p>
                        <p className="text-slate-800">{new Date(project.startDate).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Data Fim</p>
                        <p className="text-slate-800">{new Date(project.endDate).toLocaleDateString("pt-BR")}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4">👥 Participantes</h3>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Total de Alunos</p>
                        <p className="text-lg font-bold text-slate-800">{project.students}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Equipes Formadas</p>
                        <p className="text-lg font-bold text-slate-800">{project.teams}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-1">Média por Equipe</p>
                        <p className="text-lg font-bold text-slate-800">{Math.round(project.students / project.teams)}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Tab: BNCC & Competências
const BNCCTab = ({ project }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                <Award size={20} className="text-indigo-600" />
                Competências Gerais BNCC
            </h3>
            <div className="space-y-4">
                {project.bnccGeneral.map((comp) => (
                    <div key={comp.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-slate-800">{comp.name}</h4>
                            <span className="text-sm font-bold text-indigo-600 bg-white px-3 py-1 rounded-full">{comp.coverage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" style={{ width: `${comp.coverage}%` }}></div>
                        </div>
                        {comp.activities && comp.activities.length > 0 && (
                            <div className="text-sm text-slate-600 space-y-1">
                                <p className="font-semibold text-slate-700 mb-2">Atividades:</p>
                                {comp.activities.map((act, idx) => (
                                    <p key={idx} className="flex items-center gap-2 text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                        {act}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        {project.specificCompetencies && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6">Competências Específicas por Disciplina</h3>
                <div className="space-y-6">
                    {Object.entries(project.specificCompetencies).map(([discipline, comps]) => (
                        <div key={discipline}>
                            <h4 className="font-bold text-slate-700 mb-3 capitalize">{discipline === 'science' ? 'Ciências' : 'Matemática'}</h4>
                            <div className="space-y-2">
                                {comps.map((comp, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                        <span className="text-slate-700">{comp.name}</span>
                                        <span className="text-sm font-bold text-indigo-600">{comp.coverage}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

// Tab: Cronograma
const TimelineTab = ({ project }) => (
    <div className="space-y-4">
        {project.timeline.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition">
                <div className="flex items-start gap-6">
                    <div className={`min-w-fit px-4 py-2 rounded-lg font-bold text-sm ${item.status === 'completed' ? 'bg-green-100 text-green-700' :
                            item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                        }`}>
                        Semana{typeof item.week === 'string' ? ` ${item.week}` : `s ${item.week}`}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-800 mb-1">{item.phase}</h4>
                        <p className="text-slate-600 mb-3">{item.description}</p>
                        {item.deliverables && item.deliverables.length > 0 && (
                            <div className="text-sm space-y-1">
                                <p className="font-semibold text-slate-700">Entregáveis:</p>
                                {item.deliverables.map((del, i) => (
                                    <p key={i} className="text-slate-600 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                        {del}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Tab: Mercado & Carreiras
const MarketTab = ({ project }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                Ciclo de Educação Ativa
            </h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">Foco do Ciclo</p>
                    <div className="flex flex-wrap gap-2">
                        {project.marketCycle.focus.map((f, idx) => (
                            <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">Tendências de Mercado</p>
                    <div className="grid grid-cols-2 gap-2">
                        {project.marketCycle.marketTrends.map((trend, idx) => (
                            <div key={idx} className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                                <p className="text-sm font-semibold text-orange-900">{trend}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-600" />
                Carreiras Relacionadas
            </h3>
            <div className="grid grid-cols-2 gap-4">
                {project.marketCycle.careerPaths.map((career, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <p className="font-semibold text-purple-900">{career}</p>
                        <p className="text-xs text-purple-700 mt-1">Área em alta demanda</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Tab: Recursos
const ResourcesTab = ({ project }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">📚 Materiais Necessários</h3>
            <div className="space-y-3">
                {project.resources.materials.map((material, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                            <p className="font-semibold text-slate-800">{material.name}</p>
                            <p className="text-sm text-slate-500">Quantidade: {material.quantity}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${material.status === 'adquirido' ? 'bg-green-100 text-green-700' :
                                material.status === 'em uso' ? 'bg-blue-100 text-blue-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }`}>
                            {material.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">💰 Orçamento</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <span className="font-semibold text-slate-700">Orçamento Alocado</span>
                    <span className="text-xl font-bold text-green-700">R$ {project.resources.budget.allocated.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                    <span className="font-semibold text-slate-700">Gasto Atual</span>
                    <span className="text-xl font-bold text-orange-700">R$ {project.resources.budget.spent.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <span className="font-semibold text-slate-700">Saldo Disponível</span>
                    <span className="text-xl font-bold text-indigo-700">R$ {project.resources.budget.remaining.toLocaleString("pt-BR")}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full" style={{ width: `${(project.resources.budget.spent / project.resources.budget.allocated) * 100}%` }}></div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">🔧 Tecnologias</h3>
            <div className="grid grid-cols-2 gap-3">
                {project.resources.technology.map((tech, idx) => (
                    <div key={idx} className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="text-sm font-semibold text-indigo-900">{tech}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Tab: Marketing
const MarketingTab = ({ project }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-600" />
                Proposta para Marketing
            </h3>
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">Título da Comunicação</p>
                    <p className="text-lg font-bold text-slate-800">{project.marketingContent.title}</p>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">Descrição</p>
                    <p className="text-slate-700 leading-relaxed">{project.marketingContent.description}</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4">⭐ Destaques do Projeto</h3>
            <div className="space-y-3">
                {project.marketingContent.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <span className="text-xl flex-shrink-0">✨</span>
                        <span className="text-slate-700">{highlight}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Download size={20} className="text-indigo-600" />
                Conteúdo de Mídia Necessário
            </h3>
            <div className="space-y-2">
                {project.marketingContent.mediaNeeded.map((media, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <span className="text-lg">📸</span>
                        <span className="text-slate-700">{media}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <p className="text-sm text-indigo-900 mb-3">
                <span className="font-bold">💡 Dica para Marketing:</span> Use os dados e fotos do projeto para criar conteúdo autêntico nas redes sociais. O projeto inclui elementos visualmente atraentes e com propósito educacional claro.
            </p>
        </div>
    </div>
);

export default TeacherPlanning;
