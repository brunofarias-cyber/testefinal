#!/usr/bin/env bash

# 🚀 QUICK START - REAL-TIME SYSTEM TEST

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 REAL-TIME SYSTEM TEST GUIDE${NC}\n"

echo -e "${YELLOW}📋 SETUP${NC}"
echo "1. Open 2 browser windows side by side"
echo "   - Left (Professor): http://localhost:5173"
echo "   - Right (Aluno): http://localhost:5173"
echo ""

echo -e "${YELLOW}🔑 LOGIN${NC}"
echo "Professor:"
echo "  Email: professor@bprojetos.com"
echo "  Password: prof123"
echo ""
echo "Aluno:"
echo "  Email: aluno@bprojetos.com"
echo "  Password: aluno123"
echo ""

echo -e "${YELLOW}📝 TEST 1: GRADES (Notas)${NC}"
echo "1. Aluno (Right): Navegue para 'Minhas Notas e Avaliações'"
echo "2. Professor (Left): Abra DevTools (F12 → Console)"
echo "3. Professor: Cole e execute:"
echo ""
cat << 'EOF'
fetch('/api/grades/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        studentId: 101,
        projectId: 1,
        grade: 9.5,
        feedback: 'Excelente trabalho!',
        teacherName: 'Prof. Ana Silva',
        projectTitle: 'Horta Sustentável'
    })
})
.then(res => res.json())
.then(data => console.log('✅ Sucesso:', data))
.catch(err => console.error('❌ Erro:', err))
EOF
echo ""
echo "4. Aluno (Right): Espere notificação aparecer 🔔"
echo "   - Notificação no topo direito"
echo "   - Nota apareça na lista"
echo "   - Grade atualize em tempo real"
echo ""

echo -e "${YELLOW}📝 TEST 2: ATTENDANCE (Presença)${NC}"
echo "1. Aluno (Right): Navegue para 'Minha Presença'"
echo "2. Professor (Left): Console aberto (F12)"
echo "3. Professor: Cole e execute:"
echo ""
cat << 'EOF'
fetch('/api/attendance/mark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        studentId: 101,
        classId: 1,
        className: 'Biologia - Turma A',
        status: 'presente',
        teacherName: 'Prof. Ana Silva',
        notes: 'Teste de presença em tempo real'
    })
})
.then(res => res.json())
.then(data => console.log('✅ Presença marcada:', data))
.catch(err => console.error('❌ Erro:', err))
EOF
echo ""
echo "4. Aluno (Right): Espere notificação 🔔"
echo "   - Notificação no topo direito"
echo "   - Novo registro aparece na lista"
echo "   - Estatísticas atualizam (+1 presente)"
echo ""

echo -e "${YELLOW}📊 TEST 3: VERIFICAR DADOS${NC}"
echo "1. Verificar grades do aluno:"
echo "   GET /api/grades/student/101"
echo ""
echo "2. Verificar presença do aluno:"
echo "   GET /api/attendance/student/101"
echo ""
echo "3. Verificar estatísticas:"
echo "   GET /api/attendance/stats/101"
echo ""

echo -e "${YELLOW}🎯 EXPECTED RESULTS${NC}"
echo "✅ Notificação aparece em < 1 segundo"
echo "✅ UI atualiza sem refresh"
echo "✅ Data persiste na lista"
echo "✅ Estatísticas recalculam automaticamente"
echo "✅ Nenhum erro no console"
echo ""

echo -e "${YELLOW}🐛 TROUBLESHOOTING${NC}"
echo "Problem: Notificação não aparece"
echo "  → Verificar que Aluno está na página certa"
echo "  → Verificar studentId é 101"
echo "  → Verificar no DevTools se há erros de Socket.io"
echo ""
echo "Problem: Erro ao enviar"
echo "  → Copiar toda a requisição fetch (ctrl+c)"
echo "  → Verificar Content-Type header"
echo "  → Verificar que backend está rodando (porta 3000)"
echo ""
echo "Problem: Socket.io connection refused"
echo "  → Verificar backend está rodando: npm run server:dev"
echo "  → Verificar porta 3000"
echo "  → Abrir DevTools → Network → WS"
echo ""

echo -e "${GREEN}✅ READY TO TEST!${NC}"
echo ""
echo "Start with:"
echo "  npm run dev"
echo ""
echo "Then follow the steps above!"
