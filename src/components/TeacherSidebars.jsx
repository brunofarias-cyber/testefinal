import React from 'react';
import {
  Home,
  FileText,
  Calendar,
  CheckSquare,
  Star,
  BookOpen,
  Edit2,
  Target,
  Send,
  Settings
} from 'lucide-react';

export const SidebarVertical = ({ activeSection, setActiveSection }) => {
  const basicSections = [
    { id: 'dashboard', icon: Home, label: 'Início', title: 'Dashboard' },
    { id: 'planning', icon: FileText, label: 'Planej.', title: 'Planejamento' },
    { id: 'attendance', icon: CheckSquare, label: 'Presença', title: 'Chamada' },
  ];

  const managementSections = [
    { id: 'evaluation', icon: Star, label: 'Avaliação', title: 'Avaliação' },
    { id: 'activities', icon: Edit2, label: 'Atividades', title: 'Atividades' },
    { id: 'calendar', icon: Calendar, label: 'Calendário', title: 'Calendário' },
    { id: 'grades', icon: Target, label: 'Notas', title: 'Notas' },
    { id: 'bncc', icon: BookOpen, label: 'BNCC', title: 'BNCC' },
    { id: 'submissions', icon: Send, label: 'Submissões', title: 'Submissões' },
  ];

  return (
    <div className="w-20 md:w-24 bg-gradient-to-b from-blue-600 to-purple-600 flex flex-col gap-2 p-2 rounded-lg shadow-lg h-fit max-h-[calc(100vh-200px)] overflow-y-auto">
      {/* Seção Básica */}
      <div>
        {basicSections.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            title={label}
            className={`
              w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 mb-1
              ${
                activeSection === id
                  ? 'bg-white text-blue-600 shadow-md scale-105'
                  : 'text-white hover:bg-white/20 hover:scale-105'
              }
            `}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      {/* Divisor */}
      <div className="border-t border-white/30 my-2"></div>

      {/* Seção Gestão */}
      <div className="flex-1">
        {managementSections.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            title={label}
            className={`
              w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 mb-1
              ${
                activeSection === id
                  ? 'bg-white text-blue-600 shadow-md scale-105'
                  : 'text-white hover:bg-white/20 hover:scale-105'
              }
            `}
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export const QuickInfoSidebar = ({ stats }) => {
  return (
    <div className="hidden lg:block w-64 bg-gradient-to-b from-slate-50 to-slate-100 p-4 rounded-lg border-2 border-slate-200 h-fit max-h-[calc(100vh-200px)] overflow-y-auto">
      <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
        📊 Resumo Rápido
      </h3>
      
      <div className="space-y-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600">Atividades Ativas</div>
          <div className="text-2xl font-bold text-blue-600">{stats?.activities || 0}</div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600">Avaliações Pendentes</div>
          <div className="text-2xl font-bold text-purple-600">{stats?.evaluations || 0}</div>
        </div>
        
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600">Estudantes</div>
          <div className="text-2xl font-bold text-green-600">{stats?.students || 0}</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600">Taxa Envio</div>
          <div className="text-2xl font-bold text-orange-600">{stats?.submissionRate || '0'}%</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600">Média Turma</div>
          <div className="text-2xl font-bold text-pink-600">{stats?.classAverage || '0'}</div>
        </div>

        <hr className="my-3" />

        <div className="text-xs text-slate-500 space-y-1">
          <p>🔔 Última atualização: agora</p>
          <p>✅ Tudo sincronizado</p>
        </div>
      </div>
    </div>
  );
};
