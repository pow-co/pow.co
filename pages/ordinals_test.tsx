import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { BoostPowJob } from 'boostpow';

import { bsv } from 'scrypt-ts';
import { useHandCash } from '../context/HandCashContext';

import ThreeColumnLayout from '../components/ThreeColumnLayout';

import HandcashWallet from '../wallets/handcash';

import useWallet from '../hooks/useWallet'

import * as BSV from 'bsv-wasm'

import * as ordinals from '../services/1satOrd'

import { Sigma } from '../services/sigma'

export default function Home() {
  const [txId, setTxid] = useState<string | null>();
  const [txHex, setTxhex] = useState<string | null>();

  const wallet = useWallet()

  const router = useRouter();

  useEffect(() => {
    (window as any)['ordinals'] = ordinals
  
    const url = 'https://spacedisco.com';

    wallet.createOrdinal({

      inscription: {
        dataB64: btoa(url),
        contentType: 'text/plain'
      },
      metaData: {
        app: 'pow.co',
        type: 'url',
        url
      }

    })
    .then(tx => {

      console.log('tx', tx);
      
      (window as any)['tx'] = tx

    })
    .catch(console.error)


  }, []);

  return (

      <ThreeColumnLayout>
        <h1>Test Posting Ordinal</h1>
    
        {txId ? (

          <div>

            <p>txid: {txId}</p>
            <p>txhex: {txHex}</p>

          </div>

        ) : (

          <p>Posting 1 Sat Ordinal</p>

        )}

      </ThreeColumnLayout>
      
  );
}
