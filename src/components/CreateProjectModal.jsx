import React, { useState } from 'react';
import { X } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose, onSave, classes = [] }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "Multidisciplinar",
        classId: classes[0]?.id || 1,
        duration: "4",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.title.trim()) {
            alert("Digite o título do projeto");
            return;
        }

        const newProject = {
            id: Math.floor(Math.random() * 10000),
            title: formData.title,
            subject: formData.subject,
            status: "Planejamento",
            progress: 0,
            students: 0,
            nextDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            deadlineLabel: "Planejamento",
            theme: "blue",
            teacher: "Ana Silva",
            delayed: false,
            tasks: [],
            description: formData.description,
            classId: formData.classId,
            duration: `${formData.duration} semanas`,
        };

        onSave(newProject);
        setFormData({ title: "", description: "", subject: "Multidisciplinar", classId: classes[0]?.id || 1, duration: "4" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800">Novo Projeto</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Título do Projeto *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Horta Sustentável"
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descreva o projeto..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Disciplina</label>
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option>Ciências</option>
                                <option>Linguagens</option>
                                <option>Exatas</option>
                                <option>Artes</option>
                                <option>Multidisciplinar</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Duração</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="1"
                                    max="16"
                                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <span className="text-sm font-bold text-slate-600">sem.</span>
                            </div>
                        </div>
                    </div>

                    {classes.length > 0 && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Turma</label>
                            <select
                                name="classId"
                                value={formData.classId}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
                    >
                        Criar Projeto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
