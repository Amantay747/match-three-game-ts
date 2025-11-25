import { Request, Response } from 'express';
import { CreateGameRequest, SwapRequest } from '../types/game.type';
export declare class GameController {
    createGame(req: Request<{}, {}, CreateGameRequest>, res: Response): Promise<void>;
    swapItems(req: Request<{
        gameId: string;
    }, {}, SwapRequest>, res: Response): Promise<void>;
    resetBoard(req: Request<{
        gameId: string;
    }>, res: Response): Promise<void>;
    getGameState(req: Request<{
        gameId: string;
    }>, res: Response): Promise<void>;
}
export declare const gameController: GameController;
//# sourceMappingURL=GameController.d.ts.map