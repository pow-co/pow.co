import { DefaultProvider, Provider, ScryptProvider, Signer, bsv } from 'scrypt-ts';
import Wallet from './base';
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

    const hdPrivateKey = bsv.HDPrivateKey.fromSeed(this.seed.toString('hex'), bsv.Networks.mainnet)

    const derivationPaths = {
      sensiletDefault:        `m/44'/0'/0'/0/0`,
      relayxBsv:              `m/44'/236'/0'/0/0`,
      relayxChange:           `m/44'/236'/0'/1/0`,
      relayxRunOwner:         `m/44'/236'/0'/2/0`,
      relayxMarketOrderCancel:`m/44'/236'/0'/3/0`,
      twetchAccount: `m/0/0`,
      twetchWallet: `m/44'/0'/0'/0`
    }

    this.privateKey = hdPrivateKey.deriveChild(derivationPaths.sensiletDefault).privateKey
    this.publicKey = this.privateKey?.publicKey

    this.paymail = `${this.address.toString()}@pow.co`

    this.provider = new DefaultProvider()

  }

  get address(): bsv.Address {
  
    return (this.privateKey as bsv.PrivateKey).publicKey.toAddress()
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

    const { data } = await axios.get(`/api/v1/addresses/${this.address}/unspent`)

    return data.unspent.map((unspent: any) => {

      return {

        scriptPubKey: unspent.script,

        satoshis: unspent.satoshis,

        txId: unspent.txId,

        outputIndex: unspent.outputIndex

      }

    })

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
