import React, { useState, useMemo } from 'react';
import { AlertCircle, TrendingDown, Mail, Phone, CheckCircle } from 'lucide-react';

const MOCK_STUDENT_RISK = [
  {
    id: 101,
    name: 'Pedro Santos',
    riskScore: 78,
    status: 'critical',
    indicators: { engagement: -70, deliveries: -50, attendance: -25, communication: 0 },
    lastAlert: '2024-11-28',
    interventions: []
  },
  {
    id: 102,
    name: 'Maria Silva',
    riskScore: 45,
    status: 'warning',
    indicators: { engagement: -60, deliveries: -30, attendance: 0, communication: -40 },
    lastAlert: '2024-11-25',
    interventions: [{ date: '2024-11-26', action: 'email' }]
  },
  {
    id: 103,
    name: 'João Costa',
    riskScore: 15,
    status: 'ok',
    indicators: { engagement: 10, deliveries: 5, attendance: 2, communication: 0 },
    lastAlert: null,
    interventions: []
  }
];

const EarlyWarning = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [interventionLog, setInterventionLog] = useState({});

  const filteredStudents = useMemo(() => {
    if (filterStatus === 'all') return MOCK_STUDENT_RISK;
    return MOCK_STUDENT_RISK.filter(s => s.status === filterStatus);
  }, [filterStatus]);

  const getRiskColor = (score) => {
    if (score < 30) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'OK' };
    if (score < 60) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'ATENÇÃO' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'CRÍTICO' };
  };

  const recordIntervention = (studentId, action) => {
    setInterventionLog(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), { action, date: new Date().toLocaleDateString('pt-BR') }]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2 mb-2">
          <AlertCircle className="text-red-500" size={32} />
          Early Warning System
        </h2>
        <p className="text-slate-500">
          Identifique alunos em risco antes que seja tarde
        </p>
      </div>

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-xs font-bold text-red-400 uppercase">Crítico</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {MOCK_STUDENT_RISK.filter(s => s.status === 'critical').length}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <p className="text-xs font-bold text-yellow-400 uppercase">Atenção</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {MOCK_STUDENT_RISK.filter(s => s.status === 'warning').length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-xs font-bold text-green-400 uppercase">OK</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {MOCK_STUDENT_RISK.filter(s => s.status === 'ok').length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {['all', 'critical', 'warning', 'ok'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              filterStatus === status
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {status === 'all' ? 'Todos' : status === 'critical' ? '🔴 Crítico' : status === 'warning' ? '🟡 Atenção' : '🟢 OK'}
          </button>
        ))}
      </div>

      {/* Lista de Alunos */}
      <div className="space-y-4">
        {filteredStudents.map(student => {
          const colors = getRiskColor(student.riskScore);
          return (
            <div
              key={student.id}
              className={`${colors.bg} border-l-4 ${colors.border} rounded-2xl p-6 transition cursor-pointer hover:shadow-lg`}
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
                  <p className={`text-sm font-bold ${colors.text}`}>{colors.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">{student.riskScore}</p>
                  <p className="text-xs text-slate-400">Score de Risco</p>
                </div>
              </div>

              {/* Indicadores */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(student.indicators).map(([key, value]) => (
                  <div key={key} className="bg-white rounded-lg p-3">
                    <p className="text-xs text-slate-500 capitalize font-bold">{key.replace('_', ' ')}</p>
                    <p className={`text-lg font-bold ${value < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {value > 0 ? '+' : ''}{value}%
                    </p>
                  </div>
                ))}
              </div>

              {/* Ações */}
              {student.status !== 'ok' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => recordIntervention(student.id, 'email')}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-sm transition"
                  >
                    <Mail size={16} />
                    Enviar Email
                  </button>
                  <button
                    onClick={() => recordIntervention(student.id, 'call')}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-sm transition"
                  >
                    <Phone size={16} />
                    Chamar Responsável
                  </button>
                  <button
                    onClick={() => recordIntervention(student.id, 'meeting')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition"
                  >
                    <CheckCircle size={16} />
                    Registrar Intervenção
                  </button>
                </div>
              )}

              {/* Histórico de Intervenções */}
              {interventionLog[student.id]?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-600 mb-2">Intervenções realizadas:</p>
                  {interventionLog[student.id].map((intervention, idx) => (
                    <p key={idx} className="text-xs text-slate-600">
                      ✓ {intervention.action} em {intervention.date}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarlyWarning;
