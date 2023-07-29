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

const userRegex = /from:\s*(\d+)/i;

function SearchPage() {
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
    value && value.length > 0 && fetchData().then((data) => {
        console.log(data)
        setResults(data.edges.map((post: any) => post.node))
        setHasMore(data.pageInfo.hasNextPage)
        setCursor(data.pageInfo.endCursor)
    })
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
              <select onChange={handleChangeOrder}>
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
            <Link href="/search/slictionary">
                <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
                Definitions
                </div>
            </Link>
          </div>
          <div className='mt-5 w-full'>
            <div className='relative'>
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
            </div>

          </div>
          
        </div>
      </div>
    </ThreeColumnLayout>
    </>
  );
}

export default SearchPage;
