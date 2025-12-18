import { useState } from 'react';
import { Plus, X, Check, ChevronLeft, ArrowRight, FileText } from 'lucide-react';
import HabilidadesSelectorBNCC from './HabilidadesSelectorBNCC';
import { BNCC_COMPLETO, AREAS_DISPONIVEIS } from '../constants/bnccCompleto';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ProjectWizardBNCC
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Componente interativo de 3 etapas para criar projetos alinhados à BNCC:
 * 1. Etapa 1: Selecionar Área de Conhecimento
 * 2. Etapa 2: Selecionar Habilidades BNCC da área
 * 3. Etapa 3: Preencher dados do projeto e revisar
 * 
 * Features:
 * - Auto-save de rascunhos
 * - Visualização de competências gerais
 * - Fallback para dados mock
 * - Interface responsiva e moderna
 */
const ProjectWizardBNCC = () => {
  // ────────────────────────────────────────────────────────────────
  // ESTADO DO WIZARD
  // ────────────────────────────────────────────────────────────────

  const [etapa, setEtapa] = useState(1);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedHabilidades, setSelectedHabilidades] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectJustificativa, setProjectJustificativa] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // ────────────────────────────────────────────────────────────────
  // DADOS
  // ────────────────────────────────────────────────────────────────

  const areas = [
    { id: 'Ciências', nome: 'Ciências Naturais', icone: '🔬', descricao: 'Estude fenômenos naturais e físicos' },
    { id: 'Ciências Sociais', nome: 'Ciências Sociais', icone: '🌍', descricao: 'Explore história, geografia e sociedade' },
    { id: 'Língua Portuguesa', nome: 'Língua Portuguesa', icone: '📚', descricao: 'Trabalhe linguagem e leitura' },
    { id: 'Matemática', nome: 'Matemática', icone: '🔢', descricao: 'Desenvolva raciocínio matemático' }
  ];

  // ────────────────────────────────────────────────────────────────
  // HANDLERS
  // ────────────────────────────────────────────────────────────────

  const toggleHabilidade = (code) => {
    setSelectedHabilidades(prev =>
      prev.includes(code)
        ? prev.filter(h => h !== code)
        : [...prev, code]
    );
  };

  const handleProximoEtapa = () => {
    if (etapa === 1 && !selectedArea) {
      alert('Selecione uma área!');
      return;
    }
    if (etapa === 2 && selectedHabilidades.length === 0) {
      alert('Selecione pelo menos uma habilidade!');
      return;
    }
    if (etapa === 3 && !projectName) {
      alert('Digite o nome do projeto!');
      return;
    }
    setEtapa(etapa + 1);
  };

  const handleAnteriorEtapa = () => {
    setEtapa(etapa - 1);
  };

  const handleSalvarProjeto = async () => {
    setLoading(true);

    try {
      // Tentar salvar no backend
      const response = await fetch('/api/wizard-bncc/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: 1, // TODO: Get from auth context
          classId: 1, // TODO: Get from props or context
          titulo: projectName,
          descricao: projectDescription,
          justificativa: projectJustificativa,
          selectedHabilidadesIds: selectedHabilidades
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar projeto');
      }

      const data = await response.json();

      // Salvar localmente também
      const novoProjeto = {
        id: Date.now(),
        nome: projectName,
        descricao: projectDescription,
        area: areas.find(a => a.id === selectedArea)?.nome,
        habilidades: selectedHabilidades.length,
        data: new Date().toLocaleDateString('pt-BR'),
        backendId: data.data?.projectId
      };

      setSavedProjects([...savedProjects, novoProjeto]);

      // Reset
      setEtapa(1);
      setSelectedArea(null);
      setSelectedHabilidades([]);
      setProjectName('');
      setProjectDescription('');
      setProjectJustificativa('');
      setShowModal(false);

      alert('✅ Projeto salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);

      // Fallback: salvar apenas localmente
      const novoProjeto = {
        id: Date.now(),
        nome: projectName,
        descricao: projectDescription,
        area: areas.find(a => a.id === selectedArea)?.nome,
        habilidades: selectedHabilidades.length,
        data: new Date().toLocaleDateString('pt-BR')
      };

      setSavedProjects([...savedProjects, novoProjeto]);

      // Reset
      setEtapa(1);
      setSelectedArea(null);
      setSelectedHabilidades([]);
      setProjectName('');
      setProjectDescription('');
      setProjectJustificativa('');
      setShowModal(false);

      alert('✅ Projeto salvo localmente (sem sincronização com servidor)');
    } finally {
      setLoading(false);
    }
  };

  const getProgressClass = (stepNum) => {
    if (etapa === stepNum) return 'bg-indigo-600 text-white';
    if (etapa > stepNum) return 'bg-green-500 text-white';
    return 'bg-slate-200 text-slate-600';
  };

  // ────────────────────────────────────────────────────────────────
  // RENDER: VIEW PRINCIPAL (sem modal)
  // ────────────────────────────────────────────────────────────────

  if (!showModal) {
    return (
      <div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Planejamento de Projetos</h2>
            <p className="text-slate-500">Crie novos projetos alinhados à BNCC</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Novo Planejamento
          </button>
        </div>

        {/* Lista de Projetos Criados */}
        {savedProjects.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                Projetos Criados ({savedProjects.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              {savedProjects.map(proj => (
                <div key={proj.id} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{proj.nome}</h4>
                      <p className="text-sm text-slate-500 mt-1">{proj.area}</p>
                      <p className="text-sm text-slate-600 mt-2">{proj.descricao}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                        {proj.habilidades} habilidade{proj.habilidades !== 1 ? 's' : ''}
                      </span>
                      <p className="text-xs text-slate-400 mt-2">{proj.data}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedProjects.length === 0 && (
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">Nenhum projeto criado ainda</p>
            <p className="text-slate-400 text-sm mt-2">
              Clique em "Novo Planejamento" para começar
            </p>
          </div>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // RENDER: MODAL DO WIZARD
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Criar Novo Projeto</h2>
          <button
            onClick={() => setShowModal(false)}
            className="hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* STEPPER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          {[1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${getProgressClass(
                  step
                )}`}
              >
                {etapa > step ? <Check size={20} /> : step}
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-1 ml-2 rounded-full transition ${
                    etapa > step ? 'bg-green-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
          <div className="text-sm font-bold text-slate-600 ml-4">
            Etapa {etapa} de 3
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="p-8">

          {/* ETAPA 1: Selecionar Área */}
          {etapa === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Selecione a Área de Conhecimento
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Escolha uma das 5 áreas da BNCC para começar seu projeto
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {areas.map(area => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedArea(area.id)}
                      className={`p-6 rounded-xl border-2 transition text-left ${
                        selectedArea === area.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-4xl mb-3">{area.icone}</div>
                      <h4 className="font-bold text-slate-800 text-lg">{area.nome}</h4>
                      <p className="text-sm text-slate-600 mt-2">{area.descricao}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: Selecionar Habilidades */}
          {etapa === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Selecione as Habilidades BNCC
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Área:{' '}
                  <span className="font-bold text-indigo-600">
                    {areas.find(a => a.id === selectedArea)?.nome}
                  </span>
                </p>

                {/* Novo Componente: Seletor Organizado por Anos */}
                <HabilidadesSelectorBNCC
                  areaAtiva={selectedArea}
                  selectedHabilidades={selectedHabilidades}
                  onToggleHabilidade={toggleHabilidade}
                />

                {selectedHabilidades.length > 0 && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-sm font-bold text-indigo-700">
                      ✓ {selectedHabilidades.length} habilidade
                      {selectedHabilidades.length !== 1 ? 's' : ''} selecionada
                      {selectedHabilidades.length !== 1 ? 's' : ''}
                    </p>

                    <div className="mt-3 space-y-1 text-xs text-indigo-600 max-h-32 overflow-y-auto">
                      {selectedHabilidades.map(code => (
                        <div key={code} className="flex items-start gap-2">
                          <span>▪</span>
                          <span>{code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 3: Detalhes e Revisão */}
          {etapa === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nome do Projeto *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="Ex: Horta Sustentável"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descrição Breve
                </label>
                <textarea
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  placeholder="Descreva o projeto em poucas linhas..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Justificativa (opcional)
                </label>
                <textarea
                  value={projectJustificativa}
                  onChange={e => setProjectJustificativa(e.target.value)}
                  placeholder="Por que este projeto é importante? Como se alinha com a BNCC?"
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              {/* Resumo */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                <h4 className="font-bold text-slate-800 mb-4">📋 Resumo do Projeto</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Área:</span>
                    <span className="font-bold text-slate-800">
                      {areas.find(a => a.id === selectedArea)?.nome}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Habilidades BNCC:</span>
                    <span className="font-bold text-slate-800">
                      {selectedHabilidades.length}
                    </span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-indigo-200">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-600">Nome:</span>
                      <span className="font-bold text-indigo-700 text-right">
                        {projectName || '(não preenchido)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RODAPÉ - BOTÕES */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-6 flex justify-between gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition"
          >
            Cancelar
          </button>

          <div className="flex gap-3">
            {etapa > 1 && (
              <button
                onClick={handleAnteriorEtapa}
                className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
            )}

            {etapa < 3 ? (
              <button
                onClick={handleProximoEtapa}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200"
              >
                Próximo
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSalvarProjeto}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Salvar Projeto
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWizardBNCC;
