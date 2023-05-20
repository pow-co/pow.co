import { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import { MessageItem } from "./MessageItem";
import ChatComposer from "./ChatComposer";

interface SideChatProps {
    room: string;
}

import useWebSocket from 'react-use-websocket'

import axios from 'axios'

export const SideChat = ({room: channel}: SideChatProps) => {

    const socketRef = useRef<EventSource | null>(null);
    const [newMessages, setNewMessages] = useState<any>([])
  const [messages, setMessages] = useState<any>([])
    const [pending, setPending] = useState<any>()

  const { getWebSocket } = useWebSocket(`wss://pow.co/websockets/chat/channels/${channel}`, {

    onOpen: async () => {

    },
    onMessage: async (message) => {
      refreshMessages()
    },
    onClose: async () => {

    }
  })

  useEffect(() => {

    const socket = getWebSocket()

    return function() {

      if (socket) {

        socket.close()

      }

    }
  }, [])

  const composerRef = useRef(null)
  async function refreshMessages() {

    axios.get(`https://pow.co/api/v1/chat/channels/${channel}`).then(({data}) =>{

     console.log('FETCHED MESSAGES', data)	

      setMessages(data.messages)

      setPending(null)
    })

  }

  useEffect(() =>{

    refreshMessages()
    
  }, [])


    useEffect(() => {
        setNewMessages([])
    }, []);

    return (
        <>
            <div className='overflow-y-auto overflow-x-hidden relative flex flex-col-reverse' style={{height: "calc(100vh - 218px)"}} >
            {pending && <div className='opacity-60'><MessageItem {...pending}/></div>}
                {newMessages?.map((message: any) => {
                return <MessageItem key={message.txid} {...message.bmap}/>
                })}
                {messages?.map((message: any) => {
                return <MessageItem key={message.txid} {...message.bmap}/>
                })}
            </div>
            <div ref={composerRef} className='p-4'>
                <ChatComposer channel={channel} onNewMessageSent={(newMessage:any) => setPending(newMessage)} onChatImported={refreshMessages}/>
            </div>
        </>
    )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
