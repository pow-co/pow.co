
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
import NFTItemCard from './NFTItemCard';

const customFetcher = async (url: string) => {
    const response = await fetch(`https://link-preview-proxy.pow.co/v2?url=${url}`);
    const json = await response.json();
    return json.metadata;
};

export default function OnchainEvent({ txid }: {txid: string}) {
    const theme = useTheme()

    // @ts-ignore
    const { data, isLoading } = useSWR(`https://onchain.sv/api/v1/events/${txid}`, fetcher) // TODO remove this data fetch and take data from higher in the app

    if (data) {
      var [event] = data.events
    }

    const marketId = event?.content?.url?.split('/')[4]
    const itemId = event?.content?.url?.split('/')[5]

    // Check if the event is a RelayX Marketplace Link and fetch the NFT data
    const relayItemOrigin = event?.content?.url?.split('/').pop()
    // Conditionally fetch
    const {data: nftData} =  useSWR(relayItemOrigin ? `https://staging-backend.relayx.com/api/market/${relayItemOrigin}` : null, fetcher)
    const {data: nftItemData} =  useSWR(marketId ? `https://staging-backend.relayx.com/api/market/${marketId}/items/${itemId}`: null, fetcher)

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

    console.log(event.content, 'hello?')

    // Render RelayX MarketPlace Events
    if (event?.content?.url?.startsWith('https://relayx.com/market/')) {
      const nft = nftData?.data?.token
      if (nft) {
        return <NFTCard nft={nft}/>
      }
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

      // Check if it's a RelayX item link
      if (url.match('https://relayx.com/assets/')) {
        return <NFTItemCard nft={nftItemData?.data} />
      }

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