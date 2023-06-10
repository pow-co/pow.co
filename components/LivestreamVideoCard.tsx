
import useSWR from 'swr'

import { YoutubeMetadataOnchain, youtubePlayerOpts } from "./YoutubeMetadataOnchain"

import { LinkPreview } from '@dhaiwat10/react-link-preview';

import { fetcher } from '../hooks/useAPI'
import PowcoDevIssue from './PowcoDevIssue';
import { toast } from 'react-hot-toast';
import PostDescription from './PostDescription';
import { useTheme } from 'next-themes';
import YouTube from 'react-youtube';
import { ReactNode } from 'react';
import { BoostButton } from 'boostpow-button';
import { useRouter } from 'next/router';
import { useBitcoin } from '../context/BitcoinContext';

export default function VideoCard({ txid, difficulty }: {txid: string, difficulty: number}) {
    const theme = useTheme()
    const router = useRouter()
    const { wallet } = useBitcoin()

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
        <div className='flex w-full px-16'>
          <div className='grow'/>
          <div className={`min-w-[111px] justify-center flex group items-center w-fit relative`}>
            <svg
              viewBox="0 0 40 40"
              fill="none"
              className="h-[40px] w-[40px] fill-gray-500 dark:fill-gray-300 group-hover:fill-green-500"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.7698 26.04L16.7796 26.0214C16.8013 25.98 16.8245 25.9351 16.8491 25.8873C17.03 25.5371 17.2911 25.0314 17.6274 24.6275C18.0608 24.1068 18.7281 23.6137 19.6907 23.6137C22.7525 23.6137 24.8033 23.173 26.0492 22.4503C27.1805 21.794 27.7035 20.8819 27.7035 19.5258C27.7035 16.3261 24.3811 13.2965 19.6907 13.2965C15.2771 13.2965 12.2965 16.1275 12.2965 19.5258C12.2965 20.3629 12.6319 22.2529 13.4911 23.5026L13.4978 23.5125L13.4978 23.5125C14.3586 24.7897 15.3301 25.7902 16.4883 26.5864C16.5026 26.5622 16.5179 26.5356 16.5341 26.5064C16.6042 26.3801 16.6748 26.2365 16.7606 26.059L16.7698 26.04ZM17.9278 26.6233C17.9537 26.574 17.9795 26.5244 18.0053 26.4748C18.4108 25.6944 18.8183 24.9101 19.6907 24.9101C25.9691 24.9101 29 23.1358 29 19.5258C29 15.3652 24.8247 12 19.6907 12C14.7423 12 11 15.2428 11 19.5258C11 20.5354 11.3711 22.7075 12.4227 24.2371C13.4124 25.7055 14.5567 26.8681 15.9485 27.7858C16.1649 27.9388 16.3814 28 16.5979 28C17.2474 28 17.5876 27.327 17.9278 26.6233Z"
              ></path>
            </svg>
            <p className="text-gray-500 dark:text-gray-300 group-hover:text-green-500">
              {/* {0} */}
            </p>
          </div>
          <BoostButton
            wallet={wallet}
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
