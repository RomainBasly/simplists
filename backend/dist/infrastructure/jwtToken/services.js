"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tsyringe_1 = require("tsyringe");
const helpers_1 = require("../../common/helpers");
const errors_1 = require("../../domain/common/errors");
let TokenService = class TokenService {
    constructor() {
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    }
    generateAccessToken(payload) {
        if (!this.accessTokenSecret)
            return null;
        return jsonwebtoken_1.default.sign(payload, this.accessTokenSecret, { expiresIn: '7200s' });
    }
    generateRefreshToken(payload) {
        if (!this.refreshTokenSecret)
            return null;
        return jsonwebtoken_1.default.sign(payload, this.refreshTokenSecret, { expiresIn: '60d' });
    }
    getUserIdFromAccessToken(req) {
        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) {
            throw new errors_1.ForbiddenError(errors_1.ErrorMessages.FORBIDDEN_ERROR);
        }
        const accessToken = (0, helpers_1.retrieveTokenFromCookie)(cookieHeader, 'accessToken');
        if (!accessToken) {
            throw new errors_1.ForbiddenError(errors_1.ErrorMessages.FORBIDDEN_ERROR);
        }
        const decoded = jsonwebtoken_1.default.decode(accessToken);
        if (decoded && decoded.userInfo && decoded.userInfo.id) {
            return decoded.userInfo.id.toString();
        }
        else {
            throw new errors_1.ForbiddenError(errors_1.ErrorMessages.FORBIDDEN_ERROR);
        }
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], TokenService);
