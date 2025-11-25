"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameController = exports.GameController = void 0;
const models_1 = require("../models");
const GameService_1 = require("../services/GameService");
class GameController {
    async createGame(req, res) {
        try {
            const { difficulty = 'easy', customSettings } = req.body;
            let gameConfig;
            switch (difficulty) {
                case 'easy':
                    gameConfig = {
                        boardSize: 12,
                        targetScore: 40,
                        oneSwapMode: false,
                        randomItemMode: false,
                        itemsCount: 6
                    };
                    break;
                case 'medium':
                    gameConfig = {
                        boardSize: 8,
                        targetScore: 50,
                        oneSwapMode: true,
                        randomItemMode: false,
                        itemsCount: 6
                    };
                    break;
                case 'hard':
                    gameConfig = {
                        boardSize: 8,
                        targetScore: 25,
                        oneSwapMode: true,
                        randomItemMode: true,
                        itemsCount: 6
                    };
                    break;
                case 'custom':
                    if (!customSettings) {
                        res.status(400).json({ error: 'Custom settings required for custom difficulty' });
                        return;
                    }
                    gameConfig = {
                        boardSize: customSettings.boardSize || 8,
                        targetScore: customSettings.targetScore || 30,
                        oneSwapMode: customSettings.oneSwapMode || false,
                        randomItemMode: customSettings.randomItemMode || false,
                        itemsCount: customSettings.itemsCount || 6
                    };
                    break;
                default:
                    res.status(400).json({ error: 'Invalid difficulty level' });
                    return;
            }
            const board = GameService_1.gameService.generateBoard(gameConfig.boardSize, gameConfig.itemsCount);
            const selectedItem = gameConfig.randomItemMode
                ? GameService_1.gameService.getRandomItem(gameConfig.itemsCount)
                : null;
            const game = await models_1.Game.create({
                difficulty,
                boardSize: gameConfig.boardSize,
                targetScore: gameConfig.targetScore,
                oneSwapMode: gameConfig.oneSwapMode,
                randomItemMode: gameConfig.randomItemMode,
                itemsCount: gameConfig.itemsCount,
                boardState: board,
                selectedItem,
                score: 0,
                status: 'active'
            });
            const response = {
                gameId: game.id,
                board: game.boardState,
                difficulty: game.difficulty,
                targetScore: game.targetScore,
                score: game.score,
                selectedItem: game.selectedItem,
                oneSwapMode: game.oneSwapMode
            };
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async swapItems(req, res) {
        try {
            const { gameId } = req.params;
            const { fromRow, fromCol, direction } = req.body;
            const game = await models_1.Game.findByPk(gameId);
            if (!game) {
                res.status(404).json({ error: 'Game not found' });
                return;
            }
            if (game.status !== 'active') {
                res.status(400).json({ error: 'Game is not active' });
                return;
            }
            const now = new Date();
            const lastActivity = new Date(game.lastActivity);
            if (now.getTime() - lastActivity.getTime() > 60 * 60 * 1000) {
                game.status = 'failed';
                await game.save();
                res.status(400).json({ error: 'Game expired due to inactivity' });
                return;
            }
            const directionMap = {
                'UP': { row: -1, col: 0 },
                'DOWN': { row: 1, col: 0 },
                'LEFT': { row: 0, col: -1 },
                'RIGHT': { row: 0, col: 1 }
            };
            const dir = directionMap[direction];
            if (!dir) {
                res.status(400).json({ error: 'Invalid direction' });
                return;
            }
            const toRow = fromRow + dir.row;
            const toCol = fromCol + dir.col;
            if (!GameService_1.gameService.isValidSwap(game.boardState, fromRow, fromCol, toRow, toCol)) {
                res.status(400).json({ error: 'Invalid swap' });
                return;
            }
            let newBoard = GameService_1.gameService.swapItems(game.boardState, fromRow, fromCol, toRow, toCol);
            const moveResult = GameService_1.gameService.processMove(newBoard, game.itemsCount, game.randomItemMode ? game.selectedItem : null);
            const hadMatches = moveResult.hadMatches;
            if (game.oneSwapMode && !hadMatches) {
                game.score = Math.max(0, game.score - 5);
                moveResult.snapshots = [{
                        board: newBoard,
                        score: game.score,
                        action: 'swap_failed'
                    }];
                moveResult.finalBoard = newBoard;
                moveResult.score = 0;
            }
            else {
                game.score += moveResult.score;
            }
            game.boardState = moveResult.finalBoard;
            game.lastActivity = new Date();
            if (GameService_1.gameService.checkGameCompletion(game.score, game.targetScore)) {
                game.status = 'completed';
                game.endTime = new Date();
                const completionTime = Math.floor((game.endTime.getTime() - game.startTime.getTime()) / 1000);
                await models_1.Leaderboard.create({
                    playerName: 'Anonymous',
                    difficulty: game.difficulty,
                    completionTime,
                    score: game.score,
                    boardSize: game.boardSize
                });
            }
            await game.save();
            const response = {
                gameId: game.id,
                snapshots: moveResult.snapshots,
                finalBoard: moveResult.finalBoard,
                score: game.score,
                gameCompleted: game.status === 'completed',
                hadMatches,
                totalScoreFromMove: moveResult.score
            };
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async resetBoard(req, res) {
        try {
            const { gameId } = req.params;
            const game = await models_1.Game.findByPk(gameId);
            if (!game) {
                res.status(404).json({ error: 'Game not found' });
                return;
            }
            if (game.status !== 'active') {
                res.status(400).json({ error: 'Game is not active' });
                return;
            }
            game.score = Math.max(0, game.score - 5);
            const newBoard = GameService_1.gameService.generateBoard(game.boardSize, game.itemsCount);
            game.boardState = newBoard;
            game.lastActivity = new Date();
            await game.save();
            res.json({
                gameId: game.id,
                board: newBoard,
                score: game.score,
                action: 'board_reset'
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getGameState(req, res) {
        try {
            const { gameId } = req.params;
            const game = await models_1.Game.findByPk(gameId);
            if (!game) {
                res.status(404).json({ error: 'Game not found' });
                return;
            }
            const response = {
                gameId: game.id,
                board: game.boardState,
                difficulty: game.difficulty,
                targetScore: game.targetScore,
                score: game.score,
                selectedItem: game.selectedItem,
                oneSwapMode: game.oneSwapMode,
                status: game.status,
                lastActivity: game.lastActivity
            };
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.GameController = GameController;
exports.gameController = new GameController();
//# sourceMappingURL=GameController.js.map