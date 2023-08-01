import { createContext, useCallback, useState, useContext, useMemo, useEffect } from "react"
import { useLocalStorage } from "../utils/storage";
import { config } from "../template_config"
import { useRelay } from "./RelayContext";
import { useTwetch } from "./TwetchContext";
import { useHandCash } from "./HandCashContext";
import { useSensilet } from "./SensiletContext";
import axios, { AxiosResponse } from "axios";
import React from 'react'

type BitcoinContextValue = {
    wallet: 'relayx' | 'twetch' | 'handcash' | 'sensilet' | 'local';
    avatar: string | undefined;
    paymail: string | undefined;
    userName: string | undefined;
    setWallet: (wallet: 'relayx' | 'twetch' | 'handcash' | 'sensilet' | 'local') => void;
    authenticate: () => Promise<void>;
    authenticated: boolean;
    logout: () => void;
    exchangeRate: number;
}

const BitcoinContext = createContext<BitcoinContextValue | undefined>(undefined)
const BitcoinProvider = (props: { children: React.ReactNode }) => {
    const [wallet, setWallet] = useLocalStorage(walletStorageKey, "relayx")
    const [exchangeRate, setExchangeRate] = useState(0)
    const { relayxAuthenticate, relayOne, relayxAuthenticated, relayxLogout, relayxAvatar, relayxPaymail, relayxUserName } = useRelay()
    const { twetchAuthenticate, twetchAuthenticated, twetchLogout, twetchAvatar, twetchPaymail, twetchUserName } = useTwetch()
    const { handcashAuthenticate, handcashAuthenticated, handcashLogout, handcashAvatar, handcashPaymail, handcashUserName} = useHandCash()
    const { sensiletAuthenticate, sensiletAuthenticated, sensiletLogout, sensiletAvatar, sensiletPaymail, sensiletUserName} = useSensilet()

    useEffect(() => {
        axios.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate').then((resp:AxiosResponse) => {
            setExchangeRate(resp.data.rate.toFixed(2))
            console.log("exchange rate", resp.data.rate.toFixed(2))
        })
    },[])

    const authenticate = useCallback(async () => {
        switch (wallet){
            case 'relayx':
                await relayxAuthenticate()
                break;
            case 'twetch':
                await twetchAuthenticate()
                break;
            case 'handcash':
                await handcashAuthenticate()
                break;
            case 'sensilet':
                await sensiletAuthenticate()
                break;
            default:
                break;
        }
    },[relayOne, wallet])
    

    const avatar = useMemo(() => {
        switch (wallet){
            case 'relayx':
                return relayxAvatar
            case 'twetch':
                return twetchAvatar
            case 'handcash':
                return handcashAvatar
            case 'sensilet':
                return sensiletAvatar
            default:
                break;
        }
    },[wallet, relayxAvatar, twetchAvatar, handcashAvatar, sensiletAvatar])


    const paymail = useMemo(() => {
        switch (wallet){
            case 'relayx':
                return relayxPaymail
            case 'twetch':
                return twetchPaymail
            case 'handcash':
                return handcashPaymail
            default:
                break;
        }
    },[wallet, relayxPaymail, twetchPaymail, handcashPaymail, sensiletPaymail])

    const userName = useMemo(() => {
        switch (wallet){
            case 'relayx':
                return relayxUserName
            case 'twetch':
                return twetchUserName
            case 'handcash':
                return handcashUserName
            case 'sensilet':
                return sensiletUserName
            default:
                break;
        }
    },[wallet, relayxUserName, twetchUserName, handcashUserName])

    const authenticated = useMemo(()=> relayxAuthenticated || twetchAuthenticated || handcashAuthenticated || sensiletAuthenticated, [relayxAuthenticated, twetchAuthenticated, handcashAuthenticated, sensiletAuthenticated])

    const logout = () => {
        relayxLogout()
        twetchLogout()
        handcashLogout()
        sensiletLogout()
        localStorage.clear()
    }

    const value = useMemo(
        () => ({
            avatar,
            paymail,
            userName,
            wallet,
            setWallet,
            authenticate,
            authenticated,
            logout, 
            exchangeRate
        }),
        [
            avatar,
            wallet,
            paymail,
            userName,
            setWallet,
            authenticate,
            authenticated,
            logout,
            exchangeRate
        ]
    )

    return (<BitcoinContext.Provider value={value} {...props}/>)

}

const useBitcoin = () => {
    const context = useContext(BitcoinContext);
    if (context === undefined){
        throw new Error("useBitcoin must be used within a BitcoinProvider")
    }
    return context
} 

export { BitcoinProvider, useBitcoin }

const walletStorageKey = `${config.appname}__BitcoinProvider_wallet`
