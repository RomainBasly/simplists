"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiGetRequest = exports.apiPostRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const apiPostRequest = (url) => {
    return (0, supertest_1.default)(app_1.default).post(url).set('X-API-KEY', `${process.env.BACKEND_API_KEY}`);
};
exports.apiPostRequest = apiPostRequest;
const apiGetRequest = (url) => {
    return (0, supertest_1.default)(app_1.default).get(url).set('X-API-KEY', `${process.env.BACKEND_API_KEY}`);
};
exports.apiGetRequest = apiGetRequest;
