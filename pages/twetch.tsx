import { useEffect, useState } from 'react';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroll-component';
import ThreeColumnLayout from '../components/ThreeColumnLayout';
import Loader from '../components/Loader';
import { useRelay } from '../context/RelayContext';
import FindOrCreate from '../components/FindOrCreate';
import { useBitcoin } from '../context/BitcoinContext';
import { getLatestFeed, getLatestFeedPagination } from '../services/twetch';
import { TwetchCard } from '../components/Twetch';

export default function TwetchFeed() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState('');
  const { hasTwetchPrivilege } = useRelay();
  const { authenticated } = useBitcoin();

  useEffect(() => {
    if (hasTwetchPrivilege) {
      getLatestFeed().then((data) => {
        console.log(data);
        setPosts(data.edges.map((post: any) => post.node));
        setHasMore(data.pageInfo.hasNextPage);
        setCursor(data.pageInfo.endCursor);
      });
    }
  }, [hasTwetchPrivilege]);

  const refresh = async () => {
    setPosts([]);
    setCursor('');
    setHasMore(true);
    getLatestFeed().then((data) => {
      setPosts(data.edges.map((post: any) => post.node));
      setHasMore(data.pageInfo.hasNextPage);
      setCursor(data.pageInfo.endCursor);
    });
  };

  const fetchMore = async () => {
    if (cursor) {
      getLatestFeedPagination(cursor).then((data) => {
        setPosts(posts.concat(data.edges.map((post: any) => post.node)));
        setHasMore(data.pageInfo.hasNextPage);
        setCursor(data.pageInfo.endCursor);
      });
    }
  };

  return (
    <ThreeColumnLayout>
      {authenticated && (
      <div className="mt-5 sm:mt-10">
        <FindOrCreate />
      </div>
      )}
      <div className="mx-0 mt-5 flex px-4">
        <Link href="/">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
            All
          </div>
        </Link>
        <Link href="/relayx">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
            Club RelayX
          </div>
        </Link>
        <Link href="/twetch">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md bg-primary-100 px-3 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">
            Twetch
          </div>
        </Link>
      </div>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <div className="mb-[200px] mt-5 lg:mt-10">
          {/* {rankings?.map((post: Ranking) => {
            return <BoostContentCard key={post.content_txid} {...post}/>
          } )} */}
          {hasTwetchPrivilege ? (
            <div className="w-full">
              <div className="relative">
                <InfiniteScroll
                  dataLength={posts.length}
                  hasMore={hasMore}
                  next={fetchMore}
                  loader={<div className="mt-5 sm:mt-10"><Loader /></div>}
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
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="py-2 text-5xl">😔</p>
              <p className="text-center text-xl">
                You need the
                <strong>Twetch Boost Privilege NFT</strong>
                {' '}
                to visit this page.
              </p>
              <a
                href="https://relayx.com/market/011a97bdc1868fc53342cb9bffdc3e42782a9c258fbb6597cd20effa3a4d6077_o2"
                target="_blank"
                rel="noreferrer"
                className="mb-6 mt-12 flex cursor-pointer items-center justify-center rounded-md border-none bg-gradient-to-tr from-blue-400 to-blue-500 px-5 py-2 text-center text-base font-semibold text-white transition duration-500 hover:-translate-y-1"
              >
                Buy it now!
              </a>
            </div>
          )}
        </div>
      </div>
      {authenticated && (
      <Link href="/compose">
        <div className=" fixed bottom-[73px] right-[14px] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 lg:hidden">
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
  );
}
