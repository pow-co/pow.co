import { bsv } from 'scrypt-ts';
import Wallet, { BoostPowJobOutput } from './abstract';

interface RelayoneSendResult {
  rawTx: string;
}

export default class Relayx extends Wallet {
  async fundBoostOutputs(outputs: BoostPowJobOutput[]): Promise<bsv.Transaction> {
    const relayResponse: RelayoneSendResult = await (window as any).relayone.send({
      outputs: outputs.map((output) => ({
        to: output.job.toASM(),
        amount: Number(output.value) * 1e-8,
        currency: 'BSV',
      })),
    });

    console.log('relayx.send.result', relayResponse);

    const txhex = relayResponse.rawTx;

    const tx = new bsv.Transaction(txhex);

    return tx;
  }
}
