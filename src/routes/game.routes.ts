import { Router } from 'express';
import { gameController } from '../controllers/GameController';
import { leaderboardController } from '../controllers/LeaderBoardController';

const router = Router();

router.post('/games', gameController.createGame);
router.get('/games/:gameId', gameController.getGameState);
router.post('/games/:gameId/reset', gameController.resetBoard);
router.get('/leaderboard', leaderboardController.getLeaderboard);


export const gameRoutes = router;