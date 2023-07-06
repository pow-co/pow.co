import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import ThreeColumnLayout from '../components/ThreeColumnLayout';

import { useSensilet } from '../context/SensiletContext'

import { bsv, findSig } from 'scrypt-ts'

import { PersonalInterestData, removeInterest, detectInterestsFromTxid, mintInterest, PersonalInterest } from '../services/personalInterests'

function PersonalInterestsPage() {
  const router = useRouter();

  const { signer, provider, sensiletPublicKey } = useSensilet()

  const [isMinting, setIsMinting] = useState<boolean>(false)

  const [mintedTx, setMintedTx] = useState<bsv.Transaction | null>(null)

  const [interest, setInterest] = useState<PersonalInterest | null>(null)

  const [interestRemoved, setInterestRemoved] = useState<boolean>(false)
  
  const [interests, setInterests] = useState<PersonalInterestData[]>([])

  const [owner, setOwner] = useState<string | null>()

  useEffect(() => {
    if (!router.query?.txid) { return }

    detectInterestsFromTxid(String(router.query?.txid)).then(interests => {

      console.log('loaded interests for txid', interests)

      if (interests[0]) setInterest(interests[0][0])

    })
    .catch((error: unknown) => {

      console.error('error detected personal interest for txid', error)

    })

  }, [router.query.txid])

  useEffect(() => {

    if (!sensiletPublicKey) return;

    const address = new bsv.PublicKey(sensiletPublicKey).toAddress().toString()

    setOwner(address)

    axios.get(`https://pow.co/api/v1/owners/${address}/personal-interests`).then(async (result) => {

      console.log("interests.discovered", result.data)

      setInterests(result.data.personal_interests)

    })

  }, [sensiletPublicKey])

  if (!sensiletPublicKey) {

    <ThreeColumnLayout>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <div className="mb-[200px] w-full">
          <p>Please Sign In With Sensilet Under /settings</p>
        </div>
      </div>
    </ThreeColumnLayout>

  }

  async function onClickRemoveInterest() {

    try {

      if (!interest || !signer || !sensiletPublicKey) { return }

      await interest.connect(signer)

      console.log('interest.remove', interest)

      const result = await removeInterest({
        instance: interest,
        signer,
        publicKey: String(sensiletPublicKey)
      })

      console.log('interest.remove.result', result)

      setInterestRemoved(true)

    } catch(error) {

      console.error('interest.remove.error', error)

      //@ts-ignore
      if (error.message.match('txn-mempool-conflict')) {

        setInterestRemoved(true)
      }

    }

  }

  async function onClickMintInterest() {

    if (!signer || !sensiletPublicKey) { return }

    try {

      const topic = String(prompt('Topic of Interest:'))
      const weight = Number(prompt('Weight:'))

      const { tx, instance } = await mintInterest({
        signer,
        topic,
        weight,
        owner: sensiletPublicKey,
        satoshis: 100
      })

      console.log('interest.minted', { tx, instance })

      setInterestRemoved(false)
      setIsMinting(false)
      router.push(`/interests/${tx.id}`)

    } catch(error) {

      console.error('interest.mint.error', error)

    }

  }

  function fromHex(h: any) {
    var s = ''
    for (var i = 0; i < h.length; i+=2) {
        s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
    }
    return decodeURIComponent(escape(s))
  }

  return (
    <ThreeColumnLayout>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <div className="mb-[200px] w-full">
          <p><small>Owner: {owner}</small></p>
          <ul style={{"listStyle": "none"}}>
          <h2>My Personal Interests</h2>
          {interests.map(interest => {

            return (

              <Link href={`/interests/${interest.origin}`}>
                <li>
                  <h3 style={{textDecoration: 'underline'}}>{interest.topic} <small>{interest.weight}</small></h3>
                </li>
              </Link>

            )

          })}
          </ul>
          {interest && (
            <>
            <p>Personal Interest Found In {router.query.txid}</p>
            {interestRemoved && (
              <b><p style={{color: 'red'}}>REMOVED FROM BLOCKCHAIN</p></b>
            )}
            <ul>
              <li>owner: {interest.owner}</li>
              <li>topic: {fromHex(interest.topic)}</li>
              <li>weight: {Number(interest.weight)}</li>
            </ul>
            </>
          )}
          <button style={{border: '1px solid white', padding: '1em', marginTop: '3em' }} onClick={onClickMintInterest}>Mint New Interest</button>
          {interest && !interestRemoved && (
            <button style={{border: '1px solid white', padding: '1em', marginTop: '3em' }} onClick={onClickRemoveInterest}>Remove Interest</button>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  );
}

export default PersonalInterestsPage;
