import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import { useTheme } from "next-themes";
import Drawer from "../../components/Drawer";
import PanelLayout from "../../components/PanelLayout";
import WalletProviderPopUp from "../../components/WalletProviderPopUp";
import { useRelay } from "../../context/RelayContext";
import TuningPanel from "../../components/TuningPanel";

import { FormattedMessage } from "react-intl";
import LocaleSelect from "../../components/LocaleSelect";
import { useBitcoin } from "../../context/BitcoinContext";
import { useSensilet } from "../../context/SensiletContext";
import WalletSelect from "../../components/WalletSelect";

import Web3 from '@sensible-contract/sensible-web3'

import axios from 'axios'

import { PubKey } from 'scrypt-ts'

const { PersonalInterest } = require('../../contracts/personal-interests/dist/src/contracts/personalInterest')
//import { PersonalInterest } from '../../contracts/personal-interests/src/contracts/personalInterest'

const artifact = require('../../contracts/personal-interests/artifacts/src/contracts/personalInterest.json');

PersonalInterest.loadArtifact(artifact)

interface PersonalInterestResponseItem {}

async function fetchPersonalInterests({ player }: { player: string }): Promise<PersonalInterestResponseItem[]> {

  const { data } = await axios.get(`https://pow.co/api/v1/owners/${player}/personal-interests`)

  return data
  
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout, authenticated } = useBitcoin();
  const { hasTwetchPrivilege } = useRelay()
  const { web3, web3Account, sensiletPublicKey, sensiletLogout, sensiletAuthenticate } = useSensilet()
  const [isDark, setIsDark] = useState(theme === "dark");
  const [walletPopupOpen, setWalletPopupOpen] = useState(false);
  const [sensiletChecked, setSensiletChecked] = useState(!!web3Account)
  const [personalInterests, setPersonalInterests] = useState<PersonalInterestResponseItem[]>([]);
  const [personalInterestsLoading, setPersonalInterestsLoading] = useState<boolean>(false);
  const [pubKey, setPubKey] = useState<PubKey | null>();

  //@ts-ignore
   window.PersonalInterest = PersonalInterest

  useEffect(() => {

    if (sensiletPublicKey) {

      setPubKey(PubKey(sensiletPublicKey))

    } else {

      setPubKey(null)

    }

  }, [sensiletPublicKey])

  useEffect(() => {

    console.log('useEffect.web3Account', web3Account)

    if (!web3Account) {

      return 

    }

    if (!personalInterests) {

      setPersonalInterestsLoading(true)

    }

    fetchPersonalInterests({ player: web3Account }).then(result => {

      console.log('fetchPersonalInterests.result', result)

      setPersonalInterests(result.personal_interests)

    })

  }, [web3Account])

  async function connectSensilet() {
    sensiletAuthenticate()

  }

  useEffect(() => {

    setSensiletChecked(!!web3Account)

    if (web3) {

      //@ts-ignore
      window.web3 = web3

    }

  }, [web3Account])

  async function toggleConnectSensilet() {

    if (!web3Account) {

	    sensiletAuthenticate()
	} else {
	sensiletLogout()
}
  }
  useEffect(() => {
    if (theme === "dark") {
      setIsDark(true);
    }
    if (theme === "light") {
      setIsDark(false);
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    }
    if (theme === "light") {
      setTheme("dark");
    }
  };

  async function submitAddTopic() {

    if (!pubKey) {

      console.log('cannot submit new topic of interest without pubKey set')

      return

    }

    const instance = new PersonalInterest(
        toByteString('music.house.soul', true),
        pubKey,
        1n
    )

    console.log(instance, 'instance')

  }

  return (
    <PanelLayout>
      <div className="mx-auto max-w-xl col-span-12 lg:col-span-6 min-h-screen flex flex-col ">
        <div className="mt-7  p-4  ">
          {web3Account ? (
          <>
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
            {personalInterestsLoading ? (

              <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
                <div className="flex flex-col">
                  <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                    <FormattedMessage id="Loading Your Topics" />
                  </p>
                </div>
                <div className="grow" />
                <div className="relative">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                    </div>
                  </label>
                </div>
              </div>
            ) : ( 
              <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
                <div className="flex flex-col">
                  <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                    <FormattedMessage id="[+] Follow A Topic" />
                  </p>
                  <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                    <FormattedMessage id="Other players can then boost more content that interests you" />
                  </p>
                </div>
                <div className="grow" />
                <div className="relative">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <form onsubmit={submitAddTopic}>
                        <input type="text"/>
                        <input type="submit" className="float-right"/>
                      </form>
                    </div>
                  </label>
                </div>
              </div>
              )}
            </>
	  ) : (
          <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
            <div className="flex flex-col">
              <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                <FormattedMessage id="Sensilet Wallet" />
              </p>
              <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                <FormattedMessage id={`To Customize Your Feed Your Way- Connect Sensilet Wallet`} />
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
  );
}
