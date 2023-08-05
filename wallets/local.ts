import { bsv } from 'scrypt-ts';
import Wallet from './abstract';
import { listUnspent } from '../services/whatsonchain'
import * as bip39 from 'bip39'
import axios from 'axios'

import * as BSV from 'bsv-wasm'

import { PrivateKey } from 'bsv-wasm'

import { Inscription, MAP, createOrdinal } from 'js-1sat-ord'

import { Sigma } from '../services/sigma'

import { LocalSigner, Utxo } from '../services/1satOrd'

const SATS_PER_KB = 10

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

  get hdPrivateKey(): bsv.HDPrivateKey {

    return bsv.HDPrivateKey.fromSeed(this.seed.toString('hex'))

  }

  get BSV() {
    return (window as any)['BSV']
  }

  get ordinalPrivateKey(): bsv.PrivateKey {

   return this.hdPrivateKey.deriveChild(this.ordinalDerivationPath).privateKey;

  }

  get ordinalAddress(): string {

    return this.ordinalPrivateKey.toPublicKey().toAddress().toString()
  }

  get ordinalDerivationPath(): string {

    const ordAsInt = parseInt(Buffer.from('ord', 'utf8').toString('hex'), 16)

    return `m/44'/${ordAsInt}'/0'/0/0`

  }

  get WIF(): string {

    return this.hdPrivateKey.privateKey.toWIF()

  }

  get ordinalWIF(): string {

    const derived = this.hdPrivateKey.deriveChild(this.ordinalDerivationPath);

    return derived.privateKey.toWIF()

  }

  get privateKey(): bsv.PrivateKey { 

    return this.hdPrivateKey.privateKey

  }

  get address(): BSV.Address {
  
    return this.privateKey.publicKey.toAddress()
  }

  async createTransaction({ outputs }: {outputs: bsv.Transaction.Output[]}):  Promise<bsv.Transaction> {

    console.log('wallet.local.createTransaction', { outputs });

    const tx = new bsv.Transaction()

    const unspent = await this.listUnspent()

    console.log(unspent)

    tx.from(unspent)

    outputs.forEach(output => tx.addOutput(output))

    tx.feePerKb(5)

    tx.change(this.address)

    tx.sign(this.privateKey)

    await this.broadcastTransaction({ tx })

    console.log('wallet.local.createTransaction.result', { txhex: tx.toString(), txid: tx.hash });

    throw new Error()

    return tx

  }

  get ordinalSigner(): LocalSigner {

    return {

      idKey: this.ordinalPrivateKey
    }

  }

  async getOrdinalUtxo(): Promise<Utxo> {

    const unspent = await listUnspent({ address: this.address.toString() })

    console.log({ address: this.address.toString() })

    console.log({ unspent })

    const utxo = unspent.sort((a, b) => a.satoshis - b.satoshis)[0]

    console.log('utxo', utxo)

    return {
      satoshis: utxo.satoshis,
      txid: utxo.txId,
      vout: utxo.outputIndex,
      script: utxo.scriptPubKey
    }

  }

  buildInscription(args: { inscription: Inscription, metaData: MAP, destinationAddress?: string }): Promise<bsv.Script> {

    return ordinals.buildInscription({
      destinationAddress: new bsv.Address(args.destinationAddress || this.address),
      dataB64: args.inscription.dataB64,
      contentType: args.inscription.contentType,
      metaData: args.metaData 
    })

  }

  async createOrdinal({ inscription, metaData }): Promise<bsv.Transaction> {

    const utxo: Utxo = await this.getOrdinalUtxo()
  
    let ordinalTx = await ordinals.createOrdinal({

      utxo,

      destinationAddress: this.ordinalAddress,

      paymentPk: this.privateKey,

      changeAddress: this.address,

      satPerByteFee: SATS_PER_KB * 1e-3,

      inscription,
  
      metaData,

      signer: this.ordinalSigner

    })

    ordinalTx.sign(this.privateKey)

    await this.broadcastTransaction({ tx: ordinalTx })

    return ordinalTx

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
