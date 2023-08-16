import { useState, useEffect } from 'react';

import { BoostPowJob } from 'boostpow';

import { bsv } from 'scrypt-ts';
import ThreeColumnLayout from '../components/ThreeColumnLayout';

import RelayxWallet from '../wallets/relayx';

import { useRelay } from '../context/RelayContext'

export default function Home() {
  const [txId, setTxid] = useState<string | null>();
  const [txHex, setTxhex] = useState<string | null>();

  const { relayxPaymail, relayxWallet } = useRelay()

  useEffect(() => {
    const wallet = relayxWallet as RelayxWallet;

    wallet.createBoostTransaction([{
      job: BoostPowJob.fromObject({
        content: '88c9b1254c8a63aa006df09750128ae80457cc85251c31f585666066d4dfc052',
        diff: 1,
        tag: Buffer.from('music.house', 'utf8').toString('hex'),
      }),
      value: BigInt(1000),
    }, {
      job: BoostPowJob.fromObject({
        content: '88c9b1254c8a63aa006df09750128ae80457cc85251c31f585666066d4dfc052',
        diff: 1,
        tag: Buffer.from('fun', 'utf8').toString('hex'),
      }),
      value: BigInt(1000),
    }])
      .then((tx: bsv.Transaction) => {
        setTxid(tx.hash);

        setTxhex(tx.toString());
      })
      .catch(console.error);
  }, []);

  return (

      <ThreeColumnLayout>
        <h1>Test Relayx Boostpow</h1>
    
        {txId ? (

          <div>

            <p>txid: {txId}</p>
            <p>txhex: {txHex}</p>

          </div>

        ) : (

          <p>Posting Boost of Two 1000 sat Outputs</p>

        )}

      </ThreeColumnLayout>
      
  );
}
