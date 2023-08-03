
import { useLocalStorage, lsTest } from "../utils/storage";

import { config } from "../template_config"
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";

const handcashAppId = process.env.NEXT_PUBLIC_HANDCASH_APP_ID

import axios from 'axios'

type HandCashContextValue = {
    handcashAvatar: string;
    handcashUserName: string;
    runOwner: string;
    handcashPaymail: string | undefined;
    handcashAuthenticate: () => Promise<void>;
    handcashAuthenticated: boolean;
    tokenBalance: number;
    handCashAuthToken: string | undefined;
    setHandCashAuthToken:(authToken: string | undefined) => void 
    setProfileFromAuthToken:({authToken}: {authToken: string}) => Promise<void>
    handCashSessionToken: string | undefined;
    setHandCashSessionToken:(authToken: string | undefined) => void 
    setHandcashPaymail: (paymail: string | undefined) => void;
    setRunOwner: (runOwner: string) => void;
    handcashLogout: () => void;
};
 
export const HandCashContext = createContext<HandCashContextValue | undefined>(undefined);

export const HandCashProvider = (props: { children: React.ReactNode }) => {

    const [handCashAuthToken, setHandCashAuthToken] = useLocalStorage(tokenStorageKey);
    const [handCashSessionToken, setHandCashSessionToken] = useLocalStorage(sessionStorageKey)

    const [handcashPaymail, setHandcashPaymail] = useLocalStorage(paymailStorageKey);
    const [runOwner, setRunOwner] = useLocalStorage(runOwnerStorageKey);
    const [tokenBalance, setTokenBalance] = useState(0);

    const handcashAuthenticated = useMemo(() => !!handCashAuthToken, [handCashAuthToken]);

    const handcashAvatar = useMemo(() => `https://a.relayx.com/u/${handcashPaymail}`, [handcashPaymail])
    const handcashUserName = useMemo(() => handcashPaymail ? handcashPaymail.split('$')[1] : "", [handcashPaymail])

    const router = useRouter();

    async function setProfileFromAuthToken({ authToken }: { authToken: string}): Promise<void> {

      try {

        const { data } = await axios.get(`/api/v1/handcash/profile?authToken=${authToken}`)

        setHandCashAuthToken(authToken)

        setHandcashPaymail(data.paymail)

        console.log('handcash.profile', data)

      } catch(error) {

        console.error('handcash.profile.error', error)

      }
    }

    const handcashAuthenticate = useCallback(async () => {

        window.location.href = `https://app.handcash.io/#/authorizeApp?appId=${handcashAppId}`;

    }, [setHandcashPaymail]);

    const handcashLogout = () => {
        setHandcashPaymail("");
        setTokenBalance(0);
        setHandCashAuthToken(undefined)
      };

    const value = useMemo(
        () => ({
          handCashAuthToken,
          setHandCashAuthToken,
          runOwner,
          setRunOwner,
          tokenBalance,
          setTokenBalance,
          handcashPaymail,
          handcashUserName,
          setHandcashPaymail,
          handcashLogout,
          handcashAuthenticated,
          handcashAuthenticate,
          handcashAvatar,
          handCashSessionToken,
          setHandCashSessionToken,
          setProfileFromAuthToken
        }),
        [
          handCashAuthToken,
          setHandCashAuthToken,
          runOwner,
          setRunOwner,
          tokenBalance,
          setTokenBalance,
          handcashPaymail,
          handcashUserName,
          setHandcashPaymail,
          handcashLogout,
          handcashAuthenticated,
          handcashAuthenticate,
          handcashAvatar,
          handCashSessionToken,
          setHandCashSessionToken,
          setProfileFromAuthToken
        ]
      );
    
      return (<HandCashContext.Provider value={value} {...props} />);

}

export const useHandCash = () => {
    
    const context = useContext(HandCashContext);
    if (context === undefined) {
      throw new Error("useHandCash must be used within a HandCashProvider");
    }
    return context;
};
  

export const tokenStorageKey = `${config.appname}__HandCashProvider_token`

export const sessionStorageKey = `${config.appname}__HandCashProvider_session`

const paymailStorageKey = `${config.appname}__HandCashProvider_paymail`

const runOwnerStorageKey = `${config.appname}__HandCashProvider_runOwner`
