import React, { useEffect, useMemo, useState} from 'react'
import axios, { AxiosResponse } from 'axios';
import toast from "react-hot-toast"
import { useBitcoin } from '../../context/BitcoinContext';
import TwetchWeb3 from '@twetch/web3';
import { Relayone, RelayoneSignResult, BoostJobParams, signBoostJob, LocalhostRelayone } from "../../utils/relayone"

import { BoostPowJob } from 'boostpow'

import useWallet from '../../hooks/useWallet'
import Wallet from '../../wallets/abstract'

const API_BASE = "https://pow.co"

const handleBoostLoading = () => {
    toast('Publishing Your Boost Job to the Network', {
      icon: '⛏️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
};

const handleBoostSuccess = () => {
    toast('Success!', {
      icon: '✅',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
};

const handleBoostError = () => {
    toast('Error!', {
      icon: '🐛',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
};

interface BoostPopupProps {
    content: string;
    onClose: () => void;
    tagList?: Array<string>;
    defaultTag?: string;
}

const BoostPopup = ({ content, onClose, tagList, defaultTag }: BoostPopupProps) => {
    const [existingTags, setExistingTags] = useState(tagList || [])
    const [input, setInput] = useState("")
    const [tags, setTags] = useState<string[]>(defaultTag ? [defaultTag] : [])
    const [tagsWeight, setTagsWeight] = useState<number[]>([])
    const { exchangeRate } = useBitcoin()
    const absolute_min_value = useMemo(()=> tags.length > 0 ? tags.length * 500 : 500,[tags]);
    const min_profitability = 1;
    const default_profitability = 500000;
    const max_profitability = 5000000;
    const [difficulty, setDifficulty] = useState(0.0025)
    const minValue = useMemo(() =>  Math.max(absolute_min_value, difficulty * min_profitability),[absolute_min_value, difficulty])
    const maxValue= useMemo(() => difficulty * max_profitability, [difficulty])
    const factor= useMemo(() => maxValue / minValue, [maxValue, minValue])
    const exponent = useMemo(() => Math.log(factor) / Math.log(minValue) + 1, [factor, minValue])
    const [position, setPosition] = useState(Math.max(((Math.log(default_profitability * difficulty) / Math.log(minValue) - 1) / (exponent - 1)),0))
    const value = useMemo(() => Math.round(Math.pow(minValue, position * (exponent - 1) + 1 )),[minValue, position, exponent] )
    const price = useMemo(() => value * 1e-8 * exchangeRate, [value, exchangeRate])
    const devFee = useMemo(() => Math.round(value * 0.1), [value])
    const [doSign, setDoSign] = useState(true);
    const totalAmount = useMemo(()=> devFee + value,[devFee, value])


  const handleCheckboxChange = () => {
    setDoSign(!doSign);
  };

  const handleChangeDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setDifficulty(parseFloat(e.target.value))
    setPosition(0.5)
  }

  const handleChangePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPosition(parseFloat(e.target.value))
  }

  const wallet: Wallet = useWallet()

  const boost = async (contentTxid: string) => {
    
    handleBoostLoading()

    var jobParams: BoostJobParams = {
      content: contentTxid,
      diff: difficulty
    }

    try {

      const jobs: BoostPowJob[] = []

      if (wallet.name === 'relayx' && doSign) {

        //@ts-ignore
        const isLocalhost = window.location.host !== 'pow.co'

        //@ts-ignore
        const relayone: Relayone = isLocalhost ? new LocalhostRelayone() : window.relayone as Relayone;

        let signResult: RelayoneSignResult = await signBoostJob({
          relayone, 
          job: jobParams
        })

        console.log('relayone.RelayoneSignResult', signResult)

        jobParams['additionalData'] = Buffer.from(JSON.stringify(signResult), 'utf-8').toString("hex")

      }

      if (tags.length > 0) {

        for (let tag of tags) {

          jobParams['tag'] = Buffer.from(tag, 'utf8').toString('hex')

          jobParams['diff'] = difficulty / parseFloat(tags.length.toFixed(4))

          jobs.push(BoostPowJob.fromObject(jobParams))

        }

      } else {

        jobParams['diff'] = difficulty

        jobs.push(BoostPowJob.fromObject(jobParams))

      }

      const jobValue = BigInt(Math.floor(value / jobs.length))

     const tx = await wallet.createBoostTransaction(jobs.map(job => {
        return {
          job,
          value: jobValue
        }
      }))

      handleBoostSuccess()

      //@ts-ignore
    } catch (error: any) {

      console.log('boost.error', error)

      handleBoostError()
    }

  }

  const handleBoost = async () => {
    
    try {

      if (content === undefined) {

        throw new Error("Content txid is undefined")

      }

      await boost(content)

      onClose()

    } catch (error) {

      console.log('handleBoost.error', error)

    }

  }

  const handleClear = (e:any) => {
    e.preventDefault()
    setTags([])
    tags.forEach(tag => {
      if (tagList?.includes(tag)){
        setExistingTags(prev => [...prev, tag]);
      }
    })
  }

  const handleAddExistingTag = (entry:string) => {
    submitTag(entry)
    setExistingTags(existingTags.filter(item => item !== entry))
  }

  const sanitizeString = (input: string): string => {
    // Trim leading and trailing whitespace
    const trimmed = input.trim();

    // Trim to a maximum of 20 characters
    const sanitized = trimmed.slice(0, 20);

    // Convert to lowercase
    //const lowercase = sanitized.toLowerCase();

    return sanitized;
  };

  const submitTag = (entry: string) => {
    //check if entry is not void
    if(entry.length > 0){
      // check for duplicates here
      if (existingTags.includes(entry)){
        // handle duplicate tag case (e.g. show an error message)
        setExistingTags(prev => prev.filter(item => item !== entry))
      } else if (tags.includes(entry)){
        console.log("duplicate")
        return
      }
      setTags(prev => [...prev, entry])
    }
  }

  const handleSubmitTags = (e:any) => {
    e.preventDefault()
    let tags = input.split(/[, ]+/);
    tags.forEach(element => {
      element = sanitizeString(element)
      submitTag(element)
    })
    setInput("")
  }

  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Split the input into tags separated by commas
      const tags = input.split(/[, ]+/);

      // Process and submit each tag
      tags.forEach(tag => {
        const sanitizedTag = sanitizeString(tag.trim());
        submitTag(sanitizedTag);
      });

      // Clear the input state
      setInput("");
    }
  }

  const handleChangeInput = (e:any) => {
    e.preventDefault()
    setInput(e.target.value)
  }

  const deleteTag = (index:number) => {
    // delete Tag at index in the tag array
    let entry = tags[index]
    setTags(prev => {
      const updatedTags = [...prev]
      updatedTags.splice(index, 1)
      return updatedTags
    })
    if (tagList?.includes(entry)){
      setExistingTags([...existingTags, entry]);
    }
  }

  const handleIncrementDifficulty = (increment: number) => {
    let newValue = parseFloat((difficulty + increment).toFixed(2))
    if(newValue > 0) {
      setDifficulty(newValue)
    } else {
      setDifficulty(0)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className='fixed inset-0'>
      <div className='flex flex-col h-screen'>
        <div onClick={onClose} className='grow cursor-pointer' />
        <div className='flex'>
          <div onClick={onClose} className='grow cursor-pointer' />
          <div className='flex flex-col w-[420px] min-h-[500px] rounded-t-lg bg-gray-100 dark:bg-gray-800'>
            <div className='flex items-center p-5 border-b-4 border-b-gray-300 dark:border-b-gray-700'>
              <svg
                className=''
                width='65'
                height='65'
                viewBox='0 0 65 65'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M32.5 65C50.4493 65 65 50.4493 65 32.5C65 14.5507 50.4493 0 32.5 0C14.5507 0 0 14.5507 0 32.5C0 50.4493 14.5507 65 32.5 65Z'
                  fill='#CEDEFD'
                />
                <path
                  d='M32.4999 52.5876C43.5945 52.5876 52.5886 43.5936 52.5886 32.4989C52.5886 21.4042 43.5945 12.4102 32.4999 12.4102C21.4052 12.4102 12.4111 21.4042 12.4111 32.4989C12.4111 43.5936 21.4052 52.5876 32.4999 52.5876Z'
                  fill='#6B9CFA'
                />
                <path
                  d='M44.9113 32.8604C44.9113 37.5655 42.2948 41.7715 38.4331 43.8773C36.6715 44.8413 34.646 41.5305 32.5 41.5305C30.4343 41.5305 28.4892 44.7667 26.7735 43.8773C22.7971 41.8059 20.083 37.6516 20.083 32.8604C20.083 26.0035 25.6431 20.4434 32.5 20.4434C39.3569 20.4434 44.9113 26.0035 44.9113 32.8604Z'
                  fill='#085AF6'
                />
                <path
                  d='M40.1719 32.6561C40.1719 35.6054 38.5079 38.1645 36.0692 39.4499C35.002 40.0122 33.7855 36.2423 32.4945 36.2423C31.1288 36.2423 29.8492 40.0696 28.7418 39.4499C26.4007 38.1359 24.8228 35.5308 24.8228 32.6561C24.8228 28.4214 28.2598 24.9844 32.4945 24.9844C36.7291 24.9844 40.1719 28.4157 40.1719 32.6561Z'
                  fill='white'
                />
              </svg>
              <p className='ml-5 text-2xl font-bold'>Boostpow</p>
            </div>
            <div className='grow flex flex-col justify-around items-center'>
              {/* <div className='flex flex-col w-full justify-center items-center'>
                <div className='text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                  Tags<span className='ml-2 opacity-50'>(max 5)</span>
                </div>
                <input
                  className='border border-gray-300 dark:border-gray-700 rounded-l-md text-gray-900 dark:text-white py-1 pl-2.5 text-base'
                  type='text'
                  value={tag}
                  onChange={handleChangeTag}
                />
              </div> */}
              <div className='flex flex-col w-full justify-center items-center border-b border-b-gray-300 dark:border-b-gray-700 pb-3'>
                <div className='text-xl mb-2 font-semibold text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                  Tags
                </div>
                <div className="flex w-full px-5 ">
                  <button onClick={handleSubmitTags} className="mr-4 rounded-full p-2 bg-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFF" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                  <input onKeyDown={handleKeyDown} value={input} onChange={handleChangeInput} className="w-full py-2 px-4" type="search" placeholder="Enter a list of tags..."/>
                  {tags.length > 0 && <button onClick={handleClear} className="ml-5 text-blue-500 font-semibold hover:underline">Clear</button>}
                </div>
                <div className="justify-around w-full flex flex-wrap p-3 gap-2">
                  {tags.length > 0 && <>
                    {tags.map((topic: string, index: number) => (
                      <div key={topic} className=''>
                        <div onClick={() => deleteTag(index)} className="group flex justify-around items-center cursor-pointer rounded-full border border-gray-400 dark:border-gray-600 p-5 py-2 bg-blue-500 border-none">
                          <div className="text-white">
                            #{topic}
                          </div>
                          <div className="hidden group-hover:block  ml-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFF" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        </div>
  {/*                       {tags.length > 1 && <input
                          className='mt-2' 
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={tagsWeight[index]}
                        />}
  */}                    </div>
                    ))}
                  </>}
                  {existingTags.length > 0 && (
                    <>
                      {existingTags.map((topic:string) => (
                        <div key={topic} onClick={() => handleAddExistingTag(topic)} className="flex justify-around items-center cursor-pointer rounded-full border-2 hover:border-blue-500 hover:text-blue-500  p-5 py-2 ">
                          #{topic}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className='flex flex-col w-full justify-center items-center border-b border-b-gray-300 dark:border-b-gray-700 pb-3'>
                <div className='text-xl mb-2 font-semibold  text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                  Total Difficulty
                </div>
                <div className='flex'>
                  <div onClick={() => handleIncrementDifficulty(-1)} className='w-10 text-center cursor-pointer hover:bg-blue-500/80 hover:text-white border rounded py-1 px-2.5'>--</div>
                  <div onClick={() => handleIncrementDifficulty(-0.1)} className='mr-2 w-10 text-center cursor-pointer hover:bg-blue-500/80 hover:text-white border rounded py-1 px-2.5'>-</div>
                  <input
                    className='border border-gray-300 dark:border-gray-700 rounded-md text-gray-900 dark:text-white py-1 pl-2.5 text-base'
                    type='number'
                    min={0.00025}
                    step={0.0005}
                    value={difficulty}
                    onChange={handleChangeDifficulty}
                  />
                  <div onClick={() => handleIncrementDifficulty(0.1)} className='ml-2 w-10 text-center cursor-pointer hover:bg-blue-500/80 hover:text-white border rounded py-1 px-2.5'>+</div>
                  <div onClick={() => handleIncrementDifficulty(1)} className='w-10 text-center cursor-pointer hover:bg-blue-500/80 hover:text-white border rounded py-1 px-2.5'>++</div>

                </div>
              </div>
              <div className='flex flex-col w-full justify-center items-center border-b border-b-gray-300 dark:border-b-gray-700 pb-3'>
                <div className='text-xl mb-2 font-semibold  text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                  Bounty Amount: {value} sats
                </div>
                <div className='flex items-center px-10 w-full'>
                  <span className='mr-4 text-xl'>🐢</span>
                  <input 
                    type="range" 
                    min={0} 
                    max={1} 
                    step={0.01}
                    onChange={handleChangePosition} 
                    value={position} 
                    className="w-full h-2 bg-gray-200 rounded-lg  cursor-pointer dark:bg-gray-700"/>
                  <span className='ml-4 text-xl'>🐇</span>
                </div>
              </div>
              <div className='flex py-1 mt-3'>
                <input className='' type="checkbox" checked={doSign} onChange={handleCheckboxChange} />
                <p className='ml-2'>Sign with Paymail?</p>
              </div>
            </div>
            <div className='mb-20 sm:mb-0 p-5 flex items-center text-center justify-center'>
              <button
                onClick={handleBoost}
                className='text-white bg-gradient-to-tr from-blue-500 to-blue-600 leading-6 py-1 px-10 font-bold border-none rounded cursor-pointer disabled:opacity-50 transition duration-500 transform hover:-translate-y-1'
              >
                {`Buy Boost for ${totalAmount > 10e4 ? `₿${(totalAmount/10e8).toFixed(4)} `:`${totalAmount} sats`}`}
              </button>
            </div>
          </div>
          <div onClick={onClose} className='grow cursor-pointer' />
        </div>
      </div>
    </div>
  )
}

export default BoostPopup
