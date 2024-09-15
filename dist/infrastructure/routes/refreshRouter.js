"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const controller_1 = require("../api/app-refresh-token/controller");
const refreshTokenRouter = (0, express_1.Router)();
const appRefreshTokenController = tsyringe_1.container.resolve(controller_1.AppRefreshTokenController);
refreshTokenRouter.get('/api/refresh-token', (req, res, next) => {
    appRefreshTokenController.generateNewAccessToken(req, res, next);
});
// refreshTokenRouter.post('/api/auth/logoutUser', (req, res, next) => {
//   appRefreshTokenController.disconnectUser(req, res, next);
// });
exports.default = refreshTokenRouter;
