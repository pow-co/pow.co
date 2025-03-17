import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useSWR from "swr";
import axios from 'axios';

interface ChannelListProps {
  currentChannel?: string;
}

const ChannelList = ({ currentChannel }: ChannelListProps) => {
    const router = useRouter();

    const { data: channels, mutate } = useSWR(`https://www.pow.co/api/v1/chat/channels`, async (url: string) => {
      const result = await axios.get(url);
      return result.data.channels;
    });

    useEffect(() => {
      const interval = setInterval(() => {
        mutate();
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }, [mutate]);

    if (!channels) { return null; }

    const ChannelItem = (props: {
      channel: string;
      lastMessageBmap: any;
      lastMessageTimestamp: Date;
      selected?: boolean;
    }) => {
        const {
 channel, lastMessageBmap, lastMessageTimestamp, selected, 
} = props;
        const navigate = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/chat/${channel}`);
        };
        if (!channel) {
          return null;
        } 
          return (
              <div onClick={navigate} className={`grid cursor-pointer grid-cols-12 items-center py-1 ${selected ? "bg-primary-200" : "bg-primary-100"} ${selected ? "dark:bg-primary-600/50" : "dark:bg-primary-600/20"} hover:bg-primary-200 hover:dark:bg-primary-900/20`}>
                  <div className="col-span-2 flex justify-center">
                      {/* <UserIcon src={`https://a.relayx.com/u/${creator}`} size={36}/> */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                      </svg>
                  </div>
                  <div className="col-span-8">
                      <h2 className="truncate text-lg font-semibold">{channel}</h2>
                      <p className="truncate">{lastMessageBmap.B[0].content}</p>
                  </div>
                  <p className="col-span-2 text-center text-xs">{moment(lastMessageTimestamp).fromNow()}</p>
              </div>
        );
        
    };
      
  return (
    <div className="flex flex-col  overflow-hidden">
        <div className="sticky z-10 flex w-full bg-primary-300 p-4 dark:bg-primary-800/20">
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md bg-primary-100 px-3 py-2 text-sm font-medium leading-4 text-gray-900 dark:bg-primary-600/20 dark:text-white">
            Channels
          </div>
          <div className="mr-2 cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-sm font-normal leading-4 text-gray-700 dark:text-gray-300">
            Direct Messages
          </div>
        </div>
        <div id="scrollable" className="relative overflow-y-auto" style={{ height: "calc(100vh - 128px)" }}>
            {channels.map((channel: any) => (
<ChannelItem 
  key={channel.channel} 
  channel={channel.channel} 
  lastMessageBmap={channel.last_message_bmap} 
  lastMessageTimestamp={channel.last_message_timestamp} 
  selected={currentChannel === channel.channel}
/>
))}
        </div>
    </div>
  );
};

export default ChannelList;
