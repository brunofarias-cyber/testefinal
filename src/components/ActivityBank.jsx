import React, { useState } from "react";
import { ChevronLeft, Plus, Download, Star, ArrowRight, Check, Target, FileText, Award, ClipboardList } from "lucide-react";
import { MOCK_ACTIVITY_BANK } from "../constants/mockData";

const ActivityBank = () => {
    const [activities, setActivities] = useState(MOCK_ACTIVITY_BANK);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['all', 'Ciências', 'Linguagens', 'Exatas', 'Artes', 'Multidisciplinar'];
    const difficulties = ['all', 'Fácil', 'Médio', 'Difícil'];

    const filteredActivities = activities.filter(activity => {
        const matchesCategory = filterCategory === 'all' || activity.category === filterCategory;
        const matchesDifficulty = filterDifficulty === 'all' || activity.difficulty === filterDifficulty;
        const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'Fácil': 'bg-green-100 text-green-700 border-green-200',
            'Médio': 'bg-yellow-100 text-yellow-700 border-yellow-200',
            'Difícil': 'bg-red-100 text-red-700 border-red-200'
        };
        return colors[difficulty] || 'bg-slate-100 text-slate-700';
    };

    if (selectedActivity) {
        return (
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => setSelectedActivity(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
                >
                    <ChevronLeft size={20} /> Voltar para Banco de Atividades
                </button>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-extrabold mb-2">{selectedActivity.title}</h1>
                                <p className="text-indigo-100">Por {selectedActivity.author}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-semibold transition">
                                    <Download size={18} className="inline mr-2" />
                                    Baixar
                                </button>
                                <button className="px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition">
                                    Usar Template
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getDifficultyColor(selectedActivity.difficulty)}`}>
                                {selectedActivity.difficulty}
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-bold">
                                ⏱️ {selectedActivity.duration}
                            </span>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-bold">
                                ⭐ {selectedActivity.rating} ({selectedActivity.downloads} downloads)
                            </span>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-8 space-y-8">
                        {/* Objetivos */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Target size={24} className="text-indigo-600" />
                                Objetivos de Aprendizagem
                            </h3>
                            <ul className="space-y-2">
                                {selectedActivity.objectives.map((obj, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                                        <span className="text-slate-700">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Materiais */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <ClipboardList size={24} className="text-indigo-600" />
                                Materiais Necessários
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {selectedActivity.materials.map((material, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span className="text-slate-700 text-sm">{material}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Passo a Passo */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText size={24} className="text-indigo-600" />
                                Passo a Passo
                            </h3>
                            <div className="space-y-3">
                                {selectedActivity.steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <p className="text-slate-700 pt-1">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Competências BNCC */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Award size={24} className="text-indigo-600" />
                                Competências BNCC
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedActivity.bnccCompetencies.map((comp, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold text-sm border border-indigo-200">
                                        {comp}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedActivity.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Banco de Atividades</h2>
                    <p className="text-slate-500">Templates prontos e atividades reutilizáveis</p>
                </div>
                <button 
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                    <Plus size={18} />
                    Nova Atividade
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <FileText size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                            <p className="text-2xl font-bold text-slate-800">{activities.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <Download size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Downloads</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {activities.reduce((sum, a) => sum + a.downloads, 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <Star size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Avaliação</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {(activities.reduce((sum, a) => sum + a.rating, 0) / activities.length).toFixed(1)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Award size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Autores</p>
                            <p className="text-2xl font-bold text-slate-800">4</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Busca e Filtros */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por título ou tag..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Categoria</label>
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'Todas' : cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dificuldade</label>
                        <select 
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>
                                    {diff === 'all' ? 'Todas' : diff}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de Atividades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map(activity => (
                    <div 
                        key={activity.id}
                        onClick={() => setSelectedActivity(activity)}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer overflow-hidden group"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                                    {activity.category}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-xs font-bold border ${getDifficultyColor(activity.difficulty)}`}>
                                    {activity.difficulty}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition">
                                {activity.title}
                            </h3>
                            
                            <p className="text-sm text-slate-500 mb-4">⏱️ {activity.duration}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {activity.tags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Download size={14} />
                                        {activity.downloads}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-500" />
                                        {activity.rating}
                                    </span>
                                </div>
                                <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transition" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityBank;
