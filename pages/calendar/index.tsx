import React, { useEffect, useState } from "react";
import Meta from "../../components/Meta";
import ThreeColumnLayout from "../../components/ThreeColumnLayout";
import NewEventForm, { NewEvent } from "../../components/NewEventForm";
import axios from "axios";
import { bsv } from "scrypt-ts";
import useWallet from "../../hooks/useWallet";
import { useRouter } from "next/router";
import Loader from "../../components/Loader";
import { useAPI } from "../../hooks/useAPI";
import { ScryptRanking } from "../issues";
import { getMeeting } from "../../services/meetings";
import SimpleEventCard from "../../components/SimpleEventCard";
import Link from "next/link";


const RankedMeetingCard = ({origin, totaldifficulty}: ScryptRanking) => {
  const [cardLoading, setCardLoading] = useState(true)
  const [meeting, setMeeting] = useState<any | null>(null)
  const wallet = useWallet()

  const getMeetingData = () => {
      getMeeting({txid: origin}).then((data) => {
          console.log("MEETING DATA", data)
          setMeeting(data)
          setCardLoading(false)
      })
  }

  useEffect(() => {
      getMeetingData()
  },[origin])

  if (cardLoading){
    return (
      <div role="status" className="mb-1 p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
    <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
        </svg>
    </div>
    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    <div className="flex items-center mt-4 space-x-3">
       <svg className="w-10 h-10 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>
        <div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
            <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
    </div>
    <span className="sr-only">Loading...</span>
</div>
    )
  }

  return (
      <div className=''>
          <SimpleEventCard 
              title={meeting.title} 
              description={meeting.description}
              start={meeting.start}
              end={meeting.end}
              location={meeting.location}
              status={meeting.status}
              origin={origin}
              inviteRequired={meeting.inviteRequired}
              organizer={meeting.organizer}  
          />
      </div>
  )
}

const CalendarPage = () => {
  const router = useRouter()
  const [expandCreate, setExpandCreate] = useState(false)
  const wallet = useWallet()

  const { data, error, loading } = useAPI(`/boost/rankings/meetings`, "")

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

        router.push(`/${tx.hash}`)

        console.log('meeting.new', data)

    } catch(error) {

        console.error(error)

    }
  }
  return (
    <>
      <Meta
        title="Calendar | The Proof of Work Cooperative"
        description="People Coordinating Using Costly Signals"
        image="https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557"
      />
      <ThreeColumnLayout>
        <div className="mt-5 sm:mt-10">
          <div className="hidden lg:blockbg-primary-100 dark:bg-primary-600/20 rounded-lg p-5">
            <div onClick={() => setExpandCreate(!expandCreate)} className="flex justify-between cursor-pointer">
              <h2 className="text-2xl font-bold">Create Event</h2>
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
            {expandCreate && <NewEventForm onSubmit={handleSubmitEvent}/>}
          </div>
          <div className="col-span-12 min-h-screen lg:col-span-6">
            <div className='my-5 lg:my-10'>
              {loading && <Loader />}
              {rankings?.map((rankedMeeting: ScryptRanking) => (
                <RankedMeetingCard key={rankedMeeting.origin} origin={rankedMeeting.origin} totaldifficulty={rankedMeeting.totaldifficulty} />
              ))}
              {!loading && rankings.length === 0 && (<div className='text-center'>
                    <p className='text-5xl'>😢</p>
                    <p className='text-lg mt-5'>Nothing there yet.</p>
                </div>)}
            </div>
          </div>
        </div>
        <Link href="/calendar/new">
            <div className="fixed bottom-[73px] right-[14px] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-primary-400 to-primary-500 lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>

            </div>
        </Link>
      </ThreeColumnLayout>
    </>
  );
};

export default CalendarPage;
