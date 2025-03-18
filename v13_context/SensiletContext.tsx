'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { SensiletSigner, DefaultProvider, bsv } from 'scrypt-ts';

import SensiletWallet from '../wallets/sensilet';

type SensiletContextValue = {
   sensiletWallet: SensiletWallet | undefined | null;
   sensiletAuthenticate: () => Promise<void>;
   sensiletAuthenticated: boolean;
   sensiletLogout: () => Promise<void>;
   sensiletAvatar: string | undefined;
   sensiletPaymail: string | undefined;
   sensiletUserName: string | undefined;
   sensiletPublicKey: string | undefined | null;
   web3: any;
   web3Account: string | undefined | null;
   ready: boolean;
   provider: DefaultProvider;
   signer: SensiletSigner | undefined;
};

const SensiletContext = createContext<SensiletContextValue | undefined>(undefined);

const SensiletProvider = (props: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<any>();
  const [web3Account, setWeb3Account] = useState<string | null>();
  const [sensiletPaymail, setSensiletPaymail] = useState<string>();
  const [sensiletUserName, setSensiletUserName] = useState<string>();
  const [sensiletPublicKey, setSensiletPublicKey] = useState<string | null>();
  const [sensiletWallet, setSensiletWallet] = useState<SensiletWallet | null | undefined>();

  const [provider] = useState<DefaultProvider>(new DefaultProvider({
    network: bsv.Networks.mainnet,
  }));
  const [signer, setSigner] = useState<SensiletSigner>();

  const sensiletAvatar = useMemo(() => `https://api.dicebear.com/6.x/pixel-art/svg?seed=${sensiletUserName}`, [sensiletUserName]);

  const [ready] = useState(false);

  useEffect(() => {
    if (signer || !provider) { return; }
    console.log({ provider });
    setSigner(new SensiletSigner(provider));
  }, [provider, web3Account, signer]); 

  useEffect(() => {
    if (web3) { return; }
    // @ts-ignore
    if (!window.sensilet) { return; }

    import('@sensible-contract/sensible-web3').then(({ default: Web3 }) => {
      console.log("WEB3!", Web3);

      // @ts-ignore
      const web3Instance = new Web3(window?.sensilet);
      console.log('set web3', web3Instance);
      // @ts-ignore
      setWeb3(web3Instance);
    });
  }, [web3]);

  useEffect(() => {
    if (!web3Account) {
      console.log('web3Account.unset');
    } else {
      console.log('web3Account.set', { web3Account });
    }
  }, [web3Account]);

  const sensiletAuthenticate = useCallback(async () => {
    if (!web3) {
      // @ts-ignore
      const Web3Module = (await import('@sensible-contract/sensible-web3')).default;
      // @ts-ignore
      setWeb3(new Web3Module(window?.sensilet));
    }

    // @ts-ignore
    if (web3 && web3.wallet) {
      web3.wallet.getAccount().then((account: string) => {
        setWeb3Account(account);
        setSensiletPaymail(`${account}@sensilet`);
        setSensiletUserName(`${account}`);
      }).catch((error: any) => {
        console.error('web3.wallet.getAccount().cancel', error);
      });
    }

    web3.wallet.getPublicKey().then((publicKey: string) => {
      console.log('web3.wallet.getPublicKey.result', publicKey);
      setSensiletPublicKey(publicKey);
    }).catch((error: any) => {
      console.error('web3.wallet.getPublicKey().error', error);
    });
  }, [web3]);

  useEffect(() => {
    if (!web3) { return; }
    web3.wallet.isConnect().then((isConnected: boolean) => {
      if (isConnected) {
        web3.wallet.getAccount().then(setWeb3Account).catch((error: any) => {
          console.error('web3.wallet.getAccount().cancel', error);
        });
      }
    });
  }, [web3]);

  useEffect(() => {
    if (sensiletPublicKey) {
      setSensiletWallet(new SensiletWallet());
    } 
  }, [sensiletPublicKey]);

  const sensiletAuthenticated = useMemo(() => !!web3Account, [web3Account]);

  const sensiletLogout = useCallback(async () => {
    setWeb3Account(null);
    setSensiletPaymail(undefined);
    setSensiletUserName(undefined);
    setSensiletPublicKey(null);
    setSensiletWallet(null);
  }, [setWeb3Account, setSensiletPaymail, setSensiletUserName, setSensiletPublicKey, setSensiletWallet]);

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
      ready,
      signer,
      provider,
      sensiletWallet,
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
      ready,
      signer,
      provider,
      sensiletWallet,
    ],
  );

  return (<SensiletContext.Provider value={value} {...props} />);
};

const useSensilet = (): SensiletContextValue => {
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

// const paymailStorageKey = `${config.appname}__SensiletProvider_paymail`;
// const runOwnerStorageKey = `${config.appname}__SensiletProvider_runOwner`;
// const tokenStorageKey = `${config.appname}__SensiletProvider_token`
