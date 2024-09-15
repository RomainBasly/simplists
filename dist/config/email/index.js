"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAILSUBJECT = exports.mailtrapConfig = exports.emailConfig = void 0;
exports.emailConfig = {
    from: process.env.EMAIL_SENDER,
};
exports.mailtrapConfig = {
    host: process.env.MAILTRAP_EMAIL_HOST || '',
    port: 587,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
    },
};
var EMAILSUBJECT;
(function (EMAILSUBJECT) {
    EMAILSUBJECT["WELCOME"] = "Simplists - V\u00E9rification de votre email";
    EMAILSUBJECT["LISTINVITATION"] = "Simplists - Vous avez \u00E9t\u00E9 invit\u00E9(e) \u00E0 une liste";
})(EMAILSUBJECT || (exports.EMAILSUBJECT = EMAILSUBJECT = {}));
