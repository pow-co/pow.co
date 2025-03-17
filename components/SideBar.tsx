import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { FormattedMessage } from 'react-intl';
import UserIcon from './UserIcon';
import Drawer from './Drawer';
import WalletProviderPopUp from './WalletProviderPopUp';
import LocaleSelect from './LocaleSelect';

import { useBitcoin } from '../context/BitcoinContext';

const SideBar = () => {
    const { theme, setTheme } = useTheme();
    const {
 authenticated, paymail, avatar, userName, 
} = useBitcoin();
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);
    const subdomain = null;

    const toggleTheme = () => {
        if (theme === "dark") {
          setTheme("light");
        }
        if (theme === "light") {
          setTheme("dark");
        }
    };

  const chatPath = subdomain ? `/chat/${subdomain}` : `/chat/powco`;
  const meetPath = subdomain ? `/meet/${subdomain}` : `/meet/powco`;
  const calendarPath = subdomain ? `/events` : `/events`;
  const walletPath = subdomain ? `/wallet/${subdomain}` : `/wallet`;
  const issuePath = subdomain ? `/issues/${subdomain}` : `/issues`;

  return (
    <div className="flex h-full w-full flex-col items-center bg-primary-200 py-6 dark:bg-primary-800/20 xl:p-6">
        <div className="mb-2.5 flex w-fit items-center xl:w-full ">
            {authenticated ? (
<>
            <Link className="cursor-pointer" href={`/profile/${paymail}`}>
                    <UserIcon src={avatar!} size={36} />
            </Link>
            <div className="ml-3 hidden xl:block">
                <Link className="block max-w-[100px] truncate text-sm font-semibold leading-4 text-gray-900 hover:underline dark:text-white" href="/settings">
                    {userName}
                </Link>
                <Link className="block max-w-[100px] truncate text-xs leading-4 text-gray-500 hover:underline" href="/settings">
                    {paymail}
                </Link>
            </div>
            <div className="grow" />
            <div className="hidden xl:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 hover:dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </div>
</>
)
            : (
                <div
                  onClick={() => setWalletPopupOpen(true)}
                  className="relative ml-4 hidden h-8 cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-base font-semibold leading-4 text-white transition  duration-500 hover:-translate-y-1 xl:flex"
                >
                    <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                    <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white" />
                    </svg>
                    <span className="ml-4"><FormattedMessage id="Connect wallet" /></span>
                </div>
            )}
        </div>
        <div className="flex-col-between grow">
        <Link href="/" className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 xl:mr-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <div className="hidden grow text-base leading-4 xl:block">Home</div>
        </Link>
            <Link href="/home" className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 xl:mr-2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <div className="hidden grow text-base leading-4 xl:block">For You</div>
            </Link>
            <Link href={chatPath}>
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div className="hidden grow text-base leading-4 xl:block">Chat</div>
                </div>
            </Link>
            <Link href="https://pow.vision">
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    <div className="hidden grow text-base leading-4 xl:block">Live</div>
                </div>
            </Link>
            <Link href={meetPath}>
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    <div className="hidden grow text-base leading-4 xl:block">Meet</div>
                </div>
            </Link>
            <Link href="/topics" className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <div className="hidden grow text-base leading-4 xl:block">Topics</div>
            </Link>
            <Link href={calendarPath}>
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="hidden grow text-base leading-4 xl:block">Calendar</div>
                </div>
            </Link>
            <Link href={walletPath}>
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div className="hidden grow text-base leading-4 xl:block">Wallet</div>
                </div>
            </Link>
            <Link href={issuePath}>
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 xl:mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                    </svg>
                    <div className="hidden grow text-base leading-4 xl:block">Issues</div>
                </div>
            </Link>
            {!subdomain && (
            <Link href="/jobs">
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 xl:mr-2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                    </svg>

                    <div className="hidden grow text-base leading-4 xl:block">Jobs</div>
                </div>
            </Link>
            )}
            {!subdomain && (
            <Link href="/faq">
                <div className="mt-4 flex h-8 cursor-pointer items-center rounded-md hover:bg-primary-300 hover:transition-all hover:dark:bg-primary-700/20 xl:h-[48px] xl:rounded-none xl:px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-6 w-6 xl:mr-2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>

                    <div className="hidden grow text-base leading-4 xl:block">F.A.Q.</div>
                </div>
            </Link>
            )}
        </div>
        {authenticated && (
<Link href="/compose">
            <button 
              type="button"
              className=" mb-6 mt-12 hidden w-full cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-400 to-primary-500 px-5 py-2 text-center text-sm font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1 xl:flex"
            >
                {/* <FormattedMessage id="Ask Bitcoin"/> */}
                Create Post
            </button>
</Link>
)}
        <div className="grow" />
        <div className="initial mb-6 xl:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer text-primary-600 hover:text-primary-700  dark:text-primary-400 hover:dark:text-primary-300/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
        </div>
        <div className="flex flex-col items-center justify-center xl:flex-row">
            <div onClick={toggleTheme} className="p-3">
                <svg 
                  className={`cursor-pointer ${theme === "dark" ? "fill-primary-300/20 hover:fill-primary-100/20" : "fill-primary-500 hover:fill-primary-700"}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 19 19" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M14.8976 12.8327C9.68779 12.8327 6.3558 9.58619 6.3558 4.39567C6.3558 3.32308 6.61581 1.79083 6.96249 0.995968C7.04916 0.775706 7.06842 0.641633 7.06842 0.545867C7.06842 0.287298 6.87582 0 6.50025 0C6.39432 0 6.1632 0.0287298 5.95134 0.105343C2.38824 1.52268 0 5.33417 0 9.34677C0 14.9778 4.31424 19 9.95743 19C14.108 19 17.6999 16.5005 18.8941 13.3785C18.9807 13.1583 19 12.9284 19 12.8422C19 12.4879 18.7015 12.2485 18.4318 12.2485C18.3066 12.2485 18.2007 12.2772 18.0177 12.3347C17.2762 12.5741 16.0821 12.8327 14.8976 12.8327Z" />
                </svg>
            </div>
            <LocaleSelect />
        </div>
        {authenticated && (
<div className="mt-6 hidden xl:block">
            {/* <Link href="/invite">
                <div className='cursor-pointer flex items-center rounded-md bg-gray-300 dark:bg-gray-900 py-2 pl-0.5 pr-1 w-fit max-w-full'>
                    <p className='text-xs text-gray-900 dark:text-white leading-4 mr-2.5'>{me.referralLinkByReferralLinkId.shortLinkUrl}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
            </Link> */}
</div>
)}
        <Drawer
          selector="#walletProviderPopupControler"
          isOpen={walletPopupOpen}
          onClose={() => setWalletPopupOpen(false)}
        >
          <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
        </Drawer>
    </div>
  );
};

export default SideBar;
