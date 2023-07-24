
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
import BoostButton  from './BoostpowButton/BoostButton';
import { useRouter } from 'next/router';
import { useBitcoin } from '../context/BitcoinContext';
import { LiveStream } from '../pages/live/[channelId]';
import Link from 'next/link';
import ReactPlayer from 'react-player';
import moment from 'moment';

export interface LiveapiVideo {
  creation_time: string;
  _id: string;
  playback: {
    hls_url: string;
  };
  active: boolean;
  deleted: boolean;
}

export default function VideoCard({ video }: {video: LiveapiVideo}) {
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
      router.push(`/videos/${video._id}`)
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
            content={video._id}
            difficulty={1}
          />
        </div>
      </div>)
    }

    return (
      <>
        <div id="tokenmeet-room-container" style={{'flexDirection': 'column', display: 'flex'}} className='flex items-center mt-10'>
          <ReactPlayer width={'100%'} height={'100%'} controls={true}  url={video.playback.hls_url} />
          <Link href={`/videos/${video._id}`}>{video._id}</Link>
          <p>{moment(video.creation_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
        </div>
    </>
    )

  }