import React from 'react'
import Meta from '../../../components/Meta'
import PanelLayout from '../../../components/PanelLayout'
import UserProfileCard, { UserProfileCardProps } from '../../../components/UserProfileCard'

export interface OneHour{
    txid: string;
    name: string;
    listed: boolean;
    redeemed: boolean;
    price?: number; // in satoshis
    owner?: string;
}

const OneHourUser = () => {

    const userProfile: UserProfileCardProps = {
        banner: "",
        avatar: "https://a.relayx.com/anon@relayx.io",
        userName: "Player",
        paymail: "player@pow.co",
        description: "",
        url: ""
    }

    const hourRate = 21.8 // in $/h
    const hoursRedeemed = 11

    const hoursContracts: OneHour[] = []
    const currentPrice = 32 // floor price of listed hoursContracts

    const handleBuy = (e:any) => {
        e.preventDefault()
    }
  return (
    <>
    <Meta title='1Hour | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <PanelLayout>
        <div className='my-5 sm:my-10 min-h-screen'>
            <div className='max-w-lg mx-auto'>
                <UserProfileCard {...userProfile} />
                <div className='mt-5 px-5 grid grid-cols-2 gap-5'>
                    <div className='col-span-1 rounded-lg text-center border border-primary-500 p-5'>
                        <h2 className='text-xl font-semibold'>Average Hour rate:</h2>
                        <p className='text-lg'><span className='font-bold text-primary-500 mr-1'>${hourRate}</span></p>
                    </div>
                    <div className='col-span-1 rounded-lg text-center border border-primary-500 p-5'>
                        <h2 className='text-xl font-semibold'>Hours redeemed:</h2>
                        <p className='text-lg'><span className='font-bold text-primary-500 mr-1'>{hoursRedeemed}</span></p>
                    </div>
                </div>
                <div className='mt-10 flex flex-col items-center justify-center'>
                    <p className='text-3xl mb-5'>Current Price:<span className='ml-2 font-bold text-primary-500'>${currentPrice}</span></p>
                    <button onClick={handleBuy} className='text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>Buy 1 Hour</button>
                </div>
            </div>
        </div>
    </PanelLayout>
    </>
  )
}

export default OneHourUser