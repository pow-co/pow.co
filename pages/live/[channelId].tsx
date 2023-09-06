import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import PanelLayout from '../../components/PanelLayout'
import { useRelay } from '../../context/RelayContext'
import { sendMessage } from '../../utils/bsocial/message'
import { useTokenMeetLiveWebsocket } from '../../hooks/useWebsocket'
import { Socket } from 'socket.io-client/build/esm/socket';
import { MessageItem } from '../../components/MessageItem'
import Script from 'next/script'
import useSWR from "swr"
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { SideChat } from '../../components/SideChat'

import ReactPlayer from 'react-player'

const MINIMUM_POWCO_BALANCE = 1

const events = [
    'cameraError',
    'avatarChanged',
    'audioAvailabilityChanged',
    'audioMuteStatusChanged',
    'breakoutRoomsUpdated',
    'browserSupport',
    'contentSharingParticipantsChanged',
    'dataChannelOpened',
    'endpointTextMessageReceived',
    'faceLandmarkDetected',
    'errorOccurred',
    'knockingParticipant',
    'largeVideoChanged',
    'log',
    'micError',
    'screenSharingStatusChanged',
    'dominantSpeakerChanged',
    'raiseHandUpdated',
    'tileViewChanged',
    'chatUpdated',
    'incomingMessage',
    'mouseEnter',
    'mouseLeave',
    'mouseMove',
    'toolbarButtonClicked',
    'outgoingMessage',
    'displayNameChange',
    'deviceListChanged',
    'emailChange',
    'feedbackSubmitted',
    'filmstripDisplayChanged',
    'moderationStatusChanged',
    'moderationParticipantApproved',
    'moderationParticipantRejected',
    'participantJoined',
    'participantKickedOut',
    'participantLeft',
    'participantRoleChanged',
    'participantsPaneToggled',
    'passwordRequired',
    'videoConferenceJoined',
    'videoConferenceLeft',
    'videoAvailabilityChanged',
    'videoMuteStatusChanged',
    'videoQualityChanged',
    'readyToClose',
    'recordingLinkAvailable',
    'recordingStatusChanged',
    'subjectChange',
    'suspendDetected',
    'peerConnectionFailure'
]

export interface Livestream {
    liveapi_data: {
      _id: string;
      enabled: boolean;
      ingest: {
          server: string;
          key: string;
      },
      playback: {
          embed_url: string;
          embed_audio_url: string;
          hls_url: string;
      },
      platforms: [],
      settings: {
          pulling_mode: {}
      },
      user: string;
      environment: string;
      organization: string;
      creation_time: string;
  }
}

export default function MeetingPage() {

    const { query } = useRouter()

    const { relayxAuthenticate, relayxAuthenticated, relayxPaymail, relayxAuthToken } = useRelay()

    const [livestream, setLivestream] = useState<Livestream | null>(null)

    const defaultRoom = "powco"
    const room: string = query.channelId ? query.channelId.toString() : defaultRoom

    const login = (e: any) => {
        e.preventDefault()
        relayxAuthenticate()
    }

    useEffect(() => {

      if (!livestream) {

        getLivestream({ channel: room }).then(setLivestream)

      }

    }, [])

  return (
    <PanelLayout>
        {relayxAuthenticated ? <div className='grid grid-cols-12 w-full h-full'>
            <div className='col-span-12 xl:col-span-8 xl:pr-4'>
                { livestream && (
                    <LiveStream room={room} hls_url={livestream.liveapi_data.playback.hls_url}/>
                )}
                
                <h2 className='p-5 text-xl text-center font-bold '>#{room} Live Stream</h2>
            </div>
            <div className='col-span-12 xl:col-span-4 '>
                <div className='center'>
                    <h3 className='p-3 text-lg font-bold flex items-center'>Live Chat in {room}</h3>
                    <SideChat room={room.toString()} />
                </div>
            </div>
        </div> : (<div className='mt-10 flex flex-col justify-center items-center'>
                <p className='text-3xl font-bold'>You need to be logged in to access this page</p>
                <div
                    //onClick={()=>setWalletPopupOpen(true)}
                    onClick={login}
                    className='mt-10 flex ml-4 p-5 transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-500 to-primary-600  justify-center items-center cursor-pointer relative'>
                    <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                    <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white">
                    </path>
                    </svg>
                    <span className='ml-4'><FormattedMessage id="Connect wallet"/></span>
                </div>
            </div>)}
    </PanelLayout>
  )
}

export function LiveStream({ room, hls_url}: {room: string, hls_url: string}) {

    return (
        <div id="tokenmeet-room-container" className='flex items-center mt-10'>
            <ReactPlayer width={'100%'} height={'100%'} controls={true}  url={hls_url} />
        </div>
    )

}

interface cameraError {
    type: string;
    message: string;
}

interface avatarChanged {
    id: string, // the id of the participant that changed his avatar.
    avatarURL: string // the new avatar URL.
}

interface audioAvailabilityChanged {
    available: boolean // new available status - boolean
}

interface audioMuteStatusChanged {
    muted: boolean // new muted status - boolean
}

interface Channels {
    [key: string]: {
        id: string;
        hls_url: string;
        injest_url: string;
    }
}

export async function getLivestream({ channel }: { channel: string }) {

    const { data } = await axios.get(`https://api.tokenmeet.live/api/v1/livestreams/${channel}`)

    return data.livestream

}

export const channels: Channels = {
    'powco': {
        id: '640c9021ac7dd5844a79d6b9',
        hls_url: 'https://live.liveapi.com/63d46a33f1a83789fcb550b3/lv_0a34a0d0c01911edb4658f5d662562f3/index.m3u8',
        injest_url: 'rtmp://ingest.liveapi.com/static/lv_0a34a0d0c01911edb4658f5d662562f3?password=7f0135b6'
    },
    'spacedisco': {
        id: '640c916aac7dd5844a79d6c3',
        hls_url: "https://live.liveapi.com/63d46a33f1a83789fcb550b3/lv_ce1c9b10c01911edb4658f5d662562f3/index.m3u8"        ,
        injest_url: 'rtmp://ingest.liveapi.com/static/lv_ce1c9b10c01911edb4658f5d662562f3?password=db88a066'
    },
    'geist': {
        id: '640c91ec56c086843ec11813',
        hls_url: 'https://live.liveapi.com/63d46a33f1a83789fcb550b3/lv_1ba95bc0c01a11ed83fe6d97d5111853/index.m3u8',
        injest_url: 'rtmp://ingest.liveapi.com/static/lv_1ba95bc0c01a11ed83fe6d97d5111853?password=18213c69'
    },
    'bethebroadcast': {
        id: '640c921156c086843ec11818',
        hls_url: 'https://live.liveapi.com/63d46a33f1a83789fcb550b3/lv_31f22970c01a11ed83fe6d97d5111853/index.m3u8',
        injest_url: 'rtmp://ingest.liveapi.com/static/lv_31f22970c01a11ed83fe6d97d5111853?password=aea27c71'
    },
    'peafowl-excellence': {
        id: '640c9246ac7dd5844a79d6ce',
        hls_url: "https://live.liveapi.com/63d46a33f1a83789fcb550b3/lv_511b26d0c01a11edb4658f5d662562f3/index.m3u8"        ,
        injest_url: 'rtmp://ingest.liveapi.com/static/lv_511b26d0c01a11edb4658f5d662562f3?password=3552a176'
    }
}

