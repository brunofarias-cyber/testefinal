# 📊 Relatórios BNCC - Acompanhamento de Competências

## Visão Geral

A seção **"Relatórios BNCC"** é um **dashboard interativo** que permite ao professor:
- 📈 Acompanhar o progresso das competências desenvolvidas
- ✏️ Editar e atualizar dados em tempo real
- 📄 Exportar relatórios em PDF
- 📊 Visualizar métricas consolidadas

---

## 🎯 Componentes Principais

### 1️⃣ **Cobertura Total (85%)**

**Funcionalidade**:
- Exibe a **cobertura geral de competências BNCC** trabalhadas na turma
- Mostra que **85% das competências esperadas** foram desenvolvidas
- **Editável**: Ao clicar em "Editar Relatório", pode-se alterar o percentual

**Quando usar**:
- Avaliar se todas as competências obrigatórias foram contempladas
- Identificar gaps curriculares (se estiver abaixo de 100%)
- Justificar para gestão o nível de cobertura

**Exemplo de interpretação**:
- 85% = Ótimo (cobertura quase completa)
- 50% = Alerta (faltam muitas competências)
- 100% = Ideal (todas as competências trabalhadas)

---

### 2️⃣ **Turma Destaque (1º Ano A)**

**Funcionalidade**:
- Identifica **qual turma teve melhor desempenho** na abrangência BNCC
- Mostra **92% de aderência** (frequência/participação)
- **Editável**: Pode-se trocar o nome da turma destaque

**Quando usar**:
- Comparar desempenho entre turmas
- Identificar turmas modelo (best practices)
- Comunicar bom desempenho para a comunidade
- Implementar estratégias da turma destaque em outras

**Exemplo de cenário**:
- 1º Ano A teve 92% de aderência nas atividades BNCC
- 1º Ano B teve apenas 65%
- Traz 1º Ano A como referência

---

### 3️⃣ **Área de Foco (Ciências da Natureza)**

**Funcionalidade**:
- Define **qual área curricular/disciplina é o foco principal**
- Associado a **3 Projetos ativos** nessa área
- **Editável**: Pode-se trocar a área e ajustar projetos ativos

**Quando usar**:
- Definir prioridades de trabalho
- Concentrar esforços em áreas deficitárias
- Demonstrar especialização (ex: "Saúde e Bem-estar")
- Alinhar com projetos em andamento

**Exemplo de mudança**:
- Mês 1: Foco = "Ciências da Natureza" (3 projetos)
- Mês 2: Foco = "História e Cultura" (2 projetos)
- Realoca recursos baseado em calendário

---

## 🔄 Matriz de Competências (Gerais)

### O que é?

Uma tabela que mostra o **progresso de cada competência geral BNCC**:

| Competência | Progresso |
|-------------|-----------|
| Pensamento Científico, Crítico e Criativo | 90% |
| Repertório Cultural | 65% |
| Comunicação | 80% |
| Cultura Digital | 100% |
| Trabalho e Projeto de Vida | 45% |

### Interpretação

- **90% - Pensamento Científico**: Muito bem desenvolvida
- **45% - Trabalho e Projeto**: Necessita mais trabalho
- **100% - Cultura Digital**: Plenamente alcançada
- **65% - Repertório**: Em desenvolvimento

### Como Usar

#### 🔍 **Modo Visualização (Padrão)**
- Vê os valores de progresso
- Clica em "Editar Relatório" para modificar

#### ✏️ **Modo Edição**
- Clica em "Editar Relatório"
- **Interface muda para azul claro**
- Pode alterar:
  - Cobertura Total (campo com %)
  - Turma Destaque (campo de texto)
  - Área de Foco (campo de texto)
  - Cada competência (campo com % para cada)
- Clica "Salvar Alterações" para confirmar
- Ou "Cancelar" para descartar mudanças

---

## 🎨 Estados Visuais

### Modo Visualização
```
┌─ COBERTURA TOTAL ─────────────┐
│                               │
│        85%                    │  → Branco (leitura)
│                               │
│ das competências gerais       │
└───────────────────────────────┘
```

### Modo Edição
```
┌─ COBERTURA TOTAL ─────────────┐
│                               │
│  [ 85 ]  %                    │  → Azul (editável)
│                               │
│ das competências gerais       │
└───────────────────────────────┘
```

---

## 💾 Ações Disponíveis

### 📋 Editar Relatório
- **Estado Padrão**: Botão azul "✏️ Editar Relatório"
- **Modo Edição**: Muda para "✓ Salvar Alterações" + "✕ Cancelar"
- Permite ajustar qualquer valor exibido

### 📥 Exportar PDF
- **Disponível** apenas em modo visualização
- Gera PDF com:
  - Cobertura Total
  - Turma Destaque
  - Área de Foco
  - Matriz de Competências
  - Data de geração
- Útil para: Relatórios formais, envio para pais, arquivos

### ✅ Salvar com Sucesso
- **Mensagem verde** aparece após salvar
- Desaparece automaticamente em 3 segundos
- Confirma que dados foram gravados

---

## 🚀 Fluxo de Uso Prático

### Cenário 1: Atualizar Progresso Mensal
```
1. Abra Relatórios BNCC
2. Analise valores atuais
3. Clique "Editar Relatório"
4. Atualize "Cobertura Total": 85% → 88%
5. Atualize competências (ex: "Comunicação": 80% → 85%)
6. Clique "Salvar Alterações"
7. ✓ Relatório salvo!
```

### Cenário 2: Destacar Turma Modelo
```
1. Abra Relatórios BNCC
2. Clique "Editar Relatório"
3. Mude "Turma Destaque": "1º Ano A" → "2º Ano B"
4. (2º Ano B teve melhor desempenho)
5. Clique "Salvar Alterações"
6. Próxima vez que abrir, mostra 2º Ano B
```

### Cenário 3: Gerar Relatório Formal
```
1. Abra Relatórios BNCC
2. Verifique todos os dados estão corretos
3. Clique "Exportar PDF"
4. Arquivo baixado: "relatorio-bncc-[data].pdf"
5. Compartilhe com:
   - Gestão escolar
   - Pais/responsáveis
   - Coordenador pedagógico
```

---

## 📈 Dados Iniciais (Padrão)

| Campo | Valor Padrão |
|-------|--------------|
| Cobertura Total | 85% |
| Turma Destaque | 1º Ano A |
| Aderência Turma | 92% |
| Área de Foco | Ciências da Natureza |
| Projetos Ativos | 3 |
| Competência 1 (Pensamento Científico) | 90% |
| Competência 2 (Repertório Cultural) | 65% |
| Competência 3 (Comunicação) | 80% |
| Competência 4 (Cultura Digital) | 100% |
| Competência 5 (Trabalho e Projeto) | 45% |

---

## 🎓 Exemplos de Interpretação

### Relatório Excelente
```
Cobertura: 95%+ → Todas competências contempladas
Turma Destaque: 92%+ aderência → Turma engajada
Área Foco: "Saúde e Bem-estar" → Tema estratégico
Competências: Maioria 80%+ → Desenvolvimento robusto
```

### Relatório com Alertas
```
Cobertura: 60% → Faltam muitas competências (⚠️ ALERTA)
Turma Destaque: 45% aderência → Baixa participação (⚠️ ALERTA)
Área Foco: "Raciocínio Lógico" → Projeto especializado
Competências: Muito variadas (45%-100%) → Inconsistência
→ Ação necessária: Revisar planejamento
```

---

## 🔗 Integração com Outras Seções

- **Planejamento BNCC**: Alimenta os dados do relatório
- **Central de Inteligência**: Pode direcionar para editar relatório
- **Avaliação**: Contribui com dados de competências
- **Mensagens**: Compartilhar resultado com turmas

---

## 💡 Dicas de Uso

✅ **Faça**:
- Atualize mensalmente com dados reais
- Use para comunicar progresso aos pais
- Identifique competências prioritárias
- Exporte para documentação oficial

❌ **Evite**:
- Deixar com valores "fictícios"
- Não atualizar há mais de 1 mês
- Usar apenas para visualização (explore edição)
- Compartilhar sem validar dados

---

## 📱 Compatibilidade

- ✅ Desktop (melhor experiência)
- ✅ Tablet (funcional)
- ⚠️ Mobile (diminui, mas funciona)

---

## 🎯 Próximas Melhorias Sugeridas

1. **Gráficos**: Visualizar progresso ao longo do tempo
2. **Comparação**: Comparar 2 períodos diferentes
3. **Exportação**: Adicionar Excel, Google Sheets
4. **Histórico**: Ver versões anteriores do relatório
5. **Integração IA**: Sugestões para melhorar áreas fracas
