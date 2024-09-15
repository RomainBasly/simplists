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
exports.AppRefreshTokenRepository = void 0;
const tsyringe_1 = require("tsyringe");
const supabaseConfig_1 = __importDefault(require("../supabaseConfig"));
let AppRefreshTokenRepository = class AppRefreshTokenRepository {
    async getUserByRefreshToken(refreshToken) {
        const { data, error } = await supabaseConfig_1.default.from('app-users').select().eq('refreshToken', refreshToken);
        if (error) {
            throw new Error(`something when wrong in the appRefreshTokenRepository: ${error.message}`);
        }
        return data ? data[0] : null;
    }
};
exports.AppRefreshTokenRepository = AppRefreshTokenRepository;
exports.AppRefreshTokenRepository = AppRefreshTokenRepository = __decorate([
    (0, tsyringe_1.injectable)()
], AppRefreshTokenRepository);
