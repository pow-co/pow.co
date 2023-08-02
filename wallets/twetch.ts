import { bsv } from 'scrypt-ts';

import TwetchWeb3 from '@twetch/web3';
import Wallet from './abstract';

export default class Twetch extends Wallet {

  name = 'twetch'

  constructor({ paymail }: { paymail: string }) {
    super()
    this.paymail = paymail
  }

  async createTransaction({ outputs }: {outputs: bsv.Transaction.Output[]}):  Promise<bsv.Transaction> {

    const twetchResponse = await TwetchWeb3.abi({
      contract: 'payment',
      outputs: outputs.map(output => ({
        sats: output.satoshis,
        script: output.script.toASM(),
      })),
    });

    console.log('twetch.boost.result', twetchResponse);

    return new bsv.Transaction(twetchResponse.rawtx);
  }
}
