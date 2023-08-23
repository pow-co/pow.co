import React, { useEffect } from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import axios from 'axios'
import Meta from '../../components/Meta'
import PanelLayout from '../../components/PanelLayout'
import { OrdinalsProps } from '../wallet/items'
import Link from 'next/link'

interface OrdinalsDetailPageProps {
    ordinals: OrdinalsProps; 
}

export const getServerSideProps: GetServerSideProps<{ordinals: OrdinalsProps}> = async ({params}) => {
    //@ts-ignore
    const {origin} = params
    const [fileResult, dataResult] = await Promise.all([
        axios.get(`https://ordinals.gorillapool.io/api/files/inscriptions/${origin}`),
        axios.get(`https://ordinals.gorillapool.io/api/inscriptions/origin/${origin}`)
    ])
    const file = fileResult.data
    const ordinalsData = dataResult.data[0]
    const is1LoveOrd = ordinalsData.MAP?.name.startsWith("1LoveOrd")
    const ordinals = {
        content: file,
        contentType: ordinalsData.file.type,
        bsv20: ordinalsData.bsv20,
        listing: ordinalsData.listing,
        number: ordinalsData.num,
        origin: ordinalsData.origin,
        txid: ordinalsData.txid,
        name: ordinalsData.MAP?.name,
        collectionName: is1LoveOrd ? "1LoveOrd" : ordinalsData.MAP?.collectionName,
        collectionId: is1LoveOrd ? "1Love_Ordinals": ordinalsData.MAP?.collctionId
    }
    return { props: { ordinals } }
}

const OrdinalsDetailPage = ({ordinals}: OrdinalsDetailPageProps) => {

    useEffect(()=>console.log(ordinals),[])
    
  return (
    <>
    <Meta title='Ordinals | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <PanelLayout>
        <div className='grid grid-cols-2 gap-5 min-h-screen mt-5'>
            <div className='col-span-2 sm:hidden'>
                <h2 className='text-3xl font-bold break-words whitespace-pre-line'>{ordinals.name ? ordinals.name : `Inscription #${ordinals.number}`}</h2>
                {ordinals.name && <p className='opacity-70 text-lg'>Inscription #{ordinals.number}</p>}
                {ordinals.collectionName && ordinals.collectionId && <p className='mt-1'>By <span className='text-lg font-semibold bg-gradient-to-r from-primary-400  to-primary-800 text-transparent bg-clip-text'><Link href={`/ordinals/collections/${ordinals.collectionId}`}>{ordinals.collectionName}</Link></span></p>}
            </div>
            <div className='sm:pl-10 col-span-2 sm:col-span-1'>
                <div className='h-[420px] w-full flex flex-col justify-center items-center overflow-hidden relative rounded-t-lg bg-primary-200 dark:bg-primary-800/20'>
                    {ordinals.contentType.includes("image") && <img className='h-full w-full object-contain select-none' src={`https://ordinals.gorillapool.io/api/files/inscriptions/${ordinals.origin}`}/>}
                    {ordinals.contentType.includes("text") && <div className='h-full w-full flex justify-center items-center'>{ordinals.content}</div>}
                </div>
                <div className='bg-primary-100 dark:bg-primary-600/20 rounded-b-lg p-5'>
                    <div className='flex justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 rounded-lg cursor-pointer'>
                        <div className='flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="stroke-green-500 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                            </svg>
                            <p className='ml-2 font-bold'>List for sale</p>
                        </div>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                    <div className='mt-5 flex justify-between bg-primary-200 dark:bg-primary-800/20 px-5 py-3 rounded-lg cursor-pointer'>
                        <div className='flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                            <p className='ml-2 font-bold'>Transfer Item</p>
                        </div>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='col-span-2 sm:col-span-1 sm:pr-10'>
                <div className='hidden sm:block'>
                    <h2 className='text-3xl font-bold break-words whitespace-pre-line'>{ordinals.name ? ordinals.name : `Inscription #${ordinals.number}`}</h2>
                    {ordinals.name && <p className='opacity-70 text-lg'>Inscription #{ordinals.number}</p>}
                    {ordinals.collectionName && ordinals.collectionId && <p className='mt-1'>By <span className='text-lg font-semibold bg-gradient-to-r from-primary-400  to-primary-800 text-transparent bg-clip-text'><Link href={`/ordinals/collections/${ordinals.collectionId}`}>{ordinals.collectionName}</Link></span></p>}
                </div>
                {ordinals.attributes && <div className='mt-5 bg-primary-100 dark:bg-primary-600/20 p-5 rounded-lg'>

                </div>}
                <div className='mt-5 bg-primary-100 dark:bg-primary-600/20 p-5 rounded-lg'>
                    <h3 className='text-xl font-bold mb-5'>Item Details</h3>
                    <div className='flex justify-between mb-1'>
                        <p className='font-semibold'>Collection Name</p>
                        <p className='opacity-70'>{ordinals.collectionName}</p>
                    </div>
                    <div className='flex justify-between mb-1'>
                        <p className='font-semibold'>Creator</p>
                        <p className='opacity-70'></p>
                    </div>
                    <div className='flex justify-between mb-1'>
                        <p className='font-semibold'>Owner</p>
                        <p className='opacity-70'>{ordinals.collectionName}</p>
                    </div>
                    <div className='flex justify-between mb-1'>
                        <p className='font-semibold'>Total Supply</p>
                        <p className='opacity-70'>{ordinals.collectionName}</p>
                    </div>
                    <div className='flex justify-between mb-1'>
                        <p className='font-semibold'>Token Address</p>
                        <p className='opacity-70 w-44 truncate'>{ordinals.origin}</p>
                    </div>
                    <div className='flex justify-between mb-1'>
                        <p className='font-semibold'>Artist Royalties</p>
                        <p className='opacity-70 w-44 truncate'></p>
                    </div>
                    <div className='flex justify-between mb-1'>
                        <p className='font-semibold'>Market Fee</p>
                        <p className='opacity-70 '>2.8%</p>
                    </div>


                
                </div>
            </div>
        </div>
    </PanelLayout>
    </>
  )
}

export default OrdinalsDetailPage