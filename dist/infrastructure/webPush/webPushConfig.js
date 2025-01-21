"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
function initiateWebPush() {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        throw new Error('Missing VAPID Credentials');
    }
    web_push_1.default.setVapidDetails('mailto:isisetthea@gmail.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    return web_push_1.default;
}
const initiatedWebPush = initiateWebPush();
exports.default = initiatedWebPush;
