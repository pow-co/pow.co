import React, { useEffect, useState } from "react";
import ThreeColumnLayout from "../../components/ThreeColumnLayout";

import { Issue } from "../../src/contracts/issue";
import artifact from "../../artifacts/issue.json";
import IssueCard, { NewIssue } from "../../components/IssueCard";
import { fetchTransaction } from "../../services/whatsonchain";
import {useRouter} from "next/router";
import { bsv } from "scrypt-ts";

Issue.loadArtifact(artifact);

const IssuePage = () => {
    const [issue, setIssue] = useState<Issue | null>(null);    

    async function onAddBounty(issue: Issue) {
      // Logic to add bounty goes here
    }

    async function onLeaveComment(issue: Issue) {
      // Logic to leave comment goes here
    }

    async function onMarkAsComplete(issue: Issue) {
      // Logic to mark as complete goes here
    }

    const router = useRouter();

    useEffect(() => {

      console.log("router.query", router.query)

      if (!router.query.txid) return;

      fetchTransaction({ txid: router.query.txid as string }).then((tx: bsv.Transaction) => {

        console.log('tx', tx);

        const issue = Issue.fromTx(tx, 0);

        setIssue(issue);

      });

    }, [router.query.txid]);

    if (!issue) {
      return (
        <ThreeColumnLayout>
          <div className="border p-4 rounded-md space-y-2">
            <h2 className="text-xl font-bold">Loading...</h2>
          </div>
        </ThreeColumnLayout>
      );
    }

    console.log('issue', issue);

    return (
  
      <ThreeColumnLayout>

        <IssueCard
          issue={issue}
          onAddBounty={onAddBounty}
          onLeaveComment={onLeaveComment}
          onMarkAsComplete={onMarkAsComplete}          
        />

      </ThreeColumnLayout>
    )
};

export default IssuePage;
