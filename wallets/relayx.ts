import { bsv } from 'scrypt-ts';
import Wallet from './base';

interface RelayoneSendResult {
  rawTx: string;
}

export default class Relayx extends Wallet {

  name = 'relayx';

  token: string;

  constructor({ paymail, publicKey, token}: { paymail: string, publicKey: bsv.PublicKey, token: string }) {
    super()
    this.paymail = paymail
    console.log("this.publicKey", publicKey)
    this.publicKey = publicKey
    this.token = token
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
