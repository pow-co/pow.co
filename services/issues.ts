import {
 ContractTransaction, MethodCallOptions, PubKey, Signer, TxOutputRef, bsv, buildPublicKeyHashScript, findSig, hash160, toByteString,
} from "scrypt-ts";
import axios from "axios";
import { Issue } from "../src/contracts/issue";

import artifact from "../artifacts/issue.json";

Issue.loadArtifact(artifact);

export async function addComment(args: {
  issue: Issue,
  comment: string,
  signer: Signer
}): Promise<[Issue, bsv.Transaction]> {

  console.log('addComment', args.issue, args.comment, args.signer);

  const signingPubkey = await args.signer.getDefaultPubKey();

  args.issue.bindTxBuilder('addComment', (
    current: Issue,
    options: MethodCallOptions<Issue>,
  ): Promise<ContractTransaction> => {

    const nextInstance = current.next();

    const tx = new bsv.Transaction();
    tx.addInput(current.buildContractInput(options.fromUTXO)).addOutput(
        new bsv.Transaction.Output({
            script: nextInstance.lockingScript,
            satoshis: current.balance,
        }),
    );
    tx.change(signingPubkey.toAddress());

    return Promise.resolve({
        tx,
        atInputIndex: 0,
        nexts: [
            {
                instance: nextInstance,
                balance: current.balance,
                atOutputIndex: 0,
            },
        ],
    });

  });

  console.log('did bind');

  await args.issue.connect(args.signer);

  const { tx } = await args.issue.methods.addComment(
    toByteString(args.comment, true),
    PubKey(signingPubkey.toString()),
    (sigResponses: any) => findSig(sigResponses, signingPubkey),
  );

  console.log('addComment', tx);

  const newIssue = Issue.fromTx(tx, 0);

  return [newIssue, tx];
 
}

export async function addBounty(args: { issue: Issue, satoshis: bigint, signer: Signer }): Promise<[Issue, bsv.Transaction]> {

  args.issue.bindTxBuilder('addBounty', async (
    current: Issue,
    options: MethodCallOptions<Issue>,
  ): Promise<ContractTransaction> => {

    const nextInstance = current.next();

    const newBalance = current.balance + Number(args.satoshis);

    const tx = new bsv.Transaction();
    tx.addInput(current.buildContractInput(options.fromUTXO)).addOutput(
        new bsv.Transaction.Output({
            script: nextInstance.lockingScript,
            satoshis: newBalance,
        }),
    );
    const changeAddress = await args.signer.getDefaultAddress();
    tx.change(changeAddress);

    return Promise.resolve({
        tx,
        atInputIndex: 0,
        nexts: [
            {
                instance: nextInstance,
                balance: newBalance,
                atOutputIndex: 0,
            },
        ],
    });

  });

  const { tx } = await args.issue.methods.addBounty(args.satoshis);

  const newIssue = Issue.fromTx(tx, 0);

  return [newIssue, tx];

}

  export async function assignIssue(args: { issue: Issue, assignee: bsv.PublicKey, signer: Signer }): Promise<[Issue, bsv.Transaction]> {

    await args.issue.connect(args.signer);
    
    args.issue.bindTxBuilder('assign', async (
      current: Issue,
      options: MethodCallOptions<Issue>,
    ): Promise<ContractTransaction> => {
  
      const nextInstance = current.next();

      nextInstance.assignee = PubKey(args.assignee.toString());
    
      const tx = new bsv.Transaction();
      tx.addInput(current.buildContractInput(options.fromUTXO)).addOutput(
          new bsv.Transaction.Output({
              script: nextInstance.lockingScript,
              satoshis: current.balance,
          }),
      );
      tx.change(await args.signer.getDefaultAddress());
  
      return Promise.resolve({
          tx,
          atInputIndex: 0,
          nexts: [
              {
                  instance: nextInstance,
                  balance: current.balance,
                  atOutputIndex: 0,
              },
          ],
      });
  
    });

    const signer = await args.signer.getDefaultPubKey();

  const { tx } = await args.issue.methods.assign(PubKey(args.assignee.toString()), (sigResponses: any) => findSig(sigResponses, signer));
  const newIssue = Issue.fromTx(tx, 0);

  return [newIssue, tx];

}

export async function completeIssue(args: { issue: Issue, signer: Signer }): Promise<[Issue, bsv.Transaction]> {

    await args.issue.connect(args.signer);

  args.issue.bindTxBuilder('complete', async (
    current: Issue,
    options: MethodCallOptions<Issue>,
  ): Promise<ContractTransaction> => {

    const nextInstance = current.next();

    nextInstance.completed = true;
    nextInstance.closed = true;

    const finalBalance = 1;

    const bounty = current.balance - finalBalance;
  
    const tx = new bsv.Transaction();
    tx.addInput(current.buildContractInput(options.fromUTXO)).addOutput(
        new bsv.Transaction.Output({
            script: nextInstance.lockingScript,
            satoshis: finalBalance,
        }),
    ).addOutput(
      new bsv.Transaction.Output({
          script: buildPublicKeyHashScript(hash160(current.assignee)),
          satoshis: bounty,
      }),
    );

    const change = await args.signer.getDefaultAddress();

    tx.change(change);

    return Promise.resolve({
        tx,
        atInputIndex: (args.issue.from as TxOutputRef).outputIndex,
        nexts: [
            {
                instance: nextInstance,
                balance: finalBalance,
                atOutputIndex: 0,
            },
        ],
    });

  });

  const signer = await args.signer.getDefaultPubKey();

  const { tx } = await args.issue.methods.complete((sigResponses: any) => findSig(sigResponses, signer));

  const newIssue = Issue.fromTx(tx, 0);

  return [newIssue, tx];

}

export interface NewIssue {
    signer: Signer;
    organization: string
    repo: string
    title: string
    description: string
    owner: bsv.PublicKey
    assignee: bsv.PublicKey
    bounty: bigint
  }
  
  export async function createIssue(args: NewIssue): Promise<Issue> {
  
    const issue = Issue.create(Object.assign(args, {
      owner: args.owner.toString(),
      assignee: args.assignee.toString(),
    }));
  
    await issue.connect(args.signer);
  
    const baseSatoshi = 1;
  
    const deployTx = await issue.deploy(baseSatoshi + Number(args.bounty));
  
    console.log(`Issue contract deployed: ${deployTx.hash}`);
  
    return issue;
  }

  export async function getIssue({ txid }: { txid: string }): Promise<Issue | null> {

    try {

        const { data } = await axios.get(`https://www.pow.co/api/v1/issues/${txid}`);

        return data.issue as Issue;

    } catch (error) {

        return null;

    }

}
