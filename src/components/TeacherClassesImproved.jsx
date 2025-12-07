import { useState } from 'react';
import { 
  ChevronLeft, 
  Edit, 
  Plus, 
  Trash2, 
  Users, 
  X, 
  MoreVertical,
  Save,
  UserPlus
} from 'lucide-react';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * TeacherClassesImproved
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Componente completo de gestão de turmas com CRUD:
 * - Listar turmas
 * - Ver detalhes da turma
 * - Editar turma
 * - Deletar turma
 * - Adicionar estudantes
 * - Remover estudantes
 * 
 * Features:
 * - CRUD completo
 * - Modais para edição
 * - Validação de dados
 * - Feedback visual
 * - Design responsivo
 */

// ═══════════════════════════════════════════════════════════════════════
// DADOS MOCK INICIAIS
// ═══════════════════════════════════════════════════════════════════════

const MOCK_CLASSES_INITIAL = [
  {
    id: 1,
    name: '1º Ano A',
    year: '1º ano',
    students: [
      { 
        id: 101, 
        name: 'João Silva', 
        email: 'joao@school.com', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' 
      },
      { 
        id: 102, 
        name: 'Maria Santos', 
        email: 'maria@school.com', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' 
      },
    ],
    engagement: 85,
    theme: 'blue',
    createdAt: '2025-01-15'
  },
  {
    id: 2,
    name: '2º Ano B',
    year: '2º ano',
    students: [
      { 
        id: 103, 
        name: 'Pedro Costa', 
        email: 'pedro@school.com', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro' 
      },
      { 
        id: 104, 
        name: 'Ana Costa', 
        email: 'ana@school.com', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana' 
      },
    ],
    engagement: 78,
    theme: 'purple',
    createdAt: '2025-01-15'
  },
  {
    id: 3,
    name: '3º Ano C',
    year: '3º ano',
    students: [
      { 
        id: 105, 
        name: 'Lucas Oliveira', 
        email: 'lucas@school.com', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas' 
      },
    ],
    engagement: 92,
    theme: 'orange',
    createdAt: '2025-01-15'
  }
];

const TeacherClassesImproved = () => {
  // ────────────────────────────────────────────────────────────────
  // ESTADO
  // ────────────────────────────────────────────────────────────────

  const [classes, setClasses] = useState(MOCK_CLASSES_INITIAL);
  const [selectedClass, setSelectedClass] = useState(null);
  const [view, setView] = useState('list'); // 'list' ou 'details'

  // Modais
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Dados do formulário
  const [editClassName, setEditClassName] = useState('');
  const [editClassYear, setEditClassYear] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);

  // ────────────────────────────────────────────────────────────────
  // HANDLERS - EDITAR TURMA
  // ────────────────────────────────────────────────────────────────

  const handleOpenEditModal = (classData) => {
    setSelectedClass(classData);
    setEditClassName(classData.name);
    setEditClassYear(classData.year);
    setShowEditModal(true);
  };

  const handleSaveEditClass = async () => {
    if (!editClassName.trim()) {
      alert('Digite o nome da turma!');
      return;
    }

    setLoading(true);

    try {
      // Tentar salvar no backend
      const response = await fetch(`/api/classes/${selectedClass.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editClassName,
          year: editClassYear
        })
      });

      if (!response.ok) throw new Error('Erro ao atualizar turma');

      // Atualizar estado local
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, name: editClassName, year: editClassYear }
          : c
      ));

      // Atualizar selectedClass se estiver na view de detalhes
      if (view === 'details') {
        setSelectedClass({ ...selectedClass, name: editClassName, year: editClassYear });
      }

      setShowEditModal(false);
      alert('✅ Turma atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao editar turma:', error);
      
      // Fallback: atualizar apenas localmente
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, name: editClassName, year: editClassYear }
          : c
      ));

      if (view === 'details') {
        setSelectedClass({ ...selectedClass, name: editClassName, year: editClassYear });
      }

      setShowEditModal(false);
      alert('✅ Turma atualizada localmente (sem sincronização com servidor)');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // HANDLERS - ADICIONAR ESTUDANTE
  // ────────────────────────────────────────────────────────────────

  const handleOpenAddStudentModal = (classData) => {
    setSelectedClass(classData);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddStudentModal(true);
  };

  const handleAddStudent = async () => {
    if (!newStudentName.trim()) {
      alert('Digite o nome do estudante!');
      return;
    }
    if (!newStudentEmail.trim() || !newStudentEmail.includes('@')) {
      alert('Digite um email válido!');
      return;
    }

    // Checar se email já existe
    const emailExists = selectedClass.students.some(s => s.email === newStudentEmail);
    if (emailExists) {
      alert('Este email já está cadastrado nesta turma!');
      return;
    }

    setLoading(true);

    const newStudent = {
      id: Date.now(),
      name: newStudentName,
      email: newStudentEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newStudentName}`
    };

    try {
      // Tentar salvar no backend
      const response = await fetch(`/api/classes/${selectedClass.id}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          email: newStudentEmail
        })
      });

      if (!response.ok) throw new Error('Erro ao adicionar estudante');

      const data = await response.json();
      const savedStudent = data.student || newStudent;

      // Atualizar estado local
      const updatedClasses = classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, students: [...c.students, savedStudent] }
          : c
      );

      setClasses(updatedClasses);
      const updatedClass = updatedClasses.find(c => c.id === selectedClass.id);
      setSelectedClass(updatedClass);

      setShowAddStudentModal(false);
      alert(`✅ ${newStudentName} adicionado(a) à turma!`);
    } catch (error) {
      console.error('Erro ao adicionar estudante:', error);

      // Fallback: adicionar apenas localmente
      const updatedClasses = classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, students: [...c.students, newStudent] }
          : c
      );

      setClasses(updatedClasses);
      const updatedClass = updatedClasses.find(c => c.id === selectedClass.id);
      setSelectedClass(updatedClass);

      setShowAddStudentModal(false);
      alert(`✅ ${newStudentName} adicionado(a) localmente (sem sincronização)`);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // HANDLERS - REMOVER ESTUDANTE
  // ────────────────────────────────────────────────────────────────

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm('Tem certeza que deseja remover este estudante?')) return;

    setLoading(true);

    try {
      // Tentar remover no backend
      const response = await fetch(`/api/classes/${selectedClass.id}/students/${studentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao remover estudante');

      // Atualizar estado local
      const updatedClasses = classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, students: c.students.filter(s => s.id !== studentId) }
          : c
      );

      setClasses(updatedClasses);
      const updatedClass = updatedClasses.find(c => c.id === selectedClass.id);
      setSelectedClass(updatedClass);

      alert('✅ Estudante removido da turma!');
    } catch (error) {
      console.error('Erro ao remover estudante:', error);

      // Fallback: remover apenas localmente
      const updatedClasses = classes.map(c =>
        c.id === selectedClass.id
          ? { ...c, students: c.students.filter(s => s.id !== studentId) }
          : c
      );

      setClasses(updatedClasses);
      const updatedClass = updatedClasses.find(c => c.id === selectedClass.id);
      setSelectedClass(updatedClass);

      alert('✅ Estudante removido localmente (sem sincronização)');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // HANDLERS - DELETAR TURMA
  // ────────────────────────────────────────────────────────────────

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta turma? (os estudantes não serão removidos)')) return;

    setLoading(true);

    try {
      // Tentar deletar no backend
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar turma');

      // Atualizar estado local
      setClasses(classes.filter(c => c.id !== classId));
      setView('list');
      alert('✅ Turma deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar turma:', error);

      // Fallback: deletar apenas localmente
      setClasses(classes.filter(c => c.id !== classId));
      setView('list');
      alert('✅ Turma deletada localmente (sem sincronização)');
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────
  // RENDER: VISTA DE DETALHES
  // ────────────────────────────────────────────────────────────────

  if (view === 'details' && selectedClass) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => setView('list')}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
        >
          <ChevronLeft size={20} /> Voltar para Turmas
        </button>

        {/* Título e Ações */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{selectedClass.name}</h2>
            <p className="text-slate-500">{selectedClass.year} • {selectedClass.students.length} alunos</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleOpenEditModal(selectedClass)}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-bold text-sm transition flex items-center gap-2"
            >
              <Edit size={16} />
              Editar Turma
            </button>
            <button
              onClick={() => handleOpenAddStudentModal(selectedClass)}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-bold text-sm transition flex items-center gap-2"
            >
              <Plus size={16} />
              Adicionar Aluno
            </button>
            <button
              onClick={() => handleDeleteClass(selectedClass.id)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-sm transition flex items-center gap-2"
            >
              <Trash2 size={16} />
              Deletar
            </button>
          </div>
        </div>

        {/* Lista de Estudantes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-lg text-slate-800">
              📚 Estudantes da Turma ({selectedClass.students.length})
            </h3>
          </div>

          {selectedClass.students.length === 0 ? (
            <div className="p-20 text-center">
              <Users size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 mb-2">Nenhum estudante nesta turma</p>
              <p className="text-slate-400 text-sm mb-4">
                Adicione estudantes para começar a gerenciar esta turma
              </p>
              <button
                onClick={() => handleOpenAddStudentModal(selectedClass)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition inline-flex items-center gap-2"
              >
                <UserPlus size={18} />
                Adicionar Primeiro Aluno
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {selectedClass.students.map(student => (
                <div key={student.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="font-bold text-slate-800">{student.name}</p>
                      <p className="text-sm text-slate-500">{student.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveStudent(student.id)}
                    className="p-2 hover:bg-red-100 text-red-500 rounded-lg transition"
                    title="Remover aluno"
                    disabled={loading}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // RENDER: VISTA DE LISTA
  // ────────────────────────────────────────────────────────────────

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Minhas Turmas</h2>
        <span className="text-slate-500 font-semibold">{classes.length} turma{classes.length !== 1 ? 's' : ''}</span>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Users size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Nenhuma turma criada</h3>
          <p className="text-slate-500 mb-6">Crie sua primeira turma para começar</p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
            + Nova Turma
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(c => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition group relative overflow-hidden"
            >
              {/* Barra colorida no topo */}
              <div className={`absolute top-0 left-0 w-2 h-full ${
                c.theme === 'blue' ? 'bg-blue-500' :
                c.theme === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
              }`} />

              <div className="pl-4">
                {/* Cabeçalho */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{c.year}</p>
                  </div>
                  <MoreVertical size={18} className="text-slate-400" />
                </div>

                {/* Estudantes */}
                <div className="mb-4">
                  <p className="text-sm font-bold text-slate-600 mb-2">
                    👥 {c.students.length} aluno{c.students.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex -space-x-2">
                    {c.students.slice(0, 3).map(s => (
                      <img
                        key={s.id}
                        src={s.avatar}
                        className="w-8 h-8 rounded-full border-2 border-white bg-slate-100"
                        title={s.name}
                        alt={s.name}
                      />
                    ))}
                    {c.students.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-xs font-bold text-white">
                        +{c.students.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Engajamento */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500">Engajamento</span>
                    <span className="text-xs font-bold text-slate-700">{c.engagement}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        c.theme === 'blue' ? 'bg-blue-500' :
                        c.theme === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${c.engagement}%` }}
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedClass(c);
                      setView('details');
                    }}
                    className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition text-center"
                  >
                    Ver Detalhes
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(c)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
                    title="Editar turma"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: EDITAR TURMA */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-800">Editar Turma</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="hover:bg-slate-100 p-2 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  placeholder="Ex: 1º Ano A"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ano/Série *
                </label>
                <select
                  value={editClassYear}
                  onChange={(e) => setEditClassYear(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>1º ano</option>
                  <option>2º ano</option>
                  <option>3º ano</option>
                  <option>4º ano</option>
                  <option>5º ano</option>
                  <option>6º ano</option>
                  <option>7º ano</option>
                  <option>8º ano</option>
                  <option>9º ano</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditClass}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR ESTUDANTE */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-800">Adicionar Estudante</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="hover:bg-slate-100 p-2 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nome do Estudante *
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="Ex: joao@school.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddStudent}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Adicionar
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

export default TeacherClassesImproved;
