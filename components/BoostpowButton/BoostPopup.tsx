import React, { useEffect, useState} from 'react'
import axios, { AxiosResponse } from 'axios';
import toast from "react-hot-toast"
import { useBitcoin } from '../../context/BitcoinContext';
import TwetchWeb3 from '@twetch/web3';
import { Relayone, RelayoneSignResult, BoostJobParams, signBoostJob, LocalhostRelayone } from "../../utils/relayone"

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
}

const BoostPopup = ({ content, onClose }: BoostPopupProps) => {
    const { wallet } = useBitcoin()
    const absolute_min_value = 500;
    const min_profitability = 1;
    const default_profitability = 500000;
    const max_profitability = 5000000;
    const [difficulty, setDifficulty] = useState(0.0025)
    const [tag, setTag] = useState('')
    const [price, setPrice] = useState(0)
    const [value, setValue] = useState(0)
    const [devFee, setDevFee] = useState(0)
    const [exchangeRate, setExchangeRate] = useState(0)
    const [minValue, setMinValue] = useState(Math.max(absolute_min_value, difficulty * min_profitability))
    const [maxValue, setMaxValue] = useState(difficulty * max_profitability)
    const [factor, setFactor]= useState(maxValue / minValue)
    const [exponent, setExponent] = useState(Math.log(factor) / Math.log(minValue) + 1)
    const [position, setPosition] = useState(Math.max(((Math.log(default_profitability * difficulty) / Math.log(minValue) - 1) / (exponent - 1)),0))
    const [doSign, setDoSign] = useState(true);

  const handleCheckboxChange = () => {
    setDoSign(!doSign);
  };

  
  useEffect(() => {
    console.log("position",position)
    axios.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate').then((resp:AxiosResponse) => {
      setExchangeRate(resp.data.rate.toFixed(2))
      console.log("exchange rate", resp.data.rate.toFixed(2))
    })
  },[])

  useEffect(() => {
    console.log("min_value", Math.max(absolute_min_value, difficulty * min_profitability))
    setMinValue(Math.max(absolute_min_value, difficulty * min_profitability))
    console.log("max_value",difficulty * max_profitability )
    setMaxValue(difficulty * max_profitability)
  },[difficulty])

  useEffect(()=>{
    console.log("factor", maxValue / minValue)
    setFactor(maxValue / minValue)
  },[maxValue, minValue])

  useEffect(() => {
    setExponent(Math.log(factor) / Math.log(minValue) + 1)
  },[factor, minValue])
  

  useEffect(() => {
    console.log("value", Math.pow(minValue,(position * factor)) )
    setValue(Math.round(Math.pow(minValue, position * (exponent - 1) + 1 )))
  },[position, minValue, exponent])

  useEffect(() => {
    console.log(value,"price",value * 1e-8 * exchangeRate)
    setPrice(value * 1e-8 * exchangeRate)
  }, [exchangeRate, value])

  useEffect(() => {
    setDevFee(Math.round(value * 0.1))
  },[value])


  const handleChangeDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setDifficulty(parseFloat(e.target.value))
    setPosition(0.5)
  }
  const handleChangeTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setTag(e.target.value)
  }

  const handleChangePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPosition(parseFloat(e.target.value))
  }

  const boost = async (contentTxid: string) => {
    
    handleBoostLoading()

    var jobParams: BoostJobParams = {
      content: contentTxid,
      difficulty
    }

    if (tag) {
      jobParams['tag'] = tag
    }

    switch (wallet){
      case "relayx":

        try {

          if (doSign) {

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

          console.log("powco.boost.scripts.create.params", jobParams)

          const { data } = await axios.post('https://pow.co/api/v1/boost/scripts', jobParams)

          console.log("powco.boost.scripts.create.result", data)

          const outputs = [{
            to: data.script.asm,
            amount: value * 1e-8,
            currency: "BSV"
          }]
          //@ts-ignore
          outputs.push({
            currency: 'BSV',
            amount: devFee * 1e-8,
            to: '1Nw9obzfFbPeERLAmSgN82dtkQ6qssaGnU', // dev revenue address
          })

          console.log(outputs)

          //@ts-ignore
          const relayResponse = await window.relayone.send({
            outputs,
            opReturn: []
          })

          console.log("relayx.boost.response", relayResponse)

          const { data: powcoJobsSubmitResultData } = await axios.post(`${API_BASE}/api/v1/boost/jobs`, {
            transaction: relayResponse.rawTx
          })
          console.log('stag.powco.jobs.submit.result.data', powcoJobsSubmitResultData)

          const [job] = powcoJobsSubmitResultData.jobs

          const boost_result = {
              txid: relayResponse.txid,
              txhex: relayResponse.rawTx,
              job
          }

          console.log('boost.send.result', boost_result)


          /* const boost_result: BoostBuyResult = await stag.boost.buy({
            content: contentTxid,
            value: value,
            difficulty: difficulty,
            tag: tag,
          })
          //@ts-ignore
          window.relayone
            .send({
              currency: 'BSV',
              amount: devFee * 1e-8,
              to: '1Nw9obzfFbPeERLAmSgN82dtkQ6qssaGnU', // dev revenue address
            })
            .then((result: any) => {
              console.log('relayone.send.reward.result', result)
            })
            .catch((error: any) => {
              console.log('relayone.send.reward.error', error)
            }) */
          handleBoostSuccess()
          //@ts-ignore
        } catch (error: any) {
          console.log('boost.error', error)
          handleBoostError()
        }
        break;
      case "twetch":

        try {
          if (doSign){
            let resp = await TwetchWeb3.connect()
            let paymail = resp.paymail.toString()
            let pubkey = resp.publicKey.toString()
            console.log("identity: ", { paymail, pubkey })
            jobParams['additionalData'] = Buffer.from(`{
              identity {
                paymail: "${paymail}",
                publicKey: "${pubkey}"
              }
            }`, 'utf-8').toString("hex")
          }

	  const { data } = await axios.post('https://pow.co/api/v1/boost/scripts', jobParams)
        
          const outputs = [{
            sats: value,
            script: data.script.asm
          }];

          outputs.push({
            sats: devFee,
            //@ts-ignore
            to: '1Nw9obzfFbPeERLAmSgN82dtkQ6qssaGnU', // dev revenue address
          })

          console.log("twetch.boost.send", outputs)

          const twetchResponse = await TwetchWeb3.abi({
            contract: 'payment',
            outputs
          })
          console.log("twetch.boost.result", twetchResponse)

          const { data: powcoJobsSubmitResultData } = await axios.post(`${API_BASE}/api/v1/boost/jobs`, {
            transaction: twetchResponse.rawtx
          })
          console.log('stag.powco.jobs.submit.result.data', powcoJobsSubmitResultData)

          const [job] = powcoJobsSubmitResultData.jobs

          const boost_result = {
              txid: twetchResponse.txid,
              txhex: twetchResponse.rawtx,
              job
          }

          console.log('boost.send.result', boost_result)

          handleBoostSuccess()
          //@ts-ignore
        } catch (error:any) {
          console.log('twetch.boost.error', error)
          handleBoostError()
        }
        break;
      case "handcash":
        //TODO
        break;
      default:
        console.log("no wallet selected")
    }
  }

  const handleBoost = async () => {
    
    try {
      console.log(content)
      if(content === undefined){
        throw new Error("Content txid is undefined")
      }
      await boost(content)
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className='fixed inset-0'>
      <div className='flex flex-col h-screen'>
        <div onClick={onClose} className='grow cursor-pointer' />
        <div className='flex'>
          <div onClick={onClose} className='grow cursor-pointer' />
          <div className='flex flex-col w-[420px] h-[500px] rounded-t-lg bg-gray-100 dark:bg-gray-800'>
            <div className='flex items-center p-5 border-b border-b-gray-300 dark:border-b-gray-700'>
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
            <div className='grow flex flex-col justify-center items-center'>
              <div className=' text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                Tag
              </div>
              <input
                className='border border-gray-300 dark:border-gray-700 rounded-l-md text-gray-900 dark:text-white py-1 pl-2.5 text-base'
                type='text'
                value={tag}
                onChange={handleChangeTag}
              />
              <div className=' text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                Difficulty
              </div>
              <input
                className='border border-gray-300 dark:border-gray-700 rounded-l-md text-gray-900 dark:text-white py-1 pl-2.5 text-base'
                type='number'
                autoFocus
                min={0.00025}
                step={0.0005}
                value={difficulty}
                onChange={handleChangeDifficulty}
              />
              <div className=' text-gray-900 dark:text-white rounded-r-md py-1 pr-2.5'>
                satoshis: {value}
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
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/>
                <span className='ml-4 text-xl'>🐇</span>
              </div>
              <div className='flex py-1'>
                <input className='' type="checkbox" checked={doSign} onChange={handleCheckboxChange} />
                <p className='ml-2'>Sign with Paymail?</p>
              </div>
            </div>
            <div className='mb-20 sm:mb-0 p-5 flex items-center text-center justify-center'>
              <button
                onClick={handleBoost}
                className='text-white bg-gradient-to-tr from-blue-500 to-blue-600 leading-6 py-1 px-10 font-bold border-none rounded cursor-pointer disabled:opacity-50 transition duration-500 transform hover:-translate-y-1'
              >
                Boost ${price.toFixed(2)}
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