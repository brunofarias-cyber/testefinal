# 🚀 Guia Rápido - Hub de Comunicação Coordenador

**Status:** ✅ PRONTO PARA USO  
**Versão:** 1.0  
**Última atualização:** 2024-12-20

---

## 📍 Como Acessar

1. Abra a aplicação em `http://localhost:5174/`
2. Faça login como **Coordenador**
3. No menu lateral, clique em **💬 Comunicação**
4. A página do Hub de Comunicação abre

---

## ✉️ Enviando um Comunicado

### Passo 1: Escolher Destinatários

Você tem 4 opções:

```
📢 Todos (Alunos + Professores)
   └─→ Alcança 10 pessoas (6 alunos + 4 professores)

👨‍🎓 Todos os Alunos
   └─→ Alcança 6 alunos

👨‍🏫 Todos os Professores
   └─→ Alcança 4 professores

📚 Por Turma
   └─→ Selecione uma turma específica:
       • 7º Ano A (2 alunos)
       • 7º Ano B (2 alunos)
       • 8º Ano A (2 alunos)
       • 8º Ano B (0 alunos neste mock)
```

### Passo 2: Escrever a Mensagem

```
[Caixa de Texto]
"Escreva seu comunicado aqui..."
- Sem limite de caracteres (contador exibido)
- Sem limite de linhas
- Suporta quebras de linha
```

### Passo 3: Verificar Preview

```
Antes de enviar, veja:
📍 Destinatários: X pessoas
   (mostra a contagem total)
```

### Passo 4: Enviar

```
[Botão Enviar Comunicado]
   └─→ Valida mensagem
   └─→ Emite Socket.io
   └─→ Mostra notificação de sucesso
   └─→ Adiciona ao histórico
   └─→ Limpa o formulário
```

---

## 📜 Vendo o Histórico

### Abra a aba "Histórico"

Todos os comunicados aparecem em **ordem cronológica** (mais recentes primeiro).

### Para cada comunicado, veja:

```
┌─────────────────────────────────────────┐
│ Título do Comunicado              ✅    │
│ 📍 Para: [Destinatários]                │
│                                         │
│ Conteúdo da mensagem...                │
│                                         │
│ 📤 Enviado: 2h atrás                   │
│ 📖 Lido por: 42/65 (64%)               │
│                                         │
│ [Editar] [Deletar]                    │
└─────────────────────────────────────────┘
```

### Deletar um Comunicado

1. Clique no botão **[Deletar]**
2. Confirme a ação no popup
3. Comunicado desaparece do histórico

---

## 👥 Vendo Destinatários

### Abra a aba "Destinatários"

Veja duas seções lado a lado:

#### Alunos (6 registros)

```
👨‍🎓 Alunos (6)
├─ João Silva 🟢
│  7º Ano A
├─ Maria Santos 🟢
│  7º Ano A
├─ Pedro Costa 🟢
│  7º Ano B
├─ Ana Lima ⚫
│  7º Ano B (INATIVO)
├─ Lucas Oliveira 🟢
│  8º Ano A
└─ Julia Souza 🟢
   8º Ano A

🟢 = Ativo
⚫ = Inativo
```

#### Professores (4 registros)

```
👨‍🏫 Professores (4)
├─ Prof. João Ferreira 🟢
│  Português
├─ Prof. Ana Silva 🟢
│  Matemática
├─ Prof. Carlos Oliveira 🟢
│  Ciências
└─ Prof. Rita Costa ⚫
   História (INATIVO)

🟢 = Ativo
⚫ = Inativo
```

---

## 🔔 Notificações

### Sucesso (Verde)

```
✅ Comunicado enviado com sucesso!
```

Aparece por 4 segundos no canto superior direito.

### Erro (Vermelho)

```
❌ Escreva uma mensagem!
❌ Selecione uma turma!
```

Aparece se:
- Tentar enviar mensagem vazia
- Tentar enviar para turma sem selecionar qual turma

---

## 🎯 Exemplos de Uso

### Exemplo 1: Aviso Geral

```
Destinatários: 📢 Todos
Mensagem: "Atenção: a escola funcionará em horário reduzido no próximo feriado."
Resultado: 10 pessoas recebem (6 alunos + 4 professores)
```

### Exemplo 2: Aviso para Alunos

```
Destinatários: 👨‍🎓 Todos os Alunos
Mensagem: "Lembrando que o projeto de ciências vence no próximo sábado."
Resultado: 6 alunos recebem
```

### Exemplo 3: Reunião de Professores

```
Destinatários: 👨‍🏫 Todos os Professores
Mensagem: "Reunião administrativa amanhã às 16h. Presença obrigatória."
Resultado: 4 professores recebem
```

### Exemplo 4: Para Turma Específica

```
Destinatários: 📚 Por Turma
Turma Selecionada: 7º Ano A
Mensagem: "Vocês foram indicados para participar da olimpíada de português!"
Resultado: 2 alunos do 7º Ano A recebem
```

---

## ⚙️ Funcionalidades Técnicas

### Socket.io

```
Ao enviar um comunicado, o sistema emite:

socket.emit('coordinator-message', {
  messageId: 1,
  content: "Conteúdo da mensagem",
  recipients: "all",              // all, students, teachers, select-class
  selectedClass: "7a",            // Apenas se select-class
  timestamp: 2024-12-20T22:00:00Z
})
```

### Validation

```
✓ Não permite enviar vazio
✓ Não permite turma sem seleção
✓ Contador de caracteres em tempo real
✓ Preview de destinatários
```

### Histórico

```
Salvo em memória (mockado):
- ID único
- Timestamp de envio
- Contagem de destinatários
- Contagem de leitura (mockada)
- Taxa de leitura em %
```

---

## 🚨 Troubleshooting

### A página não carrega

```
✓ Certifique-se de que está em http://localhost:5174
✓ Verifique se o server está rodando: npm run dev
✓ Limpe o cache: Cmd+Shift+R (Mac) ou Ctrl+Shift+R (Windows)
```

### Botão "Enviar" não funciona

```
✓ Verifique se escreveu algo na mensagem
✓ Se selecionou "Por Turma", certifique-se de selecionar uma turma
✓ Veja se há notificação de erro (vermelha) no canto
```

### Mensagem não aparece no histórico

```
✓ Atualize a página: F5
✓ Verifique se clicou em "Enviar Comunicado" (não "Enviar" do browser)
✓ Abra a aba "Histórico" para ver os comunicados enviados
```

### Socket.io não conecta

```
✓ Verifique no console do navegador (F12)
✓ Procure por: "✅ Conectado ao servidor"
✓ Se não aparece, reinicie o servidor: npm run dev
```

---

## 📋 Checklist de Funcionalidades

- [x] 3 abas (Enviar, Histórico, Destinatários)
- [x] Enviar para Todos
- [x] Enviar para Alunos
- [x] Enviar para Professores
- [x] Enviar para Turma Específica
- [x] Validação de formulário
- [x] Histórico com 3 exemplos
- [x] Lista de alunos (6)
- [x] Lista de professores (4)
- [x] Notificações toast
- [x] Deletar comunicado
- [x] Responsividade mobile
- [x] Socket.io conectado
- [ ] Backend API (próxima fase)
- [ ] Persistência no banco (próxima fase)
- [ ] Notificação real-time para recipients (próxima fase)

---

## 🔗 Links Úteis

**Documentação Completa:**
- `/COMUNICACAO_COORDENADOR_IMPLEMENTADA.md`

**Status do Projeto:**
- `/STATUS_FINAL_v6.1.md`

**Código Fonte:**
- `/src/components/CommunicationHub.jsx`
- `/src/components/CoordinatorAdvanced.jsx`

---

## 💡 Dicas

1. **Testar com Diferentes Destinatários:** Envie a mesma mensagem para Todos, depois para Alunos, depois para Professores. Observe a contagem no histórico.

2. **Verificar Responsividade:** Redimensione a janela do navegador para móvel (F12 → Device Toolbar) e veja como a interface se adapta.

3. **Usar o Console do Navegador:** Abra F12 → Console para ver os eventos Socket.io sendo emitidos.

4. **Testar Validações:** Tente enviar uma mensagem vazia ou selecionar "Por Turma" sem selecionar qual turma. Veja as validações em ação.

---

**Criado por:** GitHub Copilot  
**Última atualização:** 2024-12-20  
**Versão:** 1.0
