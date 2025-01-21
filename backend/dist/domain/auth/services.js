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
exports.AppAuthService = void 0;
const tsyringe_1 = require("tsyringe");
const api_1 = require("../../common/types/api");
const AppUserRepository_1 = require("../../infrastructure/database/repositories/AppUserRepository");
const errors_1 = require("../common/errors");
const services_1 = require("../../infrastructure/jwtToken/services");
const services_2 = require("../password/services");
let AppAuthService = class AppAuthService {
    constructor(appUserRepository, passwordService, tokenService) {
        this.appUserRepository = appUserRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }
    async registerUser(user_id, userName, email, password) {
        try {
            const hashedPassword = await this.passwordService.hashPassword(password);
            const user = { user_id, userName, email, roles: { [api_1.Roles.USER]: true }, password: hashedPassword };
            await this.appUserRepository.addPassword(user);
        }
        catch (error) {
            console.error('something went wrong in the userservice', error);
            throw error;
        }
    }
    async login(email, passwordInput) {
        try {
            const user = await this.appUserRepository.getUserByEmail(email);
            if (!user) {
                throw new errors_1.UserDoNotExists(errors_1.ErrorMessages.NOT_EXISTING_USER);
            }
            const passwordFromDB = user.password;
            const passwordMatchDB = await this.passwordService.checkCredentials(passwordInput, passwordFromDB);
            if (!passwordMatchDB) {
                throw new errors_1.AuthenticationError(errors_1.ErrorMessages.INVALID_CREDENTIALS);
            }
            const roles = this.addUserRole(user);
            const accessToken = this.tokenService.generateAccessToken({
                userInfo: { id: user.user_id, roles, email, userName: user.userName },
            });
            const refreshToken = this.tokenService.generateRefreshToken({ email });
            if (!refreshToken || !accessToken) {
                throw new errors_1.FailToGenerateTokens(errors_1.ErrorMessages.FAIL_TO_GENERATE_TOKENS);
            }
            await this.appUserRepository.updateRefreshToken(refreshToken, email);
            return { accessToken, refreshToken };
        }
        catch (error) {
            console.error('something went wrong in the login service', error);
            throw error;
        }
    }
    async logoutUser(userId) {
        try {
            const response = await this.appUserRepository.clearRefreshTokenWithUserId(userId);
            return response;
        }
        catch (error) {
            console.error('something went wrong in the logout service after two attempts', error);
            throw error;
        }
    }
    // TODO : move to another file
    addUserRole(user) {
        const defaultRole = { [api_1.Roles.USER]: true };
        const userRolesFromDB = user.roles;
        return Object.assign(Object.assign({}, defaultRole), userRolesFromDB);
    }
};
exports.AppAuthService = AppAuthService;
exports.AppAuthService = AppAuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(AppUserRepository_1.AppUserRepository)),
    __param(1, (0, tsyringe_1.inject)(services_2.PasswordService)),
    __param(2, (0, tsyringe_1.inject)(services_1.TokenService)),
    __metadata("design:paramtypes", [AppUserRepository_1.AppUserRepository,
        services_2.PasswordService,
        services_1.TokenService])
], AppAuthService);
