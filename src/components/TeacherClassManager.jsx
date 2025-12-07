import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Search,
  Trash2,
  Edit2,
  Users,
  Check,
  AlertCircle,
  Loader,
  ChevronLeft
} from 'lucide-react';

// MOCK DATA (fallback se backend não disponível)
const MOCK_CLASSES = [
  {
    id: 1,
    name: '1º Ano A',
    year: '1º Ano',
    description: 'Turma matutino',
    students: [
      { id: 101, name: 'João Silva', email: 'joao.silva@school.com', joinDate: '2024-01-15' },
      { id: 102, name: 'Maria Santos', email: 'maria.santos@school.com', joinDate: '2024-01-15' },
      { id: 103, name: 'Ana Costa', email: 'ana.costa@school.com', joinDate: '2024-01-20' }
    ],
    totalCapacity: 35,
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: '2º Ano B',
    year: '2º Ano',
    description: 'Turma vespertino',
    students: [
      { id: 201, name: 'Pedro Costa', email: 'pedro.costa@school.com', joinDate: '2024-01-20' }
    ],
    totalCapacity: 32,
    createdAt: '2024-01-05'
  }
];

const MOCK_ALL_STUDENTS = [
  { id: 101, name: 'João Silva', email: 'joao.silva@school.com' },
  { id: 102, name: 'Maria Santos', email: 'maria.santos@school.com' },
  { id: 103, name: 'Ana Costa', email: 'ana.costa@school.com' },
  { id: 104, name: 'Lucas Pereira', email: 'lucas.pereira@school.com' },
  { id: 105, name: 'Julia Souza', email: 'julia.souza@school.com' },
  { id: 106, name: 'Pedro Costa', email: 'pedro.costa@school.com' },
  { id: 107, name: 'Beatriz Lima', email: 'beatriz.lima@school.com' },
  { id: 108, name: 'Gabriel Alves', email: 'gabriel.alves@school.com' },
  { id: 109, name: 'Lucia Ferreira', email: 'lucia.ferreira@school.com' },
  { id: 110, name: 'Diego Oliveira', email: 'diego.oliveira@school.com' }
];

// ═══════════════════════════════════════════════════════════
// 📡 SERVIÇO API (Com Fallback para Mock)
// ═══════════════════════════════════════════════════════════

const classesAPI = {
  // GET: Obter todas as turmas
  async getAllClasses() {
    try {
      const response = await fetch('/api/classes', { method: 'GET' });
      if (!response.ok) throw new Error('Falha ao buscar turmas');
      return await response.json();
    } catch (error) {
      console.log('Usando MOCK: getAllClasses');
      return MOCK_CLASSES;
    }
  },

  // GET: Obter turma por ID
  async getClassById(classId) {
    try {
      const response = await fetch(`/api/classes/${classId}`, { method: 'GET' });
      if (!response.ok) throw new Error('Turma não encontrada');
      return await response.json();
    } catch (error) {
      console.log('Usando MOCK: getClassById');
      return MOCK_CLASSES.find(c => c.id === classId);
    }
  },

  // POST: Criar nova turma
  async createClass(data) {
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro ao criar turma');
      return await response.json();
    } catch (error) {
      console.log('Usando MOCK: createClass');
      return { id: Math.random(), ...data, students: [], createdAt: new Date().toISOString() };
    }
  },

  // 🔧 PUT: EDITAR TURMA (mudar nome, ano, descrição)
  async updateClass(classId, data) {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erro ao atualizar turma');
      return await response.json();
    } catch (error) {
      console.log('Usando MOCK: updateClass');
      return { ...MOCK_CLASSES.find(c => c.id === classId), ...data };
    }
  },

  // ➕ POST: ADICIONAR ALUNO À TURMA
  async addStudentToClass(classId, studentId) {
    try {
      const response = await fetch(`/api/classes/${classId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      });
      if (!response.ok) throw new Error('Erro ao adicionar aluno');
      return await response.json();
    } catch (error) {
      console.log('Usando MOCK: addStudentToClass');
      const student = MOCK_ALL_STUDENTS.find(s => s.id === studentId);
      return student ? { ...student, joinDate: new Date().toISOString().split('T')[0] } : null;
    }
  },

  // ➖ DELETE: REMOVER ALUNO DA TURMA
  async removeStudentFromClass(classId, studentId) {
    try {
      const response = await fetch(`/api/classes/${classId}/students/${studentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erro ao remover aluno');
      return { success: true };
    } catch (error) {
      console.log('Usando MOCK: removeStudentFromClass');
      return { success: true };
    }
  },

  // DELETE: Deletar turma inteira
  async deleteClass(classId) {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erro ao deletar turma');
      return { success: true };
    } catch (error) {
      console.log('Usando MOCK: deleteClass');
      return { success: true };
    }
  }
};

// ═══════════════════════════════════════════════════════════
// 🎨 COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

const TeacherClassManager = () => {
  // STATES
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // MODAL: EDITAR TURMA
  const [editModal, setEditModal] = useState({ open: false, class: null });
  const [editData, setEditData] = useState({ name: '', year: '', description: '' });
  const [editLoading, setEditLoading] = useState(false);

  // MODAL: ADICIONAR ALUNO
  const [addStudentModal, setAddStudentModal] = useState({ open: false, classId: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [addStudentLoading, setAddStudentLoading] = useState(false);

  // MODAL: CRIAR NOVA TURMA
  const [createModal, setCreateModal] = useState(false);
  const [createData, setCreateData] = useState({ name: '', year: '', description: '', capacity: 35 });
  const [createLoading, setCreateLoading] = useState(false);

  // CARREGAR TURMAS AO INICIALIZAR
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await classesAPI.getAllClasses();
      setClasses(data || MOCK_CLASSES);
    } catch (error) {
      setClasses(MOCK_CLASSES);
      showError('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  // ═════════════════════════════════════════════════════
  // EDITAR TURMA
  // ═════════════════════════════════════════════════════

  const handleOpenEditModal = (classItem) => {
    setEditData({
      name: classItem.name,
      year: classItem.year || '',
      description: classItem.description || ''
    });
    setEditModal({ open: true, class: classItem });
  };

  const handleSaveClassEdit = async () => {
    // VALIDAÇÕES
    if (!editData.name.trim()) {
      showError('Nome da turma é obrigatório');
      return;
    }
    if (!editData.year.trim()) {
      showError('Ano/Série é obrigatório');
      return;
    }

    setEditLoading(true);
    try {
      const updated = await classesAPI.updateClass(editModal.class.id, {
        name: editData.name.trim(),
        year: editData.year.trim(),
        description: editData.description.trim()
      });

      // Atualizar lista local
      setClasses(prev =>
        prev.map(c => c.id === editModal.class.id ? updated : c)
      );

      // Atualizar turma selecionada se aberta
      if (selectedClass && selectedClass.id === editModal.class.id) {
        setSelectedClass(updated);
      }

      setEditModal({ open: false, class: null });
      showSuccess('✓ Turma atualizada com sucesso!');
    } catch (error) {
      showError('Erro ao atualizar turma');
    } finally {
      setEditLoading(false);
    }
  };

  // ═════════════════════════════════════════════════════
  // CRIAR NOVA TURMA
  // ═════════════════════════════════════════════════════

  const handleOpenCreateModal = () => {
    setCreateData({ name: '', year: '', description: '', capacity: 35 });
    setCreateModal(true);
  };

  const handleCreateClass = async () => {
    // VALIDAÇÕES
    if (!createData.name.trim()) {
      showError('Nome da turma é obrigatório');
      return;
    }
    if (!createData.year.trim()) {
      showError('Ano/Série é obrigatório');
      return;
    }

    setCreateLoading(true);
    try {
      const newClass = await classesAPI.createClass({
        name: createData.name.trim(),
        year: createData.year.trim(),
        description: createData.description.trim(),
        capacity: createData.capacity || 35
      });

      // Adicionar à lista local
      setClasses(prev => [newClass, ...prev]);
      setCreateModal(false);
      showSuccess('✓ Turma criada com sucesso!');
    } catch (error) {
      showError('Erro ao criar turma');
    } finally {
      setCreateLoading(false);
    }
  };

  // ═════════════════════════════════════════════════════
  // ADICIONAR ALUNO À TURMA
  // ═════════════════════════════════════════════════════

  // Filtrar alunos (busca por email ou nome)
  const availableStudents = MOCK_ALL_STUDENTS.filter(student => {
    const currentClass = classes.find(c => c.id === addStudentModal.classId);
    const alreadyInClass = currentClass?.students.some(s => s.id === student.id);
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return !alreadyInClass && matchesSearch;
  });

  const handleAddStudentToClass = async (student) => {
    setAddStudentLoading(true);
    try {
      const newStudent = await classesAPI.addStudentToClass(
        addStudentModal.classId,
        student.id
      );

      if (newStudent) {
        // Atualizar lista local
        setClasses(prev =>
          prev.map(c =>
            c.id === addStudentModal.classId
              ? {
                  ...c,
                  students: [...c.students, newStudent],
                  totalCapacity: c.totalCapacity || 35
                }
              : c
          )
        );

        // Atualizar turma selecionada
        if (selectedClass && selectedClass.id === addStudentModal.classId) {
          setSelectedClass(prev => ({
            ...prev,
            students: [...prev.students, newStudent]
          }));
        }

        setSearchQuery('');
        showSuccess(`✓ ${student.name} adicionado à turma!`);
      }
    } catch (error) {
      showError('Erro ao adicionar aluno');
    } finally {
      setAddStudentLoading(false);
    }
  };

  // ═════════════════════════════════════════════════════
  // REMOVER ALUNO DA TURMA
  // ═════════════════════════════════════════════════════

  const handleRemoveStudent = async (classId, studentId, studentName) => {
    if (!window.confirm(`Remover ${studentName} da turma?`)) return;

    try {
      await classesAPI.removeStudentFromClass(classId, studentId);

      setClasses(prev =>
        prev.map(c =>
          c.id === classId
            ? {
                ...c,
                students: c.students.filter(s => s.id !== studentId)
              }
            : c
        )
      );

      if (selectedClass && selectedClass.id === classId) {
        setSelectedClass(prev => ({
          ...prev,
          students: prev.students.filter(s => s.id !== studentId)
        }));
      }

      showSuccess(`✓ ${studentName} removido da turma`);
    } catch (error) {
      showError('Erro ao remover aluno');
    }
  };

  // ═════════════════════════════════════════════════════
  // DELETAR TURMA
  // ═════════════════════════════════════════════════════

  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Deletar turma "${className}"? Esta ação não pode ser desfeita!`)) {
      return;
    }

    try {
      await classesAPI.deleteClass(classId);
      setClasses(prev => prev.filter(c => c.id !== classId));
      if (selectedClass && selectedClass.id === classId) {
        setSelectedClass(null);
      }
      showSuccess('✓ Turma deletada');
    } catch (error) {
      showError('Erro ao deletar turma');
    }
  };

  // ═════════════════════════════════════════════════════
  // NOTIFICAÇÕES
  // ═════════════════════════════════════════════════════

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  // ═════════════════════════════════════════════════════
  // RENDER: TURMA SELECIONADA
  // ═════════════════════════════════════════════════════

  if (selectedClass) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => setSelectedClass(null)}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-2 transition"
        >
          <ChevronLeft size={20} />
          Voltar para Turmas
        </button>

        {/* Notificações */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 font-bold animate-pulse">
            <Check size={20} />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 font-bold">
            <AlertCircle size={20} />
            {errorMessage}
          </div>
        )}

        {/* Header da Turma */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{selectedClass.name}</h1>
              <p className="text-indigo-100">{selectedClass.year}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenEditModal(selectedClass)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg font-bold flex items-center gap-2 transition"
              >
                <Edit2 size={18} />
                Editar
              </button>
              <button
                onClick={() => handleDeleteClass(selectedClass.id, selectedClass.name)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur rounded-lg font-bold flex items-center gap-2 transition"
              >
                <Trash2 size={18} />
                Deletar
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-bold">
              👥 {selectedClass.students.length} / {selectedClass.totalCapacity}
            </span>
          </div>
        </div>

        {/* Seção de Alunos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Alunos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800">
                  Alunos Matriculados ({selectedClass.students.length})
                </h3>
                <button
                  onClick={() => setAddStudentModal({ open: true, classId: selectedClass.id })}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 transition"
                >
                  <Plus size={18} />
                  Adicionar Aluno
                </button>
              </div>

              {selectedClass.students.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <p>Nenhum aluno matriculado ainda.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {selectedClass.students.map(student => (
                    <div
                      key={student.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Matriculado em: {new Date(student.joinDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveStudent(selectedClass.id, student.id, student.name)
                        }
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                        title="Remover aluno"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <p className="text-xs font-bold text-indigo-600 uppercase mb-2">Vagas</p>
              <p className="text-3xl font-bold text-indigo-600">
                {selectedClass.totalCapacity - selectedClass.students.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                de {selectedClass.totalCapacity}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <p className="text-xs font-bold text-green-600 uppercase mb-2">Ocupação</p>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(
                  (selectedClass.students.length / selectedClass.totalCapacity) * 100
                )}
                %
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <p className="text-xs font-bold text-slate-600 uppercase mb-2">Criada em</p>
              <p className="text-sm font-bold text-slate-800">
                {new Date(selectedClass.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════
  // RENDER: LISTA DE TURMAS
  // ═════════════════════════════════════════════════════

  return (
    <div className="w-full">
      {/* Header com Botão - VISÍVEL E DESTACADO */}
      <div className="mb-10 flex flex-row justify-between items-start gap-8">
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-slate-900">Gerenciar Turmas</h2>
          <p className="text-slate-600 mt-2 text-lg">Crie e configure suas turmas escolares</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center gap-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap min-w-fit"
        >
          <Plus size={28} strokeWidth={3} />
          <span className="text-lg">Nova Turma</span>
        </button>
      </div>

      {/* Notificações */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 font-bold">
          <Check size={20} />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 font-bold">
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size={40} className="animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Grid de Turmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-600 text-lg">Nenhuma turma criada ainda</p>
              </div>
            ) : (
              classes.map(classItem => (
                <div
                  key={classItem.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition overflow-hidden group cursor-pointer"
                >
                  <div className="p-6">
                    {/* Header Card */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition">
                          {classItem.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{classItem.year}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-indigo-600">
                        {classItem.students.length}/{classItem.totalCapacity}
                      </span>
                    </div>

                    {/* Descrição */}
                    <p className="text-sm text-slate-600 mb-4">{classItem.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Ocupação</span>
                        <span>
                          {Math.round(
                            (classItem.students.length / classItem.totalCapacity) * 100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full transition-all"
                          style={{
                            width: `${
                              (classItem.students.length / classItem.totalCapacity) * 100
                            }%`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => setSelectedClass(classItem)}
                      className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition flex items-center justify-center gap-2"
                    >
                      <Users size={16} />
                      Gerenciar Alunos
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ═════════════════════════════════════════════════ */}
      {/* MODAL: EDITAR TURMA */}
      {/* ═════════════════════════════════════════════════ */}
      {editModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Editar Turma</h3>
              <button
                onClick={() => setEditModal({ open: false, class: null })}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Ex: 1º Ano A"
                />
              </div>

              {/* Ano/Série (NOVO) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ano/Série *
                </label>
                <select
                  value={editData.year}
                  onChange={(e) => setEditData({ ...editData, year: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  <option value="1º Ano">1º Ano</option>
                  <option value="2º Ano">2º Ano</option>
                  <option value="3º Ano">3º Ano</option>
                  <option value="4º Ano">4º Ano</option>
                  <option value="5º Ano">5º Ano</option>
                  <option value="6º Ano">6º Ano</option>
                  <option value="7º Ano">7º Ano</option>
                  <option value="8º Ano">8º Ano</option>
                  <option value="9º Ano">9º Ano</option>
                  <option value="1º Médio">1º Médio</option>
                  <option value="2º Médio">2º Médio</option>
                  <option value="3º Médio">3º Médio</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none transition"
                  placeholder="Ex: Turma matutino, turno especial, etc"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <button
                onClick={() => setEditModal({ open: false, class: null })}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveClassEdit}
                disabled={editLoading}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-bold transition flex items-center justify-center gap-2"
              >
                {editLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════ */}
      {/* MODAL: ADICIONAR ALUNO */}
      {/* ═════════════════════════════════════════════════ */}
      {addStudentModal.open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Adicionar Aluno</h3>
              <button
                onClick={() => setAddStudentModal({ open: false, classId: null })}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Busca */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Buscar Aluno (nome ou email)
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="João ou joao@email.com"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de Alunos Disponíveis */}
            <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
              {availableStudents.length === 0 ? (
                <p className="text-center text-slate-500 py-4">
                  {searchQuery
                    ? 'Nenhum aluno encontrado'
                    : 'Todos os alunos já estão adicionados'}
                </p>
              ) : (
                availableStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleAddStudentToClass(student)}
                    disabled={addStudentLoading}
                    className="w-full p-3 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-300 rounded-lg transition flex items-center justify-between group disabled:opacity-50"
                  >
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                    </div>
                    {addStudentLoading ? (
                      <Loader size={18} className="animate-spin text-indigo-600" />
                    ) : (
                      <Plus size={18} className="text-slate-400 group-hover:text-indigo-600 transition" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Botão Cancelar */}
            <button
              onClick={() => setAddStudentModal({ open: false, classId: null })}
              className="w-full px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════ */}
      {/* MODAL: CRIAR NOVA TURMA */}
      {/* ═════════════════════════════════════════════════ */}
      {createModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Criar Nova Turma</h3>
              <button
                onClick={() => setCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="Ex: 1º Ano A"
                  autoFocus
                />
              </div>

              {/* Ano/Série */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ano/Série *
                </label>
                <select
                  value={createData.year}
                  onChange={(e) => setCreateData({ ...createData, year: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  <option value="1º Ano">1º Ano</option>
                  <option value="2º Ano">2º Ano</option>
                  <option value="3º Ano">3º Ano</option>
                  <option value="4º Ano">4º Ano</option>
                  <option value="5º Ano">5º Ano</option>
                  <option value="6º Ano">6º Ano</option>
                  <option value="7º Ano">7º Ano</option>
                  <option value="8º Ano">8º Ano</option>
                  <option value="9º Ano">9º Ano</option>
                  <option value="1º Médio">1º Médio</option>
                  <option value="2º Médio">2º Médio</option>
                  <option value="3º Médio">3º Médio</option>
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={createData.description}
                  onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none transition"
                  placeholder="Ex: Turma matutino, turno especial, etc"
                />
              </div>

              {/* Capacidade */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Capacidade de Alunos
                </label>
                <input
                  type="number"
                  value={createData.capacity}
                  onChange={(e) => setCreateData({ ...createData, capacity: parseInt(e.target.value) || 35 })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  placeholder="35"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              <button
                onClick={() => setCreateModal(false)}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateClass}
                disabled={createLoading}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-bold transition flex items-center justify-center gap-2"
              >
                {createLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Criar Turma
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassManager;
