import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link';
import { useTheme } from "next-themes";
import UserIcon from './UserIcon';
import Drawer from './Drawer';
import WalletProviderPopUp from './WalletProviderPopUp';
import { useRelay } from '../context/RelayContext';
import LocaleSelect from './LocaleSelect';

import { FormattedMessage } from 'react-intl';
import { useBitcoin } from '../context/BitcoinContext';




const SideBar = () => {
    const { theme, setTheme } = useTheme()
    const { authenticated, authenticate, paymail, avatar, userName } = useBitcoin()
    const [loggedIn, setLoggedIn] = useState(false)
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);

    const toggleTheme =  () => {
        if(theme==="dark"){
          setTheme("light")
        }
        if(theme==="light"){
          setTheme("dark")
        }
    }

    const login = (e: any) => {
        e.preventDefault();
        authenticate()
    }

  return (
    <div className='py-6 xl:p-6 items-center bg-primary-200 dark:bg-primary-800/20 w-full h-full flex flex-col'>
        <div className='w-fit xl:w-full flex mb-2.5 items-center '>
            {authenticated ? (<>
            <Link className='cursor-pointer' href={`/profile/${paymail}`}>
                    <UserIcon src={avatar!} size={36}/>
            </Link>
            <div className='ml-3 hidden xl:block'>
                <Link className='block text-sm leading-4 font-semibold text-gray-900 dark:text-white hover:underline' href={`/profile/${paymail}`} >
                    {userName}
                </Link>
                <Link className='block text-xs leading-4 text-gray-500 hover:underline' href={`/profile/${paymail}`}>
                    {paymail}
                </Link>
            </div>
            <div className='grow'/>
            <div className='hidden xl:block'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-gray-700 hover:dark:text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </div></>):
            (
                <div
                    //onClick={()=>setWalletPopupOpen(true)}
                    onClick={login}
                    className='hidden xl:flex ml-4 p-5 transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-500 to-blue-600  justify-center items-center cursor-pointer relative'>
                    <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                    <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white">
                    </path>
                    </svg>
                    <span className='ml-4'><FormattedMessage id="Connect wallet"/></span>
                </div>
            )
          }
        </div>
        <div className='flex flex-col w-fit xl:w-[calc(100%+48px)]'>
            <Link href="/">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'><FormattedMessage id="Home"/></div>
                </div>
            </Link>
            {/* <Link href="/notifications">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'>Notifications</div>
                </div>
            </Link> */}
            {/* <Link href="/chat">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'>Chat</div>
                </div>
            </Link> */}
            <Link href="/meet">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 xl:mr-2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'>Meet</div>
                </div>
            </Link>
            <Link href="/watch">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 xl:mr-2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'>Watch</div>
                </div>
            </Link>
            {/* <Link href="/market">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'><FormattedMessage id="Market"/></div>
                </div>
            </Link> */}
            {/* <Link href="/discover">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'>Discover</div>
                </div>
            </Link> */}
            {/* <Link href="/academy">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'>Academy</div>
                </div>
            </Link>*/}
            {/* <Link href="/features">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'>Features</div>
                </div>
            </Link>  */}
            <Link href="/faq">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-gray-300 hover:dark:bg-gray-700 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 xl:mr-2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>

                    <div className='hidden xl:block text-base leading-4 grow'>F.A.Q.</div>
                </div>
            </Link>
            <Link href="/settings">
                <div className='mt-4 flex items-center cursor-pointer xl:px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className='hidden xl:block text-base leading-4 grow'><FormattedMessage id="Settings"/></div>
                </div>
            </Link>
        </div>
        {authenticated && <Link href="/compose">
            <button 
                className=' w-full hidden xl:flex text-sm leading-4 text-white font-semibold mt-12 mb-6 border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'
            >
                {/* <FormattedMessage id="Ask Bitcoin"/> */}
                Create Post
            </button>
        </Link>}
        <div className='grow'/>
        <div className='initial xl:hidden mb-6'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500 dark:text-primary-500/20 hover:text-primary-700  hover:dark:text-primary-300/20 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
        </div>
        <div className='flex flex-col xl:flex-row items-center justify-center'>
            <div onClick={toggleTheme} className='p-3'>
                <svg 
                    className={`cursor-pointer ${theme ==="dark" ? "fill-primary-300/20 hover:fill-primary-100/20":"fill-primary-500 hover:fill-primary-700"}`}
                    width="16" 
                    height="16" 
                    viewBox="0 0 19 19" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path d="M14.8976 12.8327C9.68779 12.8327 6.3558 9.58619 6.3558 4.39567C6.3558 3.32308 6.61581 1.79083 6.96249 0.995968C7.04916 0.775706 7.06842 0.641633 7.06842 0.545867C7.06842 0.287298 6.87582 0 6.50025 0C6.39432 0 6.1632 0.0287298 5.95134 0.105343C2.38824 1.52268 0 5.33417 0 9.34677C0 14.9778 4.31424 19 9.95743 19C14.108 19 17.6999 16.5005 18.8941 13.3785C18.9807 13.1583 19 12.9284 19 12.8422C19 12.4879 18.7015 12.2485 18.4318 12.2485C18.3066 12.2485 18.2007 12.2772 18.0177 12.3347C17.2762 12.5741 16.0821 12.8327 14.8976 12.8327Z">
                    </path>
                </svg>
            </div>
            <LocaleSelect/>
        </div>
        {authenticated && <div className='hidden xl:block mt-6'>
            {/* <Link href="/invite">
                <div className='cursor-pointer flex items-center rounded-md bg-gray-300 dark:bg-gray-900 py-2 pl-0.5 pr-1 w-fit max-w-full'>
                    <p className='text-xs text-gray-900 dark:text-white leading-4 mr-2.5'>{me.referralLinkByReferralLinkId.shortLinkUrl}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
            </Link> */}
        </div>}
        <Drawer
          selector="#walletProviderPopupControler"
          isOpen={walletPopupOpen}
          onClose={() => setWalletPopupOpen(false)}
        >
          <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
        </Drawer>
    </div>
  )
}

export default SideBar