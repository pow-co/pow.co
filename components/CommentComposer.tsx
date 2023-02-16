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

import { FormattedMessage, useIntl } from 'react-intl';
import { MarkdownLogo } from './MarkdownComposer';



interface CommentComposerProps {
  replyTx: string
}

const CommentComposer = ({replyTx}: CommentComposerProps) => {
  const router = useRouter()
  const { relayOne } = useRelay()
  const [initialBoost, setInitialBoost] = useState(false)
  const [content, setContent] = useState("")


    //@ts-ignore
    const stag = wrapRelayx(window.relayone)


    const submitPost = async (e:any) => {
      e.preventDefault()
      
      const bsocial = new BSocial('pow.co');        

      const post = bsocial.reply(replyTx);

      post.setType('reply')

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
        const bMapResult = await axios.post('https://b.map.sv/ingest', {
            rawTx: resp.rawTx
          })
        router.reload()
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