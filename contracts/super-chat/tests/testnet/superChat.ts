import { SuperChat } from '../../src/contracts/superChat'
import { getDefaultSigner, inputSatoshis } from '../utils/txHelper'
import { toByteString, sha256 } from 'scrypt-ts'

const message = 'hello world, sCrypt!'

async function main() {
    await SuperChat.compile()
    const instance = new SuperChat(sha256(toByteString(message, true)))

    // connect to a signer
    await instance.connect(getDefaultSigner())

    // contract deployment
    const deployTx = await instance.deploy(inputSatoshis)
    console.log('SuperChat contract deployed: ', deployTx.id)

    // contract call
    const { tx: callTx } = await instance.methods.unlock(
        toByteString(message, true)
    )
    console.log('SuperChat contract `unlock` called: ', callTx.id)
}

describe('Test SmartContract `SuperChat` on testnet', () => {
    it('should succeed', async () => {
        await main()
    })
})
