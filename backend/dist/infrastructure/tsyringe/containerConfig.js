"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initContainers = void 0;
const tsyringe_1 = require("tsyringe");
const services_1 = require("../webSockets/services");
const controller_1 = require("../api/app-auth/controller");
const controller_2 = require("../api/app-email-verification/controller");
const controller_3 = require("../api/app-list-management/controller");
const controller_4 = require("../api/app-refresh-token/controller");
const controller_5 = require("../api/app-for-tests/controller");
function initContainers() {
    tsyringe_1.container.register(controller_1.AppAuthController, controller_1.AppAuthController);
    tsyringe_1.container.register(controller_4.AppRefreshTokenController, controller_4.AppRefreshTokenController);
    tsyringe_1.container.register(controller_2.AppEmailVerificationController, controller_2.AppEmailVerificationController);
    tsyringe_1.container.register(controller_3.ListManagementController, controller_3.ListManagementController);
    tsyringe_1.container.register(controller_5.AppForTestsController, controller_5.AppForTestsController);
    tsyringe_1.container.registerSingleton(services_1.WebSocketClientService, services_1.WebSocketClientService);
}
exports.initContainers = initContainers;
