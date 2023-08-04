import { bsv } from 'scrypt-ts';
import Wallet from './abstract';
import { listUnspent } from '../services/whatsonchain'
import * as bip39 from 'bip39'
import axios from 'axios'

export default class LocalWallet extends Wallet {

  name = 'local'

  seed: Buffer;

  static fromPhrase({ phrase }: { phrase: string }): LocalWallet {

    return new LocalWallet({ seed: bip39.mnemonicToSeedSync(phrase) })

  }

  constructor({ seed }: { seed: Buffer }) {

    super()

    this.seed = seed

  }

  get privateKey(): bsv.PrivateKey { 

    return bsv.HDPrivateKey.fromSeed(this.seed.toString('hex')).privateKey

  }

  get address(): bsv.Address {
  
    return this.privateKey.publicKey.toAddress()
  }

  async createTransaction({ outputs }: {outputs: bsv.Transaction.Output[]}):  Promise<bsv.Transaction> {

    console.log('wallet.local.createTransaction', { outputs });

    const tx = new bsv.Transaction()

    const unspent = await listUnspent({ address: this.address })

    tx.from(unspent)

    outputs.forEach(output => tx.addOutput(output))

    tx.change(this.address)

    tx.sign(this.privateKey)

    await this.broadcastTransaction({ tx })

    console.log('wallet.local.createTransaction.result', { txhex: tx.toString(), txid: tx.hash });

    return tx

  }

}

