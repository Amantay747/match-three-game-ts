import { Sequelize } from 'sequelize-typescript';
import { Game, Leaderboard, GameMove } from '../models';
import dotenv from 'dotenv';

dotenv.config();

// Support both individual env vars and DATABASE_URL (for Railway, Heroku, etc.)
let sequelizeConfig: any;

console.log('='.repeat(50));
console.log('Database Configuration');
console.log('='.repeat(50));
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Not set');
console.log('DB_HOST:', process.env.DB_HOST || 'not set (using localhost)');
console.log('DB_NAME:', process.env.DB_NAME || 'not set (using match_three_game)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('='.repeat(50));

if (process.env.DATABASE_URL) {
    // Use DATABASE_URL for production environments (Railway, Heroku, etc.)
    console.log('✓ Using DATABASE_URL for database connection');
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
    // Use individual env vars for local development or Railway with separate vars
    console.log('✓ Using individual environment variables for database connection');

    // On Railway, check if it's using PGHOST, PGUSER, PGPASSWORD (PostgreSQL standard)
    const host = process.env.DB_HOST || process.env.PGHOST || 'localhost';
    const user = process.env.DB_USER || process.env.PGUSER || 'postgres';
    const password = process.env.DB_PASS || process.env.PGPASSWORD || 'postgres';
    const database = process.env.DB_NAME || process.env.PGDATABASE || 'match_three_game';
    const port = process.env.DB_PORT || process.env.PGPORT || 5432;

    console.log(`Connecting to: ${user}@${host}:${port}/${database}`);

    sequelizeConfig = {
        database: database,
        username: user,
        password: password,
        host: host,
        port: Number(port),
        dialect: 'postgres',
        models: [Game, Leaderboard, GameMove],
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
        },
    };
}

const seqialize = new Sequelize(sequelizeConfig);

export { seqialize };