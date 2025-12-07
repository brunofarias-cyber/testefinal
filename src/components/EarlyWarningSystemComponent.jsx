import React, { useState } from 'react';
import { AlertCircle, Bell, ChevronLeft, Shield, Target, Check, Clock, Activity } from 'lucide-react';
import { MOCK_EARLY_WARNINGS } from '../mockDataExtended';

const EarlyWarningSystemComponent = () => {
    const [warnings] = useState(MOCK_EARLY_WARNINGS);
    const [selectedWarning, setSelectedWarning] = useState(null);
    const [filterSeverity, setFilterSeverity] = useState('all');

    const getSeverityConfig = (severity) => {
        const configs = {
            critical: { 
                label: 'Crítico', 
                color: 'bg-red-100 text-red-700 border-red-300', 
                icon: AlertCircle, 
                bgCard: 'bg-red-50', 
                border: 'border-red-200' 
            },
            high: { 
                label: 'Alto', 
                color: 'bg-orange-100 text-orange-700 border-orange-300', 
                icon: AlertCircle, 
                bgCard: 'bg-orange-50', 
                border: 'border-orange-200' 
            },
            medium: { 
                label: 'Médio', 
                color: 'bg-yellow-100 text-yellow-700 border-yellow-300', 
                icon: Bell, 
                bgCard: 'bg-yellow-50', 
                border: 'border-yellow-200' 
            }
        };
        return configs[severity];
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
                            <div className="w-16 h-16 rounded-full bg-white/50 border-4 border-white shadow-lg flex items-center justify-center text-slate-800 font-bold text-2xl">
                                {selectedWarning.student.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedWarning.student.name}</h2>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${config.color} mt-2`}>
                                    <SeverityIcon size={14} className="inline mr-1" />
                                    Alerta {config.label}
                                </span>
                            </div>
                        </div>
                        <div className="text-right text-sm text-slate-600">
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
                            {selectedWarning.alerts.map((alert, idx) => {
                                const IconMap = {
                                    TrendingDown: Activity,
                                    UserX: AlertCircle,
                                    Clock: Clock,
                                    Activity: Activity,
                                    AlertCircle: AlertCircle,
                                    Bell: Bell
                                };
                                const AlertIcon = IconMap[alert.icon] || AlertCircle;
                                return (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <AlertIcon size={20} className="text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-800">{alert.message}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Detectado em: {new Date(alert.date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

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
                            <button className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                                Registrar Intervenção
                            </button>
                            <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition">
                                Contatar Responsáveis
                            </button>
                        </div>
                    </div>
                </div>
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
                                    <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-slate-800 font-bold text-lg">
                                        {warning.student.name.charAt(0)}
                                    </div>
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

export default EarlyWarningSystemComponent;
