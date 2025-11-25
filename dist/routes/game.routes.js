"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRoutes = void 0;
const express_1 = require("express");
const GameController_1 = require("../controllers/GameController");
const LeaderBoardController_1 = require("../controllers/LeaderBoardController");
const router = (0, express_1.Router)();
router.post('/games', GameController_1.gameController.createGame);
router.get('/games/:gameId', GameController_1.gameController.getGameState);
router.post('/games/:gameId/reset', GameController_1.gameController.resetBoard);
router.get('/leaderboard', LeaderBoardController_1.leaderboardController.getLeaderboard);
exports.gameRoutes = router;
//# sourceMappingURL=game.routes.js.map