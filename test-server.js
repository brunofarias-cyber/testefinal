import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando!' });
});

app.get('/api/attendance/student/:id', (req, res) => {
  res.json({ success: true, studentId: req.params.id, data: [] });
});

app.post('/api/grades/create', (req, res) => {
  const { studentId, grade } = req.body;
  if (!studentId || grade === undefined) {
    return res.status(400).json({ error: 'Faltam campos obrigatórios' });
  }
  if (grade < 0 || grade > 10) {
    return res.status(400).json({ error: 'Nota deve estar entre 0 e 10' });
  }
  res.json({ success: true, message: 'Nota criada!' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`�� Health: http://localhost:${PORT}/api/health`);
});
