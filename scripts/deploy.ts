import { writeFileSync } from 'fs'
import { NextPowCo } from '../src/contracts/nextPowCo'
import { privateKey } from './privateKey'
import { bsv, TestWallet, DefaultProvider, sha256 } from 'scrypt-ts'

function getScriptHash(scriptPubKeyHex: string) {
    const res = sha256(scriptPubKeyHex).match(/.{2}/g)
    if(!res) {
        throw new Error('scriptPubKeyHex is not of even length')
    }
    return res.reverse().join('')
}

class Wallet extends TestWallet {
  get network() {
    return bsv.Networks.mainnet
  }
}

async function main() {
    await NextPowCo.compile()

    // Prepare signer. 
    // See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
    const signer = new Wallet(privateKey, new DefaultProvider({
        network: bsv.Networks.mainnet
    }))

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 100

    const instance = new NextPowCo(
        // TODO: Pass constructor parameter values.
        0n
    )

    // Connect to a signer.
    await instance.connect(signer)
    
    // Contract deployment.
    const deployTx = await instance.deploy(amount)

    // Save deployed contracts script hash.
    const scriptHash = getScriptHash(instance.lockingScript.toHex())
    const shFile = `.scriptHash`;
    writeFileSync(shFile, scriptHash);

    console.log('NextPowCo contract was successfully deployed!')
    console.log(`TXID: ${deployTx.id}`)
    console.log(`scriptHash: ${scriptHash}`)
}

main()
