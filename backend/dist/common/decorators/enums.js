"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataKeys = exports.Methods = void 0;
var Methods;
(function (Methods) {
    Methods["GET"] = "get";
    Methods["PUT"] = "put";
    Methods["POST"] = "post";
    Methods["PATCH"] = "patch";
    Methods["DEL"] = "delete";
})(Methods || (exports.Methods = Methods = {}));
var MetadataKeys;
(function (MetadataKeys) {
    MetadataKeys["METHOD"] = "method";
    MetadataKeys["PATH"] = "path";
    MetadataKeys["MIDDLEWARE"] = "middleware";
    MetadataKeys["VALIDATOR"] = "validator";
})(MetadataKeys || (exports.MetadataKeys = MetadataKeys = {}));
