
import axios from 'axios'

export interface WhatsonchainUnspentOutput {
  height: number;
  tx_pos: number;
  tx_hash: string;
  value: number;
}

export interface Utxo {
  scriptPubKey: string;
  satoshis: number;
  txId: string;
  outputIndex: number;
}

interface WhatsonchainUtxo {
  height: number;
  tx_pos: 0;
  tx_hash: string;
  value: number;
}

export async function listUnspent({ address }: { address: string }): Promise<Utxo[]> {

  //const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/address/${address}/unspent`)
  const { data } = await axios.get(`https://pow.co/v1/bsv/main/address/${address}/unspent`)

  return Promise.all(data.map(async (unspent: WhatsonchainUtxo) => {

    const { data: txData } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${unspent.tx_hash}`)

    const scriptPubKey = txData.vout[unspent.tx_pos].scriptPubKey.hex

    return {

      scriptPubKey,

      satoshis: unspent.value,

      txId: unspent.tx_hash,

      outputIndex: unspent.tx_pos

    }

  }))

  
}
