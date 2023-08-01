import { bsv } from 'scrypt-ts';

import TwetchWeb3 from '@twetch/web3';
import Wallet, { ScriptOutput } from './abstract';

export default class Twetch extends Wallet {

  constructor({ paymail }: { paymail: string }) {
    super()
    this.paymail = paymail
  }

  async createTransaction({ outputs }: {outputs: ScriptOutput[]}):  Promise<bsv.Transaction> {

    const twetchResponse = await TwetchWeb3.abi({
      contract: 'payment',
      outputs: outputs.map((output) => ({
        sats: output.value,
        script: output.script.toASM(),
      })),
    });

    console.log('twetch.boost.result', twetchResponse);

    return new bsv.Transaction(twetchResponse.rawtx);
  }
}
