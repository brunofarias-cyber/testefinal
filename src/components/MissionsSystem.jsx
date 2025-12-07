import React, { useState } from "react";
import { 
  Target, 
  Clock, 
  Check, 
  Flame, 
  Calendar, 
  Star, 
  Trophy,
  Zap
} from "lucide-react";

const MOCK_MISSIONS = {
    daily: [
        { id: 'd1', title: "Entre no sistema hoje", xp: 50, completed: true, type: 'daily' },
        { id: 'd2', title: "Comente em 1 tarefa de colega", xp: 100, completed: false, progress: 0, total: 1, type: 'daily' },
        { id: 'd3', title: "Atualize seu Kanban", xp: 75, completed: true, type: 'daily' }
    ],
    weekly: [
        { id: 'w1', title: "Complete 5 tarefas no prazo", xp: 500, completed: false, progress: 2, total: 5, type: 'weekly', deadline: '2023-12-10' },
        { id: 'w2', title: "Ajude 3 colegas", xp: 300, completed: false, progress: 1, total: 3, type: 'weekly', deadline: '2023-12-10' },
        { id: 'w3', title: "Sem faltas esta semana", xp: 400, completed: true, progress: 5, total: 5, type: 'weekly', deadline: '2023-12-10' }
    ],
    special: [
        { id: 's1', title: "Entregue com 24h de antecedência", xp: 800, badge: "Madrugador", completed: false, type: 'special' },
        { id: 's2', title: "Nota acima de 9.0 em projeto", xp: 1000, badge: "Excelência", completed: false, type: 'special' }
    ]
};

const MissionsSystem = () => {
    const [missions] = useState(MOCK_MISSIONS);
    const [activeTab, setActiveTab] = useState('daily');
    const [showCelebration, setShowCelebration] = useState(false);

    const completeMission = (missionId) => {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
    };

    const getDaysRemaining = (deadline) => {
        const today = new Date();
        const end = new Date(deadline);
        const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const renderMissionCard = (mission) => {
        const progress = mission.progress || 0;
        const total = mission.total || 1;
        const percentage = (progress / total) * 100;

        return (
            <div
                key={mission.id}
                className={`bg-white p-5 rounded-xl border-2 transition-all ${
                    mission.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}
            >
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                        <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                mission.completed
                                    ? 'bg-green-500 text-white'
                                    : 'bg-indigo-100 text-indigo-600'
                            }`}
                        >
                            {mission.completed ? <Check size={20} /> : <Target size={20} />}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold ${mission.completed ? 'text-green-700 line-through' : 'text-slate-800'}`}>
                                {mission.title}
                            </h3>
                            {mission.deadline && (
                                <p className="text-xs text-slate-500 mt-1">
                                    <Clock size={12} className="inline mr-1" />
                                    {getDaysRemaining(mission.deadline)} dias restantes
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            mission.completed
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            +{mission.xp} XP
                        </span>
                    </div>
                </div>

                {!mission.completed && mission.total > 1 && (
                    <div>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Progresso</span>
                            <span className="font-bold">
                                {progress}/{total}
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {mission.completed && (
                    <div className="mt-3 text-sm text-green-600 font-semibold flex items-center gap-2">
                        <Check size={16} />
                        Missão Concluída!
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            {/* Celebração */}
            {showCelebration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-6 rounded-3xl shadow-2xl animate-bounce">
                        <div className="text-center">
                            <Trophy size={48} className="mx-auto mb-3" />
                            <p className="text-2xl font-bold">Missão Concluída!</p>
                            <p className="text-sm opacity-90 mt-1">+500 XP ganhos</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Centro de Missões 🎮</h2>
                    <p className="text-slate-500">Complete desafios e ganhe XP!</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg">
                    <p className="text-xs font-bold uppercase opacity-90">XP Total</p>
                    <p className="text-3xl font-extrabold">1,250</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('daily')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        activeTab === 'daily'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <Flame size={16} className="inline mr-2" />
                    Diárias ({missions.daily.length})
                </button>
                <button
                    onClick={() => setActiveTab('weekly')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        activeTab === 'weekly'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <Calendar size={16} className="inline mr-2" />
                    Semanais ({missions.weekly.length})
                </button>
                <button
                    onClick={() => setActiveTab('special')}
                    className={`px-6 py-3 rounded-xl font-bold transition ${
                        activeTab === 'special'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <Star size={16} className="inline mr-2" />
                    Especiais ({missions.special.length})
                </button>
            </div>

            {/* Missões Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTab === 'daily' && missions.daily.map(renderMissionCard)}
                {activeTab === 'weekly' && missions.weekly.map(renderMissionCard)}
                {activeTab === 'special' && missions.special.map((mission) => (
                    <div
                        key={mission.id}
                        className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200 hover:shadow-lg transition"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
                                    <Star size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{mission.title}</h3>
                                    {mission.badge && (
                                        <p className="text-xs text-purple-600 font-semibold mt-1">
                                            🏆 Desbloqueio: {mission.badge}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                +{mission.xp} XP
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MissionsSystem;
