import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import {
    Calendar,
    CheckSquare,
    FileText,
    Target,
    Users,
    Clock,
    Plus,
    Save,
    ChevronRight,
    ChevronDown,
    Edit,
    Trash2,
    Check,
    X,
    BookOpen,
    AlertCircle,
    Download,
    Upload,
    Award,
    BarChart2,
    BarChart,
    ClipboardList,
    Wand2,
    Sparkles,
    Edit2,
    CheckCircle,
    Star,
    BarChart3,
    Bell
} from "lucide-react";
import TeacherRubricEditablePoints from "./TeacherRubricEditablePoints";
import StudentGrades from "./StudentGrades";
import InteractiveEvaluation from "./InteractiveEvaluation";
import { QuickInfoSidebar } from "./TeacherSidebars";
import SidebarCollapseNew from "./SidebarCollapseNew";
import CollapsibleGestaoSection from "./CollapsibleGestaoSection";
import { allBnccCodes, getYearOptions, getAISuggestions } from "../constants/bnccCodes";

const TeacherMasterControl = ({ onNavigateTo }) => {
    const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, planning, calendar, attendance, evaluation, activities, grades, submissions, bncc
    const [evaluationTab, setEvaluationTab] = useState('individual'); // individual, group, rubrics
    const [rubricTab, setRubricTab] = useState('rubric1'); // rubric1, rubric2
    const [selectedClass, setSelectedClass] = useState('9A');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [planningSubTab, setPlanningSubTab] = useState('lessons'); // lessons, rubrics
    const [evaluationType, setEvaluationType] = useState('individual'); // individual, group
    
    // Socket.io
    const [socket, setSocket] = useState(null);
    const [notification, setNotification] = useState(null);
    
    // ===== ATIVIDADES STATE (Do TeacherCentralHub) =====
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

    // Estados para Planejamento
    const [lessons, setLessons] = useState([
        {
            id: 1,
            title: "Introdução ao Projeto Horta Sustentável",
            class: "9A",
            date: "2025-12-10",
            duration: "2h",
            objectives: ["Compreender sustentabilidade", "Planejar horta escolar"],
            bnccCodes: ["EF09CI13", "EF09GE15"],
            materials: ["Sementes", "Terra", "Ferramentas"],
            status: "planned"
        },
        {
            id: 2,
            title: "Ciclo da Água - Experimento Prático",
            class: "9B",
            date: "2025-12-12",
            duration: "1h30",
            objectives: ["Observar estados da água", "Registrar experimento"],
            bnccCodes: ["EF09CI11"],
            materials: ["Béquer", "Gelo", "Aquecedor"],
            status: "completed"
        }
    ]);

    // Estados para Calendário
    const [calendarEvents, setCalendarEvents] = useState([
        { id: 1, title: "Entrega Projeto Horta", date: "2025-12-15", type: "deadline", class: "9A", notifyStudents: true },
        { id: 2, title: "Prova de Ciências", date: "2025-12-18", type: "assessment", class: "9B", notifyStudents: true },
        { id: 3, title: "Reunião de Pais", date: "2025-12-20", type: "meeting", class: "Todas", notifyStudents: false },
        { id: 4, title: "Feira de Ciências", date: "2025-12-22", type: "event", class: "Todas", notifyStudents: true }
    ]);
    
    const [showNewEventForm, setShowNewEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: selectedDate,
        type: "event",
        class: selectedClass,
        notifyStudents: true
    });

    // Estados para Chamada
    const [attendanceData, setAttendanceData] = useState({
        '9A': [
            { id: 1, name: "Ana Silva", status: "present" },
            { id: 2, name: "Bruno Costa", status: "present" },
            { id: 3, name: "Carlos Santos", status: "absent" },
            { id: 4, name: "Diana Oliveira", status: "present" },
            { id: 5, name: "Eduardo Lima", status: "late" },
            { id: 6, name: "Fernanda Souza", status: "present" },
            { id: 7, name: "Gabriel Ferreira", status: "present" },
            { id: 8, name: "Helena Rodrigues", status: "present" }
        ],
        '9B': [
            { id: 1, name: "Igor Alves", status: "present" },
            { id: 2, name: "Julia Martins", status: "present" },
            { id: 3, name: "Lucas Pereira", status: "absent" },
            { id: 4, name: "Marina Castro", status: "present" }
        ]
    });

    // ===== NOTAS STATE (Do TeacherCentralHub) =====
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

    // ===== RÚBRICAS STATE (Consolidado) =====
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

    // ===== PRESENÇA STATE (Compatível com TeacherCentralHub) =====
    const [attendance, setAttendance] = useState([
        { id: 1, studentName: 'João Silva', date: '2024-12-11', status: 'Presente' },
        { id: 2, studentName: 'Maria Santos', date: '2024-12-11', status: 'Presente' },
        { id: 3, studentName: 'Pedro Costa', date: '2024-12-11', status: 'Falta' }
    ]);

    // ===== ENTREGAS STATE (Do TeacherCentralHub) =====
    const [submissions, setSubmissions] = useState([
        { id: 1, studentName: 'João Silva', projectTitle: 'Horta', fileName: 'horta.pdf', uploadedAt: '2024-11-15', status: 'pending' },
        { id: 2, studentName: 'Maria Santos', projectTitle: 'Robótica', fileName: 'robotica.docx', uploadedAt: '2024-11-14', status: 'graded' }
    ]);

    const [showNewLessonForm, setShowNewLessonForm] = useState(false);
    const [newLesson, setNewLesson] = useState({
        title: "",
        date: selectedDate,
        duration: "1h",
        objectives: "",
        bnccCodes: "",
        materials: ""
    });

    // Ativar sub-aba quando redirecionado da Central de Inteligência
    useEffect(() => {
        const tabToActivate = sessionStorage.getItem('masterControlTab');
        if (tabToActivate) {
            setActiveSection(tabToActivate);
            sessionStorage.removeItem('masterControlTab');
        }

        // Socket.io initialization
        const newSocket = io(import.meta.env.VITE_API_URL || window.location.origin);
        newSocket.on('connect', () => console.log('✅ Conectado ao servidor'));
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, []);

    // Estados para seleção de BNCC e sugestões de IA
    const [selectedBnccYear, setSelectedBnccYear] = useState('9º Ano');
    const [selectedBnccCodes, setSelectedBnccCodes] = useState([]);
    const [showBnccSelector, setShowBnccSelector] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [loadingAISuggestions, setLoadingAISuggestions] = useState(false);

    // Funções para BNCC
    const toggleBnccCode = (code) => {
        setSelectedBnccCodes(prev =>
            prev.includes(code)
                ? prev.filter(c => c !== code)
                : [...prev, code]
        );
    };

    const suggestBnccCodes = async () => {
        setLoadingAISuggestions(true);
        // Simular chamada à IA
        const suggestions = getAISuggestions(newLesson.title, newLesson.objectives);
        setTimeout(() => {
            setAiSuggestions(suggestions);
            setLoadingAISuggestions(false);
        }, 1000);
    };

    const addSuggestedCodes = () => {
        const newCodes = aiSuggestions.map(s => s.code).filter(code => !selectedBnccCodes.includes(code));
        setSelectedBnccCodes(prev => [...prev, ...newCodes]);
        setAiSuggestions([]);
    };

    // Funções de Chamada
    const toggleAttendance = (studentId, newStatus) => {
        setAttendanceData(prev => ({
            ...prev,
            [selectedClass]: prev[selectedClass].map(student =>
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        }));
    };

    const getAttendanceStats = () => {
        const students = attendanceData[selectedClass] || [];
        return {
            present: students.filter(s => s.status === 'present').length,
            absent: students.filter(s => s.status === 'absent').length,
            late: students.filter(s => s.status === 'late').length,
            total: students.length
        };
    };

    const exportAttendance = () => {
        const students = attendanceData[selectedClass] || [];
        const stats = getAttendanceStats();
        
        // Criar conteúdo CSV
        let csvContent = `Relatório de Chamada - Turma ${selectedClass}\n`;
        csvContent += `Data: ${new Date(selectedDate).toLocaleDateString('pt-BR')}\n\n`;
        csvContent += `Resumo:\n`;
        csvContent += `Total de Alunos: ${stats.total}\n`;
        csvContent += `Presentes: ${stats.present}\n`;
        csvContent += `Ausentes: ${stats.absent}\n`;
        csvContent += `Atrasados: ${stats.late}\n`;
        csvContent += `Taxa de Presença: ${Math.round((stats.present / stats.total) * 100)}%\n\n`;
        csvContent += `Aluno,Status\n`;
        
        students.forEach(student => {
            const statusText = student.status === 'present' ? 'Presente' : 
                             student.status === 'absent' ? 'Ausente' : 'Atrasado';
            csvContent += `${student.name},${statusText}\n`;
        });
        
        // Criar arquivo e baixar
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `chamada_${selectedClass}_${selectedDate}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const stats = getAttendanceStats();

    // Funções de Planejamento
    const addLesson = () => {
        const lesson = {
            id: Date.now(),
            ...newLesson,
            class: selectedClass,
            status: "planned",
            objectives: newLesson.objectives.split(',').map(o => o.trim()),
            bnccCodes: selectedBnccCodes.length > 0 ? selectedBnccCodes : newLesson.bnccCodes.split(',').map(c => c.trim()),
            materials: newLesson.materials.split(',').map(m => m.trim())
        };
        setLessons([...lessons, lesson]);
        setNewLesson({ title: "", date: selectedDate, duration: "1h", objectives: "", bnccCodes: "", materials: "" });
        setSelectedBnccCodes([]);
        setAiSuggestions([]);
        setShowNewLessonForm(false);
    };

    const deleteLesson = (id) => {
        setLessons(lessons.filter(l => l.id !== id));
    };

    // Funções de Calendário
    const addEvent = () => {
        const event = {
            id: Date.now(),
            ...newEvent
        };
        setCalendarEvents([...calendarEvents, event]);
        setNewEvent({ title: "", date: selectedDate, type: "event", class: selectedClass, notifyStudents: true });
        setShowNewEventForm(false);
    };

    const deleteEvent = (id) => {
        setCalendarEvents(calendarEvents.filter(e => e.id !== id));
    };

    // Funções de Atividades
    const [showActivityForm, setShowActivityForm] = useState(false);
    const [activityForm, setActivityForm] = useState({ title: '', description: '', dueDate: '', maxPoints: 100 });

    const handleAddActivity = () => {
        if (!activityForm.title || !activityForm.description || !activityForm.dueDate) {
            showNotification('Preencha todos os campos!', 'error');
            return;
        }
        const newActivity = {
            id: Date.now(),
            ...activityForm,
            status: 'active',
            submissionCount: 0,
            totalStudents: 30
        };
        setActivities([...activities, newActivity]);
        setActivityForm({ title: '', description: '', dueDate: '', maxPoints: 100 });
        setShowActivityForm(false);
        showNotification('Atividade criada com sucesso!', 'success');
    };

    const handleDeleteActivity = (id) => {
        setActivities(activities.filter(a => a.id !== id));
        showNotification('Atividade deletada!', 'success');
    };

    // Funções de Notificação
    const showNotification = (message, type = 'info') => {
        setNotification({ message, type, show: true });
        setTimeout(() => setNotification({ ...notification, show: false }), 3000);
    };

    // Renderização das Seções
    const renderPlanning = () => (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Planejamento & Rubricas</h2>
                    <p className="text-slate-600 text-sm">Organize suas aulas e defina critérios de avaliação</p>
                </div>
            </div>

            {/* Seção de Aulas */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">📚 Minhas Aulas</h3>
                <p className="text-slate-600 text-sm">Planeje e organize suas aulas com objetivos e materiais</p>
            </div>

            <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Aulas Planejadas</h3>
                        <button
                            onClick={() => setShowNewLessonForm(!showNewLessonForm)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Nova Aula
                        </button>
                    </div>

            {showNewLessonForm && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Planejar Nova Aula</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Título da Aula</label>
                            <input
                                type="text"
                                value={newLesson.title}
                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                placeholder="Ex: Introdução à Fotossíntese"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Data</label>
                                <input
                                    type="date"
                                    value={newLesson.date}
                                    onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Duração</label>
                                <select
                                    value={newLesson.duration}
                                    onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option>30min</option>
                                    <option>1h</option>
                                    <option>1h30</option>
                                    <option>2h</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Objetivos (separados por vírgula)</label>
                            <textarea
                                value={newLesson.objectives}
                                onChange={(e) => setNewLesson({ ...newLesson, objectives: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                rows="2"
                                placeholder="Compreender fotossíntese, Identificar clorofila"
                            />
                        </div>
                        
                        {/* Nova seção: Seletor de BNCC com IA */}
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5">
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-bold text-slate-700">Competências BNCC (6º ao 2º ano)</label>
                                <button
                                    onClick={suggestBnccCodes}
                                    disabled={loadingAISuggestions || !newLesson.title}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:shadow-lg transition disabled:opacity-50"
                                >
                                    <Sparkles size={14} />
                                    {loadingAISuggestions ? 'Sugerindo...' : 'Sugerir com IA'}
                                </button>
                            </div>

                            {/* Seletor de Ano */}
                            <div className="mb-4">
                                <select
                                    value={selectedBnccYear}
                                    onChange={(e) => {
                                        setSelectedBnccYear(e.target.value);
                                        setSelectedBnccCodes([]);
                                    }}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white font-bold text-slate-700"
                                >
                                    {getYearOptions().map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Grid de Seleção de Códigos */}
                            <div className="max-h-64 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-3">
                                    {allBnccCodes[selectedBnccYear]?.map((comp) => (
                                        <label
                                            key={comp.code}
                                            className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                                                selectedBnccCodes.includes(comp.code)
                                                    ? 'bg-blue-200 border-blue-600'
                                                    : 'bg-white border-slate-200 hover:border-blue-400'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBnccCodes.includes(comp.code)}
                                                onChange={() => toggleBnccCode(comp.code)}
                                                className="mt-1"
                                            />
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">{comp.code}</p>
                                                <p className="text-xs text-slate-600">{comp.theme}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Mostra Sugestões de IA */}
                            {aiSuggestions.length > 0 && (
                                <div className="mt-4 p-4 bg-purple-100 border-2 border-purple-400 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Wand2 size={18} className="text-purple-600" />
                                            <p className="font-bold text-slate-800">Sugestões de IA ({aiSuggestions.length})</p>
                                        </div>
                                        <button
                                            onClick={addSuggestedCodes}
                                            className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-purple-700"
                                        >
                                            Adicionar Sugeridas
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {aiSuggestions.map((suggestion) => (
                                            <div key={suggestion.code} className="bg-white p-2 rounded border border-purple-300">
                                                <p className="font-bold text-sm text-slate-900">{suggestion.code}</p>
                                                <p className="text-xs text-slate-600 line-clamp-2">{suggestion.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Códigos Selecionados */}
                            {selectedBnccCodes.length > 0 && (
                                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-300">
                                    <p className="text-xs font-bold text-slate-600 mb-2">CÓDIGOS SELECIONADOS ({selectedBnccCodes.length})</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedBnccCodes.map(code => (
                                            <span
                                                key={code}
                                                onClick={() => toggleBnccCode(code)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-700 flex items-center gap-2"
                                            >
                                                {code}
                                                <X size={12} />
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Materiais (separados por vírgula)</label>
                            <input
                                type="text"
                                value={newLesson.materials}
                                onChange={(e) => setNewLesson({ ...newLesson, materials: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                placeholder="Microscópio, Lâminas, Folhas"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={addLesson} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2">
                                <Save size={18} />
                                Salvar Aula
                            </button>
                            <button onClick={() => setShowNewLessonForm(false)} className="bg-slate-300 text-slate-800 px-6 py-2 rounded-lg font-bold hover:bg-slate-400 transition">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {lessons.filter(l => l.class === selectedClass).map((lesson) => (
                    <div key={lesson.id} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900">{lesson.title}</h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        {new Date(lesson.date).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={16} />
                                        {lesson.duration}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        lesson.status === 'completed' ? 'bg-green-200 text-green-800' :
                                        lesson.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                                        'bg-slate-200 text-slate-800'
                                    }`}>
                                        {lesson.status === 'completed' ? '✓ Concluída' :
                                         lesson.status === 'in-progress' ? '▶ Em Andamento' : '○ Planejada'}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => deleteLesson(lesson.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Objetivos</p>
                                <ul className="space-y-1">
                                    {lesson.objectives.map((obj, idx) => (
                                        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Competências BNCC</p>
                                <div className="flex flex-wrap gap-2">
                                    {lesson.bnccCodes.map((code, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-bold">
                                            {code}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Materiais Necessários</p>
                            <div className="flex flex-wrap gap-2">
                                {lesson.materials.map((material, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                        {material}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );

    const renderCalendar = () => (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Calendário de Eventos</h2>
                    <p className="text-slate-600 text-sm">Crie e gerencie prazos, reuniões e eventos</p>
                </div>
                <button
                    onClick={() => setShowNewEventForm(!showNewEventForm)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Novo Evento
                </button>
            </div>

            {showNewEventForm && (
                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-4">Criar Novo Evento</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Título do Evento</label>
                            <input
                                type="text"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                placeholder="Ex: Entrega do Projeto Final"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Data</label>
                                <input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tipo</label>
                                <select
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                >
                                    <option value="deadline">⏰ Prazo de Entrega</option>
                                    <option value="assessment">📝 Avaliação/Prova</option>
                                    <option value="meeting">👥 Reunião</option>
                                    <option value="event">🎉 Evento</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Turma</label>
                            <select
                                value={newEvent.class}
                                onChange={(e) => setNewEvent({ ...newEvent, class: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                            >
                                <option value="9A">Turma 9A</option>
                                <option value="9B">Turma 9B</option>
                                <option value="Todas">Todas as Turmas</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="notifyStudents"
                                checked={newEvent.notifyStudents}
                                onChange={(e) => setNewEvent({ ...newEvent, notifyStudents: e.target.checked })}
                                className="w-5 h-5 text-purple-600"
                            />
                            <label htmlFor="notifyStudents" className="text-sm font-bold text-slate-700">
                                🔔 Notificar alunos sobre este evento
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={addEvent} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2">
                                <Save size={18} />
                                Criar Evento
                            </button>
                            <button onClick={() => setShowNewEventForm(false)} className="bg-slate-300 text-slate-800 px-6 py-2 rounded-lg font-bold hover:bg-slate-400 transition">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {calendarEvents.filter(e => e.class === selectedClass || e.class === 'Todas').map((event) => (
                    <div key={event.id} className={`rounded-xl p-6 border-2 ${
                        event.type === 'deadline' ? 'bg-red-50 border-red-300' :
                        event.type === 'assessment' ? 'bg-orange-50 border-orange-300' :
                        event.type === 'meeting' ? 'bg-blue-50 border-blue-300' :
                        'bg-purple-50 border-purple-300'
                    }`}>
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-slate-900">{event.title}</h3>
                                <p className="text-sm text-slate-600 mt-1">{event.class}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    event.type === 'deadline' ? 'bg-red-200 text-red-800' :
                                    event.type === 'assessment' ? 'bg-orange-200 text-orange-800' :
                                    event.type === 'meeting' ? 'bg-blue-200 text-blue-800' :
                                    'bg-purple-200 text-purple-800'
                                }`}>
                                    {event.type === 'deadline' ? '⏰ Prazo' :
                                     event.type === 'assessment' ? '📝 Avaliação' :
                                     event.type === 'meeting' ? '👥 Reunião' : '🎉 Evento'}
                                </span>
                                <button onClick={() => deleteEvent(event.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 mb-2">
                            <Calendar size={18} />
                            <span className="font-bold">{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {event.notifyStudents && (
                            <div className="flex items-center gap-2 text-green-700 text-sm">
                                <Check size={16} />
                                <span className="font-bold">Alunos serão notificados</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAttendance = () => (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Chamada - {selectedDate}</h2>
                    <p className="text-slate-600 text-sm">Registre a presença dos alunos</p>
                </div>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-2 border-2 border-slate-300 rounded-lg font-bold"
                />
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                    <p className="text-sm font-bold text-green-700">Presentes</p>
                    <p className="text-3xl font-extrabold text-green-800">{stats.present}</p>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                    <p className="text-sm font-bold text-red-700">Ausentes</p>
                    <p className="text-3xl font-extrabold text-red-800">{stats.absent}</p>
                </div>
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                    <p className="text-sm font-bold text-yellow-700">Atrasados</p>
                    <p className="text-3xl font-extrabold text-yellow-800">{stats.late}</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                    <p className="text-sm font-bold text-blue-700">Total</p>
                    <p className="text-3xl font-extrabold text-blue-800">{stats.total}</p>
                </div>
            </div>

            {/* Lista de Alunos */}
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="text-left p-4 font-bold text-slate-700">Aluno</th>
                            <th className="text-center p-4 font-bold text-slate-700">Status</th>
                            <th className="text-center p-4 font-bold text-slate-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(attendanceData[selectedClass] || []).map((student) => (
                            <tr key={student.id} className="border-t border-slate-200 hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                            student.status === 'present' ? 'bg-green-600' :
                                            student.status === 'absent' ? 'bg-red-600' :
                                            'bg-yellow-600'
                                        }`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <span className="font-bold text-slate-900">{student.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                        student.status === 'present' ? 'bg-green-100 text-green-800' :
                                        student.status === 'absent' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {student.status === 'present' ? '✓ Presente' :
                                         student.status === 'absent' ? '✗ Ausente' : '⌚ Atrasado'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => toggleAttendance(student.id, 'present')}
                                            className={`p-2 rounded-lg transition ${
                                                student.status === 'present' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-green-100'
                                            }`}
                                            title="Presente"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => toggleAttendance(student.id, 'late')}
                                            className={`p-2 rounded-lg transition ${
                                                student.status === 'late' ? 'bg-yellow-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-yellow-100'
                                            }`}
                                            title="Atrasado"
                                        >
                                            <Clock size={18} />
                                        </button>
                                        <button
                                            onClick={() => toggleAttendance(student.id, 'absent')}
                                            className={`p-2 rounded-lg transition ${
                                                student.status === 'absent' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-red-100'
                                            }`}
                                            title="Ausente"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-between">
                <button 
                    onClick={exportAttendance}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
                >
                    <Download size={20} />
                    Exportar Chamada (CSV)
                </button>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2">
                    <Save size={20} />
                    Salvar Chamada
                </button>
            </div>
        </div>
    );

    const bnccCompetences = {
        'Ciências - 9º Ano': [
            // Vida e Evolução
            {
                code: 'EF09CI11',
                description: 'Discutir a evolução e a diversidade das espécies com base na atuação da seleção natural sobre as variantes de uma mesma espécie.',
                themes: ['Evolução', 'Seleção Natural', 'Biodiversidade'],
                suggestion: 'Atividade: Estudar casos de evolução (ex: beija-flores, tentilhões de Darwin)',
                covered: true,
                lessons: ['Introdução ao Projeto Horta', 'Ciclo da Água'],
                iaPrompt: 'Como posso criar uma atividade sobre seleção natural usando exemplos locais da minha região?'
            },
            {
                code: 'EF09CI12',
                description: 'Justificar a importância das unidades de conservação para a preservação da biodiversidade e do patrimônio nacional.',
                themes: ['Conservação', 'Biodiversidade', 'Meio Ambiente'],
                suggestion: 'Projeto: Visita a parque nacional ou criação de mini-reserva na escola',
                covered: false,
                lessons: [],
                iaPrompt: 'Sugira um projeto sobre conservação que envolva a comunidade escolar'
            },
            {
                code: 'EF09CI13',
                description: 'Propor iniciativas individuais e coletivas para a solução de problemas ambientais da cidade ou da comunidade.',
                themes: ['Sustentabilidade', 'Ação Social', 'Meio Ambiente'],
                suggestion: 'Projeto: Horta sustentável, coleta seletiva ou campanha de conscientização',
                covered: true,
                lessons: ['Introdução ao Projeto Horta'],
                iaPrompt: 'Como criar um projeto de sustentabilidade que envolva toda a escola?'
            },
            // Terra e Universo
            {
                code: 'EF09CI14',
                description: 'Descrever a composição e a estrutura do Sistema Solar (Sol, planetas rochosos, planetas gigantes gasosos e corpos menores).',
                themes: ['Astronomia', 'Sistema Solar', 'Universo'],
                suggestion: 'Atividade: Maquete do Sistema Solar ou observação astronômica',
                covered: false,
                lessons: [],
                iaPrompt: 'Como ensinar Sistema Solar de forma prática e visual para 9º ano?'
            },
            {
                code: 'EF09CI15',
                description: 'Relacionar diferentes leituras do céu e explicações sobre a origem da Terra, do Sol ou do Sistema Solar às necessidades de distintas culturas.',
                themes: ['Cosmologia', 'Cultura', 'História da Ciência'],
                suggestion: 'Pesquisa: Mitos de criação de diferentes culturas e teorias científicas',
                covered: true,
                lessons: ['Ciclo da Água'],
                iaPrompt: 'Como integrar mitologia e ciência no ensino de astronomia?'
            },
            {
                code: 'EF09CI16',
                description: 'Selecionar argumentos sobre a viabilidade da sobrevivência humana fora da Terra, com base nas condições necessárias à vida.',
                themes: ['Vida', 'Espaço', 'Condições Ambientais'],
                suggestion: 'Debate: Colonização de Marte - possibilidades e desafios',
                covered: false,
                lessons: [],
                iaPrompt: 'Crie um debate estruturado sobre colonização espacial para 9º ano'
            },
            {
                code: 'EF09CI17',
                description: 'Analisar o ciclo evolutivo do Sol (nascimento, vida e morte) e de outras estrelas.',
                themes: ['Astronomia', 'Estrelas', 'Evolução Estelar'],
                suggestion: 'Atividade: Linha do tempo da vida das estrelas com imagens',
                covered: false,
                lessons: [],
                iaPrompt: 'Como explicar o ciclo de vida das estrelas de forma didática?'
            },
            // Matéria e Energia
            {
                code: 'EF09CI01',
                description: 'Investigar as mudanças de estado físico da matéria e explicar essas transformações com base no modelo de constituição submicroscópica.',
                themes: ['Estados Físicos', 'Matéria', 'Termodinâmica'],
                suggestion: 'Experimento: Observar mudanças de estado com água, gelo e vapor',
                covered: false,
                lessons: [],
                iaPrompt: 'Sugira experimentos práticos sobre mudanças de estado da matéria'
            },
            {
                code: 'EF09CI02',
                description: 'Comparar quantidades de reagentes e produtos envolvidos em transformações químicas, estabelecendo a proporção entre suas massas.',
                themes: ['Reações Químicas', 'Estequiometria', 'Conservação de Massa'],
                suggestion: 'Experimento: Lei de Lavoisier com reações químicas simples',
                covered: false,
                lessons: [],
                iaPrompt: 'Como ensinar estequiometria de forma prática para iniciantes?'
            },
            {
                code: 'EF09CI03',
                description: 'Identificar modelos que descrevem a estrutura da matéria (constituição do átomo e composição de moléculas simples) e reconhecer sua evolução histórica.',
                themes: ['Átomo', 'Moléculas', 'História da Química'],
                suggestion: 'Atividade: Linha do tempo dos modelos atômicos',
                covered: false,
                lessons: [],
                iaPrompt: 'Como apresentar a evolução dos modelos atômicos de forma interessante?'
            },
            {
                code: 'EF09CI04',
                description: 'Planejar e executar experimentos que evidenciem que todas as cores de luz podem ser formadas pela composição das três cores primárias da luz e que a cor de um objeto está relacionada também à cor da luz que o ilumina.',
                themes: ['Luz', 'Cores', 'Óptica'],
                suggestion: 'Experimento: Disco de Newton e cores primárias da luz',
                covered: false,
                lessons: [],
                iaPrompt: 'Sugira experimentos sobre luz e cores usando materiais acessíveis'
            },
            {
                code: 'EF09CI05',
                description: 'Investigar os principais mecanismos envolvidos na transmissão e recepção de imagem e som que revolucionaram os sistemas de comunicação humana.',
                themes: ['Comunicação', 'Ondas', 'Tecnologia'],
                suggestion: 'Projeto: Pesquisa sobre evolução das telecomunicações',
                covered: false,
                lessons: [],
                iaPrompt: 'Como criar projeto sobre telecomunicações conectando física e sociedade?'
            },
            {
                code: 'EF09CI06',
                description: 'Classificar as radiações eletromagnéticas por suas frequências, fontes e aplicações, discutindo sua segurança e prevenção em relação à saúde.',
                themes: ['Ondas Eletromagnéticas', 'Radiação', 'Saúde'],
                suggestion: 'Debate: Uso seguro de celulares e radiações',
                covered: false,
                lessons: [],
                iaPrompt: 'Como abordar radiações eletromagnéticas de forma equilibrada e científica?'
            },
            {
                code: 'EF09CI07',
                description: 'Discutir o papel do avanço tecnológico na aplicação das radiações na medicina diagnóstica (raio X, ultrassom, ressonância nuclear magnética) e no tratamento de doenças (radioterapia, cirurgia ótica a laser, infravermelho, ultravioleta etc.).',
                themes: ['Medicina', 'Tecnologia', 'Radiação'],
                suggestion: 'Pesquisa: Aplicações médicas das radiações',
                covered: false,
                lessons: [],
                iaPrompt: 'Como explicar tecnologias médicas baseadas em radiação para alunos?'
            },
            {
                code: 'EF09CI08',
                description: 'Associar os gametas à transmissão das características hereditárias, estabelecendo relações entre ancestrais e descendentes.',
                themes: ['Genética', 'Hereditariedade', 'Reprodução'],
                suggestion: 'Atividade: Árvore genealógica e características herdadas',
                covered: false,
                lessons: [],
                iaPrompt: 'Como ensinar genética básica de forma prática e visual?'
            },
            {
                code: 'EF09CI09',
                description: 'Discutir as ideias de Mendel sobre hereditariedade (fatores hereditários, segregação, gametas, fecundação), considerando-as para resolver problemas envolvendo a transmissão de características hereditárias em diferentes organismos.',
                themes: ['Leis de Mendel', 'Genética', 'Hereditariedade'],
                suggestion: 'Atividade: Cruzamentos genéticos com quadro de Punnett',
                covered: false,
                lessons: [],
                iaPrompt: 'Como tornar as Leis de Mendel mais interessantes para os alunos?'
            },
            {
                code: 'EF09CI10',
                description: 'Comparar as ideias evolucionistas de Lamarck e Darwin apresentadas em textos científicos e históricos, identificando semelhanças e diferenças entre essas ideias e sua importância para explicar a diversidade biológica.',
                themes: ['Evolução', 'História da Ciência', 'Biodiversidade'],
                suggestion: 'Debate: Lamarck vs Darwin - teorias evolutivas',
                covered: false,
                lessons: [],
                iaPrompt: 'Como comparar as teorias de Lamarck e Darwin de forma didática?'
            }
        ]
    };

    const coveredCount = bnccCompetences['Ciências - 9º Ano'].filter(c => c.covered).length;
    const totalCount = bnccCompetences['Ciências - 9º Ano'].length;
    const percentageCovered = Math.round((coveredCount / totalCount) * 100);

    const renderBNCC = () => (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Competências BNCC - Guia Completo</h2>
                <p className="text-slate-600 text-sm">Acompanhe a cobertura curricular com sugestões de atividades</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Cobertura BNCC - Turma {selectedClass}</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-bold text-slate-600">Competências Cobertas</p>
                        <p className="text-4xl font-extrabold text-green-600">{coveredCount}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-bold text-slate-600">Total Esperado</p>
                        <p className="text-4xl font-extrabold text-blue-600">{totalCount}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <p className="text-sm font-bold text-slate-600">Percentual</p>
                        <p className="text-4xl font-extrabold text-purple-600">{percentageCovered}%</p>
                    </div>
                </div>
                
                {/* Barra de Progresso */}
                <div className="mt-4">
                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 transition-all duration-500"
                            style={{ width: `${percentageCovered}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <BookOpen size={24} className="text-blue-600" />
                        Ciências - 9º Ano
                    </h4>
                    <div className="space-y-4">
                        {bnccCompetences['Ciências - 9º Ano'].map((comp) => (
                            <div key={comp.code} className={`rounded-xl p-5 border-2 ${
                                comp.covered ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                            }`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3 flex-1">
                                        {comp.covered ? (
                                            <Check size={24} className="text-green-600 mt-1" />
                                        ) : (
                                            <AlertCircle size={24} className="text-red-600 mt-1" />
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-extrabold text-lg text-slate-900">{comp.code}</span>
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                                                    comp.covered ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                                }`}>
                                                    {comp.covered ? '✓ Coberta' : '✗ Pendente'}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 text-sm leading-relaxed mb-3">{comp.description}</p>
                                            
                                            {/* Temas */}
                                            <div className="mb-3">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Temas Relacionados</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {comp.themes.map((theme, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                                                            {theme}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Sugestão */}
                                            <div className={`p-3 rounded-lg border ${
                                                comp.covered ? 'bg-white border-green-200' : 'bg-yellow-50 border-yellow-300'
                                            }`}>
                                                <p className="text-xs font-bold text-slate-600 uppercase mb-1">
                                                    {comp.covered ? '✓ Como foi trabalhado' : '💡 Sugestão de Atividade'}
                                                </p>
                                                <p className="text-sm text-slate-700 font-semibold">{comp.suggestion}</p>
                                            </div>
                                            
                                            {/* Botão Consultar IA */}
                                            <div className="mt-3">
                                                <button 
                                                    onClick={() => {
                                                        // Armazenar o prompt na sessão
                                                        sessionStorage.setItem('bncc_ia_prompt', comp.iaPrompt);
                                                        sessionStorage.setItem('bncc_competencia', comp.code);
                                                        // Redirecionar para Copiloto IA
                                                        if (onNavigateTo) {
                                                            onNavigateTo('teacher-copilot');
                                                        }
                                                    }}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <Target size={16} />
                                                    🤖 Consultar IA sobre esta competência
                                                </button>
                                            </div>
                                            
                                            {/* Aulas que cobriram */}
                                            {comp.covered && comp.lessons.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Coberta nas Aulas</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {comp.lessons.map((lesson, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                                                                {lesson}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );

    // Renderizar Avaliação
    const renderEvaluation = () => {
        // Guard clause para evitar erros de undefined
        if (!attendanceData || !attendanceData[selectedClass]) {
            return (
                <div className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center">
                    <AlertCircle size={32} className="mx-auto mb-3 text-yellow-600" />
                    <h3 className="text-lg font-bold text-yellow-900 mb-2">Dados de Turma Indisponíveis</h3>
                    <p className="text-yellow-800">Selecione uma turma válida para acessar a avaliação</p>
                </div>
            );
        }

        return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Avaliação com Rubricas</h2>
                <p className="text-slate-600 text-sm">Avalie alunos individualmente ou por grupo usando as mesmas rubricas</p>
            </div>

            {/* Tabs de Avaliação: Individual, Grupo, Rubricas */}
            <div className="flex gap-2 border-b-2 border-slate-200 mb-6 bg-white rounded-t-xl p-4">
                <button 
                    onClick={() => setEvaluationTab('individual')}
                    className={`px-6 py-3 font-bold flex items-center gap-2 transition-all rounded-t-lg ${
                        evaluationTab === 'individual' 
                            ? 'bg-blue-100 text-blue-600 border-b-4 border-blue-600' 
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Users size={20} />
                    Individual
                </button>
                <button 
                    onClick={() => setEvaluationTab('group')}
                    className={`px-6 py-3 font-bold flex items-center gap-2 transition-all rounded-t-lg ${
                        evaluationTab === 'group' 
                            ? 'bg-green-100 text-green-600 border-b-4 border-green-600' 
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Users size={20} />
                    Por Grupo
                </button>
                <button 
                    onClick={() => setEvaluationTab('rubrics')}
                    className={`px-6 py-3 font-bold flex items-center gap-2 transition-all rounded-t-lg ${
                        evaluationTab === 'rubrics' 
                            ? 'bg-purple-100 text-purple-600 border-b-4 border-purple-600' 
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Award size={20} />
                    Rúbricas
                </button>
            </div>

            {/* Conteúdo condicional baseado na tab */}
            {evaluationTab !== 'rubrics' && (
            <div>
            {/* Seletor de Tipo de Avaliação */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-4 mb-6">
                <div className="flex gap-3">
                        <button
                            onClick={() => setEvaluationType('individual')}
                            className={`flex-1 py-3 px-6 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                                evaluationType === 'individual'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <Users size={20} />
                            👤 Avaliação Individual
                        </button>
                        <button
                            onClick={() => setEvaluationType('group')}
                            className={`flex-1 py-3 px-6 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                                evaluationType === 'group'
                                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            <Users size={20} />
                            👥 Avaliação por Grupo
                        </button>
                </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart2 size={28} className="text-green-600" />
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">
                                Desempenho da Turma {selectedClass} - {evaluationType === 'individual' ? 'Individual' : 'Por Grupo'}
                            </h3>
                            <p className="text-sm text-slate-600">Notas calculadas automaticamente pelas rubricas definidas</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm font-bold text-slate-600">Média Geral</p>
                            <p className="text-4xl font-extrabold text-green-600">8.5</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm font-bold text-slate-600">
                                {evaluationType === 'individual' ? 'Alunos' : 'Grupos'} Avaliados
                            </p>
                            <p className="text-4xl font-extrabold text-blue-600">
                                {evaluationType === 'individual' ? (attendanceData[selectedClass]?.length || 0) : '4'}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <p className="text-sm font-bold text-slate-600">Projetos Ativos</p>
                            <p className="text-4xl font-extrabold text-purple-600">3</p>
                        </div>
                    </div>
                </div>

                {/* Conteúdo baseado no tipo de avaliação */}
                {evaluationType === 'individual' ? (
                    <div>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                👤 Avaliação Individual - Criar e Avaliar com Rubricas
                            </h3>
                            <p className="text-sm text-slate-600 mb-3">
                                Primeiro, crie ou selecione uma rubrica para avaliar seus alunos. Depois, clique em cada aluno para avaliar individualmente.
                            </p>
                        </div>

                        {/* Criação de Rubrica para Individual */}
                        <div className="mb-8 bg-white rounded-xl border-2 border-blue-300 p-6">
                            <h4 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                                <FileText size={24} />
                                📋 Criar Rubrica para Avaliação Individual
                            </h4>
                            <TeacherRubricEditablePoints />
                        </div>

                        {/* Divisor Visual */}
                        <div className="border-t-4 border-dashed border-slate-300 my-8"></div>

                        {/* Avaliação Individual */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 mb-6">
                            <h4 className="text-xl font-bold text-purple-900 mb-2 flex items-center gap-2">
                                <Users size={24} />
                                Avaliar Alunos Individualmente
                            </h4>
                            <p className="text-sm text-purple-800">
                                Clique em cada aluno para expandir e avaliar usando a rubrica criada acima. 
                                Clique nos níveis de desempenho para atribuir pontos.
                            </p>
                        </div>
                        <InteractiveEvaluation 
                            selectedClass={selectedClass} 
                            attendanceData={attendanceData} 
                        />
                    </div>
                ) : (
                    <div>
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                👥 Avaliação por Grupo - Criar e Avaliar com Rubricas
                            </h3>
                            <p className="text-sm text-slate-600">
                                Primeiro, crie ou selecione uma rubrica para avaliar suas equipes. A nota do grupo será aplicada a todos os membros.
                            </p>
                        </div>

                        {/* Criação de Rubrica para Grupos */}
                        <div className="bg-white rounded-xl border-2 border-green-300 p-6">
                            <h4 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                                <FileText size={24} />
                                📋 Criar Rubrica para Avaliação de Equipes
                            </h4>
                            <div className="mb-6 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6">
                                <div className="flex items-start gap-3">
                                    <Users size={24} className="text-green-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <h5 className="font-bold text-lg text-green-900 mb-2">Como Funciona</h5>
                                        <p className="text-green-800 text-sm mb-2">
                                            Use o avaliador de rubricas abaixo para criar critérios e atribuir notas às equipes. 
                                            Todos os membros da equipe receberão a mesma nota baseada nos critérios avaliados.
                                        </p>
                                        <p className="text-green-800 text-xs font-bold">
                                            💡 Dica: Use critérios como "Trabalho em Equipe", "Colaboração" e "Divisão de Tarefas" para avaliar a dinâmica do grupo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <TeacherRubricEditablePoints />
                        </div>
                    </div>
                )}

                <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-lg text-blue-900 mb-2">
                                {evaluationType === 'individual' ? '📋 Individual' : '👥 Grupo'} + Mesma Rubrica
                            </h4>
                            <p className="text-blue-800 text-sm mb-2">
                                {evaluationType === 'individual' ? (
                                    <>
                                        As avaliações individuais usam as <strong>rubricas criadas acima</strong> nesta seção. 
                                        Cada aluno é avaliado separadamente nos mesmos critérios, permitindo análise individual detalhada.
                                    </>
                                ) : (
                                    <>
                                        A avaliação por grupo usa as <strong>rubricas criadas acima</strong> nesta seção. 
                                        A nota atribuída ao grupo é aplicada a todos os membros, mas você pode fazer ajustes individuais posteriormente 
                                        através da aba de Avaliação Individual.
                                    </>
                                )}
                            </p>
                            <div className="mt-3 bg-white rounded-lg p-3">
                                <p className="text-xs font-bold text-blue-900 uppercase mb-1">💡 Dica</p>
                                <p className="text-xs text-blue-800">
                                    {evaluationType === 'individual' 
                                        ? 'Comece avaliando o desempenho do grupo e depois faça ajustes individuais para diferenciar contribuições.'
                                        : 'Use critérios como "Trabalho em Equipe" e "Colaboração" para avaliar a dinâmica do grupo.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {/* Aba de Rúbricas */}
            {evaluationTab === 'rubrics' && (
            <div className="space-y-4">
                {/* Sub-abas para Rubricas */}
                <div className="flex gap-2 border-b-2 border-slate-200 mb-4 bg-white rounded-xl p-4">
                    <button 
                        onClick={() => setRubricTab('rubric1')}
                        className={`px-6 py-3 font-bold flex items-center gap-2 transition-all ${
                            rubricTab === 'rubric1' 
                                ? 'text-blue-600 border-b-4 border-blue-600' 
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Award size={20} />
                        Rubrica de Criatividade
                    </button>
                    <button 
                        onClick={() => setRubricTab('rubric2')}
                        className={`px-6 py-3 font-bold flex items-center gap-2 transition-all ${
                            rubricTab === 'rubric2' 
                                ? 'text-blue-600 border-b-4 border-blue-600' 
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <Award size={20} />
                        Rubrica de Execução
                    </button>
                </div>
                
                {/* Conteúdo da rubrica selecionada */}
                <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                    {rubricTab === 'rubric1' && (
                        <div className="bg-white p-4 rounded-lg border-2 border-slate-200">
                            <TeacherRubricEditablePoints rubrics={[rubrics[0]]} setRubrics={setRubrics} />
                        </div>
                    )}
                    {rubricTab === 'rubric2' && (
                        <div className="bg-white p-4 rounded-lg border-2 border-slate-200">
                            <TeacherRubricEditablePoints rubrics={[rubrics[1]]} setRubrics={setRubrics} />
                        </div>
                    )}
                </div>
            </div>
            )}
        </div>
        );
    };

    const renderActivities = () => (
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
                                <p className="font-bold text-slate-800">{activity.dueDate}</p>
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
    );

    const renderGrades = () => (
        <StudentGrades grades={grades} setGrades={setGrades} />
    );

    const renderDashboard = () => (
        <div className="space-y-4">
            {/* Welcome Card - Minimalista */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold">Bem-vindo! 👋</h2>
                        <p className="text-indigo-100 text-xs mt-0.5">Turma {selectedClass}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl">
                        ⚡
                    </div>
                </div>
            </div>

            {/* Grid de 3 Ações Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Card 1: Planejamento */}
                <div className="bg-white rounded-lg border-2 border-blue-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">Planejamento</p>
                            <p className="text-2xl font-extrabold text-slate-900 mt-1">{lessons.filter(l => l.class === selectedClass).length}</p>
                            <p className="text-xs text-slate-600 mt-0.5">Aulas planejadas</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText size={18} className="text-blue-600" />
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveSection('planning')}
                        className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors"
                    >
                        Ver Aulas
                    </button>
                </div>

                {/* Card 2: Chamada */}
                <div className="bg-white rounded-lg border-2 border-green-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Chamada</p>
                            <p className="text-2xl font-extrabold text-green-600 mt-1">{(attendanceData[selectedClass] || []).filter(s => s.status === 'present').length}</p>
                            <p className="text-xs text-slate-600 mt-0.5">Presentes hoje</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckSquare size={18} className="text-green-600" />
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveSection('attendance')}
                        className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm transition-colors"
                    >
                        Fazer Chamada
                    </button>
                </div>

                {/* Card 3: Avaliação */}
                <div className="bg-white rounded-lg border-2 border-purple-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">Avaliação</p>
                            <p className="text-2xl font-extrabold text-slate-900 mt-1">{rubrics.length}</p>
                            <p className="text-xs text-slate-600 mt-0.5">Rúbricas ativas</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Star size={18} className="text-purple-600" />
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveSection('evaluation')}
                        className="w-full mt-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm transition-colors"
                    >
                        Avaliar
                    </button>
                </div>
            </div>

            {/* Quick Info - Mínimo */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Status Rápido</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{activities.length}</p>
                        <p className="text-xs text-slate-600">Atividades</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">30</p>
                        <p className="text-xs text-slate-600">Alunos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">5</p>
                        <p className="text-xs text-slate-600">Avaliações</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">92%</p>
                        <p className="text-xs text-slate-600">Taxa Entrega</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSubmissions = () => (
        <InteractiveEvaluation submissions={submissions} setSubmissions={setSubmissions} />
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Ultra-Compacto com Gestão Horizontal */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 gap-4">
                    {/* Título + Turma */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            ⚡
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base font-extrabold text-slate-900 truncate">Central do Professor</h1>
                            <p className="text-xs text-slate-500">Turma {selectedClass}</p>
                        </div>
                    </div>

                    {/* Gestão Horizontal - Colapsável */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0 border-l border-slate-200 pl-4">
                        <div className="flex items-center gap-1 text-xs">
                            <span className="font-bold text-indigo-600">{activities.length}</span>
                            <span className="text-slate-600">Atividades</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <div className="flex items-center gap-1 text-xs">
                            <span className="font-bold text-amber-600">{rubrics.length}</span>
                            <span className="text-slate-600">Avaliações</span>
                        </div>
                        <div className="w-px h-4 bg-slate-200"></div>
                        <div className="flex items-center gap-1 text-xs">
                            <span className="font-bold text-green-600">92%</span>
                            <span className="text-slate-600">Entrega</span>
                        </div>
                    </div>

                    {/* Seletor Turma */}
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-2 py-1.5 border border-slate-300 rounded-lg font-semibold text-slate-900 text-xs flex-shrink-0"
                    >
                        <option value="9A">Turma 9A</option>
                        <option value="9B">Turma 9B</option>
                    </select>
                </div>
            </div>

            {/* Layout Principal: Sidebar + Conteúdo + QuickInfo */}
            <div className="flex gap-3 p-3 h-[calc(100vh-70px)] overflow-hidden">
                {/* Sidebar Esquerda - Nova Sidebar Colapsável */}
                <SidebarCollapseNew activeSection={activeSection} setActiveSection={setActiveSection} />

                {/* Conteúdo Principal - Maximizado */}
                <div className="flex-1 bg-white rounded-lg border border-slate-200 overflow-y-auto shadow-sm">
                    <div className="p-5">
                        {activeSection === 'dashboard' && renderDashboard()}
                        {activeSection === 'planning' && renderPlanning()}
                        {activeSection === 'calendar' && renderCalendar()}
                        {activeSection === 'attendance' && renderAttendance()}
                        {activeSection === 'evaluation' && renderEvaluation()}
                        {activeSection === 'bncc' && renderBNCC()}
                        {activeSection === 'activities' && renderActivities()}
                        {activeSection === 'grades' && renderGrades()}
                        {activeSection === 'submissions' && renderSubmissions()}
                    </div>
                </div>

                {/* Sidebar Direita - Info Rápida */}
                <QuickInfoSidebar stats={{
                    activities: activities.length,
                    evaluations: rubrics.length,
                    students: 30,
                    submissionRate: 75,
                    classAverage: '8.2'
                }} />
            </div>
        </div>
    );
};

export default TeacherMasterControl;
