# 🚀 GUIA DE EXECUÇÃO - Sistema Real-Time Educacional

> Instruções Passo a Passo para Iniciar o Projeto
>
> ⏱️ Tempo: **5 minutos**  
> 📋 Requisitos: **Node.js + npm**  
> ✅ Dificuldade: **Muito Fácil**

---

## 📋 PRÉ-REQUISITOS

Verifique se você tem instalado:

```bash
# Verificar Node.js
node --version  # Deve ser v14+ (testado com v16+)

# Verificar npm
npm --version   # Deve ser v6+ (testado com v8+)
```

Se não tiver, instale de: https://nodejs.org/

---

## 🎯 PASSO 1: Navegar até o Projeto

```bash
cd /Users/brunopicanco/Desktop/testefinal
```

---

## 🎯 PASSO 2: Instalar Dependências (Se Necessário)

```bash
# Instalar todas as dependências do projeto
npm install

# Ou se prefere atualizar:
npm install --legacy-peer-deps
```

Isso vai levar ~1-2 minutos. Se aparecer warning de dependências, é normal.

---

## 🎯 PASSO 3: Iniciar o Servidor

```bash
npm run dev
```

Você verá algo como:

```
  VITE v4.0.0  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🎯 PASSO 4: Abrir no Navegador

Clique no link ou abra em seu navegador:

```
http://localhost:5173
```

---

## 🎯 PASSO 5: Fazer Login

### Opção A: Login como ALUNO

1. Clique em "Entrar como Aluno"
2. ID: **101**
3. Email: Pré-preenchido
4. Click em "Entrar"

### Opção B: Login como PROFESSOR

1. Clique em "Entrar como Professor"
2. ID: **1**
3. Email: Pré-preenchido
4. Click em "Entrar"

### Opção C: Login como COORDENADOR

1. Clique em "Entrar como Coordenador"
2. ID: **500**
3. Email: Pré-preenchido
4. Click em "Entrar"

---

## 🎯 PASSO 6: Explorar as Novas Abas

### Se Logado como ALUNO (101)

Você verá na sidebar esquerda:

```
📚 Projetos
📊 Progresso
🏆 Missões
💼 Portfólio
⭐ Notas
📤 Entregas      ← NOVO (clique aqui!)
✅ Presença     ← NOVO (clique aqui!)
🌟 Avaliações   ← NOVO (clique aqui!)
📅 Calendário
💬 Mensagens
🔔 Notificações
🎯 Competências
```

**Teste cada aba:**
- **Entregas:** Ver trabalhos enviados
- **Presença:** Ver frequência registrada
- **Avaliações:** Ver rúbricas e feedback

### Se Logado como PROFESSOR (1)

Você verá na sidebar esquerda:

```
⚡ Central do Professor
🎯 Central 360°
👥 Turmas
🤖 Copiloto IA
🌐 Conhecendo Projetos
📋 Situação para Análise
📝 Correção de Trabalhos
⭐ Distribuir Notas        ← NOVO (clique aqui!)
✅ Registrar Presença     ← NOVO (clique aqui!)
📤 Avaliar Entregas       ← NOVO (clique aqui!)
🌟 Criar Rúbricas        ← NOVO (clique aqui!)
📊 Dashboard
📈 Performance
💬 Mensagens
📑 Relatórios
...
```

**Teste cada aba:**
- **Distribuir Notas:** Abrir modal para enviar notas
- **Criar Rúbricas:** Abrir wizard para criar rúbricas
- **Registrar Presença:** Placeholder (será expandido)
- **Avaliar Entregas:** Placeholder (será expandido)

---

## 🧪 PASSO 7: Testar Real-time Socket.io

### Teste 1: Aluno Vê Notificação de Avaliação

```bash
# Terminal separado (DevTools Console do Navegador)

# 1. Certifique-se de estar logado como ALUNO (ID: 101)
# 2. Abra DevTools Console (F12 ou Cmd+Option+I)
# 3. Cole o código abaixo:
```

```javascript
// Teste de Avaliação Real-time
fetch('/api/rubrics/1/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        studentId: 101,
        studentName: 'João Silva',
        scores: [
            { criteriaId: 1, points: 23, feedback: 'Excelente planejamento' },
            { criteriaId: 2, points: 24, feedback: 'Executado com precisão' },
            { criteriaId: 3, points: 22, feedback: 'Bem documentado' },
            { criteriaId: 4, points: 23, feedback: 'Apresentação clara' }
        ],
        comments: 'Parabéns pelo excelente trabalho!',
        evaluatedBy: 'Prof. Ana Silva'
    })
})
.then(r => r.json())
.then(d => console.log('✅ Avaliação enviada:', d))
.catch(e => console.error('❌ Erro:', e));
```

**Resultado esperado:**
- ✅ Veja resposta JSON no console
- ✅ Uma notificação verde aparecer no topo direito da tela
- ✅ A página atualizar automaticamente com a nova avaliação

### Teste 2: Criar Rúbrica via API

```javascript
// Teste de Criação de Rúbrica
fetch('/api/rubrics/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        projectId: 1,
        projectTitle: 'Horta Sustentável',
        criteria: [
            { name: 'Planejamento', maxPoints: 25, description: 'Qualidade do planejamento' },
            { name: 'Execução', maxPoints: 25, description: 'Qualidade da execução' },
            { name: 'Documentação', maxPoints: 25, description: 'Qualidade da documentação' },
            { name: 'Apresentação', maxPoints: 25, description: 'Qualidade da apresentação' }
        ],
        createdBy: 'Prof. Ana Silva'
    })
})
.then(r => r.json())
.then(d => console.log('✅ Rúbrica criada:', d))
.catch(e => console.error('❌ Erro:', e));
```

### Teste 3: Marcar Presença via API

```javascript
// Teste de Presença
fetch('/api/attendance/mark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        studentId: 101,
        classId: 1,
        className: 'Biologia - Turma A',
        status: 'presente',
        teacherName: 'Prof. Ana Silva'
    })
})
.then(r => r.json())
.then(d => console.log('✅ Presença marcada:', d))
.catch(e => console.error('❌ Erro:', e));
```

---

## 🎨 PASSO 8: Explorar Componentes Específicos

### Para ALUNO - Ir em "Entregas"

Você verá:
- 📊 Estatísticas (Total, Avaliadas, Média)
- 📋 Lista de entregas
- 🔔 Notificações em tempo real
- ⭐ Cards expandíveis com feedback

### Para ALUNO - Ir em "Avaliações"

Você verá:
- 📊 Estatísticas (Total, Média geral)
- 📋 Lista de rúbricas avaliadas
- 🔍 Expandir para ver feedback por critério
- ⭐ Progress bars por critério

### Para PROFESSOR - Ir em "Criar Rúbricas"

Você verá:
- **Step 1:** Adicionar critérios
- **Step 2:** Revisar antes de enviar
- **Step 3:** Confirmação de sucesso

Siga o wizard para criar uma rúbrica!

### Para PROFESSOR - Ir em "Distribuir Notas"

Você verá:
- Modal para enviar nota
- Campos: Aluno, Projeto, Nota (0-10), Feedback
- Validações em tempo real

---

## 🆘 TROUBLESHOOTING

### Problema: "Cannot find module"
**Solução:**
```bash
npm install
npm run dev
```

### Problema: Porta 5173 já em uso
**Solução:**
```bash
# Matar processo na porta 5173
lsof -i :5173
kill -9 <PID>

# Ou iniciar em outra porta
npm run dev -- --port 5174
```

### Problema: Não vê as novas abas
**Solução:**
1. Fazer logout (botão "Sair" no canto)
2. Limpar cache: Ctrl+Shift+Delete
3. Recarregar a página: F5
4. Fazer login novamente

### Problema: Socket.io não funciona
**Solução:**
1. Verificar se servidor está rodando (npm run dev)
2. Abrir DevTools Console (F12)
3. Ver erros de rede
4. Verificar se `/api/` endpoints respondem

### Problema: Notificações não aparecem
**Solução:**
1. Verificar se Socket.io conectou
2. DevTools Console → Network → WS
3. Procurar conexão `socket.io`
4. Se vermelha, servidor não está rodando

---

## 📚 COMANDOS ÚTEIS

```bash
# Iniciar servidor em desenvolvimento
npm run dev

# Parar servidor
Ctrl + C

# Instalar dependências
npm install

# Atualizar dependências
npm update

# Limpar cache
npm cache clean --force

# Ver porta em uso
lsof -i :5173

# Matar processo na porta
kill -9 <PID>
```

---

## 🔍 ARQUIVOS PRINCIPAIS

| Arquivo | O que é |
|---------|---------|
| `src/App.jsx` | Arquivo principal com sidebar e routing |
| `src/components/` | Componentes React (inclusive os novos) |
| `routes/` | APIs backend (grades.js, attendance.js, etc) |
| `server.js` | Servidor Node.js com Socket.io |
| `package.json` | Dependências do projeto |

---

## 🎓 ESTRUTURA DO PROJETO

```
testefinal/
├── src/
│   ├── App.jsx                      (Principal com sidebar)
│   ├── components/
│   │   ├── GradeSubmissionModal.jsx (✅ Novo)
│   │   ├── StudentAttendanceView.jsx (✅ Novo)
│   │   ├── StudentSubmissionsView.jsx (✅ Novo)
│   │   ├── StudentRubricsView.jsx    (✅ Novo)
│   │   ├── RubricDistributionModal.jsx (✅ Novo)
│   │   └── ... (outros componentes)
│   └── ...
├── routes/
│   ├── grades.js                    (✅ Novo)
│   ├── attendance.js                (✅ Novo)
│   ├── submissions.js               (✅ Novo)
│   ├── rubrics.js                   (✅ Novo)
│   └── ... (outras rotas)
├── server.js                        (Servidor Node.js)
├── package.json                     (Dependências)
└── ... (outros arquivos)
```

---

## 🎯 RESUMO RÁPIDO

| Ação | Como Fazer |
|------|-----------|
| Iniciar | `npm run dev` |
| Acessar | http://localhost:5173 |
| Login Aluno | ID: 101 |
| Login Professor | ID: 1 |
| Novo Aluno | "Entregas", "Presença", "Avaliações" |
| Novo Professor | "Distribuir Notas", "Criar Rúbricas" |
| Testar Real-time | DevTools Console + fetch |
| Parar | Ctrl + C |

---

## 🎉 RESULTADO ESPERADO

Quando tudo funcionar corretamente, você verá:

✅ **Navegador abre em http://localhost:5173**  
✅ **Tela de login aparece**  
✅ **Após login, sidebar mostra 4 novas abas**  
✅ **Clicando nas abas, componentes carregam**  
✅ **Socket.io conecta (sem erros no console)**  
✅ **APIs responderm (teste no DevTools)**  
✅ **Notificações aparecem em tempo real**  

---

## 🚀 PRÓXIMAS AÇÕES

1. **Agora:** Execute `npm run dev`
2. **Então:** Faça login como aluno/professor
3. **Depois:** Explore as novas abas
4. **Finalmente:** Teste com os comandos do Passo 7

---

## 📞 AJUDA

Se algo não funcionar:

1. ✅ Verifique se `npm run dev` está rodando
2. ✅ Verifique se porta 5173 está aberta
3. ✅ Limpe o cache do navegador (Ctrl+Shift+Delete)
4. ✅ Recarregue a página (F5)
5. ✅ Abra DevTools Console (F12) e procure por erros vermelhos
6. ✅ Tente fazer logout e login novamente

---

**⏱️ Tempo Total: ~5 minutos**

**🎉 Pronto para usar!**

═══════════════════════════════════════════════════════════════

Publicado: 10 de dezembro de 2024

═══════════════════════════════════════════════════════════════
