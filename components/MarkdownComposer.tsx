import React, { useState } from 'react';

import { useRouter } from 'next/router';

import axios from 'axios';

import MarkdownIt from 'markdown-it';

import MdEditor from 'react-markdown-editor-lite';

import { toast } from 'react-hot-toast';

import 'react-markdown-editor-lite/lib/index.css';

import BSocial from 'bsocial';

import { bsv } from 'scrypt-ts';
import { signOpReturn } from '../utils/bap';

import { useBitcoin } from '../context/BitcoinContext';

import useWallet from '../hooks/useWallet';

export const MarkdownLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5" fill="currentColor" viewBox="0 0 208 128">
      <script async={false} id="samara-inject" />
      <rect width="198" height="118" x="5" y="5" ry="10" stroke="currentColor" strokeWidth="10" fill="none" />
      <path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39zm125 0l-30-33h20V30h20v35h20z" />
    </svg>
  );

export default function WriteNewArticle() {

  const router = useRouter();
  const { paymail } = useBitcoin();
  const [signWithPaymail, setSignWithPaymail] = useState(true);

  const wallet = useWallet();

    const mdParser = new MarkdownIt(/* Markdown-it options */);

    function handleEditorChange({ html, text }: any) {
        console.log('handleEditorChange', html, text);

        setValue(text);
      }

    const [value, setValue] = useState<string>("");

    async function submitPost() {

      if (!wallet) { throw new Error('wallet not selected'); }

        console.log('submit post!', value);
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

      post.addMarkdown(value);

      if (signWithPaymail) {
        post.addMapData('paymail', paymail);
      }

      const hexArrayOps = post.getOps('hex');

      const opReturn = signOpReturn(hexArrayOps);

      console.log({ hexArrayOps, opReturn });

      toast('Publishing Your Post to the Network', {
        icon: '⛏️',
        style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        },
      });

      const opReturnScript = bsv.Script.fromASM(`OP_0 OP_RETURN ${hexArrayOps.join(' ')}`);

      try {

        const outputs: bsv.Transaction.Output[] = [];

        outputs.push(new bsv.Transaction.Output({
          script: opReturnScript,
          satoshis: 0,
        }));

        const tx = await wallet.createTransaction({
          outputs,
        });

        console.log('bsocial.markdown.tx', tx);

        try {

          axios.post('https://b.map.sv/ingest', {
              rawTx: tx.toString(),
          })
          .then((result) => {
            console.debug('b.map.sv.ingest.result', result.data);
          })
          .catch((error) => {
            console.error('post.submit.b.map.sv.ingest.error', error);
          });

        } catch (error) {
            console.error('post.submit.b.map.sv.ingest.error', error);
        }

        try {

          axios.post('https://www.pow.co/api/v1/posts', {
              transactions: [{
                tx: tx.toString(),
              }],
          })
          .then((result) => {
            console.debug('powco.posts.ingest.result', result.data);
          })
          .catch((error) => {
            console.error('post.submit.powco.error', error);
          });

        } catch (error) {

            console.error('post.submit.powco.error', error);

        }

        router.push(`/${tx.hash}`);

      } catch (error) {
        console.log(error);
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

    // Memoize the onChange handler for checkbox
    const handleCheckboxChange = React.useCallback(() => {
      setSignWithPaymail(!signWithPaymail);
    }, [signWithPaymail]);

    return (
      <div className="flex flex-col">
            <MdEditor 
              style={{ height: '500px' }} 
                // @ts-ignore
              renderHTML={mdParser.render} 
              onChange={handleEditorChange} 
            />
            <div className="mt-5 flex justify-end">
              <div className="mr-4 flex items-center">
                <input 
                  checked={signWithPaymail} 
                  id="sign-checkbox" 
                  type="checkbox" 
                  onChange={handleCheckboxChange} 
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 accent-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="sign-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Sign with paymail?</label>
              </div>
              <button 
                type="button" 
                onClick={submitPost} 
                className="mr-4 items-center justify-end rounded-lg bg-primary-600 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900"
              >
                  Create post
              </button>
            </div>
      </div>
    );
}
