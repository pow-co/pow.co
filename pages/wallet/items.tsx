import React, { useEffect, useState } from 'react'
import Meta from '../../components/Meta'
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
import { useRelay } from '../../context/RelayContext'
import axios from 'axios'
import { useRouter } from 'next/router'

interface OrdinalsProps {
    content: string;
    contentType: string;
    bsv20: boolean;
    listing: boolean;
    number: number;
    origin: string;
    txid: string;
    name?: string;
}

interface OrdinalsPreviewProps {
    origin: string;
}
const OrdinalItemPreview = ({origin}: OrdinalsPreviewProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [ordinals, setOrdinals] = useState<OrdinalsProps>()

    useEffect(() => {
        setIsLoading(true)
        getData(origin).then((res) => {
            if(res){
                console.log(res)
                setOrdinals({
                    content: res.file,
                    contentType: res.ordinalsData.file.type,
                    bsv20: res.ordinalsData.bsv20,
                    listing: res.ordinalsData.listing,
                    number: res.ordinalsData.num,
                    origin: res.ordinalsData.origin,
                    txid: res.ordinalsData.txid,
                    name: res.ordinalsData.MAP?.name,
                })
            }
            setIsLoading(false)
        })
    },[])

    const getData = async (origin:string) => {
        try {
            const [fileResult, dataResult] = await Promise.all([
                axios.get(`https://ordinals.gorillapool.io/api/files/inscriptions/${origin}`),
                axios.get(`https://ordinals.gorillapool.io/api/inscriptions/origin/${origin}`)
            ])
            const file = fileResult.data
            const ordinalsData = dataResult.data[0]
    
            return {file, ordinalsData}
            
        } catch (error) {
            console.log(error)
            return null
        }

    }

    const viewItem = (e:any) => {
        e.preventDefault()
        if(ordinals){
            router.push(`/item/${ordinals.origin}`)
        }
    }


    if (ordinals){
        return (
            <div onClick={viewItem} className='grid grid-cols-12 h-24 rounded-xl bg-primary-200 dark:bg-primary-600/20 hover:bg-primary-300/80 hover:dark:bg-primary-600/50 cursor-pointer'>
                <div className='col-span-4'>
                    {ordinals.contentType.includes("image") && <img className='h-full w-full object-cover rounded-l-xl' src={`https://ordinals.gorillapool.io/api/files/inscriptions/${ordinals.origin}`}/>}
                    {ordinals.contentType.includes("text") && <div className='rounded-l-xl flex h-full w-full text-center items-center'>{ordinals.content}</div>}
                </div>
                <div className='flex flex-col justify-center col-span-6 ml-2'>
                    {ordinals.name && <h2 className='truncate text-lg font-bold'>{ordinals.name}</h2>}
                    <p className='opacity-70'>Inscription #{ordinals.number}</p>
                </div>
                <div className='col-span-2 flex items-center justify-center'>
                    {ordinals.listing && 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 fill-green-500">
                        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
                    </svg>                  
                    }
                </div>
            </div>
        )
    } else  {
        return <></>
    }

}

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
    const { runOwner } = useRelay()
    const { data, error, loading } = useAPI(`wallet/${paymail}/items`, '')
    const [ordinalsItems, setOrdinalsItems] = useState([])

    const { items } = data || []

    useEffect(() => {
        if(wallet === "relayx"){
            console.log(runOwner)
            axios.get(`https://ordinals.gorillapool.io/api/utxos/address/${runOwner}`).then((res) => {
                setOrdinalsItems(res.data)
            })
        }
    },[wallet])


    /* if(!authenticated && wallet!= "local"){
        return (
            <>
            <Meta title='Wallet | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
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
    } */

    
  return (
    <>
       <Meta title='Wallet | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
        <ThreeColumnLayout>
            <div className='mt-5 sm:mt-10 min-h-screen'>
                <WalletHeader/>
                <div className='mt-0.5 flex flex-col w-full'>
                    <div className='flex items-start gap-2 sm:gap-5  bg-primary-100 dark:bg-primary-700/20 sm:rounded-b-xl p-5'>
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
                    <div className='mt-5 bg-primary-100 dark:bg-primary-700/20 sm:rounded-xl p-5'>
                        <div className='mb-5 flex justify-between'>
                            <h2 className='text-xl font-bold'>1Sat Ordinals</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            {ordinalsItems.map((item:any) => <OrdinalItemPreview key={item.txid} origin={item.origin}/>)}
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