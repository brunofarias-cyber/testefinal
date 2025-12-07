import React, { useState } from 'react';
import { Trophy, Star, TrendingUp, Award, Zap, Heart, MessageSquare, X, ExternalLink, Share2 } from 'lucide-react';
import { MOCK_PORTFOLIO } from '../mockDataExtended';

const StudentPortfolioComponent = () => {
    const [portfolio] = useState(MOCK_PORTFOLIO);
    const [showShareModal, setShowShareModal] = useState(false);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header do Portfólio */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 text-white shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-2">{portfolio.student.name}</h1>
                            <p className="text-indigo-100">{portfolio.student.year} • {portfolio.student.period}</p>
                        </div>
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition flex items-center gap-2"
                        >
                            <Share2 size={18} />
                            Compartilhar
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Trophy size={24} className="mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{portfolio.stats.projectsCompleted}</p>
                            <p className="text-xs opacity-80">Projetos Concluídos</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Star size={24} className="mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{portfolio.stats.averageGrade}</p>
                            <p className="text-xs opacity-80">Média Geral</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <TrendingUp size={24} className="mb-2 opacity-80" />
                            <p className="text-3xl font-bold">+{portfolio.stats.evolution}</p>
                            <p className="text-xs opacity-80">Evolução</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Award size={24} className="mb-2 opacity-80" />
                            <p className="text-3xl font-bold">{portfolio.stats.badges}</p>
                            <p className="text-xs opacity-80">Badges</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projetos em Destaque */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Projetos em Destaque</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {portfolio.highlights.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition overflow-hidden group"
                        >
                            <div className="h-40 bg-slate-200 overflow-hidden relative">
                                <img
                                    src={project.cover}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {project.featured && (
                                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Star size={12} />
                                        Destaque
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-slate-800">{project.title}</h3>
                                    <span className="text-2xl font-bold text-indigo-600">{project.grade}</span>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-semibold"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-400 mt-3">
                                    {new Date(project.date).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Habilidades Desenvolvidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Zap size={20} className="text-indigo-600" />
                        Habilidades Técnicas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {portfolio.skills.technical.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Heart size={20} className="text-indigo-600" />
                        Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {portfolio.skills.soft.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Depoimentos de Professores */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <MessageSquare size={20} className="text-indigo-600" />
                    Depoimentos de Professores
                </h3>
                <div className="space-y-4">
                    {portfolio.testimonials.map((testimonial, idx) => (
                        <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                    {testimonial.teacher.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{testimonial.teacher}</p>
                                    <p className="text-xs text-slate-500">{testimonial.subject}</p>
                                </div>
                            </div>
                            <p className="text-slate-700 italic">"{testimonial.text}"</p>
                            <p className="text-xs text-slate-400 mt-2">
                                {new Date(testimonial.date).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de Compartilhamento */}
            {showShareModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800">Compartilhar Portfólio</h3>
                            <button onClick={() => setShowShareModal(false)}>
                                <X size={20} className="text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Link Público</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value="https://bprojetos.com/portfolio/joao-silva"
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm"
                                    />
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
                                        Copiar
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-3 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 transition text-center">
                                    <ExternalLink size={20} className="mx-auto mb-1 text-indigo-600" />
                                    <p className="text-xs font-bold text-slate-700">Exportar PDF</p>
                                </button>
                                <button className="p-3 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition text-center">
                                    <Share2 size={20} className="mx-auto mb-1 text-purple-600" />
                                    <p className="text-xs font-bold text-slate-700">Gerar QR Code</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPortfolioComponent;
