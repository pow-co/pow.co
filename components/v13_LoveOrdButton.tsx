'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { buildInscriptionASM } from '../services/inscriptions';
import { useRelay } from '../v13_context/RelayContext';
import toast from "react-hot-toast"
import Drawer from './v13_Drawer';
import LoveOrdPopup from './v13_LoveOrdPopup';
import WalletProviderPopUp from './v13_WalletProviderPopUp';
import { useBitcoin } from '../v13_context/BitcoinContext';

interface LoveOrdButtonProps {
    txid: string;
    userPaymail: string;
}

const LoveOrdButton = ({ txid, userPaymail }: LoveOrdButtonProps) => {
    const { authenticated } = useBitcoin()
    const [walletPopupOpen, setWalletPopupOpen] = useState(false)
    const [base64String, setBase64String] = useState("")
    const { relayOne, hasTwetchPrivilege } = useRelay()
    const [loveOrdPopupOpen, setLoveOrdPopupOpen] = useState(false)

    useEffect(() => {
      axios.get(`/api/v1/twetch/preview/${txid}`).then((resp) => {
        setBase64String(resp.data)
      })
    },[])

    const handleLoveOrdClick = (e:any) => {
      e.preventDefault()
      e.stopPropagation()
      if(!authenticated){
        setWalletPopupOpen(true)
        return
      }
      setLoveOrdPopupOpen(true)
    }
    
    const handleClose = (e:any) => {
      e.preventDefault()
      e.stopPropagation()
      setLoveOrdPopupOpen(false)
    }

    const inscribeLoveOrd = async (e:any) => {
      e.preventDefault()
      e.stopPropagation()

      toast('Inscribing your 1LoveOrd', {
          icon: '⛏️',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
      });
      let response =  await axios.get(`/api/v1/twetch/preview/${txid}`)
      setBase64String(response.data);

      // Warning: Transferring Or Liquidating Inscriptions Requires Access To Backup Seed Phrase
      //@ts-ignore
      const address = await relayOne.alpha.run.getOwner();

      const inscriptionOutput = buildInscriptionASM({
          address,
          dataB64: base64String,
          contentType: 'image/png',
          metaData: {
            app: 'pow.co',
            type: 'ord',
            name: `1LoveOrd_${txid}`,
            subtype: 'collectionItem',
            subTypeData: JSON.stringify({
              collectionId: ""
            }),
            royalties: JSON.stringify([{
              type: 'paymail',
              destination: userPaymail,
              percentage: 0.0218
            }]),
            previewURL: `https://cloud-functions.twetch.app/api/t/${txid}/unfurl`,
          }
      })

      console.log({ inscriptionOutput })
      let outputs = []
      outputs.push({
        to: inscriptionOutput,
        amount: 1e-6, // Inscribe the contents of your post on a 100 satoshi coin
        currency: 'BSV',
      })
      outputs.push({
        to: 'aristotelis@relayx.iio',
        amount: 0.02,
        currency: 'USD'
      })

      try {
        let resp: any = await relayOne?.send({outputs})
        toast('Success!', {
            icon: '✅',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
          });
        console.log("1LoveOrd.submit.relayx.response", resp)

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
    }

    if(!hasTwetchPrivilege){
      return <div className='grow'/>
    }

  return (
    <>
    <div onClick={handleLoveOrdClick} className='cursor-pointer flex items-center justify-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-gray-500 dark:stroke-gray-300 hover:dark:stroke-red-500 hover:stroke-red-500 hover:fill-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    </div>
    <Drawer
      selector='#loveOrdPopupControler'
      isOpen={loveOrdPopupOpen}
      onClose={() => setLoveOrdPopupOpen(false)}
    >
      <LoveOrdPopup txid={txid} userPaymail={userPaymail} twetchPreview={base64String} onClose={() => setLoveOrdPopupOpen(false)}/>
    </Drawer>
    <Drawer
        selector="#walletProviderPopupControler"
        isOpen={walletPopupOpen}
        onClose={() => setWalletPopupOpen(false)}
      >
        <WalletProviderPopUp onClose={() => setWalletPopupOpen(false)} />
    </Drawer>
    </>
  )
}

export default LoveOrdButton