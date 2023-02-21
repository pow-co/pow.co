
import { Script } from '@runonbitcoin/nimble'
import axios from 'axios';
import bops from 'bops'

interface SendMessage {
    app: string;
    channel: string;
    message: string;
    paymail?: string;
    address?: string;
}

interface SignResult {
  algorithm: "bitcoin-signed-message";
  key: "identity";
  data: string; // data you passed in
  value: string; // signature
}

export async function sendMessage({ app, channel, message, paymail, address }: SendMessage): Promise<void> {

  console.log("sendMessage", { app, channel, message, paymail, address })

      // Create data payload for Message Schema
      let dataPayload: string[] = [
        "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut", // B Prefix
        message,
        "text/plain",
        "utf-8",
        "|",
        "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5", // MAP Prefix
        "SET",
        "app",
        app,
        "type",
        "message",
        "paymail",
        paymail || '',
        "context",
        "channel",
        "channel",
        channel,
      ];

      //@ts-ignore
      /*const {signature} = await window.relayone.sign(dataPayload
        .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
        .join(" "))

      dataPayload = [
        ...dataPayload,
        '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva', // AUTHOR IDENTITY PROTOCOL PREFIX
        'BITCOIN_ECDSA',
        address || '',
        signature
      ]*/

      // Channels get used in chat apps like: https://bitchatnitro.com/
      const script = Script.fromASM(
        "OP_0 OP_RETURN " +
        dataPayload
          .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
          .join(" ")
      );

      console.log(script.toASM())

      let outputs: { script: string, amount: number, currency: string }[] = [{script: script.toASM(), amount: 0, currency: "BSV" }];

      //@ts-ignore
      let resp = await window.relayone.send({
        to: 'powco@relayx.io',
        currency: 'USD',
        amount: 0.0001,
        opReturn: dataPayload,
      });

      ;(async () => {
        // TODO: Handle POST message to onchain.sv BMAP indexing API service
        // POST https://onchain.sv/api/v1/transactions
        // {
        //   "transaction": resp.txhex
        // }
        try {

          const bMapResult = await axios.post('https://b.map.sv/ingest', {
            rawTx: resp.rawTx
          })

          console.log('b.map.sv.ingest.result', bMapResult)

          const { data } = await axios.post('https://onchain.sv/api/v1/transactions', {
            transaction: resp.txhex
          })

          console.log('onchain.sv.transactions.post.result', data)

          const { data: getData } = await axios.get(`https://onchain.sv/api/v1/transactions/${resp.txid}`)

          console.log('onchain.sv.transactions.get.result', getData)

        } catch(error) {
          console.error('onchain.sv.transactions.post.error', error)

        }
      })();

      let txid = resp.txid;

      return resp;

  }