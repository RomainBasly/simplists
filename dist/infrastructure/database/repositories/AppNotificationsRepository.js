"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNotificationsRepository = void 0;
const tsyringe_1 = require("tsyringe");
const supabaseConfig_1 = __importDefault(require("../supabaseConfig"));
let AppNotificationsRepository = class AppNotificationsRepository {
    async subscribe(userId, endpoint, p256dh, auth, userAgent) {
        try {
            await supabaseConfig_1.default
                .from('app-subscriptions')
                .insert([
                {
                    user_id: userId,
                    endpoint,
                    p256dh,
                    auth,
                    userAgent,
                },
            ])
                .select();
        }
        catch (error) {
            throw error;
        }
    }
    async updateSubscription(userId, endpoint, p256dh, auth, userAgent) {
        try {
            await supabaseConfig_1.default
                .from('app-subscriptions')
                .update({
                endpoint,
                p256dh,
                auth,
                userAgent,
            })
                .eq('user_id', userId);
        }
        catch (error) {
            throw error;
        }
    }
    async modifyNotificationStatus(notificationId, isNew) {
        try {
            await supabaseConfig_1.default.from('app-notifications').update({ isNew }).eq('id', notificationId);
        }
        catch (error) {
            throw error;
        }
    }
    async fetchSubscriptions(userId) {
        try {
            const { data } = await supabaseConfig_1.default
                .from('app-subscriptions')
                .select('subscription_id, user_id, endpoint, p256dh, auth, userAgent')
                .eq('user_id', userId);
            if ((data === null || data === void 0 ? void 0 : data.length) && (data === null || data === void 0 ? void 0 : data.length) > 0) {
                return data[0];
            }
            return null;
        }
        catch (error) {
            throw error;
        }
    }
    async getNotifications(userId) {
        try {
            const { data } = await supabaseConfig_1.default.from('app-notifications').select('*').eq('recipient_id', userId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async createNotificationsInDB(notificationElement) {
        try {
            const { data, error } = await supabaseConfig_1.default.from('app-notifications').insert(notificationElement).select();
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteNotificationBy(notificationId) {
        try {
            const { data, error } = await supabaseConfig_1.default.from('app-notifications').delete().eq('id', notificationId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AppNotificationsRepository = AppNotificationsRepository;
exports.AppNotificationsRepository = AppNotificationsRepository = __decorate([
    (0, tsyringe_1.injectable)()
], AppNotificationsRepository);
