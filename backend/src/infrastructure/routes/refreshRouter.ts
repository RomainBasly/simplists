import { Router } from 'express';
import { container } from 'tsyringe';
import { AppRefreshTokenController } from '../api/app-refresh-token/controller';

const refreshTokenRouter = Router();

const appRefreshTokenController = container.resolve(AppRefreshTokenController);

refreshTokenRouter.get('/api/refresh-token', (req, res, next) => {
  appRefreshTokenController.generateNewAccessToken(req, res, next);
});

// refreshTokenRouter.post('/api/auth/logoutUser', (req, res, next) => {
//   appRefreshTokenController.disconnectUser(req, res, next);
// });

export default refreshTokenRouter;
