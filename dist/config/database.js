"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seqialize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../models");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Support both individual env vars and DATABASE_URL (for Railway, Heroku, etc.)
let sequelizeConfig;
if (process.env.DATABASE_URL) {
    // Use DATABASE_URL for production environments (Railway, Heroku, etc.)
    console.log('Using DATABASE_URL for database connection');
    sequelizeConfig = {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        models: [models_1.Game, models_1.Leaderboard, models_1.GameMove],
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
        },
    };
}
else {
    // Use individual env vars for local development
    console.log('Using individual environment variables for database connection');
    sequelizeConfig = {
        database: process.env.DB_NAME || 'match_three_game',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        models: [models_1.Game, models_1.Leaderboard, models_1.GameMove],
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
    };
}
const seqialize = new sequelize_typescript_1.Sequelize(sequelizeConfig);
exports.seqialize = seqialize;
//# sourceMappingURL=database.js.map