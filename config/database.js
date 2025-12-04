import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Neon URL format: postgresql://user:password@host/database?sslmode=require
const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

export default sequelize;
