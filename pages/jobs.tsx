import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Loader from '../components/Loader'
import ThreeColumnLayout from '../components/ThreeColumnLayout'
import { useAPI } from '../hooks/useAPI'
import moment from 'moment'
import BoostContentCard from '../components/BoostContentCard'
import { useBitcoin } from '../context/BitcoinContext'
import { useRelay } from '../context/RelayContext'
import TwetchWeb3 from '@twetch/web3'
import { toast } from 'react-hot-toast'

import { Script } from '@runonbitcoin/nimble'

interface Job {
    difficulty: number; //0.000010000047413057635,
    profitability: number; //99999525.87167163,
    id: number;//"18691",
    content: string; //"238e378a17ae1ec72a8a2fb3c6686b07729c60bf7c4be4070284edc63f306e8f",
    category: string; //"00000000",
    tag: string; //"796f6761",
    additionalData: string; // "",
    userNonce: string; //"78153972",
    minerPubKeyHash: string; // "5cf17d43386b04015f5e6df6149901f710efb3e0",
    txid: string; //"ab590f5120d79884be3cf7d0890f4e8da77c0111a35ce693cfc547a649bee68a",
    vout: number; //0,
    value: number; //1000,
    tx_hex: string; //"0100000001377df06f0abc56b2c0c5b247149a79ffe6863590e73b9c615f4dc89369e142cf010000006b4830450221008f8670c7c0d0e0b561ec12a951371e5a81c503e0d8a30de12f13b8d241cd16410220613231d6a3507ed6158ceafbffdee329a29a777405638f8e10006a0d7179704441210320a9af25b3c658da8172b8f2b983631122e8ce1a48ebca0c1a685ead129691c9ffffffff02e803000000000000c608626f6f7374706f7775145cf17d43386b04015f5e6df6149901f710efb3e00400000000208f6e303fc6ed840207e44b7cbf609c72076b68c6b32f8a2ac71eae178a378e23049e86011f04796f67610478153972007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac121e2500000000001976a914f8c8ea089583cecf1212ebc7e76adbac1b8fc26d88ac00000000",
    timestamp: Date; //"2023-02-12T13:54:37.000Z",
    spent: boolean; //false,
    script: string; //"08626f6f7374706f7775145cf17d43386b04015f5e6df6149901f710efb3e00400000000208f6e303fc6ed840207e44b7cbf609c72076b68c6b32f8a2ac71eae178a378e23049e86011f04796f67610478153972007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac",
    spent_txid: string; //null,
    spent_vout: number; //null,
    createdAt: Date; //"2023-02-12T13:54:37.000Z",
    updatedAt: Date; //"2023-02-12T13:54:37.000Z"
}

const BoostJobCard = (job: Job) => {
    const max_bounty = 1e8;
    const [factor, setFactor] = useState(0)
    const [bounty, setBounty] = useState(0)
    const newValue = useMemo(()=> job.value + bounty , [bounty])
    const newProfitability = useMemo(() => newValue / job.difficulty, [newValue])
    const { wallet } = useBitcoin()
    const { relayOne } = useRelay()

    const handleChangeBounty = (e:any) => {
        e.preventDefault()
        setBounty(parseFloat(e.target.value))
    }
    const addBounty = async () => {
        toast('Publishing Your Bounty to the Network', {
            icon: '⛏️',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
          });
          let script = Script.fromHex(job.script)
        switch (wallet){
            case "relayx":
                try {
                    let relayResponse = await relayOne?.send({
                        to: script.toASM(),
                        amount: bounty * 1e-8,
                        currency: "BSV"
                    })
                    console.log("relay.response",relayResponse)
                    toast('Success!', {
                        icon: '✅',
                        style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        },
                    });
                } catch (error) {
                    console.log(error)
                    toast('Error!', {
                        icon: '🐛',
                        style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        },
                      });
                }
                break;
            case "twetch":
                try {
                    let twetchResponse = await TwetchWeb3.abi({
                        contract: "payment",
                        outputs: [{
                            script: script.toASM(),
                            sats: bounty
                        }]
                    })
                    console.log("twetch.response",twetchResponse)
                    toast('Success!', {
                        icon: '✅',
                        style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        },
                    });
                } catch (error) {
                    console.log(error)
                    toast('Error!', {
                        icon: '🐛',
                        style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        },
                      });
                }
                break;
            case "handcash":
                break;
            default:
                console.log("no wallet selected")
        }
    }
    return (
    <div className='p-4 flex flex-col bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg'>
        <div className='flex'>
            <div className='grow'/>
            <a  onClick={(e:any)=>e.stopPropagation()}
                target="_blank"
                rel="noreferrer"
                href={`https://whatsonchain.com/tx/${job.txid}`}
                className="justify-end text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500"
            >
            {moment(job.createdAt).fromNow()}
            </a>
        </div>
        <p>Content: <Link href={`/${job.content}`} className="text-xs text-primary-500 break-words">{job.content}</Link></p>
        <p>{newValue} sats / {job.difficulty} difficulty = {newProfitability} profitability</p>
        <div className='flex items-center'>
            <input type="range" step={500} min={0}  max={1e8} value={bounty} onChange={handleChangeBounty} className="w-full mr-4 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
            <button 
                onClick={addBounty}
                className='text-sm leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-green-400 to-green-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'
            >
                {/* <FormattedMessage id="Ask Bitcoin"/> */}
                Add {bounty} sats to bounty
            </button>
        </div>
    </div>
    )
}

const JobsPage = () => {
    const { data, error, loading } = useAPI("/boost/jobs?limit=1000","")

    if (error) {
        return (
          <ThreeColumnLayout>
            Error, something happened
          </ThreeColumnLayout>
        )
      }
    
      
    let { jobs } = data || []
    jobs?.sort((a:Job, b: Job) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      });
  return (
    <ThreeColumnLayout>
        {/* <div className="flex mt-5 mx-0 px-4">
            <Link href={`/`}>
                <div className="text-sm leading-4 py-2 px-3 text-gray-900 dark:text-white bg-primary-100 dark:bg-primary-600/20 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap">
                    Unmined
                </div>
            </Link>
            <Link href={`/boost/completed`}>
                <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
                    Completed
                </div>
            </Link>
        </div> */}
        <div className="col-span-12 lg:col-span-6 min-h-screen overflow-x-hidden">
            <div className="mt-5 lg:mt-10 mb-[200px]">
                {loading ? <Loader/> : jobs?.map((job: Job) => {
                    
                return  <BoostJobCard key={job.txid} {...job}/>
            } ) }
            </div>
        </div>

    </ThreeColumnLayout>
  )
}

export default JobsPage