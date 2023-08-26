import React from 'react'
import Meta from '../../../components/Meta'
import PanelLayout from '../../../components/PanelLayout'
import { OneHour } from './[userId]';

interface OneHourPlayer {
  xpub: string;
  contracts: OneHour[];
}
const OneHourMarket = () => {
  const oneHourPlayers: OneHourPlayer[] = []
  return (
    <>
    <Meta title='1Hour | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <PanelLayout>
      <div className='my-5 sm:my-10 min-h-screen'>

      </div>
    </PanelLayout>
    </>
  )
}

export default OneHourMarket