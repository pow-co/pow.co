import Wallet from '../wallets/abstract';
import Relayx from '../wallets/relayx';
import Sensilet from '../wallets/sensilet';
import Handcash from '../wallets/handcash';
import Twetch from '../wallets/twetch';
import Local from '../wallets/local';

import { useHandCash } from '../context/HandCashContext';

export default function useWallet({ name }: { name: string }): Wallet {
  const { handCashAuthToken } = useHandCash();

  switch (name) {
    case 'twetch':

      return new Twetch();

    case 'relayx':

      return new Relayx();

    case 'handcash':

      return new Handcash({ authToken: String(handCashAuthToken) });

    case 'sensilet':

      return new Sensilet();

    case 'local':

      return new Local();

    default:
    
      throw new Error('invalid wallet type');
  }
}
