'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormattedMessage } from 'react-intl';
import Drawer from './v13_Drawer';
import UserIcon from './UserIcon';
import WalletProviderPopUp from './WalletProviderPopUp';
import SideBarDrawer from './SideBarDrawer';
import LogoTitle from './LogoTitle';
import TuningProviderPopUp from './TuningProviderPopup';
import { useBitcoin } from '../v13_context/BitcoinContext';

function Header() {
  const {
    authenticated, avatar, authenticate, paymail,
  } = useBitcoin();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const [tuningPopupOpen, setTuningPopupOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname()

  const openDrawer = (e: any) => {
    e.stopPropagation();
    setIsDrawerOpen(true);
  };

  const login = (e: any) => {
    e.preventDefault();
    authenticate();
  };
  return (
    <div className="fixed -top-16 left-0 z-50 w-screen backdrop-blur-md lg:bg-primary-200 lg:opacity-90 lg:dark:bg-primary-800/20 ">
      <div className="h-16 bg-red-500 " />
      <div className="relative flex h-[50px] items-center justify-between px-4 lg:h-16 lg:px-7">
        <div className="flex w-24 items-center lg:hidden">
          <button className="cursor-pointer" type="button" onClick={openDrawer} onKeyDown={openDrawer}>
            {authenticated ? <UserIcon src={avatar!} size={36} />
              : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
          </button>
          <div className='ml-4 h-8 w-8'/>
          <Link href="/search" className="h-8">
            <div className="relative ml-4 flex h-8 w-8 cursor-pointer items-center justify-center">
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
        <div className="flex w-full items-center justify-center sm:justify-start">
          <Link href="/">
            <LogoTitle />
          </Link>
        </div>
        <div className="" id="price-womp" />
        <Drawer selector="#drawerControler" isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <SideBarDrawer />
        </Drawer>
        <div className="hidden grow items-center justify-end lg:flex">
          <Link href="/search">
            <div className="relative ml-4 flex h-8 w-8 cursor-pointer items-center justify-center">
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
          <Link href="/chat">
            <div className="relative ml-4 flex h-8 w-8 cursor-pointer items-center justify-center">
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
          </Link>
          {authenticated ? (
            <>
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
              <Link href={`/profile/${paymail}`}>
                <div className="relative ml-4 flex h-8 w-8 cursor-pointer items-center justify-center">
                  <UserIcon src={avatar!} size={36} />
                </div>
              </Link>
            </>
          ) : (
            <button
              onClick={()=>setWalletPopupOpen(true)}
              type="button"
              onKeyDown={()=>setWalletPopupOpen(true)}
              className="relative ml-4 flex h-8 w-fit cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1"
            >
              <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white" />
              </svg>
              <span className="ml-4"><FormattedMessage id="Connect" /></span>
            </button>

          )}
        </div>
        <div className="flex w-24 items-center justify-end lg:hidden">
          <Link href="/chat" className="h-8">
            <div className="relative ml-4 flex h-8 w-8 cursor-pointer items-center justify-center">
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
          </Link>
          {pathname !== '/settings' && (
            <button type="button" onClick={() => setTuningPopupOpen(true)} onKeyDown={() => setTuningPopupOpen(true)} className="relative ml-4 flex h-8 w-8 cursor-pointer items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-700 dark:text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </button>
          )}
          {authenticated ? (null
          /* <Link href="/notifications" className="h-8 mr-2">
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
            </Link> */
          ) : (
            <button
              type="button"
              onClick={()=>setWalletPopupOpen(true)}
              onKeyDown={()=>setWalletPopupOpen(true)}
              className="relative ml-2 flex h-8 cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 px-3 text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1"
            >
              <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white" />
              </svg>
              {/* <span className='ml-2'>Connect</span> */}
            </button>
          )}
        </div>
      </div>
      <Drawer
        selector="#tuningProviderPopupControler"
        isOpen={tuningPopupOpen}
        onClose={() => setTuningPopupOpen(false)}
      >
        <TuningProviderPopUp onClose={() => setTuningPopupOpen(false)} />
      </Drawer>
      <Drawer
        selector="#walletProviderPopupControler"
        isOpen={walletPopupOpen}
        onClose={() => setWalletPopupOpen(false)}
      >
        <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
      </Drawer>
    </div>
  );
}

export default Header;
