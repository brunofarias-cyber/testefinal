# 🔗 GUIA DE INTEGRAÇÃO - COMPONENTES REAL-TIME

## 📌 VISÃO GERAL

Este documento mostra como integrar os novos componentes real-time (`GradeSubmissionModal`, `AttendanceMarkingModal`, `StudentAttendanceView`) aos dashboards existentes.

---

## 1️⃣ INTEGRAÇÃO NO DASHBOARD DO PROFESSOR

### Adicionar Modal de Notas

**Arquivo:** `src/components/TeacherMasterControl.jsx` (ou seu componente de teacher)

```jsx
import { useState } from 'react';
import GradeSubmissionModal from './GradeSubmissionModal';

export default function TeacherMasterControl() {
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleOpenGradeModal = (studentId, studentName, projectId, projectTitle) => {
        setSelectedStudent({ studentId, studentName, projectId, projectTitle });
        setShowGradeModal(true);
    };

    return (
        <div>
            {/* Seu conteúdo existente */}
            
            {/* Botão para abrir modal */}
            <button
                onClick={() => handleOpenGradeModal(101, 'João Silva', 1, 'Horta Sustentável')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
                ✏️ Atribuir Nota
            </button>

            {/* Modal */}
            {showGradeModal && selectedStudent && (
                <GradeSubmissionModal
                    studentName={selectedStudent.studentName}
                    studentId={selectedStudent.studentId}
                    projectTitle={selectedStudent.projectTitle}
                    projectId={selectedStudent.projectId}
                    teacherName="Prof. Ana Silva"
                    onClose={() => setShowGradeModal(false)}
                    onSubmit={(data) => {
                        console.log('Nota enviada:', data);
                        setShowGradeModal(false);
                    }}
                />
            )}
        </div>
    );
}
```

---

### Adicionar Modal de Presença

**Arquivo:** `src/components/TeacherMasterControl.jsx`

```jsx
import { useState } from 'react';
import AttendanceMarkingModal from './AttendanceMarkingModal';

export default function TeacherMasterControl() {
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleOpenAttendanceModal = (studentId, studentName, classId, className) => {
        setSelectedStudent({ studentId, studentName, classId, className });
        setShowAttendanceModal(true);
    };

    return (
        <div>
            {/* Seu conteúdo existente */}
            
            {/* Botão para abrir modal */}
            <button
                onClick={() => handleOpenAttendanceModal(101, 'João Silva', 1, 'Biologia - Turma A')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
                ✅ Marcar Presença
            </button>

            {/* Modal */}
            {showAttendanceModal && selectedStudent && (
                <AttendanceMarkingModal
                    studentName={selectedStudent.studentName}
                    studentId={selectedStudent.studentId}
                    className={selectedStudent.className}
                    classId={selectedStudent.classId}
                    teacherName="Prof. Ana Silva"
                    onClose={() => setShowAttendanceModal(false)}
                    onSubmit={(data) => {
                        console.log('Presença marcada:', data);
                        setShowAttendanceModal(false);
                    }}
                />
            )}
        </div>
    );
}
```

---

## 2️⃣ INTEGRAÇÃO NO DASHBOARD DO ALUNO

### Adicionar Menu Item para Presença

**Arquivo:** `src/components/StudentDashboard.jsx` (ou seu componente de navegação)

```jsx
import StudentAttendanceView from './StudentAttendanceView';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function StudentDashboard() {
    const [currentView, setCurrentView] = useState('overview'); // 'overview' | 'attendance'

    return (
        <div>
            {/* Menu de navegação */}
            <nav className="space-y-2">
                {/* Itens existentes... */}
                
                <button
                    onClick={() => setCurrentView('attendance')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                        currentView === 'attendance' 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-slate-700 hover:bg-slate-100'
                    }`}
                >
                    <Calendar size={20} />
                    <span>Minha Presença</span>
                </button>
            </nav>

            {/* Conteúdo */}
            <div>
                {currentView === 'overview' && (
                    <div>{/* Seu overview */}</div>
                )}
                {currentView === 'attendance' && (
                    <StudentAttendanceView />
                )}
            </div>
        </div>
    );
}
```

---

## 3️⃣ EXEMPLO COMPLETO: TEACHER GRADING INTERFACE

```jsx
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import GradeSubmissionModal from './GradeSubmissionModal';

const TeacherGradingInterface = () => {
    const [students, setStudents] = useState([
        { id: 101, name: 'João Silva', projects: [
            { id: 1, title: 'Horta Sustentável', status: 'pendente' }
        ]},
        { id: 102, name: 'Maria Santos', projects: [
            { id: 1, title: 'Horta Sustentável', status: 'pendente' }
        ]}
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const openGradeModal = (studentId, studentName, projectId, projectTitle) => {
        setSelectedData({ studentId, studentName, projectId, projectTitle });
        setShowModal(true);
    };

    return (
        <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Avaliação de Projetos</h1>
                <p className="text-slate-600">Envie notas e feedback aos alunos em tempo real</p>
            </div>

            {/* Lista de Alunos */}
            <div className="space-y-4">
                {students.map(student => (
                    <div key={student.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{student.name}</h3>
                                <p className="text-sm text-slate-600">ID: {student.id}</p>
                            </div>
                        </div>

                        {/* Projetos */}
                        <div className="mt-4 space-y-3">
                            {student.projects.map(project => (
                                <div key={project.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-800">{project.title}</p>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Status: <span className="text-yellow-600 font-bold">{project.status}</span>
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => openGradeModal(
                                            student.id,
                                            student.name,
                                            project.id,
                                            project.title
                                        )}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                                    >
                                        ✏️ Avaliar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && selectedData && (
                <GradeSubmissionModal
                    studentName={selectedData.studentName}
                    studentId={selectedData.studentId}
                    projectTitle={selectedData.projectTitle}
                    projectId={selectedData.projectId}
                    teacherName="Prof. Ana Silva"
                    onClose={() => setShowModal(false)}
                    onSubmit={(data) => {
                        console.log('✅ Nota enviada:', data);
                        // Atualizar lista de projetos aqui
                        setShowModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default TeacherGradingInterface;
```

---

## 4️⃣ EXEMPLO COMPLETO: STUDENT OVERVIEW

```jsx
import React, { useState } from 'react';
import StudentGrades from './StudentGrades';
import StudentAttendanceView from './StudentAttendanceView';
import StudentOverview from './StudentOverview';

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: '📊 Visão Geral', icon: '🏠' },
        { id: 'grades', label: '📚 Notas', icon: '⭐' },
        { id: 'attendance', label: '📅 Presença', icon: '✅' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navigation */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-4 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto">
                {activeTab === 'overview' && <StudentOverview />}
                {activeTab === 'grades' && <StudentGrades />}
                {activeTab === 'attendance' && <StudentAttendanceView />}
            </div>
        </div>
    );
};

export default StudentDashboard;
```

---

## 5️⃣ DICAS DE INTEGRAÇÃO

### ✅ RECOMENDAÇÕES

1. **State Management**
   ```jsx
   // Use useState para controlar modal open/close
   const [showModal, setShowModal] = useState(false);
   
   // Passe callbacks ao modal
   <Modal onClose={() => setShowModal(false)} />
   ```

2. **Data Fetching**
   ```jsx
   // Após sucesso no modal, refetch dados
   onSubmit={(data) => {
       // Refetch grades/attendance aqui
       fetchGrades();
       setShowModal(false);
   }}
   ```

3. **Error Handling**
   ```jsx
   // O modal já trata erros
   // Mas você pode adicionar logs adicionais
   onSubmit={(data) => {
       if (data.success) {
           showSuccessNotification();
       }
   }}
   ```

### 🎨 ESTILO

Todos os componentes usam:
- `Tailwind CSS` para estilos
- `Lucide React` para ícones
- `Gradientes` do Tailwind
- `Animações` padrão (bounce, pulse)

Combine com seu theme existente!

### 📱 RESPONSIVIDADE

Todos os componentes são totalmente responsivos:
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

---

## 6️⃣ CHECKLIST DE INTEGRAÇÃO

- [ ] Importar componentes
- [ ] Adicionar useState para modal control
- [ ] Criar função para abrir modal
- [ ] Passar props corretas
- [ ] Testar modal opens/closes
- [ ] Testar API call quando submit
- [ ] Verificar notificação aparece no aluno
- [ ] Verificar UI atualiza em tempo real
- [ ] Testar com múltiplas abas abertas
- [ ] Verificar console para erros

---

## 7️⃣ TROUBLESHOOTING DE INTEGRAÇÃO

**Problem: Modal não abre**
```jsx
// Verify state management
const [showModal, setShowModal] = useState(false);
// Verify button onClick
onClick={() => setShowModal(true)}
// Verify modal render condition
{showModal && <Modal />}
```

**Problem: Props não passadas**
```jsx
// Verify todas as props obrigatórias
<Modal
    studentName="..." ✅
    studentId={...} ✅
    projectTitle="..." ✅
    projectId={...} ✅
    teacherName="..." ✅
    onClose={...} ✅
/>
```

**Problem: Socket.io não funciona após integração**
```jsx
// Verify server está rodando
// Verify studentId é 101 (ou o ID do aluno autenticado)
// Verify listener está no componente certo
```

---

## 🎯 RESULTADO FINAL

Após integração, você terá:

✅ Professor pode enviar notas via modal  
✅ Aluno recebe notificação instantaneamente  
✅ Nota aparece em tempo real  
✅ Professor pode marcar presença via modal  
✅ Aluno recebe notificação instantaneamente  
✅ Presença aparece em tempo real  
✅ Estatísticas atualizam automaticamente  

---

## 📚 PRÓXIMOS COMPONENTES

Seguindo o mesmo padrão:

1. **SubmissionUploadModal** - Aluno submete trabalho
2. **RubricDistributionModal** - Professor distribui rubrica
3. **FeedbackModal** - Professor deixa feedback detalhado

---

**Status**: ✅ Pronto para integração!

Qualquer dúvida, consulte `INDEX_REALTIME.md` ou `SESSION_SUMMARY.md`.
