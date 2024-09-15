"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyValidator = void 0;
require("reflect-metadata");
const enums_1 = require("./enums");
function bodyValidator(...keys) {
    return function (target, key, descriptor) {
        Reflect.defineMetadata(enums_1.MetadataKeys.VALIDATOR, keys, target, key);
    };
}
exports.bodyValidator = bodyValidator;
