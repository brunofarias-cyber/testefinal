import React, { useState } from 'react';
import { Users, Award, Check, Save, X } from 'lucide-react';

const InteractiveEvaluation = ({ selectedClass, attendanceData }) => {
    const [evaluations, setEvaluations] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Rubrica exemplo (mesma estrutura da rubrica criada)
    const rubricaCriteria = [
        {
            id: 1,
            name: 'Investigação Científica',
            weight: 40,
            levels: [
                { value: 1, label: 'Insuficiente', points: 1, description: 'Não demonstra compreensão' },
                { value: 2, label: 'Básico', points: 2, description: 'Compreensão parcial' },
                { value: 3, label: 'Proficiente', points: 3, description: 'Boa compreensão' },
                { value: 4, label: 'Avançado', points: 4, description: 'Excelente compreensão' }
            ]
        },
        {
            id: 2,
            name: 'Trabalho em Equipe',
            weight: 30,
            levels: [
                { value: 1, label: 'Insuficiente', points: 1, description: 'Pouca colaboração' },
                { value: 2, label: 'Básico', points: 2, description: 'Colaboração adequada' },
                { value: 3, label: 'Proficiente', points: 3, description: 'Boa colaboração' },
                { value: 4, label: 'Avançado', points: 4, description: 'Liderança e colaboração' }
            ]
        },
        {
            id: 3,
            name: 'Comunicação Oral',
            weight: 30,
            levels: [
                { value: 1, label: 'Insuficiente', points: 1, description: 'Comunicação confusa' },
                { value: 2, label: 'Básico', points: 2, description: 'Comunicação clara' },
                { value: 3, label: 'Proficiente', points: 3, description: 'Comunicação eficaz' },
                { value: 4, label: 'Avançado', points: 4, description: 'Comunicação excelente' }
            ]
        }
    ];

    const students = attendanceData[selectedClass] || [];

    const handleLevelSelect = (studentId, criterionId, levelValue) => {
        setEvaluations(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [criterionId]: levelValue
            }
        }));
    };

    const calculateFinalGrade = (studentId) => {
        const studentEval = evaluations[studentId] || {};
        let totalPoints = 0;
        let totalWeight = 0;

        rubricaCriteria.forEach(criterion => {
            const selectedLevel = studentEval[criterion.id];
            if (selectedLevel) {
                const weight = criterion.weight / 100;
                totalPoints += selectedLevel * weight * 2.5; // Converte para escala 0-10
                totalWeight += weight;
            }
        });

        return totalWeight > 0 ? (totalPoints / totalWeight).toFixed(1) : '-';
    };

    const saveEvaluations = () => {
        console.log('Salvando avaliações:', evaluations);
        alert('Avaliações salvas com sucesso!');
    };

    return (
        <div className="space-y-6">
            {/* Lista de Alunos */}
            <div className="grid grid-cols-1 gap-4">
                {students.map(student => {
                    const studentEval = evaluations[student.id] || {};
                    const isComplete = rubricaCriteria.every(c => studentEval[c.id]);
                    const finalGrade = calculateFinalGrade(student.id);

                    return (
                        <div key={student.id} className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                            {/* Header do Aluno */}
                            <div 
                                onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer hover:from-blue-100 hover:to-purple-100 transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{student.name}</h3>
                                            <p className="text-sm text-slate-600">
                                                {isComplete ? (
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        <Check size={14} />
                                                        Avaliação completa
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-600">
                                                        {Object.keys(studentEval).length}/{rubricaCriteria.length} critérios avaliados
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Nota Final</p>
                                        <p className={`text-3xl font-extrabold ${
                                            finalGrade === '-' ? 'text-slate-400' : 
                                            parseFloat(finalGrade) >= 7 ? 'text-green-600' : 
                                            parseFloat(finalGrade) >= 5 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {finalGrade}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Critérios de Avaliação (expandível) */}
                            {selectedStudent === student.id && (
                                <div className="p-6 space-y-6 bg-slate-50">
                                    {rubricaCriteria.map(criterion => (
                                        <div key={criterion.id} className="bg-white rounded-xl p-5 border-2 border-slate-200">
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-slate-900">{criterion.name}</h4>
                                                    <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                                                        Peso: {criterion.weight}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Níveis clicáveis */}
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                                {criterion.levels.map(level => {
                                                    const isSelected = studentEval[criterion.id] === level.value;
                                                    const colors = {
                                                        1: 'from-red-500 to-red-600',
                                                        2: 'from-yellow-500 to-yellow-600',
                                                        3: 'from-blue-500 to-blue-600',
                                                        4: 'from-green-500 to-green-600'
                                                    };

                                                    return (
                                                        <button
                                                            key={level.value}
                                                            onClick={() => handleLevelSelect(student.id, criterion.id, level.value)}
                                                            className={`relative p-4 rounded-xl border-3 transition-all transform ${
                                                                isSelected
                                                                    ? `bg-gradient-to-br ${colors[level.value]} text-white border-transparent shadow-lg scale-105`
                                                                    : 'bg-white border-slate-300 hover:border-slate-400 hover:shadow-md'
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                                                    <Check size={14} className="text-green-600" />
                                                                </div>
                                                            )}
                                                            <div className="text-center">
                                                                <p className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-purple-700'}`}>
                                                                    {level.label}
                                                                </p>
                                                                <p className={`text-2xl font-extrabold mb-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                                                    {level.points} pts
                                                                </p>
                                                                <p className={`text-xs ${isSelected ? 'text-white/90' : 'text-slate-600'}`}>
                                                                    {level.description}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Botão de Salvar */}
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setEvaluations({})}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition flex items-center gap-2"
                >
                    <X size={20} />
                    Limpar Avaliações
                </button>
                <button
                    onClick={saveEvaluations}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-teal-700 transition flex items-center gap-2 shadow-lg"
                >
                    <Save size={20} />
                    Salvar Todas as Avaliações
                </button>
            </div>
        </div>
    );
};

export default InteractiveEvaluation;
