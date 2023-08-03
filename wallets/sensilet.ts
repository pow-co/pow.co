import { bsv } from 'scrypt-ts';
import Wallet from './abstract';

export default class Sensilet extends Wallet {
  
  name = 'sensilet'

  async createTransaction({ outputs }: {outputs: bsv.Transaction.Output[]}):  Promise<bsv.Transaction> {

    console.log('wallet.sensilet.createTransaction', { outputs });

    const tx = new bsv.Transaction()

    outputs.map(tx.addOutput)

    const signatures = await (window as any)['sensilet'].signTransaction(tx.toString(), [
      // TODO: Add inputs to sign from whatsonchain unspent outputs api
      // https://doc.sensilet.com/guide/sensilet-api.html#signtransaction
    ])

    console.log({ signatures })

    // TODO: Attach signatures to transaction and then broadcat 

    return tx
  }
}
