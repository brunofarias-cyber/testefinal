# Implementação: Seletor BNCC Avançado com Sugestão de IA

## 📋 Resumo

A construção do planejamento agora possui:
1. **Dropdown com todos os códigos BNCC** (6º ao 2º ano)
2. **Sugestão automática de IA** baseada no título e objetivos da aula
3. **Seletor visual** com checkboxes para fácil escolha
4. **Preview dos códigos selecionados** antes de salvar

---

## 🎯 Funcionalidades

### 1. Seletor de Ano
- Dropdown para escolher entre: 6º, 7º, 8º e 9º ano
- Automática atualiza a lista de competências
- Limpa seleção anterior ao trocar de ano

### 2. Grid de Seleção
- Exibe **todos os códigos BNCC** para o ano selecionado
- Cada código mostra:
  - Código (ex: EF09CI01)
  - Tema relacionado (ex: Estados da Matéria)
- Checkbox para seleção rápida
- Efeito visual: selecionados ficam em azul

### 3. Sugestão com IA
- Botão **"Sugerir com IA"** (ícone ✨ Sparkles)
- Analisa: Título + Objetivos da aula
- Retorna até **5 sugestões** mais relevantes
- Mostra:
  - Código da competência
  - Descrição completa
  - Taxa de relevância
- Botão **"Adicionar Sugeridas"** para aplicar em lote

### 4. Preview de Seleção
- Mostra todos os códigos escolhidos
- Tags removíveis (clique para desselecionar)
- Atualiza em tempo real

---

## 🔧 Implementação Técnica

### Novo Arquivo: `src/constants/bnccCodes.js`

Contém:
- `allBnccCodes`: Dicionário com competências por ano (6º-9º)
- Cada competência tem:
  - `code`: Código BNCC (ex: EF09CI01)
  - `description`: Descrição completa
  - `theme`: Tema (ex: Estados da Matéria)
  - `subdomain`: Subdomínio (Vida e Evolução, Matéria e Energia, etc)

**Funções exportadas**:
```javascript
getYearOptions()          // Retorna ['6º Ano', '7º Ano', '8º Ano', '9º Ano']
getCodesByYear(year)      // Retorna competências de um ano específico
getCodeDescription(code)  // Busca descrição de um código
getAISuggestions(title, description) // Retorna sugestões baseadas em keywords
```

### Modificações: `TeacherMasterControl.jsx`

#### 1. Novos Estados
```javascript
const [selectedBnccYear, setSelectedBnccYear] = useState('9º Ano');
const [selectedBnccCodes, setSelectedBnccCodes] = useState([]);
const [showBnccSelector, setShowBnccSelector] = useState(false);
const [aiSuggestions, setAiSuggestions] = useState([]);
const [loadingAISuggestions, setLoadingAISuggestions] = useState(false);
```

#### 2. Novas Funções
```javascript
const toggleBnccCode = (code)
  // Adiciona/remove código da seleção

const suggestBnccCodes = async ()
  // Chama getAISuggestions e simula latência

const addSuggestedCodes = ()
  // Adiciona sugestões à seleção
```

#### 3. Modificação da função `addLesson`
```javascript
// ANTES:
bnccCodes: newLesson.bnccCodes.split(',').map(c => c.trim())

// DEPOIS:
bnccCodes: selectedBnccCodes.length > 0 
  ? selectedBnccCodes 
  : newLesson.bnccCodes.split(',').map(c => c.trim())
```
Prioriza códigos selecionados, fallback para entrada manual.

#### 4. Nova UI no form
- Seção em **azul claro** para destaque
- Grid 2x2 de checkboxes
- Max-height com scroll automático
- Feedback visual colorido

---

## 📊 Dados de Exemplo

### Estrutura de Competência
```javascript
{
  code: 'EF09CI01',
  description: 'Investigar as mudanças de estado físico da matéria e explicar essas transformações...',
  theme: 'Estados da Matéria',
  subdomain: 'Matéria e Energia'
}
```

### Sugestão de IA
```javascript
{
  code: 'EF09CI01',
  description: '...',
  theme: 'Estados da Matéria',
  year: '9º Ano',
  relevance: 3  // Score 1-3
}
```

---

## 🎨 Visual

```
┌─ Competências BNCC (6º ao 2º ano) ──────── [✨ Sugerir com IA]
│
│  Ano: [Dropdown: 6º, 7º, 8º, 9º] ↓
│
│  ┌─────────────────────────────────────┐
│  │ ☐ EF09CI01    │ ☐ EF09CI05          │
│  │   Evolução    │   Telecomunicações  │
│  │               │                     │
│  │ ☐ EF09CI02    │ ☐ EF09CI06          │
│  │   Reações     │   Radiação          │
│  └─────────────────────────────────────┘
│
│  CÓDIGOS SELECIONADOS (2)
│  [EF09CI01 ✕] [EF09CI13 ✕]
│
│  ✨ SUGESTÕES DE IA (5)
│  [EF09CI01 - Investigar mudanças de estado...]
│  [EF09CI13 - Propor iniciativas...]
└─────────────────────────────────────────────
```

---

## ✨ Benefícios

1. **Facilita Escolha**: Não precisa lembrar códigos
2. **IA Inteligente**: Sugere competências relevantes
3. **Todos os Anos**: Flexibilidade de 6º ao 2º
4. **Visual Claro**: Fácil de usar e entender
5. **Sem Digitação**: Reduz erros de código

---

## 🧪 Como Testar

1. Acesse **Central do Professor** → **Planejamento**
2. Clique **"+ Nova Aula"**
3. Preencha:
   - Título: "Ciclo da Água"
   - Objetivos: "Compreender evaporação e condensação"
4. Na seção BNCC:
   - Selecione ano: **6º Ano**
   - Clique **"✨ Sugerir com IA"**
   - Veja sugestões aparecerem
   - Clique **"Adicionar Sugeridas"**
5. Clique **"Salvar Aula"**
6. Verifique se códigos foram salvos na aula

---

## 📁 Arquivos Modificados

- ✅ `src/components/TeacherMasterControl.jsx` - Adicionado seletor + IA
- ✅ `src/constants/bnccCodes.js` - Novo arquivo com todos os códigos

---

## 🔗 Relacionado

- [BNCC → Copiloto IA](./CENTRAL_INTELIGENCIA_REDIRECTS.md)
- [Planejamento Integrado](./INTEGRATION_GUIDE_WIZARD.md)
