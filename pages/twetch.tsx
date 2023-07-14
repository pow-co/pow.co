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
import Meta from '../components/Meta';

export default function TwetchFeed() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState('');
  const { authenticated } = useBitcoin();

  useEffect(() => {
    getLatestFeed().then((data) => {
      console.log(data);
      setPosts(data.edges.map((post: any) => post.node));
      setHasMore(data.pageInfo.hasNextPage);
      setCursor(data.pageInfo.endCursor);
    })
  }, []);

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
    <>
    <Meta title='Twetch | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
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
        </div>
      </div>
      {authenticated && (
      <Link href="/compose">
        <div className=" fixed bottom-[73px] right-[14px] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-primary-400 to-primary-500 lg:hidden">
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
  );
}
