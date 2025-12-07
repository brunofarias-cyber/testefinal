import React, { useState } from "react";
import {
  ChevronLeft,
  Users,
  Rocket,
  TrendingUp,
  Heart,
  MessageSquare,
  X
} from "lucide-react";

const MOCK_ECOSYSTEM_FEED = [
    {
        id: 'eco1',
        project: 'Horta Vertical 3D',
        class: '3º Ano B',
        teacher: 'Profª Marina Costa',
        date: '2023-12-01',
        description: 'Sistema automatizado de irrigação com sensores IoT',
        likes: 45,
        comments: 12,
        cover: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
        tags: ['IoT', 'Sustentabilidade', 'Programação']
    },
    {
        id: 'eco2',
        project: 'App de Reciclagem',
        class: '2º Ano C',
        teacher: 'Prof. Carlos Tech',
        date: '2023-11-28',
        description: 'Aplicativo mobile para gamificar coleta seletiva',
        likes: 38,
        comments: 8,
        cover: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
        tags: ['Mobile', 'Gamificação', 'Meio Ambiente']
    },
    {
        id: 'eco3',
        project: 'Podcast História Local',
        class: '1º Ano A',
        teacher: 'Prof. João História',
        date: '2023-11-25',
        description: 'Série de entrevistas com moradores antigos do bairro',
        likes: 52,
        comments: 15,
        cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
        tags: ['História', 'Audiovisual', 'Comunidade']
    }
];

const SchoolEcosystem = () => {
    const [feed] = useState(MOCK_ECOSYSTEM_FEED);
    const [selectedProject, setSelectedProject] = useState(null);

    if (selectedProject) {
        return (
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => setSelectedProject(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
                >
                    <ChevronLeft size={20} /> Voltar para Feed
                </button>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="h-64 bg-slate-200 overflow-hidden">
                        <img
                            src={selectedProject.cover}
                            alt={selectedProject.project}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedProject.project}</h1>
                                <p className="text-slate-500">
                                    {selectedProject.class} • {selectedProject.teacher}
                                </p>
                            </div>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2">
                                <Heart size={18} />
                                Curtir ({selectedProject.likes})
                            </button>
                        </div>

                        <p className="text-slate-700 text-lg mb-6">{selectedProject.description}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedProject.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-4">
                                💬 Comentários ({selectedProject.comments})
                            </h3>
                            <div className="bg-slate-50 rounded-xl p-4 text-center text-slate-500">
                                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Funcionalidade de comentários em desenvolvimento</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Ecossistema Escolar 🌐</h2>
                <p className="text-slate-500">Descubra e colabore com projetos de outras turmas</p>
            </div>

            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-indigo-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-indigo-600 uppercase">Turmas Ativas</p>
                            <p className="text-3xl font-bold text-slate-800">15</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
                            <Rocket size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-purple-600 uppercase">Projetos 2024</p>
                            <p className="text-3xl font-bold text-slate-800">342</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-green-600 uppercase">Taxa Conclusão</p>
                            <p className="text-3xl font-bold text-slate-800">89%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed de Projetos */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">🔥 Projetos em Destaque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feed.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden group"
                        >
                            <div className="h-48 bg-slate-200 overflow-hidden">
                                <img
                                    src={project.cover}
                                    alt={project.project}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-slate-800 flex-1 group-hover:text-indigo-600 transition">
                                        {project.project}
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-3">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.slice(0, 2).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-semibold"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div className="text-xs text-slate-500">
                                        <span className="font-bold">{project.class}</span>
                                        <span className="mx-2">•</span>
                                        <span>{project.teacher}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Heart size={14} />
                                            {project.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageSquare size={14} />
                                            {project.comments}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchoolEcosystem;
