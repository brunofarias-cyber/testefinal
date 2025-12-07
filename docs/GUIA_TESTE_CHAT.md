# 🚀 GUIA DE TESTE: Chat Real-Time Professor-Aluno

## ⏱️ Tempo Estimado: 15 minutos

---

## ✅ Pré-requisitos

```bash
# 1. Instalar dependências (se ainda não instalou)
cd /Users/brunopicanco/Desktop/testefinal
npm install socket.io-client

# 2. Verificar se servidor está rodando
lsof -i :3000  # Backend
lsof -i :5173  # Frontend

# Se não estiver, iniciar:
npm run dev
```

---

## 📝 TESTE 1: Chat Básico (Professor → Aluno)

### Passo 1: Abrir Frontend
1. Navegador 1 (Professor):
   - URL: http://localhost:5173
   - Login: `professor@bprojetos.com` / `prof123`

2. Navegador 2 (Aluno) - **Janela Anônima**:
   - URL: http://localhost:5173
   - Login: `aluno@bprojetos.com` / `aluno123`

### Passo 2: Professor Acessa Chat
1. Menu lateral → Clique em "Mensagens"
2. Deve aparecer lista de equipes:
   - ✓ "Equipe Alpha - Horta Sustentável"
   - ✓ "Equipe Beta - Robótica"
3. Clique em "Equipe Alpha"
4. Deve abrir tela de chat com:
   - ✓ Header: "Equipe Alpha" + status "🟢 Online"
   - ✓ Histórico de mensagens (se houver)
   - ✓ Input de texto + botão "Enviar"

### Passo 3: Aluno Acessa Chat
1. No navegador do aluno → Menu "Mensagens"
2. Deve aparecer apenas equipes onde ele está:
   - ✓ "Equipe Alpha - Horta Sustentável" (se João estiver nela)
3. Clique na mesma equipe
4. Deve abrir mesmo chat que o professor

### Passo 4: Testar Sincronização Real-Time
1. **Professor** digita: "Olá equipe! Como está o projeto?"
2. Clique em "Enviar" (ou Enter)
3. **RESULTADO ESPERADO:**
   - ✓ Mensagem aparece no chat do professor IMEDIATAMENTE
   - ✓ Mensagem aparece no chat do aluno IMEDIATAMENTE (< 1 segundo)
   - ✓ Console mostra: `📩 Nova mensagem recebida: Olá equipe!...`

4. **Aluno** responde: "Bom dia! Estamos documentando as fotos."
5. Clique em "Enviar"
6. **RESULTADO ESPERADO:**
   - ✓ Mensagem aparece no chat do aluno
   - ✓ Mensagem aparece no chat do professor INSTANTANEAMENTE

---

## 🔍 TESTE 2: Reconnection (Resiliência)

### Cenário: Perda de Conexão
1. Com o chat aberto em ambos navegadores
2. Abra Console do navegador (F12)
3. Simule desconexão:
   ```javascript
   // No console do navegador
   window.location.reload();  // Ou simplesmente recarregar página
   ```
4. **RESULTADO ESPERADO:**
   - ✓ Status muda para "🔴 Offline"
   - ✓ Após 1-2 segundos: reconecta automaticamente
   - ✓ Status volta para "🟢 Online"
   - ✓ Mensagens anteriores ainda visíveis (persistência)

---

## 🧪 TESTE 3: Múltiplos Membros (Simulação)

### Cenário: 3+ usuários na mesma equipe
1. Abrir 3 abas/navegadores:
   - Aba 1: Professor (Chrome normal)
   - Aba 2: Aluno João (Chrome Incognito)
   - Aba 3: Aluno Maria (Firefox)

2. Todos acessam "Equipe Alpha"
3. Professor envia: "Reunião amanhã às 14h"
4. **RESULTADO ESPERADO:**
   - ✓ Mensagem aparece para TODOS simultaneamente
   - ✓ João vê a mensagem
   - ✓ Maria vê a mensagem
   - ✓ Professor vê a mensagem

---

## ❌ TESTE 4: Isolamento de Equipes

### Cenário: Mensagens não vazam entre equipes
1. Professor abre "Equipe Alpha"
2. Professor envia: "Mensagem para Alpha"
3. Professor volta e abre "Equipe Beta"
4. **RESULTADO ESPERADO:**
   - ✓ "Mensagem para Alpha" NÃO aparece em Beta
   - ✓ Histórico de Beta está vazio (ou com mensagens antigas)

5. Aluno que está apenas em "Equipe Beta":
   - ✓ NÃO vê "Equipe Alpha" na lista
   - ✓ NÃO recebe mensagens de Alpha

---

## 🐛 TESTE 5: Fallback (Sem Socket.io)

### Cenário: Sistema funciona sem WebSocket
1. Desabilitar Socket.io no backend:
   ```javascript
   // No arquivo server.js, comentar:
   // import { setupSocketIO } from './config/socket-io.js';
   // setupSocketIO(server);
   ```
2. Reiniciar backend
3. Enviar mensagem pelo chat
4. **RESULTADO ESPERADO:**
   - ✓ Mensagem é enviada via REST API (fallback)
   - ✓ Console mostra: `✅ Mensagem enviada via REST API`
   - ✓ Mensagem não aparece instantaneamente (precisa recarregar)
   - ✓ Após recarregar página: mensagem está lá (persistência funciona)

---

## 📊 Checklist de Validação

### ✅ Chat Funcional
- [ ] Professor vê lista de equipes
- [ ] Aluno vê apenas suas equipes
- [ ] Abrir chat carrega histórico
- [ ] Enviar mensagem funciona
- [ ] Mensagens sincronizam em tempo real
- [ ] Status de conexão correto (🟢/🔴)

### ✅ Socket.io
- [ ] Console mostra "✅ Socket.io conectado"
- [ ] Console mostra "✅ Entrou na room: team_X"
- [ ] Console mostra "📩 Nova mensagem recebida"
- [ ] Reconnection automática após reload

### ✅ Persistência
- [ ] Mensagens salvas no banco (ou mock)
- [ ] Histórico carrega após reabrir chat
- [ ] Mensagens sobrevivem a reload

### ✅ Isolamento
- [ ] Mensagens de Equipe A não aparecem em B
- [ ] Aluno só vê equipes onde está vinculado
- [ ] Socket rooms separados por team_id

---

## 🔧 Troubleshooting

### Problema: "Nenhuma equipe encontrada"
**Causa**: Dados mock não carregaram ou userId incorreto

**Solução**:
```javascript
// Verificar no console do navegador:
console.log(currentUser);  // Deve ter id, name, role

// Verificar no backend:
curl http://localhost:3000/api/teams/teacher/1
```

### Problema: Mensagens não sincronizam
**Causa**: Socket.io não conectou

**Solução**:
```javascript
// Console do navegador deve mostrar:
✅ Socket.io conectado

// Se mostrar erro:
⚠️ Socket.io erro, usando fallback polling

// Verifique CORS no backend (server.js):
cors: {
  origin: 'http://localhost:5173',  // ← Conferir URL
  credentials: true
}
```

### Problema: "Cannot read property 'emit' of null"
**Causa**: Socket não inicializou

**Solução**:
```javascript
// Em MessagingSystemV2.jsx, adicionar verificação:
if (socket && connected) {
  socket.emit('send_message', newMessage);
} else {
  console.warn('Socket offline, usando REST API');
  // Fallback para fetch()
}
```

---

## 📸 Evidências Esperadas

### Console do Navegador (F12)
```
✅ Socket.io conectado
✅ Equipes carregadas: 2
✅ Entrou na room: team_1
📩 Nova mensagem recebida: Olá equipe!...
✅ Mensagem enviada via Socket.io
```

### Network Tab (F12)
```
GET /api/teams/teacher/1  ← Status 200 ✓
WS  ws://localhost:3000   ← Status 101 Switching Protocols ✓
```

### Terminal Backend
```
✅ Socket conectado: a1b2c3d4
👥 User 1 (teacher) entrou em: team_1
📩 Mensagem enviada para team_1: Olá equipe!...
```

---

## 🎯 Resultado Final

### ✅ SUCESSO se:
1. Mensagens chegam em < 1 segundo
2. Ambos os perfis veem a mesma conversa
3. Status de conexão muda corretamente
4. Reconnection automática funciona
5. Histórico persiste após reload

### ❌ FALHA se:
1. Mensagens demoram > 5 segundos
2. Professor e aluno veem chats diferentes
3. Socket não conecta (erro no console)
4. Mensagens somem após reload
5. Equipes aparecem para alunos errados

---

## 📞 Suporte

Se todos os testes passarem: **Sistema está pronto!** ✅

Se algum teste falhar, verificar:
1. Logs do backend no terminal
2. Console do navegador (F12)
3. Network tab para ver requisições
4. Arquivo `AUDITORIA_CRITICA_INTEGRACAO.md` para debug

---

**Guia criado por**: Engenheiro de Software Sênior  
**Última atualização**: 7 de dezembro de 2025  
**Tempo de execução**: ~15 minutos
