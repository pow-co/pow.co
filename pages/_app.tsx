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
import { LocalWalletProvider } from '../context/LocalWalletContext';
import 'react-tooltip/dist/react-tooltip.css';

import { useSubdomain } from '../hooks/subdomain'

export const getStaticProps = async () => {
  const openGraphData = [
    {
      property: "og:image",
      content:
        "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
      key: "ogimage",
    },
    {
      property: "og:image:width",
      content: "1200",
      key: "ogimagewidth",
    },
    {
      property: "og:image:height",
      content: "630",
      key: "ogimageheight",
    },
    {
      property: "og:url",
      content: `https://pow.co`,
      key: "ogurl",
    },
    {
      property: "og:image:secure_url",
      content:
        "https://dogefiles.twetch.app/c3775f42d22ba9a68b5e134fd7b59b0c6060bf00a45e8890853b20e167e73a25",
      key: "ogimagesecureurl",
    },
    {
      property: "og:title",
      content: "The Proof of Work Cooperative",
      key: "ogtitle",
    },
    {
      property: "og:description",
      content: "People coordinating using costly signal",
      key: "ogdesc",
    },
    {
      property: "og:type",
      content: "website",
      key: "website",
    },
  ]
  return { props: {
    openGraphData: openGraphData
  } }
}

export default function App({ Component, pageProps }: AppProps) {
  const { openGraphData = [] } = pageProps;
  const { subdomain } = useSubdomain()

  useEffect(() => {
    const MATOMO_URL = String(process.env.NEXT_PUBLIC_MATOMO_URL);

    const MATOMO_SITE_ID = String(process.env.NEXT_PUBLIC_MATOMO_SITE_ID);

    init({ url: MATOMO_URL, siteId: MATOMO_SITE_ID });
  }, []);

  return (
    <>
      <Head>
        {openGraphData.map((og: any) => (
          <meta {...og} />
        ))}
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
        <LocalWalletProvider>
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
        </LocalWalletProvider>
      </ThemeProvider>
    </>
  );
}
