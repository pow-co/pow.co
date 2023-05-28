
import React, { useRef, useEffect, useState } from "react";
import ThreeColumnLayout from './ThreeColumnLayout'
import Loader from './Loader'

import Link from "next/link";

import { useTuning } from "../context/TuningContext";
import { useRouter } from "next/router";
import { useBitcoin } from "../context/BitcoinContext";

import ReactPlayer from 'react-player'
import { useRelay } from "../context/RelayContext";

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

export interface Episode {
  id: number;
  date: Date;
  token_origin: string;
  title: string;
  hls_url: string;
  participants: string[];
}

const Dashboard = ({episode, loading }:{episode: Episode | any, loading: boolean}) => {

  const { authenticated, paymail } = useBitcoin()

  const [tokenBalance, setTokenBalance] = useState<number>(0)

  const { getTokenBalance } = useRelay()

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
    window.playVideo = playVideo
    playVideo()
  }, [])

  useEffect(() => {

    if (!paymail || !episode) { return }

    console.log("EPISODE", episode)

    getTokenBalance({
      token_contract: episode.token_origin
    })
    .then(({balance}:{balance: number}) => {
	console.log('set token balance', { contract: episode.token_origin, balance })
      setTokenBalance(balance)
    })

  }, [paymail, episode])


  return (
    <>

          <div >
          <h1 className='episodeTitle' style={{width: '100%', fontSize: '35px'}}>{episode.title}</h1>
          <br/>

          <br/>
          {tokenBalance >= 0 && episode.hls_playback_url && (
          <ReactPlayer controls={true} url={episode.hls_playback_url} />
          )}
                    <br/>


          <button>
            <a style={{border: '2px solid white', padding: '1em'}} className="button" href={`https://relayx.com/market/${episode.token_origin}`} rel="noreferrer" target="_blank">Buy the Ticket NFT</a>
          </button>          

          </div>
    </>
  );
};

export default Dashboard;
