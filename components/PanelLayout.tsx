import React from 'react'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('./Header'), { ssr: false})
const SideBar = dynamic(() => import ('./SideBar'), { ssr: false })
import SideBarNotifications from './SideBarNotifications'

const PanelLayout = ({ children }) => {
  return (
    <div className='bg-gray-300 dark:bg-gray-700'>
      <Header/>
      <div className='h-16'/>
      <div className='grid grid-cols-12'>
        <div className='hidden lg:block col-span-3 lg:w-full lg:pr-7'>
          <div className='w-20 xl:w-64 fixed top-16 h-[calc(100%-4rem)] z-50'>
            <SideBar/>
          </div>
        </div>
        <div className='col-span-12 lg:col-span-9 lg:pr-7 min-h-screen'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default PanelLayout