import Loader from "../../components/Loader"
import { useTuning } from "../../context/TuningContext"
import { useAPI } from "../../hooks/useAPI"
import FindOrCreate from "../../components/FindOrCreate"
import PanelLayout from "../../components/PanelLayout"
import LiveapiVideoCard from "../../components/LiveapiVideoCard"
import { LiveapiVideo } from "../../components/LiveapiVideoCard"
import TuningPanel from "../../components/TuningPanel"
import { useBitcoin } from "../../context/BitcoinContext"
import axios from "axios"
import { useEffect, useState } from "react"

async function listVideos(): Promise<LiveapiVideo[]> {

  const { data: { videos } } = await axios.get('https://tokenmeet.live/api/v1/videos')

  return videos
}

export default function Videos() {
  const { startTimestamp, filter, setFilter } = useTuning()
  const { authenticated } = useBitcoin()

  const [videos, setVideos] = useState<LiveapiVideo[]>([])

  useEffect(() => {
    listVideos().then(setVideos)
  }, [])

  if (!videos){
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
          {videos.map((video: any) => {

              // if not video, return <></>
            return <LiveapiVideoCard video={video}/>
          })} 
          
        </div>

      </div>


    </PanelLayout>
  )
}
