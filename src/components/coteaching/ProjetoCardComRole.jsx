import React from 'react';
import { ArrowRight, AlertCircle, BookOpen } from 'lucide-react';

const ProjetoCardComRole = ({ projeto, role, onClick }) => {
    const getRoleLabel = () => {
        return role === 'owner' ? 'Meu Projeto' : 'Colaborador';
    };

    const getRoleColor = () => {
        return role === 'owner'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-purple-100 text-purple-700';
    };

    return (
        <div
            onClick={() => onClick && onClick(projeto)}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {projeto.title}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${getRoleColor()}`}>
                            {getRoleLabel()}
                        </span>
                    </div>
                    {projeto.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">{projeto.description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded ${projeto.status === 'Em Andamento'
                        ? 'bg-green-100 text-green-700'
                        : projeto.status === 'Planejamento'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                    }`}>
                    {projeto.status}
                </span>

                {projeto.bnccCoverage && (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-[10px] font-bold border border-indigo-100 flex items-center gap-1">
                        <BookOpen size={10} /> {projeto.bnccCoverage}%
                    </span>
                )}
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-indigo-600 h-full" style={{ width: `${projeto.progress || 0}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 text-right">{projeto.progress || 0}%</p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-indigo-600">Ver detalhes</span>
                <ArrowRight size={16} className="text-indigo-600" />
            </div>
        </div>
    );
};

export default ProjetoCardComRole;
