import React, { useState } from 'react';
import { ChevronLeft, ArrowRight, Search, Book, Sparkles } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// PÁGINA BNCC COMPLETA - Base Nacional Comum Curricular
// ═══════════════════════════════════════════════════════════════════════

const BNCCPage = () => {
  // ────────────────────────────────────────────────────────────────
  // ESTADO
  // ────────────────────────────────────────────────────────────────

  const [selectedArea, setSelectedArea] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnoEscolar, setFilterAnoEscolar] = useState('all');

  // ────────────────────────────────────────────────────────────────
  // DADOS: 5 ÁREAS DE CONHECIMENTO
  // ────────────────────────────────────────────────────────────────

  const areas = [
    {
      id: 1,
      codigo: 'MAT',
      nome: 'Matemática',
      descricao: 'Números, álgebra, geometria e estatística',
      icone: '📊',
      cor: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      codigo: 'LIN',
      nome: 'Linguagens',
      descricao: 'Português, línguas estrangeiras, artes',
      icone: '📖',
      cor: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      codigo: 'CN',
      nome: 'Ciências da Natureza',
      descricao: 'Física, química, biologia',
      icone: '🔬',
      cor: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      codigo: 'CS',
      nome: 'Ciências Sociais',
      descricao: 'História, geografia, sociologia',
      icone: '🌍',
      cor: 'from-orange-500 to-red-500'
    },
    {
      id: 5,
      codigo: 'EC',
      nome: 'Educação Completa',
      descricao: 'Educação física, valores humanos',
      icone: '💪',
      cor: 'from-rose-500 to-red-600'
    }
  ];

  // ────────────────────────────────────────────────────────────────
  // DADOS: HABILIDADES BNCC
  // ────────────────────────────────────────────────────────────────

  const todasHabilidades = [
    // Matemática
    {
      id: 1,
      area_id: 1,
      codigo: 'EF07MA01',
      ano_escolar: '7º ano',
      titulo: 'Resolver problemas com números naturais',
      descricao: 'Resolver e elaborar problemas com números naturais, envolvendo as operações de adição, subtração, multiplicação e divisão'
    },
    {
      id: 2,
      area_id: 1,
      codigo: 'EF08MA01',
      ano_escolar: '8º ano',
      titulo: 'Efetuar cálculos com potências',
      descricao: 'Efetuar cálculos com potências de expoentes inteiros e aplicar esse conhecimento na representação de números'
    },
    {
      id: 3,
      area_id: 1,
      codigo: 'EF09MA01',
      ano_escolar: '9º ano',
      titulo: 'Reconhecer número irracional',
      descricao: 'Reconhecer que existem números que não são racionais e caracterizar número irracional como um número real cuja representação decimal é infinita e não periódica'
    },
    // Linguagens
    {
      id: 4,
      area_id: 2,
      codigo: 'EF67LP01',
      ano_escolar: '6º-7º ano',
      titulo: 'Reconhecer a função da linguagem',
      descricao: 'Reconhecer a função e o impacto social das diferentes práticas de linguagem na construção de identidades'
    },
    {
      id: 5,
      area_id: 2,
      codigo: 'EF89LP01',
      ano_escolar: '8º-9º ano',
      titulo: 'Analisar textos publicitários',
      descricao: 'Analisar textos publicitários, propagandas e campanhas em perspectiva crítica, considerando seus recursos persuasivos'
    },
    {
      id: 6,
      area_id: 2,
      codigo: 'EF69LP01',
      ano_escolar: '6º-9º ano',
      titulo: 'Diferenciar liberdade de expressão',
      descricao: 'Diferenciar liberdade de expressão de discursos de ódio, posicionando-se contrariamente a esse tipo de discurso'
    },
    // Ciências da Natureza
    {
      id: 7,
      area_id: 3,
      codigo: 'EF07CI01',
      ano_escolar: '7º ano',
      titulo: 'Discutir visão integrada da natureza',
      descricao: 'Discutir a importância da visão integrada do ser humano com a natureza na construção de saberes científicos'
    },
    {
      id: 8,
      area_id: 3,
      codigo: 'EF08CI01',
      ano_escolar: '8º ano',
      titulo: 'Propor ações ambientais',
      descricao: 'Propor ações para solução de problemas ambientais locais e globais considerando sustentabilidade e preservação'
    },
    {
      id: 9,
      area_id: 3,
      codigo: 'EF09CI01',
      ano_escolar: '9º ano',
      titulo: 'Investigar transformações de energia',
      descricao: 'Investigar as transformações de energia que ocorrem em sistemas diversos, como organismos vivos e máquinas'
    },
    // Ciências Sociais
    {
      id: 10,
      area_id: 4,
      codigo: 'EF07HI01',
      ano_escolar: '7º ano',
      titulo: 'Explicar eventos históricos',
      descricao: 'Explicar o significado de eventos históricos e suas relações com o tempo presente, considerando múltiplas perspectivas'
    },
    {
      id: 11,
      area_id: 4,
      codigo: 'EF07GE01',
      ano_escolar: '7º ano',
      titulo: 'Avaliar implicações econômicas',
      descricao: 'Avaliar implicações das atividades econômicas no meio ambiente e nas formas de organização social e territorial'
    },
    {
      id: 12,
      area_id: 4,
      codigo: 'EF08HI01',
      ano_escolar: '8º ano',
      titulo: 'Identificar processos históricos',
      descricao: 'Identificar processos históricos que resultaram na constituição das sociedades contemporâneas'
    },
    // Educação Completa
    {
      id: 13,
      area_id: 5,
      codigo: 'EF35EF01',
      ano_escolar: '3º-5º ano',
      titulo: 'Experimentar tipos de movimento',
      descricao: 'Experimentar e fruir diversos tipos de movimento corporal, compreendendo suas características e possibilidades'
    },
    {
      id: 14,
      area_id: 5,
      codigo: 'EF67EF01',
      ano_escolar: '6º-7º ano',
      titulo: 'Experimentar práticas corporais',
      descricao: 'Experimentar e fruir práticas corporais de aventura urbanas e na natureza, respeitando patrimônio público'
    },
    {
      id: 15,
      area_id: 5,
      codigo: 'EF89EF01',
      ano_escolar: '8º-9º ano',
      titulo: 'Experimentar exercícios físicos',
      descricao: 'Experimentar exercícios físicos que auxiliem no desenvolvimento de capacidades físicas como resistência e força'
    }
  ];

  // ────────────────────────────────────────────────────────────────
  // DADOS: 10 COMPETÊNCIAS GERAIS
  // ────────────────────────────────────────────────────────────────

  const competenciasGerais = [
    { numero: 1, titulo: 'Conhecimento', icone: '📚', cor: 'bg-blue-100 text-blue-700' },
    { numero: 2, titulo: 'Pensamento Científico', icone: '🧪', cor: 'bg-purple-100 text-purple-700' },
    { numero: 3, titulo: 'Repertório Cultural', icone: '🎨', cor: 'bg-pink-100 text-pink-700' },
    { numero: 4, titulo: 'Comunicação', icone: '💬', cor: 'bg-green-100 text-green-700' },
    { numero: 5, titulo: 'Cultura Digital', icone: '💻', cor: 'bg-cyan-100 text-cyan-700' },
    { numero: 6, titulo: 'Trabalho e Projeto de Vida', icone: '🎯', cor: 'bg-orange-100 text-orange-700' },
    { numero: 7, titulo: 'Argumentação', icone: '🗣️', cor: 'bg-red-100 text-red-700' },
    { numero: 8, titulo: 'Autoconhecimento', icone: '🪞', cor: 'bg-indigo-100 text-indigo-700' },
    { numero: 9, titulo: 'Empatia e Cooperação', icone: '🤝', cor: 'bg-emerald-100 text-emerald-700' },
    { numero: 10, titulo: 'Responsabilidade', icone: '✨', cor: 'bg-yellow-100 text-yellow-700' }
  ];

  // ────────────────────────────────────────────────────────────────
  // FILTROS
  // ────────────────────────────────────────────────────────────────

  const habilidadesFiltradas = todasHabilidades.filter(h => {
    const matchesCategoriaArea = !selectedArea || h.area_id === selectedArea;
    const matchesBusca = h.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         h.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         h.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAno = filterAnoEscolar === 'all' || h.ano_escolar === filterAnoEscolar;
    return matchesCategoriaArea && matchesBusca && matchesAno;
  });

  const anos = [
    'all',
    '3º-5º ano',
    '6º-7º ano',
    '6º-9º ano',
    '7º ano',
    '8º ano',
    '8º-9º ano',
    '9º ano'
  ];

  // ────────────────────────────────────────────────────────────────
  // RENDER: Vista de Área Específica
  // ────────────────────────────────────────────────────────────────

  if (selectedArea) {
    const areaData = areas.find(a => a.id === selectedArea);
    const habilidadesArea = todasHabilidades.filter(h => h.area_id === selectedArea);

    return (
      <div className="max-w-6xl mx-auto p-8">
        {/* Botão Voltar */}
        <button 
          onClick={() => setSelectedArea(null)}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
        >
          <ChevronLeft size={20} /> Voltar para BNCC
        </button>

        {/* Header da Área */}
        <div className={`bg-gradient-to-r ${areaData.cor} rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 text-9xl">{areaData.icone}</div>
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">{areaData.icone}</div>
            <h1 className="text-4xl font-extrabold mb-2">{areaData.nome}</h1>
            <p className="text-white/90 text-lg">{areaData.descricao}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                Código: {areaData.codigo}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                {habilidadesArea.length} habilidades
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Habilidades da Área */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Book size={28} />
              Habilidades da Área
            </h2>
            <span className="text-sm text-slate-500">
              {habilidadesArea.length} {habilidadesArea.length === 1 ? 'habilidade' : 'habilidades'}
            </span>
          </div>

          {habilidadesArea.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl">
              <Search size={64} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg">Nenhuma habilidade cadastrada para esta área</p>
            </div>
          ) : (
            habilidadesArea.map(hab => (
              <div 
                key={hab.id}
                className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:shadow-lg hover:border-indigo-300 transition cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-full text-sm font-bold">
                        {hab.codigo}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                        {hab.ano_escolar}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition mb-2">
                      {hab.titulo}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{hab.descricao}</p>
                  </div>
                  <ArrowRight size={24} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition ml-4 flex-shrink-0" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────
  // RENDER: Vista Principal BNCC
  // ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header Principal */}
      <div className="mb-12">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-6xl">📚</div>
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
              Base Nacional Comum Curricular (BNCC)
            </h1>
            <p className="text-slate-600 text-lg">
              Explore as áreas de conhecimento, habilidades e competências que norteiam o currículo educacional brasileiro
            </p>
          </div>
        </div>
      </div>

      {/* 10 Competências Gerais */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={28} className="text-yellow-500" />
          <h2 className="text-3xl font-bold text-slate-800">10 Competências Gerais</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {competenciasGerais.map(comp => (
            <div 
              key={comp.numero}
              className={`${comp.cor} p-6 rounded-2xl border-2 border-transparent hover:border-current hover:shadow-lg transition-all text-center cursor-pointer group`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition">{comp.icone}</div>
              <div className="text-2xl font-bold mb-1">{comp.numero}</div>
              <p className="text-sm font-bold leading-tight">{comp.titulo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5 Áreas de Conhecimento */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Book size={28} className="text-indigo-600" />
          <h2 className="text-3xl font-bold text-slate-800">5 Áreas de Conhecimento</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {areas.map(area => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id)}
              className="p-8 rounded-3xl border-2 border-slate-200 transition text-left group cursor-pointer bg-white hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">{area.icone}</div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition mb-2">
                {area.nome}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{area.descricao}</p>
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition">
                Ver habilidades <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Buscar Habilidades */}
      <div className="mt-16">
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-indigo-200 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Search size={28} className="text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-800">Buscar Habilidades</h2>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                🔍 Buscar por código ou título
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: EF07MA01 ou Resolver problemas"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                📅 Ano/Série
              </label>
              <select
                value={filterAnoEscolar}
                onChange={(e) => setFilterAnoEscolar(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {anos.map(ano => (
                  <option key={ano} value={ano}>
                    {ano === 'all' ? '📚 Todos os anos' : ano}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                📖 Área de Conhecimento
              </label>
              <select
                value={selectedArea || 'all'}
                onChange={(e) => setSelectedArea(e.target.value === 'all' ? null : parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="all">🌟 Todas as áreas</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.icone} {area.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão Limpar Filtros */}
          {(searchQuery || filterAnoEscolar !== 'all' || selectedArea) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterAnoEscolar('all');
                setSelectedArea(null);
              }}
              className="mb-6 px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-bold transition"
            >
              ✖️ Limpar filtros
            </button>
          )}

          {/* Resultados */}
          <div className="space-y-3">
            {habilidadesFiltradas.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-slate-200">
                <Search size={64} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600 text-lg font-bold mb-2">Nenhuma habilidade encontrada</p>
                <p className="text-slate-500 text-sm">Tente ajustar os filtros ou termos de busca</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-indigo-700 bg-white px-4 py-2 rounded-lg border-2 border-indigo-200">
                    📊 {habilidadesFiltradas.length} habilidade(s) encontrada(s)
                  </p>
                </div>
                {habilidadesFiltradas.map(hab => {
                  const area = areas.find(a => a.id === hab.area_id);
                  return (
                    <div 
                      key={hab.id} 
                      className="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0">{area?.icone}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-mono font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-700 px-3 py-1 rounded-lg text-sm">
                              {hab.codigo}
                            </span>
                            <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-bold">
                              {hab.ano_escolar}
                            </span>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                              {area?.nome}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition mb-1">
                            {hab.titulo}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{hab.descricao}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BNCCPage;
