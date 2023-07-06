import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import ThreeColumnLayout from '../../components/ThreeColumnLayout';

import { useSensilet } from '../../context/SensiletContext'

import { bsv, findSig, PubKey } from 'scrypt-ts'

import { detectInterestsFromTxid, mintInterest, PersonalInterest } from '../../services/personalInterests'

function PersonalInterestsPage() {
  const router = useRouter();

  const { signer, provider, sensiletPublicKey } = useSensilet()

  const [isMinting, setIsMinting] = useState<boolean>(false)

  const [mintedTx, setMintedTx] = useState<bsv.Transaction | null>(null)

  const [interest, setInterest] = useState<PersonalInterest | null>(null)

  const [interestRemoved, setInterestRemoved] = useState<boolean>(false)

  console.log({ signer, provider, sensiletPublicKey })

  useEffect(() => {

    detectInterestsFromTxid(router.query?.txid).then(interests => {

      console.log('loaded interests for txid', interests)

      if (interests[0]) setInterest(interests[0][0])

    })
    .catch(error => {

      console.error('error detected personal interest for txid', error)

    })

  }, [router.query.txid])

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

      await interest.connect(signer)

      console.log('interest.remove', interest)

      const result = await interest.methods.remove((sigResponses) => {
        return findSig(sigResponses, PubKey(sensiletPublicKey))
      })

      console.log('interest.remove.result', result)

      setInterestRemoved(true)

    } catch(error) {

      console.error('interest.remove.error', error.message)

      console.error('interest.remove.error', error.name)

      console.error('interest.remove.error', error)

      if (error.message.match('txn-mempool-conflict')) {

        setInterestRemoved(true)
      }

    }

  }

  async function onClickMintInterest() {

    try {

      const topic = prompt('Topic of Interest:')
      const weight = prompt('Weight:')

      const { tx, instance } = await mintInterest({
        signer,
        topic,
        weight: Number(weight),
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

  function fromHex(h) {
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
          <small>sensilet pubkey: {sensiletPublicKey}</small>
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
