import axios from 'axios'

import { fetchTransaction } from '../services/whatsonchain'

import { bsv } from 'scrypt-ts'

interface OnchainPostParams {
  app: string;
  type: string;
  content: any;
}

export interface FindOrCreate {
  where: FindOne;
  defaults: OnchainPostParams;
}

interface FindOne {
  app?: string;
  type?: string;
  content?: any;
  author?: string;
}

interface FindAll {
  app?: string;
  type?: string;
  content?: any;
  author?: string;
  limit?: number;
  offset?: number;
}

export async function findOne(params: FindOne): Promise<bsv.Transaction | undefined> {

  const where: any = {}

  if (params.app) { where['app'] = params.app }

  if (params.author) { where['author'] = params.author }

  if (params.type) { where['type'] = params.type }

  if (params.content) {

    Object.keys(params.content).forEach(key => {

      where[key] = params.content[key]

    })

  }

  const query = new URLSearchParams(where).toString()

  console.log('query', query)

  const url = `https://onchain.sv/api/v1/search/events`

  const { data } = await axios.post(url, params)

  const [event] = data.events

  if (event) {

    return fetchTransaction({ txid: event.txid })

  }

  return

}

async function findOrCreate(params: FindOrCreate) {

  var isNew = true

  var result = await findOne(params.where)

  if (result) {

    return [result, false]
  }

  if (!result) {

    //await post(Object.assign(params.where, params.defaults))

    //result = await findOne(params.where)

  }

  if (!result) {

    throw new Error('Failed To Find Or Create')

  }

  console.log(result)

  return [result, isNew]

}

