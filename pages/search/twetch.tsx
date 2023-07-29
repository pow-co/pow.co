import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import ThreeColumnLayout from '../../components/ThreeColumnLayout';
import SearchBar from '../../components/SearchBar';
import UserIcon from '../../components/UserIcon';
import Meta from '../../components/Meta';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TwetchCard } from '../../components/Twetch';
import Loader from '../../components/Loader';
import { useRelay } from '../../context/RelayContext';

const userRegex = /from:\s*(\d+)/i;

function SearchPage() {
    const { hasTwetchPrivilege } = useRelay()
  const router = useRouter();
  const { query } = router;
  const value = useMemo(() => query.v?.toString(), [query]);
  const match = useMemo(() => value?.match(userRegex), [value])
  const searchTerm = useMemo(() => {
    if(match){
        let index = value?.indexOf(match[0])
        return value?.substring(0, index).trim()
    } else {
        return value
    }
  }, [value, match])
  const from = useMemo(() => {
    if(match){
        return match[1]
    } else {
        return null
    }
  }, [match, value])
  const [orderBy, setOrderBy] = useState("CREATED_AT_DESC")
  const [results, setResults] = useState([]);
  const [hasMore, setHasMore] = useState(false)
  const [cursor, setCursor] = useState(null) 

  const fetchData = async () => {
    let path = from ? `/api/v1/twetch/search?searchTerm=${searchTerm}&orderBy=${orderBy}&from=${from}` : `/api/v1/twetch/search?searchTerm=${searchTerm}&orderBy=${orderBy}`
    if (cursor){
        path = path + `&cursor=${cursor}`
    }
    const result = await axios.get(path)
    return result.data
  }

  useEffect(() => {
    setCursor(null)
    setResults([])
    setHasMore(true)
    if (value && value.length > 0){
        fetchData().then((data) => {
            console.log(data)
            setResults(data.edges.map((post: any) => post.node))
            setHasMore(data.pageInfo.hasNextPage)
            setCursor(data.pageInfo.endCursor)
        })
    } else {
        setHasMore(false)
    }
  },[searchTerm, orderBy, from])

  const refresh = async () => {
    setResults([]);
    setCursor(null);
    setHasMore(true);
    fetchData().then((data) => {
        console.log(data)
        setResults(data.edges.map((post: any) => post.node))
        setHasMore(data.pageInfo.hasNextPage)
        setCursor(data.pageInfo.endCursor)
    })
  }

  const fetchMore = async () => {
    if (cursor) {
        fetchData().then((data) => {
            console.log(data)
            setResults(results.concat(data.edges.map((post: any) => post.node)))
            setHasMore(data.pageInfo.hasNextPage)
            setCursor(data.pageInfo.endCursor)
        })
    }
  }

  const handleChangeOrder = (e:any) => {
    e.preventDefault()
    setResults([])
    setHasMore(true)
    setCursor(null)
    setOrderBy(e.target.value)
  }


  return (
    <>
    <Meta title='Search | The Proof of Work Cooperative' description='People Coordinating Using Costly Signals' image='https://dogefiles.twetch.app/e4d59410185b2bc440c0702a414729a961c61b573861677e2dbf39c77681e557' />
    <ThreeColumnLayout>
      <div className="col-span-12 min-h-screen lg:col-span-6">
        <div className="mb-[200px] w-full">
          <div className="mt-8">
            <div className="relative mb-4 flex">
              <SearchBar path="/twetch" />
              <select className="ml-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none focus:ring-primary-500 focus:border-primary-500 block grow p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeOrder}>
                <option value={'CREATED_AT_DESC'}>Latest</option>
                <option value={'CREATED_AT_ASC'}>Oldest</option>
                <option value={'NUM_LIKES_DESC'}>Likes</option>
              </select>
            </div>
          </div>
          <div className="mx-0 mt-5 flex px-4">
            <Link href="/search">
                <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
                Boosted Content
                </div>
            </Link>
            <Link href="/search/twetch">
                <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md bg-primary-100 px-3 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">
                Twetch
                </div>
            </Link>
            {/* <Link href="/search/slictionary">
                <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
                Definitions
                </div>
            </Link> */}
          </div>
          <div className='mt-5 w-full'>
            {hasTwetchPrivilege ? (<div className='relative'>
                <InfiniteScroll
                    dataLength={results.length}
                    hasMore={hasMore}
                    next={fetchMore}
                    loader={<div className="mt-5 sm:mt-10"><Loader /></div>}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    refreshFunction={refresh}    
                >
                    <div>
                        {results.map((post:any) => (
                            <TwetchCard key={post.transaction} {...post} difficulty={0} />
                        ))}
                    </div>
                </InfiniteScroll>
            </div>) : (
                <div className='mt-5 flex flex-col justify-center text-center'>
                    <p className='text-5xl mb-3'>😔</p>
                    <p className='text-lg italic opacity-80 px-10'>You need to own the Twetch Boost Privilege NFT to access this feature before everyone else.</p>
                    <a className='mt-5 mx-auto text-white font-semibold border-none rounded-md bg-gradient-to-tr from-primary-400 to-primary-500 cursor-pointer items-center text-center justify-center py-2 px-5 transition duration-500 transform hover:-translate-y-1' href="https://relayx.com/market/011a97bdc1868fc53342cb9bffdc3e42782a9c258fbb6597cd20effa3a4d6077_o2" target="_blank" rel="noreferrer">Buy it here</a>
                </div>
            )}

          </div>
          
        </div>
      </div>
    </ThreeColumnLayout>
    </>
  );
}

export default SearchPage;
