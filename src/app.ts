import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import express, { Express } from 'express';
import cors from 'cors';
import { corsOptions } from './config/common';
import publicRouter from './infrastructure/routes/publicRoutes';
import protectedRouter from './infrastructure/routes/protectedRoutes';
import { corsOriginCheck, verifyRequestApiKey, verifyUserAccessToken } from './middlewares/auth-middleware';
import cookieParser from 'cookie-parser';

import './infrastructure/api/app-auth/controller';
import { errorHandler } from './domain/common/errors';
import { limiter as rateIPLimiter } from './middlewares/common';
import { initContainers } from './infrastructure/tsyringe/containerConfig';

initContainers();
const app: Express = express();
const port = 8000;

app.use(corsOriginCheck);
app.use(cors(corsOptions));

app.use(rateIPLimiter);

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use(verifyRequestApiKey);
// Todo implement a rateLimit for a specific route
app.use(publicRouter);

app.use(verifyUserAccessToken, protectedRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
