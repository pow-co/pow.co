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
   relayxAvatar: string;
   relayOne: RelayOne | undefined;
   runOwner: string;
   relayxPaymail: string | undefined;
   relayxUserName: string | undefined;
   relayAuthToken: string | undefined;
   hasTwetchPrivilege: boolean;
   relayxAuthenticate: () => Promise<void>;
   relayxAuthenticated: boolean;
   tokenBalance: number;
   ready: boolean;
   isApp: boolean;
   checkNFTBalance:({token, paymail}: {token: string, paymail?: string}) => Promise<number>
   setRelayAuthToken:(relayAuthToken: string | undefined) => void 
   setRelayxPaymail: (paymail: string | undefined) => void;
   setRunOwner: (runOwner: string) => void;
   relayxLogout: () => void;
};

const RelayContext = createContext<RelayContextValue | undefined>(undefined);

const RelayProvider = (props: { children: React.ReactNode }) => {
  const [relayxPaymail, setRelayxPaymail] = useLocalStorage(paymailStorageKey);
  const [relayAuthToken, setRelayAuthToken] = useLocalStorage(tokenStorageKey);
  const [runOwner, setRunOwner] = useLocalStorage(runOwnerStorageKey);
  const [relayOne, setRelayOne] = useState<RelayOne>();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [hasTwetchPrivilege, setHasTwetchPrivilege] = useState(false)

  const token_contract = config.token;
  const TWETCH_PRIVILEGE_CONTRACT = "011a97bdc1868fc53342cb9bffdc3e42782a9c258fbb6597cd20effa3a4d6077_o2"

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
        return owner.paymail === relayxPaymail;
      });

      if (relayxPaymail && owner?.amount) {
        setTokenBalance(owner?.amount);
      } else {
        setTokenBalance(0);
      }
    })();
  }, [relayxPaymail]);


  async function checkNFTBalance({ token, paymail }: { token: string, paymail?: string }): Promise<number> {

    if (!paymail) { paymail = relayxPaymail }

    if (!paymail) { return 0 }

    const { data } = await axios.get(
      `https://staging-backend.relayx.com/api/token/${token}/owners`
    );

    console.log("checkNFTBalance.result.raw", data)

    const [owner] = data.data.owners.filter((owner : RunOwner) => {
      return owner.paymail === relayxPaymail;
    });

    console.log('owner', owner)

    if (!owner || !owner.amount) {
      return 0
    }

    return owner.amount

  }

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `https://staging-backend.relayx.com/api/token/${TWETCH_PRIVILEGE_CONTRACT}/owners`
      );

      const [owner] = data.data.owners.filter((owner : RunOwner) => {
        return owner.paymail === relayxPaymail;
      });

      if (relayxPaymail && owner?.amount) {
        setHasTwetchPrivilege(true);
      } else {
        setHasTwetchPrivilege(false);
      }
    })();
  }, [relayxPaymail]);

  const isApp = useMemo(
    () => (relayOne && relayOne.isApp()) || false,
    [relayOne]
  );

  const relayxAuthenticate = useCallback(async () => {
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
      setRelayxPaymail(returnedPaymail);
      const owner = await relayOne?.alpha.run.getOwner();
      setRunOwner(owner);
    } else {
      throw new Error(
        "If you are in private browsing mode try again in a normal browser window. (Relay requires localStorage)"
      );
    }
  }, [relayOne, setRelayxPaymail]);
    
  const relayxAuthenticated = useMemo(() => !!relayxPaymail, [relayxPaymail]);

  const relayxAvatar = useMemo(() => `https://a.relayx.com/u/${relayxPaymail}`, [relayxPaymail])

  const relayxUserName = useMemo(() => relayxPaymail ? `1${relayxPaymail.split("@")[0]}` : "", [relayxPaymail])


  // Auto Authenticate when inside the Relay app
  useEffect(() => {
    if (isApp) {
      relayxAuthenticate();
    }
  }, [relayxAuthenticate, isApp]);

  const relayxLogout = () => {
    setRelayxPaymail("");
    setTokenBalance(0);
    setHasTwetchPrivilege(false)
    setRelayAuthToken(undefined)
  };

  const value = useMemo(
    () => ({
      checkNFTBalance,
      relayxAvatar,
      relayxUserName,
      relayOne,
      setRelayxPaymail,
      relayxPaymail,
      relayAuthToken,
      setRelayAuthToken,
      hasTwetchPrivilege,
      runOwner,
      setRunOwner,
      relayxAuthenticate,
      relayxAuthenticated,
      relayxLogout,
      ready,
      tokenBalance,
      isApp,
    }),
    [
      checkNFTBalance,
      relayxAvatar,
      relayxUserName,
      relayOne,
      setRelayxPaymail,
      setRelayAuthToken,
      hasTwetchPrivilege,
      runOwner, 
      setRunOwner,
      relayxPaymail,
      relayAuthToken,
      relayxAuthenticate,
      relayxLogout,
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
