import React, {useState, useRef} from 'react'
import { toast } from 'react-toastify'
import { useBitcoin } from '../context/BitcoinContext'
import axios from 'axios'

import { wrapRelayx } from 'stag-relayx'
import { useRelay } from '../context/RelayContext'

import Drawer from "./Drawer"
import SuperBoostPopup from './SuperBoostPopup'


export const SuccessSnackbar = (props) => {
  return (<div
    className="mx-2 sm:mx-auto max-w-sm  flex flex-row items-center justify-between bg-green-200 p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap">
    <div className="inline-flex items-center text-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd" />
      </svg>
      Bought {props.difficulty} difficulty
    </div>
    <div className="text-green-700 cursor-pointer hover:text-green-800">
      <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${props.tx_id}`}>View</a>
    </div>
  </div>)
}

export const ErrorSnackbar = (props) => {
  console.log(props)
  return (
    <div
      className="mx-2 sm:mx-auto max-w-sm  flex flex-row items-center justify-between bg-red-200 p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap">
      <div className="inline-flex items-center text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd" />
        </svg>
        {props.message}
      </div>
    </div>
  )
}

const BoostButton = ({ tx_id, zenMode, difficulty }) => {
  const { relayOne } = useRelay()
  const { authenticated } = useBitcoin()
  const [action, setAction] = useState("")
  const [superBoost, setSuperBoost] = useState(false)
  const [boostPopupOpen, setBoostPopupOpen] = useState(false)
  const timerRef = useRef();
  const isLongPress = useRef();
  const superBoostLoading = useRef();


  //const { boost } = useBitcoin()
const boost = async (contentTxid) => {
  if(!authenticated){
    throw new Error("please, log in!")
  }
  const stag = wrapRelayx(relayOne)
  const {txid, txhex, job} = await stag.boost.buy({
    content: contentTxid,
    difficulty: 0.025,
    value: 124000,
  })
  relayOne.send({
    currency: 'BSV',
    amount: 0.00052,
    to: '1MqPZFc31jUetZ5hxVtG4tijJSugAcSZCQ' // askbitcoin.ai revenue address
  })
  .then(result => {
    console.log('relayone.send.reward.result', result)
  })
  .catch(error => {
    console.log('relayone.send.reward.error', error)
  })

  return {txid, txhex, job}
  
}



const handleBoost = async (e) => {
  e.preventDefault()
  e.stopPropagation()
  


  try {

    console.log("handleboost",action)
    if(action === "click"){


      let {txid, txhex, job} = await toast.promise(boost(tx_id), {
        pending: 'Transaction is pending 🚀',
        success: {
          render({data}){
            return <SuccessSnackbar difficulty={data.job.difficulty} tx_id={data.txid}/>
          },
          icon:false
        },
        error: {
          render({data}){
            return <ErrorSnackbar message={data.message}/>
          },
          icon:false
        }
      }, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      closeButton: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      })

      console.log('bitcoin.boost.result', {txid, txhex,job});

    }

    if (action==="longpress"){

      console.log("superboost canceled")

      return

    }

    if(action==="superboost"){

      console.log("superboost trigered")

      return
    }
    
  } catch (error) {
    console.log(error)
  }
  

}

function startPressTimer() {
  isLongPress.current = false;
  setAction("")

  timerRef.current = setTimeout(() => {
    isLongPress.current = true;
    setSuperBoost(true)
    setAction('longpress');
  }, 690)

  superBoostLoading.current = setTimeout(() => {
    if(!isLongPress.current){
      return
    }
    superBoostLoading.current = true
    setAction("superBoost")
    setBoostPopupOpen(true)
    setSuperBoost(false)
  }, 2180)
}

function handleOnMouseDown(e) {
  e.preventDefault()
  e.stopPropagation()
  if(boostPopupOpen){
    return
  }
  console.log('handleOnMouseDown');
  startPressTimer();
  setAction("click")
}

function handleOnMouseUp(e) {
  e.preventDefault()
  e.stopPropagation()
  console.log('handleOnMouseUp');
  setSuperBoost(false)
  clearTimeout(timerRef.current);
  clearTimeout(superBoostLoading.current)
}

function handleOnTouchStart(e) {
  e.preventDefault()
  e.stopPropagation()
  if(boostPopupOpen){
    return
  }
  console.log('handleOnTouchStart');
  startPressTimer();
  setAction("click")
  handleBoost(e)
}

function handleOnTouchEnd(e) {
  e.preventDefault()
  e.stopPropagation()
  console.log('handleOnTouchEnd');
  setSuperBoost(false)
  clearTimeout(timerRef.current);
  clearTimeout(superBoostLoading.current)
  /* if ( action === 'longpress' ) return;
  console.log('handleOnTouchEnd');
  clearTimeout(timerRef.current); */

}

  return (
    <>
      <div onClick={handleBoost} onMouseDown={handleOnMouseDown} onMouseUp={handleOnMouseUp} onTouchStart={handleOnTouchStart} onTouchEnd={handleOnTouchEnd} className={`${zenMode && "justify-center"} flex group items-center w-fit relative select-none`}>
          <div className={superBoost && !boostPopupOpen ? `absolute ${zenMode ? "justify-center":"left-[14px]"} min-h-[42px] min-w-[42px] rounded-full border-t-4 border-green-500 animate-spin`: "hidden"}/>
          <div className={`hidden group-hover:block animate-ping absolute ${zenMode ? "justify-center":"left-[18px]"} min-h-[33px] min-w-[33px] rounded-full bg-blue-200`}></div>
          <div className={`hidden group-hover:block animate-ping  delay-75 absolute ${zenMode ? "justify-center":"left-[24px]"} min-h-[22px] min-w-[22px] rounded-full bg-blue-400`}></div>
          <div className={`hidden group-hover:block animate-ping  delay-100 absolute ${zenMode ? "justify-center":"left-[29px]"} min-h-[11px] min-w-[11px] rounded-full bg-blue-600`}></div>
          <svg viewBox='0 0 65 65' className='relative min-h-[69px] min-w-[69px] stroke-1 stroke-gray-500 dark:stroke-gray-300 rounded-full group-hover:stroke-blue-500'>
              <path
                  d="M40.1719 32.6561C40.1719 35.6054 38.5079 38.1645 36.0692 39.4499C35.002 40.0122 33.7855 36.2423 32.4945 36.2423C31.1288 36.2423 29.8492 40.0696 28.7418 39.4499C26.4007 38.1359 24.8228 35.5308 24.8228 32.6561C24.8228 28.4214 28.2598 24.9844 32.4945 24.9844C36.7291 24.9844 40.1719 28.4157 40.1719 32.6561Z"
                  className='stroke-gray-500 dark:stroke-gray-300 group-hover:stroke-blue-500'
                  fill='transparent'
              ></path>
          </svg>
          {!zenMode && <p className="text-gray-500 dark:text-gray-300 group-hover:text-blue-500 -ml-3">
              {difficulty.toFixed(3)} 
          </p>}
      </div>
      <Drawer 
      selector="#boostPopupControler"
      isOpen={boostPopupOpen}
      onClose={() => setBoostPopupOpen(false)}
    >
      <SuperBoostPopup contentTxId={tx_id} onClose={() => setBoostPopupOpen(false)}/>
    </Drawer>
  </>
   
  )
}

export default BoostButton