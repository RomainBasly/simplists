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
exports.AppForTestsController = void 0;
const tsyringe_1 = require("tsyringe");
const services_1 = require("../../../domain/fetchingForTests/services");
let AppForTestsController = class AppForTestsController {
    constructor(functionForTestsService) {
        this.functionForTestsService = functionForTestsService;
    }
    async getVerificationCodeForJest(req, res, next) {
        try {
            const email = req.params.email;
            const code = await this.functionForTestsService.getVerificationCodeElement(email);
            res.json({ code });
        }
        catch (error) {
            next(error);
        }
    }
    async removeEmailFunctionAfterTest(req, res, next) {
        try {
            const email = req.body.email;
            await this.functionForTestsService.removeTestUserByEmail(email);
            res.status(200).send({ message: 'User deleted' });
        }
        catch (error) {
            next(error);
        }
    }
    async fetchUsersBeneficiariesByListIdForTest(req, res, next) {
        try {
            const listId = req.body.listId;
            const userId = req.body.userId;
            const response = await this.functionForTestsService.fetchUsersBeneficiariesByListIdForTest(listId, userId);
            res.status(200).send({ message: 'User deleted' });
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AppForTestsController = AppForTestsController;
exports.AppForTestsController = AppForTestsController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(services_1.FunctionsForTestServices)),
    __metadata("design:paramtypes", [services_1.FunctionsForTestServices])
], AppForTestsController);
