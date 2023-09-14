import { useRouter } from 'next/navigation'
import React from 'react'
import useWallet from '../../hooks/useWallet'
import { useLocalWallet } from '../../context/LocalWalletContext'
import { useAPI } from '../../hooks/useAPI'
import CalendarPage from '../../pages/v13_calendar'

export const metadata = {
    title: 'Events | The Proof of Work Cooperative',
    description: 'Create and Attend onchain events',
    openGraph: {
        title: 'Events | The Proof of Work Wooperative',
        description: 'Create and Attend onchain events',
        url: 'https://pow.co',
        siteName: 'PoW.co',
        images: [
          {
            url: 'https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25',
            width: 1200,
            height: 630,
          },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Events | The Proof of Work Cooperative',
        description: 'Create and Attend onchain events',
        images: ['https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25'],
    },
}

const EventsPage = () => {

  return (
    <CalendarPage/>
  )
}

export default EventsPage