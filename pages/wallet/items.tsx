import React, { useState } from 'react'
import ThreeColumnLayout from '../../components/ThreeColumnLayout'
import { useBitcoin } from '../../context/BitcoinContext'
import { FormattedMessage } from 'react-intl'
import Drawer from '../../components/Drawer'
import WalletProviderPopUp from '../../components/WalletProviderPopUp'
import { Tooltip } from 'react-tooltip'
import Link from 'next/link'
import { WalletHeader } from '.'
import { useAPI } from '../../hooks/useAPI'
import Loader from '../../components/Loader'
import BoostPopup from '../../components/BoostpowButton/BoostPopup'

interface WalletItem {
    itemId: string;
    itemName: string;
    itemImage: string;
    tokenProtocol: '1sat' | 'run' | 'sigil',
    itemRarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'exotic';
    itemRank?: number;
    itemCollectionId?: string;
    itemCollectionName?: string;
    itemCollectionImage?: string;
    collectionItems?: WalletItem[];
}
const WalletItemPage = () => {
    const [boostPopupOpen, setBoostPopupOpen] = useState(false)
    const [walletPopupOpen, setWalletPopupOpen] = useState(false)
    const { wallet, authenticated, paymail } = useBitcoin()
    const { data, error, loading } = useAPI(`wallet/${paymail}/items`, '')

    const { items } = data || []


    if(!authenticated && wallet!= "local"){
        return (
            <>
            <ThreeColumnLayout>
                <div className='mt-5 sm:mt-10 h-screen'>
                    <p className='text-center text-lg py-5'>To access this feature, please sign in with your seed phrase.</p>
                    <div
                        onClick={()=>setWalletPopupOpen(true)}
                        className='flex p-5 transition duration-500 transform hover:-translate-y-1 h-8 text-base leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-500 to-primary-600  justify-center items-center cursor-pointer relative'>
                        <svg viewBox="0 0 16 14" fill="#000" width="16" height="14">
                        <path d="M2.16197 13.2675H13.838C15.2698 13.2675 16 12.5445 16 11.1271V2.86576C16 1.45546 15.2698 0.732422 13.838 0.732422H2.16197C0.730201 0.732422 0 1.44831 0 2.86576V11.1271C0 12.5445 0.730201 13.2675 2.16197 13.2675ZM1.18121 2.9445C1.18121 2.25725 1.54631 1.91363 2.20492 1.91363H13.7951C14.4465 1.91363 14.8188 2.25725 14.8188 2.9445V3.9539H1.18121V2.9445ZM2.20492 12.0863C1.54631 12.0863 1.18121 11.7356 1.18121 11.0483V5.50737H14.8188V11.0483C14.8188 11.7356 14.4465 12.0863 13.7951 12.0863H2.20492Z" fill="white">
                        </path>
                        </svg>
                        <span className='ml-4'><FormattedMessage id="Connect wallet"/></span>
                    </div>
                </div>
            </ThreeColumnLayout>
            <Drawer
                selector="#walletProviderPopupControler"
                isOpen={walletPopupOpen}
                onClose={() => setWalletPopupOpen(false)}
            >
                <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
            </Drawer>
            </>
        )
    }

    
  return (
    <>
        <ThreeColumnLayout>
            <div className='mt-5 sm:mt-10 min-h-screen'>
                <div className=' bg-primary-100 dark:bg-primary-700/20 sm:rounded-xl p-5'>
                    <WalletHeader/>
                    <div className='flex flex-col w-full'>
                        <div className='flex items-start gap-2 sm:gap-5'>
                            <Link href="/wallet/items">
                                <button className="cursor-pointer whitespace-nowrap rounded-md bg-primary-200 px-5 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">My items</button>
                            </Link>
                            <Link href='/wallet/tokens'>
                                <button className="cursor-pointer whitespace-nowrap rounded-md px-5 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">My tokens</button>
                            </Link>
                            <Link href="/wallet/history">
                                <button className="cursor-pointer whitespace-nowrap rounded-md px-5 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">Wallet history</button>
                            </Link>
                        </div>
                        {/* <div className='mt-5'>
                            {loading && <Loader/>}
                            {error && (<div className=''>Error, something happened</div>)}
                            <div className='grid grid-cols-2 gap-1'>
                                {items?.map((item: WalletItem) => {
                                    return (
                                        <>
                                        {item.collectionItems && item.collectionItems.length > 0 ? (
                                            <div className='grid grid-cols-12'>
                                                <img 
                                                    alt={`${item.itemCollectionName} Collection Image`} 
                                                    src={item.itemCollectionImage}
                                                    className='col-span-4'
                                                />
                                                <div className='col-span-8 flex flex-col items-center justify-end'>
                                                    <p className='text-lg font-bold'>{item.itemCollectionName}</p>
                                                    <p className='opacity-50'>Amount owned: {item.collectionItems.length}</p>
                                                </div>
                                            </div>
                                        ): (
                                            <div className='grid grid-cols-12'>
                                                <img 
                                                    alt={`${item.itemName} Image`}
                                                    src={item.itemImage}
                                                    className='col-span-4'
                                                />
                                                <div className='col-span-8 flex flex-col items-center justify-end'>
                                                    <p className='text-lg font-bold'>{item.itemName}</p>
                                                    {item.itemRarity && item.itemRank && <div className={`rounded-full px-3 py-2 
                                                    ${item.itemRarity === "common" && "bg-gray-500/80 text-gray-500"}
                                                    ${item.itemRarity === "uncommon" && "bg-blue-500/80 text-blue-500"}
                                                    ${item.itemRarity === "rare" && "bg-green-500/80 text-green-500"}
                                                    ${item.itemRarity === "epic" && "bg-pink-500/80 text-pink-500"}
                                                    ${item.itemRarity === "legendary" && "bg-yellow-500/80 text-yellow-500"}
                                                    ${item.itemRarity === "exotic" && "bg-violet-500/80 text-violet-500"}
                                                    `}>{item.itemRarity} - #{item.itemRank}</div>}
                                                </div>
                                            </div>
                                        )}
                                        </>
                                    )
                                }
                                )}
                            </div>
                        </div> */}
                        <div className='mt-5 flex flex-col justify-center text-center'>
                            <p className='text-5xl mb-3'>🚧</p>
                            <p className='text-lg italic opacity-80 px-10'>This feature is not available yet. Help us know it is important for you by boosting this 👇</p>
                            <button onClick={() => setBoostPopupOpen(true)} className='mt-5 mx-auto text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>wen wallet items?</button>
                        </div>
                    </div>
                </div>
            </div>
        </ThreeColumnLayout>
        <Drawer
            selector='#boostPopupControler'
            isOpen={boostPopupOpen}
            onClose={() => setBoostPopupOpen(false)}
        >
            <BoostPopup content="dc4d2da660e2a9eb946abfc928fd94b0239c4d6761ed3ff0b3ac84af861cdb6a" defaultTag='powco.dev' onClose={() => setBoostPopupOpen(false)} />
        </Drawer>
    </>
  )
}

export default WalletItemPage