import React, { useState } from 'react';
import { bsv } from 'scrypt-ts';
import { toast } from 'react-hot-toast';
import { Issue } from '../src/contracts/issue';

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
  refresh: () => void;
  methodCalls: any[];
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  refresh,
  methodCalls,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [commentText, setCommentText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Extract basic info
  const title = issue.title.toString();
  const description = issue.description.toString();
  // @ts-ignore
  const status = issue.status.toString();
  const submitterPubKey = issue.owner.toString();
  
  // Parse comments from method calls
  React.useEffect(() => {
    if (methodCalls) {
      const parsedComments = parseComments(methodCalls);
      setComments(parsedComments);
    }
  }, [methodCalls]);

  const handleAssignButtonClick = () => {
    setIsDialogOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!publicKey) {
      setErrorMessage('Public key is required');
      return;
    }

    try {
      // Logic to assign issue (would normally call onAssignIssue or similar)
      toast.success('Issue assigned successfully');
      setIsDialogOpen(false);
      setErrorMessage('');
      refresh(); // Refresh data
    } catch (error) {
      setErrorMessage('Error assigning issue');
      console.error(error);
    }
  };

  const parseComments = (methodCallsData: any) => {
    if (!methodCallsData) return [];
    
    // Filter method calls for comments and format them
    return methodCallsData
      .filter((call: any) => call.method === 'addComment')
      .map((call: any) => ({
          commenter: call.args[0] || 'Unknown',
          comment: call.args[1] || '',
        }));
  };

  // Generate hex color based on a string
  const generateColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += (`00${value.toString(16)}`).substr(-2);
    }
    
    return color;
  };

  const handleAddBountyClick = () => {
    // Implement bounty logic here
  };

  const handleMarkAsComplete = async () => {
    try {
      // Logic to mark as complete
      toast.success('Issue marked as complete');
      refresh(); // Refresh data
    } catch (error) {
      toast.error('Error updating issue status');
      console.error(error);
    }
  };

  const handleAddCommentClick = () => {
    setIsCommentDialogOpen(true);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handlePostCommentClick = async () => {
    try {
      // Logic to add comment
      toast.success('Comment added successfully');
      setCommentText('');
      setIsCommentDialogOpen(false);
      refresh(); // Refresh data
    } catch (error) {
      toast.error('Error adding comment');
      console.error(error);
    }
  };

  const getStatusClass = () => {
    if (status === 'open') return 'bg-green-100 text-green-800';
    if (status === 'assigned') return 'bg-yellow-100 text-yellow-800';
    if (status === 'closed') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="mb-4 overflow-hidden rounded-lg border">
      <div className="bg-white p-4 dark:bg-gray-800">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass()}`}>
            {status}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Created by: <span className="font-semibold">{submitterPubKey.substring(0, 10)}...</span>
          </p>
        </div>

        <p className="mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2">
          {status === 'open' && (
            <button
              type="button" 
              onClick={handleAssignButtonClick}
              className="rounded-md bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            >
              Assign
            </button>
          )}
          
          <button
            type="button"
            onClick={handleAddBountyClick}
            className="rounded-md bg-purple-500 px-3 py-1 text-white hover:bg-purple-600"
          >
            Add Bounty
          </button>
          
          {status === 'assigned' && (
            <button
              type="button"
              onClick={handleMarkAsComplete}
              className="rounded-md bg-green-500 px-3 py-1 text-white hover:bg-green-600"
            >
              Mark as Complete
            </button>
          )}
          
          <button
            type="button"
            onClick={handleAddCommentClick}
            className="rounded-md bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
          >
            Add Comment
          </button>
        </div>
      </div>
      
      {/* Comments section */}
      {comments.length > 0 && (
        <div className="bg-gray-50 p-4 dark:bg-gray-700">
          <h3 className="mb-2 text-lg font-medium">Comments</h3>
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <div key={index} className="rounded-md bg-white p-3 dark:bg-gray-800">
                <div className="mb-1 flex items-center">
                  <div 
                    className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: generateColor(comment.commenter) }}
                  >
                    {comment.commenter.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">
                    {comment.commenter.substring(0, 12)}...
                  </span>
                </div>
                <p className="text-sm">{comment.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Assign dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium">Assign Issue</h3>
            
            {errorMessage && (
              <div className="mb-4 rounded-md bg-red-100 p-2 text-red-800">
                {errorMessage}
              </div>
            )}
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">BSV Public Key</label>
              <input
                type="text"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="w-full rounded-md border p-2"
                placeholder="Enter public key"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setErrorMessage('');
                }}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignSubmit}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Comment dialog */}
      {isCommentDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium">Add Comment</h3>
            
            <div className="mb-4">
              <textarea
                value={commentText}
                onChange={handleCommentChange}
                className="h-32 w-full rounded-md border p-2"
                placeholder="Write your comment here..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => setIsCommentDialogOpen(false)}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePostCommentClick}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
