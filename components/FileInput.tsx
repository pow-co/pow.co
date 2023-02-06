import React, { createRef, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import BSocial from 'bsocial';
import { signOpReturn } from '../utils/bap';
import { useRelay } from '../context/RelayContext';
import wrapRelayx from 'stag-relayx';
import { useRouter } from 'next/router';

function buf2hex(buffer:any) { // buffer is an ArrayBuffer
    //@ts-ignore
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }

const FileInput = () => {
    const [selectedFile, setSelectedFile] = useState(undefined)
    const [preview, setPreview] = useState("")
    const { relayOne } = useRelay()
    const router = useRouter()

    const stag = wrapRelayx(relayOne)

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!selectedFile) {
            setPreview("")
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])

    const onSelectFile = (e:any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setSelectedFile(e.target.files[0])
    }

    const submitPost = async (e:any) => {
        e.preventDefault()

        const reader = new FileReader()

        const binStr = selectedFile && reader.readAsDataURL(selectedFile)
        const hex = buf2hex(binStr)
        const base64 = Buffer.from(hex, 'hex').toString('base64')
        
        const bsocial = new BSocial('pow.co');        
  
        const post = bsocial.post();
  
        post.addImage(`data:image/png;base64,${base64}`);
  
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

    
  return (
    <div className="flex flex-col items-center justify-center bg-transparent w-full p-4">
        {!selectedFile ? (
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-primary-100 dark:hover:bg-primary-800/20 dark:bg-primary-700/20 hover:bg-primary-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input value={selectedFile} onChange={onSelectFile} id="dropzone-file" type="file" className="hidden" />
        </label>
        ): (
            <img src={preview} />
        )}
        <div className='mt-5 flex justify-end'>
            <button type="submit" onClick={submitPost} className="justify-end items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                Create post
            </button>
        </div>
    </div> 
  )
}

export default FileInput