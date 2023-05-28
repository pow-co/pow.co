/* eslint-disable react/jsx-props-no-spreading */
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { SensiletProvider } from '../context/SensiletContext'

import { GetServerSideProps } from 'next'

import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { init } from '@socialgouv/matomo-next';
import { useEffect } from 'react';
import { config } from '../template_config';
import { RelayProvider } from '../context/RelayContext';
import { HandCashProvider } from '../context/HandCashContext';
import { TuneProvider } from '../context/TuningContext';
import Locales from '../context/LocalContext';
import { BitcoinProvider } from '../context/BitcoinContext';
import { TwetchProvider } from '../context/TwetchContext';
import 'react-tooltip/dist/react-tooltip.css';

import { useSubdomain } from '../hooks/subdomain'

export default function App({ Component, pageProps }: AppProps) {

  const { subdomain } = useSubdomain()

  useEffect(() => {
    const MATOMO_URL = String(process.env.NEXT_PUBLIC_MATOMO_URL);

    const MATOMO_SITE_ID = String(process.env.NEXT_PUBLIC_MATOMO_SITE_ID);

    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
  }, []);

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={config.keywords} />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Script
        src="https://one.relayx.io/relayone.js"
        strategy="beforeInteractive"
      />
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        disableTransitionOnChange
      >
        <RelayProvider>
          <SensiletProvider>
            <TwetchProvider>
              <HandCashProvider>
                <BitcoinProvider>
                  <TuneProvider>
                    <Locales>
                      <Component {...pageProps} />
                      <Toaster />
                    </Locales>
                  </TuneProvider>
                </BitcoinProvider>
              </HandCashProvider>
            </TwetchProvider>
          </SensiletProvider>
        </RelayProvider>
      </ThemeProvider>
    </>
  );
}
