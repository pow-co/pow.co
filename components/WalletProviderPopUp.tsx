import React, { useState } from 'react';
import Image from 'next/image';
import { useBitcoin } from '../context/BitcoinContext';
import { useRelay } from '../context/RelayContext';
import { useTwetch } from '../context/TwetchContext';
import { useHandCash } from '../context/HandCashContext';
import { useSensilet } from '../context/SensiletContext';
import { useYours } from '../context/YoursContext';
import { useLocalWallet } from '../context/LocalWalletContext';

interface WalletProviderProps {
  onClose: () => void
}

const WalletProviderPopUp = ({ onClose }: WalletProviderProps) => {
  const { setWallet } = useBitcoin();
  const { relayxAuthenticate, relayxWallet } = useRelay();
  const { twetchAuthenticate, twetchWallet } = useTwetch();
  const { handcashAuthenticate, handcashAuthenticated } = useHandCash();
  const { sensiletAuthenticate, sensiletWallet } = useSensilet();
  const { yoursAuthenticate, yoursWallet } = useYours();
  const { localWallet } = useLocalWallet();
  
  const [seedInputScreen, setSeedInputScreen] = useState<boolean>(false);
  const [inputSeedPhrase, setInputSeedPhrase] = useState<string>('');

  async function handleSelectWallet(name: string) { 
    switch (name) {
      case 'relayx': {
        try {
          if (!relayxWallet) {
            await relayxAuthenticate();
          }
          setWallet(name);
          onClose(); 
        } catch (error) {
          console.error('error selecting relay wallet', error);
        }
        break;
      }
      case 'twetch': {
        try {
          if (!twetchWallet) {
            await twetchAuthenticate();
          }
          setWallet(name);
          onClose(); 
        } catch (error) {
          console.error('error selecting twetch wallet', error);
        }
        break;
      }
      case 'handcash': {
        try {
          if (!handcashAuthenticated) {
            await handcashAuthenticate();
          }
          setWallet(name);
          onClose();
        } catch (error) {
          console.error('error selecting handcash wallet', error);
        }
        break;
      }
      case 'sensilet': {
        try {
          if (!sensiletWallet) {
            await sensiletAuthenticate();
          }
          setWallet(name);
          onClose();
        } catch (error) {
          console.error('error selecting sensilet wallet', error);
        }
        break;
      }
      case 'yours': {
        try {
          if (!yoursWallet) {
            await yoursAuthenticate();
          }
          setWallet(name);
          onClose();
        } catch (error) {
          console.error('error selecting yours wallet', error);
        }
        break;
      }
      case 'local': {
        try {
          if (localWallet) {
            setWallet(name);
            onClose();
          } else {
            setSeedInputScreen(true);
          }
        } catch (error) {
          console.error('error selecting local wallet', error);
        }
        break;
      }
      default: {
        console.error("Unknown wallet selected:", name);
        break;
      }
    }
  } 

  const handleSeedAuth = async () => {
    try {
      if (!inputSeedPhrase) return;

      // Here we would typically call a function to authenticate with the seed phrase
      setInputSeedPhrase('');
      setSeedInputScreen(false);
      setWallet('local');
      onClose();
    } catch (error) {
      console.error('error with seed auth', error);
    }
  };

  const handleChangeSeedPhrase = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputSeedPhrase(e.target.value);
  };

  return (
    <div id="walletprovider" className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="relative flex justify-center">
        <div className="m-auto flex flex-col space-y-4">
          {!seedInputScreen ? (
          <div className="flex w-[310px] max-w-sm flex-col rounded-lg bg-primary-100 p-5 dark:bg-primary-800">
            <p className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
              Connect Wallet
            </p>
            <button 
              type="button"
              onClick={() => handleSelectWallet('relayx')}
              className="mt-5 flex w-full cursor-pointer flex-row items-center rounded-lg bg-primary-200 px-3 py-2.5 text-primary-600 hover:bg-primary-300 dark:bg-primary-700/20 dark:text-primary-100 hover:dark:bg-primary-700/40"
            >
              <div className="h-5 w-5 rounded">
                <Image 
                  src="/relayx.svg" 
                  width={20} 
                  height={20} 
                  alt="RelayX logo"
                  className="h-5 w-5 rounded" 
                />
              </div>
              <p className="ml-2.5 text-gray-800 dark:text-gray-200">RelayX</p>
              <div className="grow" />
            </button>
            
            <button
              type="button"
              className="mt-3 flex w-full cursor-pointer flex-row items-center rounded-lg bg-primary-200 px-3 py-2.5 text-primary-600 hover:bg-primary-300 dark:bg-primary-700/20 dark:text-primary-100 hover:dark:bg-primary-700/40"
              onClick={() => handleSelectWallet('handcash')}
            >
              <div className="flex h-5 w-5 justify-center rounded-full">
                <Image 
                  src="/handcash_green_icon.webp" 
                  width={20} 
                  height={20} 
                  alt="Handcash logo" 
                  className="h-5 w-5 rounded-full"
                />
              </div>
              <p className="ml-2.5 text-gray-800 dark:text-gray-200 ">HandCash</p>
              <div className="grow" />
            </button>
            
            <button
              type="button"
              className="mt-3 flex w-full cursor-pointer flex-row items-center rounded-lg bg-gray-300 px-3 py-2.5 text-primary-600 hover:bg-gray-400 dark:bg-gray-700 dark:text-primary-100 hover:dark:bg-gray-600"
              onClick={() => handleSelectWallet('twetch')}
            >
              <div className="flex h-5 w-5 justify-center rounded">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 400 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path
                    d="M200 0C89.5 0 0 89.5 0 200C0 310.5 89.5 400 200 400C310.5 400 400 310.5 400 200C400 89.5 310.5 0 200 0ZM200 50C283 50 350 117 350 200C350 283 283 350 200 350C117 350 50 283 50 200C50 117 117 50 200 50Z"
                    fill="#3095CE"
                  />
                  <path
                    d="M200 100C144.8 100 100 144.8 100 200C100 255.2 144.8 300 200 300C255.2 300 300 255.2 300 200C300 144.8 255.2 100 200 100ZM200 125C241.4 125 275 158.6 275 200C275 241.4 241.4 275 200 275C158.6 275 125 241.4 125 200C125 158.6 158.6 125 200 125Z"
                    fill="#3095CE"
                  />
                  <path
                    d="M200 150C173.9 150 152.5 171.4 152.5 197.5C152.5 224.4 175.1 242.5 200 242.5C224.9 242.5 247.5 224.4 247.5 197.5C247.5 171.4 226.1 150 200 150ZM200 217.5C186.2 217.5 175 208.8 175 197.5C175 186.2 187.5 175 200 175C212.5 175 225 188.8 225 200C225 211.2 213.8 217.5 200 217.5Z"
                    fill="#3095CE"
                  />
                </svg>
              </div>
              <p className="ml-2.5 text-gray-800 dark:text-gray-200 ">Twetch (Disabled)</p>
              <div className="grow" />
            </button>
            
            <button
              type="button"
              className="mt-3 flex w-full cursor-pointer flex-row items-center rounded-lg bg-gray-300 px-3 py-2.5 text-primary-600 hover:bg-gray-400 dark:bg-gray-700 dark:text-primary-100 hover:dark:bg-gray-600"
              onClick={() => handleSelectWallet('sensilet')}
            >
              <div className="flex h-5 w-5 justify-center rounded-full">
                <Image 
                  src="/sensilet.png" 
                  width={20} 
                  height={20} 
                  alt="Sensilet logo"
                  className="h-5 w-5" 
                />
              </div>
              <p className="ml-2.5 text-gray-800 dark:text-gray-200 ">Sensilet (Disabled)</p>
              <div className="grow" />
            </button>

          </div>
) : (
            <div className="flex w-[310px] max-w-sm flex-col rounded-lg bg-primary-100 p-5 dark:bg-primary-800">
              <button type="button" onClick={() => setSeedInputScreen(false)} className="left-0 top-0 opacity-80 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 rounded-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div className="-mt-7">
              <p className="text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
                Input Seed
              </p>
              <textarea placeholder="Enter 12 words seed phrase here..." rows={4} value={inputSeedPhrase} onChange={handleChangeSeedPhrase} className="mt-4 w-full appearance-none rounded-lg bg-primary-200 p-4 placeholder:opacity-90 placeholder:hover:text-white/80 focus:border-2 focus:border-primary-500 focus:outline-none dark:bg-primary-900" />
              <div className="mt-4 flex justify-center">
                <button type="button" onClick={handleSeedAuth} className="flex h-8 w-fit cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-primary-500 to-primary-600 p-5 text-center text-base font-semibold leading-4 text-white transition duration-500 hover:-translate-y-1">Authenticate</button>
              </div>
              </div>
            </div>
          )}
          <div onClick={onClose} className="grow cursor-pointer" />
        </div>
        <div onClick={onClose} className="grow cursor-pointer" />
      </div>
    </div>
  );
};

export default WalletProviderPopUp;
