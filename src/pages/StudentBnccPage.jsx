import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Bell, Award } from 'lucide-react';
import { StudentTimeline, SkillEvolution, AnnualReport } from '../components/BnccHistory';
import { NotificationCenter } from '../components/BnccAdvanced';

// Simple Tabs Component (same as Teacher page)
const Tabs = ({ children, defaultValue }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <div className="w-full">
            {React.Children.map(children, child =>
                React.cloneElement(child, { activeTab, setActiveTab })
            )}
        </div>
    );
};

const TabsList = ({ children, activeTab, setActiveTab }) => {
    return (
        <div className="grid grid-cols-4 bg-white border border-slate-200 p-1 rounded-xl mb-6">
            {React.Children.map(children, child =>
                React.cloneElement(child, { activeTab, setActiveTab })
            )}
        </div>
    );
};

const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => {
    const isActive = activeTab === value;
    return (
        <button
            onClick={() => setActiveTab(value)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition ${isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
        >
            {children}
        </button>
    );
};

const TabsContent = ({ value, children, activeTab }) => {
    if (activeTab !== value) return null;
    return <div>{children}</div>;
};

// Main Student Page
export const StudentBnccPage = ({ studentId }) => {
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSkills();
    }, [studentId]);

    const fetchSkills = async () => {
        try {
            const res = await fetch(`/api/bncc/student-skills/${studentId}`);
            const data = await res.json();
            setSkills(data.data || []);
        } catch (error) {
            console.error(error);
            setSkills([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">Meu Desempenho</h1>
                    <p className="text-slate-600 mt-2">Acompanhe sua evolução em habilidades BNCC</p>
                </div>

                <Tabs defaultValue="timeline">
                    <TabsList>
                        <TabsTrigger value="timeline">
                            <Calendar size={16} />
                            Timeline
                        </TabsTrigger>
                        <TabsTrigger value="habilidades">
                            <TrendingUp size={16} />
                            Habilidades
                        </TabsTrigger>
                        <TabsTrigger value="anual">
                            <Award size={16} />
                            Anual
                        </TabsTrigger>
                        <TabsTrigger value="notificacoes">
                            <Bell size={16} />
                            Notificações
                        </TabsTrigger>
                    </TabsList>

                    {/* ABA 1: Timeline */}
                    <TabsContent value="timeline">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Projetos Concluídos</h2>
                            <StudentTimeline studentId={studentId} />
                        </div>
                    </TabsContent>

                    {/* ABA 2: Habilidades */}
                    <TabsContent value="habilidades">
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Selecione uma Habilidade</h2>
                                {loading ? (
                                    <p className="text-slate-500">Carregando...</p>
                                ) : skills.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                                        {skills.map(skill => (
                                            <button
                                                key={skill.code}
                                                onClick={() => setSelectedSkill(skill.code)}
                                                className={`p-4 rounded-lg border-2 text-left transition ${selectedSkill === skill.code
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-slate-200 hover:border-indigo-300'
                                                    }`}
                                            >
                                                <p className="font-bold text-slate-800">{skill.code}</p>
                                                <p className="text-sm text-slate-600">{skill.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500">Você ainda não possui habilidades avaliadas.</p>
                                )}
                            </div>

                            {selectedSkill && (
                                <SkillEvolution studentId={studentId} skillCode={selectedSkill} />
                            )}
                        </div>
                    </TabsContent>

                    {/* ABA 3: Relatório Anual */}
                    <TabsContent value="anual">
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                <label className="block text-sm font-bold text-slate-600 mb-2">Selecione o Ano</label>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="px-4 py-2 border border-slate-200 rounded-lg w-full md:w-auto"
                                >
                                    <option value={2023}>2023</option>
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                </select>
                            </div>
                            <AnnualReport studentId={studentId} year={year} />
                        </div>
                    </TabsContent>

                    {/* ABA 4: Notificações */}
                    <TabsContent value="notificacoes">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <NotificationCenter studentId={studentId} />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default StudentBnccPage;
