import React, { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from "swr"
import Header from '../../components/Header'
import ChannelList from '../../components/ChannelList'
import ChatComposer from '../../components/ChatComposer'
import UserIcon from '../../components/UserIcon'
import Link from 'next/link'
import moment from 'moment'
import PostDescription from '../../components/PostDescription'
import { useBitcoin } from '../../context/BitcoinContext'
import { useTheme } from 'next-themes'
import { toast } from 'react-hot-toast'
import { MessageItem } from '../../components/MessageItem'

import useWebSocket from 'react-use-websocket'

import axios from 'axios'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function capitalizeFirstChar(str: string) {
  return str.replace(/^\w/, char => char.toUpperCase());
}

interface Channel {
  channel: string;
  last_message_bmap: any;
  last_message_timestamp: Date;
}

const Chat = () => {
  const router = useRouter()
  const theme = useTheme()
  const { wallet, paymail } = useBitcoin()
  const query = router.query
  const channel = query.channel?.toString()
  const [isMobile, setIsMobile] = useState(false)
  const [newMessages, setNewMessages] = useState<any>([])
  const [messages, setMessages] = useState<any>([])
  const [pending, setPending] = useState<any>()
  const socketRef = useRef<EventSource | null>(null);

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

      setMessages(data.messages)

      setPending(null)
    })

  }

  useEffect(() =>{

    refreshMessages()
    
  }, [channel])

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        handleResize() // Check initial screen size
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }, [])


  return (
    <div className='bg-primary-300 dark:bg-primary-700/20 overflow-hidden h-screen'>
      <div className={`${query.channel && "hidden sm:block"}`}>
        <Header/>
        <div className='h-16'/>
      </div>
      <div className='grid grid-cols-12 h-full overflow-hidden'>
        <div className={`${query.channel ? "hidden sm:block sm:col-span-4" : "col-span-12"}  bg-primary-100 dark:bg-primary-900/20`}>
          <ChannelList currentChannel={query.channel?.toString()}/>
        </div>
        <div className={`${query.channel ? "col-span-12 sm:col-span-8" : "hidden"} bg-primary-300 dark:bg-primary-700/20`} >
          <div className='sticky w-full  items-center flex h-16 z-10 p-4 bg-primary-300 dark:bg-primary-800/20'>
            <svg
              onClick={() => router.back()}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="block sm:hidden w-6 h-6 mr-2 stroke-gray-700 dark:stroke-gray-300 cursor-pointer hover:opacity-70"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            {/* <UserIcon src={`https://a.relayx.com/u/${paymail}`} size={36}/> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
            </svg>
            <h2 className='ml-2 text-2xl font-bold'>{channel}</h2>
          </div>
          <div className='overflow-y-auto overflow-x-hidden relative flex flex-col-reverse' style={{height: isMobile ? "calc(100vh - 148px)" : "calc(100vh - 218px)"}} >
            {pending ? <div className='opacity-60'><MessageItem {...pending}/></div> : <></>}
            {newMessages?.map((message: any) => {
              return <MessageItem key={message.txid} {...message}/>
            })}
            {messages?.map((message: any) => {
              return <MessageItem key={message.txid} {...message}/>
            })}

          </div>
          <div ref={composerRef} className='sticky px-4'>
            <ChatComposer channel={channel!} onNewMessageSent={(newMessage:any) => setPending(newMessage)} onChatImported={refreshMessages} />
          </div>
        </div>
        {/* <div className={`${query.channel ? "hidden lg:block lg:col-span-3" : "hidden"}  bg-primary-100 dark:bg-primary-900/20`}>
          {channelInfo}
        </div> */}
      </div>
    </div>
  )
}

export default Chat
