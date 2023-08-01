import { bsv } from 'scrypt-ts';
import Wallet, { BoostPowJobOutput } from './abstract';

export default class Sensilet extends Wallet {
  async fundBoostOutputs(outputs: BoostPowJobOutput[]): Promise<bsv.Transaction> {
    console.log('wallet.sensilet.fundBoostOutputs', { outputs });

    return new bsv.Transaction();
  }
}
