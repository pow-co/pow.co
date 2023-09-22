import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ThreeColumnLayout from '../../components/ThreeColumnLayout'
import { useBitcoin } from '../../context/BitcoinContext'
import UserIcon from '../../components/UserIcon'
import Datepicker from "tailwind-datepicker-react"
import { useDropzone } from 'react-dropzone';
import { buf2hex } from '../../utils/file'

import { SmartContract, Scrypt, bsv } from "scrypt-ts";
import axios from "axios";
import useWallet from "../../hooks/useWallet";
import { useRouter } from "next/router";

import { Meeting } from "../../src/contracts/meeting";
import artifact from "../../artifacts/meeting.json";
import NewEventForm, { NewEvent } from '../../components/NewEventForm'
import Loader from '../../components/Loader'
import { useAPI } from '../../hooks/useAPI'
import { ScryptRanking } from '../issues'
import { getMeeting } from '../../services/meetings'
import EventCard from '../../components/EventCard'
import SimpleEventCard from '../../components/SimpleEventCard'

Meeting.loadArtifact(artifact);



const NewCalendarEventPage = () => {
    const router = useRouter()
    const wallet = useWallet()
    
    const handleSubmitEvent = async (newEvent: NewEvent) => {
        try {
    
            const { data } = await axios.post(`https://pow.co/api/v1/meetings/new`, {
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
            })
    
            const script = bsv.Script.fromASM(data.scriptASM)
    
            const tx = await wallet?.createTransaction({
                outputs: [
                    new bsv.Transaction.Output({
                        script,
                        satoshis: 10
                    })
                ]
            })
    
            if (!tx) { return }
    
            console.log('meeting.created', tx.hash)
    
            router.push(`/t/${tx.hash}`)
    
            console.log('meeting.new', data)
    
        } catch(error) {
    
            console.error(error)
    
        }
    }

  return (
    <ThreeColumnLayout>
        <div className='mt-5 sm:mt-10 min-h-screen'>
            <div className='flex flex-col bg-primary-100 dark:bg-primary-700/20 sm:rounded-xl py-5'>
                <h2 className='text-2xl text-center font-bold'>Create an event</h2>
                <NewEventForm onSubmit={handleSubmitEvent}/>
            </div>
          </div>
      </ThreeColumnLayout>

  );
};

export default NewCalendarEventPage;
