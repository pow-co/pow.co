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
import { useLocalWallet } from "../context/LocalWalletContext";
import WalletSelect from "../components/WalletSelect";
import { useTuning } from "../context/TuningContext";
import Meta from "../components/Meta";

const ConnectedWallet = () => {
  const { wallet } = useBitcoin()
  switch (wallet) {
    case "relayx":
      return (
        <div className="relative flex h-8 w-full cursor-pointer items-center justify-around rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 py-5 px-1 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="12" fill="#2669FF" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.37486 8.02608C5.3852 8.01494 5.39556 8.00383 5.40596 7.99275L5.74275 7.65596C5.62697 7.76465 5.51465 7.87698 5.40596 7.99275L5.37486 8.02608Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.625 10.875C20.625 6.73286 17.2671 3.375 13.125 3.375C10.9683 3.375 9.02415 4.28535 7.65596 5.74275L5.74275 7.65596L5.40596 7.99275C5.39556 8.00383 5.3852 8.01494 5.37486 8.02608C4.13377 9.3642 3.375 11.156 3.375 13.125C3.375 17.2671 6.73286 20.625 10.875 20.625C12.8917 20.625 14.7225 19.829 16.0704 18.5341L18.4578 16.1486C19.7977 14.7938 20.625 12.931 20.625 10.875ZM15.8158 15.8158C15.0166 16.2521 14.0997 16.5 13.125 16.5C10.0184 16.5 7.5 13.9816 7.5 10.875C7.5 9.90027 7.74792 8.98345 8.18415 8.18415C8.98345 7.74793 9.90027 7.5 10.875 7.5C13.9816 7.5 16.5 10.0184 16.5 13.125C16.5 14.0997 16.2521 15.0166 15.8158 15.8158ZM11.0933 5.62812C15.062 5.74155 18.2585 8.93804 18.3719 12.9067C18.6161 12.2765 18.75 11.5914 18.75 10.875C18.75 7.7684 16.2316 5.25 13.125 5.25C12.4086 5.25 11.7235 5.38393 11.0933 5.62812ZM5.25 13.125C5.25 12.4086 5.38393 11.7235 5.62812 11.0933C5.74155 15.062 8.93804 18.2585 12.9067 18.3719C12.2765 18.6161 11.5914 18.75 10.875 18.75C7.7684 18.75 5.25 16.2316 5.25 13.125Z"
              fill="white"
            />
          </svg>
          <p className=" ml-2.5 ">RelayX</p>
          <div className="grow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </div>
      )
    case "twetch":
      return (
        <div className="relative flex h-8 w-full cursor-pointer items-center justify-around rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 py-5 px-1 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">
          <svg
            viewBox="0 0 102 110"
            fill="none"
            width="24"
            height="24"
            className="bg-gray-700 p-1 rounded"
          >
            <path
              d="M3.66391 55.0011C-1.39212 46.1876 -1.04744 35.7272 3.66391 27.5017C8.37755 35.7272 8.72222 46.1876 3.66391 55.0011ZM3.66391 55.0011C-1.04744 63.2266 -1.39212 73.6871 3.66391 82.5006C8.72222 73.6871 8.37755 63.2266 3.66391 55.0011ZM51.0011 0C46.2898 8.22548 45.9451 18.6859 51.0011 27.4994C56.0572 18.6859 55.7125 8.22548 51.0011 0ZM51.0011 27.5017C46.2898 35.7272 45.9451 46.1876 51.0011 55.0011C56.0572 46.1876 55.7125 35.7272 51.0011 27.5017ZM51.0011 55.0011C46.2898 63.2266 45.9451 73.6871 51.0011 82.5006C56.0572 73.6871 55.7125 63.2266 51.0011 55.0011ZM51.0011 82.5006C46.2898 90.7261 45.9451 101.186 51.0011 110C56.0572 101.186 55.7125 90.7261 51.0011 82.5006ZM98.3361 27.5017C93.6247 35.7272 93.2801 46.1876 98.3361 55.0011C103.392 46.1876 103.047 35.7272 98.3361 27.5017ZM98.3361 55.0011C93.6247 63.2266 93.2801 73.6871 98.3361 82.5006C103.392 73.6871 103.047 63.2266 98.3361 55.0011ZM27.3325 13.7497C32.3908 22.5655 41.5647 27.4925 51.0011 27.4994C46.2761 19.2808 37.4469 13.7497 27.3325 13.7497ZM27.3325 13.7497C37.4469 13.7497 46.2761 8.21859 51.0011 0C41.5647 0.00689093 32.3908 4.93621 27.3325 13.7497ZM27.3325 13.7497C22.2765 22.5655 22.6212 33.026 27.3325 41.2514C32.0462 33.026 32.3908 22.5655 27.3325 13.7497ZM3.66619 27.4994C13.1026 27.4925 22.2765 22.5632 27.3325 13.7497C17.2182 13.7497 8.38896 19.2808 3.66619 27.4994ZM74.6675 13.7497C79.7258 22.5655 88.8997 27.4925 98.3361 27.4994C93.611 19.2808 84.7818 13.7497 74.6675 13.7497ZM74.6675 13.7497C69.6114 22.5655 69.9561 33.026 74.6675 41.2514C79.3811 33.026 79.7258 22.5655 74.6675 13.7497ZM51.0011 27.4994C60.4375 27.4925 69.6114 22.5632 74.6675 13.7497C64.5531 13.7497 55.7239 19.2808 51.0011 27.4994ZM51.0011 0C55.7239 8.21859 64.5554 13.7497 74.6675 13.7497C69.6114 4.93621 60.4375 0.00689093 51.0011 0ZM27.3325 41.2491C32.3908 50.0649 41.5647 54.992 51.0011 54.9989C46.2761 46.7803 37.4469 41.2491 27.3325 41.2491ZM27.3325 41.2491C37.4469 41.2491 46.2761 35.718 51.0011 27.4994C41.5647 27.5063 32.3908 32.4356 27.3325 41.2491ZM27.3325 41.2491C22.2765 50.0649 22.6212 60.5254 27.3325 68.7509C32.0462 60.5254 32.3908 50.0649 27.3325 41.2491ZM3.66619 55.0011C13.1026 54.9943 22.2765 50.0649 27.3325 41.2514C17.2182 41.2491 8.38896 46.7803 3.66619 55.0011ZM3.66619 27.4994C8.38896 35.718 17.2205 41.2491 27.3325 41.2491C22.2765 32.4356 13.1003 27.5063 3.66619 27.4994ZM74.6675 41.2491C79.7258 50.0649 88.8997 54.992 98.3361 54.9989C93.611 46.7803 84.7818 41.2491 74.6675 41.2491ZM74.6675 41.2491C84.7818 41.2491 93.611 35.718 98.3361 27.4994C88.8997 27.5063 79.7258 32.4356 74.6675 41.2491ZM74.6675 41.2491C69.6114 50.0649 69.9561 60.5254 74.6675 68.7509C79.3811 60.5254 79.7258 50.0649 74.6675 41.2491ZM51.0011 55.0011C60.4375 54.9943 69.6114 50.0649 74.6675 41.2514C64.5531 41.2491 55.7239 46.7803 51.0011 55.0011ZM51.0011 27.4994C55.7239 35.718 64.5554 41.2491 74.6675 41.2491C69.6114 32.4356 60.4375 27.5063 51.0011 27.4994ZM27.3325 68.7509C32.3908 77.5667 41.5647 82.4937 51.0011 82.5006C46.2761 74.282 37.4469 68.7509 27.3325 68.7509ZM27.3325 68.7509C37.4469 68.7509 46.2761 63.2197 51.0011 55.0011C41.5647 55.008 32.3908 59.9351 27.3325 68.7509ZM27.3325 68.7509C22.2765 77.5667 22.6212 88.0271 27.3325 96.2526C32.0462 88.0248 32.3908 77.5644 27.3325 68.7509ZM3.66619 82.5006C13.1026 82.4937 22.2765 77.5644 27.3325 68.7509C17.2182 68.7509 8.38896 74.282 3.66619 82.5006ZM3.66619 55.0011C8.38896 63.2197 17.2205 68.7509 27.3325 68.7509C22.2765 59.9351 13.1003 55.008 3.66619 55.0011ZM74.6675 68.7509C79.7258 77.5667 88.8997 82.4937 98.3361 82.5006C93.611 74.282 84.7818 68.7509 74.6675 68.7509ZM74.6675 68.7509C84.7818 68.7509 93.611 63.2197 98.3361 55.0011C88.8997 55.008 79.7258 59.9351 74.6675 68.7509ZM74.6675 68.7509C69.6114 77.5667 69.9561 88.0271 74.6675 96.2526C79.3811 88.0248 79.7258 77.5644 74.6675 68.7509ZM51.0011 82.5006C60.4375 82.4937 69.6114 77.5644 74.6675 68.7509C64.5531 68.7509 55.7239 74.282 51.0011 82.5006ZM51.0011 55.0011C55.7239 63.2197 64.5554 68.7509 74.6675 68.7509C69.6114 59.9351 60.4375 55.008 51.0011 55.0011ZM27.3325 96.2503C32.3908 105.066 41.5647 109.993 51.0011 110C46.2761 101.781 37.4469 96.2503 27.3325 96.2503ZM27.3325 96.2503C37.4469 96.2503 46.2761 90.7192 51.0011 82.5006C41.5647 82.5075 32.3908 87.4368 27.3325 96.2503ZM3.66619 82.5006C8.38896 90.7192 17.2205 96.2503 27.3325 96.2503C22.2765 87.4368 13.1003 82.5075 3.66619 82.5006ZM74.6675 96.2503C84.7818 96.2503 93.611 90.7192 98.3361 82.5006C88.8997 82.5075 79.7258 87.4368 74.6675 96.2503ZM51.0011 110C60.4375 109.993 69.6114 105.064 74.6675 96.2503C64.5531 96.2503 55.7239 101.781 51.0011 110ZM51.0011 82.5006C55.7239 90.7192 64.5554 96.2503 74.6675 96.2503C69.6114 87.4368 60.4375 82.5075 51.0011 82.5006Z"
              fill="white"
            ></path>
          </svg>
          <p className=" ml-2.5 ">Twetch</p>
          <div className="grow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </div>
      )
    case "handcash":
      return (
        <div className="relative flex h-8 w-full cursor-pointer items-center justify-around rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 py-5 px-1 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">
          <img src="/handcash_green_icon.webp" className="rounded-full h-6 w-6" />
          <p className=" ml-2.5 ">Handcash</p>
          <div className="grow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </div>
      )
    case "sensilet":
      return (
        <div className="relative flex h-8 w-full cursor-pointer items-center justify-around rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 py-5 px-1 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">
          <img src="/sensilet.png" className="h-6 w-6"/>
          <p className=" ml-2.5 ">Sensilet</p>
          <div className="grow"/>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </div>
      )
    case "local":
      return (
        <div className="relative flex h-8 w-full cursor-pointer items-center justify-around rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 py-5 px-1 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 2499.6 2500" viewBox="0 0 2499.6 2500" className="h-6 w-6">
            <path d="m2499.6 1250c0 690.2-559.6 1249.8-1250.1 1249.9-690 0-1249.6-559.7-1249.5-1250-.2-690.3 559.4-1249.9 1249.7-1249.9s1249.9 559.7 1249.9 1250z" fill="#eab300"/><g fill="#fff"><path d="m1741.5 943.8c-16.1-167.4-160.6-223.5-343.2-239.5v-232.3h-141.3v226.1c-37.1 0-75.1.7-112.8 1.5v-227.6h-141.3l-.1 232.1c-30.6.6-60.7 1.2-90 1.2v-.7l-194.9-.1v151s104.4-2 102.6-.1c57.3 0 75.9 33.2 81.3 61.9v264.6c4 0 9.1.2 14.9 1h-14.9l-.1 370.7c-2.5 18-13.1 46.7-53.1 46.8 1.8 1.6-102.7 0-102.7 0l-28.1 168.8h184c34.2 0 67.9.6 100.9.8l.1 234.9h141.2v-232.4c38.7.8 76.2 1.1 112.9 1.1l-.1 231.3h141.3v-234.4c237.6-13.6 404.1-73.5 424.7-296.7 16.7-179.7-67.8-260-202.7-292.4 82.1-41.6 133.4-115.1 121.4-237.6zm-197.8 502.2c0 175.5-300.5 155.6-396.4 155.6v-311.3c95.9.2 396.4-27.3 396.4 155.7zm-65.8-439.1c0 159.7-250.8 141-330.6 141.1v-282.2c79.9 0 330.7-25.4 330.6 141.1z"/>
            <path d="m902 1175.7h21v15.5h-21z"/>
            </g>
          </svg>
          <p className=" ml-2.5 ">Seed</p>
          <div className="grow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </div>
      )
    default:
        return <></>
  }
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout, authenticated, setWallet } = useBitcoin();
  const { signPosts, setSignPosts } = useTuning();
  const { web3, web3Account, sensiletLogout, sensiletAuthenticate } = useSensilet()
  const [isDark, setIsDark] = useState(theme === "dark");
  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const [sensiletChecked, setSensiletChecked] = useState(!!web3Account)

  const { handcashAuthenticated, handcashAuthenticate, handcashPaymail, handcashLogout } = useHandCash()
  const { localWalletLogout, localWallet } = useLocalWallet()

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
            <div className="flex flex-col max-w-[144px] sm:max-w-[333px]">
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
                    >
                    {!authenticated ? (
                      <div className="relative ml-4 flex h-8 w-fit cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">
                        <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                          <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white" />
                        </svg>
                        <span className="ml-4"><FormattedMessage id="Connect" /></span>
                      </div>
                    ):(
                        <ConnectedWallet />
                    )}
                  </button>
              </div>
  
          </div>

          {/* {localWallet && (

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
        <button onClick={localWalletLogout}>Clear Local Wallet</button>
                  </div>
                </label>
              </div>
            </div>

          )} */}

{/*           {web3Account ? (
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
        <button onClick={sensiletLogout}>Logout Sensilet</button>
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
 */}          

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
