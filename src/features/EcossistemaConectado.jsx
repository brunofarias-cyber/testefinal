import React, { useState } from 'react';
import { Globe, Briefcase, Zap, Users, ArrowRight } from 'lucide-react';

const MOCK_PARTNERSHIPS = [
  {
    id: 1,
    type: 'company',
    name: 'EcoTech Solutions',
    category: 'Sustentabilidade',
    logo: '🌱',
    description: 'Empresa líder em soluções ambientais',
    matchedProjects: [1, 5],
    opportunities: [
      {
        id: 'opp_1',
        title: 'Mentoria em Sustentabilidade',
        description: 'Trabalhe com nossos experts em projetos reais',
        duration: '3 meses',
        level: 'Iniciante',
        status: 'open'
      },
      {
        id: 'opp_2',
        title: 'Estágio Remunerado',
        description: 'Oportunidade de estágio durante recesso escolar',
        duration: 'Flexível',
        level: 'Intermediário',
        status: 'open'
      }
    ]
  },
  {
    id: 2,
    type: 'university',
    name: 'USP - Instituto de Pesquisa',
    category: 'Pesquisa Científica',
    logo: '🔬',
    description: 'Pesquisa científica de ponta',
    matchedProjects: [2, 4, 6],
    opportunities: [
      {
        id: 'opp_3',
        title: 'Iniciação Científica',
        description: 'Programa de pesquisa com orientação de mestrandos',
        duration: '6-12 meses',
        level: 'Avançado',
        status: 'open'
      }
    ]
  },
  {
    id: 3,
    type: 'ngo',
    name: 'Instituto Água Limpa',
    category: 'Impacto Social',
    logo: '💧',
    description: 'ONG focada em sustentabilidade hídrica',
    matchedProjects: [1, 3],
    opportunities: [
      {
        id: 'opp_4',
        title: 'Voluntariado em Campo',
        description: 'Trabalhar em projetos reais com comunidades',
        duration: '4 semanas',
        level: 'Iniciante',
        status: 'open'
      }
    ]
  }
];

const EcossistemaConectado = ({ role }) => {
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  const [filterType, setFilterType] = useState('all');

  const filteredPartnerships = MOCK_PARTNERSHIPS.filter(p =>
    filterType === 'all' ? true : p.type === filterType
  );

  const handleApplyOpportunity = (opportunityId) => {
    if (!appliedOpportunities.includes(opportunityId)) {
      setAppliedOpportunities([...appliedOpportunities, opportunityId]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Globe className="text-green-500" size={32} />
          Ecossistema Conectado
        </h2>
        <p className="text-slate-500">
          Conecte com empresas, universidades e ONGs para oportunidades reais
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        {['all', 'company', 'university', 'ngo'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              filterType === type
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {type === 'all' && 'Todos'}
            {type === 'company' && '🏢 Empresas'}
            {type === 'university' && '🎓 Universidades'}
            {type === 'ngo' && '🤝 ONGs'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredPartnerships.map(partnership => (
          <div
            key={partnership.id}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedPartnership(partnership)}
          >
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <span className="text-4xl">{partnership.logo}</span>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">
                  {partnership.type === 'company' ? '🏢' : partnership.type === 'university' ? '🎓' : '🤝'} {partnership.type}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{partnership.name}</h3>
              <p className="text-sm text-slate-600">{partnership.description}</p>
            </div>

            <div className="p-6">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                {partnership.opportunities.length} Oportunidades Disponíveis
              </p>
              <div className="space-y-3">
                {partnership.opportunities.map(opp => (
                  <div
                    key={opp.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-300 transition"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-sm text-slate-800">{opp.title}</p>
                      <span className="text-xs font-bold text-indigo-600">{opp.level}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{opp.duration}</p>
                    <p className="text-xs text-slate-600">{opp.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPartnership(partnership);
                }}
                className="w-full mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <Zap size={16} />
                Ver Oportunidades
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          <Briefcase size={24} className="text-indigo-600" />
          Minhas Candidaturas ({appliedOpportunities.length})
        </h3>
        {appliedOpportunities.length === 0 ? (
          <p className="text-slate-500">Você ainda não se candidatou a nenhuma oportunidade</p>
        ) : (
          <p className="text-green-600 font-bold">✓ {appliedOpportunities.length} candidatura(s) enviada(s)</p>
        )}
      </div>

      {selectedPartnership && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-1">{selectedPartnership.name}</h2>
                <p className="opacity-90">{selectedPartnership.category}</p>
              </div>
              <button
                onClick={() => setSelectedPartnership(null)}
                className="text-2xl hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-slate-700">{selectedPartnership.description}</p>

              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-4">Oportunidades Disponíveis</h3>
                <div className="space-y-3">
                  {selectedPartnership.opportunities.map(opp => (
                    <div
                      key={opp.id}
                      className="p-4 border border-slate-100 rounded-xl hover:border-indigo-300 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{opp.title}</h4>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">
                          {opp.level}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{opp.description}</p>
                      <p className="text-xs text-slate-500 mb-4">⏱️ {opp.duration}</p>
                      <button
                        onClick={() => {
                          handleApplyOpportunity(opp.id);
                        }}
                        disabled={appliedOpportunities.includes(opp.id)}
                        className={`w-full px-4 py-2 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 ${
                          appliedOpportunities.includes(opp.id)
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {appliedOpportunities.includes(opp.id) ? (
                          <>✓ Candidatura Enviada</>
                        ) : (
                          <>
                            <Zap size={16} />
                            Me Candidatar
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcossistemaConectado;
