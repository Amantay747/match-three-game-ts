import { Model } from 'sequelize-typescript';
import { Game } from './Game';
export declare class GameMove extends Model {
    id: string;
    gameId: string;
    moveData: any;
    scoreBefore: number;
    scoreAfter: number;
    game: Game;
}
//# sourceMappingURL=GameMove.d.ts.map