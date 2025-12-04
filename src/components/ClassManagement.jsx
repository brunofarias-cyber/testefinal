import React, { useState } from 'react';
import { Plus, Users, X, ChevronLeft, School } from 'lucide-react';

const MOCK_TEACHER_CLASSES = [
    {
        id: 1, name: "1º Ano A", students: 32, students_list: [
            { id: 101, name: "João Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao" },
            { id: 102, name: "Maria Silva", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
        ]
    },
    { id: 2, name: "2º Ano B", students: 28, students_list: [] },
    { id: 3, name: "3º Ano C", students: 30, students_list: [] },
];

const ClassManagement = () => {
    const [classes, setClasses] = useState(MOCK_TEACHER_CLASSES);
    const [selectedClass, setSelectedClass] = useState(null);
    const [showAddClass, setShowAddClass] = useState(false);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentEmail, setNewStudentEmail] = useState("");

    const handleAddClass = () => {
        if (newClassName.trim()) {
            setClasses([...classes, {
                id: classes.length + 1,
                name: newClassName,
                students: 0,
                students_list: []
            }]);
            setNewClassName("");
            setShowAddClass(false);
        }
    };

    const handleAddStudent = () => {
        if (selectedClass && newStudentName.trim()) {
            const newStudent = {
                id: Math.floor(Math.random() * 10000),
                name: newStudentName,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudentName}`
            };
            setClasses(classes.map(cls =>
                cls.id === selectedClass.id
                    ? { ...cls, students_list: [...cls.students_list, newStudent], students: cls.students + 1 }
                    : cls
            ));
            setNewStudentName("");
            setNewStudentEmail("");
            setShowAddStudent(false);
            // Update selected class to reflect new student
            setSelectedClass(prev => ({
                ...prev,
                students_list: [...prev.students_list, newStudent],
                students: prev.students + 1
            }));
        }
    };

    if (selectedClass) {
        const currentClass = classes.find(c => c.id === selectedClass.id);
        return (
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => setSelectedClass(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition"
                >
                    <ChevronLeft size={20} /> Voltar para Turmas
                </button>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">{currentClass.name}</h2>
                    <button
                        onClick={() => setShowAddStudent(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition"
                    >
                        <Plus size={18} /> Adicionar Aluno
                    </button>
                </div>

                {showAddStudent && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-800">Adicionar Aluno</h3>
                                <button onClick={() => setShowAddStudent(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Nome</label>
                                    <input
                                        type="text"
                                        value={newStudentName}
                                        onChange={(e) => setNewStudentName(e.target.value)}
                                        placeholder="Nome completo"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={newStudentEmail}
                                        onChange={(e) => setNewStudentEmail(e.target.value)}
                                        placeholder="email@exemplo.com"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setShowAddStudent(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-bold transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddStudent}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentClass.students_list.map(student => (
                        <div key={student.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
                            <img src={student.avatar} className="w-12 h-12 rounded-full" alt={student.name} />
                            <div>
                                <p className="font-bold text-slate-800">{student.name}</p>
                                <p className="text-xs text-slate-500">ID: {student.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Gerenciar Turmas</h2>
                    <p className="text-slate-500">Crie e organize suas turmas</p>
                </div>
                <button
                    onClick={() => setShowAddClass(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition"
                >
                    <Plus size={18} /> Nova Turma
                </button>
            </div>

            {showAddClass && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Nova Turma</h3>
                        <input
                            type="text"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            placeholder="Ex: 1º Ano A"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowAddClass(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-bold transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddClass}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div
                        key={cls.id}
                        onClick={() => setSelectedClass(cls)}
                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <School size={24} className="text-indigo-600" />
                            <h3 className="text-xl font-bold text-slate-800">{cls.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 mb-4">
                            <Users size={18} />
                            <span className="font-bold">{cls.students} alunos</span>
                        </div>
                        <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-100 transition">
                            Gerenciar →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassManagement;
