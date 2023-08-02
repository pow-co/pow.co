
import axios from 'axios'

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
