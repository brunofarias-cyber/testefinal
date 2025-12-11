import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle, X, Save } from 'lucide-react';

const MOCK_ACTIVITIES = [
    {
        id: 1,
        title: 'Horta Sustentável',
        description: 'Criar uma horta sustentável em sua casa ou escola. Documentar o processo com fotos.',
        dueDate: '2024-12-15',
        maxPoints: 100,
        status: 'active',
        submissionCount: 8,
        totalStudents: 30,
        createdAt: '2024-11-10T10:00:00Z'
    },
    {
        id: 2,
        title: 'Robótica com Sucata',
        description: 'Construir um robô simples usando materiais reciclados. Apresentar o funcionamento.',
        dueDate: '2024-12-20',
        maxPoints: 100,
        status: 'active',
        submissionCount: 5,
        totalStudents: 30,
        createdAt: '2024-11-05T14:30:00Z'
    },
    {
        id: 3,
        title: 'Projeto Água',
        description: 'Análise de qualidade da água. Coletar amostras e fazer testes.',
        dueDate: '2024-11-30',
        maxPoints: 100,
        status: 'closed',
        submissionCount: 28,
        totalStudents: 30,
        createdAt: '2024-10-20T09:15:00Z'
    }
];

const TeacherActivityManager = () => {
    const [activities, setActivities] = useState(MOCK_ACTIVITIES);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxPoints: 100
    });
    const [notification, setNotification] = useState(null);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.dueDate) {
            setNotification({
                type: 'error',
                message: 'Por favor, preencha todos os campos obrigatórios'
            });
            setTimeout(() => setNotification(null), 4000);
            return;
        }

        if (editingId) {
            // Atualizar atividade existente
            setActivities(prev =>
                prev.map(a =>
                    a.id === editingId
                        ? { ...a, ...formData }
                        : a
                )
            );
            setNotification({
                type: 'success',
                message: `✏️ Atividade "${formData.title}" atualizada com sucesso!`
            });
        } else {
            // Criar nova atividade
            const newActivity = {
                id: Math.max(...activities.map(a => a.id), 0) + 1,
                ...formData,
                status: 'active',
                submissionCount: 0,
                totalStudents: 30,
                createdAt: new Date().toISOString()
            };
            setActivities(prev => [newActivity, ...prev]);
            setNotification({
                type: 'success',
                message: `✅ Atividade "${formData.title}" criada com sucesso!`
            });
        }

        resetForm();
        setTimeout(() => setNotification(null), 5000);
    };

    const handleEdit = (activity) => {
        setEditingId(activity.id);
        setFormData({
            title: activity.title,
            description: activity.description,
            dueDate: activity.dueDate,
            maxPoints: activity.maxPoints
        });
        setShowForm(true);
    };

    const handleDelete = (id, title) => {
        if (window.confirm(`Tem certeza que deseja deletar a atividade "${title}"?`)) {
            setActivities(prev => prev.filter(a => a.id !== id));
            setNotification({
                type: 'success',
                message: `🗑️ Atividade deletada com sucesso!`
            });
            setTimeout(() => setNotification(null), 4000);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            dueDate: '',
            maxPoints: 100
        });
        setEditingId(null);
        setShowForm(false);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const calculatePercentage = (submitted, total) => {
        if (total === 0) return 0;
        return Math.round((submitted / total) * 100);
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    const activeCount = activities.filter(a => a.status === 'active').length;
    const closedCount = activities.filter(a => a.status === 'closed').length;
    const totalSubmissions = activities.reduce((sum, a) => sum + a.submissionCount, 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                                    <Plus size={28} className="text-white" />
                                </div>
                                Gerenciar Atividades
                            </h2>
                            <p className="text-slate-500 text-base">Crie e configure as atividades que seus alunos devem enviar</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Nova Atividade
                        </button>
                    </div>
                </div>
            </div>

            {/* Notificações */}
            {notification && (
                <div className="fixed top-6 right-6 max-w-md z-50 animate-bounce">
                    <div className={`rounded-2xl shadow-xl p-4 flex items-start gap-4 ${
                        notification.type === 'error'
                            ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    }`}>
                        <div className="flex-shrink-0">
                            {notification.type === 'error' ? (
                                <AlertCircle size={24} />
                            ) : (
                                <CheckCircle size={24} />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
                            <div className="p-2.5 bg-blue-100 rounded-lg">
                                <Plus size={20} className="text-blue-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-blue-600 mb-2">{activities.length}</p>
                        <p className="text-xs text-slate-500">atividades criadas</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ativas</p>
                            <div className="p-2.5 bg-green-100 rounded-lg">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-green-600 mb-2">{activeCount}</p>
                        <p className="text-xs text-slate-500">aceitando envios</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fechadas</p>
                            <div className="p-2.5 bg-slate-100 rounded-lg">
                                <Clock size={20} className="text-slate-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-slate-600 mb-2">{closedCount}</p>
                        <p className="text-xs text-slate-500">prazo encerrado</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entregas</p>
                            <div className="p-2.5 bg-purple-100 rounded-lg">
                                <Plus size={20} className="text-purple-600" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-purple-600 mb-2">{totalSubmissions}</p>
                        <p className="text-xs text-slate-500">já recebidas</p>
                    </div>
                </div>

                {/* Modal de Formulário */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header Modal */}
                            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 flex justify-between items-center border-b border-slate-200">
                                <h3 className="text-2xl font-bold">
                                    {editingId ? '✏️ Editar Atividade' : '➕ Criar Nova Atividade'}
                                </h3>
                                <button
                                    onClick={resetForm}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmitForm} className="p-8 space-y-6">
                                {/* Título */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Título da Atividade *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleFormChange}
                                        placeholder="Ex: Horta Sustentável"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                    />
                                </div>

                                {/* Descrição */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Descrição *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        placeholder="Descreva o que os alunos precisam fazer..."
                                        rows="5"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Data de Entrega */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Data de Entrega *
                                        </label>
                                        <input
                                            type="date"
                                            name="dueDate"
                                            value={formData.dueDate}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        />
                                    </div>

                                    {/* Pontos Máximos */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Pontos Máximos
                                        </label>
                                        <input
                                            type="number"
                                            name="maxPoints"
                                            value={formData.maxPoints}
                                            onChange={handleFormChange}
                                            min="0"
                                            max="1000"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                        />
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        {editingId ? 'Atualizar' : 'Criar'} Atividade
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Lista de Atividades */}
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-slate-100 rounded-full">
                                    <Plus size={32} className="text-slate-400" />
                                </div>
                            </div>
                            <p className="text-slate-600 font-bold mb-1">Nenhuma atividade criada</p>
                            <p className="text-sm text-slate-500">Clique em "Nova Atividade" para começar</p>
                        </div>
                    ) : (
                        activities.map((activity) => {
                            const percentageSubmitted = calculatePercentage(activity.submissionCount, activity.totalStudents);
                            const overdue = isOverdue(activity.dueDate);

                            return (
                                <div
                                    key={activity.id}
                                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2.5 rounded-lg ${
                                                    activity.status === 'active'
                                                        ? 'bg-green-100'
                                                        : 'bg-slate-100'
                                                }`}>
                                                    <Plus size={20} className={activity.status === 'active' ? 'text-green-600' : 'text-slate-600'} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800">
                                                        {activity.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right flex-shrink-0 ml-4">
                                            <div className={`inline-block px-4 py-2 rounded-xl font-bold text-sm text-center mb-3 ${
                                                activity.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {activity.status === 'active' ? '✅ Ativa' : '🔒 Fechada'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-600 mb-1">📅 Data de Entrega</p>
                                            <p className={`font-bold ${overdue && activity.status === 'active' ? 'text-red-600' : 'text-slate-800'}`}>
                                                {formatDate(activity.dueDate)}
                                                {overdue && activity.status === 'active' && ' ⚠️ Vencido'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-600 mb-1">⭐ Pontos Máximos</p>
                                            <p className="font-bold text-slate-800">{activity.maxPoints} pontos</p>
                                        </div>
                                    </div>

                                    {/* Progresso de Envios */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-bold text-slate-700">
                                                📤 Entregas Recebidas
                                            </p>
                                            <p className="text-sm font-bold text-slate-600">
                                                {activity.submissionCount}/{activity.totalStudents} ({percentageSubmitted}%)
                                            </p>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-cyan-600 h-full rounded-full transition-all duration-300"
                                                style={{ width: `${percentageSubmitted}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Ações */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleEdit(activity)}
                                            className="flex-1 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Edit2 size={16} />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activity.id, activity.title)}
                                            className="flex-1 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Trash2 size={16} />
                                            Deletar
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherActivityManager;
