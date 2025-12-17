import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function CollapsibleGestaoSection({ stats }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gestao-section-expanded");
      if (saved !== null) setIsExpanded(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("gestao-section-expanded", JSON.stringify(isExpanded));
    } catch {}
  }, [isExpanded]);

  const metricas = [
    {
      label: "Atividades Ativas",
      value: stats?.activities || 0,
      icon: Clock,
      color: "bg-blue-100 text-blue-600"
    },
    {
      label: "Avaliações Pendentes",
      value: stats?.evaluations || 0,
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-600"
    },
    {
      label: "Estudantes",
      value: stats?.students || 0,
      icon: Users,
      color: "bg-green-100 text-green-600"
    },
    {
      label: "Taxa Envio",
      value: `${stats?.submissionRate || 0}%`,
      icon: BarChart3,
      color: "bg-amber-100 text-amber-600"
    },
    {
      label: "Média Turma",
      value: stats?.classAverage || "0",
      icon: AlertCircle,
      color: "bg-pink-100 text-pink-600"
    }
  ];

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header Colapsável */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
            <BarChart3 size={20} strokeWidth={2} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-900">Resumo de Gestão</h3>
            <p className="text-xs text-slate-500">Métricas da turma atual</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">
            {isExpanded ? "Recolher" : "Expandir"}
          </span>
          {isExpanded ? (
            <ChevronUp size={20} className="text-slate-600" />
          ) : (
            <ChevronDown size={20} className="text-slate-600" />
          )}
        </div>
      </button>

      {/* Conteúdo Expandível */}
      <div
        className={`transition-all duration-300 ease-out overflow-hidden ${
          isExpanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="border-t border-slate-100 p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {metricas.map((metrica, idx) => {
              const Icon = metrica.icon;
              return (
                <div
                  key={idx}
                  className={`${metrica.color} rounded-lg p-4 text-center transition-transform hover:scale-105`}
                >
                  <Icon size={24} className="mx-auto mb-2" />
                  <p className="text-2xl font-extrabold">{metrica.value}</p>
                  <p className="text-xs font-semibold opacity-80 mt-1 line-clamp-2">
                    {metrica.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
