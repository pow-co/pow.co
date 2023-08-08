
import Drawer from './Drawer'

import WalletProviderPopUp from './WalletProviderPopUp'

import { useBitcoin } from '../context/BitcoinContext'

export default function WalletSelectDrawer() {

  const { walletPopupOpen, setWalletPopupOpen } = useBitcoin()

  return (

    <Drawer selector="#walletProviderPopupController"
        isOpen={walletPopupOpen}
        onClose={() => setWalletPopupOpen(false)}>

        <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />

    </Drawer>

  )

}
