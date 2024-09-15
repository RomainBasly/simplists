"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCookies = exports.retrieveTokenFromCookie = exports.getFromJWTToken = exports.generateRandomNumber = exports.cookieHandler = exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../../domain/common/errors");
function verifyJwt(token, secret) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err)
                reject(new errors_1.JWTError(errors_1.ErrorMessages.JWT_ERROR));
            else
                resolve(decoded);
        });
    });
}
exports.verifyJwt = verifyJwt;
function cookieHandler(req, res, refreshToken) {
    return res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: false, // in dev mode use false
        maxAge: 24 * 3600 * 30 * 1000,
        path: '/',
    });
}
exports.cookieHandler = cookieHandler;
function generateRandomNumber() {
    const array = [];
    for (let i = 0; i < 7; i++) {
        const randomNumber = Math.floor(Math.random() * 10);
        array.push(randomNumber);
    }
    const result = parseInt(array.join(''));
    return result;
}
exports.generateRandomNumber = generateRandomNumber;
function getFromJWTToken(req, tokenType) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        throw new Error('no cookieHeader');
    }
    const token = retrieveTokenFromCookie(cookieHeader, tokenType);
    if (!token)
        throw new Error('no token accessible the method');
    const decoded = jsonwebtoken_1.default.decode(token);
    return decoded;
}
exports.getFromJWTToken = getFromJWTToken;
function retrieveTokenFromCookie(cookieHeader, tokenType) {
    try {
        const tokenString = cookieHeader === null || cookieHeader === void 0 ? void 0 : cookieHeader.split(';').find((row) => row.trim().startsWith(`${tokenType}=`));
        if (!tokenString) {
            throw new Error(`Token ${tokenType} not found`);
        }
        return tokenString.split('=')[1];
    }
    catch (error) {
        throw new Error(`Error retrieving ${tokenType} from cookie header: ${error}`);
    }
}
exports.retrieveTokenFromCookie = retrieveTokenFromCookie;
function parseCookies(cookieHeader) {
    const cookieStringSplitted = cookieHeader.split(';');
    const cookiesExtracted = cookieStringSplitted.reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
        return cookies;
    }, {});
    return cookiesExtracted;
}
exports.parseCookies = parseCookies;
