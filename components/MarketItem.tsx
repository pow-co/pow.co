import { useRouter } from 'next/router'
import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import { useRelay } from '../context/RelayContext'
import BoostButton from './BoostButton'


const SuccessSnackbar = (props) => {
    return (<div
      className="mx-2 sm:mx-auto max-w-sm  flex flex-row items-center justify-between bg-green-200 p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap">
      <div className="inline-flex items-center text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd" />
        </svg>
        1 token bought
      </div>
      <div className="text-green-700 cursor-pointer hover:text-green-800">
        <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${props.tx_id}`}>View</a>
      </div>
    </div>)
  }
  
  const ErrorSnackbar = (props) => {
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

const MarketItem = ({item, token}) => {
    const router = useRouter()
    const { relayOne } = useRelay()
    if (!item.satoshis){ // not for sale = do not display todo
        return <></>
    }

    const handleBuy = async (e) => {
        e.preventDefault()
        const resp = await toast.promise(buyItem(item), {
            pending: 'Transaction is pending 🚀',
            success: {
            render({data}){
                return <SuccessSnackbar tx_id={data.txid}/>
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
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: false,
        theme: "light",
        })

    }

    const buyItem = async (runItem) => {
        const ownerResponse = await relayOne.alpha.run.getOwner();
        
        try {

            const response = await axios.post(
                "https://staging-backend.relayx.com/api/dex/buy",
                    {
                    address: ownerResponse,
                    location: token.origin,
                    txid: runItem.txid,
                    }
            );
    
            const sendResponse = await relayOne.send(response.data.data.rawtx);
            console.log(sendResponse)
            return sendResponse
            
        } catch (error) {

            throw error
            
        }
            
    };
    
  return (
    <div
        className="rounded-xl border-xl bg-gray-900 w-full relative overflow-hidden ease-in duration-300 flex flex-col"
        href="#"
    >
        <img
        src={`https://berry2.relayx.com/${item.berry.txid}`}
        className="h-[261px] select-none object-cover w-full"
        />
        <div className="flex flex-col select-none bg-gray-100 dark:bg-gray-800 p-4 rounded-b-xl max-w-full">
            <p className="text-lg font-bold flex items-center justify-between">
                {token.name} #{item.props.no}
            </p>
            <div className="flex justify-between mt-2 items-center">
                <p className="text-lg font-semibold text-ellipsis whitespace-nowrap mr-4 grow opacity-70">
                {(item.satoshis * 1e-8).toFixed(3)} BSV
                </p>
            </div>
            <div className="flex items-center mt-2 justify-around">
                <button onClick={handleBuy} className="text-white bg-gradient-to-tr from-blue-500 to-blue-600 leading-6 py-1 px-10 font-bold border-none rounded cursor-pointer flex items-center text-center justify-center disabled:opacity-50 transition duration-500 transform hover:-translate-y-1">
                Buy
                </button>
                <div className='cursor-pointer'>
                    <BoostButton tx_id={item.txid} zenMode={true} difficulty={0}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MarketItem