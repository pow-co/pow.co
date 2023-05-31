import Link from "next/link";
import ThreeColumnLayout from "../ThreeColumnLayout";
import Loader from "../Loader";
import { useAPI } from "../../hooks/useAPI";
import BoostContentCard, { Ranking } from "../BoostContentCard";
import FindOrCreate from "../FindOrCreate";
import { useBitcoin } from "../../context/BitcoinContext";
import CardErrorBoundary from "../CardErrorBoundary";
import BoostContentCardV2 from "../BoostContentCardV2";
import { useSubdomain } from "../../hooks/subdomain";
import { useState, useEffect } from "react";
import PanelLayout from "../PanelLayout";
import EpisodeDashboard from "../EpisodeDashboard";
import axios from "axios";

import { Episode } from "../../pages/watch/[channel]";

interface TokenmeetVideo {}

function RightSidebar({ channel }: { channel: string }) {
  return (
    <div id="right-sidebar">
      <div className="fixed top-[102px] z-50 w-[344px]">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Here shall be recent posts tagged #{channel}
        </h2>
      </div>
    </div>
  );
}

export default function TokenMeetProfile({ channel }: { channel: string }) {
  const { subdomain } = useSubdomain();
  const { authenticated } = useBitcoin();

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const [videos, setVideos] = useState<TokenmeetVideo[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<Error>();

  useEffect(() => {
    axios
      .get(`https://api.tokenmeet.live/api/v1/channels/${channel}`)
      .then((data) => {
        console.log("channel data", data);

        setVideos(data.data.videos);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
        console.error("error getting token meet episodes for channel", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`https://api.tokenmeet.live/api/v1/shows/${channel}`)
      .then((data) => {
        console.log("data", data);

        setEpisodes(data.data.episodes);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
        console.error("error getting token meet episodes for channel", error);
      });
  }, []);

  if (loading) {
    return (
      <>
        <PanelLayout>
          <div className="mt-5 lg:mt-10">
            <Loader />
          </div>
        </PanelLayout>
      </>
    );
  }

  return (
    <PanelLayout>
      <div className="mb-[200px] min-h-screen mt-5 sm:mt-10">
        <div className="grid grid-cols-1 w-full gap-2 sm:gap-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {episodes.map((episode: any) => {
            if (!episode.hls_playback_url) {
              return <></>;
            }
            return (
              <EpisodeDashboard
                key={episode.id}
                loading={loading}
                episode={episode}
              />
            );
          })}

          {videos.map((video: any) => {
            if (!video.playback.hls_url) {
              return <></>;
            }
            return (
              <EpisodeDashboard
                key={video.id}
                loading={loading}
                episode={{ hls_playback_url: video.playback.hls_url }}
              />
            );
          })}
        </div>
      </div>
    </PanelLayout>
  );
}
