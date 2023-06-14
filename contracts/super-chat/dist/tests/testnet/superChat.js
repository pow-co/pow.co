"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const superChat_1 = require("../../src/contracts/superChat");
const txHelper_1 = require("../utils/txHelper");
const scrypt_ts_1 = require("scrypt-ts");
const message = 'hello world, sCrypt!';
async function main() {
    await superChat_1.SuperChat.compile();
    const instance = new superChat_1.SuperChat((0, scrypt_ts_1.sha256)((0, scrypt_ts_1.toByteString)(message, true)));
    // connect to a signer
    await instance.connect((0, txHelper_1.getDefaultSigner)());
    // contract deployment
    const deployTx = await instance.deploy(txHelper_1.inputSatoshis);
    console.log('SuperChat contract deployed: ', deployTx.id);
    // contract call
    const { tx: callTx } = await instance.methods.unlock((0, scrypt_ts_1.toByteString)(message, true));
    console.log('SuperChat contract `unlock` called: ', callTx.id);
}
describe('Test SmartContract `SuperChat` on testnet', () => {
    it('should succeed', async () => {
        await main();
    });
});
//# sourceMappingURL=superChat.js.map