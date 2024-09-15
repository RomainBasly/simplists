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
exports.AppEmailVerificationController = void 0;
const tsyringe_1 = require("tsyringe");
const services_1 = __importDefault(require("../../../domain/emailVerification/services"));
const validation_1 = __importDefault(require("../../../domain/emailVerification/validation"));
const services_2 = __importDefault(require("../../../domain/Invitations/services"));
const nodeMailder_1 = __importDefault(require("../../emails/nodeMailder"));
let AppEmailVerificationController = class AppEmailVerificationController {
    constructor(appEmailValidation, nodeMailerService, emailVerificationServices, userInvitationsService) {
        this.appEmailValidation = appEmailValidation;
        this.nodeMailerService = nodeMailerService;
        this.emailVerificationServices = emailVerificationServices;
        this.userInvitationsService = userInvitationsService;
    }
    async publishAndSendVerificationCode(req, res, next) {
        const { email } = req.body;
        try {
            const verifiedEmailObject = await this.appEmailValidation.validateEmail(email);
            await this.nodeMailerService.sendVerifyCodeEmail(verifiedEmailObject.email);
            // if there are any invitations of lists attached to this email , update the column user-id
            await this.userInvitationsService.updateExistingInvitationsForNewUsers(email);
            res.status(200).json({ message: 'Success : Email sent, code publish, user-id updated' });
        }
        catch (error) {
            console.log('error get in the controller sendVerifEmail', error);
            next(error);
        }
    }
    async verifyCode(req, res, next) {
        const { email, code } = req.body;
        try {
            const verifiedEmailObject = await this.appEmailValidation.validateEmail(email);
            const verifiedCodeObject = await this.appEmailValidation.validateCode(code);
            await this.emailVerificationServices.verifyCode({ email: verifiedEmailObject.email, code: verifiedCodeObject });
            res.status(200).json({ message: 'Code verified' });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    async getInvitationsByEmail(req, res, next) {
        const { email } = req.body;
        try {
            // if there are any invitations of lists attached to this email , update the column user-id
            await this.userInvitationsService.updateExistingInvitationsForNewUsers(email);
            // res.status(200).json({ message: 'Success : Email sent, code publish, user-id updated' });
        }
        catch (error) {
            console.log('error get in the controller sendVerifEmail', error);
            next(error);
        }
    }
};
exports.AppEmailVerificationController = AppEmailVerificationController;
exports.AppEmailVerificationController = AppEmailVerificationController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(1, (0, tsyringe_1.inject)(nodeMailder_1.default)),
    __param(2, (0, tsyringe_1.inject)(services_1.default)),
    __param(3, (0, tsyringe_1.inject)(services_2.default)),
    __metadata("design:paramtypes", [validation_1.default,
        nodeMailder_1.default,
        services_1.default,
        services_2.default])
], AppEmailVerificationController);
