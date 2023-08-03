import { bsv } from 'scrypt-ts';
import Wallet from './abstract';

export default class Local extends Wallet {

  name = 'local'

  privateKey: bsv.PrivateKey

  constructor({ privateKey }: { privateKey: bsv.PrivateKey }) {

    super()

    this.privateKey = privateKey

  }

  async createTransaction({ outputs }: {outputs: bsv.Transaction.Output[]}):  Promise<bsv.Transaction> {

    console.log('wallet.local.createTransaction', { outputs });

    const tx = new bsv.Transaction()

    // TODO: Add Inputs from Whatsonchain Unspent Outputs API

    outputs.map(tx.addOutput)

    tx.change(this.privateKey.publicKey.toAddress())

    tx.sign(this.privateKey)

    return tx
  }
}

