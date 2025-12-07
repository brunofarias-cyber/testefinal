import React, { useState } from 'react';
import { Share2, Download, Eye, EyeOff, Briefcase, Star, TrendingUp } from 'lucide-react';

const MOCK_PORTFOLIO = {
  studentId: 2,
  studentName: 'João Silva',
  totalProjects: 6,
  projects: [
    {
      id: 1,
      title: 'Horta Sustentável',
      date: '2024-11-15',
      description: 'Liderança na pesquisa sobre cultivo sustentável em pequenos espaços',
      image: 'https://via.placeholder.com/300x200?text=Horta',
      grade: 9.5,
      competencies: {
        scientific_thinking: 9.5,
        teamwork: 9.0,
        sustainability: 9.2
      },
      isPublic: true,
      views: 42,
      url: '#'
    },
    {
      id: 2,
      title: 'Robótica com Sucata',
      date: '2024-10-20',
      description: 'Desenvolvimento de robô com materiais reciclados',
      image: 'https://via.placeholder.com/300x200?text=Robotica',
      grade: 8.5,
      competencies: {
        creativity: 9.0,
        problem_solving: 8.5,
        innovation: 8.8
      },
      isPublic: true,
      views: 28,
      url: '#'
    },
    {
      id: 3,
      title: 'Jornal Digital',
      date: '2024-09-10',
      description: 'Criação de jornal digital com notícias da comunidade',
      image: 'https://via.placeholder.com/300x200?text=Jornal',
      grade: 8.0,
      competencies: {
        communication: 8.5,
        cultural_repertoire: 7.8,
        digital_culture: 8.2
      },
      isPublic: false,
      views: 0,
      url: '#'
    }
  ],
  overallCompetencies: {
    scientific_thinking: 95,
    communication: 88,
    creativity: 92,
    teamwork: 85,
    leadership: 78
  },
  certificateId: 'CERT_2024_002',
  careerRecommendations: [
    { name: 'Pesquisador', match: '90%' },
    { name: 'Engenheiro Ambiental', match: '87%' },
    { name: 'Professor', match: '82%' }
  ]
};

const PortfolioDigital = ({ role }) => {
  const [portfolio] = useState(MOCK_PORTFOLIO);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCareer, setShowCareer] = useState(false);
  const [publicLink] = useState('https://bprojetos.com/p/joao-silva-2024');

  const toggleProjectVisibility = (projectId) => {
    console.log('Toggle visibility:', projectId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Briefcase className="text-indigo-600" size={32} />
          Meu Portfólio Digital
        </h2>
        <p className="text-slate-500">
          {portfolio.studentName} • {portfolio.totalProjects} projetos comprovados
        </p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
        <h3 className="font-bold mb-2">📤 Compartilhe seu portfólio</h3>
        <p className="mb-4 text-sm opacity-90">Envie este link para universidades, empresas e oportunidades</p>
        <div className="flex gap-2 bg-black/20 p-3 rounded-lg">
          <input
            type="text"
            readOnly
            value={publicLink}
            className="flex-1 bg-transparent text-white outline-none"
          />
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-bold hover:bg-slate-100 transition">
            Copiar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8">
        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={24} />
          Competências BNCC Demonstradas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(portfolio.overallCompetencies).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-slate-700 capitalize">{key.replace('_', ' ')}</span>
                <span className="font-bold text-indigo-600">{value}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Meus Melhores Projetos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="w-full h-40 bg-slate-200 relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                {project.isPublic && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Eye size={12} />
                    {project.views} views
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{project.title}</h4>
                  <span className="text-yellow-500 font-bold flex items-center gap-1">
                    <Star size={16} fill="currentColor" />
                    {project.grade}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{project.date}</p>
                <p className="text-sm text-slate-600 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(project.competencies).map(([key, value]) => (
                    <span
                      key={key}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold"
                    >
                      {value.toFixed(1)}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProjectVisibility(project.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition"
                >
                  {project.isPublic ? (
                    <>
                      <Eye size={14} />
                      Público
                    </>
                  ) : (
                    <>
                      <EyeOff size={14} />
                      Privado
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-8">
        <h3 className="font-bold text-lg text-slate-800 mb-4">🎯 Carreiras Recomendadas</h3>
        <p className="text-slate-600 mb-6">
          Com base nas suas competências demonstradas, estas carreiras combinam bem com você:
        </p>
        <div className="space-y-3">
          {portfolio.careerRecommendations.map((career, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl"
            >
              <span className="font-bold text-slate-800">{career.name}</span>
              <span className="text-indigo-600 font-bold">{career.match} match</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-lg text-slate-800 mb-2">📜 Certificado de Competências</h3>
        <p className="text-slate-600 mb-6">ID: {portfolio.certificateId}</p>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition">
          <Download size={18} />
          Baixar Certificado
        </button>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{selectedProject.title}</h3>
                <p className="text-slate-500">{selectedProject.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} fill="currentColor" className="text-yellow-500" />
                <span className="text-xl font-bold text-slate-800">{selectedProject.grade}/10</span>
              </div>
              <p className="text-slate-700">{selectedProject.description}</p>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                Ver Projeto Completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioDigital;
