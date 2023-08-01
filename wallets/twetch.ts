import { bsv } from 'scrypt-ts';

import TwetchWeb3 from '@twetch/web3';
import Wallet, { BoostPowJobOutput } from './abstract';

export default class Twetch extends Wallet {
  async fundBoostOutputs(outputs: BoostPowJobOutput[]): Promise<bsv.Transaction> {
    const twetchResponse = await TwetchWeb3.abi({
      contract: 'payment',
      outputs: outputs.map((output) => ({
        sats: output.value,
        script: output.job.toASM(),
      })),
    });

    console.log('twetch.boost.result', twetchResponse);

    return new bsv.Transaction(twetchResponse.rawtx);
  }
}
