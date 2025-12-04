import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OverviewCards, LevelDistributionChart } from '../BnccDashboard';
import { RubricEditor } from '../BnccRubric';
import { StudentTimeline } from '../BnccHistory';
import { NotificationCenter, SuggestionsPanel, ShareRelatorio } from '../BnccAdvanced';

// Mock fetch
global.fetch = jest.fn();

describe('BnccDashboard Components', () => {

    beforeEach(() => {
        fetch.mockClear();
    });

    describe('OverviewCards', () => {
        test('deve renderizar cards com dados', async () => {
            fetch.mockResolvedValueOnce({
                json: async () => ({
                    data: {
                        totalEvaluations: 50,
                        studentsEvaluated: 25,
                        averagePoints: 7.5,
                        levelDistribution: [
                            { level: 1, count: 5 },
                            { level: 5, count: 10 },
                        ],
                    },
                }),
            });

            render(<OverviewCards projectId="1" />);

            await waitFor(() => {
                expect(screen.getByText('50')).toBeInTheDocument();
                expect(screen.getByText('25')).toBeInTheDocument();
                expect(screen.getByText('7.5')).toBeInTheDocument();
            });
        });

        test('deve mostrar "Carregando" inicialmente', () => {
            fetch.mockResolvedValueOnce({
                json: async () => ({ data: {} }),
            });

            render(<OverviewCards projectId="1" />);
            expect(screen.getByText('Carregando...')).toBeInTheDocument();
        });
    });

    describe('LevelDistributionChart', () => {
        test('deve renderizar gráfico com dados', async () => {
            fetch.mockResolvedValueOnce({
                json: async () => ({
                    data: {
                        levelDistribution: [
                            { level: 1, count: 5 },
                            { level: 2, count: 10 },
                            { level: 3, count: 15 },
                            { level: 4, count: 20 },
                            { level: 5, count: 25 },
                        ],
                    },
                }),
            });

            const { container } = render(<LevelDistributionChart projectId="1" />);

            await waitFor(() => {
                expect(container.querySelector('svg')).toBeInTheDocument();
            });
        });
    });
});

// ==========================================

describe('RubricEditor', () => {
    test('deve carregar e editar indicadores', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [
                    { id: 1, level: 1, description: 'Não apresentado', points: 0 },
                    { id: 2, level: 5, description: 'Avançado', points: 10 },
                ],
            }),
        });

        render(
            <RubricEditor projectId="1" skillCode="EF06MA01" />
        );

        await waitFor(() => {
            expect(screen.getByText(/Não apresentado/i)).toBeInTheDocument();
            expect(screen.getByText(/Avançado/i)).toBeInTheDocument();
        });
    });
});

// ==========================================

describe('StudentTimeline', () => {
    test('deve exibir timeline de projetos', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [
                    { projectId: 1, date: '2024-01-10', averageLevel: 3.5, evaluations: 10 },
                    { projectId: 2, date: '2024-02-20', averageLevel: 4.2, evaluations: 12 },
                ],
            }),
        });

        render(<StudentTimeline studentId="101" />);

        await waitFor(() => {
            expect(screen.getByText(/Projeto #1/i)).toBeInTheDocument();
            expect(screen.getByText(/Projeto #2/i)).toBeInTheDocument();
        });
    });

    test('deve mostrar "Sem histórico" quando vazio', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [],
            }),
        });

        render(<StudentTimeline studentId="101" />);

        await waitFor(() => {
            expect(screen.getByText(/Sem histórico/i)).toBeInTheDocument();
        });
    });
});

// ==========================================

describe('NotificationCenter', () => {
    test('deve listar notificações', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [
                    { id: 1, message: 'Habilidade não apresentada', type: 'warning', read: false, createdAt: new Date() },
                    { id: 2, message: 'Excelente desempenho!', type: 'success', read: false, createdAt: new Date() },
                ],
            }),
        });

        render(<NotificationCenter studentId="101" />);

        await waitFor(() => {
            expect(screen.getByText('Habilidade não apresentada')).toBeInTheDocument();
            expect(screen.getByText('Excelente desempenho!')).toBeInTheDocument();
        });
    });

    test('deve mostrar contador de não lidas', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [
                    { id: 1, message: 'Teste 1', type: 'info', read: false, createdAt: new Date() },
                    { id: 2, message: 'Teste 2', type: 'info', read: false, createdAt: new Date() },
                ],
            }),
        });

        render(<NotificationCenter studentId="101" />);

        await waitFor(() => {
            expect(screen.getByText(/2 novas/i)).toBeInTheDocument();
        });
    });
});

// ==========================================

describe('SuggestionsPanel', () => {
    test('deve exibir sugestões', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [
                    {
                        type: 'warning',
                        priority: 'high',
                        title: 'Habilidades faltando',
                        description: 'Aluno não apresentou algumas habilidades',
                        recommendation: 'Ofereça reforço'
                    },
                ],
            }),
        });

        render(<SuggestionsPanel studentId="101" projectId="1" />);

        await waitFor(() => {
            expect(screen.getByText('Habilidades faltando')).toBeInTheDocument();
        });
    });

    test('deve mostrar mensagem quando não há sugestões', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [],
            }),
        });

        render(<SuggestionsPanel studentId="101" projectId="1" />);

        await waitFor(() => {
            expect(screen.getByText(/aluno está indo bem/i)).toBeInTheDocument();
        });
    });
});

// ==========================================

describe('ShareRelatorio', () => {
    test('deve renderizar formulário de compartilhamento', () => {
        render(<ShareRelatorio projectId="1" studentId="101" />);

        expect(screen.getByPlaceholderText(/Nome do destinatário/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Enviar Relatório/i })).toBeInTheDocument();
    });
});

// ==========================================

describe('Integration Tests - Components', () => {
    test('fluxo completo: dashboard → suggestions → share', async () => {
        // 1. Dashboard carrega
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: { totalEvaluations: 50, studentsEvaluated: 25, averagePoints: 7.5, levelDistribution: [] },
            }),
        });

        const { rerender } = render(<OverviewCards projectId="1" />);

        await waitFor(() => {
            expect(screen.getByText('50')).toBeInTheDocument();
        });

        // 2. Sugestões carregam
        fetch.mockResolvedValueOnce({
            json: async () => ({
                data: [{ type: 'warning', priority: 'high', title: 'Habilidades faltando', description: 'Teste', recommendation: 'Teste' }],
            }),
        });

        rerender(<SuggestionsPanel studentId="101" projectId="1" />);

        await waitFor(() => {
            expect(screen.getByText('Habilidades faltando')).toBeInTheDocument();
        });

        // 3. Share component renderiza
        rerender(<ShareRelatorio projectId="1" studentId="101" />);

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    });
});
