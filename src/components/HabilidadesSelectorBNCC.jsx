import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { BNCC_COMPLETO } from '../constants/bnccCompleto';

const ANOS_DISPONIVEIS = ['6º ano', '7º ano', '8º ano', '9º ano'];

/**
 * Componente de Seleção de Habilidades BNCC
 * Exibe todas as habilidades do 6º ao 9º ano de forma organizada
 */
export default function HabilidadesSelectorBNCC({ areaAtiva, selectedHabilidades, onToggleHabilidade }) {
  const [anoExpanded, setAnoExpanded] = useState({
    '6º ano': true,
    '7º ano': false,
    '8º ano': false,
    '9º ano': false
  });

  if (!areaAtiva || !BNCC_COMPLETO[areaAtiva]) {
    return (
      <div className="text-center py-8 text-slate-500">
        Selecione uma área para ver as habilidades
      </div>
    );
  }

  const habilidadesPorAno = BNCC_COMPLETO[areaAtiva];

  const toggleAno = (ano) => {
    setAnoExpanded(prev => ({
      ...prev,
      [ano]: !prev[ano]
    }));
  };

  return (
    <div className="space-y-3">
      {ANOS_DISPONIVEIS.map(ano => {
        const habilidades = habilidadesPorAno[ano] || [];
        const isExpanded = anoExpanded[ano];
        const selectedCount = habilidades.filter(h => 
          selectedHabilidades.includes(h.code)
        ).length;

        return (
          <div key={ano} className="border border-slate-200 rounded-lg overflow-hidden">
            {/* HEADER DO ANO */}
            <button
              onClick={() => toggleAno(ano)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition"
            >
              <div className="flex items-center gap-3 flex-1">
                <ChevronDown
                  size={20}
                  className={`text-slate-600 transition ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                />
                <div className="text-left">
                  <h4 className="font-bold text-slate-800">{ano}</h4>
                  <p className="text-xs text-slate-500">
                    {selectedCount} de {habilidades.length} selecionadas
                  </p>
                </div>
              </div>
              <div className="bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold">
                {habilidades.length}
              </div>
            </button>

            {/* HABILIDADES */}
            {isExpanded && (
              <div className="border-t border-slate-200 bg-white divide-y divide-slate-100">
                {habilidades.length > 0 ? (
                  habilidades.map(hab => {
                    const isSelected = selectedHabilidades.includes(hab.code);
                    return (
                      <label
                        key={hab.code}
                        className="flex items-start gap-3 p-4 hover:bg-indigo-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleHabilidade(hab.code)}
                          className="w-5 h-5 mt-1 rounded border-2 border-slate-300 text-indigo-600 cursor-pointer accent-indigo-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2">
                            <code className="font-mono text-xs font-bold text-indigo-600 flex-shrink-0">
                              {hab.code}
                            </code>
                            <h5 className="font-semibold text-slate-800 text-sm">
                              {hab.titulo}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {hab.descricao}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0 mt-1 bg-indigo-600 text-white rounded-full p-1">
                            <Check size={16} />
                          </div>
                        )}
                      </label>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    Nenhuma habilidade disponível
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* RESUMO */}
      <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase">Total Selecionado</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {Object.values(habilidadesPorAno)
                .flat()
                .filter(h => selectedHabilidades.includes(h.code))
                .length}
              {' '}
              <span className="text-sm">
                habilidade
                {Object.values(habilidadesPorAno)
                  .flat()
                  .filter(h => selectedHabilidades.includes(h.code)).length !== 1 ? 's' : ''}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600">de</p>
            <p className="text-2xl font-bold text-slate-600">
              {Object.values(habilidadesPorAno).flat().length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
