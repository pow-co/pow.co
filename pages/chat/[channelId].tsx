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
import { BoostButton } from 'myboostpow-lib'
import { useBitcoin } from '../../context/BitcoinContext'
import { useTheme } from 'next-themes'
import { toast } from 'react-hot-toast'
import { MessageItem } from '../../components/MessageItem'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const messageQuery = (verboseMode: boolean, channelId?: string, userId?: string, myId?: string) => {
  // console.log("query with", userId, channelId);
  let q = {
    v: 3,
    q: {
      find: {
        "MAP.type": verboseMode ? { $in: ["post", "message"] } : "message",
      },
      sort: {
        timestamp: -1,
        "blk.t": -1,
      },
      limit: 100,
    },
  };
  if (channelId) {
    //@ts-ignore
    q.q.find["MAP.channel"] = channelId;
  } else if (userId && myId) {
    //@ts-ignore
    q.q.find["$or"] = [
      { $and: [{ "MAP.bapID": myId }, { "AIP.bapId": userId }] },
      { $and: [{ "AIP.bapId": myId }, { "MAP.bapID": userId }] },
    ];
    // stuff added by indexer uses camelCase
    // stuff in the protocol uses caps ID
    //TODO: q.q.find["MAP.encrypted"] = true;
  } else {
    //@ts-ignore
    q.q.find["$and"] = [
      { "MAP.context": { $exists: false } },
      { "MAP.channel": { $exists: false } },
    ];
  }
  return btoa(JSON.stringify(q));
};

const Chat = () => {
  const router = useRouter()
  const theme = useTheme()
  const { wallet, paymail } = useBitcoin()
  const query = router.query
  const channelId = query.channelId?.toString()
  const [isMobile, setIsMobile] = useState(false)
  const [newMessages, setNewMessages] = useState<any>([])
  const socketRef = useRef<EventSource | null>(null);

  const composerRef = useRef(null)

  /* useEffect(() => {
    if (composerRef.current) {
      //@ts-ignore
      composerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []); */

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        handleResize() // Check initial screen size
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }, [])

  const { data, error, isLoading } = useSWR(`https://b.map.sv/q/${messageQuery(false, channelId, "", "")}`, fetcher)
  console.log(data)

  const messages = data?.c || []

  useEffect(() => {
    setNewMessages([])
    // create a new WebSocket connection
    socketRef.current = new EventSource(`https://b.map.sv/s/${messageQuery(false, channelId, "", "")}`);

    // add event listeners for the WebSocket connection
    socketRef.current.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    socketRef.current.addEventListener("message", (event: any) => {
      const message = JSON.parse(event.data);
      if(message.type === "push"){
        let newMessage = message.data[0]
        console.log("New Message: ",newMessage)
        setNewMessages((prevMessages: any) => [newMessage, ...prevMessages])
      }
    });

    socketRef.current.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      // close the WebSocket connection when the component unmounts
      socketRef.current?.close();
    };
  }, [channelId]);
  return (
    <div className='bg-primary-300 dark:bg-primary-700/20 overflow-hidden h-screen'>
      <div className={`${query.channelId && "hidden sm:block"}`}>
        <Header/>
        <div className='h-16'/>
      </div>
      <div className='grid grid-cols-12 h-full overflow-hidden'>
        <div className={`${query.channelId ? "hidden sm:block sm:col-span-4" : "col-span-12"}  bg-primary-100 dark:bg-primary-900/20`}>
          <ChannelList/>
        </div>
        <div className={`${query.channelId ? "col-span-12 sm:col-span-8" : "hidden"} bg-primary-300 dark:bg-primary-700/20`} >
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
            <h2 className='ml-2 text-2xl font-bold'>{channelId}</h2>
          </div>
          <div className='overflow-y-auto overflow-x-hidden relative flex flex-col-reverse' style={{height: isMobile ? "calc(100vh - 148px)" : "calc(100vh - 206px)"}} >
            {newMessages?.map((message: any) => {
              return <MessageItem key={message.tx.h} {...message}/>
            })}
            {messages?.map((message: any) => {
              return <MessageItem key={message.tx.h} {...message}/>
            })}
          </div>
          <div ref={composerRef} className='sticky bottom-0 p-4'>
            <ChatComposer channelId={channelId!}/>
          </div>
        </div>
        {/* <div className={`${query.channelId ? "hidden lg:block lg:col-span-3" : "hidden"}  bg-primary-100 dark:bg-primary-900/20`}>
          {channelInfo}
        </div> */}
      </div>
    </div>
  )
}

export default Chat