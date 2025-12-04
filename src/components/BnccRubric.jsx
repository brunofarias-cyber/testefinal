import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';

// ==========================================
// RubricEditor
// ==========================================
export const RubricEditor = ({ projectId, skillCode, onSaved }) => {
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIndicators();
    }, [projectId, skillCode]);

    const fetchIndicators = async () => {
        try {
            const res = await fetch(`/api/bncc-rubrics/${projectId}/${skillCode}`);
            const json = await res.json();
            setIndicators(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, field, value) => {
        const indicator = indicators.find(i => i.id === id);
        try {
            const res = await fetch(`/api/bncc-rubrics/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...indicator, [field]: value }),
            });
            if (res.ok) {
                setIndicators(indicators.map(i => i.id === id ? { ...i, [field]: value } : i));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="space-y-4">
            {indicators.map(ind => (
                <div key={ind.id} className="bg-white border-l-4 border-indigo-600 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-800">
                            Nível {ind.level}: {ind.levelLabel}
                        </h3>
                        <div className="flex gap-2">
                            <span className="text-sm font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                {ind.points} pontos
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                Descrição
                            </label>
                            <textarea
                                defaultValue={ind.description}
                                onBlur={(e) => handleUpdate(ind.id, 'description', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded text-sm"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                Comportamento Observável
                            </label>
                            <textarea
                                defaultValue={ind.observableBehavior}
                                onBlur={(e) => handleUpdate(ind.id, 'observableBehavior', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded text-sm"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                                Exemplos
                            </label>
                            <textarea
                                defaultValue={ind.examples}
                                onBlur={(e) => handleUpdate(ind.id, 'examples', e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded text-sm"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ==========================================
// RubricTemplate
// ==========================================
export const RubricTemplate = ({ projectId }) => {
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const json = await res.json();
            setProjects(json.data.filter(p => p.id !== projectId));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDuplicate = async () => {
        if (!selectedProject) return;

        setLoading(true);
        try {
            const res = await fetch(
                `/api/bncc-rubrics/duplicate/${selectedProject}/${projectId}`,
                { method: 'POST' }
            );
            if (res.ok) {
                alert('Rubricas duplicadas com sucesso!');
                setSelectedProject('');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Usar Rubrica de Outro Projeto</h3>

            <div className="space-y-3">
                <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded"
                >
                    <option value="">Selecione um projeto...</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>

                <button
                    onClick={handleDuplicate}
                    disabled={!selectedProject || loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 disabled:bg-slate-300"
                >
                    {loading ? 'Copiando...' : 'Copiar Rubricas'}
                </button>
            </div>
        </div>
    );
};

export default RubricEditor;
