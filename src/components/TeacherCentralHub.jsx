import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle, X, Save,
  Award, CheckSquare, Upload, Star, ClipboardList, BarChart3,
  Download, FileText, Bell, User
} from 'lucide-react';

const TeacherCentralHub = () => {
  const [activeSection, setActiveSection] = useState('activities');
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  // ===== ATIVIDADES STATE =====
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'Horta Sustentável',
      description: 'Criar uma horta sustentável em sua casa ou escola.',
      dueDate: '2024-12-15',
      maxPoints: 100,
      status: 'active',
      submissionCount: 8,
      totalStudents: 30,
    },
    {
      id: 2,
      title: 'Robótica com Sucata',
      description: 'Construir um robô simples usando materiais reciclados.',
      dueDate: '2024-12-20',
      maxPoints: 100,
      status: 'active',
      submissionCount: 5,
      totalStudents: 30,
    }
  ]);

  // ===== NOTAS STATE =====
  const [grades, setGrades] = useState([
    {
      id: 1,
      studentName: 'João Silva',
      rubricId: 1,
      projectTitle: 'Horta Sustentável',
      criteriaScores: [
        { criteriaId: 1, criteriaName: 'Planejamento', points: 23, maxPoints: 25 },
        { criteriaId: 2, criteriaName: 'Execução', points: 24, maxPoints: 25 },
        { criteriaId: 3, criteriaName: 'Documentação', points: 22, maxPoints: 25 },
        { criteriaId: 4, criteriaName: 'Apresentação', points: 23, maxPoints: 25 }
      ],
      totalPoints: 92,
      feedback: 'Excelente trabalho!'
    }
  ]);

  // ===== RÚBRICAS STATE =====
  const [rubrics, setRubrics] = useState([
    {
      id: 1,
      projectTitle: 'Horta Sustentável',
      criteria: [
        { id: 1, name: 'Planejamento', maxPoints: 25 },
        { id: 2, name: 'Execução', maxPoints: 25 },
        { id: 3, name: 'Documentação', maxPoints: 25 },
        { id: 4, name: 'Apresentação', maxPoints: 25 }
      ],
      totalPoints: 100
    }
  ]);

  // ===== PRESENÇA STATE =====
  const [attendance, setAttendance] = useState([
    { id: 1, studentName: 'João Silva', date: '2024-12-11', status: 'Presente' },
    { id: 2, studentName: 'Maria Santos', date: '2024-12-11', status: 'Presente' },
    { id: 3, studentName: 'Pedro Costa', date: '2024-12-11', status: 'Falta' }
  ]);

  // ===== ENTREGAS STATE =====
  const [submissions, setSubmissions] = useState([
    { id: 1, studentName: 'João Silva', projectTitle: 'Horta', fileName: 'horta.pdf', uploadedAt: '2024-11-15', status: 'pending' },
    { id: 2, studentName: 'Maria Santos', projectTitle: 'Robótica', fileName: 'robotica.docx', uploadedAt: '2024-11-14', status: 'graded' }
  ]);

  // Socket.io
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    newSocket.on('connect', () => console.log('✅ Conectado ao servidor'));
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ===== FUNÇÕES ATIVIDADES =====
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState({ title: '', description: '', dueDate: '', maxPoints: 100 });

  const handleAddActivity = () => {
    if (!activityForm.title || !activityForm.description || !activityForm.dueDate) {
      showNotification('Preencha todos os campos!', 'error');
      return;
    }
    const newActivity = {
      id: Math.max(...activities.map(a => a.id), 0) + 1,
      ...activityForm,
      status: 'active',
      submissionCount: 0,
      totalStudents: 30,
    };
    setActivities([newActivity, ...activities]);
    setActivityForm({ title: '', description: '', dueDate: '', maxPoints: 100 });
    setShowActivityForm(false);
    showNotification('✅ Atividade criada com sucesso!');
  };

  const handleDeleteActivity = (id) => {
    if (window.confirm('Tem certeza?')) {
      setActivities(activities.filter(a => a.id !== id));
      showNotification('🗑️ Atividade deletada');
    }
  };

  // ===== FUNÇÕES NOTAS =====
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    studentName: '',
    rubricId: '',
    criteriaScores: [],
    feedback: ''
  });

  const handleRubricSelect = (rubricId) => {
    const rubric = rubrics.find(r => r.id === parseInt(rubricId));
    if (rubric) {
      const newCriteriaScores = rubric.criteria.map(c => ({
        criteriaId: c.id,
        criteriaName: c.name,
        points: 0,
        maxPoints: c.maxPoints
      }));
      setGradeForm({
        ...gradeForm,
        rubricId: parseInt(rubricId),
        criteriaScores: newCriteriaScores
      });
    }
  };

  const handleCriteriaScoreChange = (criteriaId, points) => {
    const updatedScores = gradeForm.criteriaScores.map(s =>
      s.criteriaId === criteriaId ? { ...s, points: parseInt(points) } : s
    );
    setGradeForm({ ...gradeForm, criteriaScores: updatedScores });
  };

  const handleAddGrade = () => {
    if (!gradeForm.studentName || !gradeForm.rubricId || gradeForm.criteriaScores.some(s => s.points === 0)) {
      showNotification('Preencha todos os campos e avalie todos os critérios!', 'error');
      return;
    }

    const totalPoints = gradeForm.criteriaScores.reduce((sum, s) => sum + s.points, 0);
    const rubric = rubrics.find(r => r.id === gradeForm.rubricId);

    const newGrade = {
      id: Math.max(...grades.map(g => g.id), 0) + 1,
      studentName: gradeForm.studentName,
      rubricId: gradeForm.rubricId,
      projectTitle: rubric.projectTitle,
      criteriaScores: gradeForm.criteriaScores,
      totalPoints: totalPoints,
      feedback: gradeForm.feedback
    };
    setGrades([newGrade, ...grades]);
    setGradeForm({ studentName: '', rubricId: '', criteriaScores: [], feedback: '' });
    setShowGradeForm(false);
    showNotification('✅ Nota distribuída com sucesso!');
  };

  // ===== FUNÇÕES PRESENÇA =====
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({ studentName: '', status: 'Presente' });

  const handleAddAttendance = () => {
    if (!attendanceForm.studentName) {
      showNotification('Selecione um aluno!', 'error');
      return;
    }
    const newAttendance = {
      id: Math.max(...attendance.map(a => a.id), 0) + 1,
      ...attendanceForm,
      date: new Date().toISOString().split('T')[0]
    };
    setAttendance([newAttendance, ...attendance]);
    setAttendanceForm({ studentName: '', status: 'Presente' });
    setShowAttendanceForm(false);
    showNotification('✅ Presença registrada!');
  };

  // ===== FUNÇÕES RÚBRICAS =====
  const [showRubricForm, setShowRubricForm] = useState(false);
  const [rubricForm, setRubricForm] = useState({ projectTitle: '', criteria: [{ name: '', maxPoints: 0 }] });
  
  // ===== FUNÇÕES ENTREGAS =====
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionEvaluation, setSubmissionEvaluation] = useState({
    rubricId: '',
    criteriaScores: [],
    feedback: ''
  });

  const handleAddRubric = () => {
    if (!rubricForm.projectTitle || rubricForm.criteria.some(c => !c.name || !c.maxPoints)) {
      showNotification('Preencha todos os campos!', 'error');
      return;
    }
    const totalPoints = rubricForm.criteria.reduce((sum, c) => sum + parseInt(c.maxPoints), 0);
    if (totalPoints !== 100) {
      showNotification('Total de pontos deve ser 100!', 'error');
      return;
    }
    const newRubric = {
      id: Math.max(...rubrics.map(r => r.id), 0) + 1,
      ...rubricForm,
      totalPoints: 100
    };
    setRubrics([newRubric, ...rubrics]);
    setRubricForm({ projectTitle: '', criteria: [{ name: '', maxPoints: 0 }] });
    setShowRubricForm(false);
    showNotification('✅ Rúbrica criada com sucesso!');
  };

  const handleOpenEvaluationModal = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleRubricSelectForSubmission = (rubricId) => {
    const rubric = rubrics.find(r => r.id === parseInt(rubricId));
    if (rubric) {
      const newCriteriaScores = rubric.criteria.map(c => ({
        criteriaId: c.id,
        criteriaName: c.name,
        points: 0,
        maxPoints: c.maxPoints
      }));
      setSubmissionEvaluation({
        rubricId: parseInt(rubricId),
        criteriaScores: newCriteriaScores,
        feedback: ''
      });
    }
  };

  const handleCriteriaScoreChangeSubmission = (criteriaId, points) => {
    const updatedScores = submissionEvaluation.criteriaScores.map(s =>
      s.criteriaId === criteriaId ? { ...s, points: parseInt(points) } : s
    );
    setSubmissionEvaluation({ ...submissionEvaluation, criteriaScores: updatedScores });
  };

  const handleSubmitEvaluation = () => {
    if (!submissionEvaluation.rubricId || submissionEvaluation.criteriaScores.some(s => s.points === 0)) {
      showNotification('Selecione rúbrica e avalie todos os critérios!', 'error');
      return;
    }

    const updatedSubmissions = submissions.map(sub =>
      sub.id === selectedSubmission.id
        ? { ...sub, status: 'graded', evaluatedWith: submissionEvaluation }
        : sub
    );
    setSubmissions(updatedSubmissions);
    setShowSubmissionModal(false);
    setSelectedSubmission(null);
    setSubmissionEvaluation({ rubricId: '', criteriaScores: [], feedback: '' });
    showNotification('✅ Entrega avaliada com sucesso!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculatePercentage = (submitted, total) => {
    return total > 0 ? Math.round((submitted / total) * 100) : 0;
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
              <BarChart3 size={28} className="text-white" />
            </div>
            Central do Professor
          </h2>
          <p className="text-slate-500 text-base">Gerencie atividades, notas, rúbricas e presença em um único lugar</p>
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
              { id: 'activities', label: '📋 Atividades', icon: ClipboardList },
              { id: 'grades', label: '📊 Notas', icon: Award },
              { id: 'rubrics', label: '⭐ Rúbricas', icon: Star },
              { id: 'submissions', label: '📤 Entregas', icon: Upload },
              { id: 'attendance', label: '✅ Presença', icon: CheckSquare }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  activeSection === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== ATIVIDADES ===== */}
        {activeSection === 'activities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Gerenciar Atividades</h3>
              <button
                onClick={() => setShowActivityForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Atividade
              </button>
            </div>

            {showActivityForm && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h4 className="text-xl font-bold mb-4">➕ Criar Nova Atividade</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <textarea
                    placeholder="Descrição"
                    value={activityForm.description}
                    onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={activityForm.dueDate}
                      onChange={(e) => setActivityForm({ ...activityForm, dueDate: e.target.value })}
                      className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Pontos"
                      value={activityForm.maxPoints}
                      onChange={(e) => setActivityForm({ ...activityForm, maxPoints: parseInt(e.target.value) })}
                      className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddActivity}
                      className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Criar
                    </button>
                    <button
                      onClick={() => setShowActivityForm(false)}
                      className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-slate-800">{activity.title}</h4>
                      <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      activity.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {activity.status === 'active' ? '✅ Ativa' : '🔒 Fechada'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">📅 Data Entrega</p>
                      <p className="font-bold text-slate-800">{formatDate(activity.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">⭐ Pontos</p>
                      <p className="font-bold text-slate-800">{activity.maxPoints}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">📤 Entregas</p>
                      <p className="font-bold text-slate-800">{activity.submissionCount}/{activity.totalStudents}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200">
                      <Edit2 size={16} className="inline mr-2" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200"
                    >
                      <Trash2 size={16} className="inline mr-2" />
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== NOTAS ===== */}
        {activeSection === 'grades' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Distribuir Notas</h3>
              <button
                onClick={() => setShowGradeForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Nota
              </button>
            </div>

            {showGradeForm && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h4 className="text-xl font-bold mb-4">➕ Distribuir Nota por Rúbrica</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome do Aluno"
                    value={gradeForm.studentName}
                    onChange={(e) => setGradeForm({ ...gradeForm, studentName: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Selecionar Rúbrica</label>
                    <select
                      value={gradeForm.rubricId}
                      onChange={(e) => handleRubricSelect(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option value="">-- Escolha uma rúbrica --</option>
                      {rubrics.map(rubric => (
                        <option key={rubric.id} value={rubric.id}>
                          {rubric.projectTitle}
                        </option>
                      ))}
                    </select>
                  </div>

                  {gradeForm.criteriaScores.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      <p className="font-bold text-slate-800">Pontuação por Critério:</p>
                      {gradeForm.criteriaScores.map(criteria => (
                        <div key={criteria.criteriaId} className="flex items-end gap-3">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-700 mb-1">{criteria.criteriaName}</p>
                            <input
                              type="number"
                              min="0"
                              max={criteria.maxPoints}
                              value={criteria.points}
                              onChange={(e) => handleCriteriaScoreChange(criteria.criteriaId, e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <p className="text-sm text-slate-600 font-bold">/ {criteria.maxPoints}</p>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-slate-200 mt-3">
                        <p className="text-sm font-bold text-slate-800">
                          Total: <span className="text-green-600">{gradeForm.criteriaScores.reduce((sum, s) => sum + s.points, 0)}</span> / {gradeForm.criteriaScores.reduce((sum, s) => sum + s.maxPoints, 0)} pontos
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <textarea
                    placeholder="Feedback (opcional)"
                    value={gradeForm.feedback}
                    onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddGrade}
                      className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                    >
                      Distribuir
                    </button>
                    <button
                      onClick={() => setShowGradeForm(false)}
                      className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {grades.map(grade => (
                <div key={grade.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{grade.studentName}</h4>
                      <p className="text-sm text-slate-600 mt-1">📚 {grade.projectTitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{grade.totalPoints}%</div>
                      <p className="text-xs text-slate-500">de {grade.criteriaScores.reduce((sum, s) => sum + s.maxPoints, 0)} pontos</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
                    {grade.criteriaScores.map(criteria => (
                      <div key={criteria.criteriaId}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold text-slate-800">{criteria.criteriaName}</p>
                          <p className="text-sm font-bold text-slate-600">{criteria.points}/{criteria.maxPoints}</p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full"
                            style={{ width: `${(criteria.points / criteria.maxPoints) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {grade.feedback && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                      <p className="text-xs font-bold text-green-900 mb-1">📝 Feedback:</p>
                      <p className="text-sm text-green-900">{grade.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RÚBRICAS ===== */}
        {activeSection === 'rubrics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Criar Rúbricas</h3>
              <button
                onClick={() => setShowRubricForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Rúbrica
              </button>
            </div>

            {showRubricForm && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h4 className="text-xl font-bold mb-4">➕ Criar Rúbrica</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Projeto"
                    value={rubricForm.projectTitle}
                    onChange={(e) => setRubricForm({ ...rubricForm, projectTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                  />
                  <div className="space-y-3">
                    <p className="font-bold text-slate-800">Critérios (Total = 100 pontos):</p>
                    {rubricForm.criteria.map((c, idx) => (
                      <div key={idx} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Critério"
                          value={c.name}
                          onChange={(e) => {
                            const newCriteria = [...rubricForm.criteria];
                            newCriteria[idx].name = e.target.value;
                            setRubricForm({ ...rubricForm, criteria: newCriteria });
                          }}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                          type="number"
                          placeholder="Pontos"
                          value={c.maxPoints}
                          onChange={(e) => {
                            const newCriteria = [...rubricForm.criteria];
                            newCriteria[idx].maxPoints = parseInt(e.target.value);
                            setRubricForm({ ...rubricForm, criteria: newCriteria });
                          }}
                          className="w-24 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => setRubricForm({
                        ...rubricForm,
                        criteria: [...rubricForm.criteria, { name: '', maxPoints: 0 }]
                      })}
                      className="text-sm text-blue-600 hover:text-blue-700 font-bold"
                    >
                      + Adicionar Critério
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddRubric}
                      className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
                    >
                      Criar
                    </button>
                    <button
                      onClick={() => setShowRubricForm(false)}
                      className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {rubrics.map(rubric => (
                <div key={rubric.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h4 className="text-lg font-bold text-slate-800 mb-4">📋 {rubric.projectTitle}</h4>
                  <div className="space-y-3">
                    {rubric.criteria.map(criterion => (
                      <div key={criterion.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="font-semibold text-slate-800">{criterion.name}</span>
                        <span className="text-sm font-bold text-yellow-600">{criterion.maxPoints} pts</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">Total: <span className="font-bold text-slate-800">{rubric.totalPoints} pontos</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ENTREGAS ===== */}
        {activeSection === 'submissions' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">Avaliar Entregas</h3>
            
            {/* Modal de Avaliação */}
            {showSubmissionModal && selectedSubmission && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-2xl font-bold text-slate-800">🎯 Avaliar Entrega</h4>
                    <button onClick={() => setShowSubmissionModal(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-slate-600"><span className="font-bold">Aluno:</span> {selectedSubmission.studentName}</p>
                    <p className="text-sm text-slate-600"><span className="font-bold">Projeto:</span> {selectedSubmission.projectTitle}</p>
                    <p className="text-sm text-slate-600"><span className="font-bold">Arquivo:</span> {selectedSubmission.fileName}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Selecionar Rúbrica</label>
                      <select
                        value={submissionEvaluation.rubricId}
                        onChange={(e) => handleRubricSelectForSubmission(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      >
                        <option value="">-- Escolha uma rúbrica --</option>
                        {rubrics.map(rubric => (
                          <option key={rubric.id} value={rubric.id}>
                            {rubric.projectTitle}
                          </option>
                        ))}
                      </select>
                    </div>

                    {submissionEvaluation.criteriaScores.length > 0 && (
                      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                        <p className="font-bold text-slate-800">Pontuação por Critério:</p>
                        {submissionEvaluation.criteriaScores.map(criteria => (
                          <div key={criteria.criteriaId} className="flex items-end gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-700 mb-1">{criteria.criteriaName}</p>
                              <input
                                type="number"
                                min="0"
                                max={criteria.maxPoints}
                                value={criteria.points}
                                onChange={(e) => handleCriteriaScoreChangeSubmission(criteria.criteriaId, e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <p className="text-sm text-slate-600 font-bold">/ {criteria.maxPoints}</p>
                          </div>
                        ))}
                        <div className="pt-3 border-t border-slate-200 mt-3">
                          <p className="text-sm font-bold text-slate-800">
                            Total: <span className="text-green-600">{submissionEvaluation.criteriaScores.reduce((sum, s) => sum + s.points, 0)}</span> / {submissionEvaluation.criteriaScores.reduce((sum, s) => sum + s.maxPoints, 0)} pontos
                          </p>
                        </div>
                      </div>
                    )}

                    <textarea
                      placeholder="Feedback (opcional)"
                      value={submissionEvaluation.feedback}
                      onChange={(e) => setSubmissionEvaluation({ ...submissionEvaluation, feedback: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmitEvaluation}
                        className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
                      >
                        ✅ Salvar Avaliação
                      </button>
                      <button
                        onClick={() => setShowSubmissionModal(false)}
                        className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {submissions.map(sub => (
                <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{sub.studentName}</h4>
                      <p className="text-sm text-slate-600 mt-1">📚 {sub.projectTitle}</p>
                      <p className="text-sm text-slate-600 mt-1">📄 {sub.fileName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {sub.status === 'graded' ? '✅ Avaliado' : '⏳ Pendente'}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 flex items-center justify-center gap-2">
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => handleOpenEvaluationModal(sub)}
                      className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Avaliar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== PRESENÇA ===== */}
        {activeSection === 'attendance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-800">Registrar Presença</h3>
              <button
                onClick={() => setShowAttendanceForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus size={20} />
                Registrar
              </button>
            </div>

            {showAttendanceForm && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h4 className="text-xl font-bold mb-4">➕ Registrar Presença</h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome do Aluno"
                    value={attendanceForm.studentName}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, studentName: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  <select
                    value={attendanceForm.status}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="Presente">✅ Presente</option>
                    <option value="Falta">❌ Falta</option>
                    <option value="Atraso">⏰ Atraso</option>
                  </select>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddAttendance}
                      className="flex-1 px-4 py-2.5 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600"
                    >
                      Registrar
                    </button>
                    <button
                      onClick={() => setShowAttendanceForm(false)}
                      className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {attendance.map(att => (
                <div key={att.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{att.studentName}</h4>
                      <p className="text-sm text-slate-600 mt-1">📅 {formatDate(att.date)}</p>
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
      </div>
    </div>
  );
};

export default TeacherCentralHub;
