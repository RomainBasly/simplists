"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patch = exports.del = exports.put = exports.post = exports.get = void 0;
require("reflect-metadata");
const enums_1 = require("./enums");
function routeBinder(method) {
    return function (path) {
        return function (target, key, descriptor) {
            Reflect.defineMetadata(enums_1.MetadataKeys.PATH, path, target, key);
            Reflect.defineMetadata(enums_1.MetadataKeys.METHOD, method, target, key);
        };
    };
}
exports.get = routeBinder(enums_1.Methods.GET);
exports.post = routeBinder(enums_1.Methods.POST);
exports.put = routeBinder(enums_1.Methods.PUT);
exports.del = routeBinder(enums_1.Methods.DEL);
exports.patch = routeBinder(enums_1.Methods.PATCH);
