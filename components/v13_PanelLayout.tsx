import React from 'react'
import dynamic from 'next/dynamic'
const Header = dynamic(() => import('./v13_Header'), { ssr: false})
const SideBar = dynamic(() => import ('./v13_SideBar'), { ssr: false })

const PanelLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className='bg-primary-300 dark:bg-primary-700/20 h-full'>
      <Header/>
      <div className='h-16'/>
      <div className='grid grid-cols-12 sm:pr-5'>
        <div className='hidden lg:block col-span-2 lg:w-full'>
          <div className='w-20 xl:w-64 fixed top-16 h-[calc(100%-4rem)] z-50'>
            <SideBar/>
          </div>
        </div>
        <div className='col-span-12 lg:col-span-10'>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default PanelLayout