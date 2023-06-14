import React, { useRef, useEffect, useState } from "react";
import ThreeColumnLayout from "./ThreeColumnLayout";
import Loader from "./Loader";

import Link from "next/link";

import { useTuning } from "../context/TuningContext";
import { useRouter } from "next/router";
import { useBitcoin } from "../context/BitcoinContext";

import ReactPlayer from "react-player";
import { useRelay } from "../context/RelayContext";

export interface Episode {
  id: number;
  date: Date;
  token_origin: string;
  title: string;
  hls_url: string;
  participants: string[];
}

const Dashboard = ({
  episode,
  loading,
}: {
  episode: Episode | any;
  loading: boolean;
}) => {
  const { authenticated, paymail } = useBitcoin();

  const [tokenBalance, setTokenBalance] = useState<number>(0);

  const { getTokenBalance } = useRelay();

  const playerRef: any = useRef();

  function playVideo() {
    playerRef?.current && playerRef.current.play();
  }

  function pauseVideo() {
    playerRef && playerRef.current.pause();
  }

  function toggleControls() {
    playerRef.current.controls = !playerRef.current.controls;
  }

  useEffect(() => {
    //@ts-ignore
    window.playVideo = playVideo;
    playVideo();
  }, []);

  useEffect(() => {
    if (!paymail || !episode) {
      return;
    }

    console.log("EPISODE", episode);

    getTokenBalance({
      token_contract: episode.token_origin,
    }).then(({ balance }: { balance: number }) => {
      console.log("set token balance", {
        contract: episode.token_origin,
        balance,
      });
      setTokenBalance(balance);
    });
  }, [paymail, episode]);

  return (
    <>
      <div className="p-4 bg-primary-100 dark:bg-primary-600/20 sm:rounded-xl mb-4 flex flex-col w-full items-center justify-center">
        <h1 className="w-full text-3xl font-bold mb-4">
          {episode.title}
        </h1>
        {tokenBalance >= 0 && episode.hls_playback_url && (
          <div className="w-full h-full">
            <ReactPlayer controls={true} url={episode.hls_playback_url} width="100%" height="100%"/>
          </div>
        )}
        <div className="mt-4">
          <button className='flex text-sm leading-4 text-white font-semibold border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'>
            <a
              href={`https://relayx.com/market/${episode.token_origin}`}
              rel="noreferrer"
              target="_blank"
            >
              Buy the Ticket NFT
            </a>
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
