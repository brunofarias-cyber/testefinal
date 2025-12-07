import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Conectar ao banco de dados
let sequelize;

if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL detectado, conectando ao banco...');
    
    // Parse URL corretamente - Sequelize espera URL SEM protocol quando tem dialectOptions
    const url = new URL(process.env.DATABASE_URL);
    
    sequelize = new Sequelize(
        url.pathname.slice(1),  // database name (sem leading /)
        url.username,           // username
        url.password,           // password
        {
            host: url.hostname,
            port: url.port || 5432,
            dialect: 'postgres',
            ssl: true,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: process.env.NODE_ENV === 'development' ? console.log : false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
} else {
    console.warn('⚠️  DATABASE_URL não está definido!');
    console.warn('📝 Criando instância Sequelize sem conexão (modo offline)');
    
    // Criar instância sem conexão real (apenas inicializa)
    sequelize = new Sequelize({
        dialect: 'postgres',
        logging: false
    });
}

export default sequelize;
