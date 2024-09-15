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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClientService = void 0;
const socket_io_client_1 = require("socket.io-client");
const tsyringe_1 = require("tsyringe");
let WebSocketClientService = class WebSocketClientService {
    constructor() {
        this.instance = null;
        this.maxRetry = 3;
        this.retryInterval = 10000;
        this.retryCount = 0;
        this.url = process.env.SOCKET_URL || '';
        this.connect();
    }
    connect() {
        this.instance = (0, socket_io_client_1.io)(this.url, {
            transports: ['websocket', 'polling'], // Ensure both transports are allowed
            upgrade: true,
        });
        this.instance.on('connect', () => {
            console.log('connect to the Websocket Server');
            this.initializeListeners();
        });
    }
    ensureConnection() {
        if (!this.instance) {
            this.instance = (0, socket_io_client_1.io)(this.url);
            this.instance.on('connect', () => {
                console.log('connect to the Websocket Server');
                this.initializeListeners();
            });
            this.instance.on('connect_error', (error) => {
                console.log('WebSocket Connection Error:', error);
                if (this.instance) {
                    this.instance.disconnect();
                }
                this.retryConnection();
            });
            this.instance.on('disconnect', () => {
                console.log('disconnect');
                this.instance.disconnect();
            });
        }
    }
    retryConnection() {
        if (this.retryCount < this.maxRetry) {
            setTimeout(() => {
                console.log(`Attempting to reconnect... Attempt ${this.retryCount + 1}`);
                this.retryCount++;
                this.connect();
            }, this.retryInterval);
        }
    }
    emit(eventName, data) {
        this.ensureConnection();
        if (this.instance) {
            this.instance.emit(eventName, data);
        }
        else {
            console.log('WebSocket not connected');
        }
    }
    initializeListeners() {
        if (this.instance) {
            this.instance.on('From Api', (data) => {
                console.log('received data', data);
            });
        }
    }
};
exports.WebSocketClientService = WebSocketClientService;
exports.WebSocketClientService = WebSocketClientService = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], WebSocketClientService);
