import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link';
import { useTheme } from "next-themes";
import { useRelay } from '../context/RelayContext';
import UserIcon from './UserIcon';
import WalletProviderPopUp from './WalletProviderPopUp';
import Drawer from './Drawer';
import LogoTitle from './LogoTitle';
import LocaleSelect from './LocaleSelect';

import { FormattedMessage } from 'react-intl';
import { useBitcoin } from '../context/BitcoinContext';

import { useSubdomain } from '../hooks/subdomain'

// This is the one that appears on Mobile


const SideBarDrawer = () => {
    const { theme, setTheme } = useTheme()
    const { authenticated, authenticate, avatar, userName, paymail } = useBitcoin()
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);
    const {subdomain} = useSubdomain();

    const toggleTheme =  () => {
        if(theme==="dark"){
          setTheme("light")
        }
        if(theme==="light"){
          setTheme("dark")
        }
      }

    const login = (e: any) => {
        e.preventDefault()
        authenticate()
    }

  const chatPath = subdomain ? `/chat/${subdomain}` : `/chat/powco`
  const meetPath = subdomain ? `/meet/${subdomain}` : `/meet/powco`
  const livePath = subdomain ? `/live/${subdomain}` : `/live/powco`
  const watchPath = subdomain ? `/watch/${subdomain}` : `/watch/powco`
  const marketPath = subdomain ? `/market/${subdomain}` : `/market/powco`;
  const walletPath = subdomain ? `/wallet/${subdomain}`: `/wallet`
  const issuePath = subdomain ? `/issues/${subdomain}` : `/issues`
  const calendarPath = subdomain ? `/events` : `/events`

  return (
    <div className="fixed inset-0 w-9/12 h-screen">
        <div className='py-6 items-center bg-primary-200 dark:bg-primary-900 w-full h-full flex flex-col'>
            {authenticated ?(<div className='px-4 w-full flex mb-2.5 items-center'>
                <Link className='cursor-pointer' href={`/profile/${paymail}`}>
                        <UserIcon src={avatar!} size={36}/>
                </Link>
                <div className='ml-3'>
                    <Link className='block truncate max-w-[100px] text-sm cursor-pointer leading-4 font-semibold text-gray-900 dark:text-white hover:underline' href={`/profile/${paymail}`}>  
                        {userName}
                    </Link>
                    <Link className='block truncate max-w-[100px] text-xs leading-4 cursor-pointer text-gray-500 hover:underline' href={`/profile/${paymail}`}>
                        {paymail}
                    </Link>
                </div>
                <div className='grow'/>
                <div className='block'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-gray-700 hover:dark:text-gray-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </div>
            </div>):(         
                <div className='flex flex-col w-full px-5'>
                    <Link href="/">
                        <LogoTitle/>
                    </Link>
                    <div
                        onClick={()=>setWalletPopupOpen(true)}
                        className='flex mt-4 transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-500 to-primary-600  justify-center items-center cursor-pointer relative'>
                        <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                        <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white">
                        </path>
                        </svg>
                    <span className='ml-4'><FormattedMessage id="Connect"/></span>
                </div>
                </div>
            )}
            <div className='my-5 overflow-y-scroll flex flex-col w-full'>
                <Link href="/">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <div className='text-base leading-4 grow'><FormattedMessage id="Home"/></div>
                    </div>
                </Link>
                {/* <Link href="/notifications">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <div className='text-base leading-4 grow'>Notifications</div>
                    </div>
                </Link> */}
                <Link href={chatPath}>
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <div className='text-base leading-4 grow'>Chat</div>
                    </div>
                </Link>
                {authenticated && <Link href={walletPath}>
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 mr-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                        </svg>
                        <div className='text-base leading-4 grow'>Wallet</div>
                    </div>                    
                </Link>}
                <Link href={meetPath}>
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 mr-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <div className='text-base leading-4 grow'>Meet</div>
                    </div>
                </Link>
                <Link href={calendarPath}>
                <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 mr-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>
                        <div className='text-base leading-4 grow'>Events</div>
                    </div>
                </Link>
                {/* <Link href={`/watch`}>
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 mr-2.5">
                            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10 0 .685-.07 1.354-.201 2h-.973c-.975 0-1.129-.507-1.656-2.461-.381-1.414-1.014-3.551-2.408-3.551-1.42 0-1.969 2.215-2.48 4.006-.278.973-.446 1.561-.695 1.561-.24 0-.353-.588-.635-1.563-.528-1.822-1.132-4.003-2.541-4.003-1.463 0-2.088 2.387-2.507 3.908-.304 1.105-.399 1.659-.669 1.659-.229 0-.303-.449-.566-1.344-.602-2.04-.793-4.208-3.48-4.208h-.35c1.546-3.53 5.068-6.004 9.161-6.004zm0 20c-5.514 0-10-4.486-10-10 0-.685.07-1.354.201-2h1.073c.94 0 1.032.471 1.552 2.435.351 1.328.996 3.551 2.408 3.551 1.43 0 2.033-2.26 2.579-4.132.296-1.015.36-1.436.597-1.436.254 0 .328.467.618 1.491.524 1.851 1.13 4.076 2.558 4.076 1.28 0 1.892-1.836 2.336-3.311.508-1.686.582-2.312.84-2.312.264 0 .312.546.768 2.074.735 2.463 1.204 3.564 3.173 3.564h.456c-1.547 3.527-5.067 6-9.159 6z"/>
                        </svg>
                        <div className='text-base leading-4 grow'>Videos</div>
                    </div>
                </Link> */}
                <Link href={`https://pow.vision`} target='_blank'>
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 mr-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        <div className='text-base leading-4 grow'>Vision</div>
                    </div>
                </Link>
                <Link href={issuePath}>
                <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 mr-2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
                    </svg>
                    <div className='text-base leading-4 grow'>Issues</div>
                    </div>
                </Link>
                {/* <Link href={marketPath}>
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        <div className='text-base leading-4 grow'><FormattedMessage id="Market"/></div>
                    </div>
                </Link> */}
                {/* <Link href="/discover">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <div className='text-base leading-4 grow'>Discover</div>
                    </div>
                </Link> */}
                {/* <Link href="/academy">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-md xl:rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                        <div className='text-base leading-4 grow'>Academy</div>
                    </div>
                </Link>*/}
                {/* <Link href="/features">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <div className='text-base leading-4 grow'>Features</div>
                    </div>
                </Link>  */}
                <Link href="/topics">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 mr-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                        </svg>
                        <div className='text-base leading-4 grow'>Topics</div>
                    </div>
                </Link> 
	        {!subdomain && (
                <Link href="/jobs">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-gray-300 hover:dark:bg-gray-700 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 mr-2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                        </svg>

                        <div className='text-base leading-4 grow'>Jobs</div>
                    </div>
                </Link>)}
		{!subdomain && (
                <Link href="/faq">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-gray-300 hover:dark:bg-gray-700 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        <div className='text-base leading-4 grow'>F.A.Q.</div>
                    </div>
                </Link>)}
                <Link href="/settings">
                    <div className='mt-4 flex items-center cursor-pointer px-5 rounded-none hover:transition-all hover:bg-primary-300 hover:dark:bg-primary-700/20 h-8 xl:h-[48px]'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className='text-base leading-4 grow'><FormattedMessage id="Settings"/></div>
                    </div>
                </Link>
            </div>
            <div className='grow'/>
            <div className='flex items-center justify-between'>
                <div onClick={toggleTheme} className='flex w-full px-6 justify-start'>
                    <svg 
                        className={`cursor-pointer ${theme ==="dark" ? "fill-primary-500/30 hover:fill-primary-100/30":"fill-primary-500 hover:fill-primary-700"}`}
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
            {authenticated && <div className='flex w-full px-6 justify-start mt-6'>
                {/* <Link href="/invite">
                    <div className='cursor-pointer flex items-center rounded-md bg-gray-300 dark:bg-gray-900 py-2 pl-0.5 pr-1 w-fit max-w-full'>
                        <p className='text-xs text-gray-900 dark:text-white leading-4 mr-2.5'>{me.referralLinkByReferralLinkId.shortLinkUrl}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                </Link> */}
            </div>}
        </div>
        <Drawer
            selector="#walletProviderPopupControler"
            isOpen={walletPopupOpen}
            onClose={() => setWalletPopupOpen(false)}
        >
            <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)}/>
        </Drawer>
    </div>
  )
}

export default SideBarDrawer
