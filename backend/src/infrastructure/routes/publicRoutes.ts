import { Router } from 'express';

import { container } from 'tsyringe';
import { AppAuthController } from '../api/app-auth/controller';
import { AppEmailVerificationController } from '../api/app-email-verification/controller';
import { AppRefreshTokenController } from '../api/app-refresh-token/controller';
import { AppForTestsController } from '../api/app-for-tests/controller';

const publicRoutes = Router();

const appAuthController = container.resolve(AppAuthController);
const appRefreshTokenController = container.resolve(AppRefreshTokenController);
const appEmailVerification = container.resolve(AppEmailVerificationController);

const appForTestController = container.resolve(AppForTestsController);

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

export default publicRoutes;
