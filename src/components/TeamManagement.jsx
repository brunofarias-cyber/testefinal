import React, { useState } from "react";
import { Users, Plus, X, Check, Save, Trash2 } from "lucide-react";
import { MOCK_TEAMS, MOCK_TEAM_TEMPLATES } from "../constants/mockData";

const TeamManagement = () => {
    const [teams, setTeams] = useState(MOCK_TEAMS);
    const [showModal, setShowModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [teamName, setTeamName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleCreateTeam = () => {
        if (teamName && selectedTemplate && selectedMembers.length > 0) {
            const newTeam = {
                id: teams.length + 1,
                name: teamName,
                project: "Novo Projeto",
                members: selectedMembers,
                teamFeedback: ""
            };
            setTeams([...teams, newTeam]);
            setShowModal(false);
            setTeamName("");
            setSelectedTemplate(null);
            setSelectedMembers([]);
        }
    };

    const deleteTeam = (id) => {
        setTeams(teams.filter(t => t.id !== id));
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Criar Times</h2>
                    <p className="text-slate-500">Organize alunos em equipes para projetos colaborativos.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Novo Time
                </button>
            </div>

            {/* Templates de Tamanho */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Templates de Tamanho</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {MOCK_TEAM_TEMPLATES.map(template => (
                        <div 
                            key={template.id}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                            <p className="text-4xl mb-2">{template.icon}</p>
                            <h4 className="font-bold text-slate-800 mb-1">{template.name}</h4>
                            <p className="text-xs text-slate-500 mb-3">{template.description}</p>
                            <p className="text-sm font-bold text-indigo-600">{template.size} pessoas</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lista de Times */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                    <div 
                        key={team.id}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-slate-800">{team.name}</h3>
                            <button 
                                onClick={() => deleteTeam(team.id)}
                                className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">{team.project}</p>
                        
                        <div className="flex -space-x-2 mb-4">
                            {team.members.map(m => (
                                <img 
                                    key={m.id}
                                    src={m.avatar} 
                                    className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" 
                                    title={m.name}
                                />
                            ))}
                        </div>
                        
                        <p className="text-xs text-slate-400 mb-4">{team.members.length} Membros</p>
                        
                        <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold transition">
                                Detalhes
                            </button>
                            <button className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition">
                                Editar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Criação */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800">Criar Novo Time</h3>
                            <button onClick={() => setShowModal(false)}>
                                <X size={20} className="text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Time</label>
                                <input 
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Ex: Equipe Alpha"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tamanho da Equipe</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {MOCK_TEAM_TEMPLATES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSelectedTemplate(t)}
                                            className={`p-3 rounded-lg border text-sm font-bold transition ${
                                                selectedTemplate?.id === t.id 
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleCreateTeam}
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition shadow-lg shadow-indigo-200"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamManagement;
