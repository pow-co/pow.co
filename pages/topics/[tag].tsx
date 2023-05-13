import ThreeColumnLayout from "../../components/ThreeColumnLayout"
import Loader from "../../components/Loader"
import { useTuning } from "../../context/TuningContext"
import { useAPI } from "../../hooks/useAPI"
import BoostContentCard from "../../components/BoostContentCard";
import { Ranking } from "../../components/BoostContentCard";
import { useRouter } from "next/router";
import BoostContentCardV2 from "../../components/BoostContentCardV2";


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
          return <BoostContentCardV2 key={post.content_txid} {...post}/>
        } )}
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
