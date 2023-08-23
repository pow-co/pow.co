import React, { useEffect, useState } from 'react';
import bsv from 'bsv';
import { Issue } from '../src/contracts/issue';
import { toast } from 'react-hot-toast';
import useWallet from '../hooks/useWallet';
import { addBounty, addComment, assignIssue, completeIssue } from '../services/issues';
import { useRouter } from 'next/router';
import { TxOutputRef } from 'scrypt-ts';
import axios from 'axios';
import { parse } from 'path';


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

interface Comment {
  commenter: string;
  comment: string;
}

interface IssueCardProps {
  issue: Issue;
  onAddBounty: (issue: Issue) => Promise<void>;
  onLeaveComment: (issue: Issue) => Promise<void>;
  onMarkAsComplete: (issue: Issue) => Promise<void>;
  refresh: () => void;
  origin: any;
  methodCalls: any[];
}

const IssueCard: React.FC<IssueCardProps> = (props: {
    issue: Issue,
    onAddBounty: (issue: Issue) => Promise<void>,
    onLeaveComment: (issue: Issue) => Promise<void>,
    onMarkAsComplete: (issue: Issue) => Promise<void>,
    refresh: () => void,
    origin: any,
    methodCalls: any[],
}) => {
  const [isOwner, setIsOwner] = useState(false); // You can set this based on the user's public key

  const [addingBounty, setAddingBounty] = useState(false);
  const [satoshis, setSatoshis] = useState<number | null>(null);
  const [newBounty, setNewBounty] = useState<bigint>(BigInt(props.issue.balance -1));
  const [issue, setIssue] = useState<Issue>(props.issue);
  const [location, setLocation] = useState<string | null>((props.issue.from as TxOutputRef)?.tx?.hash);
  const [origin, setOrigin] = useState<string | null>(null);
  const [completionStatus, setCompletionStatus] = useState<'incomplete' | 'posting' | 'complete'>('incomplete');
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [assignPopupVisible, setAssignPopupVisible] = useState(false);
  const [publicKeyInput, setPublicKeyInput] = useState('');

  const handleAssignButtonClick = () => {
    setAssignPopupVisible(true);
  };

  const handleAssignSubmit = async () => {
    setAssigning(true);
    try {
      const assignee = new bsv.PublicKey(publicKeyInput);

      if (!wallet) { return }

      toast(`Assigning issue to ${publicKeyInput}...`, {
        icon: '⛏️',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });

      const [newIssue, tx] = await assignIssue({
        issue,
        assignee,
        signer: wallet.signer,
      });
          
    
    const result = await axios.get(`https://pow.co/api/v1/issues/${(newIssue.from as TxOutputRef)?.tx?.hash}`);

    toast(`Issue re-assigned`, {
      icon: '⛏️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    console.log({ result })
    setIssue(newIssue);
    setNewBounty(BigInt(newIssue.balance - 1));
    props.refresh();

    setAssignSuccess(true);
    setAssigning(false);
    setAssignPopupVisible(false);

    } catch (error) {
      
      console.error('Invalid public key', error);

      toast.error('Invalid public key or other error re-assigning');

      setAssigning(false);
    }
  };

const parseComments = (json: any) => {
  const _comments = json.methodCalls
    .filter((call: any) => call.method === 'addComment')
    .map((commentCall: any) => {
        console.log('commentCall', commentCall)
      return {
        comment: Buffer.from(commentCall.arguments.find((arg: any) => arg.name === 'comment').value, 'hex').toString('utf8'),
        commenter: commentCall.arguments.find((arg: any) => arg.name === 'commenter').value,
      }
    })

    console.log(_comments)

    setComments(_comments)

};
const {methodCalls} = props;

useEffect(() => {
  parseComments(props)  
}, [methodCalls])

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

    
    
    const result = await axios.get(`https://pow.co/api/v1/issues/${(newIssue.from as TxOutputRef)?.tx?.hash}`);
    console.log({ result })
    setIssue(newIssue);
    setNewBounty(BigInt(newIssue.balance - 1));
    props.refresh();

  };
  
  const handleMarkAsComplete = async () => {
    if (!wallet) return
    setCompletionStatus('posting');
    // Simulate async operation like posting a transaction
    // eslint-disable-next-line no-promise-executor-return
    const [newIssue, tx] = await completeIssue({ issue, signer: wallet.signer });
    const { data } = await axios.get(`https://pow.co/api/v1/issues/${(newIssue.from as TxOutputRef)?.tx?.hash}`);
    console.log('complete', data)
    setIssue(newIssue)
    props.refresh();
    setCompletionStatus('complete');
  };

  const handleAddCommentClick = () => {
    setCommentBoxVisible(true);
  };

  const handleCommentChange = (e: any) => {
    setNewComment(e.target.value);
  };

  const handlePostCommentClick = async () => {

    if (!wallet) return;
    try {
      toast.success('Posting new comment');

      const [newIssue, tx] = await addComment({
        issue,
        comment: newComment,
        signer: wallet.signer
    });

    
      
      const result = await axios.get(`https://pow.co/api/v1/issues/${tx.hash}`);
      console.log({ result })
      setIssue(newIssue);
      setNewBounty(BigInt(newIssue.balance - 1));
      props.refresh();

      // Assuming onLeaveComment is a function that posts the comment and returns the JSON response
      //const json = await onLeaveComment(issue, newComment);
      //parseComments(json);
      setNewComment('');
      setCommentBoxVisible(false);
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error(error)
      toast.error('Failed to post the comment');
    }
  };

  const title = Buffer.from(issue.title, 'hex').toString('utf8');
  const description = Buffer.from(issue.description, 'hex').toString('utf8');
  const organization = Buffer.from(issue.organization, 'hex').toString('utf8');
  const repo = Buffer.from(issue.repo, 'hex').toString('utf8');

  console.log('ORIGIN', props.origin)

  return (
    <div className="border p-4 rounded-md space-y-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{organization}/{repo}</p>
      <p>{description}</p>
      <p className="text-sm text-gray-400">Bounty: {newBounty.toString()}</p>
      <p className="text-sm text-gray-400">Location: {props.origin.location}</p>
      <p className="text-sm text-gray-400">Origin: {props.origin.origin}</p>
      
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

        {isOwner && !issue.closed && (
          <>
          <button onClick={handleAssignButtonClick} className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ${assigning ? 'animate-pulse' : ''}`}>
            {assigning ? 'Assigning...' : assignSuccess ? 'Assign Issue' : 'Assign Issue'}
          </button>
          {assignPopupVisible && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded shadow-lg">
                <label htmlFor="publicKey" className="block text-sm font-medium text-gray-600">Enter BSV Public Key:</label>
                <input type="text" id="publicKey" value={publicKeyInput} onChange={(e) => setPublicKeyInput(e.target.value)} className="mt-1 p-2 w-full border rounded-md"/>
                <button onClick={handleAssignSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                  Submit
                </button>
              </div>
            </div>
          )}
          </>
        )}

        <button onClick={handleAddCommentClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Comment
          </button>
          {commentBoxVisible && (
            <div className="space-y-2">
              <textarea value={newComment} onChange={handleCommentChange} className="resize border rounded-md w-full p-2"/>
              <button onClick={handlePostCommentClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Post Comment
              </button>
            </div>
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
      <div>
    <h3 className="text-xl font-bold">Comments:</h3>
    <ul className="list-inside list-decimal">
      {comments.map((comment, index) => (       
        <>
        <li key={index} className="text-base flex flex-column items-center space-x-4">
          
          <div>{comment.comment}</div>

        </li>

        <li key={index} className="text-base flex flex-column items-center space-x-4">
                  
        <div className="text-sm text-gray-500">{comment.commenter}</div>

        </li>
        </> 

      ))}
    </ul>
  </div>
    </div>
  );
};

export default IssueCard;
