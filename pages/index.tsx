import ThreeColumnLayout from "../components/ThreeColumnLayout"
import Loader from "../components/Loader"
import Link from "next/link"
import { useTuning } from "../context/TuningContext"
import { useAPI } from "../hooks/useAPI"
import BoostContentCard from "../components/BoostContentCard";
import { Ranking } from "../components/BoostContentCard";
import { useRelay } from "../context/RelayContext"
import { FormattedMessage } from "react-intl"
import BitcoinBrowser from "../components/BitcoinBrowser"




export default function Home() {
  const { startTimestamp, filter, setFilter } = useTuning()
  const { authenticated } = useRelay()
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
    <div className="sm:hidden">
      {/* <BitcoinBrowser/> */}
    </div>
    <div className="col-span-12 lg:col-span-6 min-h-screen">
      <div className="mt-5 lg:mt-10 mb-[200px]">
        {rankings?.map((post: Ranking) => {
          return <BoostContentCard key={post.content_txid} {...post}/>
        } )}
      </div>
    </div>
    {authenticated && (
          <Link href="/compose">
            <div className=" lg:hidden fixed bottom-[73px] right-[14px] h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </Link>
      )}
    </ThreeColumnLayout>
    </>
  )
}
