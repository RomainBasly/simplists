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
exports.AppUserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const supabaseConfig_1 = __importDefault(require("../supabaseConfig"));
let AppUserRepository = class AppUserRepository {
    async addPassword(userData) {
        const { error } = await supabaseConfig_1.default
            .from('app-users')
            .update({ userName: userData.userName, password: userData.password })
            .eq('email', userData.email)
            .select();
        if (error) {
            throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
        }
    }
    async getUserByEmail(email) {
        const { data, error } = await supabaseConfig_1.default.from('app-users').select().eq('email', email);
        if (error) {
            throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
        }
        return data ? data[0] : null;
    }
    async getUserNameByUserId(userId) {
        const { data, error } = await supabaseConfig_1.default.from('app-users').select('user_id, userName').eq('user_id', userId);
        if (error) {
            throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
        }
        return data ? data[0] : null;
    }
    async getUserIdByEmail(email) {
        const { data, error } = await supabaseConfig_1.default.from('app-users').select('user_id').eq('email', email);
        if (error) {
            throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
        }
        return data ? data[0] : null;
    }
    async updateRefreshToken(refreshToken, email) {
        await supabaseConfig_1.default.from('app-users').update({ refreshToken: refreshToken }).eq('email', email);
    }
    async findUserByRefreshToken(refreshToken) {
        return await supabaseConfig_1.default.from('app-users').select().eq('refreshToken', refreshToken);
    }
    async clearRefreshTokenWithUserId(userId) {
        try {
            const { data, error } = await supabaseConfig_1.default
                .from('app-users')
                .update({ refreshToken: '' })
                .eq('user_id', userId)
                .select();
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserByRefreshToken(token) {
        const { data, error } = await supabaseConfig_1.default.from('app-users').select().eq('refreshToken', token);
        if (error) {
            throw new Error(`something when wrong in the appUserRepository: ${error.message}`);
        }
        return data ? data[0] : null;
    }
};
exports.AppUserRepository = AppUserRepository;
exports.AppUserRepository = AppUserRepository = __decorate([
    (0, tsyringe_1.injectable)()
], AppUserRepository);
