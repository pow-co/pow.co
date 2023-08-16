import { useRouter } from 'next/router'
import React from 'react'
import Dropzone from '../../components/UploadDropzone'
import ThreeColumnLayout from '../../components/ThreeColumnLayout'
import Meta from '../../components/Meta'
import useSWR from 'swr'
import Link from 'next/link'
import axios from 'axios'
import ReactPlayer from 'react-player'
import useWallet from '../../hooks/useWallet'

import { useRelay } from '../../context/RelayContext'

const ComposeImage = () => {

    const router = useRouter()

    const wallet = useWallet()

    const { relayxPublicKey } = useRelay()

    console.log("wallet name", wallet?.name)

    //@ts-ignore 
    window.wallet= wallet 

    var owner = '020d5d4d6c0c3824d7b979586b2537d2e17af4901ad8edc82dccf7e29a0838caa2'

    if (wallet?.name === 'relayx' && relayxPublicKey) {

      owner = relayxPublicKey.toString()

      console.log("owner.relayx.set", owner)

    }

    owner = wallet?.publicKey?.toString() || owner

    console.log({ owner })

    const { data: videos, error, isLoading, mutate } = useSWR(`https://hls.pow.co/api/v1/owners/${owner}/videos`, async (url: string): Promise<Video[]> => {

    const { data } = await axios.get(url)

    return Promise.all(data.videos.map(async (video: Video) => {

      try {

        await axios.head(`https://hls.pow.co/${video.sha256Hash}.m3u8`)

        return {...video, url: `https://hls.pow.co/${video.sha256Hash}.m3u8`}

      } catch(error) {

        return {...video, url: `https://hls.pow.co/${video.sha256Hash}.mp4`}

      }

    }))

  })
  

  return (
    <>
    <Meta title={`Video Uploader | POWCO`} description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <svg
          onClick={() => router.back()}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="relative -left-[42px] top-[69px] h-6 w-6 cursor-pointer stroke-gray-700 hover:opacity-70 dark:stroke-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <div className="mb-[200px] mt-3 bg-primary-100 pb-3 pt-4 dark:bg-primary-700/20 lg:mt-8 lg:rounded-xl">
            {/* <FileInput/> */}
            <Dropzone owner={owner}/>
        </div>

        <div className="mb-[200px] mt-3 bg-primary-100 pb-3 pt-4 dark:bg-primary-700/20 lg:mt-8 lg:rounded-xl">
            {/* <FileInput/> */}
            <MyVideos owner={owner} videos={videos} isLoading={isLoading} />
        </div>
      </div>
    </ThreeColumnLayout>
    </>
  )
}

interface Video {
  origin: string;
  sha256Hash: string;
  og_title: string;
  og_description: string;
  url: string;
}

function MyVideos({ owner, videos, isLoading }: { owner: string, videos?: Video[], isLoading: boolean }) {

  if (isLoading) {

    return (
    <div>
            <h2>My Videos</h2>
            <small>owner: {owner}</small>
            <p>Loading...</p>
    </div>
)
  }

  return (

    <div>

      <h2>My Videos</h2>
      <small>owner: {owner}</small>

      <div>
        <ul>
          {videos && videos.map((video: Video) => (
              <li key={video.sha256Hash}>
                <Link href={`/${video.origin}`}>
                  {video.origin}
                </Link>          
                <ReactPlayer width={'100%'} height={'100%'} controls={true}  url={video.url} />
  
              </li>
            ))}
        </ul>
      </div>

    </div>

  )
}

export default ComposeImage
