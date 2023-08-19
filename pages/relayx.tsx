import { useEffect, useState } from "react"
import ThreeColumnLayout from "../components/ThreeColumnLayout"
import Loader from "../components/Loader"
import Link from "next/link"
import { useTuning } from "../context/TuningContext"
import { useAPI } from "../hooks/useAPI"
import BoostContentCard from "../components/BoostContentCard";
import { Ranking } from "../components/BoostContentCard";
import { useRelay } from "../context/RelayContext"
import { FormattedMessage } from "react-intl"
import BitcoinBrowser from "../components/BitcoinBrowser"
import FindOrCreate from "../components/FindOrCreate"
import { useBitcoin } from "../context/BitcoinContext"
import { relayFeedQuery } from "./profile/[paymail]"
import InfiniteScroll from "react-infinite-scroll-component"
import { RelayClubCard } from "../components/RelayClub"
import Meta from "../components/Meta"

export default function RelayXFeed() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState("");

  const { authenticated } = useBitcoin()

  useEffect(()=>{
    relayFeedQuery("all").then((data) => {
      setPosts(data)
      setHasMore(false)
      setCursor("")
    })
  },[])
  
  
  return (
    <>
    <Meta title='Relay Club | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
      {authenticated && <div className="mt-5 sm:mt-10">
        <FindOrCreate/>
      </div>}
      <div className="flex mt-5 mx-0 px-4">
        <Link href={`/`}>
          <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
            All
          </div>
        </Link>
        <Link href={`/watch`}>
          <div className="text-sm leading-4 py-2 px-3 text-gray-900 dark:text-white bg-primary-100 dark:bg-primary-600/20 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap">
            Youtube
          </div>
        </Link>
        <Link href={`/twetch`}>
          <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
            Twetch
          </div>
        </Link>
      </div>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
        <div className="mt-5 lg:mt-10 mb-[200px]">
          {/* {rankings?.map((post: Ranking) => {
            return <BoostContentCard key={post.content_txid} {...post}/>
          } )} */}
          <div className="w-full">
            <div className="relative">
              <InfiniteScroll
                dataLength={posts.length}
                hasMore={hasMore}
                next={()=>null}
                loader={<div className='mt-5 sm:mt-10'>
                    <Loader />
                    </div>}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                refreshFunction={()=>null}
              >
                <div>
                  {posts.map((post: any) => {
                    return <RelayClubCard key={post.txid} {...post} difficulty={0}/>
                  })}
                </div>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
      {authenticated && (
            <Link href="/compose">
              <div className=" lg:hidden fixed bottom-[73px] right-[14px] h-14 w-14 rounded-full bg-gradient-to-r from-primary-400 to-primary-500 flex items-center justify-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </Link>
        )}
    </ThreeColumnLayout>
    </>
  )
}
