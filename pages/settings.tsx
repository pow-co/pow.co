import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import Drawer from "../components/Drawer";
import PanelLayout from "../components/PanelLayout";
import WalletProviderPopUp from "../components/WalletProviderPopUp";
import { useRelay } from "../context/RelayContext";
import { useSensilet } from "../context/SensiletContext";
import { useHandCash } from "../context/HandCashContext";
import TuningPanel from "../components/TuningPanel";

import { FormattedMessage } from "react-intl";
import LocaleSelect from "../components/LocaleSelect";
import { useBitcoin } from "../context/BitcoinContext";
import WalletSelect from "../components/WalletSelect";
import { useTuning } from "../context/TuningContext";
import Meta from "../components/Meta";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout, authenticated } = useBitcoin();
  const { signPosts, setSignPosts } = useTuning();
  const { web3, web3Account, sensiletLogout, sensiletAuthenticate } = useSensilet()
  const [isDark, setIsDark] = useState(theme === "dark");
  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const [sensiletChecked, setSensiletChecked] = useState(!!web3Account)

  const { handcashAuthenticated, handcashAuthenticate, handcashPaymail, handcashLogout } = useHandCash()

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
            className="bg-gray-100 dark:bg-gray-600 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg"
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
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
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
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
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
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
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

          {handcashAuthenticated ? (
            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Handcash Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <FormattedMessage id={`Handcash wallet connected ${handcashPaymail}`} />
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
        <button onClick={handcashLogout}>Logout Handcash</button>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Handcash Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <FormattedMessage id={`Experimental Feature - Connect Handcash Wallet`} />
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
        <button onClick={() => handcashAuthenticate()}>Connect Handcash</button>
                  </div>
                </label>
              </div>
            </div>
          )}
          

          {web3Account ? (
            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
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
        <button onClick={sensiletLogout}>Logout Sensilet</button>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
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
          
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
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
            <div className="relative">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <WalletSelect />
                </div>
              </label>
            </div>
          </div>
          {authenticated && <button
            onClick={logout}
            className="h-[52px] p-5 flex bg-red-500 text-white text-base font-semibold my-4 w-full border-none rounded-lg cursor-pointer items-center justify-center transition duration-500 transform hover:-translate-y-1 hover:bg-red-600"
          >
            <FormattedMessage id="Log out" />
          </button>}
        </div>
        <div className="grow" />
        {/* <p className="mb-[68px] text-center text-xs text-gray-700 dark:text-gray-300 font-semibold ">
          Built for profit by
          <a
            href="https://twetch.com/u/652"
            target="_blank"
            rel="noreferrer"
            className="ml-1 cursor-pointer hover:underline"
          >
            @652
          </a>
          , powered by BitCoin
        </p> */}
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
