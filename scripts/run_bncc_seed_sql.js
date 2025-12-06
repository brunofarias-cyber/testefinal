import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // Set to console.log to see SQL
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function runSeed() {
    try {
        console.log('🔌 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connection established successfully.');

        console.log('📖 Reading SQL seed file...');
        const sqlPath = path.join(__dirname, '01_SEED_BNCC_DATABASE.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing SQL seed...');
        // Execute the entire SQL script contents
        await sequelize.query(sql);

        console.log('✨ BNCC Database Seed completed successfully! ✨');
        console.log('   - Tables created/verified: bncc_areas, bncc_competencias_gerais, bncc_habilidades');
        console.log('   - Views created: v_bncc_habilidades_completo, v_projetos_com_bncc');

    } catch (error) {
        console.error('❌ Error executing BNCC seed:', error);
    } finally {
        await sequelize.close();
    }
}

runSeed();
