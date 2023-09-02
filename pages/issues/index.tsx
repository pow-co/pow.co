import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Meta from '../../components/Meta'
import ThreeColumnLayout from '../../components/ThreeColumnLayout'
import { useAPI } from '../../hooks/useAPI'
import Loader from '../../components/Loader'
import IssueCard from '../../components/IssueCard'
import { addBounty, getIssue } from '../../services/issues'
import { Issue } from '@/contracts/issue'
import useWallet from '../../hooks/useWallet'
import NewIssueForm from '../../components/NewIssueForm'
import { NewIssue, createIssue } from "../../services/issues";
import { TxOutputRef, bsv } from 'scrypt-ts'
import { useRouter } from 'next/router'

export interface ScryptRanking {
    origin: string;
    totaldifficulty: number;
}

const RankedIssueCard = ({origin, totaldifficulty}: ScryptRanking) => {
    const [issue, setIssue] = useState<Issue | null>(null)
    const wallet = useWallet()


    const getIssueData = () => {
        getIssue({txid: origin}).then((data) => {
            console.log(data)
            setIssue(data)
         })
    }

    useEffect(() => {
         getIssueData()
    },[origin])

    const handleRefresh = () => {
        getIssueData()
    }

    const handleAddBounty = async (issue: Issue) => {
        const [newIssue, tx ] = await addBounty({
            issue: issue,
            satoshis: 0n,
            signer: wallet!.signer
        })
    }

    const handleComment = async (issue: Issue) => {

    }

    const handleComplete = async (issue: Issue) => {

    }
    return (
        <div className=''>
            <IssueCard origin={origin} refresh={handleRefresh} methodCalls={[]} issue={issue!} onAddBounty={handleAddBounty} onLeaveComment={handleComment} onMarkAsComplete={handleComplete}/>
        </div>
    )
}

const IssuesPage = () => {
    const router = useRouter()
    const [expandCreate, setExpandCreate] = useState(false)
    const { data, error, loading } = useAPI(`/boost/rankings/issues`, "")
    const wallet = useWallet()

    if (error) {
        return (
          <ThreeColumnLayout>
            <div className='h-screen'>
             <p>
                Error, something happened
            </p>   
            </div>
          </ThreeColumnLayout>
        );
    }
    const { rankings } = data || []

    const handleSubmitIssue = async (newIssue: any) => {
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

    }

  return (
    <>
    <Meta title='Issues | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
        <div className='mt-5 sm:mt-10'>
            <div className='hidden lg:block bg-primary-100 dark:bg-primary-600/20 rounded-lg p-5'>
                <div onClick={() => setExpandCreate(!expandCreate)} className='flex justify-between cursor-pointer'>
                    <h2 className='text-2xl font-bold'>Create Issue</h2>
                    {expandCreate ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>                      
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    )}
                </div>
                {expandCreate && <NewIssueForm onSubmit={handleSubmitIssue}/>}
            </div>
        </div>
        <div className="col-span-12 min-h-screen lg:col-span-6">
            <div className='my-5 lg:my-10'>
                {loading && <Loader/>} 
                {rankings?.map((rankedIssue: ScryptRanking) => {
                    return <RankedIssueCard key={rankedIssue.origin} origin={rankedIssue.origin} totaldifficulty={rankedIssue.totaldifficulty} />
                }
                )}
                {!loading && rankings.length === 0 && (<div className='text-center'>
                    <p className='text-5xl'>😢</p>
                    <p className='text-lg mt-5'>Nothing there yet.</p>
                </div>)}
            </div>
                
        </div>
        <Link href="/issues/new">
            <div className="fixed bottom-[73px] right-[14px] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-primary-400 to-primary-500 lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
                </svg>
            </div>
        </Link>
    </ThreeColumnLayout>
    
    
    </>
  )
}

export default IssuesPage