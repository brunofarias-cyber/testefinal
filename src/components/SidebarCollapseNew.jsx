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
      itemActive: "bg-indigo-600 text-white",
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
      itemActive: "bg-amber-500 text-white",
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
      itemActive: "bg-emerald-600 text-white",
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
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
};

export default function SidebarCollapseNew({ activeSection, setActiveSection }) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const widthClass = isExpanded ? "w-64" : "w-20";

  const ItemButton = ({ id, Icon, label, color }) => {
    const active = activeSection === id;
    const btnClass = active ? color.itemActive : color.item;
    const content = (
      <button
        onClick={() => setActiveSection(id)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
          isExpanded ? "justify-start" : "justify-center"
        } ${btnClass}`}
        title={isExpanded ? undefined : label}
      >
        <Icon size={18} />
        {isExpanded && <span className="truncate">{label}</span>}
        {active && isExpanded && (
          <span className={`ml-auto w-2 h-2 rounded-full ${color.dot}`} />
        )}
      </button>
    );

    if (isExpanded) return content;
    return <Tooltip content={label}>{content}</Tooltip>;
  };

  return (
    <aside
      className={`h-fit max-h-[calc(100vh-200px)] overflow-y-auto ${widthClass} bg-white border-2 border-slate-200 rounded-xl p-2 shadow-sm sticky top-20`}
    >
      <div className="flex items-center justify-between mb-2">
        {isExpanded ? (
          <div className="px-2 py-1">
            <span className="text-sm font-extrabold text-slate-800">Navegação</span>
          </div>
        ) : (
          <div className="px-1 py-1" />
        )}
        <button
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label="Alternar sidebar"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <div className="space-y-3">
        {sections.map((sec, idx) => (
          <div key={sec.id}>
            {isExpanded && (
              <div className="flex items-center gap-2 px-2 py-1">
                <span className={`w-2 h-2 rounded-full ${sec.color.dot}`} />
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${sec.color.title}`}>
                  {sec.title}
                </span>
              </div>
            )}
            <div className={idx < sections.length - 1 ? "pb-2 mb-2 border-b border-slate-100" : ""}>
              {sec.items.map((it) => (
                <ItemButton
                  key={it.id}
                  id={it.id}
                  Icon={it.icon}
                  label={it.label}
                  color={sec.color}
                />)
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
