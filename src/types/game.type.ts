export type Difficulty = 'easy' | 'medium' | 'hard' | 'custom';
export type GameStatus = 'active' | 'completed' | 'failed';
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Coordinate {
    row: number;
    col: number;
}

export interface GameConfig {
    boardSize: number;
    targetScore: number;
    oneSwapMode: boolean;
    randomItemMode: boolean;
    itemsCount: number;
}

export interface MoveResult {
    finalBoard: string[][];
    snapshots: any[];
    score: number;
    hadMatches: boolean;
}

export interface SwapRequest {
    direction: Direction;
    fromRow: number;
    fromCol: number;
}

export interface CreateGameRequest {
    difficulty?: Difficulty;
    customSettings?: CustomSettings;
}

export interface CustomSettings {
    boardSize?: number;
    targetScore?: number;
    oneSwapMode?: boolean;
    randomItemMode?: boolean;
    itemsCount?: number;
}

export interface GameResponse {
    gameId: string;
    board: string[][];
    difficulty: Difficulty;
    targetScore: number;
    score: number;
    selectedItem?: string | null;
    oneSwapMode: boolean;
    status?: GameStatus;
    lastActivity?: Date;
}

export interface SwapResponse {
    gameId: string;
    snapshots: any[];
    finalBoard: string[][];
    score: number;
    gameCompleted: boolean;
    hadMatches: boolean;
    totalScoreFromMove: number;
}
