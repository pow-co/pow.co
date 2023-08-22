import React, { useEffect, useState } from "react";
import ThreeColumnLayout from "../../components/ThreeColumnLayout";

import { Issue } from "../../src/contracts/issue";
import artifact from "../../artifacts/issue.json";
import NewIssueForm from "../../components/NewIssueForm";

import useWallet from '../../hooks/useWallet';
import { NewIssue, createIssue } from "../../services/issues";
import { TxOutputRef, bsv } from "scrypt-ts";
import { useRouter } from "next/router";

const IssuePage = () => {

    const [issue, setIssue] = useState<Issue | null>(null);

    const router = useRouter();

    const wallet = useWallet();

    const onSubmit = async (newIssue: any) => {

        if (!wallet) return;

        console.log("SUBMIT ISSUE", newIssue)

        const created = await createIssue({
            signer: wallet.signer,
            organization: newIssue.organization,
            repo: newIssue.repo,
            title: newIssue.title,
            description: newIssue.description,
            owner: wallet.publicKey as bsv.PublicKey,
            assignee: wallet.publicKey as bsv.PublicKey,
            bounty: newIssue.bounty,
        })

        console.log('issue.created', created)

        router.push(`/issues/${(created.from as TxOutputRef)?.tx?.hash}`)

        setIssue(created);
        // Logic to add bounty goes here        
    }

    return (
  
      <ThreeColumnLayout>

        <NewIssueForm onSubmit={onSubmit} />

      </ThreeColumnLayout>
    )
};

export default IssuePage;
