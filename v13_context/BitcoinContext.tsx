'use client'
import { createContext, useCallback, useState, useContext, useMemo, useEffect } from "react"
import { useLocalStorage } from "../utils/storage";
import { config } from "../template_config"
import { useRelay } from "./RelayContext";
import { useTwetch } from "./TwetchContext";
import { useHandCash } from "./HandCashContext";
import { useSensilet } from "./SensiletContext";
import axios, { AxiosResponse } from "axios";
import React from 'react'
import { useLocalWallet } from "./LocalWalletContext";

type BitcoinContextValue = {
    wallet: 'relayx' | 'twetch' | 'handcash' | 'sensilet' | 'local';
    avatar: string | undefined;
    balance: number; // in sats
    paymail: string | undefined;
    userName: string | undefined;
    setWallet: (wallet: 'relayx' | 'twetch' | 'handcash' | 'sensilet' | 'local' | null) => void;
    authenticate: () => Promise<void>;
    authenticated: boolean;
    logout: () => void;
    exchangeRate: number;
    walletPopupOpen: boolean;
    setWalletPopupOpen: (isOpen: boolean) => void;
}

const BitcoinContext = createContext<BitcoinContextValue | undefined>(undefined)
const BitcoinProvider = (props: { children: React.ReactNode }) => {
    const [wallet, setWallet] = useLocalStorage(walletStorageKey)
    const [walletPopupOpen, setWalletPopupOpen] = useState(false);

    const [exchangeRate, setExchangeRate] = useState(0)
    const { relayxAuthenticate, relayOne, relayxAuthenticated, relayxLogout, relayxAvatar, relayxPaymail, relayxUserName } = useRelay()
    const { twetchAuthenticate, twetchAuthenticated, twetchLogout, twetchAvatar, twetchPaymail, twetchUserName } = useTwetch()
    const { handcashAuthenticate, handcashAuthenticated, handcashLogout, handcashAvatar, handcashPaymail, handcashUserName} = useHandCash()
    const { sensiletAuthenticate, sensiletAuthenticated, sensiletLogout, sensiletAvatar, sensiletPaymail, sensiletUserName} = useSensilet()
    const { localWalletAuthenticate, localWalletAuthenticated, localWalletLogout, localWalletAvatar, localWalletPaymail, localWalletUserName, localWallet, seedPhrase } = useLocalWallet()
    const [balance, setBalance] = useState(0)
    

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
            case 'local':
                await localWalletAuthenticate(seedPhrase)
                break
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
            case 'local':
                return localWalletAvatar
            default:
                break;
        }
    },[wallet, relayxAvatar, twetchAvatar, handcashAvatar, sensiletAvatar, localWalletAvatar])


    const paymail = useMemo(() => {
        switch (wallet){
            case 'relayx':
                return relayxPaymail
            case 'twetch':
                return twetchPaymail
            case 'handcash':
                return handcashPaymail
            case "sensilet":
                return sensiletPaymail
            case "local": 
                return localWalletPaymail
            default:
                break;
        }
    },[wallet, relayxPaymail, twetchPaymail, handcashPaymail, sensiletPaymail, localWalletPaymail])

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
            case 'local':
                return localWalletUserName
            default:
                break;
        }
    },[wallet, relayxUserName, twetchUserName, handcashUserName, sensiletUserName, localWalletUserName])

    const authenticated = useMemo(()=> wallet === "relayx" && relayxAuthenticated || wallet === "twetch" && twetchAuthenticated || wallet === "handcash" && handcashAuthenticated || wallet === "sensilet" && sensiletAuthenticated || wallet === "local" && localWalletAuthenticated, [wallet, relayxAuthenticated, twetchAuthenticated, handcashAuthenticated, sensiletAuthenticated, localWalletAuthenticated])

    useEffect(() => {
        if(authenticated){
            switch (wallet){
                case "relayx":
                    break;
                case "twetch":
                    break;
                case "handcash":
                    break;
                case "sensilet": 
                    break;
                case "local":
                    localWallet?.listUnspent().then((utxos) => {
                        let satoshis = utxos.map(utxo => utxo.satoshis).reduce((acc, val) => acc + val, 0)
                        console.log("bitcoin.wallet.balance", satoshis)
                        setBalance(satoshis)
                    })
                    break;
                default: 
                    break;                
            }
        }
    },[authenticated, wallet])

    const logout = () => {
        setWallet("")
        relayxLogout()
        twetchLogout()
        handcashLogout()
        sensiletLogout()
        localWalletLogout()
        localStorage.clear()
    }

    const value = useMemo(
        () => ({
            avatar,
            balance,
            paymail,
            userName,
            wallet,
            setWallet,
            authenticate,
            authenticated,
            logout, 
            exchangeRate,
            walletPopupOpen,
            setWalletPopupOpen
        }),
        [
            avatar,
            balance,
            wallet,
            paymail,
            userName,
            setWallet,
            authenticate,
            authenticated,
            logout,
            exchangeRate,
            walletPopupOpen,
            setWalletPopupOpen
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
