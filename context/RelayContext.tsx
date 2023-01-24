import axios from "axios";
import Script from "next/script";
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

export interface RelaySignResult {
   algorithm: 'bitcoin-signed-message';
   address: string;
   key: 'identity';
   data: string; // data you passed in
   value: string; // signature
   
}

export interface RelayBroadcastResponse {
   amount: number;
   currency: string;
   identity: string;
   paymail: string; // sender paymail
   rawTx: string;
   satoshis: number;
   txid: string;
}


interface RelayOneAlpha {
   run: RelayOneRun;
   dex: RelayOneDex;
}

interface RelayOneDex {
   getDexKey: () => Promise<string>;
   pay: (tx: string) => Promise<any>; // TODO: These can take bsv.Transaction as well
   sign: (tx: string) => Promise<any>; // TODO: These can take bsv.Transaction as well
}

interface RelayOneRun {
   getOwner: () => Promise<string>;
   getLegacyOwner: () => Promise<string>;
}

interface RunOwner {
  address: string;
  amount: number;
  paymail: string;
}

interface RenderProps {
   to: string;
   amount: string;
   currency: string;
   editable?: boolean;
   opReturn?: string | string[];
   onPayment?: (response: RelayBroadcastResponse) => void;
}

interface RelayOne {
   authBeta: () => Promise<string>;
   send: (payload: any) => Promise<RelayBroadcastResponse>;
   quote: (payload: any) => Promise<string>;
   sign: (payload: string) => Promise<RelaySignResult>;
   isApp: () => boolean;
   render: (ele: HTMLDivElement, props: RenderProps) => void;
   alpha: RelayOneAlpha;
} // TODO: Complete

// 'relay-container', { to: Current.campaign.funding_address }
 type RelayOtcOptions = {
   to: string;
};

interface RelayOtc {
   buy: (container: string, options: RelayOtcOptions) => void;
} // TODO: Complete

type RelayContextValue = {
   avatar: string;
   relayOne: RelayOne | undefined;
   runOwner: string;
   paymail: string | undefined;
   relayAuthToken: string | undefined;
   authenticate: () => Promise<void>;
   authenticated: boolean;
   tokenBalance: number;
   ready: boolean;
   isApp: boolean;
   setRelayAuthToken:(relayAuthToken: string | undefined) => void 
   setPaymail: (paymail: string | undefined) => void;
   setRunOwner: (runOwner: string) => void;
   logout: () => void;
};

const RelayContext = createContext<RelayContextValue | undefined>(undefined);

const RelayProvider = (props: { children: React.ReactNode }) => {
  const [paymail, setPaymail] = useLocalStorage(paymailStorageKey);
  const [relayAuthToken, setRelayAuthToken] = useLocalStorage(tokenStorageKey);
  const [runOwner, setRunOwner] = useLocalStorage(runOwnerStorageKey);
  const [relayOne, setRelayOne] = useState<RelayOne>();
  const [tokenBalance, setTokenBalance] = useState(0);

  const token_contract = config.token;

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      //@ts-ignore
      setRelayOne(window.relayone);
      setReady(true);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://staging-backend.relayx.com/api/token/${token_contract}/owners`
      );

      const [owner] = data.data.owners.filter((owner : RunOwner) => {
        return owner.paymail === paymail;
      });

      if (paymail && owner?.amount) {
        setTokenBalance(owner?.amount);
      } else {
        setTokenBalance(0);
      }
    })();
  }, [paymail]);

  const isApp = useMemo(
    () => (relayOne && relayOne.isApp()) || false,
    [relayOne]
  );

  const authenticate = useCallback(async () => {
    if (!relayOne) {
      throw new Error("Relay script not yet loaded!");
    }

    // Test localStorage is accessible
    if (!lsTest()) {
      throw new Error("localStorage is not available");
    }

    const token = await relayOne.authBeta();

    //@ts-ignore
    if (token && !token.error) {
      setRelayAuthToken(token)
      const payloadBase64 = token.split(".")[0]; // Token structure: "payloadBase64.signature"
      const { paymail: returnedPaymail } = JSON.parse(atob(payloadBase64));
      // localStorage.setItem('paymail', returnedPaymail);
      setPaymail(returnedPaymail);
      const owner = await relayOne?.alpha.run.getOwner();
      setRunOwner(owner);
    } else {
      throw new Error(
        "If you are in private browsing mode try again in a normal browser window. (Relay requires localStorage)"
      );
    }
  }, [relayOne, setPaymail]);
    
  const authenticated = useMemo(() => !!paymail, [paymail]);

  const avatar = useMemo(() => `https://a.relayx.com/u/${paymail}`, [paymail])


  // Auto Authenticate when inside the Relay app
  useEffect(() => {
    if (isApp) {
      authenticate();
    }
  }, [authenticate, isApp]);

  const logout = () => {
    setPaymail("");
    setTokenBalance(0);
    setRelayAuthToken(undefined)
    localStorage.clear();
  };

  const value = useMemo(
    () => ({
      avatar,
      relayOne,
      setPaymail,
      paymail,
      relayAuthToken,
      setRelayAuthToken,
      runOwner,
      setRunOwner,
      authenticate,
      authenticated,
      logout,
      ready,
      tokenBalance,
      isApp,
    }),
    [
      avatar,
      relayOne,
      setPaymail,
      setRelayAuthToken,
      runOwner, 
      setRunOwner,
      paymail,
      relayAuthToken,
      authenticate,
      logout,
      ready,
      tokenBalance,
      isApp,
    ]
  );

  return (<RelayContext.Provider value={value} {...props} />);
};

const useRelay = () => {
  const context = useContext(RelayContext);
  if (context === undefined) {
    throw new Error("useRelay must be used within a RelayProvider");
  }
  return context;
};

export { RelayProvider, useRelay };

//
// Utils
//

const paymailStorageKey = `${config.appname}__RelayProvider_paymail`;
const runOwnerStorageKey = `${config.appname}__RelayProvider_runOwner`;
const tokenStorageKey = `${config.appname}__RelayProvider_token`