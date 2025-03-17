import React, { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useTuning } from "../context/TuningContext";
import TuningPanel from "./TuningPanel";
import { cleanString, Ranking } from "../pages/topics";

const GalaxySketch = dynamic(() => import("./visualizer/GalaxySketch"), {
  ssr: false, // Disable server-side rendering
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const VisualizerPanel = () => {
  const { startTimestamp } = useTuning();
  const { data, error } = useSWR(
    `https://www.pow.co/api/v1/boost/rankings/tags?start_date=${startTimestamp}`,
    fetcher,
  );
  const [tags, setTags] = useState<Ranking[]>([]);
  const [maxDifficulty, setMaxDifficulty] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const tags = data.rankings
        .map((ranking: Ranking) => {
          let { tag } = ranking;

          try {
            tag = Buffer.from(ranking.tag, "hex").toString();
            tag = cleanString(tag);
          } catch (error) {
            tag = "";
          }

          return Object.assign(ranking, {
            tag,
          });
        })
        .filter((tag: any) => !/\s/.test(tag.tag))
        .filter((tag: any) => !/[&\\#,()$~%'":?<>{}]/.test(tag.tag))
        .filter(
          (tag: any) =>
            tag.tag
            !== "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        )
        .filter((tag: any) => tag.tag !== "");

      // Set the maximum difficulty
      const maxDifficulty = Math.max(
        ...tags.map((tag: Ranking) => tag.difficulty),
      );

      setTags(tags);
      setMaxDifficulty(maxDifficulty);
    }
  }, [data]);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="bg-primary-100 dark:bg-primary-600/20">
      <TuningPanel />
      <GalaxySketch tags={tags} maxDifficulty={maxDifficulty} />
    </div>
  );
};

export default VisualizerPanel;
