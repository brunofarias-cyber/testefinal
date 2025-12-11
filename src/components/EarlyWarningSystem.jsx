import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  AlertCircle,
  Shield,
  Target,
  Bell,
  Activity,
  TrendingDown,
  UserX,
  Clock,
  Heart,
  Eye,
  MessageSquare,
  X,
  Check,
  Save,
} from "lucide-react";

const MOCK_EARLY_WARNINGS = [
    {
        id: 'ew1',
        student: { id: 103, name: "Pedro Santos", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro" },
        severity: 'critical',
        alerts: [
            { type: 'grade_drop', message: 'Nota caiu de 8.0 para 5.0', icon: 'TrendingDown', date: '2023-12-05' },
            { type: 'absence', message: '4 faltas no último mês', icon: 'UserX', date: '2023-12-04' },
            { type: 'deadline', message: '3 entregas atrasadas', icon: 'Clock', date: '2023-12-03' }
        ],
        recommendations: [
            { action: 'Contatar responsáveis', priority: 'high', icon: 'Phone' },
            { action: 'Oferecer reforço escolar', priority: 'high', icon: 'Book' },
            { action: 'Reunião individual', priority: 'medium', icon: 'Users' }
        ],
        lastUpdate: '2023-12-05T14:30:00'
    },
];

const EarlyWarningSystem = () => {
    const [warnings] = useState(MOCK_EARLY_WARNINGS);
    const [selectedWarning, setSelectedWarning] = useState(null);
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [showInterventionModal, setShowInterventionModal] = useState(false);
    const [interventions, setInterventions] = useState([]);
    const [interventionForm, setInterventionForm] = useState({
        tipo: 'conversa',
        descricao: '',
        responsaveis: [],
        dataComparecimento: ''
    });

    // Carregar intervenções do localStorage ao montar
    useEffect(() => {
        const savedInterventions = localStorage.getItem('nexo_interventions');
        if (savedInterventions) {
            try {
                setInterventions(JSON.parse(savedInterventions));
            } catch (e) {
                console.error('Erro ao carregar intervenções:', e);
            }
        }
    }, []);

    // Salvar intervenções no localStorage quando mudam
    useEffect(() => {
        localStorage.setItem('nexo_interventions', JSON.stringify(interventions));
    }, [interventions]);

    const getSeverityConfig = (severity) => {
        const configs = {
            critical: { label: 'Crítico', color: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle, bgCard: 'bg-red-50', border: 'border-red-200' },
            high: { label: 'Alto', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: AlertCircle, bgCard: 'bg-orange-50', border: 'border-orange-200' },
            medium: { label: 'Médio', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Bell, bgCard: 'bg-yellow-50', border: 'border-yellow-200' }
        };
        return configs[severity];
    };

    // Função para registrar intervenção
    const handleSaveIntervention = () => {
        if (!interventionForm.descricao.trim()) {
            alert('Por favor, descreva a intervenção realizada');
            return;
        }

        const novaIntervencao = {
            id: Date.now(),
            alunoId: selectedWarning.student.id,
            alunoNome: selectedWarning.student.name,
            tipo: interventionForm.tipo,
            descricao: interventionForm.descricao,
            responsaveis: interventionForm.responsaveis || ['Professor'],
            dataIntervencao: new Date().toLocaleDateString('pt-BR'),
            dataComparecimento: interventionForm.dataComparecimento,
            status: 'registrado'
        };

        setInterventions([...interventions, novaIntervencao]);
        setShowInterventionModal(false);
        setInterventionForm({
            tipo: 'conversa',
            descricao: '',
            responsaveis: [],
            dataComparecimento: ''
        });

        // Mostrar feedback visual
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg z-50 animate-pulse';
        feedbackDiv.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Intervenção registrada com sucesso!';
        document.body.appendChild(feedbackDiv);
        
        setTimeout(() => feedbackDiv.remove(), 3000);
    };

    const filteredWarnings = filterSeverity === 'all'
        ? warnings
        : warnings.filter(w => w.severity === filterSeverity);

    if (selectedWarning) {
        const config = getSeverityConfig(selectedWarning.severity);
        const SeverityIcon = config.icon;

        return (
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => setSelectedWarning(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
                >
                    <ChevronLeft size={20} /> Voltar para Alertas
                </button>

                <div className={`${config.bgCard} rounded-3xl border-2 ${config.border} p-8 mb-8`}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <img src={selectedWarning.student.avatar} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedWarning.student.name}</h2>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${config.color} mt-2`}>
                                    <SeverityIcon size={14} className="inline mr-1" />
                                    Alerta {config.label}
                                </span>
                            </div>
                        </div>
                        <div className="text-right text-sm text-slate-500">
                            Atualizado: {new Date(selectedWarning.lastUpdate).toLocaleString('pt-BR')}
                        </div>
                    </div>

                    {/* Alertas Detectados */}
                    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <Shield size={20} className="text-indigo-600" />
                            Alertas Detectados
                        </h3>
                        <div className="space-y-3">
                            {selectedWarning.alerts.map((alert, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <AlertCircle size={20} className="text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-800">{alert.message}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Detectado em: {new Date(alert.date).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Intervenções Registradas */}
                    {interventions.filter(i => i.alunoId === selectedWarning.student.id).length > 0 && (
                        <div className="bg-green-50 rounded-2xl p-6 mb-6 shadow-sm border-2 border-green-200">
                            <h3 className="font-bold text-lg text-green-800 mb-4 flex items-center gap-2">
                                <Check size={20} className="text-green-600" />
                                Intervenções Registradas
                            </h3>
                            <div className="space-y-3">
                                {interventions.filter(i => i.alunoId === selectedWarning.student.id).map((intervention) => (
                                    <div key={intervention.id} className="bg-white p-4 rounded-xl border border-green-200">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-bold text-slate-800">{intervention.tipo.replace('_', ' ').toUpperCase()}</p>
                                                <p className="text-xs text-slate-500">Registrada em: {intervention.dataIntervencao}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                                                ✓ {intervention.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-700 mt-2">{intervention.descricao}</p>
                                        <p className="text-xs text-slate-600 mt-2">
                                            Responsáveis: <strong>{intervention.responsaveis.join(', ')}</strong>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Ações Recomendadas */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                            <Target size={20} className="text-indigo-600" />
                            Ações Recomendadas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedWarning.recommendations.map((rec, idx) => (
                                <button key={idx} className={`p-4 border-2 rounded-xl hover:shadow-md transition text-left ${
                                    rec.priority === 'high' ? 'border-red-200 hover:bg-red-50' :
                                    rec.priority === 'medium' ? 'border-yellow-200 hover:bg-yellow-50' :
                                    'border-blue-200 hover:bg-blue-50'
                                }`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                                        </span>
                                    </div>
                                    <p className="font-bold text-slate-800">{rec.action}</p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button 
                                onClick={() => setShowInterventionModal(true)}
                                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Registrar Intervenção
                            </button>
                            <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition">
                                Contatar Responsáveis
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal de Registrar Intervenção */}
                {showInterventionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 flex items-center justify-between sticky top-0">
                                <div>
                                    <h2 className="text-2xl font-bold">Registrar Intervenção</h2>
                                    <p className="text-indigo-100 mt-1">Aluno: <strong>{selectedWarning.student.name}</strong></p>
                                </div>
                                <button 
                                    onClick={() => setShowInterventionModal(false)}
                                    className="p-2 hover:bg-indigo-500 rounded-lg transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-6 space-y-5">
                                {/* Tipo de Intervenção */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Intervenção</label>
                                    <select
                                        value={interventionForm.tipo}
                                        onChange={(e) => setInterventionForm({...interventionForm, tipo: e.target.value})}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    >
                                        <option value="conversa">Conversa com o aluno</option>
                                        <option value="contato_responsaveis">Contato com responsáveis</option>
                                        <option value="reforco">Oferecimento de reforço</option>
                                        <option value="reuniao">Reunião individual</option>
                                        <option value="encaminhamento">Encaminhamento especializado</option>
                                        <option value="acompanhamento">Acompanhamento pedagógico</option>
                                    </select>
                                </div>

                                {/* Descrição da Intervenção */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Descrição da Intervenção</label>
                                    <textarea
                                        value={interventionForm.descricao}
                                        onChange={(e) => setInterventionForm({...interventionForm, descricao: e.target.value})}
                                        placeholder="Descreva detalhadamente a intervenção realizada, o que foi conversado, os resultados esperados, etc."
                                        rows="5"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                    />
                                </div>

                                {/* Responsáveis Envolvidos */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Responsáveis Envolvidos</label>
                                    <div className="space-y-2">
                                        {['Professor', 'Coordenador', 'Psicólogo', 'Responsável'].map((resp) => (
                                            <label key={resp} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={interventionForm.responsaveis.includes(resp)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setInterventionForm({
                                                                ...interventionForm,
                                                                responsaveis: [...interventionForm.responsaveis, resp]
                                                            });
                                                        } else {
                                                            setInterventionForm({
                                                                ...interventionForm,
                                                                responsaveis: interventionForm.responsaveis.filter(r => r !== resp)
                                                            });
                                                        }
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2"
                                                />
                                                <span className="font-medium text-slate-700">{resp}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Data de Comparecimento (opcional) */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Data de Comparecimento (se aplicável)</label>
                                    <input
                                        type="date"
                                        value={interventionForm.dataComparecimento}
                                        onChange={(e) => setInterventionForm({...interventionForm, dataComparecimento: e.target.value})}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>

                            {/* Footer - Botões */}
                            <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3 sticky bottom-0">
                                <button
                                    onClick={() => setShowInterventionModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveIntervention}
                                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                                >
                                    <Check size={18} />
                                    Registrar Intervenção
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Early Warning System</h2>
                    <p className="text-slate-500">Detecção precoce de alunos em risco acadêmico</p>
                </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <AlertCircle size={24} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Críticos</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {warnings.filter(w => w.severity === 'critical').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                            <Bell size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Altos</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {warnings.filter(w => w.severity === 'high').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <Activity size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Médios</p>
                            <p className="text-2xl font-bold text-slate-800">
                                {warnings.filter(w => w.severity === 'medium').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilterSeverity('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                        filterSeverity === 'all'
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    Todos ({warnings.length})
                </button>
                <button
                    onClick={() => setFilterSeverity('critical')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                        filterSeverity === 'critical'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    🔴 Críticos
                </button>
                <button
                    onClick={() => setFilterSeverity('high')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                        filterSeverity === 'high'
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    🟠 Altos
                </button>
            </div>

            {/* Lista de Alertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWarnings.map(warning => {
                    const config = getSeverityConfig(warning.severity);
                    const SeverityIcon = config.icon;

                    return (
                        <div
                            key={warning.id}
                            onClick={() => setSelectedWarning(warning)}
                            className={`${config.bgCard} rounded-2xl border-2 ${config.border} p-6 hover:shadow-lg transition cursor-pointer group`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={warning.student.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow" />
                                    <div>
                                        <h3 className="font-bold text-slate-800">{warning.student.name}</h3>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold border ${config.color} mt-1`}>
                                            <SeverityIcon size={12} className="inline mr-1" />
                                            {config.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {warning.alerts.slice(0, 2).map((alert, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                        <span>{alert.message}</span>
                                    </div>
                                ))}
                                {warning.alerts.length > 2 && (
                                    <p className="text-xs text-slate-400 font-medium">
                                        +{warning.alerts.length - 2} outros alertas
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <p className="text-xs text-slate-500">
                                    {warning.recommendations.length} ações recomendadas
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EarlyWarningSystem;
