import React from 'react'
import Meta from '../../../components/Meta'
import PanelLayout from '../../../components/PanelLayout'
import { OneHour, PowCoPlayer } from './[userId]';
import { useRouter } from 'next/router';
import UserIcon from '../../../components/UserIcon';

export interface OneHourPlayer {
  player: PowCoPlayer;
  contracts?: OneHour[];
}

const PlayerMarketItem = ({player, contracts}: OneHourPlayer) => {
  const router = useRouter()
  
  const navigatePlayer = (xpub:string) => {
    router.push(`/1hour/market/${xpub}`)
  }

  const handleBuy = async (e:any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div 
      onClick={() => navigatePlayer(player.xpub)}
      className='cursor-pointer mx-3 sm:mx-0 rounded-lg flex flex-col col-span-1 bg-primary-100 dark:bg-primary-600/20'
    >
      <img 
        alt={`${player.name}'s Avatar`} 
        src={player.avatar} 
        className='rounded-t-lg h-[218px] sm:h-[333px] lg:h-[218px] select-none overflow-clip w-full object-cover' 
      />
      <div className='p-3'>
        <h2 className='text-lg font-bold'>One hour of {player.name}</h2>
        <div className='text-lg text-primary-500 font-semibold'>
          {(contracts![0].price!* 1e-8).toFixed(3)} BSV
        </div>
        <div className='mt-3 flex justify-around'>
          <button onClick={() => navigatePlayer(player.xpub)} className='w-32 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-gray-400 to-gray-500 cursor-pointer items-center text-center justify-center py-2 transition duration-500 transform hover:-translate-y-1'>View</button>
          <button onClick={handleBuy} className='w-32 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 transition duration-500 transform hover:-translate-y-1'>Buy 1Hour</button>
        </div>
      </div>
    </div>
  )
}

export const player1: PowCoPlayer = {
  xpub: "0",
      name:"Aristotelis",
      avatar:"https://a.relayx.com/u/aristotelis@relayx.io",
}

export const player2: PowCoPlayer = {
  xpub: "1",
      name:"Jack",
      avatar:"https://a.relayx.com/u/jack@relayx.io",
      bio: "energy frequency & vibration",
      urls: ["https://relayx.com"]
}

export const player3: PowCoPlayer = {
  xpub: "2",
      name:"Owen",
      avatar:"https://a.relayx.com/u/owenkellogg@relayx.io",
}

export const player4: PowCoPlayer = {
  xpub: "3",
      name:"Daniel",
      avatar:"https://a.relayx.com/u/danielkrawisz@relayx.io",
}

const OneHourMarket = () => {
  const oneHourPlayers: OneHourPlayer[] = [
    {
      player:player1,
      contracts: [
        {
          txid: "aaa",
          name: "1Hour #0",
          listed: true,
          redeemed: false,
          price: 3693693,
          creator: {player: player2}
        }
      ]
    },
    {
      player: player2,
      contracts: [
        {
          txid: "aaa",
          name: "1Hour #0",
          listed: true,
          redeemed: false,
          price: 128 * 3693693,
          creator: { player: player3}
        }
      ]
    },
    {
      player: player3,
      contracts: [
        {
          txid: "aaa",
          name: "1Hour #0",
          listed: true,
          redeemed: false,
          price: 218 * 3693693,
          creator: { player: player4 }
        }
      ]
    },
    {
      player: player4,
      contracts: [
        {
          txid: "aaa",
          name: "1Hour #0",
          listed: true,
          redeemed: false,
          price: 111 * 3693693,
          creator: { player: player1 }
        }
      ]
    }
  ,]

  return (
    <>
    <Meta title='1Hour | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <PanelLayout>
      <div className='my-5 sm:my-10 min-h-screen'>
        <div className="w-full flex flex-col items-center mb-5 sm:mb-10">
          <div
            style={{backgroundImage:`url("https://dogefiles.twetch.app/4a47c0601657b2248ac0e6bf68cb52c34caaede54f8f172b74d916035fa35cfc")`}}
            className="w-full h-[320px] rounded-none sm:rounded-xl bg-repeat bg-bottom select-none"
          />
          <div className="z-1 rounded-full -mt-[120px] flex items-center justify-center p-3 bg-bottom	bg-blend-normal bg-gradient-to-r from-pink-500 to-gray-500">
            <img
              src={`https://dogefiles.twetch.app/c121594f5cfd75d9dd48c65c03af5797c02ced7b39bffc15cfa46d0b766de332`}
              className="h-[224px] w-[224px] rounded-full"
            />
          </div>
          <p className="mt-6 text-2xl font-bold text-center px-4">
            One Hour
          </p>
          <p className="mt-3 select-none text-center px-4 text-gray-700 dark:text-gray-300">
            How much is your time worth? Mint 1Hours NFTs and let the market decide!
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {oneHourPlayers.map((data:OneHourPlayer) => (
            <PlayerMarketItem key={data.player.xpub} {...data} />
          ))}
        </div>
      </div>
    </PanelLayout>
    </>
  )
}

export default OneHourMarket