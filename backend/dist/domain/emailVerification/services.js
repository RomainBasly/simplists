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
const tsyringe_1 = require("tsyringe");
const AppEmailVerificationTokenRepository_1 = require("../../infrastructure/database/repositories/AppEmailVerificationTokenRepository");
const errors_1 = require("../common/errors");
let EmailVerificationServices = class EmailVerificationServices {
    constructor(appEmailVerificationTokenRepository) {
        this.appEmailVerificationTokenRepository = appEmailVerificationTokenRepository;
    }
    async verifyCode(payload) {
        const { email, code } = payload;
        try {
            const response = await this.appEmailVerificationTokenRepository.getAppEmailVerificationRecord(email);
            const isCodeCorrect = code.code === response.code;
            if (!isCodeCorrect)
                throw new errors_1.EmailCodeError(errors_1.ErrorMessages.INCORRECT_CODE);
            const isExpiryStillValid = new Date(Date.now()) < new Date(response.expiry_date);
            if (!isExpiryStillValid)
                throw new errors_1.EmailValidityCodeError(errors_1.ErrorMessages.NO_MORE_VALID);
            if (isCodeCorrect && isExpiryStillValid) {
                await this.appEmailVerificationTokenRepository.updateIsEmailVerified(email);
            }
        }
        catch (error) {
            console.error('something went wrong in the userservice', error);
            throw error;
        }
    }
};
EmailVerificationServices = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(AppEmailVerificationTokenRepository_1.AppEmailVerificationTokenRepository)),
    __metadata("design:paramtypes", [AppEmailVerificationTokenRepository_1.AppEmailVerificationTokenRepository])
], EmailVerificationServices);
exports.default = EmailVerificationServices;
