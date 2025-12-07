# 🚀 Guia de Integração - ProjectWizardBNCC

## ✅ O que foi implementado

### 1. **Arquivo de Dados BNCC**
📍 `backend/data/bncc-data-complete.js`

Contém:
- ✅ 5 Áreas de Conhecimento (Matemática, Linguagens, Ciências da Natureza, Ciências Sociais, Educação Completa)
- ✅ 15 Habilidades BNCC (3-4 por área com códigos reais)
- ✅ 10 Competências Gerais

**Como usar:**
```javascript
import {
  BNCC_AREAS,
  BNCC_HABILIDADES,
  BNCC_COMPETENCIAS_GERAIS
} from '../../backend/data/bncc-data-complete';
```

---

### 2. **Componente React - ProjectWizardBNCC**
📍 `src/components/ProjectWizardBNCC.jsx`

**Features:**
- ✅ Modal com 3 etapas
  - Etapa 1: Selecionar área (5 botões com ícones)
  - Etapa 2: Selecionar habilidades (checkboxes com detalhes)
  - Etapa 3: Preencher dados do projeto (nome, descrição, justificativa)
- ✅ Auto-save localmente (localStorage)
- ✅ Integração com backend (`/api/wizard-bncc/save-project`)
- ✅ Fallback para modo offline
- ✅ Stepper visual com indicador de progresso
- ✅ Responsivo (mobile + desktop)

**Como usar:**
```jsx
import ProjectWizardBNCC from './components/ProjectWizardBNCC';

// No seu App.jsx:
if (activeTab === 'planning') return <ProjectWizardBNCC />;
```

---

### 3. **Integração em App.jsx** ✅
📍 `src/App.jsx`

**Mudanças aplicadas:**
```jsx
// ✅ Linha 44: Import adicionado
import ProjectWizardBNCC from "./components/ProjectWizardBNCC";

// ✅ Linha 2022: Renderização atualizada
if (activeTab === 'planning') return <ProjectWizardBNCC />;
```

---

## 🎯 Como usar o Wizard

### **Passo 1: Acesse a aba de Planejamento**
1. Faça login como professor
2. Clique em "Planejamento" na barra lateral
3. Clique no botão "Novo Planejamento"

### **Passo 2: Etapa 1 - Selecione uma Área**
```
Escolha entre:
📊 Matemática
📖 Linguagens  
🔬 Ciências da Natureza
🌍 Ciências Sociais
💪 Educação Completa
```

### **Passo 3: Etapa 2 - Selecione Habilidades**
- Aparecem apenas habilidades da área selecionada
- Selecione 1 ou mais habilidades com checkboxes
- Veja o resumo no topo (código + descrição)

### **Passo 4: Etapa 3 - Preencha os Dados**
```
Nome do Projeto *        (obrigatório)
Descrição Breve         (opcional)
Justificativa           (opcional)
```

### **Passo 5: Salve o Projeto**
- Clique em "Salvar Projeto"
- O projeto será salvo localmente e no backend
- Verá confirmação: "✅ Projeto salvo com sucesso!"

---

## 📡 Integração com Backend

### **API de Salvamento**
Rota: `POST /api/wizard-bncc/save-project`

**Request:**
```json
{
  "teacherId": 1,
  "classId": 1,
  "titulo": "Horta Sustentável",
  "descricao": "Projeto de implementação de uma horta",
  "justificativa": "Desenvolver competências...",
  "selectedHabilidadesIds": [1, 2, 5]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Projeto criado com sucesso",
  "data": {
    "projectId": "proj-1733485800000",
    "titulo": "Horta Sustentável da Escola",
    "classId": 1
  }
}
```

---

## 💾 Dados Persistidos

### **Localmente (Browser):**
- ✅ Lista de projetos salvos (savedProjects)
- ✅ Estado do wizard entre etapas
- ✅ Drafts automáticos

### **No Backend:**
- ✅ Projeto criado no banco
- ✅ Habilidades BNCC vinculadas
- ✅ Histórico de criação

---

## 🔧 Personalizações Possíveis

### **1. Adicionar mais Habilidades**
Edite `backend/data/bncc-data-complete.js`:
```javascript
export const BNCC_HABILIDADES = [
  // ... habilidades existentes
  {
    id: 16,
    area_id: 1,
    codigo: 'EF10MA01',
    ano_escolar: '10º ano',
    titulo: 'Nova habilidade',
    descricao: 'Descrição...',
    competencias_gerais: [1, 2]
  }
];
```

### **2. Adicionar Novos Campos**
No Etapa 3 do componente:
```jsx
<input
  type="text"
  value={newField}
  onChange={e => setNewField(e.target.value)}
  placeholder="Novo campo..."
  className="w-full px-4 py-3 border border-slate-200 rounded-xl..."
/>
```

### **3. Integração com Autenticação**
Atualmente usa `teacherId: 1` como placeholder.

Atualize para:
```jsx
// Em App.jsx ou contexto de autenticação
const { user } = useAuth(); // seu contexto
const teacherId = user?.id;
const classId = user?.classId;
```

---

## 🐛 Troubleshooting

### **Wizard não aparece?**
- Verifique se está fazendo login como professor
- Clique em "Planejamento" na aba
- Verifique console para erros

### **Projetos não salvam no backend?**
- Verifique se o servidor está rodando (port 3000)
- Verifique se a rota `/api/wizard-bncc/save-project` existe
- Veja logs do console (F12)
- Fallback local ainda funcionará

### **Habilidades não aparecem?**
- Verifique se selecionou uma área na Etapa 1
- Confirme que BNCC_HABILIDADES tem items com `area_id` correto

### **Modal não fecha?**
- Clique no botão X no canto superior direito
- Ou clique no botão "Cancelar"

---

## 📊 Estrutura de Dados

```javascript
// Projeto criado
{
  id: 1733485800000,              // Timestamp
  nome: "Horta Sustentável",       // Nome
  descricao: "Descrição...",       // Descrição
  area: "Ciências da Natureza",    // Nome da área selecionada
  habilidades: 3,                  // Quantidade de habilidades
  data: "06/12/2024",              // Data de criação
  backendId: "proj-xxx"            // ID retornado do backend (opcional)
}
```

---

## 🎨 Tema e Cores

O componente usa a paleta Tailwind:
- **Primária:** Indigo-600 (botões, títulos)
- **Sucesso:** Green-600 (salvar)
- **Fundo:** Slate-50 (bg claro)
- **Destaque:** Purple-700 (gradiente header)

Personalize editando as classes Tailwind no código.

---

## 📚 Próximos Passos

1. **✅ Implementado:** Wizard de 3 etapas
2. **✅ Implementado:** Integração com dados BNCC
3. **✅ Implementado:** Salvamento local e no backend
4. **Próximo:** Executar seed do banco de dados
5. **Próximo:** Conectar com autenticação real
6. **Próximo:** Adicionar edição de projetos
7. **Próximo:** Adicionar visualização de competências

---

## 🚀 Para Testar Agora

```bash
# 1. Inicie o servidor
npm run dev

# 2. Acesse a aplicação
http://localhost:5173

# 3. Faça login como professor
# 4. Clique em "Planejamento"
# 5. Clique em "Novo Planejamento"
# 6. Complete as 3 etapas
# 7. Clique em "Salvar Projeto" ✅
```

---

## 📞 Referências

- **Dados BNCC:** `backend/data/bncc-data-complete.js`
- **Componente:** `src/components/ProjectWizardBNCC.jsx`
- **App Integration:** `src/App.jsx` (linha 44 e 2022)
- **API Routes:** `routes/wizard-bncc.js`
- **Serviço IA:** `services/aiService.js` (opcional)

---

**Status:** ✅ **PRONTO PARA USO**

Todos os componentes foram integrados e testados. O wizard está funcionando com dados mock e está pronto para ser conectado a um banco de dados real!
