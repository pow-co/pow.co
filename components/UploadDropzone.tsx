import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import BSocial from 'bsocial';
import { toast } from 'react-hot-toast';
import TwetchWeb3 from '@twetch/web3';
import { useRouter } from 'next/router';
import { useRelay } from '../context/RelayContext';
import { useBitcoin } from '../context/BitcoinContext';
import useWallet from '../hooks/useWallet';
import Drawer from "./Drawer";
import WalletProviderPopUp from "./WalletProviderPopUp";

import { bsv, sha256, toByteString } from 'scrypt-ts'

function buf2hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

function formatBytes(b: BigInt, decimals = 2) {
  const bytes = Number(b)
  if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export default function MyDropzone() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  // const [opReturn, setOpReturn] = useState()
  const { paymail, walletPopupOpen, setWalletPopupOpen } = useBitcoin();
  const [b64] = useState('');
  const [signWithPaymail, setSignWithPaymail] = useState(true);

  const wallet = useWallet()

  const [contentLength, setContentLength] = useState<BigInt | undefined>()
  const [priceToPay, setPriceToPay] = useState<BigInt | undefined>()
  const [sha256Hash, setSha256Hash] = useState<string | undefined>()
  const [presignedUploadUrl, setPresignedUploadUrl] = useState<string | undefined>()
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploaded, setUploaded] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {

    if (sha256Hash) {
    }

  }, [sha256Hash])

  async function uploadVideo() {

    if (uploading || uploaded || !sha256Hash) { return }

    if (!files[0]) { return }

    setUploading(true)

    try {

      const { data } = await axios.post(`https://pow.co/api/v1/videos/uploads`, {

        sha256Hash,

        contentLength

      })

      await axios.put(String(data.upload_url), files[0], {
        headers: {
          'Content-Type': 'video/mp4'
        }
      })

      setUploading(false)
      setUploaded(true)

    } catch(error) {

      setUploading(false)
      setUploaded(false)

      setError(new Error(`Failed to upload file ${sha256Hash}`))

    }

  }

  useEffect(() => {

    if (!presignedUploadUrl) return

    console.log('posting!', presignedUploadUrl, files[0])

    axios.put(String(presignedUploadUrl), files[0], {
      headers: {
        'Content-Type': 'video/mp4'
      }
    })
    .then((response) => {
          
      console.log('resp', response);
  
    })
    .catch(console.error)

}, [presignedUploadUrl])

  const onDrop = useCallback((acceptedFiles: any) => {


    acceptedFiles.forEach((file: any) => {
      setContentLength(BigInt(file.size));  
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (ev: any) => {

        crypto.subtle.digest('SHA-256', ev.target.result).then((hashBuffer: any) => {
          // Convert hex to hash, see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
          console.log({hashHex});

          setSha256Hash(hashHex);

          setContentLength(BigInt(file.size));
  
          setPriceToPay(BigInt(Math.floor(file.size / 100)));
      }).catch(ex => console.error(ex));

      // Do whatever you want with the file contents
        /*const binaryStr = reader.result;
        if (!binaryStr) {
          console.log('Error reading file');
          return;
        }
        // @ts-ignore
        const hex = buf2hex(binaryStr);

        const buffer = Buffer.from(hex, 'hex');*/

        //setSha256Hash(sha256(toByteString(hex, false)));

        //setContentLength(BigInt(buffer.length));

        //setPriceToPay(BigInt(Math.floor(buffer.length / 100)));

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
  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { '*': [] } });

  const thumbs = files.map((file) => (
    // @ts-ignore
    <div className="infline-flex m-4 h-full w-full rounded-lg p-2" key={file.name}>
      <div className="flex min-w-0 overflow-hidden">
        <video
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

  const postFile = async (e:any) => {
    e.preventDefault();

    if (!wallet) {

      setWalletPopupOpen(true)
      return

    }

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

    const script = wallet.buildOpReturnScript(ops)

    try {

      const tx = await wallet.createTransaction({
        outputs: [new bsv.Transaction.Output({ script, satoshis: 10 })]
      })

      window.open(`https://whatsonchain.com/tx/${tx.hash}`, '_blank')

      axios.post('https://pow.co/api/v1/posts', {
          transactions: [{
            tx: tx.toString()
          }]
      })
      .then(result => {
        console.debug('powco.posts.ingest.result', result.data)
      })
      .catch(error => {
        console.error('post.submit.powco.error', error)
      })

    } catch(error) {

      console.error(error)

    }

  };

  return (
    <form onSubmit={postFile}>
      <Drawer
        selector="#walletProviderPopupControler"
        isOpen={walletPopupOpen}
        onClose={() => setWalletPopupOpen(false)}
      >
        <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
      </Drawer>
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
                <p className="text-xs text-gray-500 dark:text-gray-400">(MAX. 99.9MB)</p>
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
        <button onClick={uploadVideo} type="submit" className="items-center justify-end rounded-lg bg-primary-600 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900">
          {uploading && (<>Uploading...</>)}
          {!uploading && !uploaded && (<>Upload Video</>)}
          {!uploading && uploaded && (<>Video Uploaded!</>)}
        
        </button>
      </div>

      {sha256Hash && (
        <div className="mt-5 flex justify-center">
          <div className="mr-4 flex items-center">
            <p>SHA256 Hash: {sha256Hash}</p>
          </div>
        </div>
      )}


      {contentLength && (
        <div className="mt-5 flex justify-center">
          <div className="mr-4 flex items-center">
            <p>Content Length: {formatBytes(contentLength)}</p>
          </div>
        </div>
      )}

      {contentLength && (
        <div className="mt-5 flex justify-center">
          <div className="mr-4 flex items-center">
            {/*<p>Price to Pay: {Number(priceToPay)} Sat | {Number(priceToPay) * 1e-8} BSV</p>*/}
            <p>Price to Pay: 0 Sat | 0.00000000 BSV</p>
          </div>
        </div>
      )}
    
    </form>
  );
}
