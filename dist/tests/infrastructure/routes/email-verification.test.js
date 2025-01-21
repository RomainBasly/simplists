"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testHelpers_1 = require("../../testHelpers");
describe('User Registration', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { }); // Suppress all console.error logs
    });
    afterAll(async () => {
        jest.restoreAllMocks();
        const response = await (0, testHelpers_1.apiPostRequest)('/api/test/remove-user-once-test-done').send({
            email: 'newuser@example.com',
        });
    });
    it('should allow the email verification', async () => {
        const res = await (0, testHelpers_1.apiPostRequest)('/api/register/email-verification').send({
            email: 'newuser@example.com',
        });
        expect(res.statusCode).toBe(200);
    });
    it('should not allow email verification', async () => {
        const res = await (0, testHelpers_1.apiPostRequest)('/api/register/email-verification').send({
            email: 'newuser-example.com',
        });
        expect(res.statusCode).toBe(400);
    });
    it('Should return Code false', async () => {
        const res = await (0, testHelpers_1.apiPostRequest)('/api/register/check-verification-code').send({
            email: 'newuser@example.com',
            code: '000000',
        });
        expect(res.statusCode).toBe(400);
    });
    it('Should return code is good', async () => {
        const response = await (0, testHelpers_1.apiGetRequest)('/api/test/get-verification-code/newuser@example.com');
        const code = JSON.parse(response.text).code;
        const res = await (0, testHelpers_1.apiPostRequest)('/api/register/check-verification-code').send({
            email: 'newuser@example.com',
            code,
        });
        expect(res.statusCode).toBe(200);
    });
    it('Should say conflict of user', async () => {
        const res = await (0, testHelpers_1.apiPostRequest)('/api/register/check-verification-code').send({
            email: 'newuser@example.com',
            code: '337787',
        });
        expect(res.statusCode).toBe(400);
    });
    // afterAll(async () => {
    //   // expect(response.status).toBe(200);
    // }, 10000);
});
