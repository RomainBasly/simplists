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
exports.FunctionsForTestServices = void 0;
const tsyringe_1 = require("tsyringe");
const AppFetchingForTestsRepository_1 = require("../../infrastructure/database/repositories/AppFetchingForTestsRepository");
let FunctionsForTestServices = class FunctionsForTestServices {
    constructor(appTestRepository) {
        this.appTestRepository = appTestRepository;
    }
    async getVerificationCodeElement(email) {
        try {
            return await this.appTestRepository.getVerificationCode(email);
        }
        catch (error) {
            throw error;
        }
    }
    async removeTestUserByEmail(email) {
        try {
            await this.appTestRepository.removeTestUserByEmail(email);
        }
        catch (error) {
            throw error;
        }
    }
    async fetchUsersBeneficiariesByListIdForTest(listId, userId) {
        try {
            await this.appTestRepository.getBeneficiariesByListId(listId, userId);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.FunctionsForTestServices = FunctionsForTestServices;
exports.FunctionsForTestServices = FunctionsForTestServices = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(AppFetchingForTestsRepository_1.AppFunctionsForTestsRepository)),
    __metadata("design:paramtypes", [AppFetchingForTestsRepository_1.AppFunctionsForTestsRepository])
], FunctionsForTestServices);
