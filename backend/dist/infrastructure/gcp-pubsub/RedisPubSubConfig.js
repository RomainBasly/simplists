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
var RedisPubSubConfig_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisPubSubConfig = void 0;
const redis_1 = require("redis");
const tsyringe_1 = require("tsyringe");
let RedisPubSubConfig = RedisPubSubConfig_1 = class RedisPubSubConfig {
    constructor() {
        this.redisPublisher = null;
        if (RedisPubSubConfig_1.instance) {
            return RedisPubSubConfig_1.instance;
        }
        try {
            this.redisPublisher = (0, redis_1.createClient)({
                url: process.env.REDIS_URL || 'redis://34.22.232.95:6379',
                password: process.env.REDIS_PASSWORD,
            });
            this.redisPublisher.connect();
        }
        catch (error) {
            console.error('error creating client', error);
        }
        RedisPubSubConfig_1.instance = this;
        return RedisPubSubConfig_1.instance;
    }
    getPubSubClient() {
        if (this.redisPublisher)
            return this.redisPublisher;
        return null;
    }
};
exports.RedisPubSubConfig = RedisPubSubConfig;
exports.RedisPubSubConfig = RedisPubSubConfig = RedisPubSubConfig_1 = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], RedisPubSubConfig);
