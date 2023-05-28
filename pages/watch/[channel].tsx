import ThreeColumnLayout from "../../components/ThreeColumnLayout"
import Loader from "../../components/Loader"
import Link from "next/link"
import { useTuning } from "../../context/TuningContext"
import { useAPI } from "../../hooks/useAPI"
import BoostContentCard from "../../components/BoostContentCard";
import { Ranking } from "../../components/BoostContentCard";
import { useRelay } from "../../context/RelayContext"
import { FormattedMessage } from "react-intl"
import BitcoinBrowser from "../../components/BitcoinBrowser"
import FindOrCreate from "../../components/FindOrCreate"
import PanelLayout from "../../components/PanelLayout"
import YouTube from "react-youtube"
import { youtubePlayerOpts } from "../../components/YoutubeMetadataOnchain"
import VideoCard from "../../components/VideoCard"
import TuningPanel from "../../components/TuningPanel"
import { useBitcoin } from "../../context/BitcoinContext"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import EpisodeDashboard from '../../components/EpisodeDashboard'

export interface Episode {
	id: number;
	title: string;
	date: string;
	duration: number;
	participants: string[];
	token_origin: string;
	hls_playback_url: string;
	hls_live_url: string;
	hls_playback_audio_url: string;
	hls_playback_embed_url: string;
	show_id: number;
	createdAt: string;
	updatedAt: string;
}

export default function Watch({ channel }: {channel?: string}) {
  const { startTimestamp, filter, setFilter } = useTuning()
  const { authenticated } = useBitcoin()
  const { query } = useRouter()

  const [episodes, setEpisodes] = useState<Episode[]>([])

  const [loading, setLoading] = useState<boolean>(true)

  const [error, setError] = useState<Error>()

  useEffect(() => {

    axios.get(`https://api.tokenmeet.live/api/v1/shows/${query.channel}`).then((data) => {

	console.log('data', data)

	setEpisodes(data.data.episodes)
	setLoading(false)

    })
    .catch(error => { 
	setLoading(false);
	setError(error)
	console.error('error getting token meet episodes for channel', error)
	})

  }, [])

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

  
  return (

    <PanelLayout>
      <div className="mb-[200px] min-h-screen ">
        <div className="grid grid-cols-1 w-full gap-2 sm:gap-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {episodes.map((episode: any) => {
	    if (!episode.hls_playback_url) { return <></>}
	    return <EpisodeDashboard loading={loading} episode={episode}/>

          })} 
          
        </div>

      </div>


    </PanelLayout>
  )
}
