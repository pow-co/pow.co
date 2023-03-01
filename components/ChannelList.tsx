import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState} from 'react'
import useSWR, { Fetcher} from "swr";
import UserIcon from './UserIcon';

const fetcher = (url: string) => fetch(url).then((res) => res.json());



const ChannelList = () => {
    const router = useRouter()

    const ChannelItem = (props:any) => {
        const navigate = (e:any) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/chat/${props.channel}`)
        }
        return (
            <div onClick={navigate} className={`cursor-pointer grid grid-cols-12 items-center py-1 ${props.selected ? "bg-blue-100" : "bg-primary-100"} ${props.selected ? "dark:bg-blue-600/20" : "dark:bg-primary-600/20"} hover:bg-primary-200 hover:dark:bg-primary-900/20`}>
                <div className='col-span-2 flex justify-center'>
                    {/* <UserIcon src={`https://a.relayx.com/u/${props.creator}`} size={36}/> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                    </svg>
                </div>
                <div className='col-span-8'>
                    <h2 className='text-lg truncate font-semibold'>{props.channel}</h2>
                    <p className='truncate'>{props.last_message}</p>
                </div>
                <p className='col-span-2 text-xs text-center'>{moment(props.last_message_time * 1000).fromNow()}</p>
            </div>
        )
    }
    const query = router.query

    const queryChannels = {
        v: 3,
        q: {
          aggregate: [
            {
              $match: {
                "MAP.type": "message",
                "MAP.channel": { $not: { $regex: "^\\s*$|^$|_enc$" } },
              },
            },
            {
              $sort: { "blk.t": 1 },
            },
            {
              $group: {
                _id: { $toLower: "$MAP.channel" },
                channel: { $first: { $toLower: "$MAP.channel" } },
                creator: { $first: "$MAP.paymail" },
                last_message: { $last: "$B.content" },
                last_message_time: { $last: "$timestamp" },
                messages: { $sum: 1 },
              },
            },
          ],
          sort: { last_message_time: -1 },
          limit: 100,
        },
      };
      const queryChannelsB64 = btoa(JSON.stringify(queryChannels));
      const { data, error, isLoading } = useSWR(`https://b.map.sv/q/${queryChannelsB64}`, fetcher)

      const channels = data?.c || []
  return (
    <div className='flex flex-col  overflow-hidden'>
        <div className='sticky w-full z-10 flex p-4 bg-primary-300 dark:bg-primary-800/20'>
          <div className="text-sm leading-4 py-2 px-3 text-gray-900 dark:text-white bg-primary-100 dark:bg-primary-600/20 font-medium mr-2 cursor-pointer rounded-md whitespace-nowrap">
            Channels
          </div>
          <div className="text-sm leading-4 py-2 px-3 text-gray-700 dark:text-gray-300 font-normal mr-2 cursor-pointer rounded-md whitespace-nowrap">
            Direct Messages
          </div>
        </div>
        <div id="scrollable" className='relative overflow-y-auto' style={{height:"calc(100vh - 128px)"}}>
            {channels.map((channel: any)=> {
                return <ChannelItem key={channel._id} {...channel} selected={query.channelId === channel._id}/>
            })}
        </div>
    </div>
  )
}

export default ChannelList