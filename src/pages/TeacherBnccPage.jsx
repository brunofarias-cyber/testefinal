import React, { useState, useEffect } from 'react';
import { BarChart3, Target, FileText, Users, TrendingUp } from 'lucide-react';
import { CompleteDashboard } from '../components/BnccDashboard';
import { RubricEditor, RubricTemplate } from '../components/BnccRubric';
import { CoverageDashboard, ClassComparison, SuggestionsPanel, ShareRelatorio } from '../components/BnccAdvanced';

// Simple Tabs Component
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
        <div className="grid grid-cols-5 bg-white border border-slate-200 p-1 rounded-xl mb-6">
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

// Main Teacher Page
export const TeacherBnccPage = ({ projectId, classId }) => {
    const [project, setProject] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${projectId}`);
            const data = await res.json();
            setProject(data.data || data);

            // Buscar alunos do projeto
            const studentsRes = await fetch(`/api/projects/${projectId}/students`);
            const studentsData = await studentsRes.json();
            setStudents(studentsData.data || studentsData || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Carregando...</div>;
    if (!project) return <div className="p-8">Projeto não encontrado</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900">{project.title}</h1>
                    <p className="text-slate-600 mt-2">Análise BNCC e Gestão de Habilidades</p>
                </div>

                <Tabs defaultValue="dashboard">
                    <TabsList>
                        <TabsTrigger value="dashboard">
                            <BarChart3 size={16} />
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="rubricas">
                            <FileText size={16} />
                            Rubricas
                        </TabsTrigger>
                        <TabsTrigger value="students">
                            <Users size={16} />
                            Alunos
                        </TabsTrigger>
                        <TabsTrigger value="cobertura">
                            <Target size={16} />
                            Cobertura
                        </TabsTrigger>
                        <TabsTrigger value="compartilhar">
                            <TrendingUp size={16} />
                            Compartilhar
                        </TabsTrigger>
                    </TabsList>

                    {/* ABA 1: Dashboard */}
                    <TabsContent value="dashboard">
                        <CompleteDashboard projectId={projectId} />
                    </TabsContent>

                    {/* ABA 2: Rubricas */}
                    <TabsContent value="rubricas">
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-6">Customizar Rubricas</h2>
                                {project.skills?.length > 0 ? (
                                    project.skills.map(skill => (
                                        <details key={skill.code} className="mb-4 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                                            <summary className="font-bold text-slate-800">{skill.code} - {skill.description}</summary>
                                            <div className="mt-4">
                                                <RubricEditor projectId={projectId} skillCode={skill.code} />
                                            </div>
                                        </details>
                                    ))
                                ) : (
                                    <p className="text-slate-500">Nenhuma habilidade vinculada ao projeto ainda.</p>
                                )}
                            </div>
                            <RubricTemplate projectId={projectId} />
                        </div>
                    </TabsContent>

                    {/* ABA 3: Alunos */}
                    <TabsContent value="students">
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-bold text-slate-600">Aluno</th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-600">Avaliações</th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-600">Nível Médio</th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-600">Pontos</th>
                                            <th className="px-6 py-4 text-left font-bold text-slate-600">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {students.length > 0 ? (
                                            students.map(student => (
                                                <tr key={student.id} className="hover:bg-slate-50 transition">
                                                    <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                                                    <td className="px-6 py-4 text-slate-600">{student.evaluations || 0}</td>
                                                    <td className="px-6 py-4 text-slate-600">{student.avgLevel?.toFixed(1) || '-'}/5</td>
                                                    <td className="px-6 py-4 text-slate-600">{student.avgPoints?.toFixed(1) || '-'}/10</td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => setSelectedStudent(student)}
                                                            className="text-indigo-600 hover:text-indigo-700 font-bold text-sm"
                                                        >
                                                            Ver →
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                    Nenhum aluno cadastrado
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {selectedStudent && (
                            <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-slate-800">{selectedStudent.name}</h3>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="text-slate-400 hover:text-slate-600 text-2xl"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <SuggestionsPanel studentId={selectedStudent.id} projectId={projectId} />
                            </div>
                        )}
                    </TabsContent>

                    {/* ABA 4: Cobertura */}
                    <TabsContent value="cobertura">
                        <CoverageDashboard classId={classId} year={new Date().getFullYear()} />
                        <div className="mt-6">
                            <ClassComparison schoolId="1" year={new Date().getFullYear()} />
                        </div>
                    </TabsContent>

                    {/* ABA 5: Compartilhar */}
                    <TabsContent value="compartilhar">
                        <div className="grid grid-cols-2 gap-6">
                            {students.length > 0 ? (
                                students.map(student => (
                                    <ShareRelatorio key={student.id} projectId={projectId} studentId={student.id} />
                                ))
                            ) : (
                                <p className="col-span-2 text-center text-slate-500 p-8">
                                    Nenhum aluno para compartilhar relatórios
                                </p>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default TeacherBnccPage;
