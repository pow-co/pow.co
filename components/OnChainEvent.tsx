
import useSWR from 'swr'

import { YoutubeMetadataOnchain, youtubePlayerOpts } from "./YoutubeMetadataOnchain"

import { LinkPreview } from '@dhaiwat10/react-link-preview';
import axios from 'axios';
import { fetcher } from '../hooks/useAPI'
import PowcoDevIssue from './PowcoDevIssue';
import NFTCard from './NFTCard';
import Gist from "react-gist";
import PostDescription from './PostDescription';
import { useTheme } from 'next-themes';
import YouTube from 'react-youtube';


const customFetcher = async (url: string) => {
    const response = await fetch(`https://link-preview-proxy.pow.co/v2?url=${url}`);
    const json = await response.json();
    return json.metadata;
};

export default function OnchainEvent({ txid }: {txid: string}) {
    const theme = useTheme()

    // @ts-ignore
    const { data, isLoading } = useSWR(`https://onchain.sv/api/v1/events/${txid}`, fetcher) // TODO remove this data fetch and take data from higher in the app

    if (isLoading){
        return (
            <div className=''>
                <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    if (!data || data.events.length === 0) {
      return <></>
    }

    var [event] = data.events

    console.log('event', event)

    // Render RelayX MarketPlace Events
    if (event?.content?.url?.startsWith('https://relayx.com/market/')) {

      // Make API Call to get nft data
      const nftOrigin = `https://staging-backend.relayx.com/api/market/${event.content.url.split('/').pop()}`
      console.log('nftOrigin is: ', nftOrigin)

      // How do I get the nft data here? Example data below
      const nft = {
        "location": "378b01f6c61b6490693135b41dcec80270b5cdd719e5750dbf141827c778bc5e_o1",
        "origin": "6b2952d2dc2e868a028d0e3f1d9ee3ad8fc6ab2d2c982244d5c6519132b13748_o3",
        "name": "La Fonda de El Ceboruco Club Membership",
        "nonce": 2,
        "symbol": "La Fonda de El Ceboruco Club Membership",
        "owner": "1rtPcyeB9wtYAysqXx1j7DpFNKFLQHXct",
        "issued": 218,
        "burned": 0,
        "whitepaper": "",
        "description": "\"How are you friends? Greetings from the beautiful land of Nayarit. I'm proud to present the flavors and foods from my town\" \n\nBy purchasing this NFT you will become a part of the La Fonda de El Ceboruco Club and receive airdrops of all future recipe NFTs. Holding the NFT to a recipe will allow you to see that recipe and the accompanying video tutorial at www.ceboru.co \n\nMy mom is very excited to share her recipes with you! 😋",
        "nft": true,
        "royalties": [
            {
                "address": "1BQLZzFoX71t7J119oqgGXmUfRekFWshjQ",
                "royalty": 0.0218
            }
        ],
        "icon": {
            "berry": "6b2952d2dc2e868a028d0e3f1d9ee3ad8fc6ab2d2c982244d5c6519132b13748_o1"
        },
        "audio": "6b2952d2dc2e868a028d0e3f1d9ee3ad8fc6ab2d2c982244d5c6519132b13748_o2",
        "isEncrypted": false,
        "floor": 21800000,
        "against": "BSV",
        "price": 0,
        "vol": 0,
        "status": "open",
        "message": "",
        "owners": 4,
        "creator": "ceboruco@relayx.io"
    }
      return <NFTCard nft={nft}/>
    }

    if (event.app === 'powstream.com') {

      if (event.type === 'youtube_video_metadata' && event.author === '1D1hSyDc7UF4KbGFTSSXLirCBepjcN19GN') {

        return <YoutubeMetadataOnchain txid={txid} event={event}/>

      }
    }

    if (event.app === 'egoboost.vip') {

      return <>
      <h3><a className="egoboost-link" href={`https://egoboost.vip`}>EgoBoost.VIP</a></h3>

      <h3>Paymail: {event.content?.paymail}</h3>
    </>
    }

    if (event.app === '1HWaEAD5TXC2fWHDiua9Vue3Mf8V1ZmakN') { // askbitcoin.ai

      if (event.type === 'question') {

        return <>
          <h3><a className="text-xl font-semibold hover:underline " href={`https://askbitcoin.ai/questions/${event.txid}`}>AskBitcoin.AI Question:</a></h3>

          <PostDescription bContent={event.content.content}/>
        </>
      }

      if (event.type === 'answer') {

        return <>
          <h3><a className="text-xl font-semibold hover:underline " href={`https://askbitcoin.ai/answers/${event.txid}`}>AskBitcoin.AI Answer:</a></h3>
          <PostDescription bContent={event.content.content}/>
        </>
      }

    }

    if (event.app === 'boostpatriots.win' && event.author === "18h6yhKBBqXQge6XRauMTeEaQ9HF4jR1qV") {

      return <>
        <h3><a rel="noreferrer"  href={`https://boostpatriots.win${event.content.href}`}>BoostPatriots.Win</a></h3>
        <h4>{event.content.title}</h4>
      </>
    }

    if (event.app === 'powco.dev' && event.type === 'github.issue') {

      return <PowcoDevIssue event={event} />


    }

    if (event.type === 'url') {

      if (event.content.url.match('https://gist.github.com')) {

        const id = event.content.url.split('/').pop()

        return <>
              <small className=''><a href='{event.content.html_url}' className='blankLink'>{event.content.url}</a></small>
                <div className='text-ellipsis '>
                    <Gist  id={id} />
                </div>

        </>

      }

      const url = event.content.url || event.content

      console.log(url)

      // 1. check if url is youtube
      const youtubeLinkRegex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

      const youtubeMatch = youtubeLinkRegex.exec(url)
      if(youtubeMatch){
        // 2. get the youtube video id
        const videoId = youtubeMatch[1]
        console.log(videoId)
        return <YouTube videoId={videoId} opts={youtubePlayerOpts}/>
      } else {
        return <>
        <LinkPreview  url={url} fetcher={customFetcher}  showLoader showPlaceholderIfNoImage
        fallback={<>
          <a onClick={(e:any) => e.stopPropagation()} target='_blank' rel='noreferrer' href={url} className='cursor-pointer text-ellipsis break-words text-blue-500 hover:underline'>{url}</a>
        </>}
         />

      </>

      }


    }

    return (
      <>
      </>
    )

  }