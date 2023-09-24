'use client'

import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from './Loader'
import { useAPI } from '../hooks/v13_useAPI'
import BoostContentCardV2 from './v13_BoostContentCardV2'

interface UserLatestFeedProps {
    userId: string;
}

const UserLatestFeed = ({userId}:UserLatestFeedProps) => {
    const [cursor, setCursor] = useState<number>(10)
    const [hasMore, setHasMore] = useState<boolean>(true)
    const postsPerSlice = 10
    const { data, error, loading } = useAPI(`/authors/${userId}/contents`, '')

    const { contents } = data || []

    const fetchMore = () => {
        setCursor(cursor + postsPerSlice)
    }

    const refresh = () => {

        setCursor(postsPerSlice)
    }
  return (
    <div className="w-full">
        <div className="relative">
            <InfiniteScroll
            dataLength={cursor}
            hasMore={hasMore}
            next={fetchMore}
            loader={<div className='mt-5 sm:mt-10'>
                <Loader />
                </div>}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            refreshFunction={refresh}
            >
                <div>
                    {contents?.map((content:any) => (
                        <BoostContentCardV2 key={content.txid} content_txid={content.txid}/>
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    </div>
  )
}

export default UserLatestFeed