import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { bsv } from "scrypt-ts";
import useSWR from 'swr';
import axios from 'axios';
import ThreeColumnLayout from "../../components/ThreeColumnLayout";

import { Issue } from "../../src/contracts/issue";
import artifact from "../../artifacts/issue.json";
import IssueCard from "../../components/IssueCard";
import { fetchTransaction } from "../../services/whatsonchain";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function useIssue(origin: string) {
  const url = `https://www.pow.co/api/v1/issues/${origin}`;
  console.log({ url });
  const { data, error, mutate } = useSWR(url, fetcher);

  return {
    origin: data?.origin,
    methodCalls: data?.methodCalls,
    isLoading: !error && !data,
    isError: error,
    refresh: () => mutate(), // Refresh function
  };
}

Issue.loadArtifact(artifact);

const IssuePage = () => {
    const [issue, setIssue] = useState<Issue | null>(null);    

    const router = useRouter();

    let txid = String(router.query.txid);

    if (!txid.match('_')) {
      txid = `${txid}_0`;
    }

    const { origin, methodCalls, refresh } = useIssue(txid);

    if (origin) {
      console.log('origin', origin);
    }

    if (methodCalls) {
      console.log('methodCalls', methodCalls);
    }

    console.log({ refresh });

    useEffect(() => {
      if (!origin) { return; }

      const [txid, vout] = (origin.location as string).split('_');

      fetchTransaction({ txid }).then((tx: bsv.Transaction) => {
        const issue = Issue.fromTx(tx, vout ? parseInt(vout, 10) : 0);
        console.log('issue', issue);
        setIssue(issue);
      }).catch(console.error);
    }, [origin]);

    if (!issue) {
      return (
        <ThreeColumnLayout>
          <div className="space-y-2 rounded-md border p-4">
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
          refresh={refresh}
          methodCalls={methodCalls}
        />
      </ThreeColumnLayout>
    );
};

export default IssuePage;
