import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const TeacherClassManagerDebug = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white p-8">
      {/* Seção de Debug */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">🔧 DEBUG: Botão de Turma</h1>
        
        {/* Container com Padding */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Gerenciar Turmas</h2>
              <p className="text-gray-600 mt-1">Crie e configure suas turmas escolares</p>
            </div>
            
            {/* BOTÃO VISÍVEL */}
            <button
              onClick={() => setShowModal(!showModal)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 whitespace-nowrap"
            >
              <Plus size={28} strokeWidth={3} />
              <span className="text-lg font-bold">+ Nova Turma</span>
            </button>
          </div>

          {/* Status */}
          {showModal && (
            <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
              ✅ <strong>BOTÃO FUNCIONANDO!</strong> Modal seria aberto aqui.
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
          <h3 className="font-bold text-lg mb-2">📌 Informações:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Botão está VISÍVEL e CLICÁVEL</li>
            <li>✅ Está posicionado corretamente (canto superior direito)</li>
            <li>✅ Tem cores vibrantes (gradiente roxo-azul)</li>
            <li>✅ Ícone "+" está presente</li>
            <li>✅ Texto "Nova Turma" é legível</li>
            <li>✅ Animações funcionam ao passar o mouse</li>
          </ul>
        </div>
      </div>

      {/* Cards de Turmas (Mock) */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Minhas Turmas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: '1º Ano A', students: 32, engagement: 75 },
            { name: '2º Ano B', students: 28, engagement: 82 },
            { name: '3º Ano C', students: 30, engagement: 68 }
          ].map((turma, idx) => (
            <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <h4 className="text-xl font-bold text-gray-800">{turma.name}</h4>
              <p className="text-blue-600 font-bold mt-2">👥 {turma.students} Alunos</p>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Engajamento</span>
                  <span>{turma.engagement}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full"
                    style={{ width: `${turma.engagement}%` }}
                  />
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition">
                Gerenciar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherClassManagerDebug;
