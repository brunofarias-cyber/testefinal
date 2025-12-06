import React, { useState, useEffect } from 'react';
import { Edit, BarChart2, CheckSquare, ChevronRight, Users, AlertCircle } from 'lucide-react';
import { RubricaEditor, RubricaEvaluator, RubricaResults } from './rubricas';

const TeacherRubricEditablePoints = () => {
    const [activeTab, setActiveTab] = useState('editor');
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [rubrica, setRubrica] = useState(null);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState(null);

    // Carregar projetos ao iniciar
    useEffect(() => {
        fetchProjects();
    }, []);

    // Carregar times e rubrica quando projeto muda
    useEffect(() => {
        if (selectedProjectId) {
            setLoadingProjects(true); // Reutilizando estado de loading ou criar um novo para transição suave
            Promise.all([
                fetchTeams(selectedProjectId),
                fetchRubrica(selectedProjectId)
            ]).finally(() => {
                setLoadingProjects(false);
            });
            setSelectedTeamId(null);
        }
    }, [selectedProjectId]);

    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const token = localStorage.getItem('token');
            // Tenta buscar projetos reais
            const response = await fetch('/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                    setSelectedProjectId(data[0].id);
                } else {
                    throw new Error("Nenhum projeto encontrado");
                }
            } else {
                throw new Error("Falha na API de projetos");
            }
        } catch (err) {
            console.warn("Usando dados de fallback para projetos:", err);
            // Fallback seguro para garantira UI não quebre
            const mockProjects = [
                { id: 1, title: 'Horta Sustentável (Demo)' },
                { id: 2, title: 'Feira de Ciências 2024' }
            ];
            setProjects(mockProjects);
            setSelectedProjectId(mockProjects[0].id);
        } finally {
            setLoadingProjects(false);
        }
    };

    const fetchTeams = async (projectId) => {
        // Simulação de busca de times
        // Em produção, isso seria: await fetch(`/api/projects/${projectId}/teams`)
        setTeams([
            { id: 1, name: 'Equipe Alpha' },
            { id: 2, name: 'Equipe Beta' },
            { id: 3, name: 'Equipe Gamma' },
            { id: 4, name: 'Equipe Delta' },
        ]);
    };

    const fetchRubrica = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/rubricas-v2/projeto/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.sucesso && data.dados) {
                    setRubrica(data.dados);
                } else {
                    setRubrica(null);
                }
            } else {
                setRubrica(null);
            }
        } catch (error) {
            console.error("Erro ao buscar rubrica", error);
            setRubrica(null);
        }
    };

    const renderTeamSelection = () => (
        <div className="max-w-5xl mx-auto my-8 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-600" />
                Selecione uma Equipe
            </h3>

            {!rubrica ? (
                <div className="bg-orange-50 text-orange-800 p-8 rounded-xl border border-orange-200 text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <p className="text-lg font-bold mb-2">Rubrica não definida</p>
                    <p className="mb-6">Você precisa criar uma rubrica para este projeto antes de avaliar as equipes.</p>
                    <button
                        onClick={() => setActiveTab('editor')}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition"
                    >
                        Ir para o Editor
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-400 hover:ring-1 hover:ring-purple-400 transition-all text-left group"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-lg text-gray-700 group-hover:text-purple-700">{team.name}</span>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-transform group-hover:translate-x-1" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-500">Pronto para avaliar</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    if (loadingProjects) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Carregando painel de rubricas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <CheckSquare className="w-8 h-8 text-purple-600" />
                            Gestão de Rubricas
                        </h1>
                        <p className="text-gray-500 mt-1">Crie critérios e avalie o desempenho das equipes por projeto.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 min-w-[300px]">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide px-2">Projeto:</span>
                        <select
                            value={selectedProjectId || ''}
                            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                            className="flex-1 bg-transparent border-none font-bold text-gray-800 focus:ring-0 cursor-pointer text-sm"
                        >
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-1 mb-8 bg-gray-200/50 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => { setActiveTab('editor'); setSelectedTeamId(null); }}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'editor'
                            ? 'bg-white text-purple-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <Edit className="w-4 h-4" /> Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('evaluator')}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'evaluator'
                            ? 'bg-white text-purple-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <CheckSquare className="w-4 h-4" /> Avaliação
                    </button>
                    <button
                        onClick={() => { setActiveTab('results'); setSelectedTeamId(null); }}
                        className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'results'
                            ? 'bg-white text-purple-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                            }`}
                    >
                        <BarChart2 className="w-4 h-4" /> Resultados
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="transition-all duration-300 min-h-[500px]">
                    {activeTab === 'editor' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <RubricaEditor
                                projectId={selectedProjectId}
                                onSave={(novaRubrica) => setRubrica(novaRubrica)}
                                initialData={rubrica}
                            />
                        </div>
                    )}

                    {activeTab === 'evaluator' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {!selectedTeamId ? (
                                renderTeamSelection()
                            ) : (
                                <div>
                                    <button
                                        onClick={() => setSelectedTeamId(null)}
                                        className="mb-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 hover:border-purple-300 flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                        Voltar para seleção de equipe
                                    </button>
                                    <RubricaEvaluator
                                        projectId={selectedProjectId}
                                        equipeId={selectedTeamId}
                                        rubrica={rubrica}
                                        onSave={() => alert('Avaliação salva com sucesso!')}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {!rubrica ? (
                                <div className="text-center p-12 bg-white rounded-xl border border-gray-200">
                                    <p className="text-gray-500">Nenhuma rubrica definida para este projeto. Crie uma rubrica e realize avaliações para ver os resultados.</p>
                                </div>
                            ) : (
                                <RubricaResults projectId={selectedProjectId} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherRubricEditablePoints;
