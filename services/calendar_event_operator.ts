
import { HashedSet, MethodCallOptions, PubKey, Signer, findSig, hash160 } from 'scrypt-ts';
import { Meeting } from '../src/contracts/meeting';

import ContractOperator from "./contract_operator";
import { fetchTransaction } from './whatsonchain';
import { Meeting as MeetingContract } from "../src/contracts/meeting"
import artifact from "../artifacts/meeting.json";
import axios from 'axios';

MeetingContract.loadArtifact(artifact);

export class CalendarEventOperator extends ContractOperator<Meeting> {

    get attendees() {
        return [...this.contract.attendees];
    }

    get invitees() {
        return [...this.contract.invitees];
    }

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

        nextInstance.attendees.add(PubKey(publicKey.toString()));

        const { tx } = await this.contract.methods.attend(PubKey(publicKey.toString()), (sigResponses: any) => {
            return findSig(sigResponses, publicKey)
        }, {
            pubKeyOrAddrToSign: publicKey,
            next: {
                instance: nextInstance,
                balance: this.contract.balance
            },
        } as MethodCallOptions<Meeting>);

        console.log('attend.tx', tx);

        const props = {
            invitees: [],
            attendees: [],
        };

        nextInstance.invitees.forEach((pubkey: PubKey) => {
            props.invitees.push(pubkey.toString());            
        });

        nextInstance.attendees.forEach((pubkey: PubKey) => {
            props.attendees.push(pubkey.toString());
        });

        const { data } = await await axios.put(`https://hls.pow.co/api/v1/contracts/${this.origin}`, {
            transaction: tx.toString(),
            props,            
        });

        console.log('attend.ingest.result', data);

        this.contract = Meeting.fromTx(tx, 0, {
            invitees: nextInstance.invitees,
            attendees: nextInstance.attendees
        });

        await this.contract.connect(this.signer);

        return this;
    }

    async invite({ pubkey }: { pubkey: string }): Promise<CalendarEventOperator | null> {

        return null

    }

    async cancel(): Promise<CalendarEventOperator | null> {

        return null 
    }

    async decline(): Promise<CalendarEventOperator | null> {

        return null 
    }

}