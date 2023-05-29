import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ThreeColumnLayout from '../components/ThreeColumnLayout'
import { useAPI } from '../hooks/useAPI'
import Loader from '../components/Loader'
import BTCNewsCard from '../components/BTCNewsCard'
import axios from 'axios'

export default function BtcNewsPage() {
  const [loading, setLoading] = useState(true)
  const [news,setNews] = useState<any[]>([])

  useEffect(() => {
    axios.get("https://inscribe.news/api/data/ord-news").then((resp) => {
      setNews(resp.data.keys)
      setLoading(false)
    })
  },[])
  
  
  return (
    <ThreeColumnLayout>
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
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
            Twetch
          </div>
        </Link>
        <Link href="/1btcnews">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md bg-primary-100 px-3 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">
            1BTC.news
          </div>
        </Link>
      </div>
      <div className='col-span min-h-screen lg:col-span-6'>
        <div className='flex flex-col-reverse mb-[200px] mt-5 lg:mt-10'>
          {loading ? <Loader /> : (
            <>
              {news?.map((item: any) => (
                <BTCNewsCard key={item.metadata.id} {...item.metadata}/>
              ))}
            </>
          )}
        </div>
      </div>
    </ThreeColumnLayout>
  )
}

