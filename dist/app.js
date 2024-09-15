"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const common_1 = require("./config/common");
const protectedRoutes_1 = __importDefault(require("./infrastructure/routes/protectedRoutes"));
const publicRoutes_1 = __importDefault(require("./infrastructure/routes/publicRoutes"));
const auth_middleware_1 = require("./middlewares/auth-middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("./infrastructure/api/app-auth/controller");
const errors_1 = require("./domain/common/errors");
const common_2 = require("./middlewares/common");
const containerConfig_1 = require("./infrastructure/tsyringe/containerConfig");
(0, containerConfig_1.initContainers)();
const app = (0, express_1.default)();
const port = 8000;
app.use(auth_middleware_1.corsOriginCheck);
app.use((0, cors_1.default)(common_1.corsOptions));
app.use(common_2.limiter);
app.set('trust proxy', 1);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(auth_middleware_1.verifyRequestApiKey);
// Todo implement a rateLimit for a specific route
app.use(publicRoutes_1.default);
app.use(auth_middleware_1.verifyUserAccessToken, protectedRoutes_1.default);
app.use(errors_1.errorHandler);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
