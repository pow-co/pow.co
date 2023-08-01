import type { NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

import { bsv } from 'scrypt-ts';

import { HandCashConnect } from '@handcash/handcash-connect';

import delay from 'delay';

const appId: string = String(process.env.handcash_app_id);
const appSecret: string = String(process.env.handcash_app_secret);

const handCashConnect = new HandCashConnect({
  appId,
  appSecret,
});

async function createScriptShortcode({ script }: { script: bsv.Script }): Promise<string> {
  const { data } = await axios.post('https://pow.co/api/v1/script-shortcodes', {
    script: script.toHex(),
  });

  return data.uid;
}

interface Payment {
  destination: string;
  currencyCode: string;
  sendAmount: number;
}

interface ScriptOutput {
  script: bsv.Script;
  value: bigint;
}

async function fundScripts({ authToken, outputs, note }: { authToken: string, outputs: ScriptOutput[], note?: string }): Promise<{ txid: string, txhex?: string }> {
  const account = handCashConnect.getAccountFromAuthToken(authToken);

  const payments: Payment[] = await Promise.all(outputs.map(async (output) => {
    const sendAmount = Number(output.value) * 1e-8;

    const currencyCode = 'BSV';

    const shortCode = await createScriptShortcode({ script: output.script });

    const destination = `${shortCode}@pow.co`;

    const payment = {
      destination, currencyCode, sendAmount,
    };

    return payment;
  }));

  const { transactionId: txid } = await account.wallet.pay({
    note: note || '',
    // @ts-ignore TODO: Figure out why CurrencyCode is not assignable to string (typescript compilation error)
    payments,
  });

  let txhex: string;

  try {
    txhex = await reliableFetchTransaction({ txid });

    return { txid, txhex };
  } catch (error) {
    console.error(error);

    return { txid };
  }
}

async function fetchTransaction({ txid }: { txid: string }): Promise<string> {
  const resp = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`);

  return resp.data;
}

async function reliableFetchTransaction({ txid }: { txid: string }): Promise<string> {
  let tries = 0;

  let txhex: string;

  let success = false;

  while (tries < 5 && !success) {
    try {
      txhex = await fetchTransaction({ txid });

      success = true;

      return txhex;
    } catch (error) {
      tries += 1;

      await delay(tries * 1000);
    }
  }

  throw new Error('failed to fetch transaction');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(404);
  }

  try {
    const { authToken, outputs } = req.body;

    const { txid, txhex } = await fundScripts({
      authToken,
      outputs: outputs.map((output: { value: number, script: string }) => ({
        value: BigInt(output.value),
        script: bsv.Script.fromHex(output.script),
      })), 
    });

    return res.status(200).json({ status: 'sent', txid, txhex });
  } catch (error: any) {
    console.error(error);

    return res.status(400).json({ status: 'error', message: error.toString() });
  }
}
