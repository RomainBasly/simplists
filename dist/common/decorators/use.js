"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = void 0;
require("reflect-metadata");
const enums_1 = require("./enums");
function use(middleware) {
    return function (target, key, descriptor) {
        const middlewares = Reflect.getMetadata(enums_1.MetadataKeys.MIDDLEWARE, target, key) || [];
        Reflect.defineMetadata(enums_1.MetadataKeys.MIDDLEWARE, [...middlewares, middleware], target, key);
    };
}
exports.use = use;
