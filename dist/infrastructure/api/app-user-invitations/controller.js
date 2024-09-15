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
exports.AppUserInvitationsController = void 0;
const tsyringe_1 = require("tsyringe");
const assert_1 = __importDefault(require("assert"));
const services_1 = __importDefault(require("../../../domain/Invitations/services"));
const services_2 = require("../../jwtToken/services");
let AppUserInvitationsController = class AppUserInvitationsController {
    constructor(userInvitationsService, tokenService) {
        this.userInvitationsService = userInvitationsService;
        this.tokenService = tokenService;
    }
    async getUserInvitations(req, res, next) {
        const userId = this.tokenService.getUserIdFromAccessToken(req);
        (0, assert_1.default)(userId, 'no userId given in the request');
        try {
            const { status } = req.params;
            const data = await this.userInvitationsService.fetchUserInvitations(userId, parseInt(status));
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async handleListInvitationStatus(req, res, next) {
        try {
            const { invitationId } = req.params;
            const { listId, status } = req.body;
            const userId = this.tokenService.getUserIdFromAccessToken(req);
            (0, assert_1.default)(listId, 'No listId');
            (0, assert_1.default)(invitationId, 'No invitationId');
            (0, assert_1.default)(userId, 'no userId given in the request');
            await this.userInvitationsService.changeInvitationStatus(parseInt(invitationId), parseInt(userId), listId, status);
            res.status(200).json({ message: 'Invitation modified' });
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AppUserInvitationsController = AppUserInvitationsController;
exports.AppUserInvitationsController = AppUserInvitationsController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(services_1.default)),
    __param(1, (0, tsyringe_1.inject)(services_2.TokenService)),
    __metadata("design:paramtypes", [services_1.default,
        services_2.TokenService])
], AppUserInvitationsController);
