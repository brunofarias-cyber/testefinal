import { useState } from 'react';
import { Plus, X, Check, ChevronLeft, ArrowRight, FileText, Sparkles, AlertCircle } from 'lucide-react';
import HabilidadesSelectorBNCC from './HabilidadesSelectorBNCC';
import { BNCC_OFICIAL } from '../constants/bnccOficial';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ProjectWizardAI - Novo Fluxo com Descrição Primeiro
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Componente aprimorado de 4 etapas:
 * 1. Etapa 1: Professor descreve o projeto
 * 2. Etapa 2: IA sugere habilidades baseado na descrição
 * 3. Etapa 3: Professor revisa e seleciona habilidades finais
 * 4. Etapa 4: Confirmação e salvamento
 * 
 * Features:
 * - IA sugere habilidades BNCC relevantes
 * - Dados BNCC completos e oficiais
 * - Interface intuitiva e responsiva
 * - Validação de qualidade
 */
const ProjectWizardAI = () => {
  // ────────────────────────────────────────────────────────────────
  // ESTADO DO WIZARD
  // ────────────────────────────────────────────────────────────────

  const [etapa, setEtapa] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectJustificativa, setProjectJustificativa] = useState('');
  const [selectedHabilidades, setSelectedHabilidades] = useState([]);
  const [suggestedHabilidades, setSuggestedHabilidades] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iaLoading, setIaLoading] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);

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
  // FUNÇÕES DE IA - SUGESTÃO DE HABILIDADES
  // ────────────────────────────────────────────────────────────────

  /**
   * Função que chama a API para sugerir habilidades via IA
   * Baseado na descrição do projeto
   */
  const sugerirHabilidades = async () => {
    if (!projectDescription.trim() || projectDescription.length < 20) {
      alert('Por favor, descreva seu projeto com pelo menos 20 caracteres.');
      return;
    }

    setIaLoading(true);
    try {
      const response = await fetch('/api/wizard-ai/suggest-habilidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectDescription: projectDescription,
          projectName: projectName,
          availableAreas: Object.keys(BNCC_OFICIAL)
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar sugestões');
      }

      const data = await response.json();
      setSuggestedHabilidades(data.suggestedHabilidades || []);
      setSelectedArea(data.mainArea || null);
      
      // Auto-selecionar as habilidades sugeridas
      setSelectedHabilidades(data.suggestedHabilidades.map(h => h.code) || []);
      
      // Ir para próxima etapa
      setEtapa(3);
    } catch (error) {
      console.error('Erro ao sugerir habilidades:', error);
      alert('Erro ao processar sua descrição. Tente novamente.');
    } finally {
      setIaLoading(false);
    }
  };

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
    if (etapa === 1) {
      if (!projectName.trim()) {
        alert('Digite o nome do projeto!');
        return;
      }
      if (!projectDescription.trim() || projectDescription.length < 20) {
        alert('Descreva seu projeto com mais detalhes (mínimo 20 caracteres)');
        return;
      }
      setEtapa(2);
    } else if (etapa === 2) {
      // Aqui chamamos a IA para sugerir habilidades
      sugerirHabilidades();
    } else if (etapa === 3) {
      if (selectedHabilidades.length === 0) {
        alert('Selecione pelo menos uma habilidade!');
        return;
      }
      setEtapa(4);
    } else if (etapa === 4) {
      handleSalvarProjeto();
    }
  };

  const handleAnteriorEtapa = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const handleSalvarProjeto = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/wizard-bncc/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: 1, // TODO: Get from auth context
          classId: 1, // TODO: Get from props or context
          titulo: projectName,
          descricao: projectDescription,
          justificativa: projectJustificativa,
          selectedHabilidadesIds: selectedHabilidades,
          area: selectedArea
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar projeto');
      }

      const savedProject = await response.json();
      setSavedProjects([...savedProjects, savedProject]);
      
      // Reset form
      setProjectName('');
      setProjectDescription('');
      setProjectJustificativa('');
      setSelectedHabilidades([]);
      setSuggestedHabilidades([]);
      setSelectedArea(null);
      setEtapa(1);
      setShowModal(false);
      
      alert('✅ Projeto salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      alert('Erro ao salvar projeto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* BOTÃO FLUTUANTE */}
      {!showModal && (
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition flex items-center gap-2 z-40"
        >
          <Plus size={20} className="sm:w-6 sm:h-6" />
          <span className="hidden sm:inline text-sm sm:text-base">Novo Projeto</span>
        </button>
      )}

      {/* MODAL DO WIZARD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:p-6 flex justify-between items-start sm:items-center gap-2">
              <div className="flex-1">
                <h2 className="text-lg sm:text-2xl font-bold">Criar Novo Projeto</h2>
                <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                  Etapa {etapa} de 4
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* CONTEÚDO */}
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* ETAPA 1: Descrição do Projeto */}
              {etapa === 1 && (
                <div className="space-y-3 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                      Nome do Projeto *
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      placeholder="Ex: Horta Sustentável..."
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                      Descreva seu Projeto com Detalhes *
                    </label>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 sm:p-3 mb-3 text-xs sm:text-sm text-indigo-700 flex gap-2">
                      <Sparkles size={16} className="flex-shrink-0 mt-0.5" />
                      <span>Quanto mais detalhes, melhores as sugestões da IA!</span>
                    </div>
                    <textarea
                      value={projectDescription}
                      onChange={e => setProjectDescription(e.target.value)}
                      placeholder="Descreva: O que será feito? Como? Qual é o objetivo?"
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      {projectDescription.length} caracteres (mínimo: 20)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                      Justificativa (opcional)
                    </label>
                    <textarea
                      value={projectJustificativa}
                      onChange={e => setProjectJustificativa(e.target.value)}
                      placeholder="Por que fazer esse projeto?"
                      rows={2}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ETAPA 2: Processando com IA */}
              {etapa === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="text-center py-8 sm:py-12">
                    <div className="inline-block">
                      <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-2 border-indigo-600 mb-4"></div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                      Analisando seu projeto...
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600">
                      A IA está procurando as melhores habilidades BNCC.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-blue-700">
                      💡 <strong>Dica:</strong> Quanto mais detalhada a sua descrição, mais precisas as sugestões.
                    </p>
                  </div>
                </div>
              )}

              {/* ETAPA 3: Revisar e Ajustar Habilidades */}
              {etapa === 3 && selectedArea && (
                <div className="space-y-3 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-4">
                      ✨ Habilidades Sugeridas
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                      Você pode desselecionar as que não se encaixam ou adicionar mais:
                    </p>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2 sm:p-4 mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm font-bold text-indigo-700">
                        Área Identificada: <span className="text-indigo-600">{areas.find(a => a.id === selectedArea)?.nome}</span>
                      </p>
                    </div>

                    {/* Seletor Interativo */}
                    <div className="text-sm">
                      <HabilidadesSelectorBNCC
                        areaAtiva={selectedArea}
                        selectedHabilidades={selectedHabilidades}
                        onToggleHabilidade={toggleHabilidade}
                      />
                    </div>
                  </div>

                  {selectedHabilidades.length > 0 && (
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs sm:text-sm font-bold text-green-700">
                        ✓ {selectedHabilidades.length} habilidade{selectedHabilidades.length !== 1 ? 's' : ''} selecionada{selectedHabilidades.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ETAPA 4: Revisão Final */}
              {etapa === 4 && (
                <div className="space-y-3 sm:space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 sm:p-6 rounded-xl border border-indigo-200">
                    <h3 className="font-bold text-slate-800 mb-3 sm:mb-4 text-sm sm:text-base">📋 Resumo Final</h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <p className="text-xs text-slate-600 uppercase font-bold">Nome</p>
                        <p className="text-sm sm:text-lg font-bold text-slate-800">{projectName}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-600 uppercase font-bold">Descrição</p>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{projectDescription}</p>
                      </div>

                      {projectJustificativa && (
                        <div>
                          <p className="text-xs text-slate-600 uppercase font-bold">Justificativa</p>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{projectJustificativa}</p>
                        </div>
                      )}

                      <div className="pt-3 sm:pt-4 border-t border-indigo-200">
                        <p className="text-xs text-slate-600 uppercase font-bold mb-2">Habilidades BNCC</p>
                        <p className="text-sm sm:text-lg font-bold text-indigo-600 mb-2">
                          {selectedHabilidades.length} habilidade{selectedHabilidades.length !== 1 ? 's' : ''}
                        </p>
                        <div className="space-y-1 sm:space-y-2 text-xs text-slate-600 max-h-40 overflow-y-auto">
                          {selectedHabilidades.map(code => (
                            <div key={code} className="flex items-center gap-2">
                              <Check size={12} className="text-green-600 flex-shrink-0" />
                              <span className="font-mono text-indigo-600 text-xs">{code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-4 flex gap-2 sm:gap-3">
                    <AlertCircle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <p className="text-xs sm:text-sm text-yellow-700">
                      Revise todos os dados antes de confirmar.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RODAPÉ - BOTÕES */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-3 sm:p-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition text-sm sm:text-base order-2 sm:order-1"
              >
                Cancelar
              </button>

              <div className="flex gap-2 sm:gap-3 order-1 sm:order-2">
                {etapa > 1 && (
                  <button
                    onClick={handleAnteriorEtapa}
                    className="px-3 sm:px-6 py-2 sm:py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition flex items-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                  >
                    <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>
                )}

                <button
                  onClick={handleProximoEtapa}
                  disabled={loading || iaLoading}
                  className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base flex-1 sm:flex-none"
                >
                  {etapa === 2 && iaLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 sm:h-4 w-3 sm:w-4 border-b-2 border-white"></div>
                      <span className="hidden sm:inline">Processando...</span>
                    </>
                  ) : etapa === 4 ? (
                    <>
                      <Check size={16} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Salvar</span>
                    </>
                  ) : etapa === 3 ? (
                    <>
                      <span className="hidden sm:inline">Revisar</span>
                      <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Próximo</span>
                      <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LISTA DE PROJETOS SALVOS */}
      {savedProjects.length > 0 && (
        <div className="mt-6 sm:mt-8 p-3 sm:p-6 bg-white rounded-xl border border-slate-200 mx-2 sm:mx-0">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4">
            📚 Seus Projetos ({savedProjects.length})
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {savedProjects.map((project, idx) => (
              <div key={idx} className="p-2 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">{project.titulo}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{project.descricao}</p>
                <div className="text-xs text-slate-500 mt-2">
                  {project.selectedHabilidadesIds?.length || 0} habilidades
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWizardAI;
