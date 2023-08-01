import { bsv } from 'scrypt-ts';
import Wallet, { BoostPowJobOutput } from './abstract';

export default class Local extends Wallet {
  async fundBoostOutputs(outputs: BoostPowJobOutput[]): Promise<bsv.Transaction> {
    console.log('wallet.local.fundBoostOutputs', { outputs });

    return new bsv.Transaction();
  }
}
