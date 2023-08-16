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

import RelayxWallet from '../wallets/relayx'

import { bsv } from 'scrypt-ts'

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
   relayxAuthToken: string | undefined;
   hasTwetchPrivilege: boolean;
   relayxAuthenticate: () => Promise<void>;
   getTokenBalance: ({token_contract}: {token_contract: string}) => Promise<{balance: number}>;
   relayxAuthenticated: boolean;
   tokenBalance: number;
   ready: boolean;
   isApp: boolean;
   setRelayxAuthToken:(relayxAuthToken: string | undefined) => void 
   setRelayxPaymail: (paymail: string | undefined) => void;
   setRunOwner: (runOwner: string) => void;
   relayxLogout: () => void;
   relayxWallet: RelayxWallet | null | undefined;
   relayxPublicKey: bsv.PublicKey | undefined;
   setRelayxPublicKey: (relayxPublicKey: bsv.PublicKey | undefined) => void;
};

const RelayContext = createContext<RelayContextValue | undefined>(undefined);

const RelayProvider = (props: { children: React.ReactNode }) => {
  const [relayxPaymail, setRelayxPaymail] = useLocalStorage(paymailStorageKey);
  const [relayxAuthToken, setRelayxAuthToken] = useLocalStorage(tokenStorageKey);
  const [runOwner, setRunOwner] = useLocalStorage(runOwnerStorageKey);
  const [relayOne, setRelayOne] = useState<RelayOne>();
  const [relayxWallet, setRelayxWallet] = useState<RelayxWallet | null | undefined>();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [hasTwetchPrivilege, setHasTwetchPrivilege] = useState(false)
  const [relayxPublicKey, setRelayxPublicKey] = useState<bsv.PublicKey | undefined>();

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

  async function getTokenBalance({ token_contract }: {token_contract: string}): Promise<{balance: number}> {

	try {

	      const { data } = await axios.get(
		`https://staging-backend.relayx.com/api/token/${token_contract}/owners`
	      );

	      const [owner] = data.data.owners.filter((owner : RunOwner) => {
		return owner.paymail === relayxPaymail;
	      });

	      return {balance:owner.amount}

      }catch(error) {
	console.error('get token balance.error', error)
	return {balance:0}
      }

  }

  useEffect(() => {

    if (!relayxPublicKey || !relayxPaymail) return

    console.log('setRelayxWallet', { paymail: relayxPaymail, publicKey: relayxPublicKey, token: relayxAuthToken })

    setRelayxWallet(new RelayxWallet({ paymail: relayxPaymail, publicKey: relayxPublicKey, token: relayxAuthToken }))

  }, [relayxPaymail, relayxPublicKey])

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
    const authToken = await relayOne.authBeta();

    if (authToken) {

      setRelayxAuthToken(authToken)

      const payloadBase64 = authToken.split(".")[0]; // Token structure: "payloadBase64.signature"

      console.log('relayx.authBeta.result', JSON.parse(atob(payloadBase64)))

      const { paymail: returnedPaymail, pubkey } = JSON.parse(atob(payloadBase64));
      // localStorage.setItem('paymail', returnedPaymail);
      setRelayxPaymail(returnedPaymail);
      console.log('pubkey', new bsv.PublicKey(pubkey))
      setRelayxPublicKey(new bsv.PublicKey(pubkey));
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
    console.log('relayxLogout')
    setRelayxPaymail("");
    setTokenBalance(0);
    setHasTwetchPrivilege(false)
    setRelayxAuthToken(undefined)
    setRelayxWallet(null)
  };

  const value = useMemo(
    () => ({
      relayxAvatar,
      relayxUserName,
      relayOne,
      setRelayxPaymail,
      relayxPaymail,
      relayxAuthToken,
      setRelayxAuthToken,
      hasTwetchPrivilege,
      runOwner,
      setRunOwner,
      relayxAuthenticate,
      relayxAuthenticated,
      relayxLogout,
      ready,
      tokenBalance,
      isApp,
      getTokenBalance,
      relayxWallet,
      relayxPublicKey,
      setRelayxPublicKey,
    }),
    [
      relayxAvatar,
      relayxUserName,
      relayOne,
      setRelayxPaymail,
      setRelayxAuthToken,
      hasTwetchPrivilege,
      runOwner, 
      setRunOwner,
      relayxPaymail,
      relayxAuthToken,
      relayxAuthenticate,
      relayxLogout,
      ready,
      tokenBalance,
      isApp,
      getTokenBalance,
      relayxWallet,
      relayxPublicKey,
      setRelayxPublicKey,
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
