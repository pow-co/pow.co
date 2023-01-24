import ThreeColumnLayout from "../components/ThreeColumnLayout"
import Loader from "../components/Loader"
import { useTuning } from "../context/TuningContext"
import { useAPI } from "../hooks/useAPI"
import BoostContentCard from "../components/BoostContentCard";
import { Ranking } from "../components/BoostContentCard";


export default function Home() {
  const { startTimestamp } = useTuning()
  const { data, error, loading } = useAPI(`/boost/rankings?start_date=${startTimestamp}`, '')

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
