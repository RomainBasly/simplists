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
exports.AppNotificationsService = void 0;
const assert_1 = __importDefault(require("assert"));
const tsyringe_1 = require("tsyringe");
const AppNotificationsRepository_1 = require("../../infrastructure/database/repositories/AppNotificationsRepository");
const webPushConfig_1 = __importDefault(require("../../infrastructure/webPush/webPushConfig"));
let AppNotificationsService = class AppNotificationsService {
    constructor(appNotificationsRepository) {
        this.appNotificationsRepository = appNotificationsRepository;
    }
    async subscribe(userId, subscription, userAgent) {
        try {
            const { endpoint } = subscription;
            await this.appNotificationsRepository.subscribe(parseInt(userId), endpoint, subscription.keys.p256dh, subscription.keys.auth, userAgent);
        }
        catch (error) {
            throw error;
        }
    }
    async updateSubscription(userId, subscription, userAgent) {
        try {
            const { endpoint } = subscription;
            await this.appNotificationsRepository.updateSubscription(parseInt(userId), endpoint, subscription.keys.p256dh, subscription.keys.auth, userAgent);
        }
        catch (error) {
            throw error;
        }
    }
    async modifyNotificationStatus(notificationId, isNew) {
        try {
            await this.appNotificationsRepository.modifyNotificationStatus(notificationId, isNew);
        }
        catch (error) {
            throw error;
        }
    }
    async fetchNotificationsPreferences(userId) {
        try {
            (0, assert_1.default)(userId, 'No user Id in fetchNotifPreferences');
            const data = await this.appNotificationsRepository.fetchSubscriptions(userId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async getNotifications(userId) {
        try {
            (0, assert_1.default)(userId, 'No user Id in fetchNotifPreferences');
            const data = await this.appNotificationsRepository.getNotifications(userId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async sendMultiplePushNotifications(beneficiaries, payload) {
        var _a;
        try {
            for (const beneficiary of beneficiaries) {
                const notificationsSettings = await this.fetchNotificationsPreferences((_a = beneficiary['app-users']) === null || _a === void 0 ? void 0 : _a.user_id);
                if (notificationsSettings) {
                    const pushSubscription = {
                        endpoint: notificationsSettings.endpoint,
                        keys: {
                            p256dh: notificationsSettings === null || notificationsSettings === void 0 ? void 0 : notificationsSettings.p256dh,
                            auth: notificationsSettings === null || notificationsSettings === void 0 ? void 0 : notificationsSettings.auth,
                        },
                    };
                    webPushConfig_1.default
                        .sendNotification(pushSubscription, payload)
                        .then(() => console.log('Notification sent successfully for :', beneficiary['app-users'].user_id))
                        .catch((err) => console.error('Error sending push:', err));
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    async sendSinglePushNotification(beneficiary, payload) {
        try {
            const notificationsSettings = await this.fetchNotificationsPreferences(beneficiary.user_id);
            if (notificationsSettings) {
                const pushSubscription = {
                    endpoint: notificationsSettings.endpoint,
                    keys: {
                        p256dh: notificationsSettings === null || notificationsSettings === void 0 ? void 0 : notificationsSettings.p256dh,
                        auth: notificationsSettings === null || notificationsSettings === void 0 ? void 0 : notificationsSettings.auth,
                    },
                };
                webPushConfig_1.default
                    .sendNotification(pushSubscription, payload)
                    .then(() => console.log('Notification sent successfully for :', beneficiary.user_id))
                    .catch((err) => console.error('Error sending push:', err));
            }
        }
        catch (error) {
            throw error;
        }
    }
    async createNotificationsInDB(notificationElement) {
        try {
            await this.appNotificationsRepository.createNotificationsInDB(notificationElement);
        }
        catch (error) {
            throw error;
        }
    }
    async suppressNotificationById(notificationId) {
        try {
            await this.appNotificationsRepository.deleteNotificationBy(notificationId);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AppNotificationsService = AppNotificationsService;
exports.AppNotificationsService = AppNotificationsService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(AppNotificationsRepository_1.AppNotificationsRepository)),
    __metadata("design:paramtypes", [AppNotificationsRepository_1.AppNotificationsRepository])
], AppNotificationsService);
