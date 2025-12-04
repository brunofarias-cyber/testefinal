import request from 'supertest';
import app from '../server.js';
import sequelize from '../config/database.js';
import seedBNCCData from '../seeds/bncc-data.js';

describe('BNCC Routes', () => {

    beforeAll(async () => {
        // Sincronizar banco e rodar seed
        await sequelize.sync({ force: true });
        await seedBNCCData();
    }, 30000);

    afterAll(async () => {
        await sequelize.close();
    });

    // ==========================================
    // Dashboard Tests
    // ==========================================

    describe('GET /api/bncc-dashboard/overview/:projectId', () => {
        test('deve retornar overview do projeto', async () => {
            const res = await request(app)
                .get('/api/bncc-dashboard/overview/1');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('totalEvaluations');
            expect(res.body.data).toHaveProperty('studentsEvaluated');
            expect(res.body.data).toHaveProperty('levelDistribution');
        });

        test('deve retornar 404 para projeto inexistente', async () => {
            const res = await request(app)
                .get('/api/bncc-dashboard/overview/99999');

            expect(res.status).toBeGreaterThanOrEqual(400);
        });
    });

    describe('GET /api/bncc-dashboard/coverage/:projectId', () => {
        test('deve retornar cobertura BNCC', async () => {
            const res = await request(app)
                .get('/api/bncc-dashboard/coverage/1');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('total');
            expect(res.body.data).toHaveProperty('evaluated');
            expect(res.body.data).toHaveProperty('percentageCovered');
        });
    });

    describe('GET /api/bncc-dashboard/top-students/:projectId', () => {
        test('deve retornar top performers', async () => {
            const res = await request(app)
                .get('/api/bncc-dashboard/top-students/1');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);

            if (res.body.data.length > 0) {
                expect(res.body.data[0]).toHaveProperty('studentId');
                expect(res.body.data[0]).toHaveProperty('averagePoints');
            }
        });
    });

    describe('GET /api/bncc-dashboard/at-risk/:projectId', () => {
        test('deve retornar alunos em risco', async () => {
            const res = await request(app)
                .get('/api/bncc-dashboard/at-risk/1');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    // ==========================================
    // Rubrics Tests
    // ==========================================

    describe('GET /api/bncc-rubrics/:projectId/:skillCode', () => {
        test('deve retornar indicadores da habilidade', async () => {
            const res = await request(app)
                .get('/api/bncc-rubrics/1/EF06MA01');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);

            if (res.body.data.length > 0) {
                expect(res.body.data[0]).toHaveProperty('level');
                expect(res.body.data[0]).toHaveProperty('description');
            }
        });
    });

    describe('PUT /api/bncc-rubrics/:id', () => {
        test('deve atualizar indicador', async () => {
            const res = await request(app)
                .put('/api/bncc-rubrics/1')
                .send({
                    description: 'Descrição atualizada',
                    points: 7.5,
                });

            expect(res.status).toBeGreaterThanOrEqual(200);
            expect(res.status).toBeLessThan(400);
        });
    });

    // ==========================================
    // History Tests
    // ==========================================

    describe('GET /api/bncc-history/student-timeline/:studentId', () => {
        test('deve retornar timeline do aluno', async () => {
            const res = await request(app)
                .get('/api/bncc-history/student-timeline/101');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('GET /api/bncc-history/skill-evolution/:studentId/:skillCode', () => {
        test('deve retornar evolução da habilidade', async () => {
            const res = await request(app)
                .get('/api/bncc-history/skill-evolution/101/EF06MA01');

            expect(res.status).toBe(200);
            expect(res.body.data).toBeDefined();
            expect(res.body).toHaveProperty('improvement');
        });
    });

    describe('GET /api/bncc-history/annual-report/:studentId/:year', () => {
        test('deve retornar relatório anual', async () => {
            const res = await request(app)
                .get('/api/bncc-history/annual-report/101/2024');

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty('year');
            expect(res.body.data).toHaveProperty('totalEvaluations');
        });
    });

    // ==========================================
    // Advanced Features Tests
    // ==========================================

    describe('POST /api/bncc-advanced/suggestions/:studentId/:projectId', () => {
        test('deve retornar sugestões automáticas', async () => {
            const res = await request(app)
                .post('/api/bncc-advanced/suggestions/101/1');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('GET /api/bncc-advanced/notifications/:studentId', () => {
        test('deve retornar notificações', async () => {
            const res = await request(app)
                .get('/api/bncc-advanced/notifications/101');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    // ==========================================
    // PDF Export Tests
    // ==========================================

    describe('GET /api/bncc-pdf/report/:projectId/:studentId', () => {
        test('deve gerar PDF do aluno', async () => {
            const res = await request(app)
                .get('/api/bncc-pdf/report/1/101');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toContain('pdf');
        });
    });
});

// ==========================================
// Integration Tests
// ==========================================

describe('BNCC Integration', () => {

    test('fluxo completo: avaliar → dashboard → pdf', async () => {
        // 1. Criar avaliação
        const evalRes = await request(app)
            .post('/api/bncc/evaluations')
            .send({
                studentId: '101',
                projectId: '1',
                skillCode: 'EF06MA01',
                chosenLevel: 4,
                points: 7.5,
            });

        expect(evalRes.status).toBe(201);

        // 2. Verificar no dashboard
        const dashRes = await request(app)
            .get('/api/bncc-dashboard/overview/1');

        expect(dashRes.status).toBe(200);
        expect(dashRes.body.data.totalEvaluations).toBeGreaterThan(0);

        // 3. Gerar PDF
        const pdfRes = await request(app)
            .get('/api/bncc-pdf/report/1/101');

        expect(pdfRes.status).toBe(200);
    }, 10000); // timeout de 10s para teste de integração
});
