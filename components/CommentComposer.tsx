import React, { useState, useCallback, useContext, useEffect } from 'react'
import { useRouter } from "next/router"

import axios from 'axios';


import 'react-markdown-editor-lite/lib/index.css';


import { wrapRelayx } from 'stag-relayx'
import TwetchWeb3 from "@twetch/web3"

import BSocial from 'bsocial';
import { signOpReturn } from '../utils/bap';

import { toast } from 'react-hot-toast';


import { useRelay } from '../context/RelayContext';
import { useTuning } from '../context/TuningContext';
import axiosInstance, { useAPI } from '../hooks/useAPI';

import { FormattedMessage, useIntl } from 'react-intl';
import { MarkdownLogo } from './MarkdownComposer';
import { useBitcoin } from '../context/BitcoinContext';



interface CommentComposerProps {
  replyTx: string
}

const CommentComposer = ({replyTx}: CommentComposerProps) => {
  const router = useRouter()
  const { relayOne } = useRelay()
  const { wallet } = useBitcoin()
  const [initialBoost, setInitialBoost] = useState(false)
  const [content, setContent] = useState("")


    //@ts-ignore
    const stag = wrapRelayx(relayOne)


    const submitPost = async (e:any) => {
      e.preventDefault()
      
      const bsocial = new BSocial('pow.co');        

      const post = bsocial.reply(replyTx);

      post.setType('reply')

      post.addText(content)

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
            const bMapResult = await axios.post('https://b.map.sv/ingest', {
            rawTx: resp.rawTx
            })
            router.reload()
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
            const bMapResult = await axios.post('https://b.map.sv/ingest', {
              rawTx: resp.rawtx
            })
            toast('Success!', {
              icon: '✅',
              style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              },
            });
            router.reload()

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
   <div className="w-full sm:rounded-lg">
       <div className="px-4 py-2 bg-white rounded-lg dark:bg-primary-800/20">
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
        <div className="flex items-center justify-end px-3 py-2">
            <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Send
            </button>
        </div>

       </div>
   </div>
</form>



  )
}



export default CommentComposer;


const B_PREFIX = `19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut`;
const AIP_PREFIX = `15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva`;
export const MAP_PREFIX = `1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5`;