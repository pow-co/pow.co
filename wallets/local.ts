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

    const hdPrivateKey = bsv.HDPrivateKey.fromSeed(this.seed.toString('hex'))


    const derivationPaths = {
      sensiletDefault:        `m/44'/0'/0'/0/0`,
      relayxBsv:              `m/44'/236'/0'/0/0`,
      relayxChange:           `m/44'/236'/0'/1/0`,
      relayxRunOwner:         `m/44'/236'/0'/2/0`,
      relayxMarketOrderCancel:`m/44'/236'/0'/3/0`
    }

    return hdPrivateKey.deriveChild(derivationPaths.sensiletDefault).privateKey

  }

  get address(): bsv.Address {
  
    return this.privateKey.publicKey.toAddress()
  }

  async createTransaction({ outputs }: {outputs: bsv.Transaction.Output[]}):  Promise<bsv.Transaction> {

    console.log('wallet.local.createTransaction', { outputs });

    const tx = new bsv.Transaction()

    const unspent = await this.listUnspent()

    tx.from(unspent)

    outputs.forEach(output => tx.addOutput(output))

    tx.change(this.address)

    tx.sign(this.privateKey)

    await this.broadcastTransaction({ tx })

    console.log('wallet.local.createTransaction.result', { txhex: tx.toString(), txid: tx.hash });

    return tx

  }

  async broadcastTransaction({ tx }: { tx: bsv.Transaction }): Promise<bsv.Transaction> {

    await axios.post(`https://api.whatsonchain.com/v1/bsv/main/tx/raw`, {
      txhex: tx.toString()
    })

    return tx;

  }

  async listUnspent(): Promise<Utxo[]> {

    const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${this.address}/unspent`)

    return Promise.all(data.map(async (unspent: WhatsonchainUtxo) => {

      const { data: txData } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${unspent.tx_hash}`)

      const scriptPubKey = txData.vout[unspent.tx_pos].scriptPubKey.hex

      return {

        scriptPubKey,

        satoshis: unspent.value,

        txId: unspent.tx_hash,

        outputIndex: unspent.tx_pos

      }

    }))

  }

}

export interface Utxo {
  scriptPubKey: string;
  satoshis: number;
  txId: string;
  outputIndex: number;
}

interface WhatsonchainUtxo {
  height: number;
  tx_pos: 0;
  tx_hash: string;
  value: number;
}
