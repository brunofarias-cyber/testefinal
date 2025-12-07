/*
═══════════════════════════════════════════════════════════════════════
  FRONTEND - COMPONENTE REACT: ASSISTENTE INTELIGENTE BNCC
═══════════════════════════════════════════════════════════════════════

Arquivo: src/components/ProjectWizard.jsx

Features:
- 3 etapas interativas
- Seleção de competências BNCC com interface amigável
- Geração de sugestões com IA
- Auto-save de rascunhos
- Feedback visual para cada etapa

═══════════════════════════════════════════════════════════════════════
*/

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Save,
  Loader,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════

export const ProjectWizard = ({ teacherId, classId, onClose }) => {
  const [estado, setEstado] = useState({
    etapa: 1,
    areaId: null,
    selectedHabilidadesIds: [],
    temaProjeto: '',
    sugestaoIA: null,
    titulo: '',
    descricao: '',
    justificativa: '',
    objetivosEspecificos: '',
    atividadesIniciais: '',
  });

  const [areas, setAreas] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingIA, setLoadingIA] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  // 🔄 Carregar áreas ao montar
  useEffect(() => {
    fetchAreas();
    carregarRascunho();
  }, []);

  // 📦 Carregar habilidades quando área muda
  useEffect(() => {
    if (estado.areaId) {
      fetchHabilidades(estado.areaId);
    }
  }, [estado.areaId]);

  // 💾 Auto-save a cada mudança (debounced)
  useEffect(() => {
    if (estado.etapa >= 1 && estado.areaId) {
      const timer = setTimeout(() => {
        salvarRascunho();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [estado]);

  // ═══════════════════════════════════════════════════════════════════════
  // FUNÇÕES DE FETCH
  // ═══════════════════════════════════════════════════════════════════════

  const fetchAreas = async () => {
    try {
      setLoadingAreas(true);
      const response = await fetch('/api/wizard-bncc/areas');
      const data = await response.json();
      if (data.success) {
        setAreas(data.data);
      }
    } catch (err) {
      setErro('Erro ao carregar áreas BNCC');
      console.error(err);
    } finally {
      setLoadingAreas(false);
    }
  };

  const fetchHabilidades = async (areaId) => {
    try {
      const response = await fetch(`/api/wizard-bncc/habilidades?areaId=${areaId}`);
      const data = await response.json();
      if (data.success) {
        setHabilidades(data.data);
      }
    } catch (err) {
      setErro('Erro ao carregar habilidades');
      console.error(err);
    }
  };

  const carregarRascunho = async () => {
    try {
      const response = await fetch(`/api/wizard-bncc/draft/${teacherId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setEstado((prev) => ({
          ...prev,
          areaId: data.data.area_id,
          selectedHabilidadesIds: data.data.selected_habilidades_ids || [],
          temaProjeto: data.data.tema_projeto || '',
          etapa: data.data.etapa_atual || 1,
          justificativa: data.data.justificativa || '',
          objetivosEspecificos: data.data.objetivos_especificos || '',
          atividadesIniciais: data.data.atividades_iniciais || '',
        }));
      }
    } catch (err) {
      console.log('Nenhum rascunho encontrado');
    }
  };

  const salvarRascunho = async () => {
    try {
      await fetch('/api/wizard-bncc/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          areaId: estado.areaId,
          selectedHabilidadesIds: estado.selectedHabilidadesIds,
          temaProjeto: estado.temaProjeto,
          etapaAtual: estado.etapa,
          justificativa: estado.justificativa,
          objetivosEspecificos: estado.objetivosEspecificos,
          atividadesIniciais: estado.atividadesIniciais,
        }),
      });
    } catch (err) {
      console.error('Erro ao salvar rascunho:', err);
    }
  };

  const gerarComIA = async () => {
    if (!estado.temaProjeto || estado.selectedHabilidadesIds.length === 0) {
      setErro('Preencha o tema e selecione pelo menos uma habilidade');
      return;
    }

    try {
      setLoadingIA(true);
      setErro(null);

      const response = await fetch('/api/wizard-bncc/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temaProjeto: estado.temaProjeto,
          selectedHabilidadesIds: estado.selectedHabilidadesIds,
          areaId: estado.areaId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEstado((prev) => ({
          ...prev,
          sugestaoIA: data.data,
          justificativa: data.data.justificativa,
          objetivosEspecificos: data.data.objetivosEspecificos,
          atividadesIniciais: data.data.atividadesIniciais,
          titulo: estado.temaProjeto, // Usar tema como título inicial
          etapa: 3,
        }));
      } else if (data.fallback) {
        setEstado((prev) => ({
          ...prev,
          sugestaoIA: data.fallback.data,
          justificativa: data.fallback.data.justificativa,
          objetivosEspecificos: data.fallback.data.objetivosEspecificos,
          atividadesIniciais: data.fallback.data.atividadesIniciais,
          titulo: estado.temaProjeto,
          etapa: 3,
        }));
      }
    } catch (err) {
      setErro('Erro ao gerar sugestões com IA');
      console.error(err);
    } finally {
      setLoadingIA(false);
    }
  };

  const salvarProjeto = async () => {
    if (!estado.titulo || !estado.descricao) {
      setErro('Preencha título e descrição');
      return;
    }

    try {
      const response = await fetch('/api/wizard-bncc/save-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          titulo: estado.titulo,
          descricao: estado.descricao,
          justificativa: estado.justificativa,
          objetivosEspecificos: estado.objetivosEspecificos,
          selectedHabilidadesIds: estado.selectedHabilidadesIds,
          category: 'BNCC',
          difficulty: 'Médio',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSucesso(true);
        setTimeout(() => {
          if (onClose) onClose();
          window.location.href = `/projeto/${data.data.projectId}`;
        }, 2000);
      }
    } catch (err) {
      setErro('Erro ao salvar projeto');
      console.error(err);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDERIZAÇÃO PRINCIPAL
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="text-indigo-600" size={32} />
          <h1 className="text-4xl font-extrabold text-slate-900">
            Assistente Inteligente de Planejamento
          </h1>
        </div>
        <p className="text-slate-600 mb-6">
          Crie projetos alinhados com BNCC em 3 passos simples
        </p>

        {/* Stepper */}
        <Stepper etapaAtual={estado.etapa} />
      </div>

      {/* Erro */}
      {erro && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700">{erro}</p>
          </div>
        </div>
      )}

      {/* Sucesso */}
      {sucesso && (
        <div className="max-w-4xl mx-auto mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500" size={20} />
            <p className="text-green-700">Projeto criado com sucesso! Redirecionando...</p>
          </div>
        </div>
      )}

      {/* Conteúdo por Etapa */}
      <div className="max-w-4xl mx-auto">
        {estado.etapa === 1 && (
          <Etapa1 estado={estado} setEstado={setEstado} areas={areas} loading={loadingAreas} />
        )}

        {estado.etapa === 2 && (
          <Etapa2
            estado={estado}
            setEstado={setEstado}
            habilidades={habilidades}
            loadingIA={loadingIA}
            gerarComIA={gerarComIA}
          />
        )}

        {estado.etapa === 3 && (
          <Etapa3 estado={estado} setEstado={setEstado} salvarProjeto={salvarProjeto} />
        )}

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setEstado((prev) => ({ ...prev, etapa: Math.max(1, prev.etapa - 1) }))}
            disabled={estado.etapa === 1}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          {estado.etapa < 3 ? (
            <button
              onClick={() => {
                if (estado.etapa === 2) {
                  gerarComIA();
                } else {
                  setEstado((prev) => ({ ...prev, etapa: Math.min(3, prev.etapa + 1) }));
                }
              }}
              disabled={!isEtapaValida(estado, estado.etapa)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-bold"
            >
              {estado.etapa === 2 && loadingIA ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={salvarProjeto}
              disabled={!estado.titulo || !estado.descricao}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50"
            >
              <Save size={20} />
              Salvar Projeto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ETAPA 1: SELEÇÃO DE COMPETÊNCIAS
// ═══════════════════════════════════════════════════════════════════════

const Etapa1 = ({ estado, setEstado, areas, loading }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">
      Etapa 1: Selecione uma Área de Conhecimento
    </h2>
    <p className="text-slate-600 mb-6">
      Escolha a área na qual seu projeto se enquadra
    </p>

    {loading ? (
      <div className="text-center py-8">
        <Loader className="mx-auto animate-spin text-indigo-600" size={40} />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {areas.map((area) => (
          <button
            key={area.id}
            onClick={() => {
              setEstado((prev) => ({
                ...prev,
                areaId: area.id,
                selectedHabilidadesIds: [],
              }));
            }}
            className={`p-6 rounded-xl border-2 transition text-left ${
              estado.areaId === area.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-slate-200 hover:border-indigo-200'
            }`}
          >
            <div className="text-3xl mb-2">{area.icone}</div>
            <h3 className="font-bold text-lg text-slate-800">{area.nome}</h3>
            <p className="text-sm text-slate-500">{area.descricao || 'Selecione para ver habilidades'}</p>
            {estado.areaId === area.id && (
              <Check className="mt-3 text-indigo-600" size={24} />
            )}
          </button>
        ))}
      </div>
    )}

    {estado.areaId && (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-700 font-semibold">✓ Área selecionada. Prossiga para a próxima etapa.</p>
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// ETAPA 2: TEMA E SELEÇÃO DE HABILIDADES
// ═══════════════════════════════════════════════════════════════════════

const Etapa2 = ({ estado, setEstado, habilidades, loadingIA, gerarComIA }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">
      Etapa 2: Tema do Projeto e Habilidades BNCC
    </h2>
    <p className="text-slate-600 mb-6">
      Defina o tema e selecione as habilidades que deseja trabalhar
    </p>

    {/* Tema */}
    <div className="mb-6">
      <label className="block text-sm font-bold text-slate-700 mb-2">
        Qual é o tema do seu projeto?
      </label>
      <input
        type="text"
        value={estado.temaProjeto}
        onChange={(e) => setEstado((prev) => ({ ...prev, temaProjeto: e.target.value }))}
        placeholder="Ex: Horta Sustentável, Jornalismo Digital, Robótica..."
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
      <p className="text-xs text-slate-500 mt-1">
        O tema será combinado com as habilidades para gerar um planejamento com IA
      </p>
    </div>

    {/* Habilidades */}
    <div className="mb-6">
      <label className="block text-sm font-bold text-slate-700 mb-3">
        Selecione as Habilidades BNCC a Desenvolver:
      </label>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {habilidades.length > 0 ? (
          habilidades.map((hab) => (
            <button
              key={hab.id}
              onClick={() => {
                setEstado((prev) => ({
                  ...prev,
                  selectedHabilidadesIds: prev.selectedHabilidadesIds.includes(hab.id)
                    ? prev.selectedHabilidadesIds.filter((id) => id !== hab.id)
                    : [...prev.selectedHabilidadesIds, hab.id],
                }));
              }}
              className={`w-full p-4 rounded-lg border-2 text-left transition ${
                estado.selectedHabilidadesIds.includes(hab.id)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{hab.codigo}</div>
                  <div className="text-sm font-semibold text-slate-700 mt-1">{hab.titulo}</div>
                  <div className="text-xs text-slate-500 mt-1">{hab.descricao}</div>
                  <div className="text-xs text-slate-400 mt-1">{hab.ano_escolar}</div>
                </div>
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    estado.selectedHabilidadesIds.includes(hab.id)
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-slate-300'
                  }`}
                >
                  {estado.selectedHabilidadesIds.includes(hab.id) && (
                    <Check size={16} className="text-white" />
                  )}
                </div>
              </div>
            </button>
          ))
        ) : (
          <p className="text-slate-500 text-center py-8">Selecione uma área para ver as habilidades</p>
        )}
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Selecionadas: {estado.selectedHabilidadesIds.length} habilidade
        {estado.selectedHabilidadesIds.length !== 1 ? 's' : ''}
      </p>
    </div>

    {/* Botão Gerar IA */}
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
      <p className="text-sm text-slate-700 mb-3">
        Com o tema e habilidades selecionadas, a IA pode gerar sugestões de planejamento!
      </p>
      <button
        onClick={gerarComIA}
        disabled={loadingIA || !estado.temaProjeto || estado.selectedHabilidadesIds.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-bold transition"
      >
        {loadingIA ? (
          <>
            <Loader size={20} className="animate-spin" />
            Gerando...
          </>
        ) : (
          <>
            <Zap size={20} />
            Gerar Sugestão com IA
          </>
        )}
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// ETAPA 3: REFINAMENTO E SALVAMENTO
// ═══════════════════════════════════════════════════════════════════════

const Etapa3 = ({ estado, setEstado }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">
      Etapa 3: Revise e Salve seu Projeto
    </h2>
    <p className="text-slate-600 mb-6">
      Edite as sugestões geradas e salve seu projeto
    </p>

    {/* Título */}
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">Título do Projeto *</label>
      <input
        type="text"
        value={estado.titulo}
        onChange={(e) => setEstado((prev) => ({ ...prev, titulo: e.target.value }))}
        placeholder="Dê um título para seu projeto"
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>

    {/* Descrição */}
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">Descrição Breve *</label>
      <textarea
        value={estado.descricao}
        onChange={(e) => setEstado((prev) => ({ ...prev, descricao: e.target.value }))}
        placeholder="Descreva brevemente seu projeto"
        rows={3}
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
      />
    </div>

    {/* Justificativa (gerada pela IA) */}
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">Justificativa</label>
      <textarea
        value={estado.justificativa}
        onChange={(e) => setEstado((prev) => ({ ...prev, justificativa: e.target.value }))}
        rows={4}
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
      />
      <p className="text-xs text-slate-500 mt-1">💡 Sugestão gerada pela IA. Edite conforme necessário.</p>
    </div>

    {/* Objetivos */}
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">Objetivos Específicos</label>
      <textarea
        value={estado.objetivosEspecificos}
        onChange={(e) => setEstado((prev) => ({ ...prev, objetivosEspecificos: e.target.value }))}
        rows={5}
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
      />
      <p className="text-xs text-slate-500 mt-1">💡 Sugestão gerada pela IA. Edite conforme necessário.</p>
    </div>

    {/* Atividades Iniciais */}
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">Atividades Iniciais</label>
      <textarea
        value={estado.atividadesIniciais}
        onChange={(e) => setEstado((prev) => ({ ...prev, atividadesIniciais: e.target.value }))}
        rows={6}
        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
      />
      <p className="text-xs text-slate-500 mt-1">💡 Sugestão gerada pela IA. Edite conforme necessário.</p>
    </div>

    {/* Info Provider IA */}
    {estado.sugestaoIA && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          📊 Sugestões geradas por: <strong>{estado.sugestaoIA.iaProvider || 'mock'}</strong>
        </p>
      </div>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════

const Stepper = ({ etapaAtual }) => (
  <div className="flex items-center justify-between gap-4">
    {[1, 2, 3].map((num) => (
      <React.Fragment key={num}>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
            etapaAtual >= num
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-200 text-slate-600'
          }`}
        >
          {etapaAtual > num ? <Check size={20} /> : num}
        </div>
        {num < 3 && (
          <div
            className={`flex-1 h-2 rounded transition ${
              etapaAtual > num ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

function isEtapaValida(estado, etapa) {
  if (etapa === 1) return estado.areaId !== null;
  if (etapa === 2) return estado.temaProjeto.length > 0 && estado.selectedHabilidadesIds.length > 0;
  return true;
}

export default ProjectWizard;
