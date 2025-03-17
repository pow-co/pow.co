import React, {
 useEffect, useRef, useState, useCallback, 
} from 'react';
import { useRouter } from 'next/router';
import useWebSocket from 'react-use-websocket';
import axios from 'axios';
import Header from '../../components/Header';
import ChannelList from '../../components/ChannelList';
import ChatComposer from '../../components/ChatComposer';
import { MessageItem } from '../../components/MessageItem';

const Chat = () => {
  const router = useRouter();
  const { query } = router;
  const channel = query.channel?.toString();
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [pending, setPending] = useState<any>();

  const { getWebSocket } = useWebSocket(`wss://pow.co/websockets/chat/channels/${channel}`, {
    onOpen: async () => {
      // Handle open connection
    },
    onMessage: async () => {
      refreshMessages();
    },
    onClose: async () => {
      // Handle close connection
    },
  });

  useEffect(() => {
    const socket = getWebSocket();
    return function cleanup() {
      if (socket) {
        socket.close();
      }
    };
  }, [getWebSocket]);

  const composerRef = useRef(null);
  
  const refreshMessages = useCallback(async () => {
    axios.get(`https://www.pow.co/api/v1/chat/channels/${channel}`).then(({ data }) => {
      setMessages(data.messages);
      setPending(null);
    });
  }, [channel]);

  useEffect(() => {
    refreshMessages();
  }, [channel, refreshMessages]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Check initial screen size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewMessageSent = useCallback((newMessage: any) => {
    setPending(newMessage);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-primary-300 dark:bg-primary-700/20">
      <div className={`${query.channel && "hidden sm:block"}`}>
        <Header />
        <div className="h-16" />
      </div>
      <div className="grid h-full grid-cols-12 overflow-hidden">
        <div className={`${query.channel ? "hidden sm:col-span-4 sm:block" : "col-span-12"}  bg-primary-100 dark:bg-primary-900/20`}>
          <ChannelList currentChannel={query.channel?.toString()} />
        </div>
        <div className={`${query.channel ? "col-span-12 sm:col-span-8" : "hidden"} bg-primary-300 dark:bg-primary-700/20`}>
          <div className="sticky z-10  flex h-16 w-full items-center bg-primary-300 p-4 dark:bg-primary-800/20">
            <svg
              onClick={() => router.back()}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 block h-6 w-6 cursor-pointer stroke-gray-700 hover:opacity-70 dark:stroke-gray-300 sm:hidden"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
            </svg>
            <h2 className="ml-2 text-2xl font-bold">{channel}</h2>
          </div>
          <div className="relative flex flex-col-reverse overflow-y-auto overflow-x-hidden" style={{ height: isMobile ? "calc(100vh - 148px)" : "calc(100vh - 218px)" }}>
            {pending && <div className="opacity-60"><MessageItem {...pending} /></div>}
            {messages?.map((message: any) => (
              <MessageItem key={message.txid} {...message} />
            ))}
          </div>
          <div ref={composerRef} className="sticky px-4">
            <ChatComposer 
              channel={channel!} 
              onNewMessageSent={handleNewMessageSent} 
              onChatImported={refreshMessages} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
