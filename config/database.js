import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ✅ OPÇÃO 1: Se DATABASE_URL está definido, usar ele
// ❌ OPÇÃO 2: Se não, usar mock (modo offline/desenvolvimento)
let sequelize;

if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL detectado, conectando ao banco...');
    
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        port: 5432,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        typeValidation: false,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
} else {
    console.warn('⚠️  DATABASE_URL não está definido!');
    console.warn('📝 Criando instância Sequelize sem conexão (modo offline)');
    
    // Criar instância sem conexão real (apenas inicializa)
    // Usar postgres sem URL real (não vai conectar mas não vai quebrar)
    sequelize = new Sequelize({
        dialect: 'postgres',
        replication: false,
        logging: false
    });
}

export default sequelize;
