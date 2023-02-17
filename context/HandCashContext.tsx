
import { useLocalStorage, lsTest } from "../utils/storage";

import { config } from "../template_config"
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";

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
    handCashSessionToken: string | undefined;
    setHandCashSessionToken:(authToken: string | undefined) => void 
    setHandcashPaymail: (paymail: string | undefined) => void;
    setRunOwner: (runOwner: string) => void;
    handcashLogout: () => void;
};
 
const HandCashContext = createContext<HandCashContextValue | undefined>(undefined);

export const HandCashProvider = (props: { children: React.ReactNode }) => {

    const [handCashAuthToken, setHandCashAuthToken] = useLocalStorage(tokenStorageKey);
    const [handCashSessionToken, setHandCashSessionToken] = useLocalStorage(sessionStorageKey)

    const [handcashPaymail, setHandcashPaymail] = useLocalStorage(paymailStorageKey);
    const [runOwner, setRunOwner] = useLocalStorage(runOwnerStorageKey);
    const [tokenBalance, setTokenBalance] = useState(0);

    const handcashAuthenticated = useMemo(() => !!handcashPaymail, [handcashPaymail]);

    const handcashAvatar = useMemo(() => `https://a.relayx.com/u/${handcashPaymail}`, [handcashPaymail])
    const handcashUserName = useMemo(() => handcashPaymail ? handcashPaymail.split('$')[1] : "", [handcashPaymail])

    const router = useRouter();

    const handcashAuthenticate = useCallback(async () => {

        // TODO: Implement HandCash authentication

        window.location.href = `https://app.handcash.io/#/authorizeApp?appId=63a825594c80646cee9dca84`;

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
          setHandCashSessionToken
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
          setHandCashSessionToken
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
  

const tokenStorageKey = `${config.appname}__HandCashProvider_token`

const sessionStorageKey = `${config.appname}__HandCashProvider_session`

const paymailStorageKey = `${config.appname}__HandCashProvider_paymail`

const runOwnerStorageKey = `${config.appname}__HandCashProvider_runOwner`