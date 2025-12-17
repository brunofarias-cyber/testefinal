import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CollapsibleGestaoNav({ children }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app-gestao-nav-expanded");
      if (saved !== null) setIsExpanded(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("app-gestao-nav-expanded", JSON.stringify(isExpanded));
    } catch {}
  }, [isExpanded]);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-slate-100 rounded-lg transition-colors"
      >
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Gestão
        </p>
        {isExpanded ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>
      
      <nav className={`space-y-1 overflow-hidden transition-all duration-300 ${
        isExpanded ? "max-h-96" : "max-h-0"
      }`}>
        {children}
      </nav>
    </div>
  );
}
