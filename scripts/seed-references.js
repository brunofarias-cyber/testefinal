import sequelize from '../config/database.js';
import { TheoreticalReference } from '../models/index.js';

const seedReferences = async () => {
    try {
        console.log('🌱 Iniciando seed de Referências Teóricas...');

        // Verificar se já existe
        const count = await TheoreticalReference.count();
        if (count > 0) {
            console.log('⚠️ Referências já existem. Pulando seed.');
            return;
        }

        await TheoreticalReference.create({
            title: 'Metodologias Ativas para uma Educação Inovadora',
            authors: 'Lilian Bacich, José Moran',
            publicationYear: 2018,
            category: 'active-methodologies',
            source: 'metodologias_ativas_bacich_moran.pdf',
            processingStatus: 'pending',
            content: 'Conteúdo inicial pendente de processamento...' // Placeholder required by non-null constraint
        });

        console.log('✅ Referência inicial criada com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao criar referências:', error);
    }
};

// Se executado diretamente
if (process.argv[1] === import.meta.url.substring(7)) {
    seedReferences().then(() => process.exit());
}

export default seedReferences;
