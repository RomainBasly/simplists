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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFunctionsForTestsRepository = void 0;
const tsyringe_1 = require("tsyringe");
const supabaseConfig_1 = __importDefault(require("../supabaseConfig"));
let AppFunctionsForTestsRepository = class AppFunctionsForTestsRepository {
    constructor() { }
    async getVerificationCode(email) {
        try {
            const response = await this.getUserIdWithEmail(email);
            if (response) {
                const userId = response[0].user_id;
                const { data, error } = await supabaseConfig_1.default
                    .from('app-email-verification-token')
                    .select('code')
                    .eq('user_id', userId);
                if (data) {
                    const code = data[0].code;
                    return code;
                }
                return null;
            }
            return null;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserIdWithEmail(email) {
        try {
            const { data, error } = await supabaseConfig_1.default.from('app-users').select('user_id').eq('email', email);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async removeTestUserByEmail(email) {
        try {
            await supabaseConfig_1.default.from('app-users').delete().eq('email', email);
        }
        catch (error) {
            throw error;
        }
    }
    async getBeneficiariesByListId(listId, userId) {
        try {
            const { data } = await supabaseConfig_1.default
                .from('app-list-beneficiaries')
                .select('app-users:user-id(user_id, userName)')
                .eq('app-list-id', listId)
                .neq('user-id', userId);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AppFunctionsForTestsRepository = AppFunctionsForTestsRepository;
exports.AppFunctionsForTestsRepository = AppFunctionsForTestsRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], AppFunctionsForTestsRepository);
