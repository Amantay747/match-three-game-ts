import { Model } from 'sequelize-typescript';
import { Difficulty, GameStatus } from '../types/game.type';
import { GameMove } from './GameMove';
export declare class Game extends Model {
    id: string;
    difficulty: Difficulty;
    boardSize: number;
    targetScore: number;
    oneSwapMode: boolean;
    randomItemMode: boolean;
    itemsCount: number;
    boardState: string[][];
    score: number;
    selectedItem: string | null;
    status: GameStatus;
    startTime: Date;
    endTime: Date | null;
    lastActivity: Date;
    moves: GameMove[];
}
//# sourceMappingURL=Game.d.ts.map