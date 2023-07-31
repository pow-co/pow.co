import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { BoostPowJob } from 'boostpow';

import axios from 'axios';
import { useHandCash } from '../context/HandCashContext';

import ThreeColumnLayout from '../components/ThreeColumnLayout';

export default function Home() {
  const { handCashAuthToken: authToken } = useHandCash();
  const [txId, setTxid] = useState<string | null>();
  const [txHex, setTxhex] = useState<string | null>();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const router = useRouter();

  if (!authToken) {
    router.push('/settings');
  }

  useEffect(() => {
    if (isPosting) { return; }

    setIsPosting(true);

    const job = BoostPowJob.fromObject({
      content: '88c9b1254c8a63aa006df09750128ae80457cc85251c31f585666066d4dfc052',
      diff: 1,
    });

    const script = job.toHex();

    axios.post('/api/v1/handcash/pay', {
      authToken,
      script,
      value: 1000,
    })
      .then((result) => {
        const { txid, txhex } = result.data;

        setTxid(txid);

        setTxhex(txhex);

        setIsPosting(false);

        axios.get(`https://pow.co/api/v1/boost/jobs/${txid}`).catch(console.error);

        axios.post('https://pow.co/api/v1/boost/jobs', { transaction: txhex }).catch(console.error);
      })
      .catch(console.error);
  }, []);

  return (

      <ThreeColumnLayout>
        <h1>Test Handcash Boostpow</h1>
    
        {isPosting ? (

          <p>Posting Boost of 1000 sats</p>

        ) : (

          <div>

            <p>txid: {txId}</p>
            <p>txhex: {txHex}</p>

          </div>

        )}

      </ThreeColumnLayout>
      
  );
}
