import axios from 'axios';

import { bsv } from 'scrypt-ts';
import Wallet, { ScriptOutput } from './abstract';

export default class Handcash extends Wallet {
  authToken: string;

  constructor({ authToken, paymail }: { authToken: string, paymail: string }) {
    super();

    this.paymail = paymail
    this.authToken = authToken;
  }

  async createTransaction({ outputs }: { outputs: ScriptOutput[] }): Promise<bsv.Transaction> {

    const { data } = await axios.post('/api/v1/handcash/pay', {
      authToken: this.authToken,
      outputs: outputs.map((output) => ({
        script: output.script.toHex(),
        value: output.value
      })),
    });

    return new bsv.Transaction(data.txhex);

  }
}
