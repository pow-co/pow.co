import { useState, useEffect } from "react";
import axios from "axios";
import PanelLayout from "../PanelLayout";
import EpisodeDashboard, { Episode } from "../EpisodeDashboard";
import Loader from "../Loader";

interface TokenmeetVideo {}

export default function TokenMeetProfile({ channel }: { channel: string }) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [videos, setVideos] = useState<TokenmeetVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`https://api.tokenmeet.live/api/v1/channels/${channel}`)
      .then((data) => {
        console.log("channel data", data);

        setVideos(data.data.videos.sort((a: any, b: any) => b.id - a.id));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("error getting token meet episodes for channel", error);
      });
  }, [channel]);

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
        console.error("error getting token meet episodes for channel", error);
      });
  }, [channel]);

  if (loading) {
    return (
      <PanelLayout>
          <div className="mt-5 lg:mt-10">
            <Loader />
          </div>
      </PanelLayout>
    );
  }

  return (
      <div className="mb-[200px] mt-5 min-h-screen sm:mt-10">
        <div className="grid w-full grid-cols-1 gap-2 sm:gap-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {episodes.map((episode: any) => {
            if (!episode.hls_playback_url) {
              return null;
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
              return null;
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
  );
}
