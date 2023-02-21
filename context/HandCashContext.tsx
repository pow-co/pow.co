
import { useLocalStorage, lsTest } from "../utils/storage";

import { config } from "../template_config"
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";

type HandCashContextValue = {
    avatar: string;
    runOwner: string;
    paymail: string | undefined;
    authenticate: () => Promise<void>;
    authenticated: boolean;
    tokenBalance: number;
    handCashAuthToken: string | undefined;
    setHandCashAuthToken:(authToken: string | undefined) => void 
    handCashSessionToken: string | undefined;
    setHandCashSessionToken:(authToken: string | undefined) => void 
    setPaymail: (paymail: string | undefined) => void;
    setRunOwner: (runOwner: string) => void;
    logout: () => void;
};
 
const HandCashContext = createContext<HandCashContextValue | undefined>(undefined);

export const HandCashProvider = (props: { children: React.ReactNode }) => {

    const [handCashAuthToken, setHandCashAuthToken] = useLocalStorage(tokenStorageKey);
    const [handCashSessionToken, setHandCashSessionToken] = useLocalStorage(sessionStorageKey)

    const [paymail, setPaymail] = useLocalStorage(paymailStorageKey);
    const [runOwner, setRunOwner] = useLocalStorage(runOwnerStorageKey);
    const [tokenBalance, setTokenBalance] = useState(0);

    const authenticated = useMemo(() => !!paymail, [paymail]);

    const avatar = useMemo(() => `https://a.relayx.com/u/${paymail}`, [paymail])

    const router = useRouter();

    const authenticate = useCallback(async () => {

        // TODO: Implement HandCash authentication

        window.location.href = `https://app.handcash.io/#/authorizeApp?appId=63a825594c80646cee9dca84`;

    }, [setPaymail]);

    const logout = () => {
        setPaymail("");
        setTokenBalance(0);
        setHandCashAuthToken(undefined)
        localStorage.clear();
      };

    const value = useMemo(
        () => ({
          handCashAuthToken,
          setHandCashAuthToken,
          runOwner,
          setRunOwner,
          tokenBalance,
          setTokenBalance,
          paymail,
          setPaymail,
          logout,
          authenticated,
          authenticate,
          avatar,
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
          paymail,
          setPaymail,
          logout,
          authenticated,
          authenticate,
          avatar,
          handCashSessionToken,
          setHandCashSessionToken
        ]
      );
    
      return (<HandCashContext.Provider value={value} {...props} />);

}

export const useHandCash = () => {

    console.log('HandCashContext', HandCashContext)
    
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