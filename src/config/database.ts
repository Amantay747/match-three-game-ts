import {  Sequelize } from 'sequelize-typescript';
import { Game, Leaderboard, GameMove } from '../models';
import dotenv from 'dotenv';

dotenv.config();

const seqialize = new Sequelize({
    database: process.env.DB_NAME || 'match_three_game',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    models: [Game, Leaderboard, GameMove],
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export { seqialize };