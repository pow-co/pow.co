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
import InfiniteScroll from "react-infinite-scroll-component"
import FindOrCreate from "../components/FindOrCreate"
import { useBitcoin } from "../context/BitcoinContext"
import { getGlobalFeed, getGlobalFeedPagination } from "../services/twetch"
import { TwetchCard } from "../components/Twetch"




export default function TwetchFeed() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState("");
  const { hasTwetchPrivilege } = useRelay()
  const { authenticated } = useBitcoin()

  useEffect(() => {
    if(hasTwetchPrivilege){
        getGlobalFeed().then((data) => {
          console.log(data)
          setPosts(data.edges.map((post: any) => post.node))
          setHasMore(data.pageInfo.hasNextPage);
          setCursor(data.pageInfo.endCursor);
        })
    }
  },[hasTwetchPrivilege] )

  const refresh = async () => {
    setPosts([]);
    setCursor("");
    setHasMore(true);
    getGlobalFeed().then((data) => {
      setPosts(data.edges.map((post: any) => post.node));
      setHasMore(data.pageInfo.hasNextPage);
      setCursor(data.pageInfo.endCursor);
    });
  };

  const fetchMore = async () => {
    cursor &&
      getGlobalFeedPagination(cursor).then((data) => {
        setPosts(posts.concat(data.edges.map((post: any) => post.node)));
        setHasMore(data.pageInfo.hasNextPage);
        setCursor(data.pageInfo.endCursor);
      });
  };

  
  
  return (
    <>
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
        <Link href={`/relayx`}>
          <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
            Club RelayX
          </div>
        </Link>
        <Link href={`/twetch`}>
          <div className="text-sm leading-4 py-2 px-3 text-gray-900 dark:text-white bg-primary-100 dark:bg-primary-600/20 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap">
            Twetch
          </div>
        </Link>
      </div>
      <div className="col-span-12 lg:col-span-6 min-h-screen">
        <div className="mt-5 lg:mt-10 mb-[200px]">
          {/* {rankings?.map((post: Ranking) => {
            return <BoostContentCard key={post.content_txid} {...post}/>
          } )} */}
          {hasTwetchPrivilege ? <div className="w-full">
            <div className="relative">
              <InfiniteScroll
                dataLength={posts.length}
                hasMore={hasMore}
                next={fetchMore}
                loader={<div className='mt-5 sm:mt-10'><Loader /></div>}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                refreshFunction={refresh}
              >
                <div>
                {posts.map((post: any) => (
                  <TwetchCard key={post.transaction} {...post} difficulty={0} />
                ))}
                </div>
              </InfiniteScroll>
            </div>
          </div> : <div className='flex flex-col items-center justify-center'>
                    <p className='text-5xl py-2'>😔</p>
                    <p className='text-xl text-center'>You need the <strong>Twetch Boost Privilege NFT</strong> to visit this page.</p>
                    <a 
                        href="https://relayx.com/market/011a97bdc1868fc53342cb9bffdc3e42782a9c258fbb6597cd20effa3a4d6077_o2"
                        target="_blank"
                        rel="noreferrer"
                        className='flex text-base text-white font-semibold mt-12 mb-6 border-none rounded-md bg-gradient-to-tr from-blue-400 to-blue-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1'
                    >Buy it now!</a>
                </div>}
        </div>
      </div>
      {authenticated && (
            <Link href="/compose">
              <div className=" lg:hidden fixed bottom-[73px] right-[14px] h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center cursor-pointer">
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
