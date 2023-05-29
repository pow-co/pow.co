import axios from 'axios'
import moment from 'moment';
import React, { useState, useEffect } from 'react'

const Markdown = require('react-remarkable');

const RemarkableOptions = {
    breaks: true,
    html: true,
    typographer: true,
    /* highlight: function (str: any, lang: any) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }
  
        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}
  
        return ''; // use external default escaping
      } */
};

const BTCNewsCard = (props:any) => {
    const { id } = props
    const [loading, setLoading] = useState(true)
    const [newsData, setNewsData] = useState<any>()
    const [linkUnfurl, setLinkUnfurl] = useState<any>()

    useEffect(() => {
        getData().then((data)=>{
            setNewsData(data)
            setLoading(false)
        })
    },[])

    const getData = async () => {
        let resp = await axios.get(`https://inscribe.news/api/data/${id}`)
        return resp.data

    }

    if (loading) {
        return (
            <div className='mt-0.5 p-4 bg-primary-100 dark:bg-primary-600/20'>
                <div role="status" className="grid grid-cols-12 animate-pulse">
                    <div className='col-span-1'>
                        <div className='h-8 w-8 justify-start bg-gray-300 rounded-full dark:bg-gray-700'/>
                    </div>
                    <div className="w-full col-span-11 ml-3 md:ml-6">
                        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[380px] mb-2.5"></div>
                        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[380px] mb-2.5"></div>
                        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[370px] mb-2.5"></div>
                        <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[330px]"></div>
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

  return (
    <div className='mt-0.5 grid grid-cols bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 first:md:rounded-t-lg last:md:rounded-b-lg'>
        <div className='col-span-12 max-w-screen mb-0.5 grid grid-cols-12 items-start px-4 pt-4'>
            <div className='col-span-1'></div>
            <div className='col-span-11'>
                <div className='flex'>
                    <p className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap font-bold text-gray-900 hover:underline dark:text-white">{newsData.author}</p>
                    <div className='grow'/>
                    <a 
                        onClick={(e:any)=> e.stopPropagation()}
                        target='_blank'
                        rel="noreferrer"
                        href={`https://mempool.space/tx/${newsData.id}`}
                        className="whitespace-nowrap text-xs leading-5 text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-500"
                    >
                        {moment(newsData.timestamp).fromNow()}
                    </a>
                </div>
                <p className='text-lg font-bold'>{newsData.title}</p>
                <article className='prose break-words dark:prose-invert prose-a:text-primary-500'>
                    <Markdown options={RemarkableOptions} source={newsData.body}/>
                </article>
                {newsData.url && <p>{newsData.url}</p>}
            </div>
        </div>
    </div>
  )
}

export default BTCNewsCard