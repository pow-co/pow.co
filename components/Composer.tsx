import React, { useState, useCallback, useContext, useEffect } from 'react'
import { useRouter } from "next/router"

import axios from 'axios';
import TwetchWeb3 from "@twetch/web3"

import 'react-markdown-editor-lite/lib/index.css';


import { wrapRelayx } from 'stag-relayx'

import BSocial from 'bsocial';
import { signOpReturn } from '../utils/bap';

import { toast } from 'react-hot-toast';


import { useRelay } from '../context/RelayContext';
import { useTuning } from '../context/TuningContext';
import axiosInstance, { useAPI } from '../hooks/useAPI';

import { FormattedMessage, useIntl } from 'react-intl';
import { MarkdownLogo } from './MarkdownComposer';
import { useBitcoin } from '../context/BitcoinContext';





const Composer = () => {
  const router = useRouter()
  const { relayOne } = useRelay()
  const [initialBoost, setInitialBoost] = useState(false)
  const [content, setContent] = useState("")
  const { paymail ,wallet } = useBitcoin()
  const [signWithPaymail, setSignWithPaymail] = useState(true)


        //@ts-ignore
    const stag = wrapRelayx(window.relayone)


    const submitPost = async (e:any) => {
      e.preventDefault()
      
      const bsocial = new BSocial('pow.co');        

      const post = bsocial.post();

      post.addText(content)

      if (signWithPaymail){
        post.addMapData('paymail', paymail)
      }

      const hexArrayOps = post.getOps('hex');

      const opReturn = signOpReturn(hexArrayOps)

      console.log({hexArrayOps, opReturn})
      
      toast('Publishing Your Post to the Network', {
        icon: '⛏️',
        style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        },
      });
      switch (wallet) {
        case "relayx":
          const send = {
            to: 'johngalt@relayx.io',
            amount: 0.001,
            currency: 'BSV',
            opReturn
          }
          console.log("relayone.send", send)
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
            await axios.post('https://b.map.sv/ingest', {
                rawTx: resp.rawTx
            });
            router.push(`/${resp.txid}`)
          } catch (error) {
            console.log(error)
            if(stag.relayone!.errors.isLowFunds(error) {
              toast('Error! Too Low Funds', {
                icon: '🐛',
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
            });
            }
            else {
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
          break;
        case "twetch":
          try {
            const outputs = [{
              sats:0,
              args: opReturn,
              address: null
            },{
              to: 'johngalt@relayx.io',
              sats: 0.001 * 1e8
            }]
            const resp = await TwetchWeb3.abi({
              contract: "payment",
              outputs: outputs,
            })
            console.log("twetch.response", resp)
            toast('Success!', {
              icon: '✅',
              style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              },
            });
            await axios.post('https://b.map.sv/ingest', {
                rawTx: resp.rawtx
            });
            router.push(`/${resp.txid}`)

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
          //TODO
          break;
        default: 
          console.log("no wallet selected")
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
   <div className="w-full mb-4 sm:border border-gray-200 sm:rounded-lg bg-primary-100 dark:bg-primary-700/20 dark:border-gray-600">
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
            <div className='flex items-center'>
              <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                  Create post
              </button>
              <div className="flex items-center ml-4">
                <input checked={signWithPaymail} id="sign-checkbox" type="checkbox" onClick={(e:any) => setSignWithPaymail(!signWithPaymail)} className="w-4 h-4 accent-primary-500 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="sign-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sign with paymail?</label>
              </div>
            </div>
            <div className="flex pl-0 space-x-1 sm:pl-2">
                <button onClick={()=>router.push('/compose/url')} type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    <span className="sr-only">Share URL</span>
                </button>
                {/* <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Set location</span>
                </button> */}
                <button onClick={()=>router.push('/compose/image')} type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                    <span className="sr-only">Upload image</span>
                </button>
                <button type="button" onClick={(e:any)=>router.push('/compose/markdown')} className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                    <MarkdownLogo/>
                    <span className="sr-only">Show MarkDown Editor</span>
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
