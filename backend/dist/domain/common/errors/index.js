"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailValidityCodeError = exports.EmailCodeError = exports.ValidationError = exports.UnauthorizedTokenError = exports.accessTokenError = exports.ForbiddenError = exports.JWTError = exports.NoPreexistingRefreshToken = exports.FailToGenerateTokens = exports.AuthenticationError = exports.UserDoNotExists = exports.UserAlreadyExistsError = exports.ErrorMessages = exports.BaseError = exports.errorHandler = void 0;
// used as a middleware
function errorHandler(err, req, res, next) {
    if (err instanceof BaseError) {
        res.status(err.statusCode).json({ error: err.name, errorCode: err.errorCode, message: err.message });
    }
    else {
        console.error(err);
        res.status(500).json({ error: 'InternalServerError', message: 'Something went wrong' });
        next(err);
    }
}
exports.errorHandler = errorHandler;
class BaseError extends Error {
    constructor(statusCode, errorCode, message) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
    }
}
exports.BaseError = BaseError;
// error types handling
var ErrorMessages;
(function (ErrorMessages) {
    ErrorMessages["ALREADY_EXISTING"] = "User already exists in database, please login instead";
    ErrorMessages["NOT_EXISTING_USER"] = "User do not exists in the database, please register instead";
    ErrorMessages["INVALID_CREDENTIALS"] = "Invalid credentials";
    ErrorMessages["FAIL_TO_GENERATE_TOKENS"] = " Fail to generate Tokens";
    ErrorMessages["NO_EXISTING_REFRESH_TOKEN"] = "No existing refreshToken";
    ErrorMessages["JWT_ERROR"] = "Error with the JWT";
    ErrorMessages["FORBIDDEN_ERROR"] = "Method not allowed";
    ErrorMessages["ACCESSTOKEN_ERROR"] = "AccessToken not present";
    ErrorMessages["UNAUTHORIZED"] = "Unauthorized prick";
    ErrorMessages["VALIDATION_ERROR"] = "Validation Error";
    ErrorMessages["INCORRECT_CODE"] = "Code incorrect";
    ErrorMessages["NO_MORE_VALID"] = "Code no more valid";
})(ErrorMessages || (exports.ErrorMessages = ErrorMessages = {}));
// add a class by big types of error
class UserAlreadyExistsError extends BaseError {
    constructor(message) {
        super(409, 1001, message);
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class UserDoNotExists extends BaseError {
    constructor(message) {
        super(401, 1002, message);
    }
}
exports.UserDoNotExists = UserDoNotExists;
class AuthenticationError extends BaseError {
    constructor(message) {
        super(401, 2001, message);
    }
}
exports.AuthenticationError = AuthenticationError;
class FailToGenerateTokens extends BaseError {
    constructor(message) {
        super(401, 2002, message);
    }
}
exports.FailToGenerateTokens = FailToGenerateTokens;
class NoPreexistingRefreshToken extends BaseError {
    constructor(message) {
        super(401, 2003, message);
    }
}
exports.NoPreexistingRefreshToken = NoPreexistingRefreshToken;
class JWTError extends BaseError {
    constructor(message) {
        super(401, 2004, message);
    }
}
exports.JWTError = JWTError;
class ForbiddenError extends BaseError {
    constructor(message) {
        super(403, 2005, message);
    }
}
exports.ForbiddenError = ForbiddenError;
class accessTokenError extends BaseError {
    constructor(message) {
        super(401, 2006, message);
    }
}
exports.accessTokenError = accessTokenError;
class UnauthorizedTokenError extends BaseError {
    constructor(message) {
        super(401, 2007, message);
    }
}
exports.UnauthorizedTokenError = UnauthorizedTokenError;
class ValidationError extends BaseError {
    constructor(message, detailedMessage) {
        super(400, 3001, `${message}: ${detailedMessage}`);
    }
}
exports.ValidationError = ValidationError;
class EmailCodeError extends BaseError {
    constructor(message) {
        super(400, 3002, message);
    }
}
exports.EmailCodeError = EmailCodeError;
class EmailValidityCodeError extends BaseError {
    constructor(message) {
        super(400, 3003, message);
    }
}
exports.EmailValidityCodeError = EmailValidityCodeError;
