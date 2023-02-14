
import useSWR from 'swr'

import { YoutubeMetadataOnchain, youtubePlayerOpts } from "./YoutubeMetadataOnchain"

import { LinkPreview } from '@dhaiwat10/react-link-preview';

import { fetcher } from '../hooks/useAPI'
import PowcoDevIssue from './PowcoDevIssue';
import { toast } from 'react-hot-toast';
import Gist from "react-gist";
import PostDescription from './PostDescription';
import { useTheme } from 'next-themes';
import YouTube from 'react-youtube';
import { ReactNode } from 'react';
import { BoostButton } from 'myboostpow-lib';
import { useRouter } from 'next/router';





export default function VideoCard({ txid, difficulty }: {txid: string, difficulty: number}) {
    const theme = useTheme()
    const router = useRouter()

    const handleBoostLoading = () => {
      toast('Publishing Your Boost Job to the Network', {
          icon: '⛏️',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
        });
    };
  
    const handleBoostSuccess = () => {
      toast('Success!', {
          icon: '✅',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
        });
    };
  
    const handleBoostError = () => {
      toast('Error!', {
          icon: '🐛',
          style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          },
      });
    };

    const navigate = (e:any) => {
      e.preventDefault()
      e.stopPropagation()
      router.push(`/${txid}`)
    }

    const VideoCardContainer = (props: { children: React.ReactNode }) => {
      return (
      <div className='p-4 bg-primary-100 dark:bg-primary-600/20 sm:rounded-lg hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 cursor-pointer' onClick={navigate}>
        <div className=''>
          {props.children}
        </div>
        <div className='float-right'>
          <BoostButton
            content={txid}
            difficulty={difficulty}
            //@ts-ignore
            theme={theme.theme}
            showDifficulty
            onSending={handleBoostLoading}
            onError={handleBoostError}
            onSuccess={handleBoostSuccess}
          />
        </div>
      </div>)
    }

    // @ts-ignore
    const { data, isLoading } = useSWR(`https://onchain.sv/api/v1/events/${txid}`, fetcher) // TODO remove this data fetch and take data from higher in the app

    if (isLoading){
        return (
          <div role="status" className="flex items-center justify-center h-56 w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
            <svg className="w-12 h-12 text-gray-200 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 384 512"><path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"/></svg>
            <span className="sr-only">Loading...</span>
          </div>
        )
    }
  
    if (!data || data.events.length === 0) {
      return <></>
    }
  
    var [event] = data.events

  
    if (event.app === 'powstream.com') {
  
      if (event.type === 'youtube_video_metadata' && event.author === '1D1hSyDc7UF4KbGFTSSXLirCBepjcN19GN') {
  
        return <VideoCardContainer>
          <YoutubeMetadataOnchain txid={txid} event={event}/>
          </VideoCardContainer>
  
      }
    }
  
    if (event.type === 'url') {
      
      const url = event.content.url || event.content


      // 1. check if url is youtube 
      const youtubeLinkRegex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

      const youtubeMatch = youtubeLinkRegex.exec(url)
      if(youtubeMatch){
        // 2. get the youtube video id
        const videoId = youtubeMatch[1]
        return <VideoCardContainer>

          <YouTube videoId={videoId} opts={youtubePlayerOpts}/>
        </VideoCardContainer>
      } 
  
  
    }
  
    return (
      <>
      </>
    )
  
  }