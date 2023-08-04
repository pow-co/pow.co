
import axios from 'axios'

import { bsv } from 'scrypt-ts'

export const authorIdentityPrefix = '15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva';

interface FindOne {
  app?: string;
  type?: string;
  content?: any;
  author?: string;
}

interface FindOrCreate {
  where: FindOne;
  defaults: OnchainPostParams;
}

interface NewMessage {
  app: string;
  type: string;
  content: any;
  nonce?: string;
}

interface OnchainPostParams {
  app: string;
  type: string;
  content: any;
}

interface BlockchainMessage extends NewMessage {
  txid: string;
  vout: number;
  script: string;
  author?: string;
}

export async function findOne(params: FindOne) {

    const where = {}

    if (params.app) { where['app'] = params.app }

    if (params.author) { where['author'] = params.author }

    if (params.type) { where['type'] = params.type }

    if (params.content) {

      Object.keys(params.content).forEach(key => {

        where[key] = params.content[key]

      })

      delete params.content

    }

    const query = new URLSearchParams(where).toString()

    const url = `https://onchain.sv/api/v1/events?${query}`

    const { data } = await axios.get(url)

    const [event] = data.events

    if (!event) {

      return
    }

    return event

}

export function createURL({ wallet, url }: { wallet: Wallet, url: string }): bsv.Transaction {

  const newMessage = {
    app: 'pow.co',
    type: 'url',
    nonce: new Date().toString(),
    content: { url }
  }

  const payloadToSign = JSON.stringify(Object.assign(newMessage.content, {
    _app: newMessage.app,
    _type: newMessage.type,
    _nonce: newMessage.nonce
  }))

  const opReturn = [
    'onchain.sv',
    newMessage.app,
    newMessage.type,
    payloadToSign,
    "|",
    authorIdentityPrefix,
    "BITCOIN_ECDSA",
    '', // identity
    '', // signature
    '0x05' // signed index #5 "payloadToSign"
  ]

  const script = wallet.buildOpReturnScript(opReturn)

  return wallet.createTransaction({ outputs: [new bsv.Transaction.Output({
    script,
    satoshis: 10
  })]})

}

