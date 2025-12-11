import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  Send, MessageSquare, Users, AlertCircle, CheckCircle,
  Trash2, Edit2, Clock, Filter, X, Plus
} from 'lucide-react';

const CommunicationHub = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  // ===== ESTADOS =====
  const [recipients, setRecipients] = useState('all');
  const [messageContent, setMessageContent] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [sentMessages, setSentMessages] = useState([
    {
      id: 1,
      title: 'Aviso: Aula Cancelada',
      content: 'A aula de matemática do dia 15/12 foi cancelada. Nova data será comunicada.',
      recipients: 'Todos (Alunos + Professores)',
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'delivered',
      readCount: 42,
      totalRecipients: 65
    },
    {
      id: 2,
      title: 'Lembrete: Entrega de Projetos',
      content: 'Prazo final para entrega dos projetos de final de semestre é 18/12.',
      recipients: 'Todos os Alunos',
      sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'delivered',
      readCount: 58,
      totalRecipients: 60
    },
    {
      id: 3,
      title: 'Reunião Pedagógica',
      content: 'Reunião com professores confirmada para 16/12 às 14h. Presença obrigatória.',
      recipients: 'Todos os Professores',
      sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'delivered',
      readCount: 8,
      totalRecipients: 8
    }
  ]);

  const [studentList, setStudentList] = useState([
    { id: 101, name: 'João Silva', email: 'joao.silva@school.com', class: '7º Ano A', status: 'active' },
    { id: 102, name: 'Maria Santos', email: 'maria.santos@school.com', class: '7º Ano A', status: 'active' },
    { id: 103, name: 'Pedro Costa', email: 'pedro.costa@school.com', class: '7º Ano B', status: 'active' },
    { id: 104, name: 'Ana Lima', email: 'ana.lima@school.com', class: '7º Ano B', status: 'inactive' },
    { id: 105, name: 'Lucas Oliveira', email: 'lucas.oliveira@school.com', class: '8º Ano A', status: 'active' },
    { id: 106, name: 'Julia Souza', email: 'julia.souza@school.com', class: '8º Ano A', status: 'active' }
  ]);

  const [teacherList, setTeacherList] = useState([
    { id: 1, name: 'Prof. João Ferreira', email: 'joao.ferreira@school.com', department: 'Português', status: 'active' },
    { id: 2, name: 'Prof. Ana Silva', email: 'ana.silva@school.com', department: 'Matemática', status: 'active' },
    { id: 3, name: 'Prof. Carlos Oliveira', email: 'carlos.oliveira@school.com', department: 'Ciências', status: 'active' },
    { id: 4, name: 'Prof. Rita Costa', email: 'rita.costa@school.com', department: 'História', status: 'inactive' }
  ]);

  const [classList] = useState([
    { id: 'all', name: 'Todas as Turmas' },
    { id: '7a', name: '7º Ano A' },
    { id: '7b', name: '7º Ano B' },
    { id: '8a', name: '8º Ano A' },
    { id: '8b', name: '8º Ano B' }
  ]);

  // Socket.io Connection
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

  // ===== LÓGICA ENVIAR COMUNICADO =====
  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      showNotification('Escreva uma mensagem!', 'error');
      return;
    }

    if (recipients === 'select-class' && selectedClass === 'all') {
      showNotification('Selecione uma turma!', 'error');
      return;
    }

    let recipientLabel = '';
    let recipientCount = 0;

    if (recipients === 'all') {
      recipientLabel = 'Todos (Alunos + Professores)';
      recipientCount = studentList.length + teacherList.length;
    } else if (recipients === 'students') {
      recipientLabel = 'Todos os Alunos';
      recipientCount = studentList.length;
    } else if (recipients === 'teachers') {
      recipientLabel = 'Todos os Professores';
      recipientCount = teacherList.length;
    } else if (recipients === 'select-class') {
      const classData = classList.find(c => c.id === selectedClass);
      recipientLabel = classData.name;
      recipientCount = studentList.filter(s => s.class === classData.name).length;
    }

    const newMessage = {
      id: Math.max(...sentMessages.map(m => m.id), 0) + 1,
      title: 'Comunicado do Coordenador',
      content: messageContent,
      recipients: recipientLabel,
      sentAt: new Date(),
      status: 'delivered',
      readCount: 0,
      totalRecipients: recipientCount
    };

    setSentMessages([newMessage, ...sentMessages]);
    setMessageContent('');
    setRecipients('all');
    setSelectedClass('all');
    showNotification('✅ Comunicado enviado com sucesso!');

    // Emitir socket.io para notificar destinatários
    if (socket) {
      socket.emit('coordinator-message', {
        messageId: newMessage.id,
        content: messageContent,
        recipients: recipients,
        selectedClass: selectedClass,
        timestamp: new Date()
      });
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Tem certeza que deseja deletar este comunicado?')) {
      setSentMessages(sentMessages.filter(m => m.id !== messageId));
      showNotification('✅ Comunicado deletado');
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    return date.toLocaleDateString('pt-BR');
  };

  const getRecipientPreview = () => {
    if (recipients === 'all') {
      return `📢 Todos: ${studentList.length + teacherList.length} pessoas`;
    } else if (recipients === 'students') {
      return `👨‍🎓 Alunos: ${studentList.length} pessoas`;
    } else if (recipients === 'teachers') {
      return `👨‍🏫 Professores: ${teacherList.length} pessoas`;
    } else if (recipients === 'select-class') {
      const classData = classList.find(c => c.id === selectedClass);
      if (classData && classData.id !== 'all') {
        const count = studentList.filter(s => s.class === classData.name).length;
        return `📚 ${classData.name}: ${count} alunos`;
      }
    }
    return 'Selecione destinatários';
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-4xl font-bold text-slate-800 flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <MessageSquare size={28} className="text-white" />
            </div>
            Hub de Comunicação
          </h2>
          <p className="text-slate-500 text-base">Envie comunicados para alunos, professores ou turmas específicas</p>
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
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-8">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('send')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'send'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Send size={16} />
              Enviar Comunicado
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Clock size={16} />
              Histórico
            </button>
            <button
              onClick={() => setActiveTab('recipients')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'recipients'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Users size={16} />
              Destinatários
            </button>
          </div>
        </div>

        {/* ===== ABA: ENVIAR COMUNICADO ===== */}
        {activeTab === 'send' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">✍️ Novo Comunicado</h3>

              <div className="space-y-6">
                {/* Destinatários */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Para quem enviar?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRecipients('all')}
                      className={`p-4 rounded-xl border-2 transition text-left ${
                        recipients === 'all'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-800">📢 Todos</p>
                      <p className="text-xs text-slate-600">Alunos + Professores ({studentList.length + teacherList.length})</p>
                    </button>

                    <button
                      onClick={() => setRecipients('students')}
                      className={`p-4 rounded-xl border-2 transition text-left ${
                        recipients === 'students'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-800">👨‍🎓 Alunos</p>
                      <p className="text-xs text-slate-600">Todos os alunos ({studentList.length})</p>
                    </button>

                    <button
                      onClick={() => setRecipients('teachers')}
                      className={`p-4 rounded-xl border-2 transition text-left ${
                        recipients === 'teachers'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-800">👨‍🏫 Professores</p>
                      <p className="text-xs text-slate-600">Todos os professores ({teacherList.length})</p>
                    </button>

                    <button
                      onClick={() => setRecipients('select-class')}
                      className={`p-4 rounded-xl border-2 transition text-left ${
                        recipients === 'select-class'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <p className="font-bold text-slate-800">📚 Por Turma</p>
                      <p className="text-xs text-slate-600">Selecione uma turma específica</p>
                    </button>
                  </div>
                </div>

                {/* Selecionar turma (se aplicável) */}
                {recipients === 'select-class' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Qual turma?</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="all">-- Selecione uma turma --</option>
                      {classList.slice(1).map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Preview de destinatários */}
                <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
                  <p className="text-sm font-bold text-indigo-900">📍 Destinatários: {getRecipientPreview()}</p>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Mensagem</label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Escreva seu comunicado aqui..."
                    rows="8"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-2">{messageContent.length} caracteres</p>
                </div>

                {/* Botão enviar */}
                <button
                  onClick={handleSendMessage}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Enviar Comunicado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== ABA: HISTÓRICO ===== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-800">📜 Histórico de Comunicados</h3>

            <div className="space-y-4">
              {sentMessages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <MessageSquare size={48} className="text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Nenhum comunicado enviado ainda</p>
                </div>
              ) : (
                sentMessages.map(msg => (
                  <div key={msg.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-800">{msg.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">📍 Para: {msg.recipients}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                        ✅ Entregue
                      </span>
                    </div>

                    <p className="text-slate-700 mb-4">{msg.content}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">📤 Enviado</p>
                        <p className="font-bold text-slate-800">{formatDate(msg.sentAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">📖 Lido por</p>
                        <p className="font-bold text-slate-800">{msg.readCount}/{msg.totalRecipients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">📊 Taxa de Leitura</p>
                        <p className="font-bold text-slate-800">{Math.round((msg.readCount / msg.totalRecipients) * 100)}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 flex items-center justify-center gap-2">
                        <Edit2 size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Deletar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===== ABA: DESTINATÁRIOS ===== */}
        {activeTab === 'recipients' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alunos */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">👨‍🎓 Alunos ({studentList.length})</h3>
                <div className="space-y-3">
                  {studentList.map(student => (
                    <div key={student.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">{student.name}</p>
                          <p className="text-xs text-slate-600">{student.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {student.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">📚 {student.class}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professores */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">👨‍🏫 Professores ({teacherList.length})</h3>
                <div className="space-y-3">
                  {teacherList.map(teacher => (
                    <div key={teacher.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">{teacher.name}</p>
                          <p className="text-xs text-slate-600">{teacher.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          teacher.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {teacher.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">📖 {teacher.department}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationHub;
