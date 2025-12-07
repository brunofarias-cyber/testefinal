/**
 * ═══════════════════════════════════════════════════════════════════════
 * EXEMPLO DE USO - ProjectWizardBNCC
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Este arquivo mostra exemplos práticos de como usar o ProjectWizardBNCC
 */

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 1: Importar e Usar o Componente (Já feito em App.jsx!)
// ═══════════════════════════════════════════════════════════════════════

import ProjectWizardBNCC from './components/ProjectWizardBNCC';

function App() {
  const [activeTab, setActiveTab] = useState('planning');

  // ✅ Já está assim em App.jsx
  if (activeTab === 'planning') {
    return <ProjectWizardBNCC />;
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 2: Dados BNCC - Como Usar
// ═══════════════════════════════════════════════════════════════════════

import {
  BNCC_AREAS,
  BNCC_HABILIDADES,
  BNCC_COMPETENCIAS_GERAIS
} from '../backend/data/bncc-data-complete';

// Usar em qualquer componente
const MeuComponente = () => {
  // Listar todas as áreas
  console.log('Áreas BNCC:', BNCC_AREAS);
  // Output: [
  //   { id: 1, codigo: 'MAT', nome: 'Matemática', ... },
  //   { id: 2, codigo: 'LIN', nome: 'Linguagens', ... },
  //   ...
  // ]

  // Filtrar habilidades por área
  const habilidadesMatematica = BNCC_HABILIDADES.filter(h => h.area_id === 1);
  console.log('Habilidades de Matemática:', habilidadesMatematica);

  // Listar competências gerais
  console.log('Competências Gerais:', BNCC_COMPETENCIAS_GERAIS);
};

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 3: Fluxo Completo do Usuário
// ═══════════════════════════════════════════════════════════════════════

/*
PASSO 1: Professor acessa "Planejamento"
→ Vê lista de projetos criados
→ Clica em "Novo Planejamento"

PASSO 2: ETAPA 1 - Selecionar Área
→ Modal abre com 5 cards
→ Professor clica em "Ciências da Natureza" (🔬)

PASSO 3: Clica "Próximo"
→ Validação passa (área selecionada)
→ Vai para ETAPA 2

PASSO 4: ETAPA 2 - Selecionar Habilidades
→ Aparecem habilidades de Ciências da Natureza:
  • EF07CI01: "Discutir importância de visão integrada"
  • EF07CI04: "Investigar mudanças de estado físico"
  • EF08CI01: "Propor ações para problemas ambientais"
→ Professor seleciona as 3 habilidades

PASSO 5: Clica "Próximo"
→ Validação passa (habilidades selecionadas)
→ Vai para ETAPA 3

PASSO 6: ETAPA 3 - Preencher Dados
→ Nome do Projeto: "Horta Sustentável"
→ Descrição: "Implementação de uma horta escolar com foco em sustentabilidade"
→ Justificativa: "Projeto alinhado com competências..."

PASSO 7: Clica "Salvar Projeto"
→ Validação passa (nome preenchido)
→ Loading state (spinner)
→ Backend recebe: POST /api/wizard-bncc/save-project
→ Projeto é salvo no banco

PASSO 8: Sucesso!
→ Modal fecha
→ Lista de projetos atualiza
→ Novo projeto aparece com:
  - Nome: "Horta Sustentável"
  - Área: "Ciências da Natureza"
  - Habilidades: 3
  - Data: "06/12/2024"
*/

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 4: Backend Integration - Salvando Projeto
// ═══════════════════════════════════════════════════════════════════════

// No componente ProjectWizardBNCC, quando o usuário clica "Salvar":
const handleSalvarProjeto = async () => {
  const payload = {
    teacherId: 1,                    // Seu ID de professor
    classId: 1,                      // ID da turma
    titulo: 'Horta Sustentável',     // Nome do projeto
    descricao: 'Implementação...',   // Descrição
    justificativa: 'Desenvolver...', // Justificativa
    selectedHabilidadesIds: [7, 8, 9] // IDs das habilidades selecionadas
  };

  try {
    const response = await fetch('/api/wizard-bncc/save-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Projeto salvo:', data);
    // Output: {
    //   success: true,
    //   message: "Projeto criado com sucesso",
    //   data: {
    //     projectId: "proj-1733485800000",
    //     titulo: "Horta Sustentável",
    //     classId: 1
    //   }
    // }
  } catch (error) {
    console.error('Erro ao salvar:', error);
    // Fallback: salvar apenas localmente
  }
};

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 5: Customizações Possíveis
// ═══════════════════════════════════════════════════════════════════════

// ✅ Adicionar mais habilidades
// Edite: backend/data/bncc-data-complete.js
// Adicione um novo objeto com id, area_id, codigo, etc

// ✅ Mudar cores do tema
// Em ProjectWizardBNCC.jsx, substitua:
// "bg-indigo-600" → "bg-blue-600"
// "bg-purple-700" → "bg-indigo-700"
// "bg-green-600" → "bg-emerald-600"

// ✅ Adicionar novo campo no Etapa 3
const novosCampos = {
  'Objetivos do Projeto': 'textarea',
  'Data de Início': 'date',
  'Data de Término': 'date',
  'Público-alvo': 'select',
  'Recursos Necessários': 'textarea'
};

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 6: Recuperar Dados Salvos
// ═══════════════════════════════════════════════════════════════════════

// Projetos salvos localmente (em estado React)
const projetosLocais = [
  {
    id: 1733485800000,
    nome: 'Horta Sustentável',
    descricao: 'Implementação de uma horta...',
    area: 'Ciências da Natureza',
    habilidades: 3,
    data: '06/12/2024',
    backendId: 'proj-123'
  }
];

// Usar via API (depois implementar)
const buscarProjetos = async () => {
  const response = await fetch('/api/projects');
  const projetos = await response.json();
  return projetos;
};

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 7: Integração com Autenticação
// ═══════════════════════════════════════════════════════════════════════

// Atualmente usa valores hardcoded:
const teacherId = 1;    // TODO: Obter do contexto de autenticação
const classId = 1;      // TODO: Obter do contexto de autenticação

// Mudança necessária em ProjectWizardBNCC.jsx:
import { useAuth } from '../contexts/AuthContext'; // seu contexto

function ProjectWizardBNCC() {
  const { user } = useAuth();
  const teacherId = user?.id;      // ID do professor autenticado
  const classId = user?.activeClass?.id; // Turma selecionada

  // ... resto do componente
}

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 8: Testar no Console
// ═══════════════════════════════════════════════════════════════════════

// Abra o console (F12) e teste:

// Verificar dados
> import { BNCC_AREAS } from '../backend/data/bncc-data-complete.js'
> BNCC_AREAS
// Retorna array de 5 áreas

// Contar habilidades por área
> import { BNCC_HABILIDADES } from '../backend/data/bncc-data-complete.js'
> BNCC_HABILIDADES.filter(h => h.area_id === 1).length
// Output: 3

// Testar API
> fetch('/api/wizard-bncc/areas').then(r => r.json()).then(console.log)
// Retorna dados das áreas

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 9: Estrutura de um Projeto Completo
// ═══════════════════════════════════════════════════════════════════════

{
  // Identifiers
  id: 'proj-1733485800000',
  projectId: 'proj-1733485800000',
  
  // Metadata
  teacherId: 1,
  classId: 1,
  createdAt: '2024-12-06T22:03:00Z',
  updatedAt: '2024-12-06T22:03:00Z',
  
  // Project Info
  titulo: 'Horta Sustentável',
  descricao: 'Implementação de uma horta escolar com foco em sustentabilidade',
  justificativa: 'Projeto alinhado com competências BNCC e desenvolvimento sustentável',
  
  // BNCC Alignment
  areaId: 3,                    // Ciências da Natureza
  selectedHabilidadesIds: [7, 8, 9],  // IDs das habilidades
  
  // Habilidades detalhes (populado do banco)
  habilidades: [
    {
      id: 7,
      codigo: 'EF07CI01',
      titulo: 'Discutir importância de visão integrada',
      descricao: '...',
      anoEscolar: '7º ano'
    },
    {
      id: 8,
      codigo: 'EF07CI04',
      titulo: 'Investigar mudanças de estado físico',
      descricao: '...',
      anoEscolar: '7º ano'
    },
    {
      id: 9,
      codigo: 'EF08CI01',
      titulo: 'Propor ações para problemas ambientais',
      descricao: '...',
      anoEscolar: '8º ano'
    }
  ],
  
  // Status
  status: 'active',
  publicado: true
}

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 10: API Endpoints Úteis
// ═══════════════════════════════════════════════════════════════════════

// Listar áreas
GET /api/wizard-bncc/areas
// → Retorna todas as 5 áreas

// Listar habilidades de uma área
GET /api/wizard-bncc/habilidades?areaId=1
// → Retorna habilidades da Matemática

// Listar competências
GET /api/wizard-bncc/competencias
// → Retorna 10 competências gerais

// Salvar projeto
POST /api/wizard-bncc/save-project
// Body: { teacherId, classId, titulo, descricao, selectedHabilidadesIds }
// → Retorna projectId

// Salvar rascunho
POST /api/wizard-bncc/draft
// Body: { teacherId, classId, ... dados do rascunho ... }
// → Retorna draftId

// Gerar com IA
POST /api/wizard-bncc/generate-ai
// Body: { temaProjeto, selectedHabilidadesIds, areaId }
// → Retorna sugestões geradas

// ═══════════════════════════════════════════════════════════════════════
// EXEMPLO 11: Checklist de Implementação
// ═══════════════════════════════════════════════════════════════════════

/*
[✅] Dados BNCC criados
  [✅] 5 Áreas
  [✅] 15 Habilidades
  [✅] 10 Competências Gerais

[✅] Componente React implementado
  [✅] Etapa 1: Selecionar Área
  [✅] Etapa 2: Selecionar Habilidades
  [✅] Etapa 3: Preencher Dados
  [✅] Modal com 3 etapas
  [✅] Navegação (Próximo/Anterior)
  [✅] Validação
  [✅] Auto-save local

[✅] Integração com App.jsx
  [✅] Import adicionado
  [✅] Renderização atualizada

[✅] Documentação
  [✅] Guia de integração
  [✅] Resumo de implementação
  [✅] Exemplos de uso

[⏳] Próximas fases
  [ ] Executar seed do banco
  [ ] Conectar com autenticação real
  [ ] Testar end-to-end
  [ ] Deploy em produção
*/

// ═══════════════════════════════════════════════════════════════════════
// FIM DOS EXEMPLOS
// ═══════════════════════════════════════════════════════════════════════
