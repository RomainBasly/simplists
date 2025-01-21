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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppAuthController = void 0;
const tsyringe_1 = require("tsyringe");
const assert_1 = __importDefault(require("assert"));
const services_1 = require("../../../domain/auth/services");
const errors_1 = require("../../../domain/common/errors");
const helpers_1 = require("../../../common/helpers");
// Here is injection dependencies used in this architecture
// If you do not get it please check tsyringe
let AppAuthController = class AppAuthController {
    constructor(appAuthService) {
        this.appAuthService = appAuthService;
    }
    async register(req, res, next) {
        const { id, userName, email, password } = req.body;
        if (!email || !password || !userName) {
            res.status(400).json('userName, email and password are required');
            return;
        }
        try {
            await this.appAuthService.registerUser(id, userName, email, password);
            res.status(201).json({ message: 'new user created' });
        }
        catch (error) {
            if (error instanceof errors_1.UserAlreadyExistsError) {
                res.status(409).json({ message: error.message });
            }
            else {
                console.error('Error in AppUserController', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.appAuthService.login(email, password);
            (0, assert_1.default)(refreshToken, 'problem with refreshToken inside controller');
            (0, assert_1.default)(accessToken, 'problem with accesstoken inside controller');
            (0, helpers_1.cookieHandler)(req, res, refreshToken);
            res.json({ accessToken, refreshToken });
        }
        catch (error) {
            next(error);
        }
    }
    async logoutUser(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AppAuthController = AppAuthController;
exports.AppAuthController = AppAuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(services_1.AppAuthService)),
    __metadata("design:paramtypes", [services_1.AppAuthService])
], AppAuthController);
