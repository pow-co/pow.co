import Link from 'next/link';
import ThreeColumnLayout from '../components/ThreeColumnLayout';
import Loader from '../components/Loader';
import { useTuning } from '../context/TuningContext';
import { useAPI } from '../hooks/useAPI';
import BoostContentCard, { Ranking } from '../components/BoostContentCard';
import FindOrCreate from '../components/FindOrCreate';
import { useBitcoin } from '../context/BitcoinContext';
import CardErrorBoundary from '../components/CardErrorBoundary';
import BoostContentCardV2 from '../components/BoostContentCardV2';
import { SideChat } from '../components/SideChat';
import { useSubdomain } from '../hooks/subdomain'
import PanelLayout from '../components/PanelLayout'
import { useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component';

import TokenMeetProfile from '../components/profile/TokenMeetProfile'

export default function Home() {

  const { subdomain } = useSubdomain()
  const { filter } = useTuning();
  const { authenticated } = useBitcoin();
  const { data, error, loading } = useAPI(filter === 'last-day' ? '/powco/feeds/multi-day' : `/boost/rankings/${filter}`, '');
  //const { data, error, loading } = useAPI(`/boost/rankings/${filter}`, '');

  const [cursor, setCursor] = useState<number>(10)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const postsPerSlice = 10

  const [livestream, setLivestream] = useState()

  if (error) {
    return (
      <ThreeColumnLayout>
        Error, something happened
      </ThreeColumnLayout>
    );
  }

  if (subdomain) {
    return (
        <PanelLayout>
            <div className='grid grid-cols-12 w-full h-full'>
                <div className='col-span-12 xl:col-span-8 xl:pr-4'>
                    <TokenMeetProfile channel={subdomain}/>
                </div>
                <div className='col-span-12 xl:col-span-4 '>
                    <div className=''>
                        <h3 className='p-3 text-lg font-bold'>Live Chat in {subdomain}</h3>
                        <SideChat room={subdomain.toString()} />
                    </div>
                </div>
            </div>
        </PanelLayout>
    );
  }

  async function fetchMore() {

    console.log('FETCH MORE', cursor)

    setCursor(cursor + postsPerSlice) 

  }

  const { rankings } = data || [];
  let { days } = data || [];

  days = [rankings, days].flat()

  if (cursor > days.length && days?.length > 2 && hasMore) {
    console.log("CURSOR", { cursor, length: days?.length })
    setHasMore(false)
  }

  // console.log("RANKINGS", rankings)

  return (
    <ThreeColumnLayout>
      {authenticated && (
      <div className="mt-5 sm:mt-10">
        <FindOrCreate />
      </div>
      )}
      <div className="mx-0 mt-5 flex px-4">
        <Link href="/">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md bg-primary-100 px-3 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">
            All
          </div>
        </Link>
        <Link href="/relayx">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
            Club RelayX
          </div>
        </Link>
        <Link href="/twetch">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
            Twetch
          </div>
        </Link>
      </div>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <div className="mb-[200px] mt-5 lg:mt-10">
          {loading ? <Loader /> : (
            <>
              <InfiniteScroll
                dataLength={cursor}
                hasMore={hasMore}
                next={fetchMore}
                loader={<div className="mt-5 sm:mt-10"><Loader /></div>}
              >
                <div>
                  {/*{rankings?.slice(0, cursor).map((post: Ranking, index: number) => (

                    <CardErrorBoundary key={post.content_txid}>
                      <BoostContentCardV2 rank={index + 1} {...post} />
                    </CardErrorBoundary>
                  ))}*/}
                  {days?.slice(0, cursor).map((daysPost: Ranking, index: number) => (
                    <CardErrorBoundary key={daysPost.content_txid}>
                      <BoostContentCardV2 {...daysPost} />
                    </CardErrorBoundary>
                  ))}
                </div>
              </InfiniteScroll>
              {/*
              {days?.map((daysRankings: Ranking[], index: number) => (
                <div key={`ranking_days_${index + 1}`}>
                  <div className="flex items-center py-5">
                    <div className="border-bottom grow border border-gray-600 dark:border-gray-300" />
                    <div className="mx-5 text-lg font-semibold text-gray-600 dark:text-gray-300">{`${index + 1} ${index + 1 > 1 ? 'days' : 'day'} before`}</div>
                    <div className="border-bottom grow border border-gray-600 dark:border-gray-300" />
                  </div>
                  {daysRankings?.map((daysPost: Ranking, index: number) => (
                    <CardErrorBoundary key={daysPost.content_txid}>
                      <BoostContentCardV2 {...daysPost} />
                    </CardErrorBoundary>
                  ))}
                </div>
              ))}
              */}
            </>
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
