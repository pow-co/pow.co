
import { MethodCallOptions, Signer, findSig } from 'scrypt-ts';
import { Meeting } from '../src/contracts/meeting';

import ContractOperator from "./contract_operator";
import { fetchTransaction } from './whatsonchain';


export class CalendarEventOperator extends ContractOperator<Meeting> {

    static async load({ origin, signer }: { origin: string, signer: Signer }): Promise<CalendarEventOperator> {
        
        // load record from server to get current location and pre-image of hashed props

        const { location } = await ContractOperator.loadRecord({ origin });
    
        // load current location transaction from blockchain

        const tx = await fetchTransaction({ txid: location.split('_')[0] });

        const contract = Meeting.fromTx(tx, 0);

        return new CalendarEventOperator({ origin, contract, signer });
    }

    async attend(): Promise<CalendarEventOperator> {

        await this.contract.connect(this.signer);

        const nextInstance = this.contract.next();

        const publicKey = await this.signer.getDefaultPubKey();

        const { tx } = await this.contract.methods.attend((sigResponses: any) => {
            return findSig(sigResponses, publicKey)
        }, {
            pubKeyOrAddrToSign: publicKey,
            next: {
                instance: nextInstance,
                balance: this.contract.balance
            },
        } as MethodCallOptions<Meeting>);

        this.contract = Meeting.fromTx(tx, 0);

        await this.contract.connect(signer);

        return this;
    }

    async invite({ pubkey }: { pubkey: string }): Promise<CalendarEventOperator> {

    }

    async cancel(): Promise<CalendarEventOperator> {

    }

    async decline(): Promise<CalendarEventOperator> {

    }

}