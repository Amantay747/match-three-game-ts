import { Sequelize } from 'sequelize-typescript';
import { Game, Leaderboard, GameMove } from '../models';
import dotenv from 'dotenv';

dotenv.config();

// Support both individual env vars and DATABASE_URL (for Railway, Heroku, etc.)
let sequelizeConfig: any;

if (process.env.DATABASE_URL) {
    // Use DATABASE_URL for production environments (Railway, Heroku, etc.)
    console.log('Using DATABASE_URL for database connection');
    sequelizeConfig = {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        models: [Game, Leaderboard, GameMove],
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
        },
    };
} else {
    // Use individual env vars for local development
    console.log('Using individual environment variables for database connection');
    sequelizeConfig = {
        database: process.env.DB_NAME || 'match_three_game',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        models: [Game, Leaderboard, GameMove],
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
    };
}

const seqialize = new Sequelize(sequelizeConfig);

export { seqialize };