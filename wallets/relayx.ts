import { bsv } from 'scrypt-ts';
import Wallet from './abstract';

interface RelayoneSendResult {
  rawTx: string;
}

export default class Relayx extends Wallet {

  name = 'relayx'

  constructor({ paymail }: { paymail: string }) {
    super()
    this.paymail = paymail
  }

  async createTransaction({ outputs }: {outputs: bsv.Transaction.Output[]}):  Promise<bsv.Transaction> {

    const relayResponse: RelayoneSendResult = await (window as any).relayone.send({

      outputs: outputs.map((output: bsv.Transaction.Output) => ({
        to: output.script.toASM(),
        amount: Number(output.satoshis) * 1e-8,
        currency: 'BSV',
      })),
    });

    console.debug('relayx.send.result', relayResponse);

    return new bsv.Transaction(relayResponse.rawTx);

  }

}
