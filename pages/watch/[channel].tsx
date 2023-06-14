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

import TokenMeetProfile from '../../components/profile/TokenMeetProfile'

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

import { channels } from '../live/[channelId]'

import { getLivestream, Livestream } from '../live/[channelId]'

export default function MeetingPage() {

    const [isRecording, setIsRecording] = useState<boolean>(false)

    const { query } = useRouter()

    const { relayxAuthenticate, relayxAuthenticated, relayxPaymail, relayAuthToken } = useRelay()

    const [jitsiInitialized, setJitsiInitialized] = useState<boolean>()

    const [nJitsis, setNJitsis] = useState<number>(1)

    const [jitsi, setJitsi] = useState<any>()

    const { isConnected, socket } = useTokenMeetLiveWebsocket()

    const [jitsiJWT, setJitsiJWT] = useState<string>()

    const [livestream, setLivestream] = useState<Livestream | null>()

    const defaultRoom = "powco"
    const room = query.channel ? query.channel.toString() : defaultRoom

    const roomName = `vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/${room}`

    getLivestream({ channel: room }).then(setLivestream)

    useEffect(() => {

        console.log('USE EFFECT', {nJitsis})

        if (relayxPaymail) {

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


            axios.post('https://api.tokenmeet.live/api/v1/jaas/auth', {
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
    }, [window.JitsiMeetExternalAPI, relayAuthToken, jitsiJWT])


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
                    channel: 'powco',
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

        if (!livestream) { return }
      
        const { ingest } = livestream.liveapi_data

        jitsi.executeCommand('startRecording', {
            mode: 'stream',
            rtmpStreamKey: `${ingest.server}/${ingest.key}`
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
            <div className='grid grid-cols-12 w-full h-full'>
                <div className='col-span-12 xl:col-span-8 xl:pr-4'>
                    <TokenMeetProfile channel={room}/>
                    <h2 className='p-5 text-xl font-bold '>Meet {room}</h2>
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
                <div className='col-span-12 xl:col-span-4 '>
                    <div className=''>
                        <h3 className='p-3 text-lg font-bold'>Live Chat in {room}</h3>
                        <SideChat room={room.toString()} />
                    </div>
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



