import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useRealTimeAttendance } from '../hooks/useRealTime';
import { 
  Award, Upload, CheckSquare, Star, Bell, BarChart3,
  Download, CheckCircle, AlertCircle, Clock
} from 'lucide-react';

const StudentCentralHub = ({ studentId = 101 }) => {
  const [activeSection, setActiveSection] = useState('grades');
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);

  // Usar hook de presença em tempo real
  const { attendance: realtimeAttendance } = useRealTimeAttendance(studentId);

  // ===== NOTAS (GRADES) =====
  const [grades, setGrades] = useState([
    {
      id: 1,
      projectTitle: 'Horta Sustentável',
      grade: 8.5,
      feedback: 'Excelente trabalho! Documentação muito boa.',
      status: 'graded',
      submittedAt: '2024-11-15T18:30:00Z'
    },
    {
      id: 2,
      projectTitle: 'Robótica com Sucata',
      grade: 7.0,
      feedback: 'Bom desenvolvimento. Poderia melhorar na apresentação.',
      status: 'graded',
      submittedAt: '2024-10-20T14:45:00Z'
    },
    {
      id: 3,
      projectTitle: 'Projeto Água',
      grade: null,
      feedback: null,
      status: 'pending',
      submittedAt: '2024-11-30T10:00:00Z'
    }
  ]);

  // ===== ENTREGAS (SUBMISSIONS) =====
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      projectTitle: 'Horta Sustentável',
      fileName: 'horta_projeto.pdf',
      fileUrl: '/uploads/horta_projeto.pdf',
      fileSize: 2048000,
      submittedAt: '2024-11-15T18:30:00Z',
      status: 'submitted',
      feedback: null,
      grade: 8.5,
      comments: 'Inclui fotos do resultado final'
    },
    {
      id: 2,
      projectTitle: 'Robótica com Sucata',
      fileName: 'robotica_relatorio.docx',
      fileUrl: '/uploads/robotica_relatorio.docx',
      fileSize: 1536000,
      submittedAt: '2024-10-20T14:45:00Z',
      status: 'graded',
      feedback: 'Excelente relatório! Parabéns pela organização.',
      grade: 7.0,
      comments: 'Relatório técnico completo'
    }
  ]);

  // ===== PRESENÇA (ATTENDANCE) =====
  const [attendance, setAttendance] = useState([
    { id: 1, date: '2024-12-10', status: 'Presente', observations: 'Participação ativa' },
    { id: 2, date: '2024-12-09', status: 'Presente', observations: '' },
    { id: 3, date: '2024-12-06', status: 'Atraso', observations: 'Chegou 10 minutos atrasado' },
    { id: 4, date: '2024-12-05', status: 'Presente', observations: '' },
    { id: 5, date: '2024-12-04', status: 'Falta', observations: 'Ausência justificada' },
  ]);

  // ===== AVALIAÇÕES (RUBRICS) =====
  const [rubrics, setRubrics] = useState([
    {
      id: 1,
      projectTitle: 'Horta Sustentável',
      criteria: [
        { name: 'Planejamento', points: 23, maxPoints: 25, feedback: 'Excelente' },
        { name: 'Execução', points: 24, maxPoints: 25, feedback: 'Muito Bom' },
        { name: 'Documentação', points: 22, maxPoints: 25, feedback: 'Bom' },
        { name: 'Apresentação', points: 23, maxPoints: 25, feedback: 'Excelente' }
      ],
      totalPoints: 92,
      maxPoints: 100,
      status: 'graded',
      classification: 'Excelente',
      comments: 'Trabalho muito bem executado!'
    },
    {
      id: 2,
      projectTitle: 'Robótica com Sucata',
      criteria: [
        { name: 'Planejamento', points: 18, maxPoints: 25, feedback: 'Bom' },
        { name: 'Execução', points: 20, maxPoints: 25, feedback: 'Bom' },
        { name: 'Documentação', points: 15, maxPoints: 25, feedback: 'Satisfatório' },
        { name: 'Apresentação', points: 17, maxPoints: 25, feedback: 'Satisfatório' }
      ],
      totalPoints: 70,
      maxPoints: 100,
      status: 'graded',
      classification: 'Bom',
      comments: 'Bom trabalho, mas pode melhorar na documentação'
    }
  ]);

  // Socket.io
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || window.location.origin);
    newSocket.on('connect', () => {
      console.log('✅ Conectado ao servidor');
      newSocket.emit('join-student', studentId);
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [studentId]);

  // Combinar attendance real-time com dados locais
  useEffect(() => {
    if (realtimeAttendance && realtimeAttendance.length > 0) {
      setAttendance(prevAttendance => {
        // Merge com novos registros
        const attendanceMap = new Map(prevAttendance.map(a => [a.date, a]));
        realtimeAttendance.forEach(ra => {
          if (!attendanceMap.has(ra.date)) {
            attendanceMap.set(ra.date, ra);
          }
        });
        // Ordenar por data decrescente
        return Array.from(attendanceMap.values()).sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
      });
    }
  }, [realtimeAttendance]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const calculateStats = () => {
    return {
      grades: {
        total: grades.length,
        graded: grades.filter(g => g.status === 'graded').length,
        avg: grades.filter(g => g.grade).length > 0
          ? (grades.filter(g => g.grade).reduce((sum, g) => sum + g.grade, 0) / grades.filter(g => g.grade).length).toFixed(1)
          : 0
      },
      submissions: {
        total: submissions.length,
        graded: submissions.filter(s => s.status === 'graded').length,
        pending: submissions.filter(s => s.status === 'submitted').length
      },
      attendance: {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'Presente').length,
        absence: attendance.filter(a => a.status === 'Falta').length,
        late: attendance.filter(a => a.status === 'Atraso').length,
        percentage: Math.round((attendance.filter(a => a.status === 'Presente').length / attendance.length) * 100)
      },
      rubrics: {
        total: rubrics.length,
        graded: rubrics.filter(r => r.status === 'graded').length,
        avg: rubrics.filter(r => r.totalPoints).length > 0
          ? (rubrics.reduce((sum, r) => sum + r.totalPoints, 0) / rubrics.length).toFixed(1)
          : 0
      }
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
              <BarChart3 size={28} className="text-white" />
            </div>
            Meu Desempenho
          </h2>
          <p className="text-slate-500 text-base">Acompanhe notas, entregas, presença e avaliações em um único lugar</p>
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
            <p className="text-sm">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'grades', label: '📊 Notas', icon: Award },
              { id: 'submissions', label: '📤 Entregas', icon: Upload },
              { id: 'attendance', label: '✅ Presença', icon: CheckSquare },
              { id: 'rubrics', label: '⭐ Avaliações', icon: Star }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== NOTAS ===== */}
        {activeSection === 'grades' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total de Notas</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">{stats.grades.total}</p>
                <p className="text-sm text-slate-600">recebi</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avaliados</p>
                <p className="text-4xl font-bold text-green-600 mb-1">{stats.grades.graded}</p>
                <p className="text-sm text-slate-600">com nota final</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Média</p>
                <p className="text-4xl font-bold text-yellow-600 mb-1">{stats.grades.avg}</p>
                <p className="text-sm text-slate-600">de 10.0</p>
              </div>
            </div>

            {/* Grades List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">Minhas Notas</h3>
              {grades.map(grade => (
                <div key={grade.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{grade.projectTitle}</h4>
                      <p className="text-sm text-slate-600 mt-1">📅 {formatDate(grade.submittedAt)}</p>
                      {grade.feedback && <p className="text-sm text-slate-700 mt-2">💬 {grade.feedback}</p>}
                    </div>
                    <div className="text-right">
                      {grade.grade ? (
                        <>
                          <div className="text-3xl font-bold text-green-600">{grade.grade}</div>
                          <p className="text-xs text-slate-500">de 10.0</p>
                        </>
                      ) : (
                        <div className="text-sm font-bold text-blue-600 flex items-center gap-1">
                          <Clock size={16} />
                          Em Avaliação
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ENTREGAS ===== */}
        {activeSection === 'submissions' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total</p>
                <p className="text-4xl font-bold text-purple-600 mb-1">{stats.submissions.total}</p>
                <p className="text-sm text-slate-600">entregas</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Em Avaliação</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">{stats.submissions.pending}</p>
                <p className="text-sm text-slate-600">aguardando feedback</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avaliados</p>
                <p className="text-4xl font-bold text-green-600 mb-1">{stats.submissions.graded}</p>
                <p className="text-sm text-slate-600">com nota final</p>
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">Minhas Entregas</h3>
              {submissions.map(sub => (
                <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{sub.projectTitle}</h4>
                      <p className="text-sm text-slate-600 mt-1">📎 {sub.fileName} • {formatFileSize(sub.fileSize)}</p>
                      <p className="text-sm text-slate-600 mt-1">📅 Enviado: {formatDate(sub.submittedAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {sub.status === 'graded' ? '✅ Avaliado' : '⏳ Pendente'}
                    </span>
                  </div>

                  {sub.comments && (
                    <div className="bg-slate-50 p-3 rounded-lg mb-4">
                      <p className="text-xs font-bold text-slate-600 mb-1">💬 Seus comentários:</p>
                      <p className="text-sm text-slate-800">{sub.comments}</p>
                    </div>
                  )}

                  {sub.feedback && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
                      <p className="text-xs font-bold text-green-900 mb-1">📝 Feedback do Professor:</p>
                      <p className="text-sm text-green-900">{sub.feedback}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 flex items-center justify-center gap-2">
                      <Download size={16} />
                      Download
                    </button>
                    {sub.status === 'graded' && sub.feedback && (
                      <button className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 flex items-center justify-center gap-2">
                        <CheckCircle size={16} />
                        Ver Detalhes
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PRESENÇA ===== */}
        {activeSection === 'attendance' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total</p>
                <p className="text-4xl font-bold text-slate-600 mb-1">{stats.attendance.total}</p>
                <p className="text-sm text-slate-600">aulas</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Presentes</p>
                <p className="text-4xl font-bold text-green-600 mb-1">{stats.attendance.present}</p>
                <p className="text-sm text-slate-600">presença confirmada</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Frequência</p>
                <p className="text-4xl font-bold text-blue-600 mb-1">{stats.attendance.percentage}%</p>
                <p className="text-sm text-slate-600">de presença</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Faltas</p>
                <p className="text-4xl font-bold text-red-600 mb-1">{stats.attendance.absence}</p>
                <p className="text-sm text-slate-600">não compareci</p>
              </div>
            </div>

            {/* Attendance List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">Histórico de Presença</h3>
              {attendance.map(att => (
                <div key={att.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-800">📅 {new Date(att.date).toLocaleDateString('pt-BR')}</p>
                      {att.observations && <p className="text-sm text-slate-600 mt-1">📝 {att.observations}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      att.status === 'Presente' ? 'bg-green-100 text-green-700' :
                      att.status === 'Falta' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {att.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== AVALIAÇÕES (RÚBRICAS) ===== */}
        {activeSection === 'rubrics' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total de Projetos</p>
                <p className="text-4xl font-bold text-yellow-600 mb-1">{stats.rubrics.total}</p>
                <p className="text-sm text-slate-600">avaliados</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Avaliados</p>
                <p className="text-4xl font-bold text-green-600 mb-1">{stats.rubrics.graded}</p>
                <p className="text-sm text-slate-600">com nota final</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Média</p>
                <p className="text-4xl font-bold text-yellow-600 mb-1">{stats.rubrics.avg}%</p>
                <p className="text-sm text-slate-600">de desempenho</p>
              </div>
            </div>

            {/* Rubrics List */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">Minhas Avaliações</h3>
              {rubrics.map(rubric => (
                <div key={rubric.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-slate-800">{rubric.projectTitle}</h4>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-bold">
                      ⭐ {rubric.classification}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {rubric.criteria.map((criterion, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold text-slate-800">{criterion.name}</p>
                          <p className="text-sm font-bold text-slate-600">{criterion.points}/{criterion.maxPoints}</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 h-full rounded-full"
                            style={{ width: `${(criterion.points / criterion.maxPoints) * 100}%` }}
                          />
                        </div>
                        {criterion.feedback && (
                          <p className="text-xs text-slate-600 mt-1">💬 {criterion.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-bold text-yellow-900">Total de Pontos</p>
                      <p className="text-2xl font-bold text-yellow-700">{rubric.totalPoints}/{rubric.maxPoints}</p>
                    </div>
                    <p className="text-sm text-yellow-800">Percentual: {Math.round((rubric.totalPoints / rubric.maxPoints) * 100)}%</p>
                  </div>

                  {rubric.comments && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                      <p className="text-xs font-bold text-blue-900 mb-1">📝 Comentários do Professor:</p>
                      <p className="text-sm text-blue-900">{rubric.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCentralHub;
