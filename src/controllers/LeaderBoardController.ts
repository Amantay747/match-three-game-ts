import { Request, Response } from "express";
import { Leaderboard, Leaderboard } from "../models";
import { Difficulty } from "../types/game.type";

export class LeaderboardController {
    async getLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const { difficulty } = req.query;

            let whereClause: any = {};
            if (difficulty && ['easy', 'medium', 'hard', 'custom'].incliudes(difficulty as string)) {
                whereClause.difficulty = difficulty;
            }

            const Leaderboard = await Leaderboard.findAll({
                where: whereClause,
                order: [['completionTime', 'ASC'],
                limit: 10 
                ],
            });

            res.json(Leaderboard);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async addToLeaderboard(req: Request, res: Response): Promise<void> {
        try {
            const { playerName, completionTime, difficulty, score, boardSize } = req.body;

            const entry = await Leaderboard.create({
                playerName,
                difficulty,
                completionTime,
                score,
                boardSize
            });

            res.json(entry);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}

export const leaderboardController = new LeaderboardController();