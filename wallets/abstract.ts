import { bsv } from 'scrypt-ts';

import { BoostPowJob } from 'boostpow';

import axios from 'axios';

import delay from 'delay';

const API_BASE = 'https://pow.co';

export interface BoostPowJobOutput {
  job: BoostPowJob;
  value: bigint;
}

export default abstract class Wallet {

  paymail: string | undefined;

  name: string = 'abstract';

  abstract createTransaction({ outputs }: { outputs: bsv.Transaction.Output[] }): Promise<bsv.Transaction>;

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

    console.log({ outputs })

    const devFee = Math.floor(outputs.reduce((sum, output) => {
      return sum + output.satoshis
    }, 0) * 0.1)

    console.log({ devFee })

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