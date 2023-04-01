import { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react"
import { useLocalStorage } from "../utils/storage";
import { config } from "../template_config"
import TwetchWeb3 from "@twetch/web3"

type TwetchContextValue = {
    twetchAvatar: string | undefined;
    twetchPaymail: string | undefined;
    twetchUserName: string | undefined;
    tokenTwetchAuth: string |undefined;
    twetchAuthenticate: () => Promise<void>;
    twetchAuthenticated: boolean;
    twetchLogout: () => void;
}

const TwetchContext = createContext<TwetchContextValue | undefined>(undefined)
const TwetchProvider = (props: { children: React.ReactNode }) => {
    const [twetchPaymail, setTwetchPaymail] = useLocalStorage(paymailStorageKey)
    const [tokenTwetchAuth, setTokenTwetchAuth] = useLocalStorage(tokenStorageKey)
    const [me, setMe] = useState<any>({});

    useEffect(() => {
        tokenTwetchAuth  && logUser(tokenTwetchAuth);
      }, [tokenTwetchAuth]);

    const twetchAuthenticate = useCallback(async () => {
      if(tokenTwetchAuth){
        await logUser(tokenTwetchAuth)
      } else {
        try {
            const resp = await TwetchWeb3.connect();
            setTwetchPaymail(resp.paymail)
            const res_msg = await fetch("/api/auth/twetch/challenge");
            const msgData = await res_msg.json();
            const response = await TwetchWeb3.abi({
              contract: "sign-message",
              payload: { message: msgData.message },
            });
            let encodedSig = encodeURIComponent(response.sig);
            const authResponse = await fetch(
              `/api/auth/twetch?address=${response.address}&&message=${response.message}&&signature=${encodedSig}`
            )
            const authResponseData = await authResponse.json()
            setTokenTwetchAuth(authResponseData.token)
            console.log(authResponseData.token)
            await logUser(authResponseData.token)
          } catch (err) {
              console.error(err)
            // { code: 4001, message: 'me rejected the request.' }
          }
      }
    },[tokenTwetchAuth])

    const logUser =  useCallback(async (token: string) => {
        const respLogUser = await fetch("/api/auth/twetch/whoIs", {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        })
        const logUserData = await respLogUser.json()
        setMe(logUserData.me)
      },[tokenTwetchAuth])

    const twetchAvatar = useMemo(() => {
      
        return me && me.icon
    },[me])


    const twetchUserName = useMemo(() => {
       return me && me.name
    },[me])

    const twetchAuthenticated = useMemo(()=> !!tokenTwetchAuth, [tokenTwetchAuth])

    const twetchLogout = () => {
        setTwetchPaymail("")
        setTokenTwetchAuth("")
        setMe({})
        
    }

    const value = useMemo(
        () => ({
            twetchAvatar,
            twetchPaymail,
            twetchUserName,
            tokenTwetchAuth,
            twetchAuthenticate,
            twetchAuthenticated,
            twetchLogout
        }),
        [
            twetchAvatar,
            twetchPaymail,
            twetchUserName,
            tokenTwetchAuth,
            twetchAuthenticate,
            twetchAuthenticated,
            twetchLogout
        ]
    )

    return (<TwetchContext.Provider value={value} {...props}/>)

}

const useTwetch = () => {
    const context = useContext(TwetchContext);
    if(context === undefined) {
        throw new Error("useTwetch must be used within a TwetchProvider")
    }
    return context;
}

export { TwetchProvider, useTwetch };

const paymailStorageKey = `${config.appname}__TwetchProvider_paymail`;
const tokenStorageKey = `${config.appname}__TwetchProvider_token`