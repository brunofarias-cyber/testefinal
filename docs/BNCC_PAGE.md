# 📚 Página BNCC - Guia de Integração

**Status:** ✅ **PRONTO PARA USO**  
**Data:** 6 de Dezembro de 2025

---

## 🎯 O Que Foi Implementado

### ✅ Componente BNCCPage
**Arquivo:** `src/components/BNCCPage.jsx` (520+ linhas)

**Features:**
- 📚 5 Áreas de Conhecimento (cards interativos)
- ✨ 10 Competências Gerais (badges coloridos)
- 📖 15 Habilidades BNCC (com códigos oficiais)
- 🔍 Sistema de busca completo
- 📅 Filtro por ano/série
- 🎨 Filtro por área de conhecimento
- 💫 Vista detalhada por área
- 🎨 Design moderno e responsivo

---

## 🚀 Como Integrar no App.jsx

### Passo 1: Importar o Componente

Adicione no **início** do `App.jsx` (junto com outros imports):

```javascript
import BNCCPage from './components/BNCCPage';
```

### Passo 2: Adicionar Rota

Localize a seção de rotas do **professor** e adicione:

```javascript
if (role === 'teacher') {
  if (activeTab === 'dashboard') return <TeacherDashboard />;
  if (activeTab === 'classes') return <TeacherClasses />;
  if (activeTab === 'planning') return <ProjectWizardBNCC />;
  if (activeTab === 'bncc') return <BNCCPage />;  // ← ADICIONAR ESTA LINHA
  if (activeTab === 'attendance') return <Attendance />;
  // ... outras rotas
}
```

### Passo 3: Adicionar Item no Menu Lateral

Localize o **Sidebar** (menu lateral) e adicione o item BNCC:

```javascript
<NavItem 
  icon={<Book size={20} />} 
  label="BNCC" 
  active={activeTab === 'bncc'} 
  onClick={() => setActiveTab('bncc')} 
/>
```

**Posição sugerida:** Após "Planejamento" ou "Atividades"

---

## 📋 Ordem Sugerida do Menu

Exemplo de estrutura do Sidebar:

```
1. 📊 Visão Geral (dashboard)
2. 👥 Turmas (classes)
3. 📅 Calendário (calendar)
4. 📝 Planejamento (planning)
5. ✅ Chamada (attendance)
6. 📈 Performance (performance)
7. 💬 Mensagens (messages)
8. 📚 BNCC (bncc) ← NOVO
9. 🎯 Atividades (activities)
10. 👥 Criar Times (teams)
11. 📊 Relatórios (reports)
12. 📋 Rubricas (rubrics)
```

---

## 🎨 Funcionalidades Detalhadas

### 1. **Vista Principal**

**Seções:**
- Header com título e descrição
- 10 Competências Gerais (grid 5 colunas)
- 5 Áreas de Conhecimento (cards clicáveis)
- Sistema de busca com 3 filtros

**Interações:**
- Clicar em área → Ver habilidades específicas
- Buscar por código (ex: EF07MA01)
- Filtrar por ano/série
- Filtrar por área

---

### 2. **10 Competências Gerais**

Cards coloridos com:
- Ícone único
- Número (1-10)
- Título descritivo
- Hover effect

**Competências:**
1. 📚 Conhecimento
2. 🧪 Pensamento Científico
3. 🎨 Repertório Cultural
4. 💬 Comunicação
5. 💻 Cultura Digital
6. 🎯 Trabalho e Projeto de Vida
7. 🗣️ Argumentação
8. 🪞 Autoconhecimento
9. 🤝 Empatia e Cooperação
10. ✨ Responsabilidade

---

### 3. **5 Áreas de Conhecimento**

Cards interativos com:
- Ícone grande
- Nome da área
- Descrição breve
- Link "Ver habilidades"
- Gradient de cor único

**Áreas:**
1. 📊 Matemática (azul → ciano)
2. 📖 Linguagens (roxo → rosa)
3. 🔬 Ciências da Natureza (verde → esmeralda)
4. 🌍 Ciências Sociais (laranja → vermelho)
5. 💪 Educação Completa (rosa → vermelho)

---

### 4. **15 Habilidades BNCC**

Cada habilidade tem:
- **Código oficial** (ex: EF07MA01)
- **Ano/Série** (ex: 7º ano)
- **Título** (objetivo curto)
- **Descrição** (objetivo completo)
- **Área** (vinculada)

**Exemplos:**
- `EF07MA01` - Resolver problemas com números naturais
- `EF67LP01` - Reconhecer a função da linguagem
- `EF07CI01` - Discutir visão integrada da natureza

---

### 5. **Sistema de Busca**

**3 Filtros:**

**a) Busca Textual**
- Por código (EF07MA01)
- Por título (Resolver problemas)
- Por descrição

**b) Ano/Série**
- Todos os anos
- 3º-5º ano
- 6º-7º ano
- 6º-9º ano
- 7º ano
- 8º ano
- 8º-9º ano
- 9º ano

**c) Área de Conhecimento**
- Todas as áreas
- Matemática
- Linguagens
- Ciências da Natureza
- Ciências Sociais
- Educação Completa

**Botão:** Limpar filtros (aparece quando há filtros ativos)

**Contador:** "📊 X habilidade(s) encontrada(s)"

---

### 6. **Vista Detalhada de Área**

Ao clicar em uma área:

**Header:**
- Gradient com cor da área
- Ícone grande (background)
- Nome + descrição
- Badges (código + quantidade)

**Lista:**
- Todas as habilidades da área
- Cards expandidos
- Código em destaque
- Ano/série
- Título + descrição

**Navegação:**
- Botão "← Voltar para BNCC"

---

## 🧪 Testes

### Teste 1: Navegação
```
1. Clique em "BNCC" no menu
✅ Página carrega com todas as seções
✅ 10 competências visíveis
✅ 5 áreas visíveis
✅ Sistema de busca presente
```

### Teste 2: Filtros
```
1. Digite "EF07MA01" na busca
✅ Retorna 1 habilidade (Matemática)

2. Selecione "7º ano"
✅ Retorna 3 habilidades do 7º ano

3. Selecione "Linguagens"
✅ Retorna apenas habilidades de Linguagens
```

### Teste 3: Vista de Área
```
1. Clique em "Matemática"
✅ Abre vista detalhada
✅ Mostra header com gradient azul
✅ Lista 3 habilidades de Matemática

2. Clique "Voltar"
✅ Retorna à vista principal
```

### Teste 4: Busca Textual
```
1. Digite "problemas"
✅ Retorna habilidades com "problemas" no título

2. Digite "linguagem"
✅ Retorna habilidades de Linguagens

3. Limpe a busca
✅ Mostra todas as habilidades
```

---

## 📱 Responsividade

### Desktop (> 1024px)
- 5 colunas para competências
- 5 colunas para áreas
- 3 colunas para filtros
- Layout espaçado

### Tablet (768px - 1024px)
- 5 colunas para competências
- 2 colunas para áreas
- 3 colunas para filtros
- Cards redimensionados

### Mobile (< 768px)
- 2 colunas para competências
- 1 coluna para áreas
- 1 coluna para filtros
- Layout empilhado

---

## 🎨 Customização de Cores

### Áreas de Conhecimento

```javascript
// Matemática (azul → ciano)
cor: 'from-blue-500 to-cyan-500'

// Linguagens (roxo → rosa)
cor: 'from-purple-500 to-pink-500'

// Ciências (verde → esmeralda)
cor: 'from-green-500 to-emerald-500'

// Sociais (laranja → vermelho)
cor: 'from-orange-500 to-red-500'

// Educação (rosa → vermelho)
cor: 'from-rose-500 to-red-600'
```

### Competências Gerais

```javascript
// Cada competência tem cor única:
{ numero: 1, cor: 'bg-blue-100 text-blue-700' }
{ numero: 2, cor: 'bg-purple-100 text-purple-700' }
{ numero: 3, cor: 'bg-pink-100 text-pink-700' }
// ... etc
```

---

## 🔧 Adicionar Mais Habilidades

Para adicionar habilidades:

```javascript
const todasHabilidades = [
  // ... habilidades existentes
  
  // Nova habilidade
  {
    id: 16, // ID único
    area_id: 1, // 1=Mat, 2=Lin, 3=CN, 4=CS, 5=EC
    codigo: 'EF06MA01', // Código oficial BNCC
    ano_escolar: '6º ano', // Ano/série
    titulo: 'Título curto da habilidade',
    descricao: 'Descrição completa do objetivo de aprendizagem'
  }
];
```

---

## 🗄️ Integração com Backend

Para buscar do backend (futuro):

```javascript
useEffect(() => {
  // Buscar áreas
  fetch('http://localhost:3000/api/bncc/areas')
    .then(res => res.json())
    .then(data => setAreas(data.areas));
    
  // Buscar habilidades
  fetch('http://localhost:3000/api/bncc/habilidades')
    .then(res => res.json())
    .then(data => setTodasHabilidades(data.habilidades));
    
  // Buscar competências
  fetch('http://localhost:3000/api/bncc/competencias')
    .then(res => res.json())
    .then(data => setCompetenciasGerais(data.competencias));
}, []);
```

---

## 📊 Estrutura de Dados

### Área
```javascript
{
  id: 1,
  codigo: 'MAT',
  nome: 'Matemática',
  descricao: 'Números, álgebra, geometria',
  icone: '📊',
  cor: 'from-blue-500 to-cyan-500'
}
```

### Habilidade
```javascript
{
  id: 1,
  area_id: 1,
  codigo: 'EF07MA01',
  ano_escolar: '7º ano',
  titulo: 'Resolver problemas',
  descricao: 'Resolver e elaborar problemas...'
}
```

### Competência
```javascript
{
  numero: 1,
  titulo: 'Conhecimento',
  icone: '📚',
  cor: 'bg-blue-100 text-blue-700'
}
```

---

## ✅ Checklist de Integração

### Arquivo criado
- [✅] src/components/BNCCPage.jsx (520 linhas)

### App.jsx
- [ ] Import do BNCCPage
- [ ] Rota `if (activeTab === 'bncc')`
- [ ] Item no Sidebar com ícone Book

### Testes
- [ ] Página carrega corretamente
- [ ] 10 competências visíveis
- [ ] 5 áreas clicáveis
- [ ] Busca funciona
- [ ] Filtros funcionam
- [ ] Vista de área funciona
- [ ] Botão voltar funciona
- [ ] Responsive (mobile + tablet)

---

## 🎉 Status

**✅ 100% PRONTO**

A página BNCC está completa com:
- 📚 5 áreas de conhecimento
- ✨ 10 competências gerais
- 📖 15 habilidades BNCC
- 🔍 Sistema de busca completo
- 🎨 Design moderno e responsivo
- 📱 Totalmente responsiva

**Próximo passo:**
Integrar no App.jsx seguindo os passos acima!

---

## 📞 Referências

- **Dados BNCC:** `/backend/data/bncc-data-complete.js`
- **Wizard BNCC:** `/src/components/ProjectWizardBNCC.jsx`
- **Rotas API:** `/routes/bncc.js`

---

**Pronto para usar! 📚✨**
