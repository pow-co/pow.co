import { bsv } from 'scrypt-ts';

import { BoostPowJob } from 'boostpow';

import axios from 'axios';

import delay from 'delay';

import bops from "bops";

const API_BASE = 'https://pow.co';

export const authorIdentityPrefix = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva';

export interface BoostPowJobOutput {
  job: BoostPowJob;
  value: bigint;
}

import { findOne, FindOrCreate } from '../services/findOrCreate'

export default abstract class Wallet {

  paymail: string | undefined;

  name: string = 'abstract';

  abstract createTransaction({ outputs }: { outputs: bsv.Transaction.Output[] }): Promise<bsv.Transaction>;

  buildOpReturnScript(dataPayload: string[]): bsv.Script {

    const script = bsv.Script.fromASM(
      "OP_0 OP_RETURN " +
        dataPayload
          .map((str) => bops.to(bops.from(str, "utf8"), "hex"))
          .join(" ")
    );

    return script

  }

  async onchainPostJson({app, type, content }: {app: string, type: string, content: any }): Promise<bsv.Transaction> {

      const nonce = new Date().getTime()

      const payloadToSign = JSON.stringify(Object.assign(content, {
        _app: app,
        _type: type,
        _nonce: nonce
      }))

      let signature = ''

      var address = ''

      const opReturn = [
        'onchain.sv',
        app,
        type,
        payloadToSign,
        "|",
        authorIdentityPrefix,
        "BITCOIN_ECDSA",
        address,
        signature,
        '0x05' // signed index #5 "payloadToSign"
     ]

      const tx = await this.createTransaction({ outputs: [
        new bsv.Transaction.Output({
          script: this.buildOpReturnScript(opReturn),
          satoshis: 10
        })
      ]})

      try {

        const { data } = await axios.post(`https://onchain.sv/api/v1/transactions`, {
          transaction: tx.toString()
        })

        console.log('onchain.sv.transactions.post.result', data)

      } catch(error) {

        console.error('onchain.sv.transactions.post.error', error)

      }

      const onchainResult = await reliableGetOnchain(tx)

      console.log(onchainResult)

      return tx

  }

  async onchainFindOrCreate(args: FindOrCreate): Promise<bsv.Transaction> {

    const { where, defaults } = args

    const result = await findOne(where)

    console.log('onchainFindOne.result', result)

    if (result) return result

    return this.onchainPostJson(defaults)

  }

  async createBoostTransaction(outputs: BoostPowJobOutput[]): Promise<bsv.Transaction> {

    console.log('createBoostTransaction', outputs)

    const tx: bsv.Transaction = await this.fundBoostOutputs(outputs)

    try {

      const result = await reliablePostJob(tx);

      console.log('reliablePostJob.result', result);

    } catch (error) {

      console.error(error);

    }

    return tx;

  }

  private async fundBoostOutputs(boostOutputs: BoostPowJobOutput[]): Promise<bsv.Transaction> {

    const outputs = boostOutputs.map(output => {
      return new bsv.Transaction.Output({
        script: bsv.Script.fromASM(output.job.toASM()),
        satoshis: Number(output.value)
      })
    })

    const devFee = Math.floor(outputs.reduce((sum, output) => {
      return sum + output.satoshis
    }, 0) * 0.1)

    if (process.env.NEXT_PUBLIC_FEE_SCRIPT) {

      outputs.push(new bsv.Transaction.Output({
        script: bsv.Script.fromHex(process.env.NEXT_PUBLIC_FEE_SCRIPT),
        satoshis: devFee
      }))

    }

    return this.createTransaction({ outputs })

  }

}

async function reliablePostJob(tx: bsv.Transaction): Promise<any[]> {
  let tries = 0;

  let success = false;

  while (tries < 5 && !success) {
    try {
      const { data: postData } = await axios.post(`${API_BASE}/api/v1/boost/jobs`, {
        transaction: tx.toString(),
      });

      if (postData.jobs.length > 0) {
        success = true;

        return postData.jobs;
      }

      const { data: getData } = await axios.get(`${API_BASE}/api/v1/boost/jobs/${tx.hash}`);

      if (getData.jobs.length > 0) {
        success = true;

        return getData.jobs;
      }
    } catch (error) {
      console.error('reliablePostJob.error', error);

      tries += 1;

      console.log({ tries });

      await delay(tries * 1000);
    }
  }

  throw new Error('failed to post job');
}

async function reliableGetOnchain(tx: bsv.Transaction): Promise<any[]> {

  let tries = 0;

  let success = false;

  while (tries < 5 && !success) {
    try {

      const { data } = await axios.get(`https://onchain.sv/api/v1/events/${tx.hash}`)

      console.log('published to onchain.sv', tx)

      return data

    } catch (error) {

      console.error('reliableGetOnchain.error', error);

      tries += 1;

      await delay(tries * 1000);
    }
  }

  throw new Error('failed to get onchain after five tries');
}
