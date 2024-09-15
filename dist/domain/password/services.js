"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordService {
    async hashPassword(password) {
        const salt = bcrypt_1.default.genSaltSync(10);
        return await bcrypt_1.default.hash(password, salt);
    }
    async checkCredentials(enteredPassword, passwordFromDB) {
        return await bcrypt_1.default.compare(enteredPassword, passwordFromDB);
    }
}
exports.PasswordService = PasswordService;
