
import { PersonalInterest } from '../src/contracts/personalInterest'

const artifact = require('../artifacts/src/contracts/personalInterest')

try {

  PersonalInterest.loadArtifact(artifact)

} catch(error) {

  console.error('FAILED TO LOAD ARTIFACT', error)

}

import { bsv, Signer, toByteString, PubKey, findSig } from 'scrypt-ts'

const Run = require('run-sdk')

const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

const txid = 'b0704b4e1e6c6f69f83a430c9d76c564a616e06b163f7eceb78f4a1ed9ebdd30'

export { PersonalInterest }

interface CreateInterest {
  topic: string;
  owner: string;
  weight: number;
  satoshis: number;
}

interface MintInterest extends CreateInterest {
  signer: Signer;
}

async function buildInterest({ topic, owner, weight }: CreateInterest): Promise<PersonalInterest> {

  const instance = new PersonalInterest(
    toByteString(topic, true),
    PubKey(owner),
    BigInt(weight)
  ) 

  return instance

}

export async function mintInterest({ signer, topic, owner, weight, satoshis }: MintInterest): Promise<{tx: bsv.Transaction, instance: PersonalInterest}> {

  console.log("mint interest", { signer, topic, owner, weight, satoshis })

  const instance = await buildInterest({ topic, weight, satoshis, owner })

  console.log("build interest result", instance)

  await instance.connect(signer)

  console.log("interest instance connected to signer")

  const tx = await instance.deploy(satoshis)

  console.log("deploy interest result", tx)

  return { tx, instance }

}

export async function detectInterestsFromTxid(txid: string): Promise<[PersonalInterest[], string]> {

  const hex = await blockchain.fetch(txid)

  const interests = await detectInterestsFromTxHex(hex)

  return [interests, hex]

}

export async function detectInterestsFromTxHex(txhex: string): Promise<PersonalInterest[]> {

  const interests = []

  const tx = new bsv.Transaction(txhex)

  for (let i=0; i < tx.outputs.length; i++) {

    try {

      //@ts-ignore
      const interest = PersonalInterest.fromTx(tx, i)

      interests.push(interest)

    } catch(error) {

    }

  }

  return interests

}

export async function removeInterest({ signer, publicKey, instance }: { signer: Signer, publicKey: string, instance: PersonalInterest }): Promise<bsv.Transaction> {

  await instance.connect(signer)

  console.log('interest.remove', instance)

  const result = await instance.methods.remove((sigResponses: any) => {
    return findSig(sigResponses, new bsv.PublicKey(publicKey))
  })

  console.log('interest.remove.result', result)

  return result.tx

}


