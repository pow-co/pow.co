import ThreeColumnLayout from "../components/ThreeColumnLayout"
import Loader from "../components/Loader"
import { useTuning } from "../context/TuningContext"
import { useAPI } from "../hooks/useAPI"
import BoostContentCard from "../components/BoostContentCard";
import { Ranking } from "../components/BoostContentCard";
import { useRouter } from "next/router";


export default function Home() {
  const { startTimestamp } = useTuning()
  const router = useRouter()
  const query = router.query
  const { data, error, loading } = useAPI(`/content/${query.txid}`, '')

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
         <div className='grid grid-cols-12 h-screen w-full' >
          <div className="mt-5 lg:mt-10 col-span-12">
            <p className="text-center text-5xl">🐛</p>
            <p className="text-xl text-center font-semibold">Error: something happened.</p>
            <p className="your post is probably on chain already but our API has trouble catching up right now."></p>
            <p className="text-center">We are working on fixing our API, please be patient</p>
          </div>
         </div>
      </ThreeColumnLayout>
    )
  }

  
  var content = {...data.content, content_txid: data.content.txid}
  
  return (
    <>
    <ThreeColumnLayout>
    <div className="col-span-12 lg:col-span-6 min-h-screen">
        <svg
          onClick={() => router.back()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="relative top-[69px] -left-[42px] w-6 h-6 stroke-gray-700 dark:stroke-gray-300 cursor-pointer hover:opacity-70"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      <div className="mt-5 lg:mt-10 mb-[200px]">
         <BoostContentCard {...content}/>
      </div>
    </div>
    </ThreeColumnLayout>
    </>
  )
}
