import React, { useEffect } from 'react'
import WalletItemPage from './items'
import { Tooltip } from 'react-tooltip'
import { useBitcoin } from '../../context/BitcoinContext'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export const WalletHeader = () => {
    const { paymail, balance } = useBitcoin()

    const handleCopyPaymail = (e:any) => {
        e.preventDefault()
        paymail && navigator.clipboard.writeText(paymail).then(()=> toast('Copied to clipboard', {
            icon: '✅',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
        }))
    }
    return (
        <div className='flex flex-col justify-center items-center'>
            <button onClick={handleCopyPaymail} id="wallet_paymail" className='cursor-pointer opacity-50'>{paymail}</button>
            <Tooltip
                anchorSelect='#wallet_paymail'
                style={{ width: "fit-content", borderRadius: "4px"}}
                place='bottom'
                className="text-white dark:bg-gray-100 dark:text-black"
            >
                Copy to clipboard
            </Tooltip>
            <div className='m-5 flex flex-col justify-center items-center w-full'>
                <p className='text-4xl font-bold'>{(balance * 1e-8).toFixed(3)} BSV</p>
                <div className='mt-5 flex w-full items-center justify-center gap-5'>
                    <Link href="/wallet/receive">
                        <button className='flex w-36 text-sm text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>Deposit</button>
                    </Link>
                    <Link href="/wallet/send">
                        <button className='flex w-36 text-sm text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>Send</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

const WalletPage = () => {
  return (
    <WalletItemPage/>
  )
}

export default WalletPage