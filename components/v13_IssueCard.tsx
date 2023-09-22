'use client'
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IssueOperator } from "../services/issue_operator";
import useWallet from "../hooks/v13_useWallet";

interface IssueCardProps {
  methodCalls: any[];
  title: string;
  description: string;
  repo: string;
  organization: string;
  owner: string;
  assignee: string;
  closed: boolean;
  completed: boolean;
  origin: string;
  location: string;
  txid: string;
}

interface Comment {
  commenter: string;
  comment: string;
}

const IssueCard = (issue: IssueCardProps) => {
  const router = useRouter()
  const [contractOperator, setContractOperator] = useState<IssueOperator | null>(null)
  const wallet = useWallet()
  const [addingBounty, setAddingBounty] = useState(false);
  const [satoshis, setSatoshis] = useState<number | null>(null);
  const [newBounty, setNewBounty] = useState<bigint>(0n);
  const [assignPopupVisible, setAssignPopupVisible] = useState(false);
  const isOwner = useMemo(() => wallet?.publicKey!.toString() === issue.owner, [wallet])
  const [assigning, setAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [publicKeyInput, setPublicKeyInput] = useState('');
  const [completionStatus, setCompletionStatus] = useState<'incomplete' | 'posting' | 'complete'>('incomplete');
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

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

  useEffect(() => {
    parseComments({methodCalls: issue.methodCalls})
  },[])


  useEffect(() => {
    IssueOperator.load({origin: issue.origin, signer: wallet!.signer }).then(setContractOperator)
  },[wallet])

  useEffect(() => {
    contractOperator && console.log("contract operator loaded", contractOperator)
},[])

  const handleAddBounty = (e:any) => {
    e.preventDefault()
    addBounty()
  }
  const addBounty =  async() => {

  }

  const handleAddBountyClick = () => {
    setAddingBounty(true);
  };

  const handleAssign = (e:any) => {
    e.preventDefault()
    assign()
  }

  const assign = async () => {

  }

  const handleAssignButtonClick = () => {
    setAssignPopupVisible(true);
  };

  const handleAddCommentClick = () => {
    setCommentBoxVisible(true);
  };

  const handleCommentChange = (e: any) => {
    setNewComment(e.target.value);
  };

  const handleComment = (e:any) => {
    e.preventDefault()
    comment()
  }

  const comment = async() => {

  }

  const handleComplete = (e:any) => {
    e.preventDefault()
    complete()
  }

  const complete = async () => {

  }

  const navigate = (e:any) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/issues/${issue.origin}`)
  }

  return (
    <div className="border border-primary-500 rounded-md space-y-2">
      <Link href={`/issues/${issue.txid}`}>
        <h2 className="text-white cursor-pointer bg-primary-500 p-4 text-xl font-bold">
          {issue.title}
        </h2>
      </Link>
      <div className="p-4">
        <p className="text-gray-600">
          {issue.organization}/{issue.repo}
        </p>
        <p>{issue.description}</p>
        <p className="text-sm font-semibold">
          Bounty:{" "}
          <span className="text-xl font-bold text-primary-500">
            {newBounty.toString()} sats
          </span>
        </p>
        <p className="text-sm opacity-60 whitespace-pre-line break-words">
          Location:{" "}
          <a
            className="hover:underline"
            href={`https://whatsonchain.com/tx/${issue.location?.split("_")[0]}`}
            target="_blank"
            rel="noreferrer"
          >
            {issue.location}
          </a>
        </p>
        <p className="text-sm opacity-60 whitespace-pre-line break-words">
          Origin:{" "}
          <a
            className="hover:underline"
            href={`https://whatsonchain.com/tx/${issue.origin?.split("_")[0]}`}
            target="_blank"
            rel="noreferrer"
          >
            {issue.origin}
          </a>
        </p>

        <div className="space-x-2">
          {addingBounty ? (
            <div className="flex space-x-2">
              <input
                type="number"
                onChange={(e) => setSatoshis(Number(e.target.value))}
                className="border p-2 rounded"
                placeholder="Enter Satoshis"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddBounty}
              >
                Confirm
              </button>
            </div>
          ) : (
            !issue.closed && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddBountyClick}
              >
                Add Bounty
              </button>
            )
          )}

          {isOwner && !issue.closed && (
            <>
              <button
                onClick={handleAssignButtonClick}
                className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ${
                  assigning ? "animate-pulse" : ""
                }`}
              >
                {assigning
                  ? "Assigning..."
                  : assignSuccess
                  ? "Assign Issue"
                  : "Assign Issue"}
              </button>
              {assignPopupVisible && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-4 rounded shadow-lg">
                    <label
                      htmlFor="publicKey"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Enter BSV Public Key:
                    </label>
                    <input
                      type="text"
                      id="publicKey"
                      value={publicKeyInput}
                      onChange={(e) => setPublicKeyInput(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                    <button
                      onClick={handleAssign}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            onClick={handleAddCommentClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Comment
          </button>
          {commentBoxVisible && (
            <div className="space-y-2">
              <textarea
                value={newComment}
                onChange={handleCommentChange}
                className="resize border rounded-md w-full p-2"
              />
              <button
                onClick={handleComment}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Post Comment
              </button>
            </div>
          )}
          {isOwner && !issue.closed && (
            <button
              className={`px-4 py-2 rounded transition-all ease-in-out duration-300 ${
                completionStatus === "incomplete"
                  ? "bg-red-500 text-white"
                  : completionStatus === "posting"
                  ? "bg-yellow-500 text-white opacity-50"
                  : "bg-green-500 text-white"
              }`}
              onClick={handleComplete}
              disabled={completionStatus !== "incomplete"}
            >
              {completionStatus === "complete"
                ? "Complete ✔️"
                : completionStatus === "posting"
                ? "Posting Tx"
                : "Mark as Complete"}
            </button>
          )}

          {issue.closed && (
            <button
              className={`px-4 py-2 rounded transition-all ease-in-out duration-300 bg-green-500 text-white`}
            >
              Complete ✔️
            </button>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold">Comments:</h3>
          <ul className="list-inside list-decimal">
            {comments.map((comment, index) => (
              <>
                <li
                  key={index}
                  className="text-base flex flex-column items-center space-x-4"
                >
                  <div>{comment.comment}</div>
                </li>

                <li
                  key={index}
                  className="text-base flex flex-column items-center space-x-4"
                >
                  <div className="text-sm text-gray-500">{comment.commenter}</div>
                </li>
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default IssueCard;
