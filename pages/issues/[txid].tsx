import React, { useEffect, useState } from "react";
import ThreeColumnLayout from "../../components/ThreeColumnLayout";

import { Issue } from "../../src/contracts/issue";
import artifact from "../../artifacts/issue.json";
import IssueCard from "../../components/IssueCard";
import { fetchTransaction } from "../../services/whatsonchain";
import {useRouter} from "next/router";
import { bsv } from "scrypt-ts";

import useSWR from 'swr';
import axios from 'axios';
import { getIssue } from "../../services/issues";
import Loader from "../../components/Loader";

const IssuePage = () => {
    const router = useRouter()
    const query = router.query
    const [issueData, setIssueData] = useState<any | null>(null);    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      query.txid && getIssue({txid: query.txid!.toString()}).then((data) => {
          console.log("issue data", data)
          setIssueData(data)
          setLoading(false)
       })
  },[query])

  

    return (
  
      <ThreeColumnLayout>
        <div className="min-h-screen py-5 sm:py-10">
          {loading ? <Loader/> : <IssueCard methodCalls={issueData.methodCalls} title={issueData.contract.title} description={issueData.contract.description} repo={issueData.contract.repo} organization={issueData.contract.organization} owner={issueData.contract.owner} assignee={issueData.contract.assignee} closed={issueData.contract.closed} completed={issueData.contract.closed} origin={issueData.origin.origin} location={issueData.origin.location} txid={issueData.origin.txid}  />}
        
        </div>

      </ThreeColumnLayout>
    )
};

export default IssuePage;
