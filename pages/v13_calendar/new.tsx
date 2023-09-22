'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ThreeColumnLayout from '../../components/v13_ThreeColumnLayout'
import { useBitcoin } from '../../context/BitcoinContext'
import UserIcon from '../../components/UserIcon'
import Datepicker from "tailwind-datepicker-react"
import { useDropzone } from 'react-dropzone';
import { buf2hex } from '../../utils/file'
import toast from "react-hot-toast"
import { SmartContract, Scrypt, bsv, toByteString, PubKey, HashedSet } from "scrypt-ts";
import axios from "axios";
import useWallet from "../../hooks/v13_useWallet";
import { useRouter } from "next/navigation";

import { Meeting } from "../../src/contracts/meeting";
import artifact from "../../artifacts/meeting.json";
import NewEventForm, { NewEvent } from '../../components/v13_NewEventForm'
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
        if (!wallet) {
      
            toast("Error No Wallet Connected", {
              icon: "📛",
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
            
            return
            
        }
        try {
            
            const meeting = new Meeting(
                toByteString(newEvent.title, true),
                toByteString(newEvent.description!, true),
                BigInt(newEvent.start),
                BigInt(newEvent.end!),
                toByteString(newEvent.location!, true),
                toByteString(newEvent.url!, true),
                toByteString(newEvent.status!, true),
                PubKey(toByteString(wallet!.publicKey!.toString())),
                new HashedSet<PubKey>(),
                new HashedSet<PubKey>(),
                newEvent.inviteRequired
            )

            await meeting.connect(wallet.signer)

            const result = await meeting.deploy(10)

            console.log(result)

            console.log('meeting.created', result.hash)

            router.push(`/events/${result.hash}`)
    
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
