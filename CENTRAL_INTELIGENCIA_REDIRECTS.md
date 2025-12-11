# Implementação: Redirecionamento dos Cards da Central de Inteligência

## 📋 Resumo das Mudanças

A Central de Inteligência agora redireciona para as abas apropriadas quando você clica em um dos 3 cards principais:

### Cards e Seus Redirecionamentos

1. **"CORREÇÕES PENDENTES"** (Entregas Aguardando Avaliação)
   - Clique no card → Navega para **Central do Professor → Relatórios**
   - Aba relacionada: `reports`
   - Exibe: Dashboard de correções e avaliações pendentes

2. **"ALUNOS EM RISCO"** (Desempenho Baixo)
   - Clique no card → Navega para **Mensagens**
   - Aba relacionada: `messages`
   - Exibe: Sistema de mensagens para suporte aos alunos

3. **Outras Abas** (Cobertura BNCC, Faltas, Conflitos)
   - Clicam em abas relacionadas configuradas em `alert.actions[0].relatedTab`
   - Suporta: `planning`, `calendar`, `attendance`, `evaluation`, `bncc`, `teams`

---

## 🔧 Implementação Técnica

### 1. **TeacherIntelligenceCenter.jsx**

#### Mudança 1: Efeito Visual Melhorado
```javascript
// ANTES:
className={`rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ...`}

// DEPOIS:
className={`rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-2xl hover:scale-105 ...`}
```
✅ Adiciona efeito de escala (105%) e sombra mais pronunciada no hover

#### Mudança 2: Lógica de Redirecionamento Inteligente
```javascript
onClick={() => {
    // Redirecionar para a aba relacionada ao clicar no card
    if (alert.actions && alert.actions.length > 0) {
        const primaryAction = alert.actions[0];
        if (onNavigateTo && primaryAction.relatedTab) {
            // Abas internas dentro da Master Control
            const internalTabs = ['planning', 'calendar', 'attendance', 'evaluation', 'bncc', 'reports'];
            
            if (internalTabs.includes(primaryAction.relatedTab)) {
                // Primeiro navega para Master Control
                onNavigateTo('master-control');
                // Depois armazena qual sub-aba ativar
                sessionStorage.setItem('masterControlTab', primaryAction.relatedTab);
            } else {
                // Navega para abas externas diretamente
                onNavigateTo(primaryAction.relatedTab);
            }
        } else {
            setSelectedAlert(alert);
        }
    } else {
        setSelectedAlert(alert);
    }
}}
```

**Como Funciona:**
1. Verifica se o alerta tem ações definidas
2. Pega a ação primária (primeira da lista)
3. Se `relatedTab` for uma aba **interna** (planning, calendar, etc):
   - Navega para 'master-control'
   - Armazena qual sub-aba ativar em `sessionStorage`
4. Se for uma aba **externa**: navega direto
5. Se nenhuma ação: abre modal do alerta (comportamento antigo)

---

### 2. **TeacherMasterControl.jsx**

#### Mudança 1: Adicionar useEffect Import
```javascript
// ANTES:
import React, { useState } from "react";

// DEPOIS:
import React, { useState, useEffect } from "react";
```

#### Mudança 2: Ler sessionStorage e Ativar Sub-aba
```javascript
// Ativar sub-aba quando redirecionado da Central de Inteligência
useEffect(() => {
    const tabToActivate = sessionStorage.getItem('masterControlTab');
    if (tabToActivate) {
        setActiveSection(tabToActivate);
        sessionStorage.removeItem('masterControlTab');
    }
}, []);
```

**Como Funciona:**
1. Ao montar o TeacherMasterControl
2. Lê o valor de `masterControlTab` do sessionStorage
3. Se existir: ativa a sub-aba correspondente via `setActiveSection()`
4. Remove o item do sessionStorage (limpeza)

---

## 🎯 Fluxo de Navegação

### Exemplo: Clique em "CORREÇÕES PENDENTES"

```
Central de Inteligência (TeacherIntelligenceCenter)
    ↓
Clique no card "CORREÇÕES PENDENTES"
    ↓
onClick é chamado
    ↓
relatedTab = 'reports' (aba interna)
    ↓
onNavigateTo('master-control') - navega para Central do Professor
sessionStorage.setItem('masterControlTab', 'reports')
    ↓
TeacherMasterControl monta/renderiza
    ↓
useEffect detecta 'masterControlTab' no sessionStorage
    ↓
setActiveSection('reports')
sessionStorage.removeItem('masterControlTab') - limpeza
    ↓
Exibe: Aba de Relatórios dentro da Central do Professor
```

---

## 📊 Dados dos Alertas (alert.actions)

Cada alerta tem um array de ações com a propriedade `relatedTab`:

```javascript
const alerts = [
    {
        id: "submissions-pending",
        type: "warning",
        title: "Entregas Pendentes de Avaliação",
        count: 12,
        actions: [
            {
                label: "Avaliar Agora",
                color: "blue",
                relatedTab: 'reports',  // 👈 Define o redirecionamento
                action: null
            },
            // ... mais ações
        ]
    },
    // ... mais alertas
]
```

---

## ✨ Benefícios

1. **Navegação Contextual**: Clique direto leva você para a ferramenta certa
2. **Experiência Fluida**: Sem necessidade de clicar múltiplas vezes
3. **Visual Feedback**: Hover effect claramente indica que é clicável
4. **Segurança de Dados**: sessionStorage é limpo automaticamente após uso
5. **Escalabilidade**: Fácil adicionar novos redirecionamentos (apenas ajustar `alert.actions[].relatedTab`)

---

## 🧪 Como Testar

1. Abra a aplicação e vá para **Central de Inteligência**
2. Clique em qualquer um dos cards de alerta
3. Verifique se:
   - ✅ O card tem efeito de zoom/sombra no hover
   - ✅ Ao clicar, redireciona para a aba apropriada
   - ✅ Na aba de destino, o conteúdo é exibido corretamente
4. Teste os 3 principais:
   - "CORREÇÕES PENDENTES" → Relatórios
   - "ALUNOS EM RISCO" → Mensagens
   - Outros alertas → Suas respectivas abas

---

## 🔗 Relacionado

- [BNCC → Copiloto IA Redirect](./COPILOTO_IA_REDIRECTS.md)
- [Sidebar Consolidation](./CHECKLIST_FINAL.md)
- [Master Control Navigation](./INTEGRATION_GUIDE_WIZARD.md)
