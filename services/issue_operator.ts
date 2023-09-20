import { ContractTransaction, HashedSet, MethodCallOptions, PubKey, Signer, bsv, findSig, hash160 } from 'scrypt-ts';
import { Issue } from "../src/contracts/issue";

import ContractOperator from "./contract_operator";
import { fetchTransaction } from "./whatsonchain";

import artifact from '../artifacts/issue.json'

Issue.loadArtifact(artifact)

export class IssueOperator extends ContractOperator<Issue> {
    
    static async load({ origin, signer }: { origin: string, signer: Signer }): Promise<IssueOperator> {
        
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
            contract = Issue.fromTx(tx, 0, {
                invitees,
                attendees
            });
    
            console.log("contract",contract)
            
        } catch (error) {
            throw error
        }

        return new IssueOperator({ origin, contract, signer });
    }

    async close(): Promise<IssueOperator | null> {
        
        return null

    }

    async complete(): Promise<IssueOperator | null> {

        return null

    }

    async assign(): Promise<IssueOperator | null> {

        return null

    }

    async addBounty(satoshis: bigint): Promise<IssueOperator> {

        this.contract.bindTxBuilder('addBounty', async (
            current: Issue,
            options: MethodCallOptions<Issue>
        ): Promise<ContractTransaction> => {

            const nextInstance = current.next()

            const newBalance = current.balance + Number(satoshis)

            const tx = new bsv.Transaction()
            tx.addInput(current.buildContractInput(options.fromUTXO)).addOutput(
                new bsv.Transaction.Output({
                    script: nextInstance.lockingScript,
                    satoshis: newBalance
                })
            )
            const changeAddress = await this.signer.getDefaultAddress()
            tx.change(changeAddress)

            return Promise.resolve({
                tx,
                atInputIndex: 0,
                nexts: [
                    {
                        instance: nextInstance,
                        balance: newBalance,
                        atOutputIndex: 0
                    }
                ]
            })
        })

        const { tx } = await this.contract.methods.addBounty(satoshis)

        this.contract = Issue.fromTx(tx,0)

        return this



    }

    async addComment(): Promise<IssueOperator | null> {

        return null

    }

    async reopen(): Promise<IssueOperator | null> {

        return null

    }

}