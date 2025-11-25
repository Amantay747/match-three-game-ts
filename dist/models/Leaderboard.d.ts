import { Model } from 'sequelize-typescript';
import { Difficulty } from '../types/game.type';
export declare class Leaderboard extends Model {
    id: string;
    playerName: string;
    difficulty: Difficulty;
    completionTime: number;
    score: number;
    boardSize: number;
    get rankKey(): string;
}
//# sourceMappingURL=Leaderboard.d.ts.map