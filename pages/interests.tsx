import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import ThreeColumnLayout from '..//components/ThreeColumnLayout';
import { FormattedMessage } from "react-intl";

import { useSensilet } from '../context/SensiletContext'

import { bsv, findSig, toByteString, PubKey } from 'scrypt-ts'

//import { detectInterestsFromTxid, mintInterest, PersonalInterest, PersonalInterestData, getPersonalInterestData } from '../services/personalInterests'

const { mintInterest, PersonalInterest } = require('../src/contracts/personalInterest')


const artifact = require('../artifacts/src/contracts/personalInterest')

PersonalInterest.loadArtifact(artifact)

export interface PersonalInterestData {
  id: number;
  origin: string;
  location: string;
  topic: string;
  owner: string;
  weight: number;
  value: number;
  active: boolean;
  removal_location?: string;
  script_hash?: string;
  updatedAt: string;
  createdAt: string;
}

export async function getPersonalInterestData({ txid }: {txid: string}): Promise<PersonalInterestData[]> {

  const { data } = await axios.get(`https://pow.co/api/v1/personal-interests/${txid}`)

  console.log("powco.interests.fetch.result", { txid, data })

  return data.personal_interests

}


function PersonalInterestsPage() {
  const router = useRouter();

  const { signer, provider, sensiletPublicKey, sensiletAuthenticate } = useSensilet()

  const [sensiletChecked, setSensiletChecked] = useState<boolean>(false)

  const [isMinting, setIsMinting] = useState<boolean>(false)

  const [mintedTx, setMintedTx] = useState<bsv.Transaction | null>(null)

  const [interest, setInterest] = useState<any>(null)

  const [interestData, setInterestData] = useState<PersonalInterestData[]>([])

  const [interests, setInterests] = useState<PersonalInterestData[]>([])

  const [interestRemoved, setInterestRemoved] = useState<boolean>(false)

  const [owner, setOwner] = useState<string | null>()

  async function connectSensilet() {

    await sensiletAuthenticate()

    router.reload()

  }

  useEffect(() => {

    setSensiletChecked(!!sensiletPublicKey)

  }, [sensiletPublicKey])



  /*
  useEffect(() => {
    if (!router.query?.txid) { return }

    const txid = String(router.query?.txid)

    detectInterestsFromTxid(String(router.query?.txid)).then(interests => {

      console.log('loaded interests for txid', interests)

      if (interests[0]) setInterest(interests[0][0])

    })
    .catch((error: unknown) => {

      console.error('error detected personal interest for txid', error)

    })

    getPersonalInterestData({ txid }).then((interests: PersonalInterestData[]) => {

      setInterestData(interests)

    })
    .catch(console.error)

  }, [router.query.txid])
  */

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

    return (

      <ThreeColumnLayout>
        <div className="col-span-12 min-h-screen lg:col-span-6">
          <div className="mb-[200px] w-full">

           <div className="bg-primary-100 dark:bg-primary-600/20 p-5 flex items-center h-[78px] cursor-pointer my-4 rounded-lg">
              <div className="flex flex-col">
                <p className="text-base font-semibold my-0.5 text-gray-700 dark:text-white">
                  <FormattedMessage id="Sensilet Wallet" />
                </p>
                <p className="text-gray-400 dark:text-gray-300 text-sm tracking-normal	text-left my-0.5">
                  <FormattedMessage id={`Experimental Feature - Connect Sensilet Wallet`} />
                </p>
              </div>
              <div className="grow" />
              <div className="relative">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <button onClick={connectSensilet}>Connect Sensilet</button>
                  </div>
                </label>
              </div>
            </div>
          
          </div>
        </div>
      </ThreeColumnLayout>

    )

  }

  async function onClickRemoveInterest() {
    /*

    try {

      if (!interest || !signer) { return }

      await interest.connect(signer)

      console.log('interest.remove', interest)

      const result = await interest.methods.remove((sigResponses: any) => {
        return findSig(sigResponses, new bsv.PublicKey(sensiletPublicKey))
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
    */

  }

  async function onClickMintInterest() {

    if (!signer || !sensiletPublicKey) { return }

    try {

      const topic = String(prompt('Topic of Interest:'))
      const weight = Number(prompt('Weight:'))

      const instance = new PersonalInterest(
        toByteString(topic, true),
        PubKey(toByteString(sensiletPublicKey.toString())),
        BigInt(weight)
      ) 

      //@ts-ignore
      window.instance = instance
      console.log('instance', instance)
      instance.connect(signer)

      const result = await instance.deploy()

      console.log('instance.deploy.result', result)

      const txid = result.id

      router.push(`/interests/${txid}_0`)

      /*

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
      */

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
          <small>sensilet pubkey: {sensiletPublicKey.toString()}</small>
          <p><small>Owner: {owner}</small></p>
          <ul style={{"listStyle": "none"}}>
          <h2>My Personal Interests</h2>
          {interests.map(interest => {

            if (interest.removal_location) { return <></> }

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
              <li>owner: {new bsv.PublicKey(interest.owner).toAddress().toString()}</li>
              <li>topic: {fromHex(interest.topic)}</li>
              <li>weight: {Number(interest.weight)}</li>
              <li>data from api server: {JSON.stringify(interestData)}</li>
            </ul>
            </>
          )}
          <button style={{border: '1px solid white', padding: '1em', marginTop: '3em' }} onClick={() => { router.push('/interests') } }>My Interests</button>
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
