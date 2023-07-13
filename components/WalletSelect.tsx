import React from 'react'
import { useBitcoin } from '../context/BitcoinContext'
import { useHandCash } from '../context/HandCashContext'
import { useRelay } from '../context/RelayContext'
import { useTwetch } from '../context/TwetchContext'

const WalletSelect = () => {
    const { wallet, setWallet } = useBitcoin()
    const { relayxAuthenticate } = useRelay()
    const { twetchAuthenticate } = useTwetch()
    const { handcashAuthenticate } = useHandCash()


    const handleChange = (e:any) => {
        setWallet(e.target.value)
        switch (e.target.value){
          case 'relayx':
            relayxAuthenticate()
            break;
          case 'twetch':
            twetchAuthenticate()
            break;
          case 'handcash':
            handcashAuthenticate()
            break;
          default:
            console.log("no wallet selected")
        }
    }
  return (
    <select value={wallet} onChange={handleChange} id="locale" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block grow p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
        <option value="relayx">RelayX</option>
        <option value="twetch">Twetch</option>
        {/* <option value="handcash">HandCash</option> */}
    </select>
  )
}

export default WalletSelect