import React from 'react'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('./Header'), { ssr: false})
const SideBar = dynamic(() => import ('./SideBar'), { ssr: false })
const SidebarTuning = dynamic(() => import ('./SidebarTuning'), { ssr: false})

const ThreeColumnLayout = ({ children }) => {
  return (
    <div className='bg-gray-300 dark:bg-gray-700'>
      <Header/>
      <div className='h-16'/>
      <div className='grid grid-cols-12'>
        <div className='hidden lg:block col-span-1 xl:col-span-2 lg:w-full lg:pr-7'>
          <div className='w-20 xl:w-64 fixed top-16 h-[calc(100%-4rem)] z-50'>
            <SideBar/>
          </div>
        </div>
        <div className='col-span-12 lg:col-span-11 xl:col-span-7 grid grid-cols-12'>
          <div className='col-span-12 '>
            {children}
          </div>
        </div>
        <div className='hidden xl:block col-span-2 sticky top-[72px] w-full px-7'>
          <div className='fixed top-[102px] z-50 w-[344px]'>
            <SidebarTuning/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreeColumnLayout