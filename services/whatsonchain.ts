
import axios from 'axios'

import { bsv } from 'scrypt-ts'

export interface WhatsonchainUnspentOutput {
  height: number;
  tx_pos: number;
  tx_hash: string;
  value: number;
}

export async function listUnspent({ address }: { address: string }): Promise<WhatsonchainUnspentOutput[]> {

  const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`)

  return data
  
}

export async function fetchTransaction({ txid }: { txid: string }): Promise<bsv.Transaction> {
  
  const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`)

  return new bsv.Transaction(data)

}
