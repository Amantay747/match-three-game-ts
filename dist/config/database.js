"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seqialize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const models_1 = require("../models");
const dotenv_1 = __importDefault(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Load environment variables - prioritize .env.docker in Docker, fallback to .env
const envPath = fs.existsSync(path.join(process.cwd(), '.env.docker'))
    ? path.join(process.cwd(), '.env.docker')
    : path.join(process.cwd(), '.env');
dotenv_1.default.config({ path: envPath });
console.log(`Loading env file: ${envPath}`);
// Support both individual env vars and DATABASE_URL (for Railway, Heroku, etc.)
let sequelizeConfig;
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
        models: [models_1.Game, models_1.Leaderboard, models_1.GameMove],
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
        },
    };
}
else {
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
        models: [models_1.Game, models_1.Leaderboard, models_1.GameMove],
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false,
        },
    };
}
const seqialize = new sequelize_typescript_1.Sequelize(sequelizeConfig);
exports.seqialize = seqialize;
//# sourceMappingURL=database.js.map