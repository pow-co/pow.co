
import { bsv } from 'scrypt-ts'

import Wallet from './abstract'

import axios from 'axios';

export interface BaseWallet {

    privateKey?: bsv.PrivateKey
    publicKey?: bsv.PublicKey

}

export class BaseWallet extends Wallet {

    createTransaction({ outputs }: { outputs: bsv.Transaction.Output[] }): Promise<bsv.Transaction> {
        console.log('wallet.base.createTransaction', { outputs })
        throw new Error('Method not implemented.');
    }

    privateKey?: bsv.PrivateKey | undefined;
    
    publicKey?: bsv.PublicKey | undefined;

    async buyVideoUpload(params: {
        sha256Hash: string,
        contentLength: bigint,
        owner: bsv.PublicKey,
        satoshis: bigint
      }): Promise<bsv.Transaction> {

        let owner = params.owner?.toString()

        if (!owner) { owner = new bsv.PrivateKey().publicKey.toString() }

        const { data } = await axios.get('http://localhost:8000/api/v1/videos/new')

        console.log('videos.new.result', data)

        const output = new bsv.Transaction.Output({
            script: bsv.Script.fromASM(data.funding_script),
            satoshis: Number(params.satoshis)
        })

        const tx = await this.createTransaction({ outputs: [output] })

        console.log('wallet.buyVideoUpload.tx', { txid: tx.hash, txhex: tx.toString() })

        return tx
    
      }
}

export default BaseWallet