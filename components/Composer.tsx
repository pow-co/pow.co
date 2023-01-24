import React, { useState, useCallback, useContext, useEffect } from 'react'
import { useRouter } from "next/router"

import axios from 'axios';


import 'react-markdown-editor-lite/lib/index.css';


import { wrapRelayx } from 'stag-relayx'

import BSocial from 'bsocial';
import { signOpReturn } from '../utils/bap';

import { toast } from 'react-hot-toast';


import { useRelay } from '../context/RelayContext';
import { useTuning } from '../context/TuningContext';
import axiosInstance, { useAPI } from '../hooks/useAPI';
import { SuccessSnackbar as BoostSuccessSnackbar } from './BoostButton';

import { FormattedMessage, useIntl } from 'react-intl';


interface PostSuccessProps {
  tx_id: string;
}

interface PostErrorProps {
  message: string;
}

const SuccessSnackbar = (props: PostSuccessProps) => {
  return (<div
    className="mx-2 sm:mx-auto max-w-sm  flex flex-row items-center justify-between bg-green-200 p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap">
    <div className="inline-flex items-center text-green-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd" />
      </svg>
      Transaction successful!
    </div>
    <div className="text-green-700 cursor-pointer hover:text-green-800">
      <a target="_blank" rel="noreferrer" href={`https://whatsonchain.com/tx/${props.tx_id}`}>View</a>
    </div>
  </div>)
}

const ErrorSnackbar = (props: PostErrorProps) => {
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





const Composer = () => {
  const router = useRouter()
  const { relayOne } = useRelay()
  const [initialBoost, setInitialBoost] = useState(false)
  const [content, setContent] = useState("")


        //@ts-ignore
    const stag = wrapRelayx(window.relayone)


    const submitPost = async (e:any) => {
      e.preventDefault()
      
      const bsocial = new BSocial('pow.co');        

      const post = bsocial.post();

      post.addText(content)

      const hexArrayOps = post.getOps('hex');

      const opReturn = signOpReturn(hexArrayOps)

      console.log({hexArrayOps, opReturn})

      const send = {
        to: 'johngalt@relayx.io',
        amount: 0.001,
        currency: 'BSV',
        opReturn
        /*opReturn: [
            '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAutM',
            value,
            'text/markdown',
            'UTF-8',
            '|',
            "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5",
            "SET",
            "app",
            "pow.co",
            "type",
            "post"
          ]*/
      }

      console.log("relayone.send", send)
      toast('Publishing Your Post to the Network', {
        icon: '⛏️',
        style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        },
      });
      try {
        let resp: any = await stag.relayone!.send(send)
        toast('Success!', {
          icon: '✅',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
        });
        console.log("relayx.response", resp)
        router.replace(`/${resp.txid}`)
      } catch (error) {
        toast('Error!', {
          icon: '🐛',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
      });
      }
    }

    const te = new TextEncoder()
    function toHex(s: string) {
      return Array.from(te.encode(s)).map(c => c.toString(16)).join('')
    }
    

    function makeB(text:string) {
      const pushdatas = ['19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut', text, 'text/markdown', "utf8"]
      return pushdatas;
    }
    function makeMap(o:any) {
      const pushdatas = ['1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5', 'SET'];
      for (const k in o) {
        pushdatas.push(k)
        pushdatas.push(o[k])
      }
      return pushdatas
    }

    function createBitcom(content:string) {
      const b = makeB(content);
      const map = makeMap({ type: 'post', app: 'relaytest' });
      return b.concat(['|'], map)
    }

    const handleChangeContent = (e: any) => {
      e.preventDefault()
      setContent(e.target.value)
    }

  return (
     
<form onSubmit={submitPost}>
   <div className="w-full mb-4 border border-gray-200 rounded-lg bg-primary-100 dark:bg-primary-700/20 dark:border-gray-600">
       <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-primary-800/20">
           <label htmlFor="post" className="sr-only">Your post</label>
           <textarea 
            id="post" 
            rows={4} 
            className="w-full px-0 text-sm text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400" 
            placeholder="Write a comment..." 
            required
            value={content}
            onChange={handleChangeContent}
          />
       </div>
       <div className='flex flex-col'>
        {/* <div className='flex items-center justify-between px-3 py-2 border-t dark:border-gray-600'>
          
        </div> */}
        <div className="flex items-center justify-between px-3 py-2 dark:border-gray-600">
            <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Create post
            </button>
            <div className="flex pl-0 space-x-1 sm:pl-2">
                <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Attach file</span>
                </button>
                {/* <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Set location</span>
                </button> */}
                <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Upload image</span>
                </button>
              
            </div>
        </div>

       </div>
   </div>
</form>



  )
}



export default Composer;


const B_PREFIX = `19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut`;
const AIP_PREFIX = `15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva`;
export const MAP_PREFIX = `1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5`;