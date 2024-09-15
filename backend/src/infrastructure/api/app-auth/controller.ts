import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import assert from 'assert';
import { AppAuthService } from '../../../domain/auth/services';
import { UserAlreadyExistsError } from '../../../domain/common/errors';
import { cookieHandler, parseCookies } from '../../../common/helpers';

interface UserInfo {
  id: number;
  userName: string;
  email: string;
  roles: {};
  password: string;
}

// Here is injection dependencies used in this architecture
// If you do not get it please check tsyringe
@injectable()
export class AppAuthController {
  constructor(@inject(AppAuthService) private readonly appAuthService: AppAuthService) {}

  async register(req: Request<{}, {}, UserInfo>, res: Response, next: NextFunction): Promise<void> {
    const { id, userName, email, password } = req.body;
    if (!email || !password || !userName) {
      res.status(400).json('userName, email and password are required');
      return;
    }
    try {
      await this.appAuthService.registerUser(id, userName, email, password);
      res.status(201).json({ message: 'new user created' });
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        res.status(409).json({ message: error.message });
      } else {
        console.error('Error in AppUserController', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  async login(req: Request<{}, {}, UserInfo>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await this.appAuthService.login(email, password);

      assert(refreshToken, 'problem with refreshToken inside controller');
      assert(accessToken, 'problem with accesstoken inside controller');
      cookieHandler(req, res, refreshToken);
      res.json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  }

  async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieHeaders = req.headers.cookie;
      const userId = req.body['userId'];
      if (!cookieHeaders) {
        await this.appAuthService.logoutUser(userId);
        res.status(200).json({
          status: 'ok',
          message: 'Disconnection OK. Please clear cookies and redirect to login page.',
          action: 'clear_cookies_and_redirect',
          redirectUrl: '/login',
        });
        return;
      }

      await this.appAuthService.logoutUser(userId);
      res.status(200).json({
        status: 'ok',
        message: 'Disconnection OK. Please clear cookies and redirect to login page.',
        action: 'clear_cookies_and_redirect',
        redirectUrl: '/login',
      });
    } catch (error) {
      next(error);
    }
  }
}
