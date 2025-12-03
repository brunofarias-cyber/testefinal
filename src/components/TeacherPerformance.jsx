import React, { useState } from "react";
import {
    ChevronLeft,
    BarChart2,
    AlertCircle,
    Award,
    Calendar,
    Users,
    Target,
    TrendingUp,
    Download,
    Filter,
    Search,
    Check,
    ArrowRight
} from "lucide-react";

// Mock data
const MOCK_STUDENTS = [
    {
        id: 101,
        name: "João Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        grades: [7.5, 8.0, 8.5, 9.0],
        average: 8.25,
        attendance: 95,
        engagement: 88,
        projects: 4,
        status: "excellent",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 9.0, date: "2023-11-15" },
            { project: "Robótica", grade: 8.5, date: "2023-10-20" }
        ]
    },
    {
        id: 102,
        name: "Maria Oliveira",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        grades: [9.0, 9.5, 9.0, 9.5],
        average: 9.25,
        attendance: 98,
        engagement: 95,
        projects: 4,
        status: "excellent",
        alerts: [],
        evolution: [
            { project: "Horta Sustentável", grade: 9.5, date: "2023-11-15" },
            { project: "Robótica", grade: 9.0, date: "2023-10-20" }
        ]
    },
    {
        id: 103,
        name: "Pedro Santos",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
        grades: [6.0, 5.5, 6.5, 5.0],
        average: 5.75,
        attendance: 75,
        engagement: 60,
        projects: 4,
        status: "at-risk",
        alerts: ["Baixa frequência", "Notas em queda", "Baixo engajamento"],
        evolution: [
            { project: "Horta Sustentável", grade: 5.0, date: "2023-11-15" },
            { project: "Robótica", grade: 6.5, date: "2023-10-20" }
        ]
    }
];

const TeacherPerformance = () => {
    const [students] = useState(MOCK_STUDENTS);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || s.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusInfo = (status) => {
        const statusMap = {
            excellent: { label: "Excelente", color: "bg-green-100 text-green-700", icon: "🌟" },
            good: { label: "Bom", color: "bg-blue-100 text-blue-700", icon: "👍" },
            improving: { label: "Melhorando", color: "bg-purple-100 text-purple-700", icon: "📈" },
            "at-risk": { label: "Em Risco", color: "bg-red-100 text-red-700", icon: "⚠️" }
        };
        return statusMap[status] || statusMap.good;
    };

    if (selectedStudent) {
        const statusInfo = getStatusInfo(selectedStudent.status);
        const classAvg = (students.reduce((sum, s) => sum + s.average, 0) / students.length).toFixed(1);

        return (
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => setSelectedStudent(null)}
                    className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold"
                >
                    <ChevronLeft size={20} /> Voltar
                </button>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <img src={selectedStudent.avatar} className="w-24 h-24 rounded-full border-4 border-white/20" />
                            <div>
                                <h1 className="text-3xl font-extrabold">{selectedStudent.name}</h1>
                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold ${statusInfo.color}`}>
                                    {statusInfo.icon} {statusInfo.label}
                                </span>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl">
                            <p className="text-xs font-bold opacity-80">Média Geral</p>
                            <p className="text-4xl font-extrabold">{selectedStudent.average.toFixed(1)}</p>
                            <p className="text-xs opacity-80 mt-1">Turma: {classAvg}</p>
                        </div>
                    </div>
                </div>

                {selectedStudent.alerts.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-8">
                        <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                            <AlertCircle size={20} /> Alertas
                        </h3>
                        <ul className="space-y-2">
                            {selectedStudent.alerts.map((alert, idx) => (
                                <li key={idx} className="text-red-700 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    {alert}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <p className="text-sm font-bold text-slate-500">Frequência</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{selectedStudent.attendance}%</p>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
                            <div
                                className="bg-blue-500 h-full rounded-full"
                                style={{ width: `${selectedStudent.attendance}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <p className="text-sm font-bold text-slate-500">Engajamento</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{selectedStudent.engagement}%</p>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-3">
                            <div
                                className="bg-purple-500 h-full rounded-full"
                                style={{ width: `${selectedStudent.engagement}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <p className="text-sm font-bold text-slate-500">Projetos</p>
                        <p className="text-3xl font-bold text-slate-800 mt-2">{selectedStudent.projects}</p>
                        <p className="text-xs text-slate-500 mt-3">Projetos concluídos</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h3 className="font-bold text-lg text-slate-800 mb-4">Evolução por Projeto</h3>
                    <div className="space-y-4">
                        {selectedStudent.evolution.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-slate-700">{item.project}</span>
                                    <span className="font-bold text-indigo-600">{item.grade}/10</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                                        style={{ width: `${item.grade * 10}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Performance dos Alunos</h2>
                    <p className="text-slate-500 mt-2">Análise detalhada de desempenho individual</p>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Excelentes</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">2</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Em Risco</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">1</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Média Turma</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">
                        {(students.reduce((sum, s) => sum + s.average, 0) / students.length).toFixed(1)}
                    </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                    <p className="text-3xl font-bold text-slate-800 mt-2">{students.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`px-4 py-2 rounded-lg font-bold text-sm ${filterStatus === "all" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilterStatus("excellent")}
                            className={`px-4 py-2 rounded-lg font-bold text-sm ${filterStatus === "excellent" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            Excelentes
                        </button>
                        <button
                            onClick={() => setFilterStatus("at-risk")}
                            className={`px-4 py-2 rounded-lg font-bold text-sm ${filterStatus === "at-risk" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            Em Risco
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-bold text-slate-700">Aluno</th>
                            <th className="px-6 py-3 font-bold text-slate-700">Média</th>
                            <th className="px-6 py-3 font-bold text-slate-700">Frequência</th>
                            <th className="px-6 py-3 font-bold text-slate-700">Engajamento</th>
                            <th className="px-6 py-3 font-bold text-slate-700">Status</th>
                            <th className="px-6 py-3 font-bold text-slate-700">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((student) => {
                            const statusInfo = getStatusInfo(student.status);
                            return (
                                <tr key={student.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={student.avatar} className="w-8 h-8 rounded-full" />
                                            <span className="font-bold text-slate-800">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{student.average.toFixed(1)}</td>
                                    <td className="px-6 py-4">{student.attendance}%</td>
                                    <td className="px-6 py-4">{student.engagement}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setSelectedStudent(student)}
                                            className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
                                        >
                                            Ver <ArrowRight size={14} />
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
