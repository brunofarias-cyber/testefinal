// Missing mock data extracted from UI snippet

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

export const MOCK_TEAM_TEMPLATES = [
    { id: 1, name: "Equipes de 3", size: 3, icon: "👥", description: "Ideal para trabalhos rápidos" },
    { id: 2, name: "Equipes de 4", size: 4, icon: "👥👥", description: "Padrão para projetos médios" },
    { id: 3, name: "Equipes de 5-6", size: 5, icon: "👥👥👥", description: "Projetos complexos" },
    { id: 4, name: "Duplas", size: 2, icon: "👫", description: "Trabalhos de parceria" }
];

export const MOCK_MESSAGES = [
    {
        id: 1,
        participant: { id: 101, name: "João Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao", role: "student" },
        lastMessage: "Professor, tenho uma dúvida sobre a horta sustentável...",
        timestamp: "2023-12-01T14:30:00",
        unread: 2,
        messages: [
            { id: 1, sender: "student", text: "Bom dia, professor! Tudo bem?", timestamp: "2023-12-01T09:00:00", read: true },
            { id: 2, sender: "teacher", text: "Bom dia, João! Tudo ótimo, e você?", timestamp: "2023-12-01T09:15:00", read: true },
            { id: 3, sender: "student", text: "Tô bem! Tenho uma dúvida sobre o projeto da horta.", timestamp: "2023-12-01T14:20:00", read: true },
            { id: 4, sender: "student", text: "Qual é o melhor tipo de solo para cenouras?", timestamp: "2023-12-01T14:30:00", read: false },
        ]
    },
    {
        id: 2,
        participant: { id: 102, name: "Maria Oliveira", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", role: "student" },
        lastMessage: "Obrigada pela explicação! Ficou claro agora.",
        timestamp: "2023-11-30T16:45:00",
        unread: 0,
        messages: [
            { id: 1, sender: "student", text: "Professor, não entendi a parte da rubrica sobre trabalho em equipe", timestamp: "2023-11-30T15:00:00", read: true },
            { id: 2, sender: "teacher", text: "Oi Maria! Vou te explicar. A rubrica avalia...", timestamp: "2023-11-30T15:30:00", read: true },
            { id: 3, sender: "student", text: "Obrigada pela explicação! Ficou claro agora.", timestamp: "2023-11-30T16:45:00", read: true },
        ]
    },
    {
        id: 3,
        participant: { id: 103, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro", role: "student" },
        lastMessage: "Posso entregar amanhã?",
        timestamp: "2023-11-29T11:20:00",
        unread: 1,
        messages: [
            { id: 1, sender: "student", text: "Professor, tive um problema e não consegui terminar o relatório", timestamp: "2023-11-29T10:00:00", read: true },
            { id: 2, sender: "student", text: "Posso entregar amanhã?", timestamp: "2023-11-29T11:20:00", read: false },
        ]
    },
    {
        id: 4,
        participant: { id: 1, name: "Profª Ana Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana", role: "teacher" },
        lastMessage: "Parabéns pelo seu desempenho no último projeto!",
        timestamp: "2023-11-28T10:00:00",
        unread: 0,
        messages: [
            { id: 1, sender: "teacher", text: "Olá João! Vi sua entrega.", timestamp: "2023-11-28T09:30:00", read: true },
            { id: 2, sender: "teacher", text: "Parabéns pelo seu desempenho no último projeto!", timestamp: "2023-11-28T10:00:00", read: true },
            { id: 3, sender: "student", text: "Muito obrigado, professora! ❤️", timestamp: "2023-11-28T10:15:00", read: true },
        ]
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
