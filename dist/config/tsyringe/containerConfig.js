"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initContainers = void 0;
const tsyringe_1 = require("tsyringe");
const controller_1 = require("../../infrastructure/api/app-auth/controller");
const controller_2 = require("../../infrastructure/api/app-email-verification/controller");
const controller_3 = require("../../infrastructure/api/app-list-management/controller");
const controller_4 = require("../../infrastructure/api/app-refresh-token/controller");
const services_1 = require("../../infrastructure/webSockets/services");
function initContainers() {
    tsyringe_1.container.register(controller_1.AppAuthController, controller_1.AppAuthController);
    tsyringe_1.container.register(controller_4.AppRefreshTokenController, controller_4.AppRefreshTokenController);
    tsyringe_1.container.register(controller_2.AppEmailVerificationController, controller_2.AppEmailVerificationController);
    tsyringe_1.container.register(controller_3.ListManagementController, controller_3.ListManagementController);
    tsyringe_1.container.registerSingleton(services_1.WebSocketClientService, services_1.WebSocketClientService);
}
exports.initContainers = initContainers;
