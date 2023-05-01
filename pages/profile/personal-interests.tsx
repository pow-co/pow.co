import ThreeColumnLayout from "../../components/ThreeColumnLayout"
import Loader from "../../components/Loader"
import { useTuning } from "../../context/TuningContext"
import { useAPI } from "../../hooks/useAPI"
import BoostContentCard from "../../components/BoostContentCard";
import { Ranking } from "../../components/BoostContentCard";
import { useRouter } from "next/router";

import {useState, useEffect}from 'react'

import { PersonalInterest } from '../../contracts/personal-interest/src'

const artifact = require('../../contracts/personal-interest/artifacts/src/contracts/personalInterest.json')

export default function TopicPage() {
  const { startTimestamp } = useTuning()
  const router = useRouter()
  const query = router.query
  let tag='';
  if (query.tag){
    tag = query.tag.toString()
  } else {
    tag = ''
  }
  const hexTag = Buffer.from(tag, 'utf-8').toString('hex')
  const { data, error, loading } = useAPI(`/boost/rankings?start_date=${startTimestamp}&tag=${hexTag}`, '')

  const [interest, setInterest] = useState()

  useEffect(() => {
  
    PersonalInterest.loadArtifact(artifact)

    //@ts-ignore
    window.PersonalInterest = PersonalInterest

  }, []);

  if (loading){
    return (
      <>
      <ThreeColumnLayout>
        <div className="mt-5 lg:mt-10">
          <Loader/>
        </div>
      </ThreeColumnLayout>
      </>
    )
  }

  if (error) {
    return (
      <ThreeColumnLayout>
        Error, something happened
      </ThreeColumnLayout>
    )
  }

  
  let { rankings } = data 
  
  return (
    <>
    <ThreeColumnLayout>
    <div className="col-span-12 lg:col-span-6 min-h-screen">
      <div className="mt-5 lg:mt-10 mb-[200px]">
        {rankings?.map((post: Ranking) => {
          return <BoostContentCard key={post.content_txid} {...post}/>
        } )}
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
