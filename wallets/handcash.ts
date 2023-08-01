import axios from 'axios';

import { bsv } from 'scrypt-ts';
import Wallet, { BoostPowJobOutput } from './abstract';

export default class Handcash extends Wallet {
  authToken: string;

  constructor({ authToken }: { authToken: string }) {
    super();

    this.authToken = authToken;
  }

  async fundBoostOutputs(outputs: BoostPowJobOutput[]): Promise<bsv.Transaction> {
    const { data } = await axios.post('/api/v1/handcash/pay', {
      authToken: this.authToken,
      outputs: outputs.map((output) => ({
        script: output.job.toHex(),
        value: output.value,
      })),
    });

    return new bsv.Transaction(data.txhex);
  }
}
