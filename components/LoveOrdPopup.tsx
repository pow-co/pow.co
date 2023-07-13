import React, { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useRelay } from '../context/RelayContext';
import { buildInscriptionASM } from '../services/inscriptions';

interface LoveOrdPopupProps {
    txid: string;
    userPaymail: string;
    twetchPreview: string;
    onClose: () => void
}

export const LoveOrdCollectionTxID = "1a9806fb54eb1cb6dea3bff3721eb90852d505159cb36d7227cc8673835ee62b"

const bitcoinAddressRegex = /^(1|3)[A-HJ-NP-Za-km-z1-9]{25,34}$/;

const LoveOrdPopup = ({ txid, userPaymail, twetchPreview, onClose }: LoveOrdPopupProps) => {
    const [ordinalsAddress, setOrdinalsAddress] = useState("")
    const { relayOne } = useRelay()
    
    const handleChangeOrdinalsAddress = (e:any) => {
        e.preventDefault()
        setOrdinalsAddress(e.target.value)
    }

    const handleClose = (e:any) => {
        e.preventDefault()
        e.stopPropagation()
        onClose()
    }

    const handleMintLoveOrd = async (e:any) => {
        e.preventDefault()

        toast('Inscribing your 1LoveOrd', {
            icon: '⛏️',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
        });
        let address
        if(ordinalsAddress && bitcoinAddressRegex.test(ordinalsAddress)){
            address = ordinalsAddress
        } else {
            address = await relayOne?.alpha.run.getOwner()
        }

        const inscriptionOutput = buildInscriptionASM({
            address,
            dataB64: twetchPreview,
            contentType: 'image/png',
            metaData: {
              app: 'pow.co',
              type: 'ord',
              name: `1LoveOrd_${txid}`,
              subtype: 'collectionItem',
              subTypeData: JSON.stringify({
                collectionId: LoveOrdCollectionTxID
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
          amount: 1e-8, 
          currency: 'BSV',
        })
        outputs.push({
          to: 'aristotelis@relayx.io',
          amount: 0.02,
          currency: 'USD'
        })
  
        try {
            let resp: any = await relayOne?.send({outputs})
            console.log("1LoveOrd.submit.relayx.response", resp)
            onClose()
            toast('Success!', {
                icon: '✅',
                style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                },
                });
  
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
  return (
    <div className='fixed inset-0'>
        <div className='flex flex-col h-screen'>
            <div
                onClick={handleClose}
                className='grow cursor-pointer'
            />
            <div onClick={(e:any) => e.stopPropagation()} className='flex'>
                <div
                    onClick={handleClose}
                    className='grow cursor-pointer'
                />
                <div className='flex-col max-w-md w-[420px] p-5 sm:rounded-lg bg-primary-100 dark:bg-primary-800'>
                    <div>
                        <p className="text-xl text-center font-bold text-gray-800 dark:text-gray-200">
                            ❤️ 1LoveOrd ❤️
                        </p>
                        <p className="text-center italic text-gray-700 dark:text-gray-300 text-sm mt-1 mb-4">
                            Bring some Twetch love back to your wallet
                        </p>
                    </div>  
                    <div className='flex flex-col w-full justify-center'>
                        <img className='rounded-lg' src={`data:image/png;base64,${twetchPreview}`} alt="Twetch Preview"/>
                        <div className='p-3 flex flex-col w-full justify-center'>
                            <input
                                className='px-3 py-1 rounded focus:outline-primary-500' 
                                type="text" 
                                value={ordinalsAddress} 
                                onChange={handleChangeOrdinalsAddress} 
                                placeholder="Paste your 1SatOrdinals address here" 
                            />
                            <p className='mt-1 text-center text-xs'>* If you leave this blank, the inscription will be minted to your RelayX Run address. (RelayX Ordinals Wallet interface 🔜)</p>
                            <button onClick={handleMintLoveOrd} className='mx-auto mt-3 flex text-sm leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>Mint $0.05</button>
                        </div>
                    </div>  
                </div>
                <div
                    onClick={handleClose}
                    className='grow cursor-pointer'
                />
            </div>
            <div
                onClick={handleClose}
                className='grow cursor-pointer'
            />
        </div>        
    </div>
  )
}

export default LoveOrdPopup