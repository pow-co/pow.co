import { bsv } from 'scrypt-ts';
import Wallet, { ScriptOutput } from './abstract';

interface RelayoneSendResult {
  rawTx: string;
}

export default class Relayx extends Wallet {

  constructor({ paymail }: { paymail: string }) {
    super()
    this.paymail = paymail
  }

  async createTransaction({ outputs }: {outputs: ScriptOutput[]}):  Promise<bsv.Transaction> {

    const relayResponse: RelayoneSendResult = await (window as any).relayone.send({

      outputs: outputs.map((output: ScriptOutput) => ({
        to: output.script.toASM(),
        amount: Number(output.value) * 1e-8,
        currency: 'BSV',
      })),
    });

    console.debug('relayx.send.result', relayResponse);

    return new bsv.Transaction(relayResponse.rawTx);

  }

}
