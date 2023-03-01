import React, { useEffect, useRef, useState } from 'react'
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

  const MessageItem = (props:any) => {

    const handleBoostLoading = () => {
      toast('Publishing Your Boost Job to the Network', {
          icon: '⛏️',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
        });
    };
  
    const handleBoostSuccess = () => {
      toast('Success!', {
          icon: '✅',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
        });
    };
  
    const handleBoostError = () => {
      toast('Error!', {
          icon: '🐛',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
      });
    };
    return (
      <div className='grid grid-cols-12 bg-primary-300 dark:bg-primary-700/20 pt-4 cursor-pointer hover:bg-primary-200 hover:dark:bg-primary-800/20'>
        <Link className='col-span-2 sm:col-span-1 flex justify-center' href={`/profile/${props.MAP.paymail}`}>
          <div className='cursor-pointer'>
            <UserIcon src={`https://a.relayx.com/u/${props.MAP.paymail}`} size={36}/>
          </div>
        </Link>
        <div className='col-span-10 sm:col-span-11 flex flex-col justify-center w-full'>
          <div className='flex justify-between pr-5'>
            <Link href={`/profile/${props.MAP.paymail}`}>
              <p className='cursor-pointer text-lg text-blue-600 font-semibold hover:underline'>{props.MAP.paymail}</p>
            </Link>
            <a href={`https://whatsonchain.com/tx/${props.tx.h}`} target="_blank" rel="noreferrer">
              <span className='text-xs text-gray-500 font-semibold'>{moment(props.timestamp * 1000).fromNow()}</span>
            </a>
          </div>
          <PostDescription bContent={props.B.content}/>
        </div>
        <div className='col-span-12 grid grid-col-12 justify-end h-full'>
          <div className='col-span-11'/>
          <div className='col-span-1'>
            <BoostButton
              wallet={wallet}
              content={props.tx.h}
              difficulty={0}
              //@ts-ignore
              theme={theme.theme}
              showDifficulty={false}
              onSending={handleBoostLoading}
              onError={handleBoostError}
              onSuccess={handleBoostSuccess}
            />
          </div>
        </div>
      </div>
    )
  }

  const { data, error, isLoading } = useSWR(`https://b.map.sv/q/${messageQuery(false, channelId, "", "")}`, fetcher)
  console.log(data)

  const messages = data?.c || []
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
            <UserIcon src={`https://a.relayx.com/u/${paymail}`} size={36}/>
            <h2 className='ml-2 text-2xl font-bold'>{channelId}</h2>
          </div>
          <div className='overflow-y-auto overflow-x-hidden relative flex flex-col-reverse' style={{height: isMobile ? "calc(100vh - 148px)" : "calc(100vh - 206px)"}} >
            {messages?.map((message: any) => {
              return <MessageItem key={message.tx.h} {...message}/>
            })}
          </div>
          <div ref={composerRef} className='sticky bottom-0 p-4'>
            <ChatComposer/>
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