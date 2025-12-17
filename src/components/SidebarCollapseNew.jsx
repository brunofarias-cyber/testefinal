import React, { useEffect, useState } from "react";
import {
  Home,
  FileText,
  Calendar,
  CheckSquare,
  Star,
  BookOpen,
  Edit2,
  Target,
  Send,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const sections = [
  {
    id: "planejamento",
    title: "Planejamento",
    color: {
      dot: "bg-indigo-500",
      title: "text-indigo-700",
      itemActive: "bg-indigo-600 text-white shadow-md shadow-indigo-200",
      item: "hover:bg-indigo-50 hover:text-indigo-700 text-slate-600"
    },
    items: [
      { id: "dashboard", icon: Home, label: "Início" },
      { id: "planning", icon: FileText, label: "Planejamento" },
      { id: "attendance", icon: CheckSquare, label: "Chamada" }
    ]
  },
  {
    id: "gestao",
    title: "Gestão",
    color: {
      dot: "bg-amber-500",
      title: "text-amber-700",
      itemActive: "bg-amber-500 text-white shadow-md shadow-amber-200",
      item: "hover:bg-amber-50 hover:text-amber-700 text-slate-600"
    },
    items: [
      { id: "evaluation", icon: Star, label: "Avaliação" },
      { id: "activities", icon: Edit2, label: "Atividades" },
      { id: "calendar", icon: Calendar, label: "Calendário" }
    ]
  },
  {
    id: "notas",
    title: "Notas & BNCC",
    color: {
      dot: "bg-emerald-500",
      title: "text-emerald-700",
      itemActive: "bg-emerald-600 text-white shadow-md shadow-emerald-200",
      item: "hover:bg-emerald-50 hover:text-emerald-700 text-slate-600"
    },
    items: [
      { id: "grades", icon: Target, label: "Notas" },
      { id: "bncc", icon: BookOpen, label: "BNCC" },
      { id: "submissions", icon: Send, label: "Submissões" }
    ]
  }
];

const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute right-full -mr-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
        </div>
      )}
    </div>
  );
};

export default function SidebarCollapseNew({ activeSection, setActiveSection }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-expanded");
      if (saved !== null) setIsExpanded(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-expanded", JSON.stringify(isExpanded));
    } catch {}
  }, [isExpanded]);

  const ItemButton = ({ id, Icon, label, color }) => {
    const active = activeSection === id;
    const btnClass = active ? color.itemActive : color.item;
    const content = (
      <button
        onClick={() => setActiveSection(id)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-out ${
          isExpanded ? "justify-start" : "justify-center"
        } ${btnClass}`}
        title={isExpanded ? undefined : label}
      >
        <Icon size={20} strokeWidth={2} />
        {isExpanded && <span className="truncate">{label}</span>}
        {active && isExpanded && (
          <span className={`ml-auto w-2.5 h-2.5 rounded-full ${color.dot} animate-pulse`} />
        )}
      </button>
    );

    if (isExpanded) return content;
    return <Tooltip content={label}>{content}</Tooltip>;
  };

  return (
    <aside
      className={`h-fit max-h-[calc(100vh-180px)] overflow-y-auto transition-all duration-300 ease-out ${
        isExpanded ? "w-72" : "w-24"
      } bg-white border-2 border-slate-200 rounded-2xl shadow-lg sticky top-20`}
    >
      {/* Header com Botão Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        {isExpanded && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Navegação</span>
          </div>
        )}
        <button
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 ml-auto"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label="Alternar sidebar"
          title={isExpanded ? "Recolher" : "Expandir"}
        >
          {isExpanded ? (
            <ChevronLeft size={20} strokeWidth={2} />
          ) : (
            <ChevronRight size={20} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Conteúdo */}
      <div className={`space-y-2 p-4 ${isExpanded ? "" : "flex flex-col items-center"}`}>
        {sections.map((sec, idx) => (
          <div key={sec.id} className={idx < sections.length - 1 ? "pb-3 mb-3 border-b border-slate-100" : ""}>
            {isExpanded && (
              <div className="flex items-center gap-2 px-2 py-2 mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${sec.color.dot}`} />
                <span className={`text-[11px] font-extrabold uppercase tracking-widest ${sec.color.title}`}>
                  {sec.title}
                </span>
              </div>
            )}
            <div className={`space-y-1 ${isExpanded ? "" : "flex flex-col items-center gap-2"}`}>
              {sec.items.map((it) => (
                <ItemButton
                  key={it.id}
                  id={it.id}
                  Icon={it.icon}
                  label={it.label}
                  color={sec.color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
