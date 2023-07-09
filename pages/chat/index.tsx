import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Header from '../../components/Header'
import ChannelList from '../../components/ChannelList'
import Meta from '../../components/Meta'

const Chat = () => {
    const router = useRouter()
    const query = router.query

    useEffect(() => {
        const handleResize = () => {
          const isMobile = window.innerWidth < 768 // Adjust this value to your preferred mobile breakpoint
          if (!isMobile) {
            router.push('/chat/powco')
          }
        }
        handleResize() // Check initial screen size
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }, [])
  return (
    <>
    <Meta title={`Chat | The Proof of Work Cooperative`} description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <div className='bg-primary-300 dark:bg-primary-700/20 h-screen'>
        <Header/>
        <div className='h-12'/>
      <div className='grid grid-cols-12 h-full'>
        <div className={`col-span-12 bg-primary-100 dark:bg-primary-900/20`}>
          <ChannelList/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Chat
