import axios from "axios";
import { Signer } from "scrypt-ts";

export default class ContractOperator<T> {

    contract: T;

    origin: string;

    signer: Signer;

    constructor({ origin, signer, contract }: { origin: string, signer: Signer, contract: T }) {
        this.origin = origin;
        this.signer = signer;
        this.contract = contract;
    }

    /*async handleContractUpdated({ method, params, outpoint }: { method: string, params: any, outpoint: string }): Promise<any> {

        // post update to the server to be stored in the database
    }*/


    static async loadRecord({ origin }: { origin: string }): Promise<ContractRecord> {

        console.log('load record', { origin });

        // load record from server to get current location and pre-image of hashed props

        const { data } = await axios.get(`https://pow.co/api/v1/contracts/${origin}`);

        const contract = data.contract

        return contract as ContractRecord;
    }

}

export interface ContractRecord {
    origin: string;
    location: string;
    props: any;
}
