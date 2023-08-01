import { bsv } from 'scrypt-ts';
import Wallet, { ScriptOutput } from './abstract';

export default class Local extends Wallet {

  async createTransaction({ outputs }: {outputs: ScriptOutput[]}):  Promise<bsv.Transaction> {

    console.log('wallet.local.createTransaction', { outputs });

    const tx = new bsv.Transaction()

    return tx
  }
}
