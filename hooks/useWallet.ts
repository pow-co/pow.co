import Wallet from '../wallets/abstract';
import Relayx from '../wallets/relayx';
import Sensilet from '../wallets/sensilet';
import Handcash from '../wallets/handcash';
import Twetch from '../wallets/twetch';
import LocalWallet from '../wallets/local';

import { bsv } from 'scrypt-ts'

import { useHandCash } from '../context/HandCashContext';

import { useBitcoin } from '../context/BitcoinContext';

import { useLocalWallet } from '../context/LocalWalletContext';
import { useRelay } from '../context/RelayContext';

export default function useWallet(): Wallet | null {

  let { wallet, paymail } = useBitcoin()

  const { handCashAuthToken } = useHandCash();

  const { relayxPublicKey, relayxAuthToken } = useRelay()

  const { localWallet } = useLocalWallet()

  paymail = String(paymail)

  switch (wallet) {

    case 'twetch':

      return new Twetch({ paymail });

    case 'relayx':

      return new Relayx({ paymail, publicKey: relayxPublicKey, token: relayAuthToken }))

    case 'handcash':

      return new Handcash({ authToken: String(handCashAuthToken), paymail });

    case 'sensilet':

      return new Sensilet();

    case 'local':

      return localWallet as LocalWallet

    default:
    
      return null
  }
}
