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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const tsyringe_1 = require("tsyringe");
const AppUserRepository_1 = require("../../infrastructure/database/repositories/AppUserRepository");
const services_1 = require("../jwtToken/services");
const helpers_1 = require("../../common/helpers");
const errors_1 = require("../../domain/common/errors");
let RefreshTokenService = class RefreshTokenService {
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }
    async getUserByRefreshToken(token) {
        const foundUser = await this.userRepository.getUserByRefreshToken(token);
        if (!foundUser)
            throw new errors_1.NoPreexistingRefreshToken(errors_1.ErrorMessages.NO_EXISTING_REFRESH_TOKEN);
        return foundUser;
    }
    async disconnectUser(userId, refreshToken) { }
    async handleTokenRefresh(existingRefreshToken, refreshTokenSecret, accessTokenSecret, foundUser) {
        const decodedPayload = await (0, helpers_1.verifyJwt)(existingRefreshToken, refreshTokenSecret);
        if (!decodedPayload.email || foundUser.email !== decodedPayload.email) {
            throw new errors_1.ForbiddenError(errors_1.ErrorMessages.FORBIDDEN_ERROR);
        }
        if (!accessTokenSecret) {
            throw new errors_1.accessTokenError(errors_1.ErrorMessages.ACCESSTOKEN_ERROR);
        }
        const { user_id, userName, email } = foundUser;
        const accessToken = this.tokenService.generateAccessToken({
            userInfo: { id: user_id, roles: foundUser.roles, userName, email },
        });
        if (!accessToken) {
            throw new errors_1.FailToGenerateTokens(errors_1.ErrorMessages.FAIL_TO_GENERATE_TOKENS);
        }
        return { newAccessToken: accessToken };
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(AppUserRepository_1.AppUserRepository)),
    __param(1, (0, tsyringe_1.inject)(services_1.TokenService)),
    __metadata("design:paramtypes", [AppUserRepository_1.AppUserRepository,
        services_1.TokenService])
], RefreshTokenService);
