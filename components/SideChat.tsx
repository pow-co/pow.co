import {
 useRef, useState, useEffect, useCallback, 
} from "react";
import useWebSocket from 'react-use-websocket';
import axios from 'axios';
import { MessageItem } from "./MessageItem";
import ChatComposer from "./ChatComposer";

interface SideChatProps {
    room: string;
}

export const SideChat = ({ room: channel }: SideChatProps) => {

  const [newMessages, setNewMessages] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const [pending, setPending] = useState<any>();

  const { getWebSocket } = useWebSocket(`wss://pow.co/websockets/chat/channels/${channel}`, {

    onOpen: async () => {

    },
    onMessage: async () => {
      refreshMessages();
    },
    onClose: async () => {

    },
  });

  useEffect(() => {
    const cleanupSocket = () => {
      const socket = getWebSocket();
      if (socket) {
        socket.close();
      }
    };

    return cleanupSocket;
  }, [getWebSocket]);

  const composerRef = useRef(null);
  
  const refreshMessages = useCallback(async () => {
    axios.get(`https://www.pow.co/api/v1/chat/channels/${channel}`).then(({ data }) => {
      console.log('FETCHED MESSAGES', data);
      setMessages(data.messages);
      setPending(null);
    });
  }, [channel]);

  useEffect(() => {
    refreshMessages();
  }, [refreshMessages]);

  useEffect(() => {
    setNewMessages([]);
  }, []);

  const handleNewMessageSent = useCallback((newMessage: any) => {
    setPending(newMessage);
  }, []);

  return (
    <>
      <div className="relative flex flex-col-reverse overflow-y-auto overflow-x-hidden" style={{ height: "calc(100vh - 218px)" }}>
        {pending && (
          <div className="opacity-60">
            <MessageItem {...pending} />
          </div>
        )}
        {newMessages?.map((message: any) => <MessageItem key={message.txid} {...message} />)}
        {messages?.map((message: any) => <MessageItem key={message.txid} {...message} />)}
      </div>
      <div ref={composerRef} className="p-4">
        <ChatComposer 
          channel={channel} 
          onNewMessageSent={handleNewMessageSent} 
          onChatImported={refreshMessages}
        />
      </div>
    </>
  );
};
