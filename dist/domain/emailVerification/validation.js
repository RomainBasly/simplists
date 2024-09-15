"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const yup = __importStar(require("yup"));
const errors_1 = require("../common/errors");
let AppEmailValidation = class AppEmailValidation {
    async validateEmail(input) {
        const schema = yup.object().shape({
            email: yup.string().email('Email format invalid').required('Email is required'),
        });
        try {
            const emailObject = { email: input };
            return await schema.validate(emailObject);
        }
        catch (error) {
            if (error instanceof yup.ValidationError) {
                throw new errors_1.ValidationError(errors_1.ErrorMessages.VALIDATION_ERROR, error.message);
            }
            throw new Error('Error validating the email (appEmailValidation)');
        }
    }
    async validateCode(input) {
        const schema = yup.object().shape({
            code: yup
                .string()
                .trim()
                .length(6, 'Code must be exactly 6 digits')
                .matches(/^\d{6}$/, 'code furnished not numbers')
                .required('code is required'),
        });
        try {
            const codeObject = { code: input };
            return await schema.validate(codeObject);
        }
        catch (error) {
            if (error instanceof yup.ValidationError)
                throw new errors_1.ValidationError(errors_1.ErrorMessages.VALIDATION_ERROR, error.message);
            throw new Error('Email validating the code');
        }
    }
};
AppEmailValidation = __decorate([
    (0, tsyringe_1.injectable)()
], AppEmailValidation);
exports.default = AppEmailValidation;
