import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PanelLayout from '../components/PanelLayout'
import { useRelay } from '../context/RelayContext'
import { sendMessage } from '../utils/bsocial/message'
import { useTokenMeetLiveWebsocket } from '../hooks/useWebsocket'
import { Socket } from 'socket.io-client/build/esm/socket';
import Script from 'next/script'
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'



const MINIMUM_POWCO_BALANCE = 0

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

export default function MeetingPage() {

    const router = useRouter()

    const { relayxAuthenticate, relayxAuthenticated, relayxPaymail, tokenBalance, relayAuthToken } = useRelay()

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>()

    const [nJitsis, setNJitsis] = useState<number>(1)

    const { isConnected, socket } = useTokenMeetLiveWebsocket()

    const [jitsiJWT, setJitsiJWT] = useState<string>()

    const roomName = 'vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/powco-club-room'

    useEffect(() => {

        console.log('USE EFFECT', {nJitsis})

        if (relayxPaymail && tokenBalance && tokenBalance >= MINIMUM_POWCO_BALANCE) {

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
                    parentNode: document.querySelector('#jitsi-daily-meeting'),
                    lang: 'en',
                    configOverwrite: {
                        prejoinPageEnabled: false,
                        startWithAudioMuted: true,
                        startWithVideoMuted: true
                    },
                };

    
                // @ts-ignore
                var jitsi = new window.JitsiMeetExternalAPI(domain, options);

                // @ts-ignore
                window.jitsi = jitsi

                socket.on('jitsi.executeCommand', message => {

                    const { command, params } = message

                    console.log('jitsi.executeCommand', {command, params})

                    jitsi.executeCommand(command, params)

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
  return (
    <>
        <Script src={'https://8x8.vc/vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/external_api.js'}></Script>
        <PanelLayout>
            <div className='mx-auto max-w-xl col-span-12 lg:col-span-6 min-h-screen flex flex-col'>
                <h1 className='my-10 text-2xl font-bold text-center'>Daily Discussion of Boostpow Costly Signals</h1>
                <div className=''>
                    {relayxAuthenticated ? 
                        (<>
                            {tokenBalance > MINIMUM_POWCO_BALANCE ? 
                                (<>
                                    <div>
                                        <div id="jitsi-daily-meeting"></div>
                                    </div>
                                </>) 
                                : 
                                (<>
                                    <div className="mt-8 flex flex-col justify-center text-center">
                                        <p className="text-5xl p-5">😔 ngmi</p>
                                        <p className="text-xl opacity-70 p-5 ">
                                        {/* <FormattedMessage id="We reserve ability to search askbitcoin to our token holders." /> */}
                                        You need at least {MINIMUM_POWCO_BALANCE} to participate to a daily meeting and you currently have {tokenBalance}
                                        </p>
                                        <div className="flex flex-col mx-auto justify-center">
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href="https://relayx.com/market/93f9f188f93f446f6b2d93b0ff7203f96473e39ad0f58eb02663896b53c4f020_o2"
                                            // onClick={() => router.push("/market")}
                                            className="mt-2 text-white bg-gradient-to-tr from-blue-500 to-blue-600 leading-6 py-1 px-4 font-bold border-none rounded cursor-pointer flex items-center text-center justify-center disabled:opacity-50 transition duration-500 transform hover:-translate-y-1"
                                        >
                                            <FormattedMessage id="Go buy one now!" />
                                        </a>
                                        <button
                                            onClick={() => router.push("/")}
                                            className="mt-5 text-white outline outline-2 outline-blue-500 leading-6 py-1 px-4 font-bold border-none rounded cursor-pointer flex items-center text-center justify-center disabled:opacity-50 transition duration-500 transform hover:-translate-y-1"
                                        >
                                            <FormattedMessage id="No, I hate knowledge." />
                                        </button>
                                        </div>
                                    </div>
                                </>)
                            }
                        </>) 
                        : 
                        (<>
                            <div
                                //onClick={()=>setWalletPopupOpen(true)}
                                onClick={login}
                                className='hidden xl:flex ml-4 p-5 transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-500 to-blue-600  justify-center items-center cursor-pointer relative'>
                                <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                                <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white">
                                </path>
                                </svg>
                                <span className='ml-4'><FormattedMessage id="Connect wallet"/></span>
                            </div>
                        </>)
                    }
                </div>
            </div>
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

