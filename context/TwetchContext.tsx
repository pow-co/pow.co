import React, {
  createContext, useCallback, useContext, useMemo, useState, useEffect,
} from 'react';
import TwetchWeb3 from '@twetch/web3';
import { useLocalStorage } from '../utils/storage';
import { config } from '../template_config';

import TwetchWallet from '../wallets/twetch'

// Utils

const paymailStorageKey = `${config.appname}__TwetchProvider_paymail`;
const tokenStorageKey = `${config.appname}__TwetchProvider_token`;

type TwetchContextValue = {
  twetchAvatar: string | undefined;
  twetchPaymail: string | undefined;
  twetchUserName: string | undefined;
  tokenTwetchAuth: string | undefined;
  twetchAuthenticate: () => Promise<void>;
  twetchAuthenticated: boolean;
  twetchWallet: TwetchWallet | null | undefined;
  twetchLogout: () => void;
};

const TwetchContext = createContext<TwetchContextValue | undefined>(undefined);
function TwetchProvider(props: { children: React.ReactNode }) {
  const [twetchPaymail, setTwetchPaymail] = useLocalStorage(paymailStorageKey);
  const [tokenTwetchAuth, setTokenTwetchAuth] = useLocalStorage(tokenStorageKey);

  const [twetchWallet, setTwetchWallet] = useState<TwetchWallet | null | undefined>();
  const [me, setMe] = useState<any>({});

  const logUser = useCallback(async (token: string) => {
    const respLogUser = await fetch('/api/v1/twetch/auth/whoIs', {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
    });
    const logUserData = await respLogUser.json();
    setMe(logUserData.me);
  }, [tokenTwetchAuth]);

  const twetchAvatar = useMemo(() => me && me.icon, [me]);

  useEffect(() => {
    if (tokenTwetchAuth) {
      logUser(tokenTwetchAuth);
    }
  }, [tokenTwetchAuth]);

  const twetchAuthenticate = useCallback(async () => {
    if (tokenTwetchAuth) {
      console.log({ tokenTwetchAuth })
      await logUser(tokenTwetchAuth);
    } else {
      try {
        //@ts-ignore
        const resp = await TwetchWeb3.connect();
        setTwetchPaymail(resp.paymail);
        const resMsg = await fetch('/api/v1/twetch/auth/challenge');
        const msgData = await resMsg.json();
        const response = await TwetchWeb3.abi({
          contract: 'sign-message',
          payload: { message: msgData.message },
        });
        const encodedSig = encodeURIComponent(response.sig);
        const authResponse = await fetch(
          `/api/v1/twetch/auth?address=${response.address}&&message=${response.message}&&signature=${encodedSig}`,
        );
        const authResponseData = await authResponse.json();
        setTokenTwetchAuth(authResponseData.token);
        console.log(authResponseData.token);
        await logUser(authResponseData.token);

      } catch (err) {
        console.error('twetchAuthenticate.error', err);
        // { code: 4001, message: 'me rejected the request.' }
      }
    }
  }, [tokenTwetchAuth]);

  useEffect(() => {

    if (twetchPaymail) {

      setTwetchWallet(new TwetchWallet({ paymail: twetchPaymail }))

    }

  }, [twetchPaymail])

  const twetchUserName = useMemo(() => me && me.name, [me]);

  const twetchAuthenticated = useMemo(() => !!tokenTwetchAuth, [tokenTwetchAuth]);

  const twetchLogout = () => {
    setTwetchPaymail('');
    setTokenTwetchAuth('');
    setMe({});
    setTwetchWallet(null)
  };

  const value = useMemo(
    () => ({
      twetchAvatar,
      twetchPaymail,
      twetchUserName,
      tokenTwetchAuth,
      twetchAuthenticate,
      twetchAuthenticated,
      twetchLogout,
      twetchWallet
    }),
    [
      twetchAvatar,
      twetchPaymail,
      twetchUserName,
      tokenTwetchAuth,
      twetchAuthenticate,
      twetchAuthenticated,
      twetchLogout,
      twetchWallet
    ],
  );

  return (<TwetchContext.Provider value={value} {...props} />);
}

const useTwetch = () => {
  const context = useContext(TwetchContext);
  if (context === undefined) {
    throw new Error('useTwetch must be used within a TwetchProvider');
  }
  return context;
};

export { TwetchProvider, useTwetch };
