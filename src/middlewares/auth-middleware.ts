import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { allowedOrigins } from '../config/common';
import { RoleAssignments, Roles } from '../common/types/api';

import { ErrorMessages, ForbiddenError } from '../domain/common/errors';
import { retrieveTokenFromCookie } from '../common/helpers';
import { JwtPayloadAccessToken } from '../infrastructure/jwtToken/services';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const envApiKey = process.env.BACKEND_API_KEY;

interface IRequest extends Request {
  id?: number;
  roles?: RoleAssignments;
}

export const verifyRequestApiKey = (req: IRequest, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-API-KEY');
  if (!apiKey) return res.status(401).json({ error: 'Missing apiKey' });

  if (apiKey !== envApiKey) {
    return res.status(403).json({ error: 'apiKey not valid' });
  }

  next();
};

export const verifyUserAccessToken = (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      throw new ForbiddenError(ErrorMessages.FORBIDDEN_ERROR);
    }
    const accessToken = retrieveTokenFromCookie(cookieHeader, 'accessToken');
    if (!accessTokenSecret) throw new Error('no accessToken accessible in middleware (verifyToken)');
    const decodedToken = jwt.verify(accessToken, accessTokenSecret) as JwtPayloadAccessToken;

    jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
      if (err) {
        throw err;
      }
      req.id = decodedToken.userInfo.id;
      req.roles = decodedToken.userInfo.roles;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const verifyRefreshToken = (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) throw new Error('no refreshToken accessible in middleware (verifyToken)');
    const refreshTokenCookie = retrieveTokenFromCookie(cookieHeader, 'refreshToken');
    if (!refreshTokenCookie) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!refreshTokenSecret) throw new Error('no refreshToken accessible in middleware (verifyToken)');

    const refreshToken = refreshTokenCookie.split('=')[1];

    jwt.verify(refreshToken, refreshTokenSecret, (err) => {
      if (err) {
        throw err;
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const corsOriginCheck = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
};

export const verifyRoles = (...allowedRoles: Roles[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    if (!req?.roles) return res.sendStatus(401);
    const hasSufficientRole = Object.entries(req.roles).some(([role, assigned]) => {
      return assigned && allowedRoles.includes(role as Roles);
    });

    if (!hasSufficientRole) return res.sendStatus(403);

    next();
  };
};
