import React, { useMemo, useState } from 'react'
import Meta from '../../components/Meta'
import PanelLayout from '../../components/PanelLayout'
import Link from 'next/link'
import { useBitcoin } from '../../context/BitcoinContext'

import { SmartContract, Scrypt, bsv } from "scrypt-ts";

import { Meeting } from "../../src/contracts/meeting"
import artifact from "../../artifacts/meeting.json"
import useWallet from '../../hooks/useWallet'
import { useRouter } from 'next/router'
import axios from 'axios'
import Loader from '../../components/Loader'

Meeting.loadArtifact(artifact);

const OneHourIndex = () => {
    const router = useRouter()
    const { exchangeRate } = useBitcoin()
    const wallet = useWallet()
    const [hoursOwned, setHoursOwned] = useState(0)
    const [hoursMinted, setHoursMinted] = useState(0)
    const available = useMemo(() => 218 - hoursMinted,[hoursMinted])
    const [amount, setAmount] = useState(1)
    const [isMinting, setIsMinting] = useState(false) 
    const [amountMinted, setAmountMinted] = useState(0)
    const bsvPrice = useMemo(() => (amount / exchangeRate).toFixed(4).toString(),[exchangeRate, amount])

    const handleChangeAmount = (e:any) => {
        e.preventDefault()
        setAmount(e.target.value)
    }

    const handleMint = async (e:any) => {
        e.preventDefault()
        setIsMinting(true)
        try {
            for (let index = 0; index < amount; index++) {
                
                const { data } = await axios.post(`https://pow.co/api/v1/meetings/new`, {
                    title: `1Hour #${index+1}`,
                    description: "This represents one hour of my time that you can buy to make me do whatever you want me to do.",
                    start: "tbd",
                    end: "tbd",
                    owner: '034e33cb5c1d3249b98624ebae1643aa421671a58c94353cbb5a81985e09cc14c8', // when you mint you don't directly own you 1Hour the contract owns it and auto-lists it on the market
                    organizer: wallet?.publicKey?.toString() || '034e33cb5c1d3249b98624ebae1643aa421671a58c94353cbb5a81985e09cc14c8', // you are the organizer of the event
                    url: ' ',
                    status: ' ',
                    location: ' ',
                    inviteRequired: true,
                })

                const script = bsv.Script.fromASM(data.scriptASM)

                const tx = await wallet?.createTransaction({
                    outputs: [
                        new bsv.Transaction.Output({
                            script,
                            satoshis: 10
                        }),
                        new bsv.Transaction.Output({
                            to: "jack@relayx.io",
                            satoshis: Math.round(0.5 * 1e8 / exchangeRate) 
                        }),
                        new bsv.Transaction.output({
                            to: "owenkellogg@relayx.io",
                            satoshis: Math.round(0.25 * 1e8 / exchangeRate)
                        }),
                        new bsv.Transaction.output({
                            to: "aristotelis@relayx.io",
                            satoshis: Math.round(0.25 * 1e8 / exchangeRate)
                        })
                    ]
                })
                
                if (!tx) { break }
                
                console.log('1hour.created', tx.hash)

                setAmountMinted(index + 1)
                
            }
        
        setIsMinting(false)

        router.push(`/1hour/market/${wallet?.publicKey?.toString()}`)

        } catch (error) {
            
            console.error(error)
            
            setIsMinting(false)
        }
    }
  return (
    <>
    <Meta title='1Hour | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <PanelLayout>
        <div className='my-5 sm:my-10 min-h-screen'>
            <div className='flex flex-col mx-auto items-center max-w-lg sm:rounded-lg p-5 bg-primary-100 dark:bg-primary-600/20'>
                <h1 className='text-3xl font-bold'>1Hour</h1>
                <h2 className='text-xl font-semibold opacity-60'>Your Time is Money (really)</h2>
                <div className='mt-5 text-center'>
                    <p className='p-2'>By minting the 1Hour contract you create a tradeable one hour of your time.</p>
                    <p className='p-2'>The max number of 1Hour contracts that can be emitted for one person is 218 per year.</p>
                    <p className='p-2'>The price discovery mechanism of the 1Hour contracts is the following: your 1Hour contract is automatically listed on the 1Hour market at a starting price of $1, doubling for every 1Hour contract minted.</p>
                </div>
                <div className='mt-5 px-5 flex items-center w-full'>
                    <p className='mr-3'>1</p>
                    <input 
                        type="range" 
                        min={1} 
                        max={available} 
                        step={1}
                        onChange={handleChangeAmount} 
                        value={amount} 
                        className="w-full h-2 bg-gray-200 rounded-lg accent-primary-500 cursor-pointer dark:bg-gray-700"
                    />
                    <p className='ml-3'>{available}</p>
                </div>
                <div className='mt-5 w-full flex justify-around'>
                    <div className=''>
                        <button onClick={handleMint} className='text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>Mint {amount} {amount>1 ? "Hours": "Hour"} (${amount})</button>
                        <p className='text-center opacity-50'>~{bsvPrice} BSV</p>
                    </div>
                    <Link href="/1hour/market">
                        <button className='text-primary-500 font-semibold border-2 rounded-md border-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>1Hour Market</button>
                    </Link>
                </div>
                {isMinting &&(
                <div className='mt-5'>
                    {amountMinted !== amount ? (
                        <div role="status" className='flex flex-col items-center justify-center'>
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-400 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span>
                            <p className='mt-2 opacity-60'>{amountMinted}/{amount} hour(s) minted</p>
                        </div>
                    ) : (
                        <div role="status" className='flex flex-col items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-8 h-8 stroke-green-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className='mt-2'>Done!</p>
                        </div>
                    )}
                </div>
                )}
            </div>
            <div className='mt-10 px-3 sm:px-0 max-w-lg mx-auto gap-5 grid grid-cols-2'>
                <div className='border-2 rounded-lg p-5 border-primary-500 flex flex-col items-center'>
                    {hoursOwned > 0 ? (
                        <div className="text-center">
                            <p className='text-lg'>You own<span className='font-bold text-primary-500 mx-1'>{hoursOwned}</span>hours!</p>
                            <p className='text-5xl'>🤑</p>
                            <Link href="/1hour/wallet">
                                <p className='mt-2 text-primary-500 font-semibold hover:underline'>View wallet</p>
                            </Link>
                        </div>
                    ) :(
                        <div className="text-center">
                            <p className='text-lg'>You own 0 hours, ngmi.</p>
                            <p className='text-5xl'>😢</p>
                        </div>
                    )}
                </div>
                <div className='border-2 rounded-lg p-5 border-primary-500 flex flex-col items-center'>
                    {hoursMinted > 0 ? (
                        <div className="text-center">
                            <p className='text-lg'>You minted<span className='font-bold text-primary-500 mx-1'>{hoursMinted}</span>hours!</p>
                            <p className='text-5xl'>🤩</p>
                            <Link href={`/1hour/${wallet?.publicKey?.toString()}`}>
                                <p className='mt-2 text-primary-500 font-semibold hover:underline'>View profile</p>
                            </Link>
                        </div>
                    ) :(
                        <div className="text-center">
                            <p className='text-lg'>You own 0 hours, ngmi.</p>
                            <p className='text-5xl'>😔</p>
                        </div>
                    )}
                </div>

            </div>
            
        </div>
    </PanelLayout>
    </>
  )
}

export default OneHourIndex