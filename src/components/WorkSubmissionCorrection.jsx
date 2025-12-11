import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  Download,
  Send,
  Filter,
  Search,
  Star,
  Eye,
  MessageSquare,
  Save,
  ChevronDown,
  X,
  Upload,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';

const WorkSubmissionCorrection = ({ onNavigateTo }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('pending'); // pending, graded, all
  const [searchTerm, setSearchTerm] = useState('');
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [sortBy, setSortBy] = useState('date-newest');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Mock data para projetos
  const MOCK_PROJECTS = [
    { id: 1, title: 'Horta Sustentável' },
    { id: 2, title: 'Robótica com Sucata' },
    { id: 3, title: 'Jornal Digital' },
    { id: 4, title: 'Teatro Shakespeariano' }
  ];

  // Mock data para submissões
  const MOCK_SUBMISSIONS = [
    {
      id: 1,
      projectId: 1,
      projectTitle: 'Horta Sustentável',
      studentId: 101,
      studentName: 'João Silva',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
      submittedAt: '2024-01-10',
      fileUrl: 'horta_relatorio.pdf',
      comment: 'Relatório completo com fotos',
      status: 'pending',
      grade: null,
      feedback: null,
      gradedAt: null
    },
    {
      id: 2,
      projectId: 1,
      projectTitle: 'Horta Sustentável',
      studentId: 102,
      studentName: 'Maria Oliveira',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      submittedAt: '2024-01-09',
      fileUrl: 'horta_analise.docx',
      comment: 'Análise de impacto ambiental',
      status: 'graded',
      grade: 9.5,
      feedback: 'Excelente trabalho! Análise muito profunda.',
      gradedAt: '2024-01-11'
    },
    {
      id: 3,
      projectId: 2,
      projectTitle: 'Robótica com Sucata',
      studentId: 103,
      studentName: 'Pedro Santos',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
      submittedAt: '2024-01-12',
      fileUrl: 'robo_video.mp4',
      comment: 'Vídeo de demonstração do robô',
      status: 'pending',
      grade: null,
      feedback: null,
      gradedAt: null
    },
    {
      id: 4,
      projectId: 2,
      projectTitle: 'Robótica com Sucata',
      studentId: 104,
      studentName: 'Ana Costa',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      submittedAt: '2024-01-08',
      fileUrl: 'robo_relatorio.pdf',
      comment: 'Documentação técnica completa',
      status: 'graded',
      grade: 8.5,
      feedback: 'Bom trabalho, mas faltou mais detalhes na análise.',
      gradedAt: '2024-01-09'
    },
    {
      id: 5,
      projectId: 3,
      projectTitle: 'Jornal Digital',
      studentId: 105,
      studentName: 'Lucas Pereira',
      studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
      submittedAt: '2024-01-11',
      fileUrl: 'jornal_link.url',
      comment: 'Link do jornal publicado',
      status: 'pending',
      grade: null,
      feedback: null,
      gradedAt: null
    }
  ];

  useEffect(() => {
    setProjects(MOCK_PROJECTS);
    setSubmissions(MOCK_SUBMISSIONS);
  }, []);

  // Filtrar submissões
  const filteredSubmissions = submissions.filter(submission => {
    const matchesFilter = filter === 'all' || submission.status === filter;
    const matchesSearch =
      submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.projectTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = !selectedProject || submission.projectId === selectedProject;

    return matchesFilter && matchesSearch && matchesProject;
  });

  // Ordenar submissões
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    switch (sortBy) {
      case 'date-newest':
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      case 'date-oldest':
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      case 'student-name':
        return a.studentName.localeCompare(b.studentName);
      case 'grade-highest':
        return (b.grade || 0) - (a.grade || 0);
      default:
        return 0;
    }
  });

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
  };

  const handleSaveGrade = () => {
    if (selectedSubmission && grade) {
      const updatedSubmissions = submissions.map(sub =>
        sub.id === selectedSubmission.id
          ? {
              ...sub,
              status: 'graded',
              grade: parseFloat(grade),
              feedback: feedback,
              gradedAt: new Date().toISOString().split('T')[0]
            }
          : sub
      );
      setSubmissions(updatedSubmissions);
      localStorage.setItem('work_submissions_corrections', JSON.stringify(updatedSubmissions));
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGrade('');
      setFeedback('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'graded':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'graded':
        return <CheckCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'graded':
        return 'Avaliada';
      default:
        return 'Desconhecido';
    }
  };

  const statsData = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    avgGrade: submissions.filter(s => s.grade).length > 0
      ? (submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / submissions.filter(s => s.grade).length).toFixed(1)
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Correção de Trabalhos</h1>
              <p className="text-sm text-slate-500 mt-1">Avalie e forneça feedback aos alunos</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Total Enviado</p>
              <p className="text-2xl font-bold text-blue-700">{statsData.total}</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
              <p className="text-xs font-semibold text-yellow-600 uppercase mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-700">{statsData.pending}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-xs font-semibold text-green-600 uppercase mb-1">Avaliadas</p>
              <p className="text-2xl font-bold text-green-700">{statsData.graded}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p className="text-xs font-semibold text-purple-600 uppercase mb-1">Média</p>
              <p className="text-2xl font-bold text-purple-700">{statsData.avgGrade}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar aluno ou projeto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Project Filter */}
            <select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="">Todos os Projetos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="graded">Avaliadas</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="date-newest">Mais Recentes</option>
              <option value="date-oldest">Mais Antigas</option>
              <option value="student-name">Nome do Aluno</option>
              <option value="grade-highest">Maior Nota</option>
            </select>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {sortedSubmissions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 font-medium">Nenhuma submissão encontrada</p>
              <p className="text-sm text-slate-500 mt-2">Tente ajustar seus filtros de busca</p>
            </div>
          ) : (
            sortedSubmissions.map(submission => (
              <div
                key={submission.id}
                onClick={() => handleSelectSubmission(submission)}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedSubmission?.id === submission.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={submission.studentAvatar}
                        alt={submission.studentName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{submission.studentName}</h3>
                        <p className="text-sm text-slate-500">{submission.projectTitle}</p>
                      </div>
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {getStatusIcon(submission.status)}
                        {getStatusLabel(submission.status)}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{submission.comment}</p>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {submission.submittedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={14} />
                        {submission.fileUrl}
                      </span>
                      {submission.grade && (
                        <span className="flex items-center gap-1 font-bold text-indigo-600">
                          <Award size={14} />
                          {submission.grade}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSubmission(submission);
                      setShowGradeModal(true);
                    }}
                    className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Avaliar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <img
                  src={selectedSubmission.studentAvatar}
                  alt={selectedSubmission.studentName}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div>
                  <h2 className="text-xl font-bold">{selectedSubmission.studentName}</h2>
                  <p className="text-indigo-100 text-sm">{selectedSubmission.projectTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setShowGradeModal(false)}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Submission Info */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-3">Informações da Submissão</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-700">Arquivo:</span> {selectedSubmission.fileUrl}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Data:</span> {selectedSubmission.submittedAt}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Comentário:</span> {selectedSubmission.comment}
                  </p>
                </div>
              </div>

              {/* Grade Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Nota (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite a nota"
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Digite seu feedback para o aluno..."
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                <p className="text-sm font-semibold text-indigo-900 mb-3">Sugestões de Feedback</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setFeedback('Excelente trabalho! Parabéns pela dedicação e qualidade.')}
                    className="w-full text-left px-3 py-2 bg-white border border-indigo-200 rounded text-sm text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    ✓ Elogio
                  </button>
                  <button
                    onClick={() => setFeedback('Bom trabalho, mas faltou mais detalhamento em alguns pontos.')}
                    className="w-full text-left px-3 py-2 bg-white border border-indigo-200 rounded text-sm text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    ⚠ Sugestão de Melhoria
                  </button>
                  <button
                    onClick={() => setFeedback('Precisa de revisão. Favor verificar os critérios de avaliação.')}
                    className="w-full text-left px-3 py-2 bg-white border border-indigo-200 rounded text-sm text-indigo-700 hover:bg-indigo-100 transition"
                  >
                    ✎ Requer Revisão
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowGradeModal(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveGrade}
                disabled={!grade}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center gap-2"
              >
                <Save size={16} />
                Salvar Avaliação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSubmissionCorrection;
