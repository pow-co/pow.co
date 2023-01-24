
import { useState} from 'react'

import { useRouter } from 'next/router'

import MarkdownIt from 'markdown-it';

import MdEditor from 'react-markdown-editor-lite';

import 'react-markdown-editor-lite/lib/index.css';

import toast from 'react-toastify'
import {wrapRelayx} from 'stag-relayx'

import BSocial from 'bsocial';
import { signOpReturn } from '../utils/bap';

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
        /* toast('Publishing Your Post to the Network', {
            icon: '⛏️',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
        }); */

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

          /*toast('Success!', {
            icon: '⛏️',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
        });*/

          router.replace(`/${result.txid}`)

          return result
        })
        
    }

    return (
      <div className="container">
            <Button onClick={submitPost} style={{float: 'right'}}>Submit Post</Button><br/><br/>
            <MdEditor 
                style={{ height: '500px' }} 
                //@ts-ignore
                renderHTML={text => mdParser.render(text)} 
                onChange={handleEditorChange} 
            />
      </div>
    );
}