'use strict';
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailTrapConfig_1 = require("./mailTrapConfig");
const tsyringe_1 = require("tsyringe");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const AppEmailVerificationTokenRepository_1 = require("../database/repositories/AppEmailVerificationTokenRepository");
let NodeMailerService = class NodeMailerService {
    constructor(appEmailVerificationTokenRepository) {
        var _a;
        this.appEmailVerificationTokenRepository = appEmailVerificationTokenRepository;
        this.logoUrlPath = (_a = process.env.LOGO_URL_PATH) !== null && _a !== void 0 ? _a : '';
        this.transporter = nodemailer_1.default.createTransport(Object.assign({}, mailTrapConfig_1.mailtrapConfig));
    }
    async generateWelcomeHtml(code, logoUrlPath, isWelcomeEmail) {
        try {
            const emailTemplate = 'emailTemplateWelcome.ejs';
            return await ejs_1.default.renderFile(path_1.default.join(__dirname, emailTemplate), {
                code,
                logoUrlPath,
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    async sendVerifyCodeEmail(email) {
        const code = await this.generateAndPublishCode(email);
        try {
            await this.transporter.sendMail(Object.assign(Object.assign({}, mailTrapConfig_1.emailConfig), { subject: mailTrapConfig_1.EMAILSUBJECT.WELCOME, to: email, html: await this.generateWelcomeHtml(code, this.logoUrlPath, true) }));
        }
        catch (error) {
            console.error(error);
        }
    }
    async generateAndPublishCode(email) {
        let verificationCode = '';
        for (let i = 0; i < 6; i++) {
            const randomNumber = Math.floor(Math.random() * 10);
            verificationCode += randomNumber.toString();
        }
        const expiryDate = new Date(Date.now() + 3600 * 24 * 1000);
        const formattedDate = expiryDate.toISOString();
        await this.appEmailVerificationTokenRepository.registerToDB(email, verificationCode, formattedDate);
        return verificationCode;
    }
    async sendInvitationToListHtml(email) {
        try {
            await this.transporter.sendMail(Object.assign(Object.assign({}, mailTrapConfig_1.emailConfig), { subject: mailTrapConfig_1.EMAILSUBJECT.WELCOME, to: email, html: await this.generateInvitationHtml(this.logoUrlPath, false) }));
        }
        catch (error) {
            console.error(error);
        }
    }
    async generateInvitationHtml(logoUrlPath, isWelcomeEmail) {
        try {
            const emailTemplate = 'emailTemplateInvitation.ejs';
            return await ejs_1.default.renderFile(path_1.default.join(__dirname, emailTemplate), {
                logoUrlPath,
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};
NodeMailerService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(AppEmailVerificationTokenRepository_1.AppEmailVerificationTokenRepository)),
    __metadata("design:paramtypes", [AppEmailVerificationTokenRepository_1.AppEmailVerificationTokenRepository])
], NodeMailerService);
exports.default = NodeMailerService;
