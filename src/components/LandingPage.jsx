import React from "react";
import { Home, Book, Rocket, Grid, ArrowRight } from "lucide-react";
import BrandLogo from "./BrandLogo";

const LandingPage = ({ onEnter }) => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col relative overflow-hidden">
        <nav className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-3">
                <BrandLogo size={40} />
                <span className="text-2xl font-bold text-slate-800 tracking-tight">NEXO</span>
            </div>
            <button className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-sm">
                Agendar Demo
            </button>
        </nav>

        <div className="flex-1 flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto w-full px-6 md:px-12 gap-12 py-12">
            
            <div className="md:w-1/2 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                    </span>
                    Plataforma #1 para Escolas Inovadoras
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
                    Projetos que <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Engajam Alunos</span>
                </h1>
                
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                    Centralize a gestão pedagógica, automatize o acompanhamento da BNCC e transforme atividades escolares em experiências gamificadas.
                </p>
            </div>

            <div className="md:w-1/2 w-full grid gap-4">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Acesso Rápido (Ambiente Demo)</p>
                
                <button onClick={() => onEnter('teacher')} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex items-center gap-6 hover:scale-105 transition-all shadow-sm hover:shadow-xl group cursor-pointer text-left border border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                        <Book size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Sou Professor</h3>
                        <p className="text-sm text-slate-500">Gerenciar projetos, turmas e rubricas.</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-blue-500 transition-colors" size={20} />
                </button>

                <button onClick={() => onEnter('student')} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex items-center gap-6 hover:scale-105 transition-all shadow-sm hover:shadow-xl group cursor-pointer text-left border border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                        <Rocket size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Sou Aluno</h3>
                        <p className="text-sm text-slate-500">Ver missões, XP e enviar atividades.</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-purple-500 transition-colors" size={20} />
                </button>

                <button onClick={() => onEnter('coordinator')} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl flex items-center gap-6 hover:scale-105 transition-all shadow-sm hover:shadow-xl group cursor-pointer text-left border border-slate-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                        <Grid size={28} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800">Coordenação</h3>
                        <p className="text-sm text-slate-500">Monitorar Kanban e desempenho docente.</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-orange-500 transition-colors" size={20} />
                </button>
            </div>
        </div>
    </div>
);

export default LandingPage;
