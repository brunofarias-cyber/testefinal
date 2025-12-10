// ========================================
// DADOS MOCKADOS EXTENDIDOS - PARTE 2
// ========================================

export const MOCK_USERS = [
  { 
    id: 1, 
    email: "professor@nexo.com", 
    password: "prof123", 
    role: "teacher", 
    name: "Ana Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
  },
  { 
    id: 2, 
    email: "aluno@nexo.com", 
    password: "aluno123", 
    role: "student", 
    name: "João Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao"
  },
  { 
    id: 3, 
    email: "coordenador@nexo.com", 
    password: "coord123", 
    role: "coordinator", 
    name: "Roberto Lima",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto"
  }
];

export const MOCK_ACTIVITY_BANK = [
    {
        id: 1,
        title: "Horta Sustentável",
        category: "Ciências",
        difficulty: "Médio",
        duration: "4 semanas",
        objectives: ["Desenvolver pensamento científico", "Aplicar matemática em contexto real", "Trabalhar em equipe"],
        materials: ["Sementes", "Terra", "Ferramentas de jardinagem", "Câmera para documentação"],
        steps: [
            "Pesquisar plantas adequadas ao clima local",
            "Calcular área e espaçamento necessário",
            "Preparar o solo e plantar",
            "Documentar crescimento semanalmente",
            "Apresentar resultados"
        ],
        bnccCompetencies: ["Conhecimento", "Pensamento Científico", "Responsabilidade e Cidadania"],
        tags: ["Biologia", "Matemática", "Sustentabilidade", "Mão na massa"],
        downloads: 124,
        rating: 4.8,
        author: "Profª Ana Silva",
        createdAt: "2023-09-15",
        template: true
    },
    {
        id: 2,
        title: "Jornal Digital da Turma",
        category: "Linguagens",
        difficulty: "Fácil",
        duration: "3 semanas",
        objectives: ["Desenvolver escrita jornalística", "Trabalhar comunicação", "Usar tecnologia digital"],
        materials: ["Computadores", "Câmeras/celulares", "Software de edição (Canva/Google Docs)"],
        steps: [
            "Definir pautas e seções do jornal",
            "Pesquisar e entrevistar fontes",
            "Escrever matérias",
            "Diagramar edição digital",
            "Publicar e compartilhar"
        ],
        bnccCompetencies: ["Comunicação", "Cultura Digital", "Repertório Cultural"],
        tags: ["Português", "História", "Jornalismo", "Tecnologia"],
        downloads: 89,
        rating: 4.5,
        author: "Prof. Carlos Souza",
        createdAt: "2023-10-01",
        template: true
    },
    {
        id: 3,
        title: "Robô com Material Reciclado",
        category: "Exatas",
        difficulty: "Difícil",
        duration: "6 semanas",
        objectives: ["Aplicar física e eletrônica", "Desenvolver criatividade", "Sustentabilidade"],
        materials: ["Materiais recicláveis", "Motores pequenos", "Pilhas", "Cola quente", "Arduino (opcional)"],
        steps: [
            "Projetar design do robô",
            "Coletar materiais recicláveis",
            "Montar estrutura",
            "Adicionar componentes eletrônicos",
            "Testar e apresentar"
        ],
        bnccCompetencies: ["Pensamento Científico", "Criatividade", "Trabalho e Projeto de Vida"],
        tags: ["Física", "Robótica", "Sustentabilidade", "Maker"],
        downloads: 156,
        rating: 4.9,
        author: "Prof. Roberto Lima",
        createdAt: "2023-08-20",
        template: true
    },
    {
        id: 4,
        title: "Teatro Shakespeare",
        category: "Artes",
        difficulty: "Médio",
        duration: "5 semanas",
        objectives: ["Desenvolver expressão oral", "Conhecer literatura clássica", "Trabalhar em grupo"],
        materials: ["Textos de peças", "Figurinos", "Cenários simples", "Câmera para gravar"],
        steps: [
            "Escolher e estudar peça",
            "Distribuir personagens",
            "Ensaiar cenas",
            "Criar figurinos e cenário",
            "Apresentar para turma/escola"
        ],
        bnccCompetencies: ["Repertório Cultural", "Comunicação", "Empatia e Cooperação"],
        tags: ["Literatura", "Inglês", "Teatro", "Cultura"],
        downloads: 67,
        rating: 4.3,
        author: "Profª Mariana Dias",
        createdAt: "2023-07-10",
        template: true
    },
    {
        id: 5,
        title: "Documentário sobre a Comunidade",
        category: "Multidisciplinar",
        difficulty: "Médio",
        duration: "4 semanas",
        objectives: ["Desenvolver pesquisa social", "Trabalhar audiovisual", "Conhecer história local"],
        materials: ["Câmeras/celulares", "Roteiro", "Software de edição (iMovie/CapCut)", "Gravador de áudio"],
        steps: [
            "Definir tema e pesquisar história local",
            "Preparar roteiro e entrevistas",
            "Filmar e entrevistar moradores",
            "Editar documentário",
            "Exibir e discutir"
        ],
        bnccCompetencies: ["Cultura Digital", "Empatia e Cooperação", "Responsabilidade e Cidadania"],
        tags: ["História", "Geografia", "Audiovisual", "Comunidade"],
        downloads: 92,
        rating: 4.7,
        author: "Prof. Carlos Souza",
        createdAt: "2023-11-05",
        template: true
    }
];

export const MOCK_TEAM_TEMPLATES = [
    { id: 1, name: "Equipes de 3", size: 3, icon: "👥", description: "Ideal para trabalhos rápidos" },
    { id: 2, name: "Equipes de 4", size: 4, icon: "👥👥", description: "Padrão para projetos médios" },
    { id: 3, name: "Equipes de 5-6", size: 5, icon: "👥👥👥", description: "Projetos complexos" },
    { id: 4, name: "Duplas", size: 2, icon: "👫", description: "Trabalhos de parceria" }
];

export const MOCK_MISSIONS = {
    daily: [
        { id: 'd1', title: "Entre no sistema hoje", xp: 50, completed: true, type: 'daily' },
        { id: 'd2', title: "Comente em 1 tarefa de colega", xp: 100, completed: false, progress: 0, total: 1, type: 'daily' },
        { id: 'd3', title: "Atualize seu Kanban", xp: 75, completed: true, type: 'daily' }
    ],
    weekly: [
        { id: 'w1', title: "Complete 5 tarefas no prazo", xp: 500, completed: false, progress: 2, total: 5, type: 'weekly', deadline: '2023-12-10' },
        { id: 'w2', title: "Ajude 3 colegas", xp: 300, completed: false, progress: 1, total: 3, type: 'weekly', deadline: '2023-12-10' },
        { id: 'w3', title: "Sem faltas esta semana", xp: 400, completed: true, progress: 5, total: 5, type: 'weekly', deadline: '2023-12-10' }
    ],
    special: [
        { id: 's1', title: "Entregue com 24h de antecedência", xp: 800, badge: "Madrugador", completed: false, type: 'special' },
        { id: 's2', title: "Nota acima de 9.0 em projeto", xp: 1000, badge: "Excelência", completed: false, type: 'special' }
    ]
};

export const MOCK_EARLY_WARNINGS = [
    {
        id: 'ew1',
        student: { id: 103, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro" },
        severity: 'critical',
        alerts: [
            { type: 'grade_drop', message: 'Nota caiu de 8.0 para 5.0', icon: 'TrendingDown', date: '2023-12-05' },
            { type: 'absence', message: '4 faltas no último mês', icon: 'UserX', date: '2023-12-04' },
            { type: 'deadline', message: '3 entregas atrasadas', icon: 'Clock', date: '2023-12-03' }
        ],
        recommendations: [
            { action: 'Contatar responsáveis', priority: 'high', icon: 'Phone' },
            { action: 'Oferecer reforço escolar', priority: 'high', icon: 'Book' },
            { action: 'Reunião individual', priority: 'medium', icon: 'Users' }
        ],
        lastUpdate: '2023-12-05T14:30:00'
    },
    {
        id: 'ew2',
        student: { id: 107, name: "Beatriz Lima", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bia" },
        severity: 'high',
        alerts: [
            { type: 'engagement', message: 'Sem interação há 7 dias', icon: 'Activity', date: '2023-12-02' },
            { type: 'deadline', message: '2 prazos perdidos', icon: 'AlertCircle', date: '2023-12-01' }
        ],
        recommendations: [
            { action: 'Conversa motivacional', priority: 'medium', icon: 'MessageSquare' },
            { action: 'Verificar situação pessoal', priority: 'medium', icon: 'Heart' }
        ],
        lastUpdate: '2023-12-02T10:15:00'
    },
    {
        id: 'ew3',
        student: { id: 106, name: "Julia Souza", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia" },
        severity: 'medium',
        alerts: [
            { type: 'behavior', message: 'Aluna ativa ficou silenciosa', icon: 'Bell', date: '2023-11-30' }
        ],
        recommendations: [
            { action: 'Observar próximas aulas', priority: 'low', icon: 'Eye' }
        ],
        lastUpdate: '2023-11-30T16:00:00'
    }
];

export const MOCK_PORTFOLIO = {
    student: { id: 101, name: "João Silva", year: "1º Ano A", period: "2023/2024" },
    stats: {
        projectsCompleted: 12,
        averageGrade: 8.7,
        evolution: 2.3,
        badges: 8
    },
    highlights: [
        {
            id: 'p1',
            title: 'Horta Sustentável',
            grade: 9.5,
            date: '2023-11-15',
            cover: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
            description: 'Projeto de agricultura urbana com foco em sustentabilidade',
            skills: ['Biologia', 'Matemática', 'Trabalho em Equipe'],
            featured: true
        },
        {
            id: 'p2',
            title: 'Robô Reciclável',
            grade: 9.0,
            date: '2023-10-20',
            cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
            description: 'Construção de robô usando materiais recicláveis',
            skills: ['Física', 'Programação', 'Criatividade'],
            featured: true
        },
        {
            id: 'p3',
            title: 'Teatro Shakespeare',
            grade: 8.8,
            date: '2023-09-10',
            cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            description: 'Adaptação moderna de Romeu e Julieta',
            skills: ['Literatura', 'Expressão Oral', 'Inglês'],
            featured: false
        }
    ],
    skills: {
        technical: ['Python', 'Arduino', 'Edição de Vídeo', 'Design Gráfico'],
        soft: ['Liderança', 'Comunicação', 'Pensamento Crítico', 'Criatividade', 'Trabalho em Equipe']
    },
    testimonials: [
        {
            teacher: 'Profª Ana Silva',
            subject: 'Biologia',
            text: 'João demonstra excelente capacidade de pesquisa e trabalho em equipe. Destaque na turma!',
            date: '2023-11-15'
        },
        {
            teacher: 'Prof. Roberto Lima',
            subject: 'Física',
            text: 'Criatividade impressionante na resolução de problemas. Aluno exemplar.',
            date: '2023-10-20'
        }
    ]
};

export const MOCK_ECOSYSTEM_FEED = [
    {
        id: 'eco1',
        project: 'Horta Vertical 3D',
        class: '3º Ano B',
        teacher: 'Profª Marina Costa',
        date: '2023-12-01',
        description: 'Sistema automatizado de irrigação com sensores IoT',
        likes: 45,
        comments: 12,
        cover: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
        tags: ['IoT', 'Sustentabilidade', 'Programação']
    },
    {
        id: 'eco2',
        project: 'App de Reciclagem',
        class: '2º Ano C',
        teacher: 'Prof. Carlos Tech',
        date: '2023-11-28',
        description: 'Aplicativo mobile para gamificar coleta seletiva',
        likes: 38,
        comments: 8,
        cover: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
        tags: ['Mobile', 'Gamificação', 'Meio Ambiente']
    },
    {
        id: 'eco3',
        project: 'Podcast História Local',
        class: '1º Ano A',
        teacher: 'Prof. João História',
        date: '2023-11-25',
        description: 'Série de entrevistas com moradores antigos do bairro',
        likes: 52,
        comments: 15,
        cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
        tags: ['História', 'Audiovisual', 'Comunidade']
    }
];

export const MOCK_STUDENT_PROGRESS = {
    timeframe: 'month',
    stats: {
        average: 8.5,
        evolution: 1.2,
        badges: 12,
        weeklyXP: 450
    },
    objectives: [
        {
            id: 'obj1',
            title: 'Melhorar nota em Matemática',
            progress: 75,
            target: 9.0
        },
        {
            id: 'obj2',
            title: 'Completar 10 missões',
            progress: 60,
            target: 10
        }
    ],
    projects: [
        {
            id: 'proj1',
            title: 'Horta Sustentável',
            progress: 100,
            grade: 9.5
        },
        {
            id: 'proj2',
            title: 'Robó Reciclável',
            progress: 85,
            grade: 8.5
        },
        {
            id: 'proj3',
            title: 'Jornal Digital',
            progress: 60,
            grade: 8.0
        },
        {
            id: 'proj4',
            title: 'Teatro Shakespeare',
            progress: 40,
            grade: 7.5
        }
    ]
};
