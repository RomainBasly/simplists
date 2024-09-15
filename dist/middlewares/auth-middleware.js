"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRoles = exports.corsOriginCheck = exports.verifyRefreshToken = exports.verifyUserAccessToken = exports.verifyRequestApiKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("../config/common");
const errors_1 = require("../domain/common/errors");
const helpers_1 = require("../common/helpers");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const envApiKey = process.env.BACKEND_API_KEY;
const verifyRequestApiKey = (req, res, next) => {
    const apiKey = req.header('X-API-KEY');
    if (!apiKey)
        return res.status(401).json({ error: 'Missing apiKey' });
    if (apiKey !== envApiKey) {
        return res.status(403).json({ error: 'apiKey not valid' });
    }
    next();
};
exports.verifyRequestApiKey = verifyRequestApiKey;
const verifyUserAccessToken = (req, res, next) => {
    try {
        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) {
            throw new errors_1.ForbiddenError(errors_1.ErrorMessages.FORBIDDEN_ERROR);
        }
        const accessToken = (0, helpers_1.retrieveTokenFromCookie)(cookieHeader, 'accessToken');
        if (!accessTokenSecret)
            throw new Error('no accessToken accessible in middleware (verifyToken)');
        const decodedToken = jsonwebtoken_1.default.verify(accessToken, accessTokenSecret);
        jsonwebtoken_1.default.verify(accessToken, accessTokenSecret, (err, decoded) => {
            if (err) {
                throw err;
            }
            req.id = decodedToken.userInfo.id;
            req.roles = decodedToken.userInfo.roles;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyUserAccessToken = verifyUserAccessToken;
const verifyRefreshToken = (req, res, next) => {
    try {
        const cookieHeader = req.headers.cookie;
        if (!cookieHeader)
            throw new Error('no refreshToken accessible in middleware (verifyToken)');
        const refreshTokenCookie = (0, helpers_1.retrieveTokenFromCookie)(cookieHeader, 'refreshToken');
        if (!refreshTokenCookie) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!refreshTokenSecret)
            throw new Error('no refreshToken accessible in middleware (verifyToken)');
        const refreshToken = refreshTokenCookie.split('=')[1];
        jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret, (err) => {
            if (err) {
                throw err;
            }
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const corsOriginCheck = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin && common_1.allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
};
exports.corsOriginCheck = corsOriginCheck;
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!(req === null || req === void 0 ? void 0 : req.roles))
            return res.sendStatus(401);
        const hasSufficientRole = Object.entries(req.roles).some(([role, assigned]) => {
            return assigned && allowedRoles.includes(role);
        });
        if (!hasSufficientRole)
            return res.sendStatus(403);
        next();
    };
};
exports.verifyRoles = verifyRoles;
