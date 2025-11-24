import { Router } from 'express';
import { gameController } from '../controllers/gameController';
import { LeaderboardController } from '../controllers/leaderboardController';

const router = Router();

router.post('/games', gameController.createGame);
router.get('/games/:gameId', gameController.getGameState);
router.post('/games/:gameId/reset', gameController.resetBoard);
router.get('/leaderboard', LeaderboardController.addToLeaderboard);


export const gameRoutes = router;