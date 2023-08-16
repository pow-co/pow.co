import axios from 'axios';

import { bsv } from 'scrypt-ts';
import Wallet from './base';

export default class Handcash extends Wallet {
  authToken: string;

  name = 'handcash'

  constructor({ authToken, paymail }: { authToken: string, paymail: string }) {
    super();

    this.paymail = paymail
    this.authToken = authToken;
  }

  async createTransaction({ outputs }: { outputs: bsv.Transaction.Output[] }): Promise<bsv.Transaction> {

    const { data } = await axios.post('/api/v1/handcash/pay', {
      authToken: this.authToken,
      outputs: outputs.map((output) => ({
        script: output.script.toHex(),
        value: output.satoshis
      })),
    });

    return new bsv.Transaction(data.txhex);

  }
}
