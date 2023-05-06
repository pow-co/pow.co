import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { lsTest, useLocalStorage } from "../utils/storage";

import { config } from "../template_config"

import Web3 from '@sensible-contract/sensible-web3'

type SensiletContextValue = {
   sensiletAuthenticate: () => Promise<void>;
   sensiletAuthenticated: boolean;
   sensiletLogout: () => Promise<void>;
   sensiletAvatar: string;
   sensiletPaymail: string;
   sensiletUserName: string;
   web3: any;
   web3Account: string;
   ready: boolean;
};

const SensiletContext = createContext<SensiletContextValue | undefined>(undefined);

const SensiletProvider = (props: { children: React.ReactNode }) => {
  const [hasTwetchPrivilege, setHasTwetchPrivilege] = useState(true)
  const [web3, setWeb3] = useState()
  const [web3Account, setWeb3Account] = useState()
  const [sensiletPaymail, setSensiletPaymail] = useState()
  const [sensiletUserName, setSensiletUserName] = useState()
  const [sensiletPublicKey, setSensiletPublicKey] = useState<string | null>()

  const [ready, setReady] = useState(false);

  useEffect(() => {

	if (web3) { return }

   //@ts-ignore
	let _web3 = new Web3(window?.sensilet)
		console.log('set web3', _web3)
	//@ts-ignore
	setWeb3(_web3);

  }, [])


  useEffect(() => {

    if (!web3Account) {
	    console.log('web3Account.unset')

     } else {

	    console.log('web3Account.set', { web3Account })
     }


  }, [web3Account])

  const sensiletAuthenticate = useCallback(async () => {
    if (!web3) {

      //@ts-ignore
      setWeb3(new Web3(window?.sensilet));
     
    }

    if (web3 && web3.wallet){
    web3.wallet.getAccount().then((account: string) => {

      setWeb3Account(account)

      setSensiletPaymail(`${account}@sensilet`)

      setSensiletUserName(`${account}`)

    }).catch((error: any) => {

      console.error('web3.wallet.getAccount().cancel', error)

    })
}

    web3.wallet.getPublicKey().then(publicKey => {

      setSensiletPublicKey(publicKey)

    }).catch(error => {

      console.error('web3.wallet.getPublicKey().error', error)

    })



  }, [web3]);

  const sensiletLogout = useCallback(async () => {
    if (web3?.wallet) {

	    web3.wallet.exitAccount()
    }

    setWeb3Account(null)

  }, [web3]);
    
  useEffect(() => {
	if (!web3) { return }
	web3.wallet.isConnect().then((isConnected: boolean) => {
		if (isConnected) {

		    web3.wallet.getAccount().then(setWeb3Account).catch((error: any) => {

			console.error('web3.wallet.getAccount().cancel', error)

		    })

		}
        })
  }, [web3])

  const sensiletAuthenticated = useMemo(() => !!web3Account, [web3Account]);

  const value = useMemo(
    () => ({
      web3,
      web3Account,
      sensiletAuthenticate,
      sensiletAuthenticated,
      sensiletLogout,
      sensiletUserName,
      sensiletAvatar,
      sensiletPaymail,
      sensiletPublicKey,
      ready
    }),
    [
      web3,
      web3Account,
      sensiletAuthenticate,
      sensiletAuthenticated,
      sensiletLogout,
      sensiletUserName,
      sensiletAvatar,
      sensiletPaymail,
      sensiletPublicKey,
      ready
    ]
  );

  return (<SensiletContext.Provider value={value} {...props} />);
};

const useSensilet = () => {
  const context = useContext(SensiletContext);
  if (context === undefined) {
    throw new Error("useSensilet must be used within a SensiletProvider");
  }
  return context;
};

export { SensiletProvider, useSensilet };

//
// Utils
//

const paymailStorageKey = `${config.appname}__SensiletProvider_paymail`;
const runOwnerStorageKey = `${config.appname}__SensiletProvider_runOwner`;
const tokenStorageKey = `${config.appname}__SensiletProvider_token`
