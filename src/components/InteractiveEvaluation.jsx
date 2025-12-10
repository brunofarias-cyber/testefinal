import React, { useState, useEffect } from 'react';
import { Users, Award, Check, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import { RubricaEvaluator } from './rubricas';

const InteractiveEvaluation = ({ selectedClass, attendanceData }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [rubrica, setRubrica] = useState(null);
    const [loading, setLoading] = useState(true);

    const students = attendanceData[selectedClass] || [];

    // Carregar projetos
    useEffect(() => {
        fetchProjects();
    }, []);

    // Carregar rubrica quando projeto muda
    useEffect(() => {
        if (selectedProjectId) {
            fetchRubrica(selectedProjectId);
        }
    }, [selectedProjectId]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('/api/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setProjects(data);
                    setSelectedProjectId(data[0].id);
                } else {
                    // Mock projects se não houver dados
                    const mockProjects = [
                        { id: 1, name: 'Projeto Horta Sustentável' },
                        { id: 2, name: 'Projeto Robótica' }
                    ];
                    setProjects(mockProjects);
                    setSelectedProjectId(1);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            const mockProjects = [
                { id: 1, name: 'Projeto Horta Sustentável' },
                { id: 2, name: 'Projeto Robótica' }
            ];
            setProjects(mockProjects);
            setSelectedProjectId(1);
        } finally {
            setLoading(false);
        }
    };

    const fetchRubrica = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/rubricas/projeto/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setRubrica(data.data || data);
            }
        } catch (error) {
            console.error('Erro ao carregar rubrica:', error);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Carregando rubricas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Seletor de Projeto */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">Projeto para Avaliação</label>
                <select
                    value={selectedProjectId || ''}
                    onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg font-bold"
                >
                    {projects.map(project => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Aviso */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                    <strong>Avaliação Individual:</strong> Use a rubrica criada para avaliar cada aluno. 
                    Clique no aluno abaixo para expandir e avaliar usando a mesma rubrica da avaliação de equipe.
                </p>
            </div>

            {/* Lista de Alunos com RubricaEvaluator */}
            <div className="space-y-4">
                {students.map(student => (
                    <div key={student.id} className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                        {/* Header do Aluno */}
                        <div 
                            onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                            className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer hover:from-blue-100 hover:to-purple-100 transition flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{student.name}</h3>
                                    <p className="text-sm text-slate-600">Clique para avaliar</p>
                                </div>
                            </div>
                            <div>
                                {selectedStudent === student.id ? (
                                    <ChevronDown size={24} className="text-slate-600" />
                                ) : (
                                    <ChevronRight size={24} className="text-slate-600" />
                                )}
                            </div>
                        </div>

                        {/* Avaliador de Rubrica (expandível) */}
                        {selectedStudent === student.id && selectedProjectId && (
                            <div className="p-6 bg-slate-50">
                                <div className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-lg p-4">
                                    <p className="text-sm font-bold text-blue-900 mb-1">
                                        Avaliando: {student.name}
                                    </p>
                                    <p className="text-xs text-blue-800">
                                        Use a rubrica abaixo para atribuir pontos clicando nos níveis de desempenho.
                                    </p>
                                </div>
                                <RubricaEvaluator 
                                    projectId={selectedProjectId}
                                    teamId={student.id} // Usando ID do aluno como "equipe individual"
                                    teamName={student.name}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InteractiveEvaluation;
