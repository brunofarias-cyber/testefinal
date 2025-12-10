// ========================================
// MOCK DATA COMPLETO - TODAS AS FUNCIONALIDADES
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

export const MOCK_ACHIEVEMENTS = [
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

export const MOCK_TEAMS = [
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

export const MOCK_STUDENTS_LIST = [
  { id: 101, name: "João Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao", status: "Presente" },
  { id: 102, name: "Maria Oliveira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", status: "Presente" },
  { id: 103, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", status: "Ausente" },
  { id: 104, name: "Ana Costa", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaC", status: "Presente" },
  { id: 105, name: "Lucas Pereira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", status: "Presente" },
  { id: 106, name: "Julia Souza", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia", status: "Presente" },
  { id: 107, name: "Beatriz Lima", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bia", status: "Ausente" },
  { id: 108, name: "Gabriel Alves", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Griel", status: "Presente" },
];

export const MOCK_STUDENT_PERFORMANCE = [
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
  },
];

export const MOCK_TEACHERS = [
  { id: 1, name: "Ana Silva", subject: "Biologia", projects: 4, rating: 4.8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
  { id: 2, name: "Carlos Souza", subject: "História", projects: 2, rating: 4.5, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
  { id: 3, name: "Roberto Lima", subject: "Física", projects: 3, rating: 4.9, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto" },
  { id: 4, name: "Mariana Dias", subject: "Inglês", projects: 1, rating: 4.2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana" }
];

export const MOCK_PROJECTS = [
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
    ]
  },
  { id: 2, title: "Jornal Digital", subject: "Port & Hist", status: "Planejamento", progress: 15, students: 18, nextDeadline: "2023-11-20", deadlineLabel: "Definição de Pautas", theme: "blue", teacher: "Carlos Souza", delayed: false, tasks: [] },
  { id: 3, title: "Robótica Sucata", subject: "Fís & Art", status: "Para Avaliação", progress: 100, students: 30, nextDeadline: "2023-10-30", deadlineLabel: "Apresentação Final", theme: "purple", teacher: "Roberto Lima", delayed: false, tasks: [] },
  { id: 4, title: "Teatro Shake", subject: "Lit & Ing", status: "Atrasado", progress: 40, students: 22, nextDeadline: "2023-10-15", deadlineLabel: "Ensaios Gerais", theme: "red", teacher: "Mariana Dias", delayed: true, tasks: [] }
];

export const MOCK_RUBRIC = [
  { criteria: "Investigação Científica", weight: 40, levels: ["Não apresentou dados.", "Dados superficiais.", "Dados relevantes e bem analisados.", "Análise profunda com fontes extras."] },
  { criteria: "Trabalho em Equipe", weight: 30, levels: ["Conflitos constantes.", "Colaboração mínima.", "Boa divisão de tarefas.", "Sinergia e apoio mútuo."] },
  { criteria: "Comunicação Oral", weight: 30, levels: ["Leitura de slides.", "Fala pouco clara.", "Boa oratória.", "Apresentação engajadora e profissional."] }
];

export const INITIAL_EVENTS = [
  { date: '2023-11-12', title: 'Relatório de Crescimento', type: 'deadline' },
  { date: '2023-11-20', title: 'Definição de Pautas', type: 'deadline' },
  { date: '2023-11-15', title: 'Reunião Pedagógica', type: 'meeting' }
];
