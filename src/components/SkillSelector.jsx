import React, { useState, useEffect } from 'react';
import { Plus, X, Search } from 'lucide-react';

export const SkillSelector = ({ projectId, onSkillsSelected }) => {
    const [skills, set Skills] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedYear, setSelectedYear] = useState(6);
    const [selectedDiscipline, setSelectedDiscipline] = useState('');
    const [selected, setSelected] = useState([]);
    const [disciplines, setDisciplines] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDisciplines();
        fetchSkills();
    }, [selectedYear, selectedDiscipline]);

    const fetchDisciplines = async () => {
        try {
            const res = await fetch('/api/bncc/disciplines');
            const json = await res.json();
            setDisciplines(json.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                year: selectedYear,
                ...(selectedDiscipline && { discipline: selectedDiscipline }),
                ...(search && { search }),
            });
            const res = await fetch(`/api/bncc/skills?${params}`);
            const json = await res.json();
            setSkills(json.data);
            setFiltered(json.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSkill = (skill) => {
        if (!selected.find(s => s.code === skill.code)) {
            setSelected([...selected, skill]);
        }
    };

    const handleRemove = (skillCode) => {
        setSelected(selected.filter(s => s.code !== skillCode));
    };

    const handleSave = async () => {
        try {
            const skillCodes = selected.map(s => s.code);
            const res = await fetch(`/api/bncc/projects/${projectId}/skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skillCodes }),
            });
            if (res.ok) {
                onSkillsSelected(selected);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Selecionar Habilidades BNCC</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Série</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value={6}>6º Ano</option>
                        <option value={7}>7º Ano</option>
                        <option value={8}>8º Ano</option>
                        <option value={9}>9º Ano</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Disciplina</label>
                    <select
                        value={selectedDiscipline}
                        onChange={(e) => setSelectedDiscipline(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Todas</option>
                        {disciplines.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Buscar</label>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Código ou descrição..."
                            className="w-full pl-10 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 max-h-96 overflow-y-auto">
                {loading ? (
                    <p className="text-slate-500">Carregando...</p>
                ) : (
                    filtered.map(skill => (
                        <div
                            key={skill.code}
                            className="p-3 border border-slate-200 rounded-lg hover:border-indigo-400 cursor-pointer hover:bg-indigo-50 transition"
                            onClick={() => handleSelectSkill(skill)}
                        >
                            <p className="font-bold text-sm text-indigo-600">{skill.code}</p>
                            <p className="text-xs text-slate-600 line-clamp-2">{skill.description}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-bold text-slate-600 mb-2">Selecionadas: {selected.length}</p>
                <div className="flex flex-wrap gap-2">
                    {selected.map(skill => (
                        <div key={skill.code} className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                            {skill.code}
                            <button onClick={() => handleRemove(skill.code)}>
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={selected.length === 0}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300"
            >
                <Plus size={18} className="inline mr-2" />
                Vincular {selected.length} Habilidades
            </button>
        </div>
    );
};

export default SkillSelector;
