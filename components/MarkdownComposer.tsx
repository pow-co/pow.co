
import { useState} from 'react'

import { useRouter } from 'next/router'

import MarkdownIt from 'markdown-it';

import MdEditor from 'react-markdown-editor-lite';

import { toast } from 'react-hot-toast';

import 'react-markdown-editor-lite/lib/index.css';

import {wrapRelayx} from 'stag-relayx'

import BSocial from 'bsocial';
import { signOpReturn } from '../utils/bap';

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

    function submitPost() {

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

      post.addText(value)

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

      return stag.relayone.send(send)        
        .then((result: any) => {
          console.log('relayone.result', result)

          toast('Success!', {
            icon: '✅',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
        });

          router.replace(`/${result.txid}`)

          return result
        })
        
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
            <button type="submit" onClick={submitPost} className="justify-end items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Create post
            </button>
            </div>
      </div>
    );
}