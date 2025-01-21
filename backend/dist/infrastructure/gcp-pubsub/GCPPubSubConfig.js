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
var GcpPubSubConfig_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GcpPubSubConfig = void 0;
const pubsub_1 = require("@google-cloud/pubsub");
const tsyringe_1 = require("tsyringe");
let GcpPubSubConfig = GcpPubSubConfig_1 = class GcpPubSubConfig {
    constructor() {
        this.pubSubClient = null;
        if (GcpPubSubConfig_1.instance) {
            return GcpPubSubConfig_1.instance;
        }
        try {
            if (process.env.NODE_ENV === 'development') {
                this.pubSubClient = new pubsub_1.PubSub({
                    keyFilename: './key-pub-sub.json',
                });
            }
            else {
                const credentialsJSON = process.env.GCP_CREDENTIALS ? process.env.GCP_CREDENTIALS : '';
                const credentials = JSON.parse(credentialsJSON);
                const projectId = credentials.project_id;
                this.pubSubClient = new pubsub_1.PubSub({ credentials, projectId });
            }
        }
        catch (error) {
            console.error('Failed to initialize Pub/Sub client:', error);
            throw error;
        }
        GcpPubSubConfig_1.instance = this;
        return GcpPubSubConfig_1.instance;
    }
    getPubSubClient() {
        if (this.pubSubClient)
            return this.pubSubClient;
        return null;
    }
};
exports.GcpPubSubConfig = GcpPubSubConfig;
exports.GcpPubSubConfig = GcpPubSubConfig = GcpPubSubConfig_1 = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], GcpPubSubConfig);
