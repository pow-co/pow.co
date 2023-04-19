import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import BSocial from 'bsocial';
import { toast } from 'react-hot-toast';
import wrapRelayx from 'stag-relayx';
import TwetchWeb3 from '@twetch/web3';
import { useRouter } from 'next/router';
import { useRelay } from '../context/RelayContext';
import { useBitcoin } from '../context/BitcoinContext';

function buf2hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

export default function MyDropzone() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  // const [opReturn, setOpReturn] = useState()
  const { relayOne } = useRelay();
  const { paymail, wallet } = useBitcoin();
  const [b64, setB64] = useState('');
  const [signWithPaymail, setSignWithPaymail] = useState(true);

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result;
        if (!binaryStr) {
          console.log('Error reading file');
          return;
        }
        console.log('file', binaryStr);
        // @ts-ignore
        const hex = buf2hex(binaryStr);

        console.log('file hex', hex);

        const base64 = Buffer.from(hex, 'hex').toString('base64');
        setB64(base64);
        console.log('file base64', base64);

        /* const bsocial = new BSocial('pow.co');

        const post = bsocial.post();
        // and image data Url
        post.addImage(`data:image/png;base64,${base64}`);

        if (signWithPaymail){
          post.addMapData('paymail', paymail)
        }

        const ops = post.getOps('hex');

        const utf8 = post.getOps('utf8');

        console.log('file ops', ops)

        console.log('file ops utf8', utf8)
        setOpReturn(ops.map((op: any) => `0x${op}`)) */
      };
      reader.readAsArrayBuffer(file);
    });

    setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
      preview: URL.createObjectURL(file),
    })));
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const thumbs = files.map((file) => (
    // @ts-ignore
    <div className="infline-flex m-4 h-full w-full rounded-lg p-2" key={file.name}>
      <div className="flex min-w-0 overflow-hidden">
        <img
        // @ts-ignore
          src={file.preview}
          className="block h-full w-auto rounded-lg"
          // Revoke data uri after image is loaded
          // @ts-ignore
          onLoad={() => { URL.revokeObjectURL(file.preview); }}
        />
      </div>
    </div>
  ));

  useEffect(
    () =>
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      (() => {
      // @ts-ignore
        files.forEach((file) => URL.revokeObjectURL(file.preview));
      }),
    [],
  );

  const stag = wrapRelayx(relayOne);

  const postFile = async (e:any) => {
    e.preventDefault();

    const bsocial = new BSocial('pow.co');

    const post = bsocial.post();
    // and image data Url
    post.addImage(`data:image/png;base64,${b64}`);

    if (signWithPaymail) {
      post.addMapData('paymail', paymail);
    }

    const ops = post.getOps('hex');

    const utf8 = post.getOps('utf8');

    console.log('file ops', ops);

    console.log('file ops utf8', utf8);
    const opReturn = ops.map((op: any) => `0x${op}`);

    toast('Publishing Your Post to the Network', {
      icon: '⛏️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    switch (wallet) {
      case 'relayx': {
        const send = {
          to: 'johngalt@relayx.io',
          amount: 0.001,
          currency: 'BSV',
          opReturn,
        };

        console.log('relayone.send', send);
        try {
          const resp: any = await stag.relayone!.send(send);
          toast('Success!', {
            icon: '✅',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
          console.log('relayx.response', resp);
          await axios.post('https://b.map.sv/ingest', {
            rawTx: resp.rawTx,
          });
          router.push(`/${resp.txid}`);
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
      }
      case 'twetch': {
        try {
          const outputs = [{
            sats: 0,
            args: opReturn,
            address: null,
          }, {
            to: 'johngalt@relayx.io',
            sats: 0.001 * 1e8,
          }];
          console.log('twetch.send', outputs);
          const resp = await TwetchWeb3.abi({
            contract: 'payment',
            outputs,
          });
          console.log('twetch.response', resp);
          toast('Success!', {
            icon: '✅',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
          await axios.post('https://b.map.sv/ingest', {
            rawTx: resp.rawtx,
          });
          router.push(`/${resp.txid}`);
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
        break;
      }
      case 'handcash': {
        // TDOD
        break;
      }
      default: {
        console.log('no wallet selected');
      }
    }
  };

  return (
    <form onSubmit={postFile}>
      <section>
        {files.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center bg-transparent p-4" {...getRootProps({})}>
            <label htmlFor="dropzone" className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-primary-100 hover:bg-primary-200 dark:border-gray-600 dark:bg-primary-700/20 dark:hover:border-gray-500 dark:hover:bg-primary-800/20">
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg aria-hidden="true" className="mb-3 h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span>
                  {' '}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </div>
              <input id="dropzone" {...getInputProps()} />
            </label>
          </div>
        )
          : (
            <aside className="mt-4 flex flex-row flex-wrap">
              {thumbs}
            </aside>
          )}
      </section>
      <div className="mt-5 flex justify-center">
        <div className="mr-4 flex items-center">
          <label htmlFor="checkbox">
            <input checked={signWithPaymail} id="checkbox" type="checkbox" onClick={() => setSignWithPaymail(!signWithPaymail)} className="mr-2 h-4 w-4 rounded border-gray-300 bg-gray-100 accent-primary-500 dark:border-gray-600 dark:bg-gray-700" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Sign with paymail?</span>
          </label>
        </div>
        <button type="submit" className="items-center justify-end rounded-lg bg-blue-600 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900">
          Post Image
        </button>
      </div>
    </form>
  );
}
