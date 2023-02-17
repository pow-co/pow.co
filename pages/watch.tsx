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
import FindOrCreate from "../components/FindOrCreate"
import PanelLayout from "../components/PanelLayout"
import YouTube from "react-youtube"
import { youtubePlayerOpts } from "../components/YoutubeMetadataOnchain"
import VideoCard from "../components/VideoCard"
import TuningPanel from "../components/TuningPanel"
import { useBitcoin } from "../context/BitcoinContext"



export default function Watch() {
  const { startTimestamp, filter, setFilter } = useTuning()
  const { authenticated } = useBitcoin()
  const { data, error, loading } = useAPI(`/boost/rankings?start_date=${startTimestamp}`, '')

  if (loading){
    return (
      <>
      <PanelLayout>
        <div className="mt-5 lg:mt-10">
          <Loader/>
        </div>
      </PanelLayout>
      </>
    )
  }

  if (error) {
    return (
      <PanelLayout>
        Error, something happened
      </PanelLayout>
    )
  }

  
  let { rankings } = data 
  
  
  return (
    <PanelLayout>
      <div className="mb-[200px] min-h-screen ">
        <div className="p-5 flex">
          <FindOrCreate/>
          <div className="hidden sm:block">
            <TuningPanel/>
          </div>
        </div>
        <div className="grid grid-cols-1 w-full gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rankings.map((content: any) => {
            if(content.content_type !== "application/json"){
              return <></>
            } else {
              // if not video, return <></>
              return <VideoCard key={content.content_txid} difficulty={content.difficulty} txid={content.content_txid}/>
            }
          })} 
          
        </div>

      </div>


    </PanelLayout>
  )
}
