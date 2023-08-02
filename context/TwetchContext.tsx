import React, {
  createContext, useCallback, useContext, useMemo, useState, useEffect,
} from 'react';
import TwetchWeb3 from '@twetch/web3';
import { useLocalStorage } from '../utils/storage';
import { config } from '../template_config';

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
  twetchLogout: () => void;
};

const TwetchContext = createContext<TwetchContextValue | undefined>(undefined);
function TwetchProvider(props: { children: React.ReactNode }) {
  const [twetchPaymail, setTwetchPaymail] = useLocalStorage(paymailStorageKey);
  const [tokenTwetchAuth, setTokenTwetchAuth] = useLocalStorage(tokenStorageKey);
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
        console.log("TWETCH WEB3.connect")
        //@ts-ignore
        window.TwetchWeb3 = TwetchWeb3
        const resp = await TwetchWeb3.connect();
        console.log({ resp })
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

  const twetchUserName = useMemo(() => me && me.name, [me]);

  const twetchAuthenticated = useMemo(() => !!tokenTwetchAuth, [tokenTwetchAuth]);

  const twetchLogout = () => {
    setTwetchPaymail('');
    setTokenTwetchAuth('');
    setMe({});
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
    }),
    [
      twetchAvatar,
      twetchPaymail,
      twetchUserName,
      tokenTwetchAuth,
      twetchAuthenticate,
      twetchAuthenticated,
      twetchLogout,
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
