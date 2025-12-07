import React, { useState } from 'react';
import { Zap, Send, AlertCircle, Check } from 'lucide-react';

// MOCK DATA - Copie junto
const MOCK_COPILOTO_SUGGESTIONS = [
  {
    id: 1,
    type: 'question',
    title: 'Pergunta Provocadora',
    content: 'Qual é o PROBLEMA REAL que você está tentando resolver? (Não é a solução, é o problema)'
  },
  {
    id: 2,
    type: 'framework',
    title: 'Framework: 5 Porquês',
    content: '1. Por que isso acontece? 2. Por quê? ... Repita 5 vezes para entender a raiz'
  },
  {
    id: 3,
    type: 'checklist',
    title: 'Sua Pesquisa Tem:',
    items: [
      'Introdução clara do problema',
      'Objetivo SMART definido',
      'Metodologia descrita',
      'Referências verificadas',
      'Conclusão baseada em dados'
    ]
  },
  {
    id: 4,
    type: 'warning',
    title: '⚠️ Detector de Plágio',
    content: 'Você copiou algo? Sistema detecta se você não reescrever com suas palavras'
  }
];

const CopilotoIA = ({ projectId, role }) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [savedResponses, setSavedResponses] = useState([]);
  const [activeTab, setActiveTab] = useState('suggestions');

  const handleSaveSuggestion = () => {
    if (userResponse.trim()) {
      setSavedResponses([
        ...savedResponses,
        {
          id: Date.now(),
          suggestionId: selectedSuggestion.id,
          response: userResponse,
          timestamp: new Date().toLocaleDateString('pt-BR')
        }
      ]);
      setUserResponse('');
      setSelectedSuggestion(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="text-yellow-500" size={32} />
            Copiloto IA para Criatividade
          </h2>
          <p className="text-slate-500 mt-2">
            IA ajuda a desbloquear criatividade, mas você que decide
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 p-2 flex gap-2">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition ${
            activeTab === 'suggestions'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          💡 Sugestões
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition ${
            activeTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          ✅ Suas Respostas ({savedResponses.length})
        </button>
      </div>

      {/* Sugestões */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          {MOCK_COPILOTO_SUGGESTIONS.map(suggestion => (
            <div
              key={suggestion.id}
              className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition ${
                selectedSuggestion?.id === suggestion.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <h3 className="font-bold text-lg text-slate-800 mb-2">
                {suggestion.title}
              </h3>

              {suggestion.type === 'question' && (
                <p className="text-slate-600 italic mb-4">"{suggestion.content}"</p>
              )}

              {suggestion.type === 'framework' && (
                <p className="text-slate-600 mb-4">{suggestion.content}</p>
              )}

              {suggestion.type === 'checklist' && (
                <ul className="space-y-2 mb-4">
                  {suggestion.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-600">
                      <Check size={18} className="text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {suggestion.type === 'warning' && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
                  <p className="text-yellow-700 text-sm">{suggestion.content}</p>
                </div>
              )}

              {selectedSuggestion?.id === suggestion.id && (
                <div className="mt-4 space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    Sua Resposta:
                  </label>
                  <textarea
                    value={userResponse}
                    onChange={e => setUserResponse(e.target.value)}
                    placeholder="Digite sua resposta aqui (reescreva com suas palavras)..."
                    className="w-full p-4 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveSuggestion}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                      <Send size={16} />
                      Salvar Resposta
                    </button>
                    <button
                      onClick={() => setSelectedSuggestion(null)}
                      className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {selectedSuggestion?.id !== suggestion.id && (
                <button
                  onClick={() => setSelectedSuggestion(suggestion)}
                  className="text-indigo-600 font-bold hover:text-indigo-700"
                >
                  Responder →
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Respostas Salvas */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedResponses.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">
                Ainda não tem respostas. Comece respondendo uma sugestão! 👆
              </p>
            </div>
          ) : (
            savedResponses.map(response => {
              const suggestion = MOCK_COPILOTO_SUGGESTIONS.find(
                s => s.id === response.suggestionId
              );
              return (
                <div
                  key={response.id}
                  className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
                >
                  <div className="flex justify-between mb-3">
                    <h4 className="font-bold text-slate-800">
                      {suggestion?.title}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {response.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">
                    {response.response}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CopilotoIA;
