
import { useState} from 'react'

import { useRouter } from 'next/router'

import axios from 'axios';

import MarkdownIt from 'markdown-it';

import MdEditor from 'react-markdown-editor-lite';

import { toast } from 'react-hot-toast';

import 'react-markdown-editor-lite/lib/index.css';

import {wrapRelayx} from 'stag-relayx'
import TwetchWeb3 from "@twetch/web3"

import BSocial from 'bsocial';
import { signOpReturn } from '../utils/bap';
import { useBitcoin } from '../context/BitcoinContext';

export const MarkdownLogo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className='h-5' fill='currentColor' viewBox="0 0 208 128">
      <script async={false} id="samara-inject"/>
      <rect width="198" height="118" x="5" y="5" ry="10" stroke="currentColor" strokeWidth="10" fill="none"/>
      <path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z"/>
    </svg>
  )
}

export default function WriteNewArticle() {

  const router = useRouter()
  const { paymail, wallet } = useBitcoin()
  const [signWithPaymail, setSignWithPaymail] = useState(true)

    //@ts-ignore
    const stag = wrapRelayx(window.relayone)
    //@ts-ignore
    window.stag = stag

    const mdParser = new MarkdownIt(/* Markdown-it options */);

    function handleEditorChange({ html, text }: any) {
        console.log('handleEditorChange', html, text);

        setValue(text)
      }

    const [value, setValue] = useState<any>("");

    async function submitPost() {

        console.log('submit post!', value)
        toast('Publishing Your Post to the Network', {
            icon: '⛏️',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
        }); 

      const bsocial = new BSocial('pow.co');        

      const post = bsocial.post();

      post.addMarkdown(value)

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
            toast('Success!', {
              icon: '✅',
              style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              },
            });
            console.log("twetch.response", resp)
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

    return (
      <div className="flex flex-col">
            <MdEditor 
                style={{ height: '500px' }} 
                //@ts-ignore
                renderHTML={text => mdParser.render(text)} 
                onChange={handleEditorChange} 
            />
            <div className='mt-5 flex justify-end'>
              <div className="flex items-center mr-4">
                <input checked={signWithPaymail} id="sign-checkbox" type="checkbox" onClick={(e:any) => setSignWithPaymail(!signWithPaymail)} className="w-4 h-4 accent-primary-500 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="sign-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sign with paymail?</label>
              </div>
              <button type="submit" onClick={submitPost} className="justify-end items-center py-2.5 px-4 mr-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                  Create post
              </button>
            </div>
      </div>
    );
}