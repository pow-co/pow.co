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

import LocalWallet from '../wallets/local'

import { DefaultProvider, TestWallet, bsv } from 'scrypt-ts'

class ScryptWallet extends TestWallet {

  get network() {
    return bsv.Networks.mainnet
  }
}

type LocalWalletContextValue = {
   localWalletAuthenticate: (seed:string) => Promise<void>;
   localWalletAuthenticated: boolean;
   localWalletLogout: () => Promise<void>;
   localWalletAvatar: string | undefined;
   localWalletPaymail: string | undefined;
   localWalletUserName: string | undefined;
   localWalletPublicKey: string | undefined | null;
   seedPhrase: string;
   web3: any;
   localWallet: LocalWallet | null | undefined;
   web3Account: string | undefined | null;
   ready: boolean;
   provider: DefaultProvider | undefined | null;
   signer: ScryptWallet | undefined | null;
};

const LocalWalletContext = createContext<LocalWalletContextValue | undefined>(undefined);

const LocalWalletProvider = (props: { children: React.ReactNode }) => {
  const [hasTwetchPrivilege, setHasTwetchPrivilege] = useState(true)
  const [web3, setWeb3] = useState<any>()
  const [web3Account, setWeb3Account] = useState<string | null>()
  const [localWalletPaymail, setLocalWalletPaymail] = useState<string>()
  const [localWalletUserName, setLocalWalletUserName] = useState<string>()
  const [localWalletPublicKey, setLocalWalletPublicKey] = useState<string | null>()
  const [seedPhrase, setSeedPhrase] = useLocalStorage(seedStorageKey);

  const [provider, setProvider] = useState<DefaultProvider | null>();
  const [signer, setSigner] = useState<ScryptWallet | null>();

  const localWalletAvatar = useMemo(() => `https://api.dicebear.com/6.x/pixel-art/svg?seed=${localWalletUserName}`, [localWalletUserName])

  const [ready, setReady] = useState(false);

  const [localWallet, setLocalWallet] = useState<LocalWallet | null | undefined>()

  const localWalletAuthenticate = async (seed: string) => {

    setSeedPhrase(seed)

  }

  useEffect(() => {

    if (localWallet) {

      setLocalWalletUserName(localWallet.address.toString())

      setLocalWalletPaymail(`${localWallet.address.toString()}@pow.co`)

      setLocalWalletPublicKey(localWallet?.privateKey?.publicKey.toString())

    } else {
      
      setLocalWalletUserName(undefined)

      setLocalWalletPaymail(undefined)

      setLocalWalletPublicKey(undefined)
    }

  }, [localWallet])

  useEffect(() => {

    if (seedPhrase) {

      setLocalWallet(LocalWallet.fromPhrase({ phrase: seedPhrase }))

    }

  }, [seedPhrase])

  useEffect(() => {

    if (!web3) { return }

    web3.wallet.getPublicKey().then((publicKey: string) => {

      console.log('web3.wallet.getPublicKey.result', publicKey)

      setLocalWalletPublicKey(publicKey)

    }).catch((error: any) => {

      console.error('web3.wallet.getPublicKey().error', error)

    })

  }, [web3])

  const localWalletLogout = useCallback(async () => {

    setSeedPhrase(null)
    setLocalWallet(null)

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

  //const localWalletAuthenticated = useMemo(() => !!web3Account, [web3Account]);
  const localWalletAuthenticated = useMemo(() => !!seedPhrase, [seedPhrase]);

  const value = useMemo(
    () => ({
      web3,
      web3Account,
      localWallet,
      localWalletAuthenticate,
      localWalletAuthenticated,
      localWalletLogout,
      localWalletUserName,
      localWalletAvatar,
      localWalletPaymail,
      localWalletPublicKey,
      seedPhrase,
      ready,
      provider,
      signer
    }),
    [
      web3,
      web3Account,
      localWallet,
      localWalletAuthenticate,
      localWalletAuthenticated,
      localWalletLogout,
      localWalletUserName,
      localWalletAvatar,
      localWalletPaymail,
      localWalletPublicKey,
      seedPhrase,
      ready,
      provider,
      signer
    ]
  );

  return (<LocalWalletContext.Provider value={value} {...props} />);
};

const useLocalWallet = () => {
  const context = useContext(LocalWalletContext);
  if (context === undefined) {
    throw new Error("useLocalWallet must be used within a LocalWalletProvider");
  }
  return context;
};

export { LocalWalletProvider, useLocalWallet };

//
// Utils
//

const seedStorageKey = `${config.appname}__LocalWallet_seed`
