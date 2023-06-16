import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRelay } from "../context/RelayContext";
import { useTuning } from "../context/TuningContext";
import TuningPanel from "./TuningPanel";
import { cleanString, Ranking } from "../pages/topics";
import CircleSketch from "./visualizer/CircleSketch";

import { FormattedMessage } from "react-intl";
import { loadingEmoji } from "./Loader";

const VisualizerPanel = () => {
  const { startTimestamp } = useTuning();
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<Ranking[]>([]);

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

        setTags(tags);

        setLoading(false);
      });
  }, [startTimestamp]);

  return (
    <div className="bg-primary-100 dark:bg-primary-600/20 rounded-lg min-h-60 p-4">
      <CircleSketch />
      <div className="flex items-center justify-between mb-2">
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {/* <FormattedMessage id="Tuning Panel"/> */}
          Trending Topics
        </p>
        <Link
          href="/topics"
          className="text-blue-600 font-semibold text-sm hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="flex flex-col">
        {loading ? (
          <div className="mx-auto my-10 text-4xl animate-pulse">
            {loadingEmoji[Math.floor(Math.random() * loadingEmoji.length)]}
          </div>
        ) : (
          <table className="table-auto text-gray-900 dark:text-white">
            <thead className="text-lg font-semibold">
              <tr>
                <th>Tag</th>
                <th>Difficulty</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {tags?.slice(0, 15).map((el) => (
                <tr
                  key={el.tag}
                  className=" hover:bg-primary-200 hover:dark:bg-primary-500/20"
                >
                  <th>
                    <Link href={`/topics/${el.tag}`}>{el.tag}</Link>
                  </th>
                  <th>{el.difficulty.toFixed(3)}</th>
                  <th>{el.count}</th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VisualizerPanel;
