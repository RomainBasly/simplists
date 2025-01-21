"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const controller_1 = require("../api/app-auth/controller");
const controller_2 = require("../api/app-email-verification/controller");
const controller_3 = require("../api/app-refresh-token/controller");
const controller_4 = require("../api/app-for-tests/controller");
const publicRoutes = (0, express_1.Router)();
const appAuthController = tsyringe_1.container.resolve(controller_1.AppAuthController);
const appRefreshTokenController = tsyringe_1.container.resolve(controller_3.AppRefreshTokenController);
const appEmailVerification = tsyringe_1.container.resolve(controller_2.AppEmailVerificationController);
const appForTestController = tsyringe_1.container.resolve(controller_4.AppForTestsController);
publicRoutes
    .post('/api/auth/register', (req, res, next) => {
    appAuthController.register(req, res, next);
})
    .post('/api/auth/login', (req, res, next) => appAuthController.login(req, res, next))
    .get('/api/refresh-token', (req, res, next) => {
    appRefreshTokenController.generateNewAccessToken(req, res, next);
})
    .get('/api/test/get-verification-code/:email', (req, res, next) => {
    appForTestController.getVerificationCodeForJest(req, res, next);
})
    .post('/api/test/remove-user-once-test-done', (req, res, next) => {
    appForTestController.removeEmailFunctionAfterTest(req, res, next);
})
    .post('/api/test/check-new-db-function', (req, res, next) => {
    appForTestController.fetchUsersBeneficiariesByListIdForTest(req, res, next);
})
    .post('/api/register/email-verification', (req, res, next) => {
    appEmailVerification.publishAndSendVerificationCode(req, res, next);
})
    .post('/api/register/check-verification-code', (req, res, next) => {
    appEmailVerification.verifyCode(req, res, next);
})
    .post('/api/auth/logout-user', (req, res, next) => {
    appAuthController.logoutUser(req, res, next);
})
    .post('/api/register/testUserInvitations', (req, res, next) => {
    appEmailVerification.getInvitationsByEmail(req, res, next);
});
exports.default = publicRoutes;
