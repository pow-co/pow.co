import { createContext, useCallback, useState, useContext, useMemo, useEffect } from "react"
import { useLocalStorage } from "../utils/storage";
import { config } from "../template_config"
import { useRelay } from "./RelayContext";
import { useTwetch } from "./TwetchContext";
import { useHandCash } from "./HandCashContext";
import axios from "axios";
import moment from "moment";

type BitcoinContextValue = {
    wallet: 'relayx' | 'twetch' | 'handcash';
    avatar: string | undefined;
    paymail: string | undefined;
    userName: string | undefined;
    setWallet: (wallet: 'relayx' | 'twetch' | 'handcash') => void;
    authenticate: () => Promise<void>;
    authenticated: boolean;
    logout: () => void;
}

const BitcoinContext = createContext<BitcoinContextValue | undefined>(undefined)
const BitcoinProvider = (props: { children: React.ReactNode }) => {
    const [wallet, setWallet] = useLocalStorage(walletStorageKey, "relayx")
    const { relayxAuthenticate, relayOne, relayxAuthenticated, relayxLogout, relayxAvatar, relayxPaymail, relayxUserName } = useRelay()
    const { twetchAuthenticate, twetchAuthenticated, twetchLogout, twetchAvatar, twetchPaymail, twetchUserName } = useTwetch()
    const { handcashAuthenticate, handcashAuthenticated, handcashLogout, handcashAvatar, handcashPaymail, handcashUserName} = useHandCash()

    useEffect(() => {
        console.log(moment().subtract(48,'hours').valueOf())
        Promise.all([
            axios.get(`https://pow.co/api/v1/boost/work?start=${moment().subtract(24,'hours').valueOf()}&end=${moment().valueOf()}`),
            axios.get(`https://pow.co/api/v1/boost/work?start=${moment().subtract(48,'hours').valueOf()}&end=${moment().subtract(24,'hours').valueOf()}`)
        ]).then((arrayResp: any) => {
            let todayWork = arrayResp[0].data.work;
            let yesterdayWork = arrayResp[1].data.work;
            console.log(todayWork,yesterdayWork);


            let todayValue = 0; 
            let todayDifficulty = 0;
            let yesterdayValue = 0;
            let yesterdayDifficulty = 0;

            for (const work of todayWork){
                
                todayValue = todayValue + work.value
                todayDifficulty =  todayDifficulty + work.difficulty
            }

            for (const work of yesterdayWork){
                
                yesterdayValue += work.value
                yesterdayDifficulty += work.difficulty
            }

            console.log("today:", todayValue, "sats earned by miners", todayDifficulty, "difficulty")
            console.log("yesterday:", yesterdayValue, "sats earned by miners", yesterdayDifficulty, "difficulty")
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
            default:
                break;
        }
    },[wallet, relayxAvatar, twetchAvatar, handcashAvatar])


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
    },[wallet, relayxPaymail, twetchPaymail, handcashPaymail])

    const userName = useMemo(() => {
        switch (wallet){
            case 'relayx':
                return relayxUserName
            case 'twetch':
                return twetchUserName
            case 'handcash':
                return handcashUserName
            default:
                break;
        }
    },[wallet, relayxUserName, twetchUserName, handcashUserName])

    const authenticated = useMemo(()=> relayxAuthenticated || twetchAuthenticated || handcashAuthenticated, [relayxAuthenticated, twetchAuthenticated, handcashAuthenticated])

    const logout = () => {
        relayxLogout()
        twetchLogout()
        handcashLogout()
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
            logout
        }),
        [
            avatar,
            wallet,
            paymail,
            userName,
            setWallet,
            authenticate,
            authenticated,
            logout
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