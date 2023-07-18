import { TimeLockP2PK } from '../src/contracts/timeLockP2PK'
import { TimeLockP2PKH } from '../src/contracts/timeLockP2PKH'

import axios from 'axios'

import { decode } from 'bs58'

const p2pk_artifact = require('../artifacts/src/contracts/timeLockP2PK')
const p2pkh_artifact = require('../artifacts/src/contracts/timeLockP2PKH')

try {

  TimeLockP2PK.loadArtifact(p2pk_artifact)
  TimeLockP2PKH.loadArtifact(p2pkh_artifact)

} catch(error) {

  console.error('FAILED TO LOAD ARTIFACT', error)

}

import { bsv, Signer, toByteString, PubKey, findSig, hash160 } from 'scrypt-ts'

const Run = require('run-sdk')

const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

export { TimeLockP2PK, TimeLockP2PKH }

type PubkeyHex = string

export function buildTimeLockP2PK({ owner, matureTime }: { owner: PubkeyHex, matureTime: bigint }): TimeLockP2PK {

  const instance = new TimeLockP2PK(
    PubKey(owner),
    matureTime
  ) 

  return instance

}

type Address = string;

export function buildTimeLockP2PKH({ address, matureTime }: { address: Address, matureTime: bigint }): TimeLockP2PKH {

  const instance = new TimeLockP2PKH(
    PubKeyHash(Ripemd160(decode(address).toString('hex'))),
    matureTime
  ) 

  return instance

}
