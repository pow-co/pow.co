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
import Meta from '../../components/Meta'

import ReactPlayer from 'react-player'

const MINIMUM_POWCO_BALANCE = 1

export interface Video {
    _id: string;
    enabled: boolean;
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

export default function VideoPage() {

    const { query } = useRouter()

    const { relayxAuthenticate, relayxAuthenticated, relayxPaymail, relayAuthToken } = useRelay()

    const [video, setVideo] = useState<Video | null>(null)

    const login = (e: any) => {
        e.preventDefault()
        relayxAuthenticate()
    }

    const room = String(query._id)

    getVideo({ _id: String(query._id) }).then(setVideo)

  return (
    <>
        <Meta title='Video | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
        <PanelLayout>
            {relayxAuthenticated ? <div className='grid grid-cols-12 w-full h-full'>
                <div className='col-span-12 xl:col-span-8 xl:pr-4'>
                    {video && (
                        <LiveStream room={room} hls_url={video.playback.hls_url}/>
                    )}
                    
                    <h2 className='p-5 text-xl text-center font-bold '>Video {query._id}</h2>
                </div>
                <div className='col-span-12 xl:col-span-4 '>
                    <div className='center'>
                        <h3 className='p-3 text-lg font-bold flex items-center'>Live Chat in {room}</h3>
                        <SideChat room={room} />
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
    </>
  )
}

function LiveStream({ room, hls_url}: {room: string, hls_url: string}) {

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

export async function getVideo({ _id }: { _id: string }) {

    const { data } = await axios.get(`https://api.tokenmeet.live/api/v1/videos/${_id}`)

    return data.video

}


