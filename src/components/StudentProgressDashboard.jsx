import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';

// MOCK DATA - Competências do Aluno (Spider/Radar Chart)
const MOCK_STUDENT_COMPETENCIES = [
  { name: 'Comunicação', value: 85, max: 100 },
  { name: 'Pensamento Crítico', value: 78, max: 100 },
  { name: 'Colaboração', value: 88, max: 100 },
  { name: 'Criatividade', value: 82, max: 100 },
  { name: 'Liderança', value: 75, max: 100 },
  { name: 'Resolução de Problemas', value: 90, max: 100 },
  { name: 'Responsabilidade', value: 92, max: 100 },
  { name: 'Empatia', value: 86, max: 100 }
];

// MOCK DATA - Evolução de Notas (Linha do Tempo)
const MOCK_STUDENT_GRADES_TIMELINE = [
  { date: '15/08/2024', project: 'Horta Sustentável', grade: 7.5, maxGrade: 10, projectId: 1, xp: 150 },
  { date: '20/09/2024', project: 'Jornal Digital', grade: 8.0, maxGrade: 10, projectId: 2, xp: 200 },
  { date: '25/10/2024', project: 'Robótica Sucata', grade: 8.5, maxGrade: 10, projectId: 3, xp: 250 },
  { date: '10/11/2024', project: 'Teatro Shakespeare', grade: 8.2, maxGrade: 10, projectId: 4, xp: 180 },
  { date: '20/11/2024', project: 'Documentário Comunidade', grade: 8.8, maxGrade: 10, projectId: 5, xp: 280 },
  { date: '28/11/2024', project: 'Apresentação Final', grade: 9.0, maxGrade: 10, projectId: 6, xp: 320 }
];

// MOCK DATA - Estatísticas do Aluno
const MOCK_STUDENT_STATS = {
  name: 'João Silva',
  level: 5,
  xp: 2300,
  totalProjects: 6,
  avgGrade: 8.58,
  engagementRate: 92,
  completionRate: 100,
  bestCompetency: 'Responsabilidade',
  improveCompetency: 'Liderança'
};

// MOCK DATA - Badges/Conquistas
const MOCK_ACHIEVEMENTS_UNLOCKED = [
  { id: 1, name: 'Madrugador', icon: '⚡', unlocked: true },
  { id: 2, name: 'A Volta por Cima', icon: '📈', unlocked: true },
  { id: 3, name: 'Multimídia', icon: '🎬', unlocked: true },
  { id: 4, name: 'Na Mosca', icon: '🎯', unlocked: false }
];

const StudentProgressDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // 'all', '3months', '6months'

  // DEBUG: Verificar se os dados estão corretos
  React.useEffect(() => {
    console.log('📊 StudentProgressDashboard carregado');
    console.log('Competências:', MOCK_STUDENT_COMPETENCIES);
    console.log('Recharts disponível:', typeof RadarChart !== 'undefined');
  }, []);

  // Calcular trend (crescente/decrescente)
  const calculateTrend = () => {
    if (MOCK_STUDENT_GRADES_TIMELINE.length < 2) return 0;
    const first = MOCK_STUDENT_GRADES_TIMELINE[0].grade;
    const last = MOCK_STUDENT_GRADES_TIMELINE[MOCK_STUDENT_GRADES_TIMELINE.length - 1].grade;
    return last - first;
  };

  const trend = calculateTrend();
  const bestCompetency = MOCK_STUDENT_COMPETENCIES.reduce((prev, current) =>
    prev.value > current.value ? prev : current
  );
  const worstCompetency = MOCK_STUDENT_COMPETENCIES.reduce((prev, current) =>
    prev.value < current.value ? prev : current
  );

  // Calcular média por rubrica
  const avgCompetency = (MOCK_STUDENT_COMPETENCIES.reduce((sum, c) => sum + c.value, 0) / 
                        MOCK_STUDENT_COMPETENCIES.length).toFixed(1);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Meu Progresso</h2>
        <p className="text-slate-500">Visualize sua evolução e desenvolvimento de competências</p>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <Award size={24} className="text-yellow-500" />
            <p className="text-xs font-bold text-slate-400 uppercase">Nível</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{MOCK_STUDENT_STATS.level}</p>
          <p className="text-xs text-slate-500 mt-1">{MOCK_STUDENT_STATS.xp} XP</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp size={24} className="text-green-500" />
            <p className="text-xs font-bold text-slate-400 uppercase">Média Geral</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{MOCK_STUDENT_STATS.avgGrade.toFixed(2)}</p>
          <p className={`text-xs mt-1 font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(2)} pontos
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <Target size={24} className="text-blue-500" />
            <p className="text-xs font-bold text-slate-400 uppercase">Engajamento</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{MOCK_STUDENT_STATS.engagementRate}%</p>
          <p className="text-xs text-slate-500 mt-1">acima da média</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap size={24} className="text-purple-500" />
            <p className="text-xs font-bold text-slate-400 uppercase">Projetos</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{MOCK_STUDENT_STATS.totalProjects}</p>
          <p className="text-xs text-slate-500 mt-1">{MOCK_STUDENT_STATS.completionRate}% concluído</p>
        </div>
      </div>

      {/* GRÁFICO RADAR (SPIDER) - COMPETÊNCIAS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">🎯 Mapa de Competências</h3>
            <p className="text-sm text-slate-600 mt-1">Seu desenvolvimento nas 8 competências principais</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase">MÉDIA GERAL</p>
            <p className="text-3xl font-bold text-indigo-600">{avgCompetency}%</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={MOCK_STUDENT_COMPETENCIES}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar 
              name="Seu Desempenho" 
              dataKey="value" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.6}
            />
            <Radar 
              name="Meta (100%)" 
              dataKey="max" 
              stroke="#e2e8f0" 
              fill="none"
              strokeDasharray="5 5"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>

        {/* Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-xs font-bold text-green-600 uppercase mb-1">💪 Força</p>
            <p className="font-bold text-slate-800">{bestCompetency.name}</p>
            <p className="text-sm text-slate-600">{bestCompetency.value}% de domínio</p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-xs font-bold text-orange-600 uppercase mb-1">🎯 Foco</p>
            <p className="font-bold text-slate-800">{worstCompetency.name}</p>
            <p className="text-sm text-slate-600">Trabalhe {100 - worstCompetency.value}% para atingir 100%</p>
          </div>
        </div>
      </div>

      {/* GRÁFICO DE LINHA - EVOLUÇÃO DE NOTAS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">📊 Evolução das Notas</h3>
            <p className="text-sm text-slate-600 mt-1">Seu desenvolvimento ao longo dos projetos</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                timeRange === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTimeRange('6months')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                timeRange === '6months'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              6 Meses
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={MOCK_STUDENT_GRADES_TIMELINE}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <YAxis domain={[0, 400]} yAxisId="right" orientation="right" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              formatter={(value, name) => {
                if (name === 'Sua Nota' || name === 'Nota Máxima') return `${value}/10`;
                return `${value} XP`;
              }}
              labelFormatter={(label) => `Data: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="grade"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 6 }}
              activeDot={{ r: 8 }}
              name="Sua Nota"
            />
            <Line
              type="monotone"
              dataKey="xp"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="XP Ganho"
              yAxisId="right"
            />
            <Line
              type="monotone"
              dataKey="maxGrade"
              stroke="#d1d5db"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Nota Máxima"
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Análise */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <span className="text-2xl">📈</span>
          <div>
            <p className="font-bold text-slate-800">Sua trajetória</p>
            <p className="text-sm text-slate-600 mt-1">
              Parabéns! Você começou em 7.5 e agora está em 9.0. {trend > 0 ? 
              `Seu progresso de +${trend.toFixed(2)} pontos mostra dedicação crescente.` :
              `Continue trabalhando para manter sua excelência.`}
            </p>
          </div>
        </div>
      </div>

      {/* DETALHAMENTO POR PROJETO */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">📚 Desempenho por Projeto</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700">Data</th>
                <th className="px-6 py-4 font-bold text-slate-700">Projeto</th>
                <th className="px-6 py-4 font-bold text-slate-700">Nota</th>
                <th className="px-6 py-4 font-bold text-slate-700">Progresso</th>
                <th className="px-6 py-4 font-bold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_STUDENT_GRADES_TIMELINE.map((entry, idx) => {
                const prevGrade = idx > 0 ? MOCK_STUDENT_GRADES_TIMELINE[idx - 1].grade : entry.grade;
                const diff = entry.grade - prevGrade;
                
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{entry.date}</td>
                    <td className="px-6 py-4 text-slate-700">{entry.project}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-slate-800">{entry.grade}</span>
                      <span className="text-xs text-slate-400 ml-1">/{entry.maxGrade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              entry.grade >= 9 ? 'bg-green-500' :
                              entry.grade >= 8 ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${(entry.grade / entry.maxGrade) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-bold ${
                          diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-slate-400'
                        }`}>
                          {diff > 0 ? '↗' : diff < 0 ? '↘' : '→'} {Math.abs(diff).toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        entry.grade >= 9 ? 'bg-green-100 text-green-700' :
                        entry.grade >= 8 ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {entry.grade >= 9 ? '⭐ Excelente' : entry.grade >= 8 ? '✓ Bom' : 'Em Desenvolvimento'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* BADGES/CONQUISTAS */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">🏅 Minhas Conquistas</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_ACHIEVEMENTS_UNLOCKED.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl text-center transition ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 shadow-md'
                  : 'bg-slate-50 border border-slate-200 opacity-50'
              }`}
            >
              <p className="text-3xl mb-2">{achievement.icon}</p>
              <p className={`font-bold text-sm ${
                achievement.unlocked ? 'text-slate-800' : 'text-slate-400'
              }`}>
                {achievement.name}
              </p>
              {!achievement.unlocked && (
                <p className="text-xs text-slate-400 mt-1">Bloqueado</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressDashboard;
