import React, { useState } from 'react';
import bsv from 'bsv';

export interface Signer {
  // Define the properties of the Signer interface as per your requirement
}

export interface NewIssue {
  organization: string;
  repo: string;
  title: string;
  description: string;
  bounty: bigint;
}

interface NewIssueFormProps {
  onSubmit: (issue: NewIssue) => void;
}

const NewIssueForm: React.FC<NewIssueFormProps> = ({ onSubmit }) => {
  const [organization, setOrganization] = useState('');
  const [repo, setRepo] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bounty, setBounty] = useState('');

  const handleSubmit = () => {
    const newIssue: NewIssue = {
      organization,
      repo,
      title,
      description,
      bounty: BigInt(bounty),
    };

    onSubmit(newIssue);
  };

  return (
    <div className="border p-4 rounded-md space-y-2">
      <h2 className="text-xl font-bold">Create New Issue</h2>
      <input type="text" onChange={(e) => setOrganization(e.target.value)} className="border p-2 w-full rounded" placeholder="Organization" />
      <input type="text" onChange={(e) => setRepo(e.target.value)} className="border p-2 w-full rounded" placeholder="Repository" />
      <input type="text" onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full rounded" placeholder="Title" />
      <textarea onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full rounded" placeholder="Description"></textarea>
      <input type="number" onChange={(e) => setBounty(e.target.value)} className="border p-2 w-full rounded" placeholder="Bounty in Satoshis" />
      <button  className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default NewIssueForm;
