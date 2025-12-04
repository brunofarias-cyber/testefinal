import {
    GeneralCompetency,
    Discipline,
    Skill
} from '../models/index.js';

const BNCC_DATA = {
    "generalCompetencies": [
        {
            "code": "GC001",
            "name": "Conhecimento",
            "description": "Valorizar e utilizar os conhecimentos historicamente construídos sobre o mundo físico, social, cultural e digital para entender e interpretar a realidade, continuar aprendendo e colaborar para a construção de uma sociedade justa, democrática e inclusiva."
        },
        {
            "code": "GC002",
            "name": "Pensamento Científico, Crítico e Criativo",
            "description": "Exercitar a curiosidade intelectual e recorrer à abordagem própria das ciências, incluindo a investigação, a reflexão, a análise crítica, a imaginação e a criatividade, para investigar causas, elaborar e testar hipóteses, formular e resolver problemas e criar soluções (inclusive tecnológicas) com base nos conhecimentos das diferentes áreas."
        },
        {
            "code": "GC003",
            "name": "Repertório Cultural",
            "description": "Valorizar e fruir as diversas manifestações artísticas e culturais, das locais às mundiais, e também participar de práticas diversificadas da produção artístico-cultural."
        },
        {
            "code": "GC004",
            "name": "Comunicação",
            "description": "Utilizar diferentes linguagens – verbal (oral ou visual-motora), corporal, visual, sonora e digital – bem como conhecimentos das linguagens artística, matemática e científica, para se expressar e partilhar informações, experiências, ideias e sentimentos em diferentes contextos e produzir sentidos que levem ao entendimento mútuo."
        },
        {
            "code": "GC005",
            "name": "Cultura Digital",
            "description": "Compreender, utilizar e criar tecnologias digitais de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais (incluindo as escolares) para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva."
        },
        {
            "code": "GC006",
            "name": "Trabalho e Projeto de Vida",
            "description": "Valorizar a diversidade de saberes e vivências culturais e apropriar-se de conhecimentos e experiências que lhe possibilitem entender as relações próprias do mundo do trabalho e fazer escolhas alinhadas ao exercício da cidadania e ao seu projeto de vida, com liberdade, autonomia, consciência crítica e responsabilidade."
        },
        {
            "code": "GC007",
            "name": "Argumentação",
            "description": "Argumentar com base em fatos, dados e informações confiáveis, para formular, negociar e defender ideias, pontos de vista e decisões comuns que respeitem e promovam os direitos humanos, a consciência socioambiental e o consumo responsável em âmbito local, regional e global, com posicionamento ético em relação ao cuidado de si mesmo, dos outros e do planeta."
        },
        {
            "code": "GC008",
            "name": "Autoconhecimento e Autocuidado",
            "description": "Conhecer-se, apreciar-se e cuidar de sua saúde física e emocional, compreendendo-se na diversidade humana e reconhecendo suas emoções e as dos outros, com autocrítica e capacidade para lidar com elas."
        },
        {
            "code": "GC009",
            "name": "Empatia e Cooperação",
            "description": "Exercitar a empatia, o diálogo, a resolução de conflitos de forma pacífica e a cooperação, fazendo-se respeitar e promovendo o respeito ao outro e aos direitos humanos, com acolhimento e valorização da diversidade de indivíduos e de grupos sociais, seus saberes, identidades, culturas e potencialidades, sem preconceitos de qualquer natureza."
        },
        {
            "code": "GC010",
            "name": "Responsabilidade e Cidadania",
            "description": "Agir pessoal e coletivamente com autonomia, responsabilidade, flexibilidade, resiliência e determinação, tomando decisões com base em princípios éticos, democráticos, inclusivos, sustentáveis e solidários."
        }
    ],
    "disciplines": [
        { "id": "MA", "name": "Matemática", "area": "Matemática" },
        { "id": "LP", "name": "Língua Portuguesa", "area": "Linguagens" },
        { "id": "LI", "name": "Língua Estrangeira", "area": "Linguagens" },
        { "id": "EF", "name": "Educação Física", "area": "Linguagens" },
        { "id": "AR", "name": "Arte", "area": "Linguagens" },
        { "id": "CI", "name": "Ciências", "area": "Ciências da Natureza" },
        { "id": "HI", "name": "História", "area": "Ciências Humanas" },
        { "id": "GE", "name": "Geografia", "area": "Ciências Humanas" }
    ]
};

// Simplified skills list (first 20 for quick testing)
const SKILLS_DATA = [
    {
        "code": "EF06MA01",
        "year": 6,
        "disciplineId": "MA",
        "description": "Comparar, ordenar, ler e escrever números naturais e números racionais cuja representação decimal é finita, fazendo uso da reta numérica.",
        "generalCompetencies": ["GC001", "GC002"],
        "context": "Representação e ordem de números"
    },
    {
        "code": "EF06MA02",
        "year": 6,
        "disciplineId": "MA",
        "description": "Reconhecer o sistema de numeração decimal, como o que prevaleceu no mundo ocidental, e destacar semelhanças e diferenças com outros sistemas, antigos ou ainda em uso, como os indígenas e chinês.",
        "generalCompetencies": ["GC001", "GC003"],
        "context": "Sistemas de numeração"
    },
    {
        "code": "EF06CI01",
        "year": 6,
        "disciplineId": "CI",
        "description": "Identificar características da Terra (como da estrutura interna da Terra e da camada externa - crosta, manto e núcleo - e suas dinâmicas, incluindo placas tectônicas, vulcões, terremotos e tsunamis).",
        "generalCompetencies": ["GC001", "GC002"],
        "context": "Estrutura da Terra"
    },
    {
        "code": "EF06HI01",
        "year": 6,
        "disciplineId": "HI",
        "description": "Identificar aspectos e formas de registro das sociedades passadas (seus usos, valores, costumes e hábitos), diferenciando-os dos de outras sociedades e épocas.",
        "generalCompetencies": ["GC001", "GC003"],
        "context": "Sociedades passadas"
    },
    {
        "code": "EF06GE01",
        "year": 6,
        "disciplineId": "GE",
        "description": "Comparar modificações das paisagens nos lugares de vivência e os usos desses lugares em diferentes tempos.",
        "generalCompetencies": ["GC001", "GC003"],
        "context": "Modificação de paisagens"
    },
    {
        "code": "EF06LP01",
        "year": 6,
        "disciplineId": "LP",
        "description": "Reconhecer a forma de composição de textos do gênero notícia: lide, desenvolvimento, dados, declarações de pessoas envolvidas, fontes e datas que sustentam o texto.",
        "generalCompetencies": ["GC001", "GC003", "GC004"],
        "context": "Estrutura de notícia"
    },
    {
        "code": "EF07MA01",
        "year": 7,
        "disciplineId": "MA",
        "description": "Explicar o significado de percentuais maiores que 100% e menores que 1%.",
        "generalCompetencies": ["GC001", "GC002"],
        "context": "Percentuais especiais"
    },
    {
        "code": "EF07LP01",
        "year": 7,
        "disciplineId": "LP",
        "description": "Reconhecer o documento como monumento histórico e perceber a organização e o tratamento de informações nele contido para questionar sua função social, sua contextualização de época e o destinatário de informações, relacionado a conflitos, poder e coletividade.",
        "generalCompetencies": ["GC001", "GC003"],
        "context": "Documentos históricos"
    },
    {
        "code": "EF07HI01",
        "year": 7,
        "disciplineId": "HI",
        "description": "Explicar o significado de \"Idade Média\" e suas principais características na Europa Ocidental - território, poder político, religião, sociedade e cultura - e discutir a origem medieval de algumas instituições, valores e perspectivas que marcam a atualidade.",
        "generalCompetencies": ["GC001", "GC003"],
        "context": "Idade Média"
    },
    {
        "code": "EF08MA01",
        "year": 8,
        "disciplineId": "MA",
        "description": "Reconhecer que os números racionais positivos podem ser expressos nas formas fracionária e decimal, estabelecer relações entre essas representações, passando de uma representação para outra, e relacioná-los a pontos na reta numérica.",
        "generalCompetencies": ["GC001", "GC002"],
        "context": "Representação de racionais"
    },
    {
        "code": "EF08HI01",
        "year": 8,
        "disciplineId": "HI",
        "description": "Reconhecer a História como resultado da ação do ser humano no tempo e no espaço, com base na análise de processos sociais (tais como formação econômica, praticamente politicamente e culturalmente), discutindo como compõem quadros de mudança no mundo atual.",
        "generalCompetencies": ["GC001", "GC002", "GC003"],
        "context": "História como ciência"
    },
    {
        "code": "EF09MA01",
        "year": 9,
        "disciplineId": "MA",
        "description": "Reconhecer que, uma vez fixada uma unidade de comprimento, existem segmentos de reta cujo comprimento não é racional.",
        "generalCompetencies": ["GC001", "GC002"],
        "context": "Números irracionais"
    },
    {
        "code": "EF09HI01",
        "year": 9,
        "disciplineId": "HI",
        "description": "Descrever e contextualizar os mecanismos de funcionamento das sociedades mercantis e o papel do consumismo nos séculos passados para o desenvolvimento do capitalismo.",
        "generalCompetencies": ["GC001", "GC002", "GC003"],
        "context": "Sociedades mercantis"
    }
];

export async function seedBNCCData() {
    try {
        console.log('📚 Iniciando seed dos dados da BNCC...');

        // 1. Inserir Competências Gerais
        console.log('📝 Inserindo Competências Gerais...');
        for (const comp of BNCC_DATA.generalCompetencies) {
            await GeneralCompetency.findOrCreate({
                where: { code: comp.code },
                defaults: comp
            });
        }
        console.log(`✅ ${BNCC_DATA.generalCompetencies.length} Competências Gerais inseridas`);

        // 2. Inserir Disciplinas
        console.log('📚 Inserindo Disciplinas...');
        for (const disc of BNCC_DATA.disciplines) {
            await Discipline.findOrCreate({
                where: { id: disc.id },
                defaults: disc
            });
        }
        console.log(`✅ ${BNCC_DATA.disciplines.length} Disciplinas inseridas`);

        // 3. Inserir Habilidades
        console.log('🎯 Inserindo Habilidades...');
        for (const skill of SKILLS_DATA) {
            await Skill.findOrCreate({
                where: { code: skill.code },
                defaults: skill
            });
        }
        console.log(`✅ ${SKILLS_DATA.length} Habilidades inseridas`);

        console.log('✅ Seed BNCC completo!');
    } catch (error) {
        console.error('❌ Erro ao fazer seed BNCC:', error);
        throw error;
    }
}

export default seedBNCCData;
