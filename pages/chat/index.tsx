import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Header from '../../components/Header'
import ChannelList from '../../components/ChannelList'

const Chat = () => {
    const router = useRouter()
    const query = router.query

    useEffect(() => {
        const handleResize = () => {
          const isMobile = window.innerWidth < 768 // Adjust this value to your preferred mobile breakpoint
          if (!isMobile) {
            router.push('/chat/powco-development')
          }
        }
        handleResize() // Check initial screen size
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
      }, [])
  return (
    <div className='bg-primary-300 dark:bg-primary-700/20 h-screen'>
        <Header/>
        <div className='h-12'/>
      <div className='grid grid-cols-12 h-full'>
        <div className={`col-span-12 bg-primary-100 dark:bg-primary-900/20`}>
          <ChannelList/>
        </div>
      </div>
    </div>
  )
}

export default Chat