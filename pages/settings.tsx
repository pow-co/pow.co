import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import Drawer from "../components/Drawer";
import PanelLayout from "../components/PanelLayout";
import WalletProviderPopUp from "../components/WalletProviderPopUp";
import { useRelay } from "../context/RelayContext";
import { useSensilet } from "../context/SensiletContext";
import { useHandCash } from "../context/HandCashContext";
import { useTwetch } from "../context/TwetchContext";
import useWallet from "../hooks/useWallet";
import TuningPanel from "../components/TuningPanel";

import { FormattedMessage } from "react-intl";
import LocaleSelect from "../components/LocaleSelect";
import { useBitcoin } from "../context/BitcoinContext";
import { useLocalWallet } from "../context/LocalWalletContext";
import WalletSelect from "../components/WalletSelect";
import { useTuning } from "../context/TuningContext";
import Meta from "../components/Meta";

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout, authenticated, setWallet, setWalletPopupOpen, walletPopupOpen } = useBitcoin();
  const { signPosts, setSignPosts } = useTuning();
  const { web3, web3Account, sensiletLogout, sensiletAuthenticate } = useSensilet()
  const [isDark, setIsDark] = useState(theme === "dark");
  const [sensiletChecked, setSensiletChecked] = useState(!!web3Account)

  const { handcashAuthenticated, handcashAuthenticate, handcashPaymail, handcashLogout } = useHandCash()
  const { relayxWallet, relayxLogout, relayxAuthenticate } = useRelay()
  const { localWalletLogout, localWallet } = useLocalWallet()
  const { twetchWallet, twetchLogout } = useTwetch()
  const wallet = useWallet()

  useEffect(() => {
    if (theme === "dark") {
      setIsDark(true);
    }
    if (theme === "light") {
      setIsDark(false);
    }
  }, [theme]);

  async function connectSensilet() {

    sensiletAuthenticate()

  }

  useEffect(() => {

    setSensiletChecked(!!web3Account)

  }, [web3Account])

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    }
    if (theme === "light") {
      setTheme("dark");
    }
  };

  const handleHandcashLogin = (e:any) => {
    e.preventDefault();
    setWallet("handcash")
    handcashAuthenticate()
  }
    
  function handleLogout(walletName: string) {

    switch(walletName) {

    case 'relayx':

      relayxLogout()

      break;

    case 'handcash':

      handcashLogout()

      break;

    case 'twetch':

      twetchLogout()

      break;

    case 'local':

      localWalletLogout()

      break;

    case 'sensilet':

      sensiletLogout()

      break;

    }

    if (wallet?.name === walletName) {

      setWallet(null)
    }

  }

  return (
    <>
    <Meta title='Settings | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <PanelLayout>
      <div className="mx-auto max-w-xl col-span-12 lg:col-span-6 min-h-screen flex flex-col ">
        <div className="mt-7  p-4  ">
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex flex-col cursor-pointer my-4 rounded-lg">
            <p className="text-base font-semibold mb-2 text-gray-700 dark:text-white">
              <FormattedMessage id="Tuning Panel" />
            </p>
            <TuningPanel />
          </div>
          {/* <div
            onClick={() => setWalletPopupOpen(true)}
            className="bg-gray-100 dark:bg-gray-600 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg"
          >
            <div className="flex flex-col">
              <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                Select Wallet Provider
              </p>
              <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                Choose your way to interact with our app
              </p>
            </div>
            <div className="grow" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div> */}
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
            <div className="flex flex-col">
              <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                <FormattedMessage id="Dark Mode" />
              </p>
              <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                <FormattedMessage id="Toggle between dark and light mode" />
              </p>
            </div>
            <div className="grow" />
            <div className="relative">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id="toggleTheme"
                    type="checkbox"
                    className="sr-only"
                    checked={isDark}
                    onChange={toggleTheme}
                  />
                  <div className={`w-10 toggle h-4 ${isDark ? "bg-primary-500" : "bg-gray-400"} rounded-full shadow-inner`}></div>
                  <div className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${isDark ? 'transform translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
            <div className="flex flex-col">
              <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                Sign with paymail
              </p>
              <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                Sign your interactions with your wallet's paymail by default
              </p>
            </div>
            <div className="grow" />
            <div className="relative">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id="toggleTheme"
                    type="checkbox"
                    className="sr-only"
                    checked={signPosts}
                    onChange={()=>setSignPosts(!signPosts)}
                  />
                  <div className={`w-10 toggle h-4 ${signPosts ? "bg-primary-500" : "bg-gray-400"} rounded-full shadow-inner`}></div>
                  <div className={`dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${signPosts ? 'transform translate-x-6' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
            <div className="flex flex-col">
              <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                <FormattedMessage id="Language settings" />
              </p>
              <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                <FormattedMessage id="Interact with this app in your language" />
              </p>
            </div>
            <div className="grow" />
            <div className="relative">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <LocaleSelect />
                </div>
              </label>
            </div>
          </div>
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
            <div className="flex flex-col">
              <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                {/* <FormattedMessage id="Language settings" /> */}
                Select Wallet
              </p>
              <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                {/* <FormattedMessage id="Interact with this app in your language" /> */}
                Chose the BitCoin wallet you want to interact this app with
              </p>

            </div>
            <div className="grow" />
            
              <div className="relative flex items-center">
                <button
                  onClick={()=>setWalletPopupOpen(true)}
                  type="button"
                  onKeyDown={()=>setWalletPopupOpen(true)}
                  className="relative ml-4 flex h-8 w-fit cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1"
                >
                  <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                    <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white" />
                  </svg>
                  <span className="ml-4">{wallet ? capitalizeFirstLetter(wallet.name):<FormattedMessage id="Connect" />}</span>
                </button>
              </div>
  
          </div>

          {handcashPaymail && (

            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Handcash Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <a href={`#`}>
                    <FormattedMessage id={`${handcashPaymail}`} />
                  </a>
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <button onClick={() => handleLogout('handcash') }>
                      <FormattedMessage id="Log out" />
                    </button>
                  </div>
                </label>
              </div>
            </div>

          )}

          {relayxWallet?.paymail && (

            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Relayx Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <a href={`#`}>
                    <FormattedMessage id={`${relayxWallet.paymail}`} />
                  </a>
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                      <button onClick={() => handleLogout('relayx')}><FormattedMessage id='Log out' /></button>
                  </div>
                </label>
              </div>
            </div>

          )}

          {twetchWallet && (

            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Twetch Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <a href={`#`}>
                    <FormattedMessage id={`${twetchWallet.paymail}`} />
                  </a>
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                      <button onClick={() => handleLogout('twetch')}><FormattedMessage id='Log out' /></button>
                  </div>
                </label>
              </div>
            </div>

          )}

          {localWallet && (

            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Local Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <a target="_blank" href={`https://whatsonchain.com/address/${localWallet.address}`}>
                    <FormattedMessage id={`${localWallet.address}`} />
                  </a>
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
        <button onClick={() => handleLogout('local') }><FormattedMessage id="Log out" /></button>
                  </div>
                </label>
              </div>
            </div>

          )}

          {web3Account ? (
            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Sensilet Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <FormattedMessage id={`Sensilet wallet connected ${web3Account}`} />
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
        <button onClick={() => handleLogout('sensilet') }><FormattedMessage id="Log out" /></button>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center min-h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Sensilet Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <FormattedMessage id={`Experimental Feature - Connect Sensilet Wallet`} />
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
        <button onClick={connectSensilet}>Connect Sensilet</button>
                  </div>
                </label>
              </div>
            </div>
          )}

          {authenticated && <button
            onClick={logout}
            className="h-[52px] p-5 flex bg-red-500 text-white text-base font-semibold my-4 w-full border-none rounded-lg cursor-pointer items-center justify-center transition duration-500 transform hover:-translate-y-1 hover:bg-red-600"
          >
            <FormattedMessage id="Log out" />
          </button>}
        </div>
        <div className="grow" />
      </div>
      <Drawer
        selector="#walletProviderPopupControler"
        isOpen={walletPopupOpen}
        onClose={() => setWalletPopupOpen(false)}
      >
        <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
      </Drawer>
    </PanelLayout>
    </>
  );
}
