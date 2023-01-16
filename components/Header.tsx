import React, { useState, useContext, useEffect} from 'react'
import Link from 'next/link'
import Drawer from './Drawer';
import UserIcon from './UserIcon';
import WalletProviderPopUp from './WalletProviderPopUp';
import SideBarDrawer from './SideBarDrawer';
import LogoTitle from './LogoTitle';
import TuningProviderPopUp from './TuningProviderPopup';
import { useRelay } from '../context/RelayContext';
import { useRouter } from 'next/router';

import { FormattedMessage } from 'react-intl';



const Header = () => {
  const { authenticated, avatar, authenticate, paymail } = useRelay()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const [tuningPopupOpen, setTuningPopupOpen] = useState(false);
  const router = useRouter()

  const openDrawer = (e: any) => {
    e.stopPropagation();
    setIsDrawerOpen(true)
  }

  const login = (e: any) => {
    e.preventDefault()
    authenticate()
  }
  return (
    <>
    <div className="fixed w-screen -top-16 left-0 z-50 lg:bg-primary-200 lg:dark:bg-primary-800/20 lg:opacity-90 backdrop-blur-md ">
        <div className="h-16 bg-red-500 " />
        <div className="px-4 lg:px-7 h-[50px] lg:h-16 relative flex justify-between items-center">
          <div className="lg:hidden w-24 flex items-center">
            <div className='cursor-pointer' onClick={openDrawer}>
              {authenticated ? <UserIcon src={avatar} size={36} /> : 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>}
            </div>
            <Link href="/search" className="h-8">
              <div className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </Link>
          </div>
          <div className='w-full flex items-center justify-center sm:justify-start'>
            <Link href="/">
                  <LogoTitle/>
            </Link>
          </div>
          <div className='' id="price-womp"></div>
          <Drawer selector="#drawerControler" isOpen={isDrawerOpen} onClose={()=>setIsDrawerOpen(false)}>
            <SideBarDrawer/>
          </Drawer>
          <div className='hidden lg:flex grow justify-end items-center'>
            <Link href="/search">
              <div className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </Link>
            {/* <Link href="/chat">
              <div className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </Link>  */}
            {authenticated ? (<>
            {/* <Link href="/notifications">
              <div className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </Link> */}
            {/* <Link href={`/u/${paymail.split("@")[0]}`}> */}
              <div className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <UserIcon src={avatar} size={36} />
              </div>
            {/* </Link> */}
            </>): (
              <div
              //onClick={()=>setWalletPopupOpen(true)}
              onClick={login}
              className='ml-4 p-5 w-fit text-center transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-500 to-blue-600 flex justify-center items-center cursor-pointer relative '>
              <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white">
                </path>
              </svg>
              <span className='ml-4'><FormattedMessage id="Connect"/></span>
            </div>

            )}
          </div>
          <div className="w-24 flex lg:hidden items-center justify-end">
            {/* <Link href="/chat" className="h-8">
              <div className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </Link> */}
            {router.pathname !== "/settings" && <div onClick={()=>setTuningPopupOpen(true)} className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-700 dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
            </div>}
            {authenticated ? (<>
            {/* <Link href="/notifications" className="h-8 mr-2">
              <div className="ml-4 h-8 w-8 flex justify-center items-center cursor-pointer relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </Link> */}</>):(
              <div 
                //onClick={()=>setWalletPopupOpen(true)} 
                onClick={login}
                className='ml-2 px-3 transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-500 to-blue-600 flex justify-center items-center cursor-pointer relative'>
                <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                  <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white">
                  </path>
                </svg>
                {/* <span className='ml-2'>Connect</span> */}
              </div>)}
          </div>
        </div>
        <Drawer 
          selector="#tuningProviderPopupControler"
          isOpen={tuningPopupOpen}
          onClose={()=>setTuningPopupOpen(false)}
        >
          <TuningProviderPopUp onClose={() => setTuningPopupOpen(false)}/>
        </Drawer>
        <Drawer
          selector="#walletProviderPopupControler"
          isOpen={walletPopupOpen}
          onClose={() => setWalletPopupOpen(false)}
        >
          <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
        </Drawer>
      </div>
      </>
  )
}

export default Header