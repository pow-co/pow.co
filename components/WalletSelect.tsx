import React from 'react'
import { useBitcoin } from '../context/BitcoinContext'
import { useHandCash } from '../context/HandCashContext'
import { useRelay } from '../context/RelayContext'
import { useTwetch } from '../context/TwetchContext'
import { useLocalWallet } from '../context/LocalWalletContext'

const WalletSelect = () => {
    const { wallet, setWallet } = useBitcoin()
    const { relayxAuthenticate, relayxPaymail } = useRelay()
    const { twetchAuthenticate, twetchPaymail } = useTwetch()
    const { handcashAuthenticate, handcashPaymail } = useHandCash()
    const { localWalletAuthenticate, localWallet, seedPhrase, localWalletPaymail } = useLocalWallet()

    const handleChange = async (e:any) => {

        switch (e.target.value){

          case 'relayx':

            if (relayxPaymail) {

              setWallet('relayx')

            } else {

              await relayxAuthenticate()

              setWallet('relayx')

            }

            break;

          case 'twetch':

            if (twetchPaymail) {

              setWallet('twetch')

            } else {

              await twetchAuthenticate()

              setWallet('twetch')

            }

            break;

          case 'handcash':

            if (handcashPaymail) {

              setWallet(e.target.value)

            } else {

              handcashAuthenticate()

            }

            break;

          case 'local':


            if (!localWalletPaymail) {


              await localWalletAuthenticate(seedPhrase)

            }

            setWallet('local')

            break;

          default:

            console.log("no wallet selected")
        }
    }
  return (
    <select value={wallet} onChange={handleChange} id="locale" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-primary-500 focus:border-primary-500 block grow p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
        <option selected value="relayx">RelayX</option>
        <option value="twetch">Twetch</option>
        <option value="handcash">Handcash</option>
        <option value="local">Local</option>
        {/* <option value="handcash">HandCash</option> */}
    </select>
  )
}

export default WalletSelect
