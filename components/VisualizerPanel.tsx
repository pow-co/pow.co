import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRelay } from "../context/RelayContext";
import { useTuning } from "../context/TuningContext";
import TuningPanel from "./TuningPanel";
import { cleanString, Ranking } from "../pages/topics";

const CircleSketch = dynamic(() => import("./visualizer/CircleSketch"), {
  ssr: false, // Disable server-side rendering
});

const VisualizerPanel = () => {
  const { startTimestamp } = useTuning();
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<Ranking[]>([]);
  const [maxDifficulty, setMaxDifficulty] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://pow.co/api/v1/boost/rankings/tags?start_date=${startTimestamp}`
      )
      .then(({ data }: { data: any }) => {
        const tags = data.rankings
          .map((ranking: Ranking) => {
            var tag = ranking.tag;

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
          .filter((tag: any) => !/[&\/\\#,()$~%'":?<>{}]/.test(tag.tag))
          .filter(
            (tag: any) =>
              tag.tag !=
              "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
          )
          .filter((tag: any) => tag.tag != "");

        // Set the maximum difficulty
        const maxDifficulty = Math.max(
          ...tags.map((tag: Ranking) => tag.difficulty)
        );

        setTags(tags);
        setMaxDifficulty(maxDifficulty);

        setLoading(false);
      });
  }, [startTimestamp]);

  return (
    <div className="bg-primary-100 dark:bg-primary-600/20 min-h-60">
      <TuningPanel />
      <CircleSketch tags={tags} maxDifficulty={maxDifficulty} />
    </div>
  );
};

export default VisualizerPanel;
