"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.allowedOrigins = void 0;
exports.allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://data-list-collaborative.vercel.app',
    'https://simplists.net',
    'https://www.simplists.net',
    'ws://ws.simplists.net',
    'wss://ws.simplists.net',
];
exports.corsOptions = {
    origin: (origin, callback) => {
        if ((origin && exports.allowedOrigins.indexOf(origin) !== -1) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('not allowed by CORS policies'), false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
