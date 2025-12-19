// ═══════════════════════════════════════════════════════════════════════
//  DADOS MOCK - Para testar Dashboard sem banco de dados
// ═══════════════════════════════════════════════════════════════════════

export const mockDashboardData = {
    kpis: {
        correcoesPendentes: 7,
        alunosEmRisco: 3,
        projetosConcluidos: 68,
    },

    graficoEvolucao: [
        {
            data: "01/11/2024",
            mediaNotas: 6.2,
            qtdAlunos: 18,
        },
        {
            data: "02/11/2024",
            mediaNotas: 6.5,
            qtdAlunos: 22,
        },
        {
            data: "03/11/2024",
            mediaNotas: 6.8,
            qtdAlunos: 24,
        },
        {
            data: "04/11/2024",
            mediaNotas: 7.1,
            qtdAlunos: 25,
        },
        {
            data: "05/11/2024",
            mediaNotas: 7.0,
            qtdAlunos: 23,
        },
        {
            data: "06/11/2024",
            mediaNotas: 7.3,
            qtdAlunos: 25,
        },
        {
            data: "07/11/2024",
            mediaNotas: 7.5,
            qtdAlunos: 25,
        },
        {
            data: "08/11/2024",
            mediaNotas: 7.4,
            qtdAlunos: 24,
        },
        {
            data: "09/11/2024",
            mediaNotas: 7.6,
            qtdAlunos: 25,
        },
        {
            data: "10/11/2024",
            mediaNotas: 7.7,
            qtdAlunos: 25,
        },
        {
            data: "11/11/2024",
            mediaNotas: 7.8,
            qtdAlunos: 25,
        },
        {
            data: "12/11/2024",
            mediaNotas: 7.9,
            qtdAlunos: 25,
        },
        {
            data: "13/11/2024",
            mediaNotas: 8.0,
            qtdAlunos: 25,
        },
        {
            data: "14/11/2024",
            mediaNotas: 7.95,
            qtdAlunos: 25,
        },
        {
            data: "15/11/2024",
            mediaNotas: 8.1,
            qtdAlunos: 25,
        },
        {
            data: "16/11/2024",
            mediaNotas: 8.0,
            qtdAlunos: 25,
        },
        {
            data: "17/11/2024",
            mediaNotas: 8.15,
            qtdAlunos: 25,
        },
        {
            data: "18/11/2024",
            mediaNotas: 8.2,
            qtdAlunos: 25,
        },
        {
            data: "19/11/2024",
            mediaNotas: 8.25,
            qtdAlunos: 25,
        },
        {
            data: "20/11/2024",
            mediaNotas: 8.3,
            qtdAlunos: 25,
        },
        {
            data: "21/11/2024",
            mediaNotas: 8.35,
            qtdAlunos: 25,
        },
        {
            data: "22/11/2024",
            mediaNotas: 8.4,
            qtdAlunos: 25,
        },
        {
            data: "23/11/2024",
            mediaNotas: 8.38,
            qtdAlunos: 25,
        },
        {
            data: "24/11/2024",
            mediaNotas: 8.45,
            qtdAlunos: 25,
        },
        {
            data: "25/11/2024",
            mediaNotas: 8.5,
            qtdAlunos: 25,
        },
        {
            data: "26/11/2024",
            mediaNotas: 8.55,
            qtdAlunos: 25,
        },
        {
            data: "27/11/2024",
            mediaNotas: 8.6,
            qtdAlunos: 25,
        },
        {
            data: "28/11/2024",
            mediaNotas: 8.62,
            qtdAlunos: 25,
        },
        {
            data: "29/11/2024",
            mediaNotas: 8.65,
            qtdAlunos: 25,
        },
        {
            data: "30/11/2024",
            mediaNotas: 8.7,
            qtdAlunos: 25,
        },
    ],

    timeline: [
        {
            id: "1",
            tipo: "entrega",
            acao: "Grupo enviou entrega",
            descricao: "Grupo Alpha - Horta Sustentável",
            data: new Date(Date.now() - 5 * 60000), // 5 min atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha",
        },
        {
            id: "2",
            tipo: "comentario",
            acao: "Aluno comentou em tarefa",
            descricao: "João Silva - Tarefa #3",
            data: new Date(Date.now() - 15 * 60000), // 15 min atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        },
        {
            id: "3",
            tipo: "avaliacao",
            acao: "Professor avaliou entrega",
            descricao: "Grupo Beta - Nota: 8.5",
            data: new Date(Date.now() - 1 * 3600000), // 1 hora atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beta",
        },
        {
            id: "4",
            tipo: "entrega",
            acao: "Grupo enviou entrega",
            descricao: "Grupo Gamma - Robótica Sucata",
            data: new Date(Date.now() - 2 * 3600000), // 2 horas atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gamma",
        },
        {
            id: "5",
            tipo: "comentario",
            acao: "Aluno comentou em tarefa",
            descricao: "Maria Oliveira - Tarefa #5",
            data: new Date(Date.now() - 4 * 3600000), // 4 horas atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        },
        {
            id: "6",
            tipo: "avaliacao",
            acao: "Professor avaliou entrega",
            descricao: "Grupo Delta - Nota: 7.8",
            data: new Date(Date.now() - 1 * 86400000), // 1 dia atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Delta",
        },
        {
            id: "7",
            tipo: "entrega",
            acao: "Grupo enviou entrega",
            descricao: "Grupo Epsilon - Jornal Digital",
            data: new Date(Date.now() - 2 * 86400000), // 2 dias atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Epsilon",
        },
        {
            id: "8",
            tipo: "comentario",
            acao: "Aluno comentou em tarefa",
            descricao: "Pedro Santos - Tarefa #2",
            data: new Date(Date.now() - 3 * 86400000), // 3 dias atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
        },
        {
            id: "9",
            tipo: "avaliacao",
            acao: "Professor avaliou entrega",
            descricao: "Grupo Zeta - Nota: 9.0",
            data: new Date(Date.now() - 4 * 86400000), // 4 dias atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zeta",
        },
        {
            id: "10",
            tipo: "entrega",
            acao: "Grupo enviou entrega",
            descricao: "Grupo Eta - Teatro Shakespeare",
            data: new Date(Date.now() - 5 * 86400000), // 5 dias atrás
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eta",
        },
    ],

    mapaCompetencias: [
        {
            competencia: "Comunicação",
            desempenho: 87.5,
            meta: 100,
        },
        {
            competencia: "Pensamento Crítico",
            desempenho: 82.3,
            meta: 100,
        },
        {
            competencia: "Colaboração",
            desempenho: 91.2,
            meta: 100,
        },
        {
            competencia: "Criatividade",
            desempenho: 78.6,
            meta: 100,
        },
        {
            competencia: "Liderança",
            desempenho: 85.4,
            meta: 100,
        },
        {
            competencia: "Resolução de Problemas",
            desempenho: 88.9,
            meta: 100,
        },
        {
            competencia: "Responsabilidade",
            desempenho: 93.1,
            meta: 100,
        },
        {
            competencia: "Empatia",
            desempenho: 89.7,
            meta: 100,
        },
    ],

    timestamp: new Date().toISOString(),
};

export default mockDashboardData;
