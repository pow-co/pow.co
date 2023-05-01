
import axios from 'axios'
import { PersonalInterest } from './src/contracts/personalInterest'
//import { PersonalInterest } from './dist/src/contracts/personalInterest'
import {
    bsv,
    TestWallet,
    DefaultProvider,
    sha256,
    toByteString,
    PubKey
} from 'scrypt-ts'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY || '')

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
    privateKey,
    new DefaultProvider()
)

async function main() {
    await PersonalInterest.compile()

    const amount = parseInt(process.argv[3] || '1000')

    const owner = PubKey(privateKey.toPublicKey().toHex())

    const instance = new PersonalInterest(
        toByteString(process.argv[2] || 'music.house.soul', true),
        owner,
        //@ts-ignore
        1n
    )

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)

    console.log('PersonalInterest contract deployed: ', deployTx.id)

    const { data } = await axios.get('https://pow.co/api/v1/personal-interests/'+deployTx.id)

    console.log(data, 'imported')
}

main()
