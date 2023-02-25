import React from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'
import ChannelList from '../../components/ChannelList'
import ChatComposer from '../../components/ChatComposer'

const Chat = () => {
  const router = useRouter()
  const query = router.query
  const messages:any = []
  return (
    <div className='bg-primary-300 dark:bg-primary-700/20 h-screen'>
      <div className={`${query.channelId && "hidden sm:block"}`}>
        <Header/>
        <div className='h-16'/>
      </div>
      <div className='grid grid-cols-12 h-full'>
        <div className={`${query.channelId ? "hidden sm:block sm:col-span-4" : "col-span-12"}  bg-primary-100 dark:bg-primary-900/20`}>
          <ChannelList/>
        </div>
        <div className={`${query.channelId ? "col-span-12 sm:col-span-8" : "hidden"} bg-primary-300 dark:bg-primary-700/20`}>
          {messages?.map((message: any) => {
            return <div>{message}</div>
          })}
          <ChatComposer/>
        </div>
        {/* <div className={`${query.channelId ? "hidden lg:block lg:col-span-3" : "hidden"}  bg-primary-100 dark:bg-primary-900/20`}>
          {channelInfo}
        </div> */}
      </div>
    </div>
  )
}

export default Chat