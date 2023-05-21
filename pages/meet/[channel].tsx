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

import { channels } from '../live/[channel]'

import { getLivestream, Livestream } from '../live/[channel]'

export default function MeetingPage() {

    const [isRecording, setIsRecording] = useState<boolean>(false)

    const { query } = useRouter()

    const { relayxAuthenticate, relayxAuthenticated, relayxPaymail, tokenBalance, relayAuthToken, checkNFTBalance } = useRelay()

    const [livestream, setLivestream] = useState<Livestream | null>(null)
    const [isLiveTokenHolder, setIsLiveTokenHolder] = useState<boolean>(false)
    const [isMeetTokenHolder, setIsMeetTokenHolder] = useState<boolean>(false)

    const [liveToken, setLiveToken] = useState<string | null>(null);
    const [meetToken, setMeetToken] = useState<string | null>(null);

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>()

    const [nJitsis, setNJitsis] = useState<number>(1)

    const [jitsi, setJitsi] = useState<any>()

    const { isConnected, socket } = useTokenMeetLiveWebsocket()

    const [jitsiJWT, setJitsiJWT] = useState<string>()

    const defaultRoom = "pow.co"
    const room = query.channel ? query.channel.toString() : defaultRoom
    const channel: string = query?.channel ? query.channel.toString() : defaultRoom

    const roomName = `vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/${room}`

    getLivestream({ channel: room }).then(setLivestream)

    useEffect(() => {

      if (!livestream) { return }

      console.log('livestream', livestream)

      if (livestream.live_token) {

        setLiveToken(livestream.live_token)

      } else {

        switch(channel) {
          case 'geist':
            setLiveToken('0d003ae4fca0d99fc4ff7baabc98984ef95e638bb59459fadf37207daf499581_o2')
            break;
          case 'test':
            setLiveToken('0d003ae4fca0d99fc4ff7baabc98984ef95e638bb59459fadf37207daf499581_o2')
            break;
        }

      }

      if (livestream.meet_token) {

        setMeetToken(livestream.meet_token)

      } else {

        switch(channel) {
          case 'geist':
            setMeetToken('56f6c76cddb826c4dde3d7c8230317b48075960f4b329b3bd0a1f476c7b5c970_o2')
            break;
          case 'test':
            setMeetToken('56f6c76cddb826c4dde3d7c8230317b48075960f4b329b3bd0a1f476c7b5c970_o2')
            break;
        }

      }


    }, [livestream])

    useEffect(() => {

      if (!liveToken) { return } 

      checkNFTBalance({ token: liveToken }).then((balance) => {

        console.log('nft.balance', { token: liveToken, balance })

        if (balance > 0) {

          setIsLiveTokenHolder(true)

        } else {

          setIsLiveTokenHolder(false)

        }

      })
      .catch(error => {

        console.error('checkNFTBalance.error', error)

        setIsLiveTokenHolder(false)

      })

    }, [liveToken])

    useEffect(() => {

      if (!meetToken) { return } 

      checkNFTBalance({ token: meetToken }).then((balance) => {

        console.log('nft.balance', { token: meetToken, balance })

        if (balance > 0) {

          setIsMeetTokenHolder(true)

        } else {

          setIsMeetTokenHolder(false)

        }

      })
      .catch(error => {

        console.error('checkNFTBalance.error', error)

        setIsMeetTokenHolder(false)

      })

    }, [meetToken])

    useEffect(() => {

      getLivestream({ channel }).then(setLivestream)

    }, [])


    useEffect(() => {

        console.log('USE EFFECT', {nJitsis})

        if (relayxPaymail && tokenBalance && tokenBalance >= 0) {

            // @ts-ignore
            if (!window.JitsiMeetExternalAPI) {

                setTimeout(() => {
                    setNJitsis(nJitsis + 1)
                }, 520)
                
                return
            }

            if (jitsiInitialized) {

                return
            }

            setJitsiInitialized(true)


            axios.post('https://tokenmeet.live/api/v1/jaas/auth', {
                wallet: 'relay',
                paymail: relayxPaymail,
                token: relayAuthToken
            })
            .then(({data}) => {

                const domain = "8x8.vc";

                setJitsiJWT(data.jwt)

                const options = {
                    jwt: data.jwt,                
                    roomName,
                    width: '100%',
                    height: 700,
                    parentNode: document.querySelector('#tokenmeet-room-container'),
                    lang: 'en',
                    configOverwrite: {
                        prejoinPageEnabled: false,
                        startWithAudioMuted: true,
                        startWithVideoMuted: true
                    },
                };

    
                // @ts-ignore
                const _jitsi = new window.JitsiMeetExternalAPI(domain, options);

                setJitsi(_jitsi)

                // @ts-ignore
                window.jitsi = _jitsi

                socket.on('jitsi.executeCommand', message => {

                    const { command, params } = message

                    console.log('jitsi.executeCommand', {command, params})

                    jitsi.executeCommand(command, params)

                })

                jitsi.addListener('recordStatusChanged', (event: any) => {

                    console.log('--RECORDING STATUS CHANGED--', event)
                })


                socket.on('jitsi.callFunction', async (message) => {

                    const { method, params, uid } = message

                    console.log('jitsi.callFunction', {method, params, uid})

                    const result = await jitsi[method](...params)

                    socket.emit('jitsi.callFunctionResult', {
                        uid,
                        result
                    })
                    
                })

                const handlers: any = events.reduce((acc: any, type: string) => {

                    acc[type] = (event: any) => {

                        if (event) {
                            handleJitsiEvent(type, event, socket)
                        }                    
                    }

                    return acc

                }, {})

                for (let type of events) {
                        
                        jitsi.addListener(type, handlers[type])
                }

                return function() {

                    for (let type of events) {
                            
                        jitsi.removeListener(type, handlers[type])
                    }
                            
                    jitsi.dispose()
                }
            })
            .catch(error => {

                console.log('AUTH ERROR', error)

            })
        }

        console.log('--end use effect--', {nJitsis})

    // @ts-ignore
    }, [window.JitsiMeetExternalAPI, relayAuthToken, jitsiJWT, tokenBalance])


    async function handleJitsiEvent(type: string, event: any, socket: Socket) {

        //TODO: Pipe the event to websocket server

        console.log('JIITSI EVENT', {type, event, relayxPaymail})

        socket.emit('jitsi-event', {
            type,
            event,
            paymail: relayxPaymail,
            jwt: jitsiJWT,
            timestamp: new Date().toISOString(),
            roomName
        })

        if (type === 'recordingStatusChanged') {

            const { on } = event

            setIsRecording(on)
        }

        if (type === "outgoingMessage") {

            console.log('OUTGOING MESSAGE', event)

            try {

                const result: any = await sendMessage({
                    app: 'chat.pow.co',
                    channel: 'powco-development',
                    message: event.message,
                    paymail: relayxPaymail
                })

                console.log('bsocial.sendMessage.result', result)

            } catch(error) {

                console.error('bsocial.sendMessage.error', error)
            }


        }
    }

    const login = (e: any) => {
        e.preventDefault()
        relayxAuthenticate()
    }

    const startLivestream = async () => {

        jitsi.executeCommand('startRecording', {
            mode: 'stream',
            rtmpStreamKey: `${livestream?.ingest.server}/${livestream?.ingest.key}`
        })
    }

    const stopLivestream = async () => {

        jitsi.executeCommand('stopRecording', {
            mode: 'stream'
        })
    }
  return (
    <>
        <Script src={'https://8x8.vc/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/external_api.js'}></Script>
        <PanelLayout>
            {relayxAuthenticated ? <div className='grid grid-cols-12 w-full h-full'>
                <div className='col-span-12 xl:col-span-8 xl:pr-4'>

                    {meetToken && !isMeetTokenHolder && (
                      <h2 className='p-5 text-xl text-center font-bold '>
                        <h1 className="mb-4 text-4xl font-extrabold text-center tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                          <a href={`https://relayx.com/market/${meetToken}`} target="_blank" rel="noreferrer">
                            <button className="btn bg-black hover:bg-grey-700 text-white font-bold py-2 px-4 rounded">Buy Membership Card</button>
                          </a>
                        </h1>
                      </h2>
                    )}
                    {(!meetToken  || isMeetTokenHolder ) && (
                      <>
                      <div id="tokenmeet-room-container"/>
                      <div>

                        {livestream && !isRecording && (
                            <button onClick={() => startLivestream()}>
                                Start Livestream
                            </button>
                        )}

                        {isRecording && (
                            <button onClick={() => stopLivestream()}>
                                Stop Livestream
                            </button>
                        )}
                      </div>
                      </>
                    )}

                    <h2 className='p-5 text-xl font-bold '>Meet #{room}</h2>

                </div>
                <div className='col-span-12 xl:col-span-4 '>
                    <div className=''>
                        <h3 className='p-3 text-lg font-bold'>Live Chat in {room}</h3>
                        <SideChat room={channel} />
                    </div>
                </div>
            </div> : (<div className='mt-10 flex flex-col justify-center items-center'>
                    <p className='text-3xl font-bold'>You need to be logged in to access this page</p>
                    <div
                        //onClick={()=>setWalletPopupOpen(true)}
                        onClick={login}
                        className='mt-10 flex ml-4 p-5 transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-500 to-blue-600  justify-center items-center cursor-pointer relative'>
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



