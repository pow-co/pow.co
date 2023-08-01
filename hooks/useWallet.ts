import Wallet from '../wallets/abstract';
import Relayx from '../wallets/relayx';
import Sensilet from '../wallets/sensilet';
import Handcash from '../wallets/handcash';
import Twetch from '../wallets/twetch';
import Local from '../wallets/local';

import { useHandCash } from '../context/HandCashContext';

import { useBitcoin } from '../context/BitcoinContext';

export default function useWallet(): Wallet {

  let { wallet, paymail } = useBitcoin()

  const { handCashAuthToken } = useHandCash();

  paymail = String(paymail)

  switch (wallet) {

    case 'twetch':

      return new Twetch({ paymail });

    case 'relayx':

      return new Relayx({ paymail });

    case 'handcash':

      return new Handcash({ authToken: String(handCashAuthToken), paymail });

    case 'sensilet':

      return new Sensilet();

    case 'local':

      return new Local();

    default:
    
      throw new Error('invalid wallet type');
  }
}
