import { Coordinate, MoveResult } from '../types/game.type';
export declare class GameService {
    private directions;
    generateBoard(size: number, itemsCount: number): string[][];
    getRandomItem(itemsCount: number): string;
    swapItems(board: string[][], fromRow: number, fromCol: number, toRow: number, toCol: number): string[][];
    findMatches(board: string[][]): Coordinate[];
    removeMatches(board: string[][], matches: Coordinate[]): string[][];
    applyGravity(board: string[][]): string[][];
    fillEmptySpaces(board: string[][], itemsCount: number): string[][];
    hasMatches(board: string[][]): boolean;
    processMove(board: string[][], itemsCount: number, randomItem?: string | null): MoveResult;
    isValidSwap(board: string[][], fromRow: number, fromCol: number, toRow: number, toCol: number): boolean;
    checkGameCompletion(currentScore: number, targetScore: number): boolean;
    canMakeValidMove(board: string[][]): boolean;
}
export declare const gameService: GameService;
//# sourceMappingURL=GameService.d.ts.map