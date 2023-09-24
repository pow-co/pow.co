import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import AppContext from '../v13_context/AppContext'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'The Proof of Work Cooperative',
    description: 'People coordinating using costly signals',
    openGraph: {
        title: 'The Proof of Work Wooperative',
        description: 'People coordinating using costly signals',
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
        title: 'The Proof of Work Cooperative',
        description: 'People coordinating using costly signals',
        images: ['https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25'],
    },
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }){
    return (
      <html lang="en">
        <Script
            src="https://one.relayx.io/relayone.js"
        />
        <body className={inter.className}>
          <AppContext>
              {children}
          </AppContext>
          <div id="drawerControler" />
          <div id="tuningProviderPopupControler" />
          <div id="boostPopupControler" />
          <div id="loveOrdPopupControler"/>
          <div id="walletProviderPopupControler"/>
        </body>
      </html>
    )
  }