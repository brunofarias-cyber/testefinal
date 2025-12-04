import React, { useState } from 'react';
import { X } from 'lucide-react';

const FeedbackTab = ({ team, students }) => {
    const [feedbacks, setFeedbacks] = useState([
        {
            id: 1,
            targetType: "team",
            targetName: "Equipe Alpha",
            feedback: "Excelente trabalho em equipe! Mantém esse ritmo.",
            date: "2024-01-15",
            type: "positive"
        }
    ]);
    const [selectedTab, setSelectedTab] = useState("team");
    const [selectedMember, setSelectedMember] = useState(null);
    const [feedbackText, setFeedbackText] = useState("");

    const handleAddFeedback = () => {
        if (!feedbackText.trim()) return;

        setFeedbacks([...feedbacks, {
            id: feedbacks.length + 1,
            targetType: selectedTab,
            targetName: selectedTab === "team" ? team?.name : selectedMember,
            feedback: feedbackText,
            date: new Date().toISOString().split('T')[0],
            type: "neutral"
        }]);
        setFeedbackText("");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-slate-800">Feedback</h2>

            {/* Abas */}
            <div className="flex gap-2 border-b border-slate-200">
                <button
                    onClick={() => {
                        setSelectedTab("team");
                        setSelectedMember(null);
                    }}
                    className={`px-4 py-3 font-bold border-b-2 transition ${selectedTab === "team"
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-600 hover:text-slate-800'
                        }`}
                >
                    Para a Equipe
                </button>
                <button
                    onClick={() => setSelectedTab("individual")}
                    className={`px-4 py-3 font-bold border-b-2 transition ${selectedTab === "individual"
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-600 hover:text-slate-800'
                        }`}
                >
                    Para Alunos
                </button>
            </div>

            {/* Novo Feedback */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Novo Feedback</h3>

                <div className="space-y-4">
                    {selectedTab === "individual" && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Aluno</label>
                            <select
                                value={selectedMember || ""}
                                onChange={(e) => setSelectedMember(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="">Selecione um aluno...</option>
                                {students?.map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Feedback</label>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Digite o feedback construtivo..."
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <button
                        onClick={handleAddFeedback}
                        disabled={!feedbackText.trim() || (selectedTab === "individual" && !selectedMember)}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition"
                    >
                        Enviar Feedback
                    </button>
                </div>
            </div>

            {/* Histórico */}
            <div className="space-y-3">
                <h3 className="font-bold text-lg text-slate-800">Histórico de Feedbacks</h3>
                {feedbacks.filter(f => f.targetType === selectedTab).map(fb => (
                    <div key={fb.id} className="bg-white rounded-xl border border-slate-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-slate-800">{fb.targetName}</p>
                            <span className="text-xs text-slate-500">{fb.date}</span>
                        </div>
                        <p className="text-slate-700">{fb.feedback}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackTab;
