'use client'

import React from 'react'
import { ThemeProvider } from 'next-themes'
import { LocalWalletProvider } from '../v13_context/LocalWalletContext'
import { RelayProvider } from '../v13_context/RelayContext'
import { SensiletProvider } from '../v13_context/SensiletContext'
import { TwetchProvider } from '../v13_context/TwetchContext'
import { HandCashProvider } from '../v13_context/HandCashContext'
import { BitcoinProvider } from '../v13_context/BitcoinContext'
import { TuneProvider } from '../v13_context/TuningContext'
import Locales from '../v13_context/LocalContext'
import { Toaster } from 'react-hot-toast';

const AppContext = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
  return (
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
                        {children}
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
  )
}

export default AppContext