import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { bsv } from 'scrypt-ts';
import ThreeColumnLayout from '../../components/ThreeColumnLayout';

import { useSensilet } from '../../context/SensiletContext';

// const blockchain = new Run.plugins.WhatsOnChain({ network: 'main' })

// import { detectInterestsFromTxid, mintInterest, PersonalInterest, PersonalInterestData, getPersonalInterestData } from '../../services/personalInterests'

/*
const { PersonalInterest } = require('../../src/contracts/personalInterest.json');

const artifact = require('../../artifacts/src/contracts/personalInterest.json');

PersonalInterest.loadArtifact(artifact);
*/

export interface PersonalInterestData {
  id: number;
  origin: string;
  location: string;
  topic: string;
  owner: string;
  weight: number;
  value: number;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

async function fetchTransaction({ txid }: { txid: string }): Promise<string> {

  const { data } = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`);

  return data;

}

export async function getPersonalInterestData({ txid }: { txid: string }): Promise<PersonalInterestData[]> {

  const { data } = await axios.get(`https://develop.pow.co/api/v1/personal-interests/${txid}`);
  // const { data } = await axios.get(`http://wyatthash.com:8000/api/v1/personal-interests/${txid}`)
  // const { data } = await axios.get(`https://www.pow.co/api/v1/personal-interests/${txid}`)

  console.log("powco.interests.fetch.result", { txid, data });

  return data.personal_interests;

}

export async function detectInterestsFromTxid(txid: string): Promise<any[]> {

  const hex = await fetchTransaction({ txid });

  const interests = await detectInterestsFromTxHex(hex);

  return interests;

}

export async function detectInterestsFromTxHex(txhex: string): Promise<any[]> {

  const interests: any[] = [];

  const tx = new bsv.Transaction(txhex);

  for (let i = 0; i < tx.outputs.length; i++) {

    try {

      // @ts-ignore
      /* const interest = PersonalInterest.fromTx(tx, i);

      interests.push(interest);
      */

    } catch (error) {
      // Log the error or handle it appropriately
      console.error(`Failed to parse output ${i} as PersonalInterest:`, error);
    }

  }

  return interests;

}

function PersonalInterestsPage() {
  const router = useRouter();

  const { signer, sensiletPublicKey } = useSensilet();

  const [interest, setInterest] = useState<any>(null);

  const [interestRemoved, setInterestRemoved] = useState<boolean>(false);

  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    if (!router.query?.txid) { return; }

    const txid = String(router.query?.txid);

    setLocation(txid);

    detectInterestsFromTxid(txid).then((interests) => {

      console.log('loaded interests for txid', interests);

      if (interests[0]) setInterest(interests[0]);

    })
    .catch((error: unknown) => {

      console.error('error detected personal interest for txid', error);

    });

    getPersonalInterestData({ txid }).then((interests: PersonalInterestData[]) => {

      console.log('Interest data:', interests);

    })
    .catch(console.error);

  }, [router.query.txid, location]);

  useEffect(() => {

    if (!interest) { return; }

    if (interestRemoved) { return; }

    if (!sensiletPublicKey) { return; }

    const owner = new bsv.PublicKey(interest.owner).toAddress().toString();

    const pubkey = new bsv.PublicKey(sensiletPublicKey).toAddress().toString();

    console.log('interest.owner', { owner, pubkey });

  }, [interest, interestRemoved, sensiletPublicKey, location]);

  async function onClickRemoveInterest() {

    try {

      if (!interest || !signer) { return; }

      if (!sensiletPublicKey) { return; }

      await interest.connect(signer);

      console.log('interest.remove', interest);

      const result = await interest.methods.remove();

      console.log('interest.remove.result', result);

      setInterestRemoved(true);

    } catch (error) {

      console.error('interest.remove.error', error);

      if (error && (error as Error).message && (error as Error).message.match('txn-mempool-conflict')) {

        setInterestRemoved(true);
      }

    }

  }

  async function onClickMintInterest() {

    if (!signer || !sensiletPublicKey) { return; }

    try {

      // Use a more descriptive message instead of using prompt
      console.log('This functionality is not implemented in this view. Please use the main interests page to mint new interests.');

    } catch (error) {

      console.error('interest.mint.error', error);

    }

  }

  function fromHex(h: any) {
    let s = '';
    for (let i = 0; i < h.length; i += 2) {
      s += String.fromCharCode(parseInt(h.substr(i, 2), 16));
    }
    return decodeURIComponent(escape(s));
  }

  return (
    <ThreeColumnLayout>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <div className="mb-[200px] w-full">
          <div className="rounded-lg bg-primary-100 p-5 dark:bg-primary-600/20">
            <h1 className="text-3xl font-bold">Personal Interest Details</h1>
            {interest && (
              <div>
                <p>Personal Interest Found In {router.query.txid}</p>
                {interestRemoved && (
                  <b><p style={{ color: 'red' }}>REMOVED FROM BLOCKCHAIN</p></b>
                )}
                <ul>
                  <li>owner: {new bsv.PublicKey(interest.owner).toAddress().toString()}</li>
                  <li>topic: {fromHex(interest.topic)}</li>
                  <li>weight: {Number(interest.weight)}</li>
                </ul>
                <div className="mt-4 flex flex-row">
                  <button type="button" onClick={() => { router.push('/interests'); }}>Back to Interests</button>
                  <button type="button" onClick={onClickMintInterest}>Mint New Interest</button>
                  {interest && !interestRemoved && (
                    <button type="button" onClick={onClickRemoveInterest}>Remove Interest</button>
                  )}
                </div>
              </div>
            )}
            {!interest && (
              <div>
                <p>Loading interest data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}

export default PersonalInterestsPage;
