// import { PersonalInterest } from '../src/contracts/personalInterest'

import {
 bsv, Signer, toByteString, PubKey, findSig, 
} from 'scrypt-ts';
import axios from 'axios';

const { PersonalInterest } = require('../src/contracts/personalInterest');

// Add .json extension to the artifact import
const artifact = require('../artifacts/src/contracts/personalInterest.json');

try {

  PersonalInterest.loadArtifact(artifact);

} catch (error) {

  console.error('FAILED TO LOAD ARTIFACT', error);

}

const txid = 'b0704b4e1e6c6f69f83a430c9d76c564a616e06b163f7eceb78f4a1ed9ebdd30';

export { PersonalInterest };

interface CreateInterest {
  topic: string;
  owner: string;
  weight: number;
  satoshis: number;
}

interface MintInterest extends CreateInterest {
  signer: Signer;
}

export async function buildInterest({ topic, owner, weight }: CreateInterest): Promise<any> {

  const instance = new PersonalInterest(
    toByteString(topic, true),
    PubKey(owner),
    BigInt(weight),
  ); 

  return instance;

}

export async function mintInterest({
 signer, topic, owner, weight, satoshis, 
}: MintInterest): Promise<{ tx: bsv.Transaction, instance: any }> {

  console.log("mint interest", {
 signer, topic, owner, weight, satoshis, 
});

  const instance = await buildInterest({
 topic, weight, satoshis, owner, 
});

  console.log("build interest result", instance);

  await instance.connect(signer);

  console.log("interest instance connected to signer");

  const tx = await instance.deploy(satoshis);

  console.log("deploy interest result", tx);

  try {

    const { data } = await axios.get(`https://www.pow.co/api/v1/personal-interests/${txid}`);

    console.log('powco.interest.import.result', data);

  } catch (error) {

    console.error('powco.interest.import.error', error);

  }

  return { tx, instance };

}

export async function detectInterestsFromTxid(txid: string): Promise<[any[], string]> {

  console.log('detect interests from txid', txid);

  /* const hex = await blockchain.fetch(txid);

  const interests = await detectInterestsFromTxHex(hex);
  */
  const interests: any[] = [];
  const hex = '';

  return [interests, hex];

}

export async function detectInterestsFromTxHex(txhex: string): Promise<any[]> {

  const interests = [];

  const tx = new bsv.Transaction(txhex);

  for (let i = 0; i < tx.outputs.length; i++) {

    try {

      // @ts-ignore
      const interest = PersonalInterest.fromTx(tx, i);

      interests.push(interest);

    } catch (error: any) {
      // Log the error or handle it appropriately
      console.debug(`Failed to parse output ${i} as PersonalInterest:`, error.message);
    }

  }

  return interests;

}

export async function removeInterest({ signer, publicKey, instance }: { signer: Signer, publicKey: string, instance: any }): Promise<bsv.Transaction> {

  await instance.connect(signer);

  console.log('interest.remove', instance);

  const result = await instance.methods.remove((sigResponses: any) => findSig(sigResponses, new bsv.PublicKey(publicKey)));

  console.log('interest.remove.result', result);

  return result.tx;

}

export interface PersonalInterestData {
  id: number;
  origin: string;
  location: string;
  topic: string;
  owner: string;
  weight: number;
  value: number;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

export async function getPersonalInterestData({ txid }: { txid: string }): Promise<PersonalInterestData[]> {

  const { data } = await axios.get(`https://www.pow.co/api/v1/personal-interests/${txid}`);

  console.log("powco.interests.fetch.result", { txid, data });

  return data.personal_interests;

}
