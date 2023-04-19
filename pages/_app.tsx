import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { config } from "../template_config"
import { RelayProvider } from '../context/RelayContext'
import { HandCashProvider } from '../context/HandCashContext'
import { TuneProvider } from '../context/TuningContext'
import Locales from '../context/LocalContext'
import { Toaster } from 'react-hot-toast'
import { BitcoinProvider } from '../context/BitcoinContext'
import { TwetchProvider } from '../context/TwetchContext'
import 'react-tooltip/dist/react-tooltip.css'

import { init } from "@socialgouv/matomo-next";
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {

    const MATOMO_URL = String(process.env.NEXT_PUBLIC_MATOMO_URL);
    
    const MATOMO_SITE_ID = String(process.env.NEXT_PUBLIC_MATOMO_SITE_ID);

    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });

  }, []);

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta
          name='description'
          content={config.description}
        />
        <meta name='keywords' content={config.keywords} />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <Script
        src="https://one.relayx.io/relayone.js"
        strategy="beforeInteractive"
      />
      <ThemeProvider attribute='class' enableSystem={false} disableTransitionOnChange={true}>
        <RelayProvider>
          <TwetchProvider>
            <HandCashProvider>
              <BitcoinProvider>
                <TuneProvider>
                  <Locales>
                    <Component {...pageProps} />
                    <Toaster/>
                  </Locales>
                </TuneProvider>
              </BitcoinProvider>
            </HandCashProvider>
          </TwetchProvider>        
        </RelayProvider>
      </ThemeProvider>
    </>
  )
}
