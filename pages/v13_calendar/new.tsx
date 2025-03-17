'use client';

import React from 'react';
import { bsv } from "scrypt-ts";
import axios from "axios";
import { useRouter } from "next/navigation";
import useWallet from "../../hooks/v13_useWallet";
import ThreeColumnLayout from '../../components/v13_ThreeColumnLayout';

import { Meeting } from "../../src/contracts/meeting";
import artifact from "../../artifacts/meeting.json";
import NewEventForm, { NewEvent } from '../../components/v13_NewEventForm';

Meeting.loadArtifact(artifact);

const NewCalendarEventPage = () => {
    const router = useRouter();
    const wallet = useWallet();
    
    const handleSubmitEvent = async (newEvent: NewEvent) => {
        try {
    
            const { data } = await axios.post(`https://www.pow.co/api/v1/meetings/new`, {
                title: newEvent.title,
                description: newEvent.description,
                start: newEvent.start,
                end: newEvent.end,
                owner: newEvent.owner,
                organizer: newEvent.organizer,
                url: newEvent.url,
                status: newEvent.status,
                location: newEvent.location,
                inviteRequired: newEvent.inviteRequired,
            });
    
            const script = bsv.Script.fromASM(data.scriptASM);
    
            const tx = await wallet?.createTransaction({
                outputs: [
                    new bsv.Transaction.Output({
                        script,
                        satoshis: 10,
                    }),
                ],
            });
    
            if (!tx) { return; }
    
            console.log('meeting.created', tx.hash);
    
            router.push(`/events/${tx.hash}`);
    
            console.log('meeting.new', data);
    
        } catch (error) {
    
            console.error(error);
    
        }
    };

  return (
    <ThreeColumnLayout>
        <div className="mt-5 min-h-screen sm:mt-10">
            <div className="flex flex-col bg-primary-100 py-5 dark:bg-primary-700/20 sm:rounded-xl">
                <h2 className="text-center text-2xl font-bold">Create an event</h2>
                <NewEventForm onSubmit={handleSubmitEvent} />
            </div>
        </div>
    </ThreeColumnLayout>

  );
};

export default NewCalendarEventPage;
