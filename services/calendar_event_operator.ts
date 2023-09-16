
import { HashedSet, MethodCallOptions, PubKey, Signer, findSig, hash160 } from 'scrypt-ts';
import { Meeting } from '../src/contracts/meeting';

import ContractOperator from "./contract_operator";
import { fetchTransaction } from './whatsonchain';
import { Meeting as MeetingContract } from "../src/contracts/meeting"
import artifact from "../artifacts/meeting.json";

MeetingContract.loadArtifact(artifact);

export class CalendarEventOperator extends ContractOperator<Meeting> {

    static async load({ origin, signer }: { origin: string, signer: Signer }): Promise<CalendarEventOperator> {
        
        // load record from server to get current location and pre-image of hashed props

        const { location, props } = await ContractOperator.loadRecord({ origin });
    
        // load current location transaction from blockchain

        //const tx = await fetchTransaction({ txid: location.split('_')[0] });
        //temporary hack
        const tx = await fetchTransaction({ txid: origin});

        // initialize all HashSet / HashedMap props
        const invitees = new HashedSet<PubKey>()
        const attendees = new HashedSet<PubKey>()

        // fill values based on props (pre-images) from server
        if (props.invitees){
            props.invitees.forEach((str: string) => {
                invitees.add(PubKey(str))
            });
        }
        if (props.attendees){
            props.attendees.forEach((str: string) => {
                attendees.add(PubKey(str))
            });
        }
        
        let contract
        try {
            contract = Meeting.fromTx(tx, 0, {
                invitees,
                attendees
            });
    
            console.log("contract",contract)
            
        } catch (error) {
            throw error
        }

        return new CalendarEventOperator({ origin, contract, signer });
    }

    async attend(): Promise<CalendarEventOperator> {

        await this.contract.connect(this.signer);

        const nextInstance = this.contract.next();

        const publicKey = await this.signer.getDefaultPubKey();

        const { tx } = await this.contract.methods.attend(PubKey(publicKey.toString()), (sigResponses: any) => {
            return findSig(sigResponses, publicKey)
        }, {
            pubKeyOrAddrToSign: publicKey,
            next: {
                instance: nextInstance,
                balance: this.contract.balance
            },
        } as MethodCallOptions<Meeting>);

        this.contract = Meeting.fromTx(tx, 0);

        await this.contract.connect(this.signer);

        return this;
    }

    async invite({ pubkey }: { pubkey: string }): Promise<CalendarEventOperator> {

    }

    async cancel(): Promise<CalendarEventOperator> {

    }

    async decline(): Promise<CalendarEventOperator> {

    }

}