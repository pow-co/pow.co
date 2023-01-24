import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { config } from "../template_config"
import { RelayProvider } from '../context/RelayContext'
import { TuneProvider } from '../context/TuningContext'
import Locales from '../context/LocalContext'
import { Toaster } from 'react-hot-toast'

export default function App({ Component, pageProps }: AppProps) {


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
          <TuneProvider>
            <Locales>
              <Component {...pageProps} />
              <Toaster/>
            </Locales>
          </TuneProvider>
        </RelayProvider>
      </ThemeProvider>
    </>
  )
}
