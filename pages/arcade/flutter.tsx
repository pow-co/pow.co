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

import { channels } from '../live/[channelId]'

import { getLivestream, Livestream } from '../live/[channelId]'

export default function MeetingPage() {

    const [isRecording, setIsRecording] = useState<boolean>(false)

    const { query } = useRouter()

    const { relayxAuthenticate, relayxAuthenticated, relayxPaymail, tokenBalance, relayAuthToken } = useRelay()

    const { isConnected, socket } = useTokenMeetLiveWebsocket()

    const [livestream, setLivestream] = useState<Livestream | null>()

    const defaultRoom = "pow.co"
    const room = query.roomId ? query.roomId.toString() : defaultRoom

    const roomName = `vpaas-magic-cookie-30f799d005ea4007aaa7afbf1a14cdcf/${room}`

    getLivestream({ channel: room }).then(setLivestream)

    const login = (e: any) => {
        e.preventDefault()
        relayxAuthenticate()
    }

  return (
    <>
        <PanelLayout>
          <h1>Flutter Arcade Game (Placeholder Page)</h1>
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



