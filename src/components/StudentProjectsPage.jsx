import React from 'react';

const StudentProjectsPage = ({ projects, onProjectClick }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Meus Projetos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(p => (
                    <div
                        key={p.id}
                        onClick={() => onProjectClick(p)}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg cursor-pointer transition"
                    >
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-600 mb-4">Prof. {p.teacher}</p>
                        <div className="mb-4">
                            <div className="w-full bg-slate-200 h-2 rounded-full">
                                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${p.progress}%` }}></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{p.progress}%</p>
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                            {p.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentProjectsPage;
