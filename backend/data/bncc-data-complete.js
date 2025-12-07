/**
 * ═══════════════════════════════════════════════════════════════════════
 * DADOS COMPLETOS DA BNCC
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Este arquivo contém todos os dados iniciais da BNCC:
 * - 5 Áreas de Conhecimento
 * - 15 Habilidades (3+ por área)
 * - 10 Competências Gerais
 * 
 * Use para popular o banco de dados ou como fallback mock
 */

export const BNCC_AREAS = [
  {
    id: 1,
    codigo: 'MAT',
    nome: 'Matemática',
    descricao: 'Números, álgebra, geometria e estatística',
    icone: '📊',
    ordem: 1
  },
  {
    id: 2,
    codigo: 'LIN',
    nome: 'Linguagens',
    descricao: 'Português, línguas estrangeiras, artes',
    icone: '📖',
    ordem: 2
  },
  {
    id: 3,
    codigo: 'CN',
    nome: 'Ciências da Natureza',
    descricao: 'Física, química, biologia',
    icone: '🔬',
    ordem: 3
  },
  {
    id: 4,
    codigo: 'CS',
    nome: 'Ciências Sociais',
    descricao: 'História, geografia, sociologia',
    icone: '🌍',
    ordem: 4
  },
  {
    id: 5,
    codigo: 'EC',
    nome: 'Educação Completa',
    descricao: 'Educação física, valores humanos',
    icone: '💪',
    ordem: 5
  }
];

export const BNCC_HABILIDADES = [
  // ═════════════════════════════════════════════════════════════════
  // MATEMÁTICA (área 1)
  // ═════════════════════════════════════════════════════════════════
  {
    id: 1,
    area_id: 1,
    codigo: 'EF07MA01',
    ano_escolar: '7º ano',
    titulo: 'Resolver problemas com números naturais',
    descricao: 'Resolver e elaborar problemas com números naturais, envolvendo as noções de divisor e múltiplo',
    competencias_gerais: [1, 2, 7]
  },
  {
    id: 2,
    area_id: 1,
    codigo: 'EF08MA01',
    ano_escolar: '8º ano',
    titulo: 'Efetuar cálculos com potências',
    descricao: 'Efetuar cálculos com potências de expoentes inteiros e aplicar esse conhecimento na representação de números em notação científica',
    competencias_gerais: [1, 2]
  },
  {
    id: 3,
    area_id: 1,
    codigo: 'EF09MA01',
    ano_escolar: '9º ano',
    titulo: 'Reconhecer que todo número racional positivo pode ser escrito como fração',
    descricao: 'Reconhecer que todo número racional positivo pode ser escrito como uma fração decimal ou uma fração ordinária',
    competencias_gerais: [1, 2]
  },

  // ═════════════════════════════════════════════════════════════════
  // LINGUAGENS (área 2)
  // ═════════════════════════════════════════════════════════════════
  {
    id: 4,
    area_id: 2,
    codigo: 'EF67LP01',
    ano_escolar: '6º-7º ano',
    titulo: 'Reconhecer a função e impacto da linguagem',
    descricao: 'Reconhecer a função e o impacto da linguagem nas diferentes manifestações humanas',
    competencias_gerais: [2, 3, 4]
  },
  {
    id: 5,
    area_id: 2,
    codigo: 'EF67LP02',
    ano_escolar: '6º-7º ano',
    titulo: 'Explorar práticas de linguagem',
    descricao: 'Explorar práticas de linguagem em diferentes contextos e situações comunicativas',
    competencias_gerais: [3, 4, 5]
  },
  {
    id: 6,
    area_id: 2,
    codigo: 'EF89LP01',
    ano_escolar: '8º-9º ano',
    titulo: 'Analisar textos publicitários',
    descricao: 'Analisar textos publicitários e de propaganda em uma perspectiva crítica',
    competencias_gerais: [2, 4, 7]
  },

  // ═════════════════════════════════════════════════════════════════
  // CIÊNCIAS NATUREZA (área 3)
  // ═════════════════════════════════════════════════════════════════
  {
    id: 7,
    area_id: 3,
    codigo: 'EF07CI01',
    ano_escolar: '7º ano',
    titulo: 'Discutir importância de visão integrada',
    descricao: 'Discutir a importância da visão integrada da geosfera, biosfera e antroposfera na análise de fenômenos naturais',
    competencias_gerais: [1, 2, 10]
  },
  {
    id: 8,
    area_id: 3,
    codigo: 'EF07CI04',
    ano_escolar: '7º ano',
    titulo: 'Investigar mudanças de estado físico',
    descricao: 'Investigar mudanças de estado físico da matéria e reconhecer processos reversíveis e irreversíveis',
    competencias_gerais: [1, 2, 5]
  },
  {
    id: 9,
    area_id: 3,
    codigo: 'EF08CI01',
    ano_escolar: '8º ano',
    titulo: 'Propor ações para problemas ambientais',
    descricao: 'Propor ações individuais e coletivas para solução de problemas ambientais da localidade',
    competencias_gerais: [2, 6, 9, 10]
  },

  // ═════════════════════════════════════════════════════════════════
  // CIÊNCIAS SOCIAIS (área 4)
  // ═════════════════════════════════════════════════════════════════
  {
    id: 10,
    area_id: 4,
    codigo: 'EF07HI01',
    ano_escolar: '7º ano',
    titulo: 'Explicar significado de eventos históricos',
    descricao: 'Explicar o significado de eventos relacionados à história da humanidade',
    competencias_gerais: [1, 3, 7]
  },
  {
    id: 11,
    area_id: 4,
    codigo: 'EF07GE01',
    ano_escolar: '7º ano',
    titulo: 'Avaliar implicações de atividades econômicas',
    descricao: 'Avaliar as implicações das atividades econômicas considerando impactos ambientais e sociais',
    competencias_gerais: [2, 6, 7, 10]
  },
  {
    id: 12,
    area_id: 4,
    codigo: 'EF08GE01',
    ano_escolar: '8º ano',
    titulo: 'Analisar aspectos do crescimento populacional',
    descricao: 'Analisar aspectos do crescimento populacional, migrações e suas implicações sociais',
    competencias_gerais: [2, 6, 10]
  },

  // ═════════════════════════════════════════════════════════════════
  // EDUCAÇÃO COMPLETA (área 5)
  // ═════════════════════════════════════════════════════════════════
  {
    id: 13,
    area_id: 5,
    codigo: 'EF35EF01',
    ano_escolar: '3º-5º ano',
    titulo: 'Experimentar e fruir diversos tipos de movimento',
    descricao: 'Experimentar e fruir diversos tipos de movimento em diferentes contextos',
    competencias_gerais: [6, 8, 9]
  },
  {
    id: 14,
    area_id: 5,
    codigo: 'EF67EF01',
    ano_escolar: '6º-7º ano',
    titulo: 'Entender o exercício físico como promotor de saúde',
    descricao: 'Entender o exercício físico como promotor de saúde e bem-estar',
    competencias_gerais: [6, 8, 9, 10]
  },
  {
    id: 15,
    area_id: 5,
    codigo: 'EF89EF01',
    ano_escolar: '8º-9º ano',
    titulo: 'Analisar as transformações do corpo no exercício',
    descricao: 'Analisar as transformações do corpo no exercício físico e sua importância na saúde',
    competencias_gerais: [8, 9, 10]
  }
];

export const BNCC_COMPETENCIAS_GERAIS = [
  {
    numero: 1,
    titulo: 'Conhecimento',
    descricao: 'Valorizar e utilizar os conhecimentos historicamente construídos'
  },
  {
    numero: 2,
    titulo: 'Pensamento Científico, Crítico e Criativo',
    descricao: 'Exercitar a curiosidade intelectual'
  },
  {
    numero: 3,
    titulo: 'Repertório Cultural',
    descricao: 'Valorizar as diversas manifestações artísticas e culturais'
  },
  {
    numero: 4,
    titulo: 'Comunicação',
    descricao: 'Utilizar diferentes linguagens para se expressar'
  },
  {
    numero: 5,
    titulo: 'Cultura Digital',
    descricao: 'Compreender, utilizar e criar tecnologias digitais'
  },
  {
    numero: 6,
    titulo: 'Trabalho e Projeto de Vida',
    descricao: 'Valorizar a diversidade de saberes e vivências'
  },
  {
    numero: 7,
    titulo: 'Argumentação',
    descricao: 'Argumentar com base em fatos, dados e informações confiáveis'
  },
  {
    numero: 8,
    titulo: 'Autoconhecimento e Autocuidado',
    descricao: 'Conhecer-se, apreciar-se e cuidar de sua saúde física e emocional'
  },
  {
    numero: 9,
    titulo: 'Empatia e Cooperação',
    descricao: 'Exercitar a empatia, o diálogo e a cooperação'
  },
  {
    numero: 10,
    titulo: 'Responsabilidade e Cidadania',
    descricao: 'Agir pessoal e coletivamente com autonomia, responsabilidade, flexibilidade e resiliência'
  }
];
