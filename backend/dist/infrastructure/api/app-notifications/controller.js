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
exports.AppNotificationsController = void 0;
const tsyringe_1 = require("tsyringe");
const helpers_1 = require("../../../common/helpers");
const services_1 = require("../../../domain/NotificationsManagement/services");
const assert_1 = __importDefault(require("assert"));
let AppNotificationsController = class AppNotificationsController {
    constructor(appNotificationsService) {
        this.appNotificationsService = appNotificationsService;
    }
    async fetchNotificationsPreferences(req, res, next) {
        try {
            const { userInfo } = (0, helpers_1.getFromJWTToken)(req, 'accessToken');
            const userId = userInfo.id.toString();
            const data = await this.appNotificationsService.fetchNotificationsPreferences(userId);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getNotificationsByUserId(req, res, next) {
        try {
            const { userInfo } = (0, helpers_1.getFromJWTToken)(req, 'accessToken');
            const userId = userInfo.id.toString();
            const data = await this.appNotificationsService.getNotifications(userId);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async subscribeToNotifications(req, res, next) {
        try {
            const { subscription, userAgent } = req.body;
            const { userInfo } = (0, helpers_1.getFromJWTToken)(req, 'accessToken');
            (0, assert_1.default)(subscription, 'Not subscription info to send notifications');
            (0, assert_1.default)(userAgent, 'Not userAgent info to send notifications');
            (0, assert_1.default)(userInfo.id, 'Not id info to send notifications');
            await this.appNotificationsService.subscribe(userInfo.id.toString(), subscription, userAgent);
            res.status(200).json({ message: 'Suscription taken into account' });
        }
        catch (error) {
            next(error);
        }
    }
    async updateNotificationsPreferences(req, res, next) {
        try {
            const { subscription, userAgent } = req.body;
            const { userInfo } = (0, helpers_1.getFromJWTToken)(req, 'accessToken');
            (0, assert_1.default)(subscription, 'Not subscription info to send notifications');
            (0, assert_1.default)(userAgent, 'Not userAgent info to send notifications');
            (0, assert_1.default)(userInfo.id, 'Not id info to send notifications');
            await this.appNotificationsService.updateSubscription(userInfo.id.toString(), subscription, userAgent);
            res.status(200).json({ message: 'Suscription taken into account' });
        }
        catch (error) {
            next(error);
        }
    }
    async modifyNotificationStatus(req, res, next) {
        try {
            const { notificationId, isNew } = req.body;
            (0, assert_1.default)(notificationId, 'No notificationId');
            await this.appNotificationsService.modifyNotificationStatus(notificationId, isNew);
            res.status(200).json({ success: true, message: 'Modification taken into account' });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteNotificationById(req, res, next) {
        const id = req.params.notificationId;
        (0, assert_1.default)(id, 'No NotificationId info to delete notification');
        try {
            await this.appNotificationsService.suppressNotificationById(id);
            res.status(200).json({ message: 'notification successfully suppressed', success: true });
        }
        catch (error) {
            next(error);
        }
    }
};
exports.AppNotificationsController = AppNotificationsController;
exports.AppNotificationsController = AppNotificationsController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(services_1.AppNotificationsService)),
    __metadata("design:paramtypes", [services_1.AppNotificationsService])
], AppNotificationsController);
