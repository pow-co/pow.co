import React, { useCallback, useEffect, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import axios from 'axios';
import BSocial from "bsocial"
import { toast } from 'react-hot-toast';
import wrapRelayx from 'stag-relayx';
import TwetchWeb3 from '@twetch/web3';
import { useRelay } from '../context/RelayContext';
import { useRouter } from 'next/router';
import { useBitcoin } from '../context/BitcoinContext';

function buf2hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}

export default function MyDropzone() {
  const router = useRouter()
  const [files, setFiles] = useState([]);
  const [opReturn, setOpReturn] = useState()
  const { relayOne } = useRelay()
  const { paymail, wallet } = useBitcoin()

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result
        if (!binaryStr){
          console.log("Error reading file")
          return
        }
        console.log('file', binaryStr)
        //@ts-ignore
        const hex = buf2hex(binaryStr)

        console.log('file hex', hex)

        const base64 = Buffer.from(hex, 'hex').toString('base64')

        console.log('file base64', base64)

        const bsocial = new BSocial('pow.co');

        const post = bsocial.post();
        // and image data Url
        post.addImage(`data:image/png;base64,${base64}`);

        post.addMapData('paymail', paymail)

        const ops = post.getOps('hex');

        const utf8 = post.getOps('utf8');

        console.log('file ops', ops)

        console.log('file ops utf8', utf8)
        setOpReturn(ops.map((op: any) => `0x${op}`))

      }
      reader.readAsArrayBuffer(file)
    })

    setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop, accept: {'image/*': []}})

  const thumbs = files.map(file => (
    //@ts-ignore
    <div className='infline-flex rounded-lg m-4 w-full h-full p-2' key={file.name}>
      <div className='flex min-w-0 overflow-hidden'>
        <img
        //@ts-ignore
          src={file.preview}
          className="block w-auto h-full rounded-lg"
          // Revoke data uri after image is loaded
          //@ts-ignore
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    //@ts-ignore
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  const stag = wrapRelayx(relayOne)

  const postFile = async (e:any) => {
    e.preventDefault()
    
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
          console.log("twetch.send", outputs)
          const resp = await TwetchWeb3.abi({
            contract: "payment",
            outputs: outputs,
          })
          console.log('twetch.response',resp);
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
        //TDOD
        break;
      default:
        console.log("no wallet selected")
  }}

  return (
    <form onSubmit={postFile}>
      <section>
        {files.length === 0 ? (<div className="flex flex-col items-center justify-center bg-transparent w-full p-4" {...getRootProps({})}>
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-primary-100 dark:hover:bg-primary-800/20 dark:bg-primary-700/20 hover:bg-primary-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input {...getInputProps()} />
          </label>
        </div>)
        : (
          <aside className='flex flex-row flex-wrap mt-4'>
          {thumbs}
          </aside>
        )}
      </section>
      <div className='mt-5 flex justify-center'>
        <button type="submit" className="justify-end items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
            Post Image
        </button>
      </div>
    </form>
  )
}
