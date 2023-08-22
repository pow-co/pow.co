import React, { useEffect, useState } from 'react';
import bsv from 'bsv';
import { Issue } from '../src/contracts/issue';
import { toast } from 'react-hot-toast';
import useWallet from '../hooks/useWallet';
import { addBounty, completeIssue } from '../services/issues';
import { useRouter } from 'next/router';
import { TxOutputRef } from 'scrypt-ts';


export interface Signer {
  // Define the properties of the Signer interface as per your requirement
}

export interface NewIssue {
  signer: Signer;
  organization: string;
  repo: string;
  title: string;
  description: string;
  owner: bsv.PublicKey;
  assignee: bsv.PublicKey;
}

interface IssueCardProps {
  issue: Issue;
  onAddBounty: (issue: Issue) => Promise<void>;
  onLeaveComment: (issue: Issue) => Promise<void>;
  onMarkAsComplete: (issue: Issue) => Promise<void>;
}

const IssueCard: React.FC<IssueCardProps> = (props: {
    issue: Issue,
    onAddBounty: (issue: Issue) => Promise<void>,
    onLeaveComment: (issue: Issue) => Promise<void>,
    onMarkAsComplete: (issue: Issue) => Promise<void>,
}) => {
  const [isOwner, setIsOwner] = useState(false); // You can set this based on the user's public key

  const [addingBounty, setAddingBounty] = useState(false);
  const [satoshis, setSatoshis] = useState<number | null>(null);
  const [newBounty, setNewBounty] = useState<bigint>(BigInt(props.issue.balance -1));
  const [issue, setIssue] = useState<Issue>(props.issue);
  const [location, setLocation] = useState<string | null>((props.issue.from as TxOutputRef)?.tx?.hash);
  const [origin, setOrigin] = useState<string | null>(null);
  const [completionStatus, setCompletionStatus] = useState<'incomplete' | 'posting' | 'complete'>('incomplete');

    const router = useRouter();

  const wallet = useWallet()

  const handleAddBountyClick = () => {
    setAddingBounty(true);
  };

  useEffect(() => {
    
    setIsOwner(wallet?.publicKey?.toString() === issue.owner?.toString());

  }, [issue]);

  const handleConfirmClick = async () => {
    if (!wallet) return;
    setAddingBounty(false);
    const addedBounty = BigInt(Number(satoshis));

        toast(`Adding ${satoshis} satoshis to the bounty...`, {
          icon: '⛏️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });

        await issue.connect(wallet.signer)

        console.log('signer', wallet.signer)

    const [newIssue, tx] = await addBounty({
        satoshis: addedBounty,
        signer: wallet.signer,
        issue,
    });

    setIssue(newIssue);
    setNewBounty(BigInt(newIssue.balance));
    router.push(`/issues/${(newIssue.from as TxOutputRef)?.tx?.hash}`);

  };
  
  const handleMarkAsComplete = async () => {
    if (!wallet) return
    setCompletionStatus('posting');
    // Simulate async operation like posting a transaction
    // eslint-disable-next-line no-promise-executor-return
    const [newIssue, tx] = await completeIssue({ issue, signer: wallet.signer });
    setIssue(newIssue)
    setCompletionStatus('complete');
  };


  const title = Buffer.from(issue.title, 'hex').toString('utf8');
  const description = Buffer.from(issue.description, 'hex').toString('utf8');
  const organization = Buffer.from(issue.organization, 'hex').toString('utf8');
  const repo = Buffer.from(issue.repo, 'hex').toString('utf8');

  return (
    <div className="border p-4 rounded-md space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{organization}/{repo}</p>
      <p>{description}</p>
      <p className="text-sm text-gray-400">Bounty: {newBounty.toString()}</p>
      <p className="text-sm text-gray-400">Location: {(issue.from as TxOutputRef)?.tx?.hash}</p>
      
      <div className="space-x-2">
        
        {addingBounty ? (
          <div className="flex space-x-2">
            <input type="number" onChange={(e) => setSatoshis(Number(e.target.value))} className="border p-2 rounded" placeholder="Enter Satoshis" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConfirmClick}>Confirm</button>
          </div>
        ) : (
            (!issue.closed && (
<button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddBountyClick}>Add Bounty</button>
            ))
          
        )}


        {!issue.closed && (

            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => props.onLeaveComment(issue)}>Leave Comment</button>
        )}
        {isOwner && !issue.closed && (
        <button
        className={`px-4 py-2 rounded transition-all ease-in-out duration-300 ${
          completionStatus === 'incomplete'
            ? 'bg-red-500 text-white'
            : completionStatus === 'posting'
            ? 'bg-yellow-500 text-white opacity-50'
            : 'bg-green-500 text-white'
        }`}
        onClick={handleMarkAsComplete}
        disabled={completionStatus !== 'incomplete'}
      >
        {completionStatus === 'complete' ? 'Complete ✔️' : completionStatus === 'posting' ? 'Posting Tx' : 'Mark as Complete'}
      </button>
      
        )}

        {issue.closed && (
            <button className={`px-4 py-2 rounded transition-all ease-in-out duration-300 bg-green-500 text-white`}>

                Complete ✔️
            </button>
        )}
        

      </div>
    </div>
  );
};

export default IssueCard;
