import React, { useState } from "react";
import {
    BarChart2, Star, TrendingUp, AlertCircle, ArrowRight, ChevronLeft,
    Download, Search, Filter, Check, Clock, Award
} from "lucide-react";

// Mock Data - Estudantes
const MOCK_STUDENTS = [
    {
        id: 101,
        name: "João Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        grades: [7.5, 8.0, 8.5, 9.0],
        attendance: 95,
        engagement: 88,
        projects: 4,
        status: "excellent",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 9.0, date: "2023-11-15" },
            { project: "Robótica", grade: 8.5, date: "2023-10-20" },
            { project: "Teatro", grade: 8.0, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 7.5, date: "2023-08-05" }
        ]
    },
    {
        id: 102,
        name: "Maria Oliveira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        grades: [9.0, 9.5, 9.0, 9.5],
        attendance: 98,
        engagement: 95,
        projects: 4,
        status: "excellent",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 9.5, date: "2023-11-15" },
            { project: "Robótica", grade: 9.0, date: "2023-10-20" },
            { project: "Teatro", grade: 9.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 9.0, date: "2023-08-05" }
        ]
    },
    {
        id: 103,
        name: "Pedro Santos",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
        grades: [6.0, 5.5, 6.5, 5.0],
        attendance: 75,
        engagement: 60,
        projects: 4,
        status: "at-risk",
        alerts: ["Baixa frequência", "Notas em queda", "Baixo engajamento"],
        evolution: [
            { project: "Horta Sustentável", grade: 5.0, date: "2023-11-15" },
            { project: "Robótica", grade: 6.5, date: "2023-10-20" },
            { project: "Teatro", grade: 5.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 6.0, date: "2023-08-05" }
        ]
    },
    {
        id: 104,
        name: "Ana Costa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnaC",
        grades: [8.0, 8.5, 8.0, 8.5],
        attendance: 92,
        engagement: 85,
        projects: 4,
        status: "good",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 8.5, date: "2023-11-15" },
            { project: "Robótica", grade: 8.0, date: "2023-10-20" },
            { project: "Teatro", grade: 8.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 8.0, date: "2023-08-05" }
        ]
    },
    {
        id: 105,
        name: "Lucas Pereira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
        grades: [7.0, 7.5, 8.0, 8.5],
        attendance: 88,
        engagement: 82,
        projects: 4,
        status: "improving",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 8.5, date: "2023-11-15" },
            { project: "Robótica", grade: 8.0, date: "2023-10-20" },
            { project: "Teatro", grade: 7.5, date: "2023-09-10" },
            { project: "Jornal Digital", grade: 7.0, date: "2023-08-05" }
        ]
    }
];

const TeacherPerformance = () => {
    const [students] = useState(MOCK_STUDENTS);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const getStatusInfo = (status) => {
        const statusMap = {
            excellent: { label: "Excelente", color: "bg-green-100 text-green-700 border-green-200", icon: "🌟" },
            good: { label: "Bom", color: "bg-blue-100 text-blue-700 border-blue-200", icon: "👍" },
            improving: { label: "Melhorando", color: "bg-purple-100 text-purple-700 border-purple-200", icon: "📈" },
            "at-risk": { label: "Em Risco", color: "bg-red-100 text-red-700 border-red-200", icon: "⚠️" }
        };
        return statusMap[status] || statusMap.good;
    };

    const calculateAverage = (grades) => {
        return (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
    };

    const filteredStudents = students.filter((s) => {
        const matchesFilter = filterStatus === "all" || s.status === filterStatus;
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getClassAverage = () => {
        const allGrades = students.flatMap((s) => s.grades);
        return calculateAverage(allGrades);
    };

    if (selectedStudent) {
        const statusInfo = getStatusInfo(selectedStudent.status);
        const average = calculateAverage(selectedStudent.grades);
        const trend = selectedStudent.grades[selectedStudent.grades.length - 1] > selectedStudent.grades[0] ? "up" : "down";

        return (
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => setSelectedStudent(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold"
                >
                    <ChevronLeft size={20} /> Voltar para Lista
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <img src={selectedStudent.avatar} className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl" />
                            <div>
                                <h1 className="text-4xl font-extrabold mb-2">{selectedStudent.name}</h1>
                                <div className="flex gap-3">
                                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/20">{selectedStudent.projects} Projetos</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${statusInfo.color}`}>
                                        {statusInfo.icon} {statusInfo.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                                <p className="text-xs font-bold opacity-80 mb-1">Média Geral</p>
                                <p className="text-5xl font-extrabold">{average}</p>
                                <p className="text-xs opacity-80 mt-1">Turma: {getClassAverage()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alertas */}
                {selectedStudent.alerts.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-red-900 mb-2">Alertas de Atenção</h3>
                                <ul className="space-y-1">
                                    {selectedStudent.alerts.map((alert, idx) => (
                                        <li key={idx} className="text-sm text-red-700 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            {alert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* KPIs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Clock size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Frequência</p>
                                <p className="text-2xl font-bold text-slate-800">{selectedStudent.attendance}%</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                            <div className={`h-full rounded-full ${selectedStudent.attendance >= 90 ? "bg-green-500" : selectedStudent.attendance >= 75 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${selectedStudent.attendance}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                <TrendingUp size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Engajamento</p>
                                <p className="text-2xl font-bold text-slate-800">{selectedStudent.engagement}%</p>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full">
                            <div className="h-full rounded-full bg-purple-500" style={{ width: `${selectedStudent.engagement}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trend === "up" ? "bg-green-100" : "bg-red-100"}`}>
                                <TrendingUp size={24} className={trend === "up" ? "text-green-600" : "text-red-600"} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Tendência</p>
                                <p className={`text-2xl font-bold ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                    {trend === "up" ? "Crescente" : "Decrescente"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Evolução */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart2 size={20} className="text-indigo-600" />
                        Evolução das Notas
                    </h3>
                    <div className="space-y-4">
                        {selectedStudent.evolution.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-32 text-sm font-medium text-slate-600 flex-shrink-0">{item.project}</div>
                                <div className="flex-1">
                                    <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden">
                                        <div
                                            className={`h-full rounded-lg flex items-center justify-end px-3 ${item.grade >= 9 ? "bg-green-500" : item.grade >= 7 ? "bg-blue-500" : item.grade >= 6 ? "bg-yellow-500" : "bg-red-500"}`}
                                            style={{ width: `${item.grade * 10}%` }}
                                        >
                                            <span className="text-white font-bold text-sm">{item.grade}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 w-24 text-right">
                                    {new Date(item.date).toLocaleDateString("pt-BR")}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Performance dos Alunos</h2>
                    <p className="text-slate-500">Análise detalhada de desempenho individual</p>
                </div>
                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg flex items-center gap-2">
                    <Download size={18} /> Exportar
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <Star size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Excelentes</p>
                            <p className="text-2xl font-bold text-slate-800">{students.filter((s) => s.status === "excellent").length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                            <TrendingUp size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Melhorando</p>
                            <p className="text-2xl font-bold text-slate-800">{students.filter((s) => s.status === "improving").length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <AlertCircle size={24} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Em Risco</p>
                            <p className="text-2xl font-bold text-slate-800">{students.filter((s) => s.status === "at-risk").length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                            <BarChart2 size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Média Turma</p>
                            <p className="text-2xl font-bold text-slate-800">{getClassAverage()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {["all", "excellent", "improving", "good", "at-risk"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition ${filterStatus === status
                                        ? "bg-indigo-600 text-white shadow-lg"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {status === "all" && "Todos"}
                                {status === "excellent" && "🌟 Excelentes"}
                                {status === "improving" && "📈 Melhorando"}
                                {status === "good" && "👍 Bons"}
                                {status === "at-risk" && "⚠️ Em Risco"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Aluno</th>
                            <th className="px-6 py-4">Média</th>
                            <th className="px-6 py-4">Frequência</th>
                            <th className="px-6 py-4">Engajamento</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => {
                            const statusInfo = getStatusInfo(student.status);
                            const average = calculateAverage(student.grades);
                            return (
                                <tr key={student.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={student.avatar} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <p className="font-bold text-slate-700">{student.name}</p>
                                                <p className="text-xs text-slate-400">{student.projects} projetos</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${parseFloat(average) >= 9 ? "text-green-600" : parseFloat(average) >= 7 ? "text-blue-600" : parseFloat(average) >= 6 ? "text-yellow-600" : "text-red-600"}`}>
                                                {average}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-slate-100 h-2 rounded-full">
                                                <div className={`h-full rounded-full ${student.attendance >= 90 ? "bg-green-500" : student.attendance >= 75 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${student.attendance}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{student.attendance}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-slate-100 h-2 rounded-full">
                                                <div className="h-full rounded-full bg-purple-500" style={{ width: `${student.engagement}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{student.engagement}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                                            {statusInfo.icon} {statusInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedStudent(student)}
                                            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-bold text-xs transition flex items-center gap-2 ml-auto"
                                        >
                                            Ver Detalhes
                                            <ArrowRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherPerformance;
