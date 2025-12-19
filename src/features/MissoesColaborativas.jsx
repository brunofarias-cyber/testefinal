import React, { useState } from 'react';
import { Trophy, Zap, Award } from 'lucide-react';

const MOCK_TEAM_MISSIONS = [
  {
    id: 1,
    teamId: 1,
    teamName: 'Equipe Alpha',
    name: 'Qualidade Premium',
    description: 'Todos os critérios acima de 8',
    type: 'quality',
    xpReward: 200,
    status: 'completed',
    progress: 100,
    icon: '⭐'
  },
  {
    id: 2,
    teamId: 1,
    teamName: 'Equipe Alpha',
    name: 'Sinergia Total',
    description: 'Cada membro 5+ contribuições',
    type: 'collaboration',
    xpReward: 250,
    status: 'in-progress',
    progress: 60,
    icon: '🤝'
  },
  {
    id: 3,
    teamId: 2,
    teamName: 'Equipe Beta',
    name: 'Inovação',
    description: 'Usar 3+ métodos diferentes',
    type: 'innovation',
    xpReward: 250,
    status: 'available',
    progress: 0,
    icon: '💡'
  }
];

const MOCK_TEAMS_WITH_LEVELS = [
  {
    id: 1,
    name: 'Equipe Alpha',
    level: 6,
    xp: 2300,
    members: 4,
    levelName: 'Avançada',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 2,
    name: 'Equipe Beta',
    level: 3,
    xp: 800,
    members: 3,
    levelName: 'Emergente',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 3,
    name: 'Equipe Gama',
    level: 5,
    xp: 2000,
    members: 4,
    levelName: 'Desenvolvida',
    color: 'from-green-500 to-emerald-500'
  }
];

const calculateLevel = (xp) => {
  const levels = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
  for (let i = 0; i < levels.length; i++) {
    if (xp < levels[i]) return i;
  }
  return 10;
};

const getProgressToNextLevel = (xp) => {
  const levels = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
  const currentLevel = calculateLevel(xp);
  const currentLevelXp = levels[currentLevel - 1] || 0;
  const nextLevelXp = levels[currentLevel] || 5000;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return Math.min(progress, 100);
};

const MissoesColaborativas = () => {
  const [selectedTeam, setSelectedTeam] = useState(MOCK_TEAMS_WITH_LEVELS[0]);
  const [expandedMission, setExpandedMission] = useState(null);

  const teamMissions = MOCK_TEAM_MISSIONS.filter(
    m => m.teamId === selectedTeam.id
  );

  const handleAcceptMission = (missionId) => {
    // Em produção, isso atualizaria o banco de dados
    console.log('Missão aceita:', missionId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <Trophy className="text-yellow-500" size={32} />
          Missões Semanais
        </h2>
        <p className="text-slate-500">
          Equipes progridem juntas, sem competição tóxica
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seletor de Equipes */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">Equipes</h3>
          {MOCK_TEAMS_WITH_LEVELS.map(team => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className={`p-4 rounded-xl cursor-pointer transition ${
                selectedTeam.id === team.id
                  ? `bg-gradient-to-r ${team.color} text-white shadow-lg shadow-indigo-200`
                  : 'bg-white border border-slate-100 hover:border-slate-200'
              }`}
            >
              <h4 className="font-bold mb-1">{team.name}</h4>
              <p className="text-sm opacity-90 mb-2">Nível {team.level} - {team.levelName}</p>
              <div className="bg-black/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full"
                  style={{ width: `${getProgressToNextLevel(team.xp)}%` }}
                ></div>
              </div>
              <p className="text-xs opacity-80 mt-1">{team.xp} XP</p>
            </div>
          ))}
        </div>

        {/* Missões da Equipe Selecionada */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 text-lg">Missões Ativas</h3>
          {teamMissions.map(mission => (
            <div
              key={mission.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{mission.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800">{mission.name}</h4>
                    <p className="text-sm text-slate-500">{mission.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Zap size={16} className="text-yellow-500" />
                    <span className="font-bold text-yellow-700">{mission.xpReward} XP</span>
                  </div>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-4">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      mission.status === 'completed'
                        ? 'bg-green-500'
                        : mission.status === 'in-progress'
                        ? 'bg-indigo-500'
                        : 'bg-slate-300'
                    }`}
                    style={{ width: `${mission.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{mission.progress}% concluído</p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {mission.status === 'completed' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                    ✅ Concluída
                  </span>
                )}
                {mission.status === 'in-progress' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                    ⏳ Em Progresso
                  </span>
                )}
                {mission.status === 'available' && (
                  <button
                    onClick={() => handleAcceptMission(mission.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition"
                  >
                    Aceitar Missão
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objetivo Coletivo */}
      <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Award size={28} />
          Objetivo Coletivo da Turma
        </h3>
        <p className="mb-4 opacity-90">Se 80% das equipes atingirem nível 8, toda turma ganha uma celebração especial!</p>
        <div className="bg-white/20 p-4 rounded-xl">
          <p className="text-sm font-bold mb-2">Progresso: 6 de 10 equipes (60%)</p>
          <div className="w-full bg-white/30 h-3 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissoesColaborativas;
