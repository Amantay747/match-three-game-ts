"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardController = exports.LeaderboardController = void 0;
const models_1 = require("../models");
class LeaderboardController {
    async getLeaderboard(req, res) {
        try {
            const { difficulty } = req.query;
            let whereClause = {};
            if (difficulty && ['easy', 'medium', 'hard', 'custom'].includes(difficulty)) {
                whereClause.difficulty = difficulty;
            }
            const leaderboardData = await models_1.Leaderboard.findAll({
                where: whereClause,
                order: [['completionTime', 'ASC']],
                limit: 10
            });
            res.json(leaderboardData);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async addToLeaderboard(req, res) {
        try {
            const { playerName, completionTime, difficulty, score, boardSize } = req.body;
            const entry = await models_1.Leaderboard.create({
                playerName,
                difficulty,
                completionTime,
                score,
                boardSize
            });
            res.json(entry);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.LeaderboardController = LeaderboardController;
exports.leaderboardController = new LeaderboardController();
//# sourceMappingURL=LeaderBoardController.js.map