import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Conectar ao banco de dados OU criar instância vazia
let sequelize;

if (process.env.DATABASE_URL) {
    console.log('✅ Tentando conectar ao banco...');
    
    try {
        // Parse URL corretamente
        const url = new URL(process.env.DATABASE_URL);
        
        sequelize = new Sequelize(
            url.pathname.slice(1),  // database name
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
                logging: false,  // ← Desabilitar logs para ser mais rápido
                pool: {
                    max: 5,
                    min: 0,
                    acquire: 10000,  // ← Reduzir timeout de 30s para 10s
                    idle: 10000
                }
            }
        );
    } catch (error) {
        console.warn('⚠️ Erro ao parsear DATABASE_URL, usando modo offline');
        sequelize = new Sequelize({
            dialect: 'postgres',
            logging: false
        });
    }
} else {
    console.warn('⚠️ DATABASE_URL não definido, usando modo offline');
    
    // Criar instância vazia (não conecta)
    sequelize = new Sequelize({
        dialect: 'postgres',
        logging: false
    });
}

export default sequelize;
