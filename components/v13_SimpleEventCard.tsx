'use client'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect} from 'react'
import useWallet from '../hooks/v13_useWallet';
import { CalendarEventOperator } from '../services/calendar_event_operator';

interface MeetingCardProps {
    title: string;
    description?: string;
    start: number;
    end?: number;
    location?: string;
    status?: string; 
    origin: string;
    inviteRequired: boolean;
    organizer: string;
    txid: string;
}
const SimpleEventCard = (meeting: MeetingCardProps) => {
    const router = useRouter()
    const [contractOperator, setContractOperator] = useState<CalendarEventOperator | null>(null)
    const wallet = useWallet()

    useEffect(() => {
        console.log("meeting data", meeting)
    CalendarEventOperator.load({ origin: meeting.origin, signer: wallet!.signer }).then(setContractOperator)
    },[wallet])

    useEffect(() => {
        contractOperator && console.log("contract operator loaded", contractOperator)
    },[])

    const handleAttend = (e:any) => {
        e.preventDefault()
        attend()
    }

    const attend = async () => {
        
    }

    const navigate = (e:any) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/events/${meeting.txid}`)
    }
  return (
    <div className="mt-2 bg-primary-100 dark:bg-primary-600/20 border rounded shadow-md">
        <div onClick={navigate} className="cursor-pointer select-none flex bg-primary-500 text-white p-4 rounded-t mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
            </svg>
            <h2 className="ml-4 text-xl font-semibold">{meeting.title}</h2>
            </div>
            <div className="p-2">
            <p className="opacity-70 mb-2">{meeting.description}</p>
            <div className="mb-2">
                <span className="font-semibold">Start:</span> {new Date(meeting.start).toLocaleString()}
            </div>
            {meeting.end && <div className="mb-2">
                <span className="font-semibold">End:</span> {new Date(meeting.end).toLocaleString()}
            </div>}
            <div className="mb-2">
                <span className="font-semibold">Location:</span> {meeting.location}
            </div>
            <div className="mb-2">
                <span className="font-semibold">Status:</span> {meeting.status}
            </div>
            <a href={`/meet/${meeting.origin}`} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline mb-2 block">
                Event Link
            </a>
            <div className="mb-2">
                <span className="font-semibold">Invite Required:</span> {meeting.inviteRequired ? 'Yes' : 'No'}
            </div>
            <div className="mb-2 truncate">
                <span className="font-semibold">Organizer:</span> {meeting.organizer}
            </div>
            <div className='flex justify-end'>
                <button onClick={handleAttend} className="px-5 py-3 bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer text-white font-semibold rounded-lg transition duration-500 transform hover:-translate-y-1 hover:disabled:translate-y-0 disabled:opacity-60 disabled:cursor-default">Attend (RSVP)</button>
            </div>
        </div>
    </div>
  )
}

export default SimpleEventCard