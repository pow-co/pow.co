
export const POWCO_BITCOM = '1HsZZNuJ9pbfPNYFGovDadz8nkTTmW2EWU'

export interface Relayone {
  authBeta (): Promise<string>;
  sign (value: string, encoding: string): Promise<RelayoneSignResult>;
}

export interface BoostJobParams {
  content: string;
  diff: number;
  tag?: string;
  additionalData?: string;
}

export interface SignBoostJob {
  relayone: Relayone;
  job: BoostJobParams;
  dummy?: boolean;
}

export interface RelayoneSignResult {
  address: string;
  alorithm: string;//#bitcoin-signed-message
  data: string;//#
  key: string;//#identity
  value: string;
}

export interface SignUtf8 {
  relayone: Relayone;
  text: string;
  dummy?: boolean;
}


export class DummyRelayone implements Relayone {

  async authBeta() {
    const payload = btoa(JSON.stringify({"paymail": "test@localhost", "pubkey": "testpubkey"}))
    const signature = ''
    return `${payload}.${signature}`
  }

  async sign(data: string, encoding: string): Promise<RelayoneSignResult> {

    const signature = ''

    console.log('relayone.dummy.sign', { data, encoding })

    return {
      address: POWCO_BITCOM,
      alorithm: 'bitcoin-signed-message',
      data,
      key: 'identity',
      value: signature
    }
  }
  
} 

export class LocalhostRelayone extends DummyRelayone {

  async authBeta() {

    //@ts-ignore
    const relayone = window.relayone as Relayone

    return relayone.authBeta()

  }

  async sign(data: string, encoding: string): Promise<RelayoneSignResult> {

    const authResult = await this.authBeta()

    console.log('relayone.localhost.authBeta.result', authResult)

    return super.sign(data, encoding)
  }

}

export async function signBoostJob({relayone, job, dummy}: SignBoostJob): Promise<RelayoneSignResult> {

  const timestamp = new Date().getTime()

  const data = Object.assign({ timestamp }, job)

  return signUtf8({ relayone, text: JSON.stringify(data), dummy })

}

export async function signUtf8({relayone, text}: SignUtf8): Promise<RelayoneSignResult> {

  await relayone.authBeta();

  return relayone.sign(`${POWCO_BITCOM}${text}`, 'utf8')

}
