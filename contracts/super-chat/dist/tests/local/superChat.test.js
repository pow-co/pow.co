"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const scrypt_ts_1 = require("scrypt-ts");
const superChat_1 = require("../../src/contracts/superChat");
const txHelper_1 = require("../utils/txHelper");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
(0, chai_1.use)(chai_as_promised_1.default);
describe('Test SmartContract `SuperChat`', () => {
    let instance;
    before(async () => {
        await superChat_1.SuperChat.compile();
        instance = new superChat_1.SuperChat((0, scrypt_ts_1.sha256)((0, scrypt_ts_1.toByteString)('hello world', true)));
        await instance.connect((0, txHelper_1.getDummySigner)());
    });
    it('should pass the public method unit test successfully.', async () => {
        const { tx: callTx, atInputIndex } = await instance.methods.unlock((0, scrypt_ts_1.toByteString)('hello world', true), {
            fromUTXO: (0, txHelper_1.getDummyUTXO)(),
        });
        const result = callTx.verifyScript(atInputIndex);
        (0, chai_1.expect)(result.success, result.error).to.eq(true);
    });
    it('should throw with wrong message.', async () => {
        return (0, chai_1.expect)(instance.methods.unlock((0, scrypt_ts_1.toByteString)('wrong message', true), {
            fromUTXO: (0, txHelper_1.getDummyUTXO)(),
        })).to.be.rejectedWith(/Hash does not match/);
    });
});
//# sourceMappingURL=superChat.test.js.map