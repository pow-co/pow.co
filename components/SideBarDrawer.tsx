import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { FormattedMessage } from 'react-intl';
import UserIcon from './UserIcon';
import WalletProviderPopUp from './WalletProviderPopUp';
import Drawer from './Drawer';
import LocaleSelect from './LocaleSelect';

import { useBitcoin } from '../context/BitcoinContext';

// This is the one that appears on Mobile

const SideBarDrawer = () => {
    const { theme, setTheme } = useTheme();
    const {
 authenticated, avatar, userName, paymail, 
} = useBitcoin();
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);

    const toggleTheme = () => {
        if (theme === "dark") {
          setTheme("light");
        }
        if (theme === "light") {
          setTheme("dark");
        }
      };

  return (
    <div className="fixed inset-0 h-screen w-9/12">
        <div className="flex h-full w-full flex-col items-center bg-primary-200 py-6 dark:bg-primary-900">
            {authenticated ? (
<div className="mb-2.5 flex w-full items-center px-4">
                <Link className="cursor-pointer" href={`/profile/${paymail}`}>
                        <UserIcon src={avatar!} size={36} />
                </Link>
                <div className="ml-3">
                    <Link className="block max-w-[100px] cursor-pointer truncate text-sm font-semibold leading-4 text-gray-900 hover:underline dark:text-white" href={`/profile/${paymail}`}>  
                        {userName}
                    </Link>
                    <Link className="block max-w-[100px] cursor-pointer truncate text-xs leading-4 text-gray-500 hover:underline" href={`/profile/${paymail}`}>
                        {paymail}
                    </Link>
                </div>
                <div className="grow" />
                <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 hover:dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </div>
</div>
)
                : (
                    <div
                      onClick={() => setWalletPopupOpen(true)}
                      className="relative ml-4 flex h-8 cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-base font-semibold leading-4 text-white  transition duration-500 hover:-translate-y-1"
                    >
                        <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                        <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white" />
                        </svg>
                        <span className="ml-4"><FormattedMessage id="Connect wallet" /></span>
                    </div>
                )}
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-center">
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
        </div>
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

export default SideBarDrawer;
