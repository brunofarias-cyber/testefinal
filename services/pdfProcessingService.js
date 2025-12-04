import fs from 'fs';
import Anthropic from '@anthropic-ai/sdk';
import db from '../models/index.js';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY, // Ensure API key is picked up
});

/**
 * Processa PDF e extrai:
 * - Conteúdo estruturado
 * - Key insights
 * - Capítulos/seções
 * - Conecta com IA para análise
 */
async function processPdfFile(filePath, fileName) {
    try {
        // 1. Ler arquivo PDF
        // NOTE: Assuming text content for now as per snippet. 
        // For real PDFs, we'd need 'pdf-parse' or similar.
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // 2. Dividir em chunks (max 8000 chars) para evitar limite de tokens
        const chunks = divideIntoChunks(fileContent, 8000);

        // 3. Análise com Claude para cada chunk
        let allInsights = [];
        let fullAnalysis = '';

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            const response = await client.messages.create({
                model: 'claude-3-opus-20240229', // Updated to a valid available model ID or keep user's if they have specific access
                max_tokens: 1024,
                messages: [
                    {
                        role: 'user',
                        content: `Você é um especialista em metodologias ativas de educação. 
            
Analise este trecho de um livro sobre metodologias ativas e educação inovadora e extraia:

1. **Conceitos-chave**: Principais conceitos mencionados
2. **Metodologias**: Metodologias pedagógicas descritas
3. **Competências**: Competências que devem ser desenvolvidas
4. **Critérios de Avaliação**: Como avaliar o desempenho nesta área
5. **Indicadores**: Indicadores de sucesso

TRECHO:
${chunk}

Responda em JSON estruturado.`,
                    },
                ],
            });

            const analysisText = response.content[0].text;
            fullAnalysis += analysisText + '\n\n';

            try {
                // Attempt to find JSON in the response if it includes text
                const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
                const parsed = JSON.parse(jsonStr);
                allInsights.push(parsed);
            } catch (e) {
                console.log('Erro ao parsear JSON - continuando...', e.message);
            }
        }

        // 4. Criar resumo executivo do documento
        const summaryResponse = await client.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 2048,
            messages: [
                {
                    role: 'user',
                    content: `Baseado na análise acima de um livro sobre "Metodologias Ativas para uma Educação Inovadora" 
por Lilian Bacich e José Moran, crie:

1. **Resumo Executivo**: 3-4 parágrafos resumindo o livro
2. **Tópicos Principais**: 5-7 tópicos principais
3. **Aplicações Práticas**: Como aplicar no ensino de projetos
4. **Critérios de Avaliação BNCC**: Como conectar com BNCC
5. **Indicadores de Sucesso**: Métricas para avaliar implementação

ANÁLISES ANTERIORES:
${fullAnalysis}`,
                },
            ],
        });

        const summary = summaryResponse.content[0].text;

        // 5. Estruturar capítulos e seções
        const chapters = extractChapters(fileContent);

        // 6. Criar embedding para busca semântica
        const keyContent = extractKeyContent(fileContent);

        // 7. Salvar no banco
        const reference = await db.TheoreticalReference.create({
            title: 'Metodologias Ativas para uma Educação Inovadora',
            authors: 'Lilian Bacich, José Moran',
            publicationYear: 2018,
            category: 'active-methodologies',
            content: fileContent.substring(0, 5000), // Primeiros 5000 chars
            keyInsights: allInsights,
            chapters: chapters,
            embeddings: keyContent,
            source: fileName,
            processingStatus: 'completed',
        });

        return {
            success: true,
            referenceId: reference.id,
            summary,
            insights: allInsights,
            chapters,
        };
    } catch (error) {
        console.error('Erro ao processar PDF:', error);
        throw error;
    }
}

/**
 * Extrai capítulos e seções do conteúdo
 */
function extractChapters(content) {
    const chapters = [];
    const lines = content.split('\n');

    let currentChapter = null;

    for (const line of lines) {
        // Detectar capítulos (linhas em caps seguidas de conteúdo)
        if (line.match(/^[A-Z][A-Z\s]+$/)) {
            currentChapter = {
                title: line.trim(),
                sections: [],
                startIndex: content.indexOf(line),
            };
            chapters.push(currentChapter);
        }

        // Detectar seções
        if (currentChapter && line.startsWith('  ') && line.match(/^  [A-Z]/)) {
            currentChapter.sections.push(line.trim());
        }
    }

    return chapters;
}

/**
 * Extrai conteúdo-chave para embeddings
 */
function extractKeyContent(content) {
    const keywords = [
        'metodologia',
        'ativa',
        'aprendizagem',
        'projeto',
        'competência',
        'avaliação',
        'BNCC',
        'estudante',
        'professor',
        'conhecimento',
        'habilidade',
        'problema',
        'solução',
        'colaboração',
        'criatividade',
    ];

    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    const keyPhrases = [];

    for (const sentence of sentences) {
        for (const keyword of keywords) {
            if (sentence.toLowerCase().includes(keyword)) {
                keyPhrases.push(sentence.trim());
                break;
            }
        }
    }

    return keyPhrases.slice(0, 100).join(' | ');
}

/**
 * Divide conteúdo em chunks
 */
function divideIntoChunks(content, maxChunkSize) {
    const chunks = [];
    let currentChunk = '';

    const paragraphs = content.split('\n\n');

    for (const paragraph of paragraphs) {
        if ((currentChunk + paragraph).length < maxChunkSize) {
            currentChunk += paragraph + '\n\n';
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = paragraph + '\n\n';
        }
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}

export {
    processPdfFile,
    extractChapters,
    extractKeyContent,
};
