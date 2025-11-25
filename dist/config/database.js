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
const seqialize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME || 'match_three_game',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    models: [models_1.Game, models_1.Leaderboard, models_1.GameMove],
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
exports.seqialize = seqialize;
//# sourceMappingURL=database.js.map